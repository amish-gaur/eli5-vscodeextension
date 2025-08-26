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
exports.getConfig = void 0;
const vscode = __importStar(require("vscode"));
function getConfig() {
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
exports.getConfig = getConfig;
//# sourceMappingURL=getConfig.js.map