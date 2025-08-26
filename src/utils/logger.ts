import * as vscode from 'vscode';

export const logger = {
    info: (message: string, ...args: any[]) => {
        console.log(`[ELI5] ${message}`, ...args);
    },
    
    error: (message: string, ...args: any[]) => {
        console.error(`[ELI5] ERROR: ${message}`, ...args);
    },
    
    debug: (message: string, ...args: any[]) => {
        const config = vscode.workspace.getConfiguration('eli5');
        if (config.get('debug', false)) {
            console.log(`[ELI5] DEBUG: ${message}`, ...args);
        }
    }
}; 