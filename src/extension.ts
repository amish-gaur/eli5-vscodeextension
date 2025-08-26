import * as vscode from 'vscode';
import { ELI5ViewProvider } from './panel/ELI5ViewProvider';
import { explainSelection, explainFile, copyLastExplanation, setupApiKey, setupOllama } from './commands';
import { logger } from './utils/logger';

export function activate(context: vscode.ExtensionContext) {
    logger.info('ELI5 extension is now active!');

    const viewProvider = new ELI5ViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('eli5.view', viewProvider)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('eli5.explainSelection', () => explainSelection(viewProvider)),
        vscode.commands.registerCommand('eli5.explainFile', () => explainFile(viewProvider)),
        vscode.commands.registerCommand('eli5.copyLastExplanation', copyLastExplanation),
        vscode.commands.registerCommand('eli5.setupApiKey', setupApiKey),
        vscode.commands.registerCommand('eli5.setupOllama', setupOllama)
    );

    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = 'ELI5: Ready';
    statusBarItem.tooltip = 'ELI5 - Explain Code Like I\'m 5';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    showWelcomeDialog(context);
}

async function showWelcomeDialog(context: vscode.ExtensionContext) {
    const hasShownWelcome = context.globalState.get('eli5.hasShownWelcome', false);
    
    if (!hasShownWelcome) {
        context.globalState.update('eli5.hasShownWelcome', true);
        
        const config = vscode.workspace.getConfiguration('eli5');
        const apiKey = config.get('apiKey', '');
        
        if (!apiKey) {
            const choice = await vscode.window.showInformationMessage(
                '🤖 Welcome to ELI5! Would you like to install Ollama for free local AI?',
                'Yes, Install Ollama',
                'No, Skip for now'
            );
            
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
                } else if (platform === 'linux') {
                    osName = 'Linux';
                    installMethod = 'Terminal command';
                    installCommand = 'curl -fsSL https://ollama.ai/install.sh | sh';
                    downloadUrl = 'https://ollama.ai/download/linux';
                } else if (platform === 'win32') {
                    osName = 'Windows';
                    installMethod = 'Windows Package Manager';
                    installCommand = 'winget install Ollama.Ollama';
                    downloadUrl = 'https://ollama.ai/download/windows';
                } else {
                    osName = 'your system';
                    installMethod = 'manual download';
                    downloadUrl = 'https://ollama.ai/download';
                }
                
                const installChoice = await vscode.window.showInformationMessage(
                    `Install Ollama for ${osName} (4.4GB model download):`,
                    `Download for ${osName}`,
                    `Copy ${installMethod} command`,
                    'Cancel'
                );
                
                if (installChoice === `Download for ${osName}`) {
                    vscode.env.openExternal(vscode.Uri.parse(downloadUrl));
                    vscode.window.showInformationMessage(`Download page opened! After installing Ollama, run "ollama pull mistral:7b" to download the 4.4GB model.`);
                } else if (installChoice === `Copy ${installMethod} command`) {
                    await vscode.env.clipboard.writeText(installCommand);
                    vscode.window.showInformationMessage(`${installMethod} command copied! After installing, run "ollama pull mistral:7b" to download the 4.4GB model.`);
                }
            }
        }
    }
}

export function deactivate() {
    logger.info('ELI5 extension deactivated');
} 