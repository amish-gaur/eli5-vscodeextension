import * as vscode from 'vscode';
import * as path from 'path';

export function getWebviewHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
    const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'panel.css'));

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ELI5 - Code Explanation</title>
    <link rel="stylesheet" type="text/css" href="${styleResetUri}">
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🤖 ELI5 - Explain Like I'm 5</h2>
            <div class="buttons">
                <button id="copyBtn" class="btn" disabled>Copy</button>
                <button id="clearBtn" class="btn" disabled>Clear</button>
            </div>
        </div>
        
        <div id="loading" class="loading hidden">
            <div class="spinner"></div>
            <p>Generating explanation...</p>
        </div>
        
        <div id="error" class="error hidden">
            <h3>❌ Error</h3>
            <p id="errorText"></p>
            <div class="error-actions">
                <button id="ollamaGuideBtn" class="btn">Open Ollama Guide</button>
                <button id="settingsBtn" class="btn">Open Settings</button>
            </div>
        </div>
        
        <div id="result" class="result hidden">
            <div id="resultContent"></div>
        </div>
        
        <div id="welcome" class="welcome">
            <h3>👋 Welcome to ELI5!</h3>
            <p>Select some code in your editor and:</p>
            <ul>
                <li>Right-click and choose "Explain Selection (ELI5)"</li>
                <li>Or use the command palette: <code>ELI5: Explain Selection</code></li>
                <li>Or use the command palette: <code>ELI5: Explain File</code></li>
            </ul>
            <p><strong>Default setup:</strong> Uses local Ollama (free & private)</p>
            <p><strong>Alternative:</strong> Set API key for cloud providers</p>
            <p><strong>Need help?</strong> Use Command Palette: "ELI5: Setup Ollama" for OS-specific installation help</p>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        let lastExplanation = '';
        
        // Elements
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        const result = document.getElementById('result');
        const welcome = document.getElementById('welcome');
        const copyBtn = document.getElementById('copyBtn');
        const clearBtn = document.getElementById('clearBtn');
        const resultContent = document.getElementById('resultContent');
        const errorText = document.getElementById('errorText');
        const ollamaGuideBtn = document.getElementById('ollamaGuideBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        
        // Event listeners
        copyBtn.addEventListener('click', () => {
            if (lastExplanation) {
                vscode.postMessage({ type: 'copy', text: lastExplanation });
            }
        });
        
        clearBtn.addEventListener('click', () => {
            vscode.postMessage({ type: 'clear' });
            showWelcome();
        });
        
        ollamaGuideBtn.addEventListener('click', () => {
            vscode.postMessage({ type: 'openOllamaGuide' });
        });
        
        settingsBtn.addEventListener('click', () => {
            vscode.postMessage({ type: 'openSettings' });
        });
        
        // Message handling
        window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.type) {
                case 'result':
                    lastExplanation = message.text;
                    showResult(message.text);
                    break;
                case 'error':
                    showError(message.text);
                    break;
                case 'clear':
                    showWelcome();
                    break;
            }
        });
        
        function showLoading() {
            loading.classList.remove('hidden');
            error.classList.add('hidden');
            result.classList.add('hidden');
            welcome.classList.add('hidden');
            copyBtn.disabled = true;
            clearBtn.disabled = true;
        }
        
        function showError(text) {
            loading.classList.add('hidden');
            error.classList.remove('hidden');
            result.classList.add('hidden');
            welcome.classList.add('hidden');
            errorText.textContent = text;
            copyBtn.disabled = true;
            clearBtn.disabled = false;
        }
        
        function showResult(text) {
            loading.classList.add('hidden');
            error.classList.add('hidden');
            result.classList.remove('hidden');
            welcome.classList.add('hidden');
            resultContent.innerHTML = formatText(text);
            copyBtn.disabled = false;
            clearBtn.disabled = false;
        }
        
        function showWelcome() {
            loading.classList.add('hidden');
            error.classList.add('hidden');
            result.classList.add('hidden');
            welcome.classList.remove('hidden');
            copyBtn.disabled = true;
            clearBtn.disabled = true;
            lastExplanation = '';
        }
        
        function formatText(text) {
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/\\n/g, '<br>')
                .replace(/\`([^\`]+)\`/g, '<code>$1</code>')
                .replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>');
        }
    </script>
</body>
</html>`;
}
