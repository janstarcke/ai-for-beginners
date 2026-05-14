# syntax=docker/dockerfile:1.7
# Multi-Stage Build für ai-for-beginners.starcke.io
# Audit-Item #9 (post-Block-A 2026-05-13): HEALTHCHECK ergänzt + Digest-Pin (Sprint K).
# nginx-unprivileged-Switch braucht Coolify-Port-Wechsel — separater PR.
#
# Digest-Pinning protects against supply-chain tag-replacement attacks. Manual
# refresh-procedure:
#   curl -s "https://hub.docker.com/v2/repositories/library/node/tags/22-slim"   | jq -r .digest
#   curl -s "https://hub.docker.com/v2/repositories/library/nginx/tags/alpine"   | jq -r .digest
# Pflege-Empfehlung: monatlich, oder bei jedem Coolify-Redeploy.

# --- Build-Stage ---------------------------------------------------------
# node:22-slim (Jod LTS, Supported bis April 2027). Digest pinned 2026-05-14.
FROM node:22-slim@sha256:689c11043dad91472750cd824c97dd5e2318e9dd6f954e492fe7af0135d33ceb AS builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# --- Runtime-Stage -------------------------------------------------------
# nginx:alpine. Digest pinned 2026-05-14.
FROM nginx:alpine@sha256:feb6f75a08aa55b44576f98c15b8859819ecf54f3e4d2157f42c2d01cb58a3d2
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

# --- Followup-Items (#9-Reste, vertagt) ----------------------------------
# Folgendes wuerde das Image weiter haerten, braucht aber Coolify-side
# changes und ist daher als separate PR/Session-Task dokumentiert:
#
# 1) nginx-unprivileged (separater PR mit Coolify-Port-Wechsel als Pre-Step):
#    FROM nginxinc/nginx-unprivileged:alpine@sha256:<hash>
#    + EXPOSE 8080
#    + Coolify-Container-Port-Setting: 80 -> 8080 BEFORE deploy
#    + HEALTHCHECK URL bleibt http://localhost/ (port 8080 ist intern bound)
#    Vorteil: master + worker laufen beide als non-root user (UID 101).
#    Risk: ohne Coolify-Port-Switch geht Production offline beim Deploy.
#
# 2) Builder-Stage USER node: WORKDIR muss vorher chown'ed werden.
#    Geringer Sicherheits-Gain weil Builder nach Build weggeworfen wird.
