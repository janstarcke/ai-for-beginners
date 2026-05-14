# syntax=docker/dockerfile:1.7
# Multi-Stage Build für ai-for-beginners.starcke.io
# Audit-Item #9 (post-Block-A 2026-05-13): HEALTHCHECK ergänzt. Weitere
# Härtung (nginx-unprivileged user + Digest-Pin) als Followup dokumentiert
# am Ende der Datei — bedingt Coolify-Side-Changes (Port-Wechsel 80→8080).

# --- Build-Stage ---------------------------------------------------------
FROM node:22-slim AS builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# --- Runtime-Stage -------------------------------------------------------
FROM nginx:alpine
LABEL org.opencontainers.image.title="ai-for-beginners" \
      org.opencontainers.image.description="Wissensdatenbank für Claude Code & Vibe Coding" \
      org.opencontainers.image.source="https://github.com/janstarcke/ai-for-beginners"

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Audit Finding #9 Sub-Item HEALTHCHECK: alle 30s pruefen ob nginx erreichbar
# ist. Coolify kann das in der UI zusaetzlich anzeigen. busybox-wget ist im
# nginx:alpine Image vorhanden, daher kein curl-Install noetig.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

# --- Followup-Items (#9, vertagt) ----------------------------------------
# Folgendes wuerde das Image weiter haerten, braucht aber Coolify-side
# changes und ist daher als separate PR/Session-Task dokumentiert:
#
# 1) nginx-unprivileged: FROM nginxinc/nginx-unprivileged:alpine + EXPOSE 8080
#    Coolify-Container-Port-Setting muss von 80 -> 8080 umgestellt werden.
#    Vorteil: master + worker laufen beide als non-root user.
#
# 2) Digest-Pin: FROM node:22-slim@sha256:<hash> AS builder
#    FROM nginx:alpine@sha256:<hash>
#    Vorteil: 100% reproducible builds, Schutz gegen Supply-Chain-Tag-
#    Replacement. Nachteil: manuelle Pflege bei Patch-Updates.
#
# 3) Builder-Stage USER node: WORKDIR muss vorher chown'ed werden.
#    Geringer Sicherheits-Gain weil Builder nach Build weggeworfen wird.
