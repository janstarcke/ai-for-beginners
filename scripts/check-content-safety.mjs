#!/usr/bin/env node
// ============================================================
// Content-Safety-Gate (Audit 2026-06-11, Finding AFB-1)
// ------------------------------------------------------------
// Die import-content-Pipeline beschafft Inhalte aus externen Quellen. Die
// einzigen Strings, die ein Anfänger am Ende per Copy-Button in ein echtes
// Terminal einfügt, sind die ausführbaren Felder:
//   - GuideStep.command       (client/src/data/guide.ts)
//   - Skill.installCommand    (client/src/data/skills.ts)
// Dieses Gate parst NUR diese Felder (per TS-AST, nicht per Grep über Prosa,
// damit Warntexte wie "KEIN curl | sh" keinen Fehlalarm auslösen) und bricht
// den Build, wenn ein Wert ein hochsignifikantes Shell-Angriffsmuster enthält.
//
// Es ersetzt KEIN menschliches Review — die Branch-Protection (PR-Pflicht) ist
// die primäre Schicht; dieses Gate ist die zweite, automatische Reißleine.
// ============================================================
import ts from "typescript";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Felder, deren String-Werte als Copy-Paste-Befehl gerendert werden.
const EXECUTABLE_FIELDS = new Set(["command", "installCommand"]);

const TARGETS = [
  "client/src/data/guide.ts",
  "client/src/data/skills.ts",
];

// Hochsignifikante Angriffsmuster. Bewusst eng gefasst (echte Payloads, keine
// Erwähnungen), damit der bestehende, geprüfte Content sauber durchläuft.
const DENY = [
  { id: "remote-pipe-to-shell", re: /\b(curl|wget|fetch)\b[^\n|]*\|\s*(sudo\s+)?(ba|z|k|c)?sh\b/i,
    why: "Remote-Skript direkt in die Shell gepiped (curl … | sh)" },
  { id: "remote-pipe-to-interp", re: /\b(curl|wget)\b[^\n|]*\|\s*(sudo\s+)?(python3?|node|perl|ruby|php)\b/i,
    why: "Remote-Skript direkt in einen Interpreter gepiped" },
  { id: "base64-pipe-to-shell", re: /\bbase64\b[^\n|]*(-d|--decode)[^\n|]*\|\s*(ba|z)?sh\b/i,
    why: "base64-dekodierter Blob in die Shell gepiped" },
  { id: "rm-rf-dangerous", re: /\brm\s+-[a-z]*r[a-z]*f?\b\s+(\/(?!\w)|~|\$HOME|\*|\.\s*$)/i,
    why: "rm -rf auf gefährliches Ziel (/, ~, $HOME, *, .)" },
  { id: "sudo", re: /(^|\s|&&|;|\|)\s*sudo\s+\S/i,
    why: "sudo in einem Copy-Paste-Befehl (Konvention verbietet das in diesen Feldern)" },
  { id: "fork-bomb", re: /:\s*\(\s*\)\s*\{[^}]*\|\s*:/,
    why: "Fork-Bomb" },
  { id: "chmod-777", re: /\bchmod\s+(-[a-zR]+\s+)?(0?777|a\+rwx)\b/i,
    why: "chmod 777 (welt-schreibbar)" },
  { id: "reverse-shell", re: /\b(nc|ncat|netcat)\b[^\n]*-e\b|\b(ba|z)?sh\s+-i\b[^\n]*\/dev\/tcp/i,
    why: "Reverse-Shell (nc -e / bash -i /dev/tcp)" },
  { id: "disk-overwrite", re: /\b(dd|tee)\b[^\n]*\bof=\s*\/dev\/(sd|nvme|disk)|>\s*\/dev\/(sd|nvme)/i,
    why: "Direkter Schreibzugriff auf ein Block-Device" },
  { id: "cred-exfil", re: /\b(curl|wget|nc)\b[^\n]*(\.ssh\/|id_rsa|\.aws\/|\.npmrc|\.env\b|id_ed25519)/i,
    why: "Mögliche Exfiltration von Credentials (.ssh/.aws/.env/Keys)" },
  { id: "eval-remote", re: /\beval\s+["'`]?\$\((\s*(curl|wget))/i,
    why: "eval über remote geladenen Inhalt" },
];

/** Sammelt {field,value,line} für alle EXECUTABLE_FIELDS aus einer TS-Datei. */
function collect(relPath) {
  const abs = join(ROOT, relPath);
  const src = readFileSync(abs, "utf8");
  const sf = ts.createSourceFile(relPath, src, ts.ScriptTarget.Latest, true);
  const out = [];
  const visit = (node) => {
    if (ts.isPropertyAssignment(node) && node.name) {
      const key = node.name.getText(sf).replace(/['"]/g, "");
      if (EXECUTABLE_FIELDS.has(key)) {
        const init = node.initializer;
        let text = null;
        if (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) {
          text = init.text;
        } else if (ts.isTemplateExpression(init)) {
          // Template mit ${…}: rohen Quelltext nehmen, damit nichts entgeht.
          text = init.getText(sf);
        }
        if (text != null) {
          const { line } = sf.getLineAndCharacterOfPosition(init.getStart(sf));
          out.push({ field: key, value: text, line: line + 1 });
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

const findings = [];
let scanned = 0;
for (const rel of TARGETS) {
  let entries;
  try {
    entries = collect(rel);
  } catch (e) {
    console.error(`[content-safety] FEHLER beim Parsen von ${rel}: ${e.message}`);
    process.exit(2);
  }
  for (const { field, value, line } of entries) {
    scanned++;
    for (const rule of DENY) {
      if (rule.re.test(value)) {
        findings.push({ rel, line, field, ruleId: rule.id, why: rule.why,
          snippet: value.replace(/\n/g, "\\n").slice(0, 120) });
      }
    }
  }
}

if (findings.length === 0) {
  console.log(`[content-safety] OK — ${scanned} ausführbare Felder geprüft, keine gefährlichen Muster.`);
  process.exit(0);
}

console.error(`\n[content-safety] ⛔ ${findings.length} gefährliche(s) Muster in Copy-Paste-Befehlen:\n`);
for (const f of findings) {
  console.error(`  ${f.rel}:${f.line}  (${f.field})`);
  console.error(`    Regel : ${f.ruleId} — ${f.why}`);
  console.error(`    Wert  : "${f.snippet}"\n`);
}
console.error("Wenn das ein bewusster, sicherer Befehl ist: Muster in scripts/check-content-safety.mjs");
console.error("schärfen oder den Befehl umformulieren. Niemals blind whitelisten.\n");
process.exit(1);
