<p align="center">
  <img src="images/icon.png" alt="Swift MT Formatter" width="128" />
</p>

<h1 align="center">Swift MT Message Formatter</h1>

<p align="center">
  <strong>Format, validate, and explore SWIFT MT financial messages — field-by-field with hover docs.</strong>
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=mt-formatter.mt-formatter"><img src="https://img.shields.io/visual-studio-marketplace/v/mt-formatter.mt-formatter?label=VS%20Code%20Marketplace" alt="VS Code Marketplace Version" /></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=mt-formatter.mt-formatter"><img src="https://img.shields.io/visual-studio-marketplace/d/mt-formatter.mt-formatter" alt="Downloads" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
</p>

---

A VS Code extension for working with **SWIFT MT (Message Type)** financial messages used in international banking and payments. Get syntax highlighting, real-time validation, document formatting, and rich hover documentation — all without leaving your editor.

## Features

### Syntax Highlighting

Full syntax highlighting for SWIFT MT message blocks, field tags, BICs, amounts, dates, and more.

<p align="center">
  <img src="images/syntax-highlighting.png" alt="Syntax highlighting" width="600" />
</p>

### Real-Time Validation

Catches errors as you type:

- Missing mandatory blocks (Block 1, 2, 4)
- Invalid Block 2 format
- Field format validation (`:20:`, `:32A:`, `:71A:`, `:23B:`, etc.)
- Mandatory field checks per MT type (MT103 requires `:20:`, `:23B:`, `:32A:`, `:71A:`, etc.)
- Value length and content validation

### Hover Documentation

Hover over any field tag to see:

- **Field name and description** — what the field means in SWIFT standards
- **SWIFT format notation** — e.g., `6!n3!a15d`
- **Human-readable format** — e.g., "Date (YYMMDD) + Currency (ISO 4217) + Amount"
- **Valid values** — e.g., `BEN | OUR | SHA` for `:71A:`
- **Examples** — real-world sample values
- **Mandatory/Optional status** — per detected MT type

### Document Formatting

Format any MT message with a single command. Normalizes block layout, field alignment, and line breaks.

- Use `Shift+Alt+F` (or your configured format shortcut)
- Right-click → **Format MT Message**

### Status Bar

Live status bar shows:
- Detected MT type and name (e.g., `MT103: Single Customer Credit Transfer`)
- Error and warning counts
- Click to show full message info

## Supported MT Types

| Category | Types | Description |
|----------|-------|-------------|
| **Customer Payments** | MT101, MT102, MT103, MT104, MT107 | Credit transfers, direct debits, batch payments |
| **Institution Transfers** | MT200, MT202 | Bank-to-bank and own-account transfers |
| **Statements & Reporting** | MT900, MT910, MT940, MT942, MT950 | Debit/credit confirmations, account statements |

**130+ field tags** documented with full SWIFT standard definitions.

## Getting Started

### Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for **"Swift MT Message Formatter"**
4. Click **Install**

Or install from the command line:

```bash
code --install-extension mt-formatter.mt-formatter
```

### Usage

1. Open any `.mtswift` file, or a file starting with `{1:`
2. The extension activates automatically
3. Start editing — validation and hover docs work instantly

### Sample MT103 Message

```
{1:F01DEUTDEFFAXXX0000000001}
{2:I103CHASUS33XXXXU3}
{3:{108:MT103-2024100100001}}
{4:
:20:TXNREF20241001001
:23B:CRED
:32A:241001USD10000,00
:50K:/DE89370400440532013000
ACME CORPORATION GMBH
HAUPTSTRASSE 12
60311 FRANKFURT AM MAIN
:59:/US12345678901234567890
GLOBAL TRADING INC
500 FIFTH AVENUE
NEW YORK NY 10110
:71A:SHA
-}
{5:{CHK:3B9C0D1E2F3A}}
```

## File Association

The extension registers the `swift-mt` language for:

- Files with the `.mtswift` extension
- Files whose first line matches `{1:` (auto-detected)

To manually set the language mode, click the language indicator in the VS Code status bar and select **Swift MT**.

## Commands

| Command | Description |
|---------|-------------|
| `MT: Format MT Message` | Format the current MT message document |
| `MT: Show MT Message Info` | Display detected MT type, field count, and block info |

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development

```bash
# Clone the repo
git clone https://github.com/hameedibrh/mt-formatter.git
cd mt-formatter

# Install dependencies
npm install

# Compile
npm run compile

# Press F5 in VS Code to launch Extension Development Host
```

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Field definitions based on the [SWIFT MT Standard](https://www.swift.com/) documentation
- Built for the financial services community working with legacy SWIFT messaging
