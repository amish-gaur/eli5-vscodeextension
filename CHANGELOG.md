# Changelog

All notable changes to the ELI5 VS Code extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2024-01-XX

### Added
- Initial release of ELI5 VS Code extension
- Support for Ollama local AI models
- Support for OpenAI-compatible API endpoints
- Side panel webview for displaying explanations
- Context menu integration for code selection
- Command palette integration
- Status bar integration showing extension state
- Copy to clipboard functionality
- Configurable settings for provider, endpoint, model, and prompts
- Error handling with helpful troubleshooting actions
- Debug logging support
- File truncation for large files
- Modern, theme-aware UI design

### Features
- **Local AI Support**: Default integration with Ollama for privacy-focused code explanation
- **Smart Selection**: Explain selected code or entire files
- **Multiple Providers**: Support for both Ollama and OpenAI-compatible endpoints
- **Beautiful UI**: Clean, modern interface that adapts to VS Code themes
- **Error Recovery**: Helpful error messages with quick-fix actions
- **Performance**: Optimized for 2-5 second response times on typical hardware

### Technical Details
- Built with TypeScript and VS Code Extension API
- No external UI frameworks - pure VS Code webview
- Secure API key handling via environment variables
- Comprehensive error handling and timeout management
- Modular architecture with separate providers and utilities
