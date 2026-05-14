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
# nginx-unprivileged: master + worker laufen als UID 101 (nginx), nicht als
# root. Audit #9-Rest. Listens on port 8080 by default (not 80) — non-root
# user can't bind to privileged ports. Digest pinned 2026-05-14.
FROM nginxinc/nginx-unprivileged:alpine@sha256:4c18337659c90a01627f2e152b7c89524521c82dcedb255dc83d3689642b0803
LABEL org.opencontainers.image.title="ai-for-beginners" \
      org.opencontainers.image.description="Wissensdatenbank für Claude Code & Vibe Coding" \
      org.opencontainers.image.source="https://github.com/janstarcke/ai-for-beginners"

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# HEALTHCHECK auf den nicht-privilegierten Port 8080 statt 80.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

EXPOSE 8080

# --- Followup-Items (#9-final, vertagt) ----------------------------------
# Builder-Stage USER node: WORKDIR muss vorher chown'ed werden.
# Geringer Sicherheits-Gain weil Builder nach Build weggeworfen wird.
