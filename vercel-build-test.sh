#!/bin/bash
echo "=== Vercel Build Diagnostic ==="
echo "Current directory: $(pwd)"
echo ""
echo "=== Files in current directory ==="
ls -la
echo ""
echo "=== Checking for package.json ==="
if [ -f "package.json" ]; then
  echo "✅ package.json found"
  cat package.json | grep -A 3 '"scripts"'
else
  echo "❌ package.json NOT found"
fi
echo ""
echo "=== Checking for node_modules ==="
if [ -d "node_modules" ]; then
  echo "✅ node_modules exists"
else
  echo "❌ node_modules NOT found"
fi
echo ""
echo "=== Running build ==="
npm run build
echo ""
echo "=== Checking for build output ==="
if [ -d "build" ]; then
  echo "✅ build directory found"
  ls -la build/
else
  echo "❌ build directory NOT found"
fi
if [ -d "src/build" ]; then
  echo "⚠️ src/build directory found (wrong location)"
  ls -la src/build/
fi
