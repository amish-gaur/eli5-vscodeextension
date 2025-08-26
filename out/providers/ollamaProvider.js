"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ollamaProvider = exports.generate = void 0;
const logger_1 = require("../utils/logger");
async function generate(prompt, model, endpoint, timeoutMs) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const requestBody = {
            model,
            prompt,
            stream: false
        };
        logger_1.logger.debug(`Sending request to Ollama: ${JSON.stringify(requestBody)}`);
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
        const data = await response.json();
        if (!data.response) {
            throw new Error('No response received from Ollama');
        }
        return data.response;
    }
    catch (error) {
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
exports.generate = generate;
exports.ollamaProvider = { generate };
//# sourceMappingURL=ollamaProvider.js.map