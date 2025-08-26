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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const ELI5ViewProvider_1 = require("./panel/ELI5ViewProvider");
const commands_1 = require("./commands");
const logger_1 = require("./utils/logger");
function activate(context) {
    logger_1.logger.info('ELI5 extension is now active!');
    const viewProvider = new ELI5ViewProvider_1.ELI5ViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('eli5.view', viewProvider));
    context.subscriptions.push(vscode.commands.registerCommand('eli5.explainSelection', () => (0, commands_1.explainSelection)(viewProvider)), vscode.commands.registerCommand('eli5.explainFile', () => (0, commands_1.explainFile)(viewProvider)), vscode.commands.registerCommand('eli5.copyLastExplanation', commands_1.copyLastExplanation), vscode.commands.registerCommand('eli5.setupApiKey', commands_1.setupApiKey), vscode.commands.registerCommand('eli5.setupOllama', commands_1.setupOllama));
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = 'ELI5: Ready';
    statusBarItem.tooltip = 'ELI5 - Explain Code Like I\'m 5';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
    showWelcomeDialog(context);
}
exports.activate = activate;
async function showWelcomeDialog(context) {
    const hasShownWelcome = context.globalState.get('eli5.hasShownWelcome', false);
    if (!hasShownWelcome) {
        context.globalState.update('eli5.hasShownWelcome', true);
        const config = vscode.workspace.getConfiguration('eli5');
        const apiKey = config.get('apiKey', '');
        if (!apiKey) {
            const choice = await vscode.window.showInformationMessage('🤖 Welcome to ELI5! Would you like to install Ollama for free local AI?', 'Yes, Install Ollama', 'No, Skip for now');
            if (choice === 'Yes, Install Ollama') {
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
                const installChoice = await vscode.window.showInformationMessage(`Install Ollama for ${osName} (4.4GB model download):`, `Download for ${osName}`, `Copy ${installMethod} command`, 'Cancel');
                if (installChoice === `Download for ${osName}`) {
                    vscode.env.openExternal(vscode.Uri.parse(downloadUrl));
                    vscode.window.showInformationMessage(`Download page opened! After installing Ollama, run "ollama pull mistral:7b" to download the 4.4GB model.`);
                }
                else if (installChoice === `Copy ${installMethod} command`) {
                    await vscode.env.clipboard.writeText(installCommand);
                    vscode.window.showInformationMessage(`${installMethod} command copied! After installing, run "ollama pull mistral:7b" to download the 4.4GB model.`);
                }
            }
        }
    }
}
function deactivate() {
    logger_1.logger.info('ELI5 extension deactivated');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map