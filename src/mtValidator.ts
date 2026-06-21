import * as vscode from 'vscode';
import { MTMessage, MTField } from './mtParser';
import { FIELD_DEFS, MT_TYPE_DEFS, getAllKnownTags, MTTypeDef } from './mtFieldDefs';

export function validateMTMessage(
  message: MTMessage,
  document: vscode.TextDocument
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];

  if (!message.isValid) {
    if (!message.blocks.has('1')) {
      diagnostics.push(makeDiag(document, 0, 'Missing Block 1 (Basic Header) — expected: {1:F01BANKBEBBAXXX0000000000}', 'error'));
    }
    if (!message.blocks.has('2')) {
      diagnostics.push(makeDiag(document, 0, 'Missing Block 2 (Application Header) — expected: {2:I103RECEIVERBICXXXX}', 'error'));
    }
    if (!message.blocks.has('4')) {
      diagnostics.push(makeDiag(document, 0, 'Missing Block 4 (Text Block) — expected: {4:\\n:20:REF\\n...\\n-}', 'error'));
    }
    // Not much more to validate without basic structure
    if (message.blocks.size === 0) return diagnostics;
  }

  // Validate block 2 format
  if (message.blocks.has('2')) {
    const b2 = message.blocks.get('2')!;
    if (!/^[IO]\d{3}[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}/.test(b2.content)) {
      diagnostics.push(makeDiag(document, b2.startLine,
        `Block 2 format looks invalid. Expected I/O + MT type + BIC (e.g., I103BANKDEFFXXXXU3)`,
        'warning'));
    }
  }

  // Validate block 4 terminator
  if (message.blocks.has('4')) {
    const b4 = message.blocks.get('4')!;
    const endLine = document.lineAt(Math.min(b4.endLine, document.lineCount - 1));
    if (!endLine.text.trim().startsWith('-')) {
      diagnostics.push(makeDiag(document, b4.endLine,
        'Block 4 does not appear to be properly terminated with -}', 'warning'));
    }
  }

  const knownTags = getAllKnownTags();

  // Validate individual fields
  for (const field of message.fields) {
    // Unknown tag warning
    if (!knownTags.has(field.tag)) {
      const lineNum = Math.min(field.startLine, document.lineCount - 1);
      const line = document.lineAt(lineNum);
      const tagEnd = line.text.indexOf(':', 1) + 1;
      const range = new vscode.Range(lineNum, 0, lineNum, tagEnd > 0 ? tagEnd : line.text.length);
      diagnostics.push(new vscode.Diagnostic(
        range,
        `Unknown field tag :${field.tag}: — not defined in SWIFT MT standards`,
        vscode.DiagnosticSeverity.Warning
      ));
    }

    // Format validation
    const formatErrors = validateFieldFormat(field, document);
    diagnostics.push(...formatErrors);
  }

  // Validate mandatory fields for detected MT type
  if (message.mtType && MT_TYPE_DEFS[message.mtType]) {
    const typeDef = MT_TYPE_DEFS[message.mtType];
    const presentTags = new Set(message.fields.map(f => f.tag));
    const mandatoryErrors = validateMandatoryFields(typeDef, presentTags, message, document);
    diagnostics.push(...mandatoryErrors);
  }

  return diagnostics;
}

function validateMandatoryFields(
  typeDef: MTTypeDef,
  presentTags: Set<string>,
  message: MTMessage,
  document: vscode.TextDocument
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];
  const b4 = message.blocks.get('4');
  const reportLine = b4 ? b4.startLine : 0;

  // Track which "one-of" groups have been satisfied
  const satisfiedGroups = new Map<string, boolean>();

  for (const spec of typeDef.fields) {
    if (spec.oneOf) {
      const groupKey = spec.oneOf.join('|');
      if (!satisfiedGroups.has(groupKey)) {
        const satisfied = spec.oneOf.some(t => presentTags.has(t));
        satisfiedGroups.set(groupKey, satisfied);
        if (!satisfied) {
          const options = spec.oneOf.map(t => `:${t}:`).join(', ');
          diagnostics.push(makeDiag(document, reportLine,
            `MT${typeDef.type}: Missing mandatory field group — one of ${options} must be present`,
            'error'
          ));
        }
      }
    } else if (spec.mandatory && !presentTags.has(spec.tag)) {
      const fieldDef = FIELD_DEFS[spec.tag];
      const name = fieldDef ? fieldDef.name : spec.tag;
      diagnostics.push(makeDiag(document, reportLine,
        `MT${typeDef.type}: Missing mandatory field :${spec.tag}: — ${name}`,
        'error'
      ));
    }
  }

  return diagnostics;
}

function validateFieldFormat(
  field: MTField,
  document: vscode.TextDocument
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];
  const value = field.value;
  const lineNum = Math.min(field.startLine, document.lineCount - 1);
  const line = document.lineAt(lineNum);
  const fullRange = new vscode.Range(
    field.startLine, 0,
    Math.min(field.endLine, document.lineCount - 1),
    document.lineAt(Math.min(field.endLine, document.lineCount - 1)).text.length
  );

  switch (field.tag) {
    case '20':
    case '21': {
      const v = value.trim();
      if (v.length > 16) {
        diagnostics.push(new vscode.Diagnostic(fullRange,
          `:${field.tag}: value too long — max 16 chars, got ${v.length}`,
          vscode.DiagnosticSeverity.Error));
      }
      if (v.startsWith('/') || v.endsWith('/')) {
        diagnostics.push(new vscode.Diagnostic(fullRange,
          `:${field.tag}: must not start or end with '/'`,
          vscode.DiagnosticSeverity.Error));
      }
      if (v.includes('//')) {
        diagnostics.push(new vscode.Diagnostic(fullRange,
          `:${field.tag}: must not contain '//' (double slash)`,
          vscode.DiagnosticSeverity.Error));
      }
      break;
    }
    case '23B': {
      const v = value.trim();
      const valid = ['CRED', 'CRTS', 'SPAY', 'SPRI', 'SSTD'];
      if (!valid.includes(v)) {
        diagnostics.push(new vscode.Diagnostic(fullRange,
          `:23B: invalid value '${v}' — must be one of: ${valid.join(', ')}`,
          vscode.DiagnosticSeverity.Error));
      }
      break;
    }
    case '32A': {
      const v = value.trim();
      if (!/^\d{6}[A-Z]{3}[\d,]+$/.test(v)) {
        diagnostics.push(new vscode.Diagnostic(fullRange,
          `:32A: invalid format — expected YYMMDD + currency (3 letters) + amount (comma decimal), e.g. 241001USD10000,00`,
          vscode.DiagnosticSeverity.Error));
      } else {
        const month = parseInt(v.substring(2, 4), 10);
        const day = parseInt(v.substring(4, 6), 10);
        if (month < 1 || month > 12) {
          diagnostics.push(new vscode.Diagnostic(fullRange,
            `:32A: invalid month '${month}' in date — must be 01-12`,
            vscode.DiagnosticSeverity.Error));
        }
        if (day < 1 || day > 31) {
          diagnostics.push(new vscode.Diagnostic(fullRange,
            `:32A: invalid day '${day}' in date — must be 01-31`,
            vscode.DiagnosticSeverity.Error));
        }
        const amtPart = v.substring(9);
        if (amtPart.length > 15) {
          diagnostics.push(new vscode.Diagnostic(fullRange,
            `:32A: amount part too long — max 15 characters`,
            vscode.DiagnosticSeverity.Warning));
        }
      }
      break;
    }
    case '32B':
    case '33B': {
      const v = value.trim();
      if (!/^[A-Z]{3}[\d,]+$/.test(v)) {
        diagnostics.push(new vscode.Diagnostic(fullRange,
          `:${field.tag}: invalid format — expected currency (3 letters) + amount (comma decimal), e.g. EUR1000,00`,
          vscode.DiagnosticSeverity.Error));
      }
      break;
    }
    case '71A': {
      const v = value.trim();
      const valid = ['BEN', 'OUR', 'SHA'];
      if (!valid.includes(v)) {
        diagnostics.push(new vscode.Diagnostic(fullRange,
          `:71A: invalid value '${v}' — must be one of: ${valid.join(', ')}`,
          vscode.DiagnosticSeverity.Error));
      }
      break;
    }
    case '28C': {
      const v = value.trim();
      if (!/^\d{1,5}(\/\d{1,5})?$/.test(v)) {
        diagnostics.push(new vscode.Diagnostic(fullRange,
          `:28C: invalid format — expected statement-number or statement-number/sequence, e.g. 00001/001`,
          vscode.DiagnosticSeverity.Warning));
      }
      break;
    }
    case '60F':
    case '60M':
    case '62F':
    case '62M':
    case '64':
    case '65': {
      const v = value.trim();
      if (!/^[DC]\d{6}[A-Z]{3}[\d,]+$/.test(v)) {
        diagnostics.push(new vscode.Diagnostic(fullRange,
          `:${field.tag}: invalid format — expected D/C + YYMMDD + currency + amount, e.g. C241001EUR50000,00`,
          vscode.DiagnosticSeverity.Error));
      }
      break;
    }
    case '70': {
      const lines = value.split('\n').filter(l => l.trim());
      if (lines.length > 4) {
        diagnostics.push(new vscode.Diagnostic(fullRange,
          `:70: too many lines — max 4 lines allowed (got ${lines.length})`,
          vscode.DiagnosticSeverity.Warning));
      }
      for (const ln of lines) {
        if (ln.length > 35) {
          diagnostics.push(new vscode.Diagnostic(fullRange,
            `:70: line too long — max 35 chars per line (got ${ln.length})`,
            vscode.DiagnosticSeverity.Warning));
        }
      }
      break;
    }
    case '72': {
      const lines = value.split('\n').filter(l => l.trim());
      if (lines.length > 6) {
        diagnostics.push(new vscode.Diagnostic(fullRange,
          `:72: too many lines — max 6 lines allowed (got ${lines.length})`,
          vscode.DiagnosticSeverity.Warning));
      }
      break;
    }
  }

  return diagnostics;
}

function makeDiag(
  document: vscode.TextDocument,
  lineNum: number,
  message: string,
  severity: 'error' | 'warning' | 'info'
): vscode.Diagnostic {
  const safeLineNum = Math.min(lineNum, document.lineCount - 1);
  const line = document.lineAt(safeLineNum);
  const range = new vscode.Range(safeLineNum, 0, safeLineNum, line.text.length);
  const sev = severity === 'error'
    ? vscode.DiagnosticSeverity.Error
    : severity === 'warning'
      ? vscode.DiagnosticSeverity.Warning
      : vscode.DiagnosticSeverity.Information;
  return new vscode.Diagnostic(range, message, sev);
}
