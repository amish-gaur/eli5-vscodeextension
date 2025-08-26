# ELI5 - Explain Code Like I'm 5

A VS Code extension that takes your selected code and returns a plain-English explanation in a side panel, using local AI models by default.

## Features

- 🤖 **Local AI**: Uses Ollama with local models (no data leaves your machine)
- 🎯 **Smart Selection**: Explain selected code or entire files
- 📋 **Copy to Clipboard**: One-click copying of explanations
- ⚙️ **Configurable**: Support for different AI providers and models
- 🎨 **Beautiful UI**: Clean, modern interface that matches VS Code's theme

## Quick Start

### Option 1: Local AI (Default - Free & Private)

**Out-of-the-box experience - no setup required if you have Ollama:**

1. **Install Ollama** (if not already installed):
   - Download from [ollama.ai](https://ollama.ai/download)
   - Follow installation instructions for your platform

2. **Pull a Model**:
   ```bash
   ollama pull mistral
   ```

3. **Install the Extension**:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "ELI5"
   - Install the extension

4. **Use ELI5**:
   - Select some code in your editor
   - Right-click and choose "Explain Selection (ELI5)"
   - Or use the command palette: `ELI5: Explain Selection`

### Option 2: Cloud API (Optional - Requires API Key)

For users who prefer cloud-based AI:

1. **Get an API Key**:
   - Sign up at [OpenAI](https://platform.openai.com/) or [Anthropic](https://console.anthropic.com/)
   - Get your API key

2. **Configure the Extension**:
   - Open VS Code Settings
   - Search for "ELI5"
   - Set `eli5.apiKey` to your API key
   - Optionally set `eli5.model` (default: gpt-4o-mini)

3. **Use ELI5**:
   - The extension will automatically use your cloud provider
   - No local setup required

## Usage

### Commands

- **`ELI5: Explain Selection`** - Explain the currently selected code
- **`ELI5: Explain File`** - Explain the entire active file
- **`ELI5: Copy Last Explanation`** - Copy the last explanation to clipboard

### Context Menu

Right-click on selected code to see "Explain Selection (ELI5)" option.

### Side Panel

The ELI5 side panel shows:
- Welcome message with instructions
- Loading spinner during generation
- Formatted explanation results
- Error messages with helpful actions
- Copy and Clear buttons

## Configuration

Open VS Code settings and search for "ELI5" to configure:

```json
{
  "eli5.apiKey": "",
  "eli5.endpoint": "https://api.openai.com/v1/chat/completions",
  "eli5.model": "gpt-4o-mini",
  "eli5.systemPrompt": "Explain the selected code in plain English for a beginner...",
  "eli5.maxTokens": 500,
  "eli5.timeoutMs": 20000,
  "eli5.maxLines": 800,
  "eli5.debug": false
}
```

### Settings Explained

- **`apiKey`**: API key for cloud providers (leave empty for local Ollama)
- **`endpoint`**: API endpoint URL for cloud providers
- **`model`**: Model name for cloud providers (e.g., "gpt-4o-mini", "claude-3-sonnet")
- **`systemPrompt`**: Custom prompt for the AI
- **`maxTokens`**: Maximum response length
- **`timeoutMs`**: Request timeout in milliseconds
- **`maxLines`**: Maximum lines of code to explain
- **`debug`**: Enable debug logging

## OpenAI-Compatible Mode

For users who prefer cloud-based AI:

1. Set `eli5.provider` to `"openai-compatible"`
2. Set `eli5.endpoint` to your API endpoint (e.g., `https://api.openai.com/v1/chat/completions`)
3. Set `eli5.model` to your preferred model
4. Set the `ELI5_API_KEY` environment variable with your API key

```bash
export ELI5_API_KEY="your-api-key-here"
```

## Troubleshooting

### "Model endpoint not found"

**Problem**: Ollama is not running or not accessible.

**Solutions**:
1. Start Ollama: `ollama serve`
2. Check if Ollama is running: `ollama list`
3. Verify the endpoint in settings
4. Check firewall/network settings

### "No response received from Ollama"

**Problem**: Model not downloaded or incorrect model name.

**Solutions**:
1. Pull the model: `ollama pull mistral`
2. Check available models: `ollama list`
3. Verify model name in settings

### Slow Responses

**Solutions**:
1. Use a smaller model (e.g., `mistral:7b` instead of `mistral:13b`)
2. Increase timeout in settings
3. Check your system resources

### Large Files

**Problem**: Files with many lines may be truncated.

**Solutions**:
1. Select specific code sections instead of entire files
2. Increase `eli5.maxLines` in settings
3. Split large files into smaller modules

## Security

- **Local Mode**: When using Ollama, no code leaves your machine
- **API Keys**: For OpenAI-compatible mode, API keys are read from environment variables only
- **No Telemetry**: The extension doesn't collect or send any data

## Development

### Building from Source

```bash
git clone <repository-url>
cd eli5-vscode
npm install
npm run compile
```

### Testing

1. Press F5 in VS Code to launch extension development host
2. Open a file with code
3. Select some code and test the commands

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- **Issues**: Report bugs on GitHub
- **Questions**: Open a discussion on GitHub
- **Feature Requests**: Use GitHub issues

---

Made with ❤️ for developers who want to understand code better.
