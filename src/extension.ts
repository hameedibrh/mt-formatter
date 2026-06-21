import * as vscode from 'vscode';
import { parseMTMessage, getFieldAtLine } from './mtParser';
import { getFieldDef, getMTTypeDef, getFieldMandatoryStatus, getMTTypeSummary } from './mtFieldDefs';
import { validateMTMessage } from './mtValidator';
import { formatMTDocument } from './mtFormatter';

const LANGUAGE_ID = 'swift-mt';

export function activate(context: vscode.ExtensionContext): void {
  const diagnostics = vscode.languages.createDiagnosticCollection(LANGUAGE_ID);
  context.subscriptions.push(diagnostics);

  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBar.command = 'mt-formatter.showMessageInfo';
  context.subscriptions.push(statusBar);

  // Hover provider — field docs on hover
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(LANGUAGE_ID, {
      provideHover(document, position) {
        const message = parseMTMessage(document.getText());
        const field = getFieldAtLine(message.fields, position.line);
        if (!field) return null;

        const def = getFieldDef(field.tag);
        if (!def) {
          return new vscode.Hover(
            new vscode.MarkdownString(`**Field \`:${field.tag}:\`** — Unknown tag (not in SWIFT MT standards)`)
          );
        }
        return buildHover(field.tag, def, message.mtType);
      }
    })
  );

  // Document formatter
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(LANGUAGE_ID, {
      provideDocumentFormattingEdits(document) {
        return formatMTDocument(document);
      }
    })
  );

  // Format command
  context.subscriptions.push(
    vscode.commands.registerCommand('mt-formatter.formatDocument', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor?.document.languageId === LANGUAGE_ID) {
        vscode.commands.executeCommand('editor.action.formatDocument');
      }
    })
  );

  // Show MT info command
  context.subscriptions.push(
    vscode.commands.registerCommand('mt-formatter.showMessageInfo', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor || editor.document.languageId !== LANGUAGE_ID) return;

      const message = parseMTMessage(editor.document.getText());
      if (!message.mtType) {
        vscode.window.showInformationMessage('Could not detect MT message type');
        return;
      }
      const def = getMTTypeDef(message.mtType);
      const fieldCount = message.fields.length;
      const hasBlock5 = message.blocks.has('5');
      vscode.window.showInformationMessage(
        `MT${message.mtType} — ${def?.name ?? 'Unknown'} | ${fieldCount} fields | Block 5: ${hasBlock5 ? 'present' : 'absent'}`
      );
    })
  );

  // Debounce timer for validation
  let validateTimer: ReturnType<typeof setTimeout> | undefined;

  function scheduleValidation(document: vscode.TextDocument): void {
    if (document.languageId !== LANGUAGE_ID) return;
    clearTimeout(validateTimer);
    validateTimer = setTimeout(() => runUpdate(document), 300);
  }

  function runUpdate(document: vscode.TextDocument): void {
    if (document.languageId !== LANGUAGE_ID) {
      statusBar.hide();
      return;
    }

    const message = parseMTMessage(document.getText());

    // Update diagnostics
    const diags = validateMTMessage(message, document);
    diagnostics.set(document.uri, diags);

    // Update status bar
    if (message.mtType) {
      const def = getMTTypeDef(message.mtType);
      const errCount = diags.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
      const warnCount = diags.filter(d => d.severity === vscode.DiagnosticSeverity.Warning).length;

      let icon = '$(file-binary)';
      if (errCount > 0) icon = '$(error)';
      else if (warnCount > 0) icon = '$(warning)';
      else if (message.isValid) icon = '$(check)';

      statusBar.text = `${icon} MT${message.mtType}: ${def?.name ?? 'Unknown'}`;
      statusBar.tooltip = new vscode.MarkdownString(
        `**MT${message.mtType} — ${def?.name ?? ''}**\n\n` +
        (def?.description ?? '') +
        (errCount > 0 ? `\n\n$(error) ${errCount} error(s)` : '') +
        (warnCount > 0 ? `\n\n$(warning) ${warnCount} warning(s)` : '') +
        '\n\nClick to show message info'
      );
      statusBar.tooltip.isTrusted = true;
      statusBar.show();
    } else if (message.blocks.size > 0) {
      statusBar.text = '$(question) MT type unknown';
      statusBar.tooltip = 'Cannot detect MT type — check Block 2 format';
      statusBar.show();
    } else {
      statusBar.hide();
    }
  }

  // Watch document events
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(e => scheduleValidation(e.document))
  );
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(doc => runUpdate(doc))
  );
  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument(doc => diagnostics.delete(doc.uri))
  );
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (editor) {
        runUpdate(editor.document);
      } else {
        statusBar.hide();
      }
    })
  );

  // Run for currently open editor on activation
  if (vscode.window.activeTextEditor) {
    runUpdate(vscode.window.activeTextEditor.document);
  }
}

function buildHover(tag: string, def: ReturnType<typeof getFieldDef>, mtType: string | null): vscode.Hover {
  const md = new vscode.MarkdownString('', true);
  md.isTrusted = true;

  md.appendMarkdown(`### \`:${tag}:\` — ${def!.name}\n\n`);

  // Mandatory status for detected MT type
  if (mtType) {
    const status = getFieldMandatoryStatus(tag, mtType);
    if (status === 'mandatory') {
      md.appendMarkdown(`**MT${mtType} Status:** ✅ Mandatory\n\n`);
    } else if (status === 'optional') {
      md.appendMarkdown(`**MT${mtType} Status:** ⬜ Optional\n\n`);
    } else {
      md.appendMarkdown(`**MT${mtType} Status:** ❓ Not defined for MT${mtType}\n\n`);
    }
  }

  md.appendMarkdown(`**Description:** ${def!.description}\n\n`);

  md.appendMarkdown(`---\n\n`);

  md.appendMarkdown(`**SWIFT Format:** \`${def!.format}\`\n\n`);
  md.appendMarkdown(`**Readable Format:** ${def!.formatHuman}\n\n`);

  if (def!.validValues && def!.validValues.length > 0) {
    md.appendMarkdown(`**Valid Values:** ${def!.validValues.map(v => `\`${v}\``).join('  |  ')}\n\n`);
  }

  if (def!.example) {
    md.appendMarkdown(`**Example:**\n\`\`\`\n:${tag}:${def!.example}\n\`\`\`\n\n`);
  }

  if (def!.notes) {
    md.appendMarkdown(`---\n\n> 💡 ${def!.notes}\n\n`);
  }

  return new vscode.Hover(md);
}

export function deactivate(): void {
  // cleanup handled via context.subscriptions
}
