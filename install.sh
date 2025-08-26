#!/bin/bash

# ELI5 VS Code Extension Installation Script
echo "🤖 ELI5 VS Code Extension Setup"
echo "================================"

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama is not installed."
    echo "Installing Ollama..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        curl -fsSL https://ollama.ai/install.sh | sh
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://ollama.ai/install.sh | sh
    else
        echo "❌ Unsupported operating system: $OSTYPE"
        echo "Please install Ollama manually from https://ollama.ai/download"
        exit 1
    fi
else
    echo "✅ Ollama is already installed"
fi

# Start Ollama if not running
if ! pgrep -x "ollama" > /dev/null; then
    echo "🚀 Starting Ollama..."
    ollama serve &
    sleep 3
else
    echo "✅ Ollama is already running"
fi

# Pull recommended model
echo "📥 Pulling Mistral model (recommended for code explanation)..."
ollama pull mistral

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Install the ELI5 extension in VS Code"
echo "2. Open a file with code"
echo "3. Select some code and right-click → 'Explain Selection (ELI5)'"
echo ""
echo "For more information, see the README.md file"
