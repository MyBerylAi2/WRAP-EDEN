#!/bin/bash
# ═══════════════════════════════════════════════════════
# Eden Dev Server — Auto Port Finder
# Beryl AI Labs · Never fight a port conflict again
# ═══════════════════════════════════════════════════════

PREFERRED_PORT=${1:-3001}
MAX_PORT=$((PREFERRED_PORT + 50))
PORT=$PREFERRED_PORT

# Kill any previous Eden dev servers (including nohup orphans)
pkill -f "next dev" 2>/dev/null
pkill -f "next-server" 2>/dev/null
for p in $(seq $PREFERRED_PORT $MAX_PORT); do
  fuser -k ${p}/tcp 2>/dev/null
done
sleep 1

while [ $PORT -le $MAX_PORT ]; do
  if ! ss -tlnp 2>/dev/null | grep -q ":${PORT} " && \
     ! lsof -i ":${PORT}" >/dev/null 2>&1; then
    break
  fi
  PORT=$((PORT + 1))
done

if [ $PORT -gt $MAX_PORT ]; then
  echo "❌ No open port found between $PREFERRED_PORT-$MAX_PORT"
  exit 1
fi

if [ $PORT -ne $PREFERRED_PORT ]; then
  echo "⚠️  Port $PREFERRED_PORT busy → using port $PORT"
fi

echo ""
echo "🔱 EDEN REALISM ENGINE — Dev Server"
echo "   http://localhost:$PORT"
echo "   Press Ctrl+C to stop"
echo ""

exec npx next dev --port $PORT
