import { logger } from '../utils/logger';

interface OpenAIRequest {
    model: string;
    messages: Array<{
        role: 'system' | 'user';
        content: string;
    }>;
    max_tokens: number;
    temperature: number;
}

interface OpenAIResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

export async function generate(prompt: string, model: string, endpoint: string, timeoutMs: number, apiKey: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
        const lines = prompt.split('\n');
        const systemPromptIndex = lines.findIndex(line => line.includes('<LANGUAGE>:'));
        const systemPrompt = lines.slice(0, systemPromptIndex).join('\n');
        const userContent = lines.slice(systemPromptIndex).join('\n');
        
        const requestBody: OpenAIRequest = {
            model,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userContent
                }
            ],
            max_tokens: 500,
            temperature: 0.7
        };
        
        logger.debug(`Sending request to OpenAI-compatible endpoint: ${JSON.stringify(requestBody)}`);
        
        if (!apiKey) {
            throw new Error('API key not provided. Please set eli5.apiKey in VS Code settings or use local Ollama (default).');
        }
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data: OpenAIResponse = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from OpenAI-compatible endpoint');
        }
        
        return data.choices[0].message.content;
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error(`Request timed out after ${timeoutMs}ms`);
            }
            if (error.message.includes('fetch')) {
                throw new Error('Failed to connect to OpenAI-compatible endpoint');
            }
            throw error;
        }
        
        throw new Error('Unknown error occurred while communicating with OpenAI-compatible endpoint');
    }
}

export const openaiCompatibleProvider = { generate };
