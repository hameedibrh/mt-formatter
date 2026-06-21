import * as vscode from 'vscode';
import { parseMTMessage, MTMessage } from './mtParser';

export function formatMTDocument(document: vscode.TextDocument): vscode.TextEdit[] {
  const text = document.getText();
  const message = parseMTMessage(text);

  if (message.blocks.size === 0) return [];

  const formatted = serializeMessage(message);

  if (formatted.trimEnd() === text.trimEnd()) return [];

  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(text.length)
  );
  return [vscode.TextEdit.replace(fullRange, formatted)];
}

function serializeMessage(message: MTMessage): string {
  const parts: string[] = [];

  if (message.blocks.has('1')) {
    const b = message.blocks.get('1')!;
    parts.push(`{1:${b.content}}`);
  }

  if (message.blocks.has('2')) {
    const b = message.blocks.get('2')!;
    parts.push(`{2:${b.content}}`);
  }

  if (message.blocks.has('3')) {
    const b = message.blocks.get('3')!;
    parts.push(`{3:${b.content}}`);
  }

  if (message.blocks.has('4')) {
    parts.push('{4:');
    for (const field of message.fields) {
      const valueLines = field.value.split('\n');
      parts.push(`:${field.tag}:${valueLines[0]}`);
      for (let i = 1; i < valueLines.length; i++) {
        parts.push(valueLines[i]);
      }
    }
    parts.push('-}');
  }

  if (message.blocks.has('5')) {
    const b = message.blocks.get('5')!;
    parts.push(`{5:${b.content}}`);
  }

  return parts.join('\n') + '\n';
}
