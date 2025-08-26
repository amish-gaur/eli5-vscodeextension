import * as vscode from 'vscode';
import { ELI5ViewProvider } from './panel/ELI5ViewProvider';
import { getSelection } from './utils/getSelection';
import { getConfig } from './utils/getConfig';
import { ollamaProvider } from './providers/ollamaProvider';
import { openaiCompatibleProvider } from './providers/openaiCompatibleProvider';
import { logger } from './utils/logger';

let lastExplanation = '';

export async function explainSelection(viewProvider: ELI5ViewProvider) {
    await explainCode(viewProvider, true);
}

export async function explainFile(viewProvider: ELI5ViewProvider) {
    await explainCode(viewProvider, false);
}

export async function copyLastExplanation() {
    if (lastExplanation) {
        await vscode.env.clipboard.writeText(lastExplanation);
        vscode.window.showInformationMessage('Explanation copied to clipboard!');
    } else {
        vscode.window.showWarningMessage('No explanation to copy. Run an explanation first.');
    }
}

export async function setupApiKey() {
    vscode.commands.executeCommand('workbench.action.openSettings', 'eli5.apiKey');
    vscode.window.showInformationMessage('Please enter your API key in the settings. You can get one from OpenAI, Anthropic, or other providers.');
}

export async function setupOllama() {
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
    
    const choice = await vscode.window.showInformationMessage(
        `Install Ollama for ${osName} (4.4GB model download):`,
        `Download for ${osName}`,
        `Copy ${installMethod} command`,
        'Cancel'
    );
    
    if (choice === `Download for ${osName}`) {
        vscode.env.openExternal(vscode.Uri.parse(downloadUrl));
        vscode.window.showInformationMessage(`Download page opened! After installing Ollama, run "ollama pull mistral:7b" to download the 4.4GB model.`);
    } else if (choice === `Copy ${installMethod} command`) {
        await vscode.env.clipboard.writeText(installCommand);
        vscode.window.showInformationMessage(`${installMethod} command copied! After installing, run "ollama pull mistral:7b" to download the 4.4GB model.`);
    }
}

async function explainCode(viewProvider: ELI5ViewProvider, selectionOnly: boolean) {
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.text = 'ELI5: Generating...';
    statusBar.show();

    try {
        const { text, languageId } = await getSelection(selectionOnly);
        
        if (!text.trim()) {
            throw new Error('No code selected or file is empty');
        }

        const config = getConfig();
        const prompt = `${config.systemPrompt}\n\n<LANGUAGE>: ${languageId}\n\n<CODE>:\n${text}`;
        
        logger.debug(`Sending request to ${config.provider} at ${config.endpoint}`);
        
        let response: string;
        if (config.provider === 'ollama') {
            response = await ollamaProvider.generate(prompt, config.model, config.endpoint, config.timeoutMs);
        } else {
            response = await openaiCompatibleProvider.generate(prompt, config.model, config.endpoint, config.timeoutMs, config.apiKey);
        }
        
        lastExplanation = response;
        viewProvider.postMessage({ type: 'result', text: response });
        
        statusBar.text = 'ELI5: Ready';
        statusBar.dispose();
        
    } catch (error) {
        logger.error('Error explaining code:', error);
        
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