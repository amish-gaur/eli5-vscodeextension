import * as vscode from 'vscode';
import { getConfig } from './getConfig';

export interface CodeSelection {
    text: string;
    languageId: string;
}

export async function getSelection(selectionOnly: boolean): Promise<CodeSelection> {
    const editor = vscode.window.activeTextEditor;
    
    if (!editor) {
        throw new Error('No active editor found');
    }
    
    const document = editor.document;
    const languageId = document.languageId;
    
    let text: string;
    
    if (selectionOnly) {
        const selection = editor.selection;
        if (selection.isEmpty) {
            throw new Error('No text selected');
        }
        text = document.getText(selection);
    } else {
        text = document.getText();
    }
    
    const config = getConfig();
    const lines = text.split('\n');
    if (lines.length > config.maxLines) {
        text = lines.slice(0, config.maxLines).join('\n');
        text += `\n\n... (truncated at ${config.maxLines} lines)`;
    }
    
    return { text, languageId };
} 