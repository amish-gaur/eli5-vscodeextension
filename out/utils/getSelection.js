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
exports.getSelection = void 0;
const vscode = __importStar(require("vscode"));
const getConfig_1 = require("./getConfig");
async function getSelection(selectionOnly) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        throw new Error('No active editor found');
    }
    const document = editor.document;
    const languageId = document.languageId;
    let text;
    if (selectionOnly) {
        const selection = editor.selection;
        if (selection.isEmpty) {
            throw new Error('No text selected');
        }
        text = document.getText(selection);
    }
    else {
        text = document.getText();
    }
    const config = (0, getConfig_1.getConfig)();
    const lines = text.split('\n');
    if (lines.length > config.maxLines) {
        text = lines.slice(0, config.maxLines).join('\n');
        text += `\n\n... (truncated at ${config.maxLines} lines)`;
    }
    return { text, languageId };
}
exports.getSelection = getSelection;
//# sourceMappingURL=getSelection.js.map