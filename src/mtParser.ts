export interface MTBlock {
  id: string;
  content: string;
  startLine: number;
  endLine: number;
}

export interface MTField {
  tag: string;    // full tag e.g. "32A", "20", "60F"
  tagNum: string; // numeric part e.g. "32", "20", "60"
  option: string; // option letter e.g. "A", "F", ""
  value: string;
  startLine: number;
  endLine: number;
}

export interface MTMessage {
  raw: string;
  blocks: Map<string, MTBlock>;
  mtType: string | null;
  fields: MTField[];
  isValid: boolean;
  parseWarnings: string[];
}

export function parseMTMessage(text: string): MTMessage {
  const normalized = normalizeMessage(text);
  const lines = normalized.split('\n');
  const blocks = new Map<string, MTBlock>();
  const fields: MTField[] = [];
  const parseWarnings: string[] = [];
  let mtType: string | null = null;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    const blockMatch = trimmed.match(/^\{(\d):(.*)/);
    if (blockMatch) {
      const blockId = blockMatch[1];
      const afterColon = blockMatch[2];

      if (blockId === '4') {
        const startLine = i;
        const contentLines: string[] = [];

        if (afterColon && afterColon.trim() !== '') {
          contentLines.push(afterColon);
        }

        i++;
        while (i < lines.length) {
          const bl = lines[i].trimEnd();
          if (bl === '-}' || bl === '-') {
            break;
          }
          contentLines.push(lines[i]);
          i++;
        }

        blocks.set('4', {
          id: '4',
          content: contentLines.join('\n'),
          startLine,
          endLine: i
        });
      } else {
        // Parse single-line block with nested brace support
        const raw = trimmed.slice(3); // skip {N:
        const content = extractBalancedContent(raw);
        blocks.set(blockId, {
          id: blockId,
          content,
          startLine: i,
          endLine: i
        });
      }
    }
    i++;
  }

  // Detect MT type from block 2
  if (blocks.has('2')) {
    const b2 = blocks.get('2')!;
    // Input: {2:I103BANKDEFFXXXXU3} — IO format
    const ioMatch = b2.content.match(/^[IO](\d{3})/);
    if (ioMatch) {
      mtType = ioMatch[1];
    } else {
      // Output: {2:O103...}
      const outMatch = b2.content.match(/^O(\d{3})/);
      if (outMatch) mtType = outMatch[1];
    }
  }

  // Parse fields from block 4
  if (blocks.has('4')) {
    const b4 = blocks.get('4')!;
    const b4Lines = b4.content.split('\n');
    // +1 because block4.startLine is the {4: line, fields start on next line
    const baseLineNum = b4.startLine + 1;

    let currentField: MTField | null = null;

    for (let li = 0; li < b4Lines.length; li++) {
      const ln = b4Lines[li];
      const fieldMatch = ln.match(/^(:(\d{2})([A-Z]?):)(.*)/);

      if (fieldMatch) {
        if (currentField) {
          fields.push(currentField);
        }
        currentField = {
          tag: fieldMatch[2] + fieldMatch[3],
          tagNum: fieldMatch[2],
          option: fieldMatch[3],
          value: fieldMatch[4],
          startLine: baseLineNum + li,
          endLine: baseLineNum + li
        };
      } else if (currentField && ln.trim() !== '') {
        currentField.value += '\n' + ln;
        currentField.endLine = baseLineNum + li;
      }
    }

    if (currentField) {
      fields.push(currentField);
    }
  }

  if (blocks.size === 0 && text.trim().length > 0) {
    parseWarnings.push('Could not parse any blocks — check message format');
  }

  const isValid = blocks.has('1') && blocks.has('2') && blocks.has('4');

  return { raw: text, blocks, mtType, fields, isValid, parseWarnings };
}

function normalizeMessage(text: string): string {
  const cleaned = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const lines = cleaned.split('\n');
  let blockLineCount = 0;
  for (const line of lines) {
    if (/^\s*\{\d:/.test(line)) blockLineCount++;
  }
  if (blockLineCount >= 2) return cleaned;

  const result: string[] = [];
  let pos = 0;

  while (pos < cleaned.length) {
    while (pos < cleaned.length && /[\s]/.test(cleaned[pos]) && cleaned[pos] !== '\n') pos++;
    if (pos >= cleaned.length) break;

    if (cleaned[pos] === '{' &&
        pos + 2 < cleaned.length &&
        /\d/.test(cleaned[pos + 1]) &&
        cleaned[pos + 2] === ':') {

      const blockId = cleaned[pos + 1];

      if (blockId === '4') {
        const endMarker = cleaned.indexOf('-}', pos);
        let blockEnd: number;
        if (endMarker !== -1) {
          blockEnd = endMarker + 2;
        } else {
          let depth = 1;
          let j = pos + 3;
          while (j < cleaned.length && depth > 0) {
            if (cleaned[j] === '{') depth++;
            else if (cleaned[j] === '}') depth--;
            j++;
          }
          blockEnd = j;
        }
        result.push(...expandBlock4Fields(cleaned.substring(pos, blockEnd)));
        pos = blockEnd;
      } else {
        let depth = 1;
        let j = pos + 3;
        while (j < cleaned.length && depth > 0) {
          if (cleaned[j] === '{') depth++;
          else if (cleaned[j] === '}') depth--;
          j++;
        }
        result.push(cleaned.substring(pos, j));
        pos = j;
      }
    } else {
      pos++;
    }
  }

  return result.length > 0 ? result.join('\n') : cleaned;
}

function expandBlock4Fields(blockRaw: string): string[] {
  let content = blockRaw;
  if (content.startsWith('{4:')) content = content.substring(3);
  content = content.replace(/-?\}\s*$/, '');
  content = content.trim();

  const fieldOnOwnLine = content.split('\n').filter(l => /^:\d{2}[A-Z]?:/.test(l.trim())).length;
  if (fieldOnOwnLine > 1) {
    return ['{4:', ...content.split('\n'), '-}'];
  }

  const lines: string[] = ['{4:'];
  const tagRegex = /:(\d{2}[A-Z]?):/g;
  let match;
  const tags: Array<{index: number, tag: string, len: number}> = [];

  while ((match = tagRegex.exec(content)) !== null) {
    tags.push({ index: match.index, tag: match[1], len: match[0].length });
  }

  if (tags.length === 0) {
    if (content) lines.push(content);
  } else {
    for (let i = 0; i < tags.length; i++) {
      const t = tags[i];
      const valStart = t.index + t.len;
      const valEnd = i + 1 < tags.length ? tags[i + 1].index : content.length;
      const value = content.substring(valStart, valEnd).replace(/\s+$/, '');

      const parts = value.split(/  /);
      const fieldLines: string[] = [];
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed) fieldLines.push(trimmed);
      }

      if (fieldLines.length === 0) {
        lines.push(`:${t.tag}:`);
      } else {
        lines.push(`:${t.tag}:${fieldLines[0]}`);
        for (let j = 1; j < fieldLines.length; j++) {
          lines.push(fieldLines[j]);
        }
      }
    }
  }

  lines.push('-}');
  return lines;
}

function extractBalancedContent(str: string): string {
  let depth = 0;
  let result = '';
  for (let ci = 0; ci < str.length; ci++) {
    const ch = str[ci];
    if (ch === '{') {
      depth++;
      result += ch;
    } else if (ch === '}') {
      if (depth === 0) break; // closing brace of outer block
      depth--;
      result += ch;
    } else {
      result += ch;
    }
  }
  return result;
}

export function getFieldAtLine(fields: MTField[], lineNumber: number): MTField | null {
  for (const field of fields) {
    if (lineNumber >= field.startLine && lineNumber <= field.endLine) {
      return field;
    }
  }
  return null;
}
