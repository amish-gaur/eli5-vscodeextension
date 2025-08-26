import { logger } from '../utils/logger';

interface OllamaRequest {
    model: string;
    prompt: string;
    stream: boolean;
}

interface OllamaResponse {
    response: string;
    done: boolean;
}

export async function generate(prompt: string, model: string, endpoint: string, timeoutMs: number): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
        const requestBody: OllamaRequest = {
            model,
            prompt,
            stream: false
        };
        
        logger.debug(`Sending request to Ollama: ${JSON.stringify(requestBody)}`);
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Ollama not found. Please install Ollama from https://ollama.ai/download and run "ollama serve"');
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data: OllamaResponse = await response.json();
        
        if (!data.response) {
            throw new Error('No response received from Ollama');
        }
        
        return data.response;
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error(`Request timed out after ${timeoutMs}ms. This is normal for the first run. Try again - subsequent runs will be faster.`);
            }
            if (error.message.includes('fetch')) {
                throw new Error('Ollama not running. Please install Ollama from https://ollama.ai/download and run "ollama serve"');
            }
            throw error;
        }
        
        throw new Error('Unknown error occurred while communicating with Ollama');
    }
}

export const ollamaProvider = { generate };
