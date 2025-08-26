ELI5 – Explain Code Like I’m 5
A VS Code extension that takes your selected code and returns a plain-English explanation in a side panel, using Ollama local AI models (no API keys, no cloud required).

✨ Features
🤖 Local AI only: Uses Ollama with local models (no data leaves your machine)
🎯 Smart Selection: Explain selected code or entire files
📋 Copy to Clipboard: One-click copying of explanations
🎨 Side Panel UI: Clean, modern panel that matches VS Code’s theme
🚀 Quick Start
1. Install Ollama
Download and install Ollama from 👉 ollama.com/download.

2. Pull a Model
ollama pull mistral
3. Install the Extension
Open VS Code
Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
Search for ELI5
Install the extension
4. Use ELI5
Select code in your editor → Right-click → Explain Selection (ELI5)
Or run from Command Palette: ELI5: Explain Selection
🎛️ Commands
ELI5: Explain Selection – Explain selected code
ELI5: Explain File – Explain the entire active file
ELI5: Copy Last Explanation – Copy the last explanation to clipboard
⚙️ Settings
ELI5 is fully local, but you can adjust settings in VS Code:

{
  "eli5.model": "mistral",
  "eli5.systemPrompt": "Explain the selected code in plain English for a beginner...",
  "eli5.maxTokens": 500,
  "eli5.timeoutMs": 20000,
  "eli5.maxLines": 800,
  "eli5.debug": false
}
Key Settings
eli5.model → Ollama model to use (e.g. "mistral", "codellama")
eli5.systemPrompt → Custom system prompt for explanations
eli5.maxTokens → Maximum response size
eli5.timeoutMs → Timeout in ms (default 20s)
eli5.maxLines → Max lines of code to explain
eli5.debug → Enable debug logging
🛠️ Troubleshooting
"Model endpoint not found"
Make sure Ollama is running (ollama serve)
Check your pulled models with ollama list
"No response received"
Ensure you pulled the model:
ollama pull mistral
Double-check your settings in VS Code
Slow responses
Use a smaller model (e.g. mistral:7b)
Increase timeout in settings
Check system resources
🔒 Security
All code stays on your machine
No API keys, no cloud services, no telemetry
👩‍💻 Development
Clone and build from source:

git clone https://github.com/amish-gaur/eli5-vscodeextension.git
cd eli5-vscodeextension
npm install
npm run compile
Run in VS Code dev host:

Press F5 in VS Code to launch
Test with any file and selection
🤝 Contributing
Contributions welcome!

Fork the repo
Create a feature branch
Submit a PR 🚀
📜 License
MIT License – see LICENSE for details

Made with ❤️ to help developers learn and debug code faster.