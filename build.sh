#!/bin/bash

# ELI5 VS Code Extension Build Script
echo "🔨 Building ELI5 VS Code Extension..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Compile TypeScript
echo "⚙️ Compiling TypeScript..."
npm run compile

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "To test the extension:"
    echo "1. Open this folder in VS Code"
    echo "2. Press F5 to launch the Extension Development Host"
    echo "3. Open a file with code and test the commands"
    echo ""
    echo "To package the extension:"
    echo "1. Install vsce: npm install -g vsce"
    echo "2. Run: vsce package"
else
    echo "❌ Build failed!"
    exit 1
fi
