"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupOllama = exports.setupApiKey = exports.copyLastExplanation = exports.explainFile = exports.explainSelection = void 0;
const vscode = __importStar(require("vscode"));
const getSelection_1 = require("./utils/getSelection");
const getConfig_1 = require("./utils/getConfig");
const ollamaProvider_1 = require("./providers/ollamaProvider");
const openaiCompatibleProvider_1 = require("./providers/openaiCompatibleProvider");
const logger_1 = require("./utils/logger");
let lastExplanation = '';
async function explainSelection(viewProvider) {
    await explainCode(viewProvider, true);
}
exports.explainSelection = explainSelection;
async function explainFile(viewProvider) {
    await explainCode(viewProvider, false);
}
exports.explainFile = explainFile;
async function copyLastExplanation() {
    if (lastExplanation) {
        await vscode.env.clipboard.writeText(lastExplanation);
        vscode.window.showInformationMessage('Explanation copied to clipboard!');
    }
    else {
        vscode.window.showWarningMessage('No explanation to copy. Run an explanation first.');
    }
}
exports.copyLastExplanation = copyLastExplanation;
async function setupApiKey() {
    vscode.commands.executeCommand('workbench.action.openSettings', 'eli5.apiKey');
    vscode.window.showInformationMessage('Please enter your API key in the settings. You can get one from OpenAI, Anthropic, or other providers.');
}
exports.setupApiKey = setupApiKey;
async function setupOllama() {
    const platform = process.platform;
    let osName = '';
    let installMethod = '';
    let installCommand = '';
    let downloadUrl = '';
    if (platform === 'darwin') {
        osName = 'macOS';
        installMethod = 'Terminal command';
        installCommand = 'curl -fsSL https://ollama.ai/install.sh | sh';
        downloadUrl = 'https://ollama.ai/download/mac';
    }
    else if (platform === 'linux') {
        osName = 'Linux';
        installMethod = 'Terminal command';
        installCommand = 'curl -fsSL https://ollama.ai/install.sh | sh';
        downloadUrl = 'https://ollama.ai/download/linux';
    }
    else if (platform === 'win32') {
        osName = 'Windows';
        installMethod = 'Windows Package Manager';
        installCommand = 'winget install Ollama.Ollama';
        downloadUrl = 'https://ollama.ai/download/windows';
    }
    else {
        osName = 'your system';
        installMethod = 'manual download';
        downloadUrl = 'https://ollama.ai/download';
    }
    const choice = await vscode.window.showInformationMessage(`Install Ollama for ${osName} (4.4GB model download):`, `Download for ${osName}`, `Copy ${installMethod} command`, 'Cancel');
    if (choice === `Download for ${osName}`) {
        vscode.env.openExternal(vscode.Uri.parse(downloadUrl));
        vscode.window.showInformationMessage(`Download page opened! After installing Ollama, run "ollama pull mistral:7b" to download the 4.4GB model.`);
    }
    else if (choice === `Copy ${installMethod} command`) {
        await vscode.env.clipboard.writeText(installCommand);
        vscode.window.showInformationMessage(`${installMethod} command copied! After installing, run "ollama pull mistral:7b" to download the 4.4GB model.`);
    }
}
exports.setupOllama = setupOllama;
async function explainCode(viewProvider, selectionOnly) {
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.text = 'ELI5: Generating...';
    statusBar.show();
    try {
        const { text, languageId } = await (0, getSelection_1.getSelection)(selectionOnly);
        if (!text.trim()) {
            throw new Error('No code selected or file is empty');
        }
        const config = (0, getConfig_1.getConfig)();
        const prompt = `${config.systemPrompt}\n\n<LANGUAGE>: ${languageId}\n\n<CODE>:\n${text}`;
        logger_1.logger.debug(`Sending request to ${config.provider} at ${config.endpoint}`);
        let response;
        if (config.provider === 'ollama') {
            response = await ollamaProvider_1.ollamaProvider.generate(prompt, config.model, config.endpoint, config.timeoutMs);
        }
        else {
            response = await openaiCompatibleProvider_1.openaiCompatibleProvider.generate(prompt, config.model, config.endpoint, config.timeoutMs, config.apiKey);
        }
        lastExplanation = response;
        viewProvider.postMessage({ type: 'result', text: response });
        statusBar.text = 'ELI5: Ready';
        statusBar.dispose();
    }
    catch (error) {
        logger_1.logger.error('Error explaining code:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        viewProvider.postMessage({
            type: 'error',
            text: `Failed to explain code: ${errorMessage}`
        });
        statusBar.text = 'ELI5: Error';
        statusBar.dispose();
        vscode.window.showErrorMessage(`ELI5 Error: ${errorMessage}`);
    }
}
//# sourceMappingURL=commands.js.map