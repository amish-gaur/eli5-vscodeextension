import * as vscode from 'vscode';
import { getWebviewHtml } from './getWebviewHtml';

export class ELI5ViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'eli5.view';
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = getWebviewHtml(webviewView.webview, this._extensionUri);

        webviewView.webview.onDidReceiveMessage(
            message => {
                switch (message.type) {
                    case 'copy':
                        vscode.env.clipboard.writeText(message.text);
                        vscode.window.showInformationMessage('Explanation copied to clipboard!');
                        break;
                    case 'clear':
                        this.postMessage({ type: 'clear' });
                        break;
                }
            }
        );
    }

    public postMessage(message: any) {
        if (this._view) {
            this._view.webview.postMessage(message);
        }
    }
}
