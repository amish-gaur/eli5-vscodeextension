import * as vscode from 'vscode';

export interface ELI5Config {
    provider: 'ollama' | 'openai-compatible';
    endpoint: string;
    model: string;
    apiKey: string;
    systemPrompt: string;
    maxTokens: number;
    timeoutMs: number;
    maxLines: number;
    debug: boolean;
}

export function getConfig(): ELI5Config {
    const config = vscode.workspace.getConfiguration('eli5');
    
    const apiKey = config.get('apiKey', '');
    const endpoint = config.get('endpoint', 'https://api.openai.com/v1/chat/completions');
    const model = config.get('model', 'gpt-4o-mini');
    
    const provider = apiKey ? 'openai-compatible' : 'ollama';
    
    return {
        provider,
        endpoint: provider === 'ollama' ? 'http://localhost:11434/api/generate' : endpoint,
        model: provider === 'ollama' ? 'mistral:7b' : model,
        apiKey,
        systemPrompt: config.get('systemPrompt', 'Explain this code simply for beginners. Use short sentences. Include: 1) What it does (3-5 steps), 2) Why it\'s written this way, 3) Common mistakes to avoid. Keep under 200 words.'),
        maxTokens: config.get('maxTokens', 500),
        timeoutMs: config.get('timeoutMs', 60000),
        maxLines: config.get('maxLines', 800),
        debug: config.get('debug', false)
    };
}
