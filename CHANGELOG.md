# Changelog

All notable changes to the **Swift MT Message Formatter** extension will be documented in this file.

## [0.1.0] - 2024-10-01

### Added
- Syntax highlighting for SWIFT MT messages (`.mtswift` files)
- Auto-detection of MT messages starting with `{1:`
- Document formatting with proper block and field layout
- Real-time validation with diagnostics:
  - Missing mandatory blocks (1, 2, 4)
  - Block 2 format validation
  - Field format validation (`:20:`, `:32A:`, `:71A:`, `:23B:`, etc.)
  - Mandatory field checks per MT type
- Hover documentation for 130+ SWIFT MT field tags with:
  - Field name and description
  - SWIFT format notation and human-readable format
  - Valid values and examples
  - Mandatory/optional status per MT type
- Status bar indicator showing MT type, message name, and error/warning counts
- "Show MT Message Info" command
- Support for MT message types:
  - **Category 1:** MT101, MT102, MT103, MT104, MT107
  - **Category 2:** MT200, MT202
  - **Category 9:** MT900, MT910, MT940, MT942, MT950
- Sample messages for MT103, MT202, and MT940
