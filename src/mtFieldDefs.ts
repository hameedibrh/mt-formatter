export interface FieldDef {
  tag: string;
  name: string;
  description: string;
  format: string;
  formatHuman: string;
  example?: string;
  notes?: string;
  validValues?: string[];
}

export interface MTFieldSpec {
  tag: string;
  mandatory: boolean;
  repetitive?: boolean;
  oneOf?: string[]; // this tag is mandatory only if none of oneOf tags are present
}

export interface MTTypeDef {
  type: string;
  name: string;
  description: string;
  fields: MTFieldSpec[];
}

export const FIELD_DEFS: Record<string, FieldDef> = {
  "13C": {
    tag: "13C",
    name: "Time Indication",
    description: "Specifies the time at which the message was created, or the time of settlement. Used to indicate cutoff times for correspondent banks.",
    format: "/8c/4!n1!x4!n",
    formatHuman: "/CODE/HHMM±HHMM (code, local time, UTC offset sign, UTC offset)",
    example: "/CLSTIME/0915+0100",
    notes: "Common codes: CLSTIME (CLS settlement time), RNCTIME (Rejection/non-confirmation cutoff), SNDTIME (Sender's correspondent time)"
  },
  "20": {
    tag: "20",
    name: "Transaction Reference Number / Sender's Reference",
    description: "Unique reference number assigned by the message sender to unambiguously identify the message. Must be referenced in any related messages.",
    format: "16x",
    formatHuman: "Up to 16 alphanumeric/special characters. Cannot start or end with '/', cannot contain '//'.",
    example: "TXNREF20241001001"
  },
  "21": {
    tag: "21",
    name: "Related Reference",
    description: "Reference to a previous message or transaction that this message relates to. Used to link messages in a chain.",
    format: "16x",
    formatHuman: "Up to 16 alphanumeric/special characters",
    example: "RELREF20241001001"
  },
  "23B": {
    tag: "23B",
    name: "Bank Operation Code",
    description: "Identifies the type of payment operation being executed. Determines how the transaction is processed by intermediary banks.",
    format: "4!c",
    formatHuman: "Exactly 4 uppercase letters",
    example: "CRED",
    validValues: ["CRED", "CRTS", "SPAY", "SPRI", "SSTD"],
    notes: "CRED: Standard credit transfer. CRTS: Credit transfer to be settled through a specific system. SPAY: SWIFT Pay service-level credit transfer. SPRI: Priority credit transfer. SSTD: Standard service-level credit transfer."
  },
  "23E": {
    tag: "23E",
    name: "Instruction Code",
    description: "Specifies additional instructions from the ordering customer regarding the handling of the payment.",
    format: "4!c[/30x]",
    formatHuman: "4-letter code, optionally followed by /additional-info (max 30 chars)",
    example: "CHQB",
    validValues: ["CHQB", "CORT", "HOLD", "INTC", "PHOB", "REPA", "RTGS", "SDVA", "TELB"],
    notes: "CHQB: Pay beneficiary by cheque. CORT: Corporate trade payment. HOLD: Hold for beneficiary pickup. INTC: Intra-company transfer. PHOB: Phone beneficiary before releasing. REPA: Relates to prior payment. RTGS: RTGS settlement required. SDVA: Same-day value. TELB: Telex beneficiary."
  },
  "25": {
    tag: "25",
    name: "Account Identification",
    description: "Identifies the account being reported on. Used in statement and confirmation messages to identify the subject account.",
    format: "35x",
    formatHuman: "Up to 35 alphanumeric/special characters (IBAN format recommended where applicable)",
    example: "DE89370400440532013000"
  },
  "25P": {
    tag: "25P",
    name: "Account Identification with BIC",
    description: "Identifies the account together with the BIC of the account servicing institution.",
    format: "35x\\n4!a2!a2!c[3!c]",
    formatHuman: "Account number on first line (up to 35 chars), BIC of servicing institution on second line",
    example: "DE89370400440532013000\nDEUTDEDB"
  },
  "26T": {
    tag: "26T",
    name: "Transaction Type Code",
    description: "Identifies the nature of the transaction for regulatory reporting or internal categorization purposes.",
    format: "3!c",
    formatHuman: "Exactly 3 uppercase alphanumeric characters",
    example: "K90",
    notes: "Codes are agreed bilaterally between the bank and its customer, or defined by local regulation."
  },
  "28C": {
    tag: "28C",
    name: "Statement Number / Sequence Number",
    description: "Identifies the sequential number of this statement within the reporting period, and optionally the sub-sequence when a statement spans multiple messages.",
    format: "5n[/5n]",
    formatHuman: "Statement number (up to 5 digits), optionally /sub-sequence (up to 5 digits)",
    example: "00001/001",
    notes: "When a statement spans multiple MT940 messages, the statement number remains the same while the sub-sequence increments."
  },
  "28D": {
    tag: "28D",
    name: "Message Index / Total",
    description: "Provides the index of this message within a multi-message series and the total count of messages in the series.",
    format: "5n/5n",
    formatHuman: "Message index/total (e.g., 1/3 = first of three messages)",
    example: "00001/00001"
  },
  "32A": {
    tag: "32A",
    name: "Value Date / Currency Code / Amount",
    description: "The date on which the interbank settlement will take place, the currency of the transaction, and the settled amount.",
    format: "6!n3!a15d",
    formatHuman: "Date (YYMMDD) + Currency code (ISO 4217, 3 letters) + Amount (up to 15 digits, comma decimal)",
    example: "241001USD10000,00",
    notes: "Decimal separator is a comma (,). No thousands separator. Leading zeros in date are mandatory. E.g., 241001USD1000,50 = October 1, 2024, USD 1,000.50"
  },
  "32B": {
    tag: "32B",
    name: "Currency Code / Transaction Amount",
    description: "The currency and amount of the transaction, without a value date.",
    format: "3!a15d",
    formatHuman: "Currency code (ISO 4217, 3 letters) + Amount (up to 15 digits, comma decimal)",
    example: "USD10000,00"
  },
  "33B": {
    tag: "33B",
    name: "Currency / Instructed Amount",
    description: "The currency and amount as originally instructed by the ordering customer, before any currency conversion or charge deductions.",
    format: "3!a15d",
    formatHuman: "Currency code (ISO 4217, 3 letters) + Amount (up to 15 digits, comma decimal)",
    example: "EUR8500,00",
    notes: "Included when the instructed currency differs from the settlement currency in field :32A:. Used for transparency and regulatory reporting."
  },
  "34F": {
    tag: "34F",
    name: "Debit / Credit Floor Limit Indicator",
    description: "Specifies the minimum debit and credit amount below which transactions are not reported individually.",
    format: "3!a15d",
    formatHuman: "D/C Mark (D or C) + Currency + Amount",
    example: "EUR0,"
  },
  "36": {
    tag: "36",
    name: "Exchange Rate",
    description: "The exchange rate applied when converting from the instructed currency (field :33B:) to the settlement currency (field :32A:).",
    format: "12d",
    formatHuman: "Up to 12 characters with comma as decimal separator",
    example: "1,1765"
  },
  "50A": {
    tag: "50A",
    name: "Ordering Customer (BIC)",
    description: "The customer who is ordering the credit transfer, identified by their BIC. This party initiates and funds the payment.",
    format: "[/34x]\\n4!a2!a2!c[3!c]",
    formatHuman: "Optional /account-number on first line, BIC (8 or 11 chars) on second line",
    example: "/DE12345678901234567890\nDEUTDEDBFRA"
  },
  "50F": {
    tag: "50F",
    name: "Ordering Customer (Structured Name/Address)",
    description: "The customer who is ordering the credit transfer, in structured format with coded address components. Preferred for compliance and STP.",
    format: "35x\\n4*35x",
    formatHuman: "Party identifier on line 1, then up to 4 structured address lines (1/Name, 2/Address, 3/CountryCode/Town, 4/BirthDate+BirthPlace or NationalID)",
    example: "/DE89370400440532013000\n1/ACME CORPORATION GMBH\n2/HAUPTSTRASSE 12\n3/DE/FRANKFURT AM MAIN"
  },
  "50K": {
    tag: "50K",
    name: "Ordering Customer (Name and Address)",
    description: "The customer who is ordering the credit transfer, identified by name and address in free format.",
    format: "[/34x]\\n4*35x",
    formatHuman: "Optional /account-number on first line, up to 4 free-text name/address lines",
    example: "/DE89370400440532013000\nACME CORPORATION GMBH\nHAUPTSTRASSE 12\nFRANKFURT AM MAIN GERMANY"
  },
  "51A": {
    tag: "51A",
    name: "Sending Institution",
    description: "The financial institution that sent this payment on behalf of the ordering customer. Present when different from the Sender of the MT103.",
    format: "[/1!a][/34x]\\n4!a2!a2!c[3!c]",
    formatHuman: "Optional /party-identifier-code and /account, then BIC on next line",
    example: "DEUTDEFFXXX"
  },
  "52A": {
    tag: "52A",
    name: "Ordering Institution (BIC)",
    description: "The financial institution ordering the credit transfer on behalf of the ordering customer, identified by BIC.",
    format: "[/1!a][/34x]\\n4!a2!a2!c[3!c]",
    formatHuman: "Optional /party-identifier and /account, then BIC on next line",
    example: "/DE89370400440532013000\nDEUTDEDB"
  },
  "52D": {
    tag: "52D",
    name: "Ordering Institution (Name and Address)",
    description: "The financial institution ordering the credit transfer on behalf of the ordering customer, identified by name and address.",
    format: "[/1!a][/34x]\\n4*35x",
    formatHuman: "Optional /account on first line, up to 4 lines of name and address",
    example: "/DE12345678\nDEUTSCHE BANK AG\nFRANKFURT AM MAIN\nGERMANY"
  },
  "53A": {
    tag: "53A",
    name: "Sender's Correspondent (BIC)",
    description: "The branch or affiliate of the Sender through which the Sender will reimburse the Receiver for the payment, identified by BIC.",
    format: "[/1!a][/34x]\\n4!a2!a2!c[3!c]",
    formatHuman: "Optional /party-identifier and /account, then BIC on next line",
    example: "CHASUS33XXX"
  },
  "53B": {
    tag: "53B",
    name: "Sender's Correspondent (Location)",
    description: "The branch or affiliate of the Sender through which the Sender will reimburse the Receiver, identified by location.",
    format: "[/1!a][/34x]\\n[35x]",
    formatHuman: "Optional /party-identifier and /account, then location name on next line",
    example: "/NEW YORK"
  },
  "53D": {
    tag: "53D",
    name: "Sender's Correspondent (Name and Address)",
    description: "The branch or affiliate of the Sender through which the Sender will reimburse the Receiver, identified by name and address.",
    format: "[/1!a][/34x]\\n4*35x",
    formatHuman: "Optional /account on first line, up to 4 lines of name and address",
    example: "JPMORGAN CHASE BANK NA\nNEW YORK NY USA"
  },
  "54A": {
    tag: "54A",
    name: "Receiver's Correspondent (BIC)",
    description: "The branch or affiliate of the Receiver through which the Receiver will receive the funds, identified by BIC.",
    format: "[/1!a][/34x]\\n4!a2!a2!c[3!c]",
    formatHuman: "Optional /party-identifier and /account, then BIC on next line",
    example: "CHASUS33XXX"
  },
  "54B": {
    tag: "54B",
    name: "Receiver's Correspondent (Location)",
    description: "The branch or affiliate of the Receiver through which the Receiver will receive the funds, identified by location.",
    format: "[/1!a][/34x]\\n[35x]",
    formatHuman: "Optional /account identifier, then location",
    example: "/NEW YORK"
  },
  "54D": {
    tag: "54D",
    name: "Receiver's Correspondent (Name and Address)",
    description: "The branch or affiliate of the Receiver through which the Receiver will receive the funds, identified by name and address.",
    format: "[/1!a][/34x]\\n4*35x",
    formatHuman: "Optional /account on first line, up to 4 lines of name and address",
    example: "CITIBANK NA\nNEW YORK NY USA"
  },
  "55A": {
    tag: "55A",
    name: "Third Reimbursement Institution (BIC)",
    description: "Institution through which Sender will reimburse the Receiver, when different from the Sender's Correspondent (field 53). Identified by BIC.",
    format: "[/1!a][/34x]\\n4!a2!a2!c[3!c]",
    formatHuman: "Optional /party-identifier and /account, then BIC on next line",
    example: "BNPAFRPPXXX"
  },
  "55B": {
    tag: "55B",
    name: "Third Reimbursement Institution (Location)",
    description: "Institution through which Sender will reimburse the Receiver, identified by location.",
    format: "[/1!a][/34x]\\n[35x]",
    formatHuman: "Optional /account identifier, then location",
    example: "/PARIS"
  },
  "55D": {
    tag: "55D",
    name: "Third Reimbursement Institution (Name and Address)",
    description: "Institution through which Sender will reimburse the Receiver, identified by name and address.",
    format: "[/1!a][/34x]\\n4*35x",
    formatHuman: "Optional /account on first line, up to 4 lines of name and address",
    example: "BNP PARIBAS\n16 BOULEVARD DES ITALIENS\nPARIS FRANCE"
  },
  "56A": {
    tag: "56A",
    name: "Intermediary Institution (BIC)",
    description: "Financial institution between the Account With Institution and the Receiver, through which the transaction must pass. Identified by BIC.",
    format: "[/1!a][/34x]\\n4!a2!a2!c[3!c]",
    formatHuman: "Optional /party-identifier and /account, then BIC on next line",
    example: "BNPAFRPPXXX"
  },
  "56C": {
    tag: "56C",
    name: "Intermediary Institution (Account)",
    description: "Financial institution between the Account With Institution and the Receiver, identified by account number only.",
    format: "/34x",
    formatHuman: "Account number prefixed with /",
    example: "/FR1420041010050500013M02606"
  },
  "56D": {
    tag: "56D",
    name: "Intermediary Institution (Name and Address)",
    description: "Financial institution between the Account With Institution and the Receiver, identified by name and address.",
    format: "[/1!a][/34x]\\n4*35x",
    formatHuman: "Optional /account on first line, up to 4 lines of name and address",
    example: "BNP PARIBAS\n10 HAREWOOD AVENUE\nLONDON UK"
  },
  "57A": {
    tag: "57A",
    name: "Account With Institution (BIC)",
    description: "The financial institution at which the beneficiary customer holds the account to be credited, identified by BIC.",
    format: "[/1!a][/34x]\\n4!a2!a2!c[3!c]",
    formatHuman: "Optional /party-identifier and /account, then BIC on next line",
    example: "/GB29NWBK60161331926819\nBARCGB22XXX"
  },
  "57B": {
    tag: "57B",
    name: "Account With Institution (Location)",
    description: "The financial institution at which the beneficiary holds their account, identified by location.",
    format: "[/1!a][/34x]\\n[35x]",
    formatHuman: "Optional /account identifier, then location name",
    example: "/LONDON"
  },
  "57C": {
    tag: "57C",
    name: "Account With Institution (Account)",
    description: "The financial institution at which the beneficiary holds their account, identified by account number.",
    format: "/34x",
    formatHuman: "Account number prefixed with /",
    example: "/GB29NWBK60161331926819"
  },
  "57D": {
    tag: "57D",
    name: "Account With Institution (Name and Address)",
    description: "The financial institution at which the beneficiary customer holds the account to be credited, identified by name and address.",
    format: "[/1!a][/34x]\\n4*35x",
    formatHuman: "Optional /account on first line, up to 4 lines of name and address",
    example: "/GB29NWBK60161331926819\nBARCLAYS BANK PLC\n1 CHURCHILL PLACE\nLONDON UK"
  },
  "58A": {
    tag: "58A",
    name: "Beneficiary Institution (BIC)",
    description: "The institution that receives the transfer for its own account. Used in interbank transfers (MT202). Identified by BIC.",
    format: "[/1!a][/34x]\\n4!a2!a2!c[3!c]",
    formatHuman: "Optional /party-identifier and /account, then BIC on next line",
    example: "/GB29NWBK60161331926819\nBARCGB22"
  },
  "58D": {
    tag: "58D",
    name: "Beneficiary Institution (Name and Address)",
    description: "The institution that receives the transfer for its own account, identified by name and address.",
    format: "[/1!a][/34x]\\n4*35x",
    formatHuman: "Optional /account on first line, up to 4 lines of name and address",
    example: "BARCLAYS BANK PLC\n1 CHURCHILL PLACE\nLONDON UK"
  },
  "59": {
    tag: "59",
    name: "Beneficiary Customer",
    description: "The customer who is the ultimate recipient of the credit transfer, identified by account and name/address.",
    format: "[/34x]\\n4*35x",
    formatHuman: "Optional /account-number on first line, up to 4 lines of name and address",
    example: "/GB29NWBK60161331926819\nJOHN DOE\n10 DOWNING STREET\nLONDON UK"
  },
  "59A": {
    tag: "59A",
    name: "Beneficiary Customer (BIC)",
    description: "The ultimate beneficiary customer, identified by account and BIC.",
    format: "[/34x]\\n4!a2!a2!c[3!c]",
    formatHuman: "Optional /account-number on first line, BIC on second line",
    example: "/GB29NWBK60161331926819\nBARCGB22"
  },
  "59F": {
    tag: "59F",
    name: "Beneficiary Customer (Structured)",
    description: "The ultimate beneficiary customer in structured format, preferred for compliance, AML screening, and STP processing.",
    format: "[/34x]\\n4*35x",
    formatHuman: "Optional /account on first line, then structured lines: 1/Name, 2/Address, 3/CountryCode/Town, 4/CountryCode",
    example: "/GB29NWBK60161331926819\n1/JOHN DOE\n2/10 DOWNING STREET\n3/GB/LONDON",
    notes: "The structured format improves straight-through processing and sanctions screening. Line codes: 1=Name, 2=Address line, 3=Country/City, 4=Country of birth/National ID."
  },
  "60F": {
    tag: "60F",
    name: "Opening Balance (Final)",
    description: "The opening balance of the account at the start of the statement period. 'F' indicates this is the final (confirmed) balance.",
    format: "1!a6!n3!a15d",
    formatHuman: "D/C indicator (D=Debit, C=Credit) + Date (YYMMDD) + Currency (ISO 4217) + Amount (comma decimal)",
    example: "C241001EUR50000,00",
    notes: "D = account is in debit (overdrawn). C = account is in credit."
  },
  "60M": {
    tag: "60M",
    name: "Opening Balance (Intermediate)",
    description: "The opening balance for this message in a multi-message statement. 'M' indicates an intermediate (non-final) balance.",
    format: "1!a6!n3!a15d",
    formatHuman: "D/C indicator (D=Debit, C=Credit) + Date (YYMMDD) + Currency + Amount (comma decimal)",
    example: "C241001EUR50000,00"
  },
  "61": {
    tag: "61",
    name: "Statement Line",
    description: "A single transaction entry in the account statement. Contains value date, debit/credit indicator, amount, transaction reference, and optional narrative.",
    format: "6!n[4!n]2a[1!a]15d1!a3!c[//16x][\\n34x]",
    formatHuman: "Value date (YYMMDD) + [Entry date (MMDD)] + D/C mark + [Funds code] + Amount + Transaction type (3 chars starting N/S/F) + [//internal-ref] + [\\nadditional-ref]",
    example: "2410011001CR1000,00NTRF//TXNREF2024001\nCUSTOMERREF001",
    notes: "D/C marks: D=Debit, C=Credit, RD=Reversal Debit, RC=Reversal Credit. Funds code (3rd char of D/C field): blank=same currency, letter=converted currency. Transaction type: N=non-SWIFT, S=SWIFT, F=First advice."
  },
  "62F": {
    tag: "62F",
    name: "Closing Balance (Final)",
    description: "The closing balance of the account at the end of the statement period. 'F' indicates this is the final (confirmed) balance.",
    format: "1!a6!n3!a15d",
    formatHuman: "D/C indicator (D=Debit, C=Credit) + Date (YYMMDD) + Currency (ISO 4217) + Amount (comma decimal)",
    example: "C241001EUR52000,00"
  },
  "62M": {
    tag: "62M",
    name: "Closing Balance (Intermediate)",
    description: "The closing balance for this message in a multi-message statement. 'M' indicates an intermediate balance.",
    format: "1!a6!n3!a15d",
    formatHuman: "D/C indicator (D=Debit, C=Credit) + Date (YYMMDD) + Currency + Amount (comma decimal)",
    example: "C241001EUR52000,00"
  },
  "63": {
    tag: "63",
    name: "Closing Available Balance",
    description: "The closing available balance at the end of the statement period.",
    format: "1!a6!n3!a15d",
    formatHuman: "D/C indicator + Date (YYMMDD) + Currency + Amount",
    example: "C241001EUR48000,00"
  },
  "64": {
    tag: "64",
    name: "Available Balance",
    description: "The balance that is immediately available for use at the end of the reporting period, after considering value-dated items.",
    format: "1!a6!n3!a15d",
    formatHuman: "D/C indicator (D=Debit, C=Credit) + Date (YYMMDD) + Currency + Amount",
    example: "C241001EUR48000,00"
  },
  "65": {
    tag: "65",
    name: "Forward Available Balance",
    description: "The balance that will be available on a future date, after pending items clear. Used for liquidity planning.",
    format: "1!a6!n3!a15d",
    formatHuman: "D/C indicator + Future date (YYMMDD) + Currency + Amount",
    example: "C241005EUR55000,00"
  },
  "70": {
    tag: "70",
    name: "Remittance Information",
    description: "Free-format information about the reason for the payment, passed from the ordering customer through to the beneficiary customer.",
    format: "4*35x",
    formatHuman: "Up to 4 lines of 35 characters each",
    example: "INVOICE INV-2024-12345\nDATED 2024-10-01\nPURCHASE ORDER PO-67890"
  },
  "71A": {
    tag: "71A",
    name: "Details of Charges",
    description: "Specifies which party bears the bank transaction charges for this payment.",
    format: "3!a",
    formatHuman: "Exactly 3 uppercase letters",
    example: "SHA",
    validValues: ["BEN", "OUR", "SHA"],
    notes: "BEN: All charges (sender's bank + receiver's bank + intermediaries) are paid by the beneficiary — deducted from the payment amount. OUR: All charges are paid by the ordering customer. SHA: Shared — ordering customer pays sender's bank charges, beneficiary pays all other bank charges."
  },
  "71F": {
    tag: "71F",
    name: "Sender's Charges",
    description: "Charges deducted by the Sender's financial institution from the transfer amount. Included when :71A: is BEN.",
    format: "3!a15d",
    formatHuman: "Currency code (ISO 4217, 3 letters) + Amount (comma decimal)",
    example: "EUR25,00"
  },
  "71G": {
    tag: "71G",
    name: "Receiver's Charges",
    description: "Charges to be deducted by the Receiver's financial institution. Included when :71A: is BEN.",
    format: "3!a15d",
    formatHuman: "Currency code (ISO 4217, 3 letters) + Amount (comma decimal)",
    example: "USD30,00"
  },
  "72": {
    tag: "72",
    name: "Sender to Receiver Information",
    description: "Information for the receiving and/or other financial institutions in the payment chain. This information is NOT passed to the beneficiary customer.",
    format: "6*35x",
    formatHuman: "Up to 6 lines of 35 characters each. Structured using /CODE/ prefixes.",
    example: "/BNF/FOR CREDIT TO ACCOUNT OF\n/ACC/SUBSIDIARY COMPANY\n/INS/PLEASE CREDIT SAME DAY",
    notes: "Common codes: /BNF/ = information for the beneficiary bank, /ACC/ = account information, /INS/ = special instructions, /INT/ = intermediary details."
  },
  "77B": {
    tag: "77B",
    name: "Regulatory Reporting",
    description: "Regulatory or statutory reporting information required by the laws of the ordering customer's or beneficiary's country.",
    format: "3*35x",
    formatHuman: "Up to 3 lines of 35 characters. Format: /COUNTRY/NARRATIVE or /CODEWORD/DETAILS",
    example: "/BENEFRES/US//TX\n/ORDERRES/DE/",
    notes: "Required for cross-border payments in many jurisdictions. Format varies by country regulations."
  },
  "77T": {
    tag: "77T",
    name: "Envelope Contents",
    description: "The complete embedded SWIFT message, used when forwarding or encapsulating another message.",
    format: "73z",
    formatHuman: "Up to 73 lines of free-format text"
  },
  "79": {
    tag: "79",
    name: "Narrative Description of Purpose",
    description: "Free-format narrative providing additional information about the purpose or context of the message.",
    format: "35*50x",
    formatHuman: "Up to 35 lines of 50 characters each"
  },
  "82A": {
    tag: "82A",
    name: "Party A (BIC) — Guarantor/Applicant",
    description: "Party A in a bilateral agreement, identified by BIC.",
    format: "[/1!a][/34x]\\n4!a2!a2!c[3!c]",
    formatHuman: "Optional /party-identifier, then BIC",
    example: "DEUTDEFFXXX"
  },
  "83A": {
    tag: "83A",
    name: "Fund/Account Owner (BIC)",
    description: "The owner of the funds or account, identified by BIC.",
    format: "[/1!a][/34x]\\n4!a2!a2!c[3!c]",
    formatHuman: "Optional /account and party-identifier, then BIC",
    example: "BNPAFRPPXXX"
  },
  "86": {
    tag: "86",
    name: "Information to Account Owner",
    description: "Additional information about the statement line (field :61:) for the account owner. NOT forwarded in the payment chain. Used for reconciliation.",
    format: "6*65x",
    formatHuman: "Up to 6 lines of 65 characters each. May contain structured subfields like /EREF/, /CREF/, /REMI/.",
    example: "PAYMENT FROM ACME CORP GMBH\nINVOICE INV-2024-12345\nPURCHASE ORDER PO-67890",
    notes: "This field follows field :61: and provides additional context for the transaction. Common ISO 20022-mapped subfields: /EREF/ end-to-end ref, /CREF/ creditor ref, /REMI/ remittance information."
  },
  "90C": {
    tag: "90C",
    name: "Number and Sum of Credits",
    description: "Total count and aggregate amount of all credit entries in the statement or report.",
    format: "5n3!a15d",
    formatHuman: "Count (up to 5 digits) + Currency + Total amount (comma decimal)",
    example: "00010EUR15000,00"
  },
  "90D": {
    tag: "90D",
    name: "Number and Sum of Debits",
    description: "Total count and aggregate amount of all debit entries in the statement or report.",
    format: "5n3!a15d",
    formatHuman: "Count (up to 5 digits) + Currency + Total amount (comma decimal)",
    example: "00003EUR8500,00"
  },
  "12": {
    tag: "12",
    name: "Sub-Message Type",
    description: "Identifies the type of individual message within a multiple-message container (e.g., 103 inside MT102).",
    format: "3!n",
    formatHuman: "3-digit message type number",
    example: "103"
  },
  "19": {
    tag: "19",
    name: "Sum of Amounts",
    description: "The sum of all individual amounts in the message. Used as a control total for validation.",
    format: "17d",
    formatHuman: "Amount with comma decimal (up to 17 characters)",
    example: "50000,00"
  },
  "21C": {
    tag: "21C",
    name: "Reference of the Individual Settlement",
    description: "Reference assigned by the sender to the individual settlement instruction.",
    format: "16x",
    formatHuman: "Up to 16 alphanumeric/special characters",
    example: "SETTREF001"
  },
  "21D": {
    tag: "21D",
    name: "Reference of the Direct Debit",
    description: "Reference of the original direct debit instruction.",
    format: "16x",
    formatHuman: "Up to 16 alphanumeric/special characters",
    example: "DDREF001"
  },
  "21E": {
    tag: "21E",
    name: "Related Reference of Individual Transfer",
    description: "Reference that links this individual transfer to another message or instruction.",
    format: "16x",
    formatHuman: "Up to 16 alphanumeric/special characters",
    example: "RELREF001"
  },
  "21F": {
    tag: "21F",
    name: "FIN Copy Service Reference",
    description: "Reference to the FIN Copy service used for this message.",
    format: "16x",
    formatHuman: "Up to 16 alphanumeric/special characters",
    example: "FINREF001"
  },
  "21R": {
    tag: "21R",
    name: "Related Reference of Individual Transfer",
    description: "The reference assigned by the sender to link this transfer to a related message.",
    format: "16x",
    formatHuman: "Up to 16 alphanumeric/special characters",
    example: "RELREF20240001"
  },
  "22A": {
    tag: "22A",
    name: "Type of Operation",
    description: "Indicates the type of operation: new, amendment, cancellation, or duplicate.",
    format: "4!c",
    formatHuman: "4-letter code",
    example: "NEWT",
    validValues: ["AMND", "CANC", "DUPL", "NEWT"]
  },
  "22B": {
    tag: "22B",
    name: "Type of Event",
    description: "Specifies the type of event related to the transaction.",
    format: "4!c",
    formatHuman: "4-letter code",
    example: "CONF"
  },
  "22C": {
    tag: "22C",
    name: "Common Reference",
    description: "A reference shared between both parties to a trade, built from components of each party's identifiers.",
    format: "4!a2!c4!a2!c",
    formatHuman: "Party A prefix (4 chars) + Party A suffix (2 chars) + Party B prefix (4 chars) + Party B suffix (2 chars)",
    example: "DEUT33CHAS22"
  },
  "22D": {
    tag: "22D",
    name: "Type/Title of Guarantee",
    description: "Indicates the type of guarantee or standby letter of credit.",
    format: "4!c",
    formatHuman: "4-letter code",
    example: "DGAR"
  },
  "22K": {
    tag: "22K",
    name: "Type of Event",
    description: "Specifies the type of event in a guarantee or standby LC lifecycle.",
    format: "4!c[/35x]",
    formatHuman: "4-letter code, optionally /additional info",
    example: "ISSU"
  },
  "23": {
    tag: "23",
    name: "Further Identification",
    description: "Further identification of the message type or transaction. Used in documentary credits and guarantees.",
    format: "16x",
    formatHuman: "Up to 16 alphanumeric characters",
    example: "ISSUE"
  },
  "27": {
    tag: "27",
    name: "Sequence of Total",
    description: "Indicates the sequence number of this message within a series and the total number of messages.",
    format: "1!n/1!n",
    formatHuman: "Sequence/Total (e.g., 1/1 = first and only message, 1/3 = first of three)",
    example: "1/1"
  },
  "29A": {
    tag: "29A",
    name: "Contact Information",
    description: "Contact details (name, phone, fax) of the party to contact regarding this transaction.",
    format: "4*35x",
    formatHuman: "Up to 4 lines of 35 characters each",
    example: "JOHN SMITH\nPHONE +44-20-12345678"
  },
  "30": {
    tag: "30",
    name: "Date",
    description: "A date relevant to the message context — execution date for requests, value date for payments.",
    format: "6!n",
    formatHuman: "Date in YYMMDD format",
    example: "241015"
  },
  "30T": {
    tag: "30T",
    name: "Trade Date",
    description: "The date on which the trade was agreed upon between the parties.",
    format: "8!n",
    formatHuman: "Date in YYYYMMDD format",
    example: "20241001"
  },
  "30V": {
    tag: "30V",
    name: "Value Date",
    description: "The date on which the funds are to be made available to the beneficiary.",
    format: "8!n",
    formatHuman: "Date in YYYYMMDD format",
    example: "20241003"
  },
  "30X": {
    tag: "30X",
    name: "Expiry Date",
    description: "The date on which the option or contract expires.",
    format: "8!n",
    formatHuman: "Date in YYYYMMDD format",
    example: "20241231"
  },
  "30P": {
    tag: "30P",
    name: "Payment Date",
    description: "The date on which a payment is due.",
    format: "8!n",
    formatHuman: "Date in YYYYMMDD format",
    example: "20241015"
  },
  "30F": {
    tag: "30F",
    name: "Final Payment Date",
    description: "The maturity or final payment date of a loan or deposit.",
    format: "8!n",
    formatHuman: "Date in YYYYMMDD format",
    example: "20251001"
  },
  "31C": {
    tag: "31C",
    name: "Date of Issue",
    description: "The date on which the documentary credit, guarantee, or standby LC was issued.",
    format: "6!n",
    formatHuman: "Date in YYMMDD format",
    example: "241001"
  },
  "31D": {
    tag: "31D",
    name: "Date and Place of Expiry",
    description: "The date and place at which the documentary credit expires.",
    format: "6!n29x",
    formatHuman: "Date (YYMMDD) followed by place of expiry (up to 29 chars)",
    example: "250101LONDON"
  },
  "31E": {
    tag: "31E",
    name: "Date of Expiry",
    description: "The date on which the guarantee or standby LC expires.",
    format: "6!n",
    formatHuman: "Date in YYMMDD format",
    example: "250101"
  },
  "33A": {
    tag: "33A",
    name: "Currency / Instructed Amount (with Date)",
    description: "The instructed currency, amount, and date for the payment.",
    format: "6!n3!a15d",
    formatHuman: "Date (YYMMDD) + Currency (ISO 4217) + Amount (comma decimal)",
    example: "241001USD50000,00"
  },
  "33K": {
    tag: "33K",
    name: "Currency / Instructed Amount (Summary)",
    description: "Summary currency and instructed amount in collection messages.",
    format: "3!a15d",
    formatHuman: "Currency (ISO 4217) + Amount (comma decimal)",
    example: "USD50000,00"
  },
  "34E": {
    tag: "34E",
    name: "Currency / Negative Interim Interest Amount",
    description: "Specifies the currency and amount of negative interim interest.",
    format: "1!a3!a15d",
    formatHuman: "N (negative indicator) + Currency + Amount",
    example: "NUSD250,00"
  },
  "37G": {
    tag: "37G",
    name: "Deal Price / Rate",
    description: "The exchange rate or price applied to the deal.",
    format: "[N]12d",
    formatHuman: "Optional N (negative) + rate with comma decimal (up to 12 chars)",
    example: "1,12345"
  },
  "37M": {
    tag: "37M",
    name: "Interest Rate for Additional Amounts",
    description: "The interest rate applicable to additional amounts.",
    format: "[N]12d",
    formatHuman: "Optional N (negative) + rate with comma decimal",
    example: "5,25"
  },
  "37R": {
    tag: "37R",
    name: "Rate / Price",
    description: "The rate or price applicable to the transaction.",
    format: "[N]12d",
    formatHuman: "Optional N (negative) + rate with comma decimal",
    example: "1,09875"
  },
  "38A": {
    tag: "38A",
    name: "Period of Notice",
    description: "The notice period required for early termination or drawdown of a loan/deposit.",
    format: "1!n/4!c",
    formatHuman: "Number/unit (e.g., 7/DAYS, 1/MNTH, 1/YEAR)",
    example: "7/DAYS"
  },
  "38D": {
    tag: "38D",
    name: "Number of Days / Period",
    description: "The number of days or the period for interest calculation.",
    format: "4!n",
    formatHuman: "Number of days (up to 4 digits)",
    example: "0030"
  },
  "39A": {
    tag: "39A",
    name: "Percentage Credit Amount Tolerance",
    description: "The positive and negative percentage tolerance for the credit amount in a documentary credit.",
    format: "2n/2n",
    formatHuman: "Plus tolerance/Minus tolerance (e.g., 05/05 = ±5%)",
    example: "05/05"
  },
  "39B": {
    tag: "39B",
    name: "Maximum Credit Amount",
    description: "Indicates whether the credit amount is a maximum ('NOT EXCEEDING').",
    format: "13x",
    formatHuman: "'NOT EXCEEDING' or blank",
    example: "NOT EXCEEDING"
  },
  "39C": {
    tag: "39C",
    name: "Additional Amounts Covered",
    description: "Additional amounts covered under the documentary credit (insurance, freight, interest, etc.).",
    format: "4*35x",
    formatHuman: "Up to 4 lines of 35 characters each",
    example: "INSURANCE AND FREIGHT"
  },
  "39M": {
    tag: "39M",
    name: "Number of Days Accrued",
    description: "The number of days for which interest has accrued.",
    format: "4!n",
    formatHuman: "Number of days (up to 4 digits)",
    example: "0030"
  },
  "40A": {
    tag: "40A",
    name: "Form of Documentary Credit",
    description: "Specifies whether the documentary credit is irrevocable, revocable, irrevocable transferable, etc.",
    format: "24x",
    formatHuman: "Code for form of credit",
    example: "IRREVOCABLE",
    validValues: ["IRREVOCABLE", "REVOCABLE", "IRREVOC TRANSFERABLE", "IRREVOCABLE STANDBY"]
  },
  "40C": {
    tag: "40C",
    name: "Applicable Rules",
    description: "The rules governing the documentary credit or guarantee.",
    format: "4!c[/35x]",
    formatHuman: "4-letter code optionally /details",
    example: "UCPURR",
    validValues: ["UCPURR", "EUCP", "OTHR", "UCP LATEST VERSION", "ISP LATEST VERSION"]
  },
  "40E": {
    tag: "40E",
    name: "Applicable Rules",
    description: "The rules applicable to the documentary credit or guarantee (extended format).",
    format: "30x[/35x]",
    formatHuman: "Rule code, optionally /narrative",
    example: "UCP LATEST VERSION"
  },
  "41A": {
    tag: "41A",
    name: "Available With ... By ... (BIC)",
    description: "The bank with which the credit is available and the method of availability, identified by BIC.",
    format: "[/1!a][/34x]\\n4!a2!a2!c[3!c]\\n28x",
    formatHuman: "Optional /account, BIC on next line, availability method on last line",
    example: "BNPAFRPPXXX\nBY NEGOTIATION"
  },
  "41D": {
    tag: "41D",
    name: "Available With ... By ... (Name and Address)",
    description: "The bank with which the credit is available and the method of availability, identified by name/address.",
    format: "[/1!a][/34x]\\n4*35x\\n28x",
    formatHuman: "Optional /account, bank name/address, then availability method",
    example: "BNP PARIBAS\nPARIS FRANCE\nBY ACCEPTANCE"
  },
  "42A": {
    tag: "42A",
    name: "Drawee (BIC)",
    description: "The bank on which drafts must be drawn, identified by BIC.",
    format: "[/1!a][/34x]\\n4!a2!a2!c[3!c]",
    formatHuman: "Optional /account, then BIC",
    example: "BNPAFRPPXXX"
  },
  "42C": {
    tag: "42C",
    name: "Drafts at",
    description: "The tenor of drafts to be drawn under the documentary credit.",
    format: "3*35x",
    formatHuman: "Up to 3 lines of 35 characters describing draft tenor",
    example: "90 DAYS AFTER SIGHT"
  },
  "42D": {
    tag: "42D",
    name: "Drawee (Name and Address)",
    description: "The bank on which drafts must be drawn, identified by name and address.",
    format: "[/1!a][/34x]\\n4*35x",
    formatHuman: "Optional /account, then up to 4 lines name/address",
    example: "BNP PARIBAS\nPARIS FRANCE"
  },
  "42M": {
    tag: "42M",
    name: "Mixed Payment Details",
    description: "Details of a mixed payment arrangement under the documentary credit.",
    format: "4*35x",
    formatHuman: "Up to 4 lines of 35 characters",
    example: "50 PCT SIGHT 50 PCT 90 DAYS"
  },
  "42P": {
    tag: "42P",
    name: "Deferred Payment Details",
    description: "Details of the deferred payment terms under the documentary credit.",
    format: "4*35x",
    formatHuman: "Up to 4 lines of 35 characters",
    example: "180 DAYS AFTER DATE OF SHIPMENT"
  },
  "43P": {
    tag: "43P",
    name: "Partial Shipments",
    description: "Indicates whether partial shipments are allowed or prohibited.",
    format: "11x",
    formatHuman: "ALLOWED or NOT ALLOWED",
    example: "ALLOWED",
    validValues: ["ALLOWED", "NOT ALLOWED", "CONDITIONAL"]
  },
  "43T": {
    tag: "43T",
    name: "Transhipment",
    description: "Indicates whether transhipment is allowed or prohibited.",
    format: "11x",
    formatHuman: "ALLOWED or NOT ALLOWED",
    example: "NOT ALLOWED",
    validValues: ["ALLOWED", "NOT ALLOWED"]
  },
  "44A": {
    tag: "44A",
    name: "Place of Taking in Charge / Dispatch from / Place of Receipt",
    description: "The place where the goods are taken in charge or dispatched.",
    format: "65x",
    formatHuman: "Place name (up to 65 characters)",
    example: "SHANGHAI CHINA"
  },
  "44B": {
    tag: "44B",
    name: "Place of Final Destination / For Transportation to / Place of Delivery",
    description: "The final destination for the goods.",
    format: "65x",
    formatHuman: "Place name (up to 65 characters)",
    example: "HAMBURG GERMANY"
  },
  "44C": {
    tag: "44C",
    name: "Latest Date of Shipment",
    description: "The latest date by which shipment must take place.",
    format: "6!n",
    formatHuman: "Date in YYMMDD format",
    example: "241231"
  },
  "44D": {
    tag: "44D",
    name: "Shipment Period",
    description: "The period during which shipment must take place (when a specific date is not applicable).",
    format: "6*65x",
    formatHuman: "Up to 6 lines of 65 characters",
    example: "DURING OCTOBER 2024"
  },
  "44E": {
    tag: "44E",
    name: "Port of Loading / Airport of Departure",
    description: "The port of loading or airport of departure for the goods.",
    format: "65x",
    formatHuman: "Port/airport name (up to 65 characters)",
    example: "SHANGHAI PORT"
  },
  "44F": {
    tag: "44F",
    name: "Port of Discharge / Airport of Destination",
    description: "The port of discharge or airport of destination for the goods.",
    format: "65x",
    formatHuman: "Port/airport name (up to 65 characters)",
    example: "HAMBURG PORT"
  },
  "45A": {
    tag: "45A",
    name: "Description of Goods and/or Services",
    description: "Description of the goods and/or services covered by the documentary credit.",
    format: "100*65x",
    formatHuman: "Up to 100 lines of 65 characters",
    example: "10000 MT WIDGET MODEL X-100\nAS PER PROFORMA INVOICE NO. 12345"
  },
  "45B": {
    tag: "45B",
    name: "Description of Goods and/or Services (Continuation)",
    description: "Continuation of the goods/services description when MT701 follows MT700.",
    format: "100*65x",
    formatHuman: "Up to 100 lines of 65 characters",
    example: "CONTINUED FROM PREVIOUS MESSAGE"
  },
  "46A": {
    tag: "46A",
    name: "Documents Required",
    description: "List of documents that must be presented to obtain payment under the documentary credit.",
    format: "100*65x",
    formatHuman: "Up to 100 lines of 65 characters",
    example: "SIGNED COMMERCIAL INVOICE IN 3 ORIGINALS\nFULL SET CLEAN ON BOARD BILLS OF LADING"
  },
  "46B": {
    tag: "46B",
    name: "Documents Required (Continuation)",
    description: "Continuation of documents required when MT701 follows MT700.",
    format: "100*65x",
    formatHuman: "Up to 100 lines of 65 characters",
    example: "CONTINUED FROM PREVIOUS MESSAGE"
  },
  "47A": {
    tag: "47A",
    name: "Additional Conditions",
    description: "Additional conditions applicable to the documentary credit.",
    format: "100*65x",
    formatHuman: "Up to 100 lines of 65 characters",
    example: "ALL DOCUMENTS MUST BE IN ENGLISH\nTHIRD PARTY DOCUMENTS ACCEPTABLE"
  },
  "47B": {
    tag: "47B",
    name: "Additional Conditions (Continuation)",
    description: "Continuation of additional conditions when MT701 follows MT700.",
    format: "100*65x",
    formatHuman: "Up to 100 lines of 65 characters",
    example: "CONTINUED FROM PREVIOUS MESSAGE"
  },
  "48": {
    tag: "48",
    name: "Period for Presentation in Days",
    description: "The number of days after the date of shipment within which documents must be presented.",
    format: "3*35x",
    formatHuman: "Up to 3 lines of 35 characters",
    example: "21 DAYS AFTER DATE OF SHIPMENT"
  },
  "49": {
    tag: "49",
    name: "Confirmation Instructions",
    description: "Instructions regarding whether the advising bank should add its confirmation to the credit.",
    format: "7x",
    formatHuman: "Confirmation instruction code",
    example: "CONFIRM",
    validValues: ["CONFIRM", "MAY ADD", "WITHOUT"]
  },
  "50C": {
    tag: "50C",
    name: "Instructing Party (BIC)",
    description: "The party instructing the ordered institution to execute the payment, identified by BIC.",
    format: "4!a2!a2!c[3!c]",
    formatHuman: "BIC (8 or 11 characters)",
    example: "DEUTDEFFXXX"
  },
  "50G": {
    tag: "50G",
    name: "Instructing Party (FIN ID)",
    description: "The party instructing the ordered institution, identified by FIN identifier.",
    format: "/34x\\n4!a2!a2!c[3!c]",
    formatHuman: "/account on first line, BIC on second",
    example: "/DE89370400440532013000\nDEUTDEFF"
  },
  "50H": {
    tag: "50H",
    name: "Instructing Party (Name and Address)",
    description: "The party instructing the ordered institution, identified by name and address.",
    format: "/34x\\n4*35x",
    formatHuman: "/account on first line, up to 4 lines name/address",
    example: "/DE89370400440532013000\nACME CORP GMBH\nFRANKFURT"
  },
  "50L": {
    tag: "50L",
    name: "Instructing Party (Identifier)",
    description: "The party instructing the ordered institution, identified by a party identifier.",
    format: "35x",
    formatHuman: "Party identifier (up to 35 characters)",
    example: "ACMECORP"
  },
  "53C": {
    tag: "53C",
    name: "Sender's Correspondent (Account)",
    description: "The Sender's correspondent identified by account number only.",
    format: "/34x",
    formatHuman: "Account number prefixed with /",
    example: "/10085768"
  },
  "71D": {
    tag: "71D",
    name: "Charges",
    description: "Details of charges applicable to the documentary credit or guarantee.",
    format: "6*35x",
    formatHuman: "Up to 6 lines of 35 characters",
    example: "ALL BANKING CHARGES OUTSIDE THE\nISSUING BANK ARE FOR ACCOUNT\nOF THE BENEFICIARY"
  },
  "77A": {
    tag: "77A",
    name: "Narrative",
    description: "Free-format narrative providing additional information.",
    format: "20*35x",
    formatHuman: "Up to 20 lines of 35 characters",
    example: "ADDITIONAL INFORMATION"
  },
  "77C": {
    tag: "77C",
    name: "Band Details / Narrative",
    description: "Details about the guarantee text or standby LC terms.",
    format: "150*65x",
    formatHuman: "Up to 150 lines of 65 characters",
    example: "WE HEREBY ISSUE OUR IRREVOCABLE\nGUARANTEE IN FAVOUR OF..."
  },
  "77D": {
    tag: "77D",
    name: "Regulatory Reporting / Narrative",
    description: "Additional regulatory information or narrative details.",
    format: "6*35x",
    formatHuman: "Up to 6 lines of 35 characters",
    example: "/BENEFRES/US//NEW YORK"
  },
  "77H": {
    tag: "77H",
    name: "Type, Date, Version of the Agreement",
    description: "Identifies the master agreement governing the trade.",
    format: "6!c[/8!n][//4!n]",
    formatHuman: "Agreement type / Date (YYYYMMDD) // Version",
    example: "ISDA/20020101//0001",
    validValues: ["AFB", "BBAIRS", "DERV", "FBF", "FEOMA", "ICOM", "IFEMA", "ISDA", "ISDACN"]
  },
  "77U": {
    tag: "77U",
    name: "Applicable Rules Narrative",
    description: "Narrative text specifying the rules applicable to the guarantee or standby LC.",
    format: "20*35x",
    formatHuman: "Up to 20 lines of 35 characters",
    example: "URDG 758"
  },
  "78": {
    tag: "78",
    name: "Instructions to Paying / Accepting / Negotiating Bank",
    description: "Instructions from the issuing bank to the paying, accepting, or negotiating bank.",
    format: "12*65x",
    formatHuman: "Up to 12 lines of 65 characters",
    example: "UPON RECEIPT OF COMPLYING DOCUMENTS\nWE SHALL REMIT PROCEEDS AS INSTRUCTED"
  },
  "84A": {
    tag: "84A",
    name: "Deal at / Through (BIC)",
    description: "The party through which the deal was made, identified by BIC.",
    format: "[/1!a][/34x]\\n4!a2!a2!c[3!c]",
    formatHuman: "Optional /account, then BIC",
    example: "DEUTDEFFXXX"
  },
  "84B": {
    tag: "84B",
    name: "Deal at / Through (Location)",
    description: "The party through which the deal was made, identified by location.",
    format: "[/1!a][/34x]\\n[35x]",
    formatHuman: "Optional /account, then location",
    example: "/FRANKFURT"
  },
  "84D": {
    tag: "84D",
    name: "Deal at / Through (Name and Address)",
    description: "The party through which the deal was made, identified by name and address.",
    format: "[/1!a][/34x]\\n4*35x",
    formatHuman: "Optional /account, up to 4 lines name/address",
    example: "DEUTSCHE BANK AG\nFRANKFURT"
  },
  "85A": {
    tag: "85A",
    name: "Primary Settlement Instructions (BIC)",
    description: "Settlement instructions for the primary currency, identified by BIC.",
    format: "[/1!a][/34x]\\n4!a2!a2!c[3!c]",
    formatHuman: "Optional /account, then BIC",
    example: "CHASUS33XXX"
  },
  "85B": {
    tag: "85B",
    name: "Primary Settlement Instructions (Location)",
    description: "Settlement instructions for the primary currency, identified by location.",
    format: "[/1!a][/34x]\\n[35x]",
    formatHuman: "Optional /account, then location",
    example: "/NEW YORK"
  },
  "85D": {
    tag: "85D",
    name: "Primary Settlement Instructions (Name and Address)",
    description: "Settlement instructions for the primary currency, identified by name and address.",
    format: "[/1!a][/34x]\\n4*35x",
    formatHuman: "Optional /account, up to 4 lines name/address",
    example: "JPMORGAN CHASE BANK\nNEW YORK"
  },
  "87A": {
    tag: "87A",
    name: "Party B / Receiver (BIC)",
    description: "The second party to a bilateral transaction, or the receiver, identified by BIC.",
    format: "[/1!a][/34x]\\n4!a2!a2!c[3!c]",
    formatHuman: "Optional /account, then BIC",
    example: "BNPAFRPPXXX"
  },
  "87D": {
    tag: "87D",
    name: "Party B / Receiver (Name and Address)",
    description: "The second party to a bilateral transaction, or the receiver, identified by name and address.",
    format: "[/1!a][/34x]\\n4*35x",
    formatHuman: "Optional /account, up to 4 lines name/address",
    example: "BNP PARIBAS\nPARIS FRANCE"
  },
  "88A": {
    tag: "88A",
    name: "Broker (BIC)",
    description: "The broker who arranged the deal, identified by BIC.",
    format: "[/1!a][/34x]\\n4!a2!a2!c[3!c]",
    formatHuman: "Optional /account, then BIC",
    example: "TPBKGB2LXXX"
  },
  "88D": {
    tag: "88D",
    name: "Broker (Name and Address)",
    description: "The broker who arranged the deal, identified by name and address.",
    format: "[/1!a][/34x]\\n4*35x",
    formatHuman: "Optional /account, up to 4 lines name/address",
    example: "TULLETT PREBON\nLONDON UK"
  },
  "15A": {
    tag: "15A",
    name: "New Sequence — Sequence A",
    description: "Marks the beginning of Sequence A (General Information) in a multi-sequence message.",
    format: "",
    formatHuman: "Empty field — used as sequence delimiter only"
  },
  "15B": {
    tag: "15B",
    name: "New Sequence — Sequence B",
    description: "Marks the beginning of Sequence B (Transaction Details / Settlement) in a multi-sequence message.",
    format: "",
    formatHuman: "Empty field — used as sequence delimiter only"
  },
  "15C": {
    tag: "15C",
    name: "New Sequence — Sequence C",
    description: "Marks the beginning of Sequence C (Optional General Information / Reporting) in a multi-sequence message.",
    format: "",
    formatHuman: "Empty field — used as sequence delimiter only"
  },
  "15D": {
    tag: "15D",
    name: "New Sequence — Sequence D",
    description: "Marks the beginning of Sequence D in a multi-sequence message.",
    format: "",
    formatHuman: "Empty field — used as sequence delimiter only"
  },
  "15E": {
    tag: "15E",
    name: "New Sequence — Sequence E",
    description: "Marks the beginning of Sequence E in a multi-sequence message.",
    format: "",
    formatHuman: "Empty field — used as sequence delimiter only"
  },
  "15F": {
    tag: "15F",
    name: "New Sequence — Sequence F",
    description: "Marks the beginning of Sequence F in a multi-sequence message.",
    format: "",
    formatHuman: "Empty field — used as sequence delimiter only"
  },
  "15G": {
    tag: "15G",
    name: "New Sequence — Sequence G",
    description: "Marks the beginning of Sequence G in a multi-sequence message.",
    format: "",
    formatHuman: "Empty field — used as sequence delimiter only"
  },
  "15H": {
    tag: "15H",
    name: "New Sequence — Sequence H",
    description: "Marks the beginning of Sequence H in a multi-sequence message.",
    format: "",
    formatHuman: "Empty field — used as sequence delimiter only"
  },
  "17A": {
    tag: "17A",
    name: "Indicator — Agreement/New Deal",
    description: "Indicates whether this confirmation relates to a new deal or an amendment.",
    format: "1!a",
    formatHuman: "Y (yes) or N (no)",
    example: "Y"
  },
  "17F": {
    tag: "17F",
    name: "Indicator — Non-Deliverable",
    description: "Indicates whether the FX deal is non-deliverable (NDF).",
    format: "1!a",
    formatHuman: "Y (yes) or N (no)",
    example: "N"
  },
  "17I": {
    tag: "17I",
    name: "Indicator — Payment vs Payment",
    description: "Indicates whether the transaction should settle on a payment-versus-payment basis.",
    format: "1!a",
    formatHuman: "Y (yes) or N (no)",
    example: "N"
  },
  "17O": {
    tag: "17O",
    name: "Indicator — Barrier",
    description: "Indicates whether this is a barrier option.",
    format: "1!a",
    formatHuman: "Y (yes) or N (no)",
    example: "N"
  },
  "17R": {
    tag: "17R",
    name: "Indicator — Role of Sender",
    description: "Indicates the role of the sender: buyer or seller.",
    format: "1!a",
    formatHuman: "B (buyer) or S (seller)",
    example: "B"
  },
  "35B": {
    tag: "35B",
    name: "Identification of the Financial Instrument",
    description: "Identifies the security or financial instrument using ISIN or other identification.",
    format: "[ISIN1!e12!c]\\n[4*35x]",
    formatHuman: "Optional ISIN code on first line, up to 4 lines of description",
    example: "ISIN US9128283F69\nUS TREASURY NOTE 2.75 PCT 2028"
  },
  "16R": {
    tag: "16R",
    name: "Start of Block",
    description: "Marks the start of a repeating or optional block/sequence in securities messages.",
    format: "16c",
    formatHuman: "Block identifier (up to 16 chars, e.g., GENL, FIN, LINK, STAT)",
    example: "GENL"
  },
  "16S": {
    tag: "16S",
    name: "End of Block",
    description: "Marks the end of a repeating or optional block/sequence in securities messages.",
    format: "16c",
    formatHuman: "Block identifier matching the corresponding :16R:",
    example: "GENL"
  },
  "22F": {
    tag: "22F",
    name: "Indicator",
    description: "A generic indicator field used in securities messages to convey various coded information.",
    format: "[8c/]4!c",
    formatHuman: "Optional qualifier/ + 4-letter code",
    example: "SETR//TRAD"
  },
  "22H": {
    tag: "22H",
    name: "Indicator",
    description: "An indicator field conveying transaction-related coded information in securities messages.",
    format: "4!c/4!c",
    formatHuman: "Qualifier/Code (e.g., BUSE/BUYI, PAYM/APMT)",
    example: "BUSE/BUYI"
  },
  "36B": {
    tag: "36B",
    name: "Quantity of Financial Instrument",
    description: "Specifies the quantity of the financial instrument (number of shares, face value, etc.).",
    format: "4!c/15d",
    formatHuman: "Qualifier/Amount (e.g., SETT/1000,)",
    example: "SETT/10000,"
  },
  "19A": {
    tag: "19A",
    name: "Amount",
    description: "A qualified amount field used in securities messages for settlement, trade, and other amounts.",
    format: "4!c//[N]3!a15d",
    formatHuman: "Qualifier//[N]Currency Amount (e.g., SETT//USD10000,)",
    example: "SETT//USD10000,"
  },
  "95P": {
    tag: "95P",
    name: "Party (BIC)",
    description: "Identifies a party in a securities transaction by BIC.",
    format: "4!c//4!a2!a2!c[3!c]",
    formatHuman: "Qualifier//BIC (e.g., SELL//DEUTDEFFXXX)",
    example: "SELL//DEUTDEFFXXX"
  },
  "95Q": {
    tag: "95Q",
    name: "Party (Name and Address)",
    description: "Identifies a party in a securities transaction by name and address.",
    format: "4!c//4*35x",
    formatHuman: "Qualifier//Name and address lines",
    example: "SELL//DEUTSCHE BANK AG\nFRANKFURT"
  },
  "95R": {
    tag: "95R",
    name: "Party (Proprietary Code)",
    description: "Identifies a party using a proprietary code.",
    format: "4!c/8c/34x",
    formatHuman: "Qualifier/DataSource/Code",
    example: "DEAG/DTCYID/00099"
  },
  "97A": {
    tag: "97A",
    name: "Account (Safekeeping)",
    description: "Identifies a safekeeping or securities account.",
    format: "4!c//35x",
    formatHuman: "Qualifier//Account number",
    example: "SAFE//123456789"
  },
  "98A": {
    tag: "98A",
    name: "Date",
    description: "A qualified date field used in securities messages.",
    format: "4!c//8!n",
    formatHuman: "Qualifier//Date (YYYYMMDD)",
    example: "SETT//20241001"
  },
  "98C": {
    tag: "98C",
    name: "Date/Time",
    description: "A qualified date and time field used in securities messages.",
    format: "4!c//8!n6!n",
    formatHuman: "Qualifier//Date (YYYYMMDD) + Time (HHMMSS)",
    example: "PREP//20241001120000"
  },
  "98E": {
    tag: "98E",
    name: "Date/Time (with Decimals and UTC Offset)",
    description: "A qualified date and time with decimal seconds and UTC indicator.",
    format: "4!c//8!n6!n[,3n][/[N]2!n[2!n]]",
    formatHuman: "Qualifier//DateTime,decimals/UTCoffset",
    example: "PREP//20241001120000,000/N0100"
  },
  "70E": {
    tag: "70E",
    name: "Narrative",
    description: "Free-format narrative text in securities messages providing additional information.",
    format: "4!c//10*35x",
    formatHuman: "Qualifier//Up to 10 lines of narrative",
    example: "SPRO//TRADE REFERENCE 12345"
  },
  "94B": {
    tag: "94B",
    name: "Place",
    description: "A qualified place code used in securities messages.",
    format: "4!c/[8c]/4!c[/30x]",
    formatHuman: "Qualifier/DataSource/Place code/Narrative",
    example: "SAFE//CUST"
  },
  "94F": {
    tag: "94F",
    name: "Place (BIC)",
    description: "A qualified place identified by BIC, used in securities messages.",
    format: "4!c//4!a2!a2!c[3!c]",
    formatHuman: "Qualifier//BIC",
    example: "SAFE//DEUTDEFFXXX"
  }
};

export const MT_TYPE_DEFS: Record<string, MTTypeDef> = {
  "103": {
    type: "103",
    name: "Single Customer Credit Transfer",
    description: "Instructs a movement of funds from the ordering customer to the beneficiary customer. Both parties are non-financial institutions (corporates, individuals, governments). The standard message for international wire transfers.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "13C", mandatory: false },
      { tag: "23B", mandatory: true },
      { tag: "23E", mandatory: false, repetitive: true },
      { tag: "26T", mandatory: false },
      { tag: "32A", mandatory: true },
      { tag: "33B", mandatory: false },
      { tag: "36",  mandatory: false },
      // One of 50A/F/K is mandatory
      { tag: "50A", mandatory: false, oneOf: ["50A", "50F", "50K"] },
      { tag: "50F", mandatory: false, oneOf: ["50A", "50F", "50K"] },
      { tag: "50K", mandatory: false, oneOf: ["50A", "50F", "50K"] },
      { tag: "51A", mandatory: false },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "53A", mandatory: false },
      { tag: "53B", mandatory: false },
      { tag: "53D", mandatory: false },
      { tag: "54A", mandatory: false },
      { tag: "54B", mandatory: false },
      { tag: "54D", mandatory: false },
      { tag: "55A", mandatory: false },
      { tag: "55B", mandatory: false },
      { tag: "55D", mandatory: false },
      { tag: "56A", mandatory: false },
      { tag: "56C", mandatory: false },
      { tag: "56D", mandatory: false },
      { tag: "57A", mandatory: false },
      { tag: "57B", mandatory: false },
      { tag: "57C", mandatory: false },
      { tag: "57D", mandatory: false },
      // One of 59/59A/59F is mandatory
      { tag: "59",  mandatory: false, oneOf: ["59", "59A", "59F"] },
      { tag: "59A", mandatory: false, oneOf: ["59", "59A", "59F"] },
      { tag: "59F", mandatory: false, oneOf: ["59", "59A", "59F"] },
      { tag: "70",  mandatory: false },
      { tag: "71A", mandatory: true },
      { tag: "71F", mandatory: false },
      { tag: "71G", mandatory: false },
      { tag: "72",  mandatory: false },
      { tag: "77B", mandatory: false }
    ]
  },
  "202": {
    type: "202",
    name: "General Financial Institution Transfer",
    description: "Instructs the movement of funds to the beneficiary institution. Used for bank-to-bank transfers where the beneficiary is a financial institution receiving funds for its own account or for a third-party customer.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "13C", mandatory: false },
      { tag: "32A", mandatory: true },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "53A", mandatory: false },
      { tag: "53B", mandatory: false },
      { tag: "53D", mandatory: false },
      { tag: "54A", mandatory: false },
      { tag: "54B", mandatory: false },
      { tag: "54D", mandatory: false },
      { tag: "56A", mandatory: false },
      { tag: "56D", mandatory: false },
      { tag: "57A", mandatory: false },
      { tag: "57B", mandatory: false },
      { tag: "57D", mandatory: false },
      // One of 58A/D mandatory
      { tag: "58A", mandatory: false, oneOf: ["58A", "58D"] },
      { tag: "58D", mandatory: false, oneOf: ["58A", "58D"] },
      { tag: "72",  mandatory: false }
    ]
  },
  "200": {
    type: "200",
    name: "Financial Institution Transfer for Its Own Account",
    description: "Used by a financial institution to transfer funds to its own account at another financial institution (e.g., nostro funding, liquidity management).",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "13C", mandatory: false },
      { tag: "32A", mandatory: true },
      { tag: "53A", mandatory: false },
      { tag: "53B", mandatory: false },
      { tag: "53D", mandatory: false },
      { tag: "54A", mandatory: false },
      { tag: "54B", mandatory: false },
      { tag: "54D", mandatory: false },
      { tag: "56A", mandatory: false },
      { tag: "56D", mandatory: false },
      { tag: "57A", mandatory: false },
      { tag: "57B", mandatory: false },
      { tag: "57D", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "900": {
    type: "900",
    name: "Confirmation of Debit",
    description: "Sent by an account servicing institution to an account owner to confirm a debit entry to the owner's account. Used for reconciliation purposes.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "25",  mandatory: true },
      { tag: "32A", mandatory: true },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "910": {
    type: "910",
    name: "Confirmation of Credit",
    description: "Sent by an account servicing institution to an account owner to confirm a credit entry to the owner's account. Used for reconciliation and advice of incoming payments.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "25",  mandatory: true },
      { tag: "32A", mandatory: true },
      { tag: "50A", mandatory: false },
      { tag: "50F", mandatory: false },
      { tag: "50K", mandatory: false },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "56A", mandatory: false },
      { tag: "56D", mandatory: false },
      { tag: "57A", mandatory: false },
      { tag: "57D", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "940": {
    type: "940",
    name: "Customer Statement Message",
    description: "Sent by an account servicing institution to an account owner to report the balance and transactions of a customer account. The primary format for bank statement delivery via SWIFT.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "25",  mandatory: true },
      { tag: "28C", mandatory: true },
      { tag: "60F", mandatory: false, oneOf: ["60F", "60M"] },
      { tag: "60M", mandatory: false, oneOf: ["60F", "60M"] },
      { tag: "61",  mandatory: false, repetitive: true },
      { tag: "86",  mandatory: false, repetitive: true },
      { tag: "62F", mandatory: false, oneOf: ["62F", "62M"] },
      { tag: "62M", mandatory: false, oneOf: ["62F", "62M"] },
      { tag: "64",  mandatory: false },
      { tag: "65",  mandatory: false, repetitive: true }
    ]
  },
  "942": {
    type: "942",
    name: "Interim Transaction Report",
    description: "Sent by an account servicing institution to an account owner to report intraday (interim) transaction activity. Used for intraday liquidity monitoring.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "25",  mandatory: true },
      { tag: "28C", mandatory: true },
      { tag: "34F", mandatory: true },
      { tag: "61",  mandatory: false, repetitive: true },
      { tag: "86",  mandatory: false, repetitive: true },
      { tag: "90C", mandatory: false },
      { tag: "90D", mandatory: false }
    ]
  },
  "950": {
    type: "950",
    name: "Statement Message",
    description: "Sent by an account servicing institution to a financial institution (nostro account owner) to report balance and transactions. Similar to MT940 but for nostro/correspondent banking accounts.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "25",  mandatory: true },
      { tag: "28C", mandatory: true },
      { tag: "60F", mandatory: false, oneOf: ["60F", "60M"] },
      { tag: "60M", mandatory: false, oneOf: ["60F", "60M"] },
      { tag: "61",  mandatory: false, repetitive: true },
      { tag: "86",  mandatory: false, repetitive: true },
      { tag: "62F", mandatory: false, oneOf: ["62F", "62M"] },
      { tag: "62M", mandatory: false, oneOf: ["62F", "62M"] }
    ]
  },
  // ── Category 1: Customer Payments & Cheques ──
  "101": {
    type: "101",
    name: "Request for Transfer",
    description: "Sent by a corporate or financial institution to request execution of one or more customer credit transfers on a specified date.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21R", mandatory: false },
      { tag: "28D", mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "25",  mandatory: false },
      { tag: "50C", mandatory: false, oneOf: ["50C", "50L"] },
      { tag: "50L", mandatory: false, oneOf: ["50C", "50L"] },
      { tag: "50F", mandatory: false, oneOf: ["50F", "50G", "50H"] },
      { tag: "50G", mandatory: false, oneOf: ["50F", "50G", "50H"] },
      { tag: "50H", mandatory: false, oneOf: ["50F", "50G", "50H"] },
      { tag: "52A", mandatory: false },
      { tag: "21",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "50F", mandatory: false },
      { tag: "50K", mandatory: false },
      { tag: "56A", mandatory: false },
      { tag: "56C", mandatory: false },
      { tag: "56D", mandatory: false },
      { tag: "57A", mandatory: false },
      { tag: "57C", mandatory: false },
      { tag: "57D", mandatory: false },
      { tag: "59",  mandatory: false, oneOf: ["59", "59A", "59F"] },
      { tag: "59A", mandatory: false, oneOf: ["59", "59A", "59F"] },
      { tag: "59F", mandatory: false, oneOf: ["59", "59A", "59F"] },
      { tag: "33B", mandatory: false },
      { tag: "36",  mandatory: false },
      { tag: "70",  mandatory: false },
      { tag: "71A", mandatory: true },
      { tag: "71F", mandatory: false },
      { tag: "71G", mandatory: false },
      { tag: "77B", mandatory: false },
      { tag: "23E", mandatory: false },
      { tag: "26T", mandatory: false }
    ]
  },
  "102": {
    type: "102",
    name: "Multiple Customer Credit Transfer",
    description: "Instructs multiple customer credit transfers bundled in a single message. Used for batch payments where all transfers share the same ordering customer and value date.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "23",  mandatory: true },
      { tag: "50A", mandatory: false, oneOf: ["50A", "50F", "50K"] },
      { tag: "50F", mandatory: false, oneOf: ["50A", "50F", "50K"] },
      { tag: "50K", mandatory: false, oneOf: ["50A", "50F", "50K"] },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "26T", mandatory: false },
      { tag: "77B", mandatory: false },
      { tag: "71A", mandatory: false },
      { tag: "36",  mandatory: false },
      { tag: "21",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "50A", mandatory: false },
      { tag: "50K", mandatory: false },
      { tag: "52A", mandatory: false },
      { tag: "57A", mandatory: false },
      { tag: "57C", mandatory: false },
      { tag: "59",  mandatory: false, oneOf: ["59", "59A", "59F"] },
      { tag: "59A", mandatory: false, oneOf: ["59", "59A", "59F"] },
      { tag: "59F", mandatory: false, oneOf: ["59", "59A", "59F"] },
      { tag: "70",  mandatory: false },
      { tag: "71A", mandatory: true },
      { tag: "71F", mandatory: false },
      { tag: "71G", mandatory: false },
      { tag: "23E", mandatory: false },
      { tag: "26T", mandatory: false },
      { tag: "32A", mandatory: true },
      { tag: "19",  mandatory: true },
      { tag: "71F", mandatory: false },
      { tag: "71G", mandatory: false }
    ]
  },
  "104": {
    type: "104",
    name: "Direct Debit and Request for Debit Transfer",
    description: "Used to collect funds from debtor accounts through direct debit arrangements. Supports both single and multiple debits in one message.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21E", mandatory: false },
      { tag: "23E", mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "51A", mandatory: false },
      { tag: "50A", mandatory: false, oneOf: ["50A", "50C", "50K", "50L"] },
      { tag: "50C", mandatory: false, oneOf: ["50A", "50C", "50K", "50L"] },
      { tag: "50K", mandatory: false, oneOf: ["50A", "50C", "50K", "50L"] },
      { tag: "50L", mandatory: false, oneOf: ["50A", "50C", "50K", "50L"] },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "53A", mandatory: false },
      { tag: "53B", mandatory: false },
      { tag: "21",  mandatory: true },
      { tag: "21C", mandatory: false },
      { tag: "21D", mandatory: false },
      { tag: "23E", mandatory: false },
      { tag: "26T", mandatory: false },
      { tag: "32B", mandatory: true },
      { tag: "33B", mandatory: false },
      { tag: "36",  mandatory: false },
      { tag: "50A", mandatory: false },
      { tag: "50K", mandatory: false },
      { tag: "59",  mandatory: false, oneOf: ["59", "59A"] },
      { tag: "59A", mandatory: false, oneOf: ["59", "59A"] },
      { tag: "70",  mandatory: false },
      { tag: "71A", mandatory: false },
      { tag: "71F", mandatory: false },
      { tag: "71G", mandatory: false },
      { tag: "72",  mandatory: false },
      { tag: "77B", mandatory: false },
      { tag: "32A", mandatory: true },
      { tag: "19",  mandatory: true },
      { tag: "71F", mandatory: false },
      { tag: "71G", mandatory: false }
    ]
  },
  "107": {
    type: "107",
    name: "General Direct Debit Message",
    description: "Used for general direct debit collections, often in SEPA or domestic clearing contexts.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "23E", mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "51A", mandatory: false },
      { tag: "50A", mandatory: false, oneOf: ["50A", "50C", "50K", "50L"] },
      { tag: "50C", mandatory: false, oneOf: ["50A", "50C", "50K", "50L"] },
      { tag: "50K", mandatory: false, oneOf: ["50A", "50C", "50K", "50L"] },
      { tag: "50L", mandatory: false, oneOf: ["50A", "50C", "50K", "50L"] },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "53A", mandatory: false },
      { tag: "53B", mandatory: false },
      { tag: "21",  mandatory: true },
      { tag: "23E", mandatory: false },
      { tag: "32B", mandatory: true },
      { tag: "50A", mandatory: false },
      { tag: "50K", mandatory: false },
      { tag: "59",  mandatory: false, oneOf: ["59", "59A"] },
      { tag: "59A", mandatory: false, oneOf: ["59", "59A"] },
      { tag: "70",  mandatory: false },
      { tag: "71A", mandatory: false },
      { tag: "72",  mandatory: false },
      { tag: "77B", mandatory: false },
      { tag: "32A", mandatory: true },
      { tag: "19",  mandatory: true },
      { tag: "71F", mandatory: false },
      { tag: "71G", mandatory: false }
    ]
  },
  "110": {
    type: "110",
    name: "Advice of Cheque(s)",
    description: "Sent to advise the drawee bank that cheques have been issued.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "53A", mandatory: false },
      { tag: "53D", mandatory: false },
      { tag: "21",  mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "32A", mandatory: true },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "59",  mandatory: true },
      { tag: "72",  mandatory: false }
    ]
  },
  "111": {
    type: "111",
    name: "Request for Stop Payment of a Cheque",
    description: "Requests stop payment on a cheque that has been issued.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "32A", mandatory: true },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "59",  mandatory: true },
      { tag: "75",  mandatory: false },
      { tag: "76",  mandatory: false },
      { tag: "77A", mandatory: false }
    ]
  },
  "112": {
    type: "112",
    name: "Status of a Request for Stop Payment of a Cheque",
    description: "Reports the status of a previously sent stop payment request.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "25",  mandatory: false },
      { tag: "30",  mandatory: true },
      { tag: "32A", mandatory: true },
      { tag: "59",  mandatory: false },
      { tag: "75",  mandatory: false },
      { tag: "76",  mandatory: false },
      { tag: "77A", mandatory: false }
    ]
  },
  "190": {
    type: "190",
    name: "Advice of Charges, Interest and Other Adjustments",
    description: "Advises of charges, interest, or other adjustments related to Category 1 messages.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "25",  mandatory: false },
      { tag: "32B", mandatory: true },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "71B", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "191": {
    type: "191",
    name: "Request for Payment of Charges, Interest and Other Expenses",
    description: "Requests payment of charges related to Category 1 messages.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "71B", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "192": {
    type: "192",
    name: "Request for Cancellation",
    description: "Requests cancellation of a previously sent Category 1 message.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "11S", mandatory: true },
      { tag: "79",  mandatory: true }
    ]
  },
  "195": {
    type: "195",
    name: "Queries",
    description: "Free-format query related to a Category 1 message.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "79",  mandatory: true }
    ]
  },
  "196": {
    type: "196",
    name: "Answers",
    description: "Free-format answer to a Category 1 query.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "76",  mandatory: false },
      { tag: "79",  mandatory: false }
    ]
  },
  "198": {
    type: "198",
    name: "Proprietary Message (Category 1)",
    description: "Proprietary message format agreed bilaterally for Category 1 operations.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "12",  mandatory: true },
      { tag: "77E", mandatory: true }
    ]
  },
  "199": {
    type: "199",
    name: "Free Format Message (Category 1)",
    description: "Free-format message for Category 1 when no specific MT exists.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "79",  mandatory: true }
    ]
  },
  // ── Category 2: Financial Institution Transfers ──
  "201": {
    type: "201",
    name: "Multiple Financial Institution Transfer for Own Account",
    description: "Used by a financial institution to transfer funds to multiple accounts at other financial institutions for its own account.",
    fields: [
      { tag: "19",  mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "56A", mandatory: false },
      { tag: "56D", mandatory: false },
      { tag: "57A", mandatory: false },
      { tag: "57B", mandatory: false },
      { tag: "57D", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "202COV": {
    type: "202COV",
    name: "General Financial Institution Transfer (Cover)",
    description: "Cover payment for an underlying customer credit transfer. Contains both cover payment details and underlying customer transfer information for compliance screening.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "13C", mandatory: false },
      { tag: "32A", mandatory: true },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "53A", mandatory: false },
      { tag: "53B", mandatory: false },
      { tag: "53D", mandatory: false },
      { tag: "54A", mandatory: false },
      { tag: "54B", mandatory: false },
      { tag: "54D", mandatory: false },
      { tag: "56A", mandatory: false },
      { tag: "56D", mandatory: false },
      { tag: "57A", mandatory: false },
      { tag: "57B", mandatory: false },
      { tag: "57D", mandatory: false },
      { tag: "58A", mandatory: false, oneOf: ["58A", "58D"] },
      { tag: "58D", mandatory: false, oneOf: ["58A", "58D"] },
      { tag: "72",  mandatory: false },
      { tag: "50A", mandatory: false, oneOf: ["50A", "50F", "50K"] },
      { tag: "50F", mandatory: false, oneOf: ["50A", "50F", "50K"] },
      { tag: "50K", mandatory: false, oneOf: ["50A", "50F", "50K"] },
      { tag: "59",  mandatory: false, oneOf: ["59", "59A", "59F"] },
      { tag: "59A", mandatory: false, oneOf: ["59", "59A", "59F"] },
      { tag: "59F", mandatory: false, oneOf: ["59", "59A", "59F"] },
      { tag: "33B", mandatory: false }
    ]
  },
  "203": {
    type: "203",
    name: "Multiple General Financial Institution Transfer",
    description: "Instructs multiple bank-to-bank fund transfers in a single message, sharing common fields.",
    fields: [
      { tag: "19",  mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "53A", mandatory: false },
      { tag: "53B", mandatory: false },
      { tag: "53D", mandatory: false },
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "56A", mandatory: false },
      { tag: "56D", mandatory: false },
      { tag: "57A", mandatory: false },
      { tag: "57B", mandatory: false },
      { tag: "57D", mandatory: false },
      { tag: "58A", mandatory: false, oneOf: ["58A", "58D"] },
      { tag: "58D", mandatory: false, oneOf: ["58A", "58D"] },
      { tag: "72",  mandatory: false }
    ]
  },
  "204": {
    type: "204",
    name: "Financial Markets Direct Debit Message",
    description: "Used to request a direct debit from a financial institution's account, typically for settlement of financial market transactions.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "19",  mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "57A", mandatory: false },
      { tag: "57B", mandatory: false },
      { tag: "57D", mandatory: false },
      { tag: "58A", mandatory: false },
      { tag: "58D", mandatory: false },
      { tag: "21",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "53A", mandatory: false },
      { tag: "53B", mandatory: false },
      { tag: "53D", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "205": {
    type: "205",
    name: "Financial Institution Transfer Execution",
    description: "Used to further transfer funds previously received via an MT202 or MT203. Represents the execution leg of a cover payment.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "13C", mandatory: false },
      { tag: "32A", mandatory: true },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "53A", mandatory: false },
      { tag: "53B", mandatory: false },
      { tag: "53D", mandatory: false },
      { tag: "56A", mandatory: false },
      { tag: "56D", mandatory: false },
      { tag: "57A", mandatory: false },
      { tag: "57B", mandatory: false },
      { tag: "57D", mandatory: false },
      { tag: "58A", mandatory: false, oneOf: ["58A", "58D"] },
      { tag: "58D", mandatory: false, oneOf: ["58A", "58D"] },
      { tag: "72",  mandatory: false }
    ]
  },
  "205COV": {
    type: "205COV",
    name: "Financial Institution Transfer Execution (Cover)",
    description: "Cover version of MT205, including underlying customer credit transfer information for compliance screening.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "13C", mandatory: false },
      { tag: "32A", mandatory: true },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "53A", mandatory: false },
      { tag: "53B", mandatory: false },
      { tag: "56A", mandatory: false },
      { tag: "56D", mandatory: false },
      { tag: "57A", mandatory: false },
      { tag: "57B", mandatory: false },
      { tag: "57D", mandatory: false },
      { tag: "58A", mandatory: false, oneOf: ["58A", "58D"] },
      { tag: "58D", mandatory: false, oneOf: ["58A", "58D"] },
      { tag: "72",  mandatory: false },
      { tag: "50A", mandatory: false, oneOf: ["50A", "50F", "50K"] },
      { tag: "50F", mandatory: false, oneOf: ["50A", "50F", "50K"] },
      { tag: "50K", mandatory: false, oneOf: ["50A", "50F", "50K"] },
      { tag: "59",  mandatory: false, oneOf: ["59", "59A", "59F"] },
      { tag: "59A", mandatory: false, oneOf: ["59", "59A", "59F"] },
      { tag: "59F", mandatory: false, oneOf: ["59", "59A", "59F"] },
      { tag: "33B", mandatory: false }
    ]
  },
  "210": {
    type: "210",
    name: "Notice to Receive",
    description: "Sent by a financial institution to advise its correspondent that it expects to receive funds for credit to its account.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "25",  mandatory: false },
      { tag: "25P", mandatory: false },
      { tag: "30",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "50A", mandatory: false },
      { tag: "50F", mandatory: false },
      { tag: "50K", mandatory: false },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "56A", mandatory: false },
      { tag: "56D", mandatory: false }
    ]
  },
  "290": {
    type: "290",
    name: "Advice of Charges (Category 2)",
    description: "Advises of charges, interest, or adjustments related to Category 2 messages.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "72",  mandatory: false }
    ]
  },
  "291": {
    type: "291",
    name: "Request for Payment of Charges (Category 2)",
    description: "Requests payment of charges related to Category 2 messages.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "72",  mandatory: false }
    ]
  },
  "292": {
    type: "292",
    name: "Request for Cancellation (Category 2)",
    description: "Requests cancellation of a previously sent Category 2 message.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "11S", mandatory: true },
      { tag: "79",  mandatory: true }
    ]
  },
  "295": {
    type: "295",
    name: "Queries (Category 2)",
    description: "Free-format query related to a Category 2 message.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "79",  mandatory: true }
    ]
  },
  "296": {
    type: "296",
    name: "Answers (Category 2)",
    description: "Free-format answer to a Category 2 query.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "76",  mandatory: false },
      { tag: "79",  mandatory: false }
    ]
  },
  "299": {
    type: "299",
    name: "Free Format Message (Category 2)",
    description: "Free-format message for Category 2 when no specific MT exists.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "79",  mandatory: true }
    ]
  },
  // ── Category 3: Treasury Markets — FX, MM, Derivatives ──
  "300": {
    type: "300",
    name: "Foreign Exchange Confirmation",
    description: "Confirms a foreign exchange deal between two financial institutions, including spot, forward, and swap transactions.",
    fields: [
      { tag: "15A", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: false },
      { tag: "22A", mandatory: true },
      { tag: "22C", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "87D", mandatory: false },
      { tag: "77H", mandatory: true },
      { tag: "17F", mandatory: false },
      { tag: "17O", mandatory: false },
      { tag: "15B", mandatory: true },
      { tag: "30T", mandatory: true },
      { tag: "30V", mandatory: true },
      { tag: "36",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "57A", mandatory: false },
      { tag: "57D", mandatory: false },
      { tag: "33B", mandatory: true },
      { tag: "53A", mandatory: false },
      { tag: "56A", mandatory: false },
      { tag: "15C", mandatory: false },
      { tag: "29A", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "303": {
    type: "303",
    name: "Forex/Currency Option Allocation Instruction",
    description: "Instructs the allocation of a block FX deal or currency option to multiple sub-accounts or funds.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "22A", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "30",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "36",  mandatory: false },
      { tag: "33B", mandatory: false }
    ]
  },
  "304": {
    type: "304",
    name: "Advice/Instruction of a Third Party Deal",
    description: "Advises or instructs a third-party FX deal where a fund manager trades on behalf of a client.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "22A", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "30T", mandatory: true },
      { tag: "30V", mandatory: true },
      { tag: "36",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "33B", mandatory: true },
      { tag: "57A", mandatory: false },
      { tag: "53A", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "305": {
    type: "305",
    name: "Foreign Currency Option Confirmation",
    description: "Confirms a foreign currency option deal, including vanilla and barrier options.",
    fields: [
      { tag: "15A", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: false },
      { tag: "22A", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "77H", mandatory: true },
      { tag: "15B", mandatory: true },
      { tag: "30T", mandatory: true },
      { tag: "30X", mandatory: true },
      { tag: "30V", mandatory: false },
      { tag: "36",  mandatory: false },
      { tag: "32B", mandatory: true },
      { tag: "33B", mandatory: true },
      { tag: "37R", mandatory: true },
      { tag: "15C", mandatory: false },
      { tag: "29A", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "306": {
    type: "306",
    name: "Foreign Currency Option Confirmation",
    description: "Confirms a foreign currency option, supporting complex option structures including barriers and digital/binary options.",
    fields: [
      { tag: "15A", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: false },
      { tag: "22A", mandatory: true },
      { tag: "22C", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "77H", mandatory: true },
      { tag: "15B", mandatory: true },
      { tag: "30T", mandatory: true },
      { tag: "30X", mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "33B", mandatory: true },
      { tag: "36",  mandatory: false },
      { tag: "15C", mandatory: false },
      { tag: "29A", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "320": {
    type: "320",
    name: "Fixed Loan/Deposit Confirmation",
    description: "Confirms a fixed-term loan or deposit between two financial institutions, including terms, rates, and settlement instructions.",
    fields: [
      { tag: "15A", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: false },
      { tag: "22A", mandatory: true },
      { tag: "22B", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "77H", mandatory: true },
      { tag: "15B", mandatory: true },
      { tag: "17R", mandatory: true },
      { tag: "30T", mandatory: true },
      { tag: "30V", mandatory: true },
      { tag: "30P", mandatory: true },
      { tag: "30F", mandatory: false },
      { tag: "32B", mandatory: true },
      { tag: "34E", mandatory: false },
      { tag: "37G", mandatory: true },
      { tag: "38D", mandatory: false },
      { tag: "39M", mandatory: false },
      { tag: "14A", mandatory: false },
      { tag: "57A", mandatory: false },
      { tag: "57D", mandatory: false },
      { tag: "15C", mandatory: false },
      { tag: "29A", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "330": {
    type: "330",
    name: "Call/Notice Loan/Deposit Confirmation",
    description: "Confirms a call or notice loan/deposit arrangement that can be terminated by either party with prior notice.",
    fields: [
      { tag: "15A", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: false },
      { tag: "22A", mandatory: true },
      { tag: "22B", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "77H", mandatory: true },
      { tag: "15B", mandatory: true },
      { tag: "17R", mandatory: true },
      { tag: "30T", mandatory: true },
      { tag: "30V", mandatory: true },
      { tag: "38A", mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "37G", mandatory: true },
      { tag: "15C", mandatory: false },
      { tag: "29A", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "340": {
    type: "340",
    name: "Forward Rate Agreement Confirmation",
    description: "Confirms a Forward Rate Agreement (FRA) between two financial institutions.",
    fields: [
      { tag: "15A", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: false },
      { tag: "22A", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "77H", mandatory: true },
      { tag: "15B", mandatory: true },
      { tag: "17R", mandatory: true },
      { tag: "30T", mandatory: true },
      { tag: "30V", mandatory: true },
      { tag: "30F", mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "37G", mandatory: true },
      { tag: "15C", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "341": {
    type: "341",
    name: "Forward Rate Agreement Settlement Confirmation",
    description: "Confirms the settlement details of a Forward Rate Agreement.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "22A", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "30P", mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "37M", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "350": {
    type: "350",
    name: "Advice of Loan/Deposit Interest Payment",
    description: "Advises of an interest payment on a loan or deposit.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "22A", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "30V", mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "34E", mandatory: false },
      { tag: "37G", mandatory: false },
      { tag: "57A", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "360": {
    type: "360",
    name: "Single Currency Interest Rate Derivative Confirmation",
    description: "Confirms a single currency interest rate swap, cap, floor, collar, or swaption.",
    fields: [
      { tag: "15A", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: false },
      { tag: "22A", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "77H", mandatory: true },
      { tag: "15B", mandatory: true },
      { tag: "30T", mandatory: true },
      { tag: "30V", mandatory: true },
      { tag: "30F", mandatory: false },
      { tag: "32B", mandatory: true },
      { tag: "37G", mandatory: false },
      { tag: "15C", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "361": {
    type: "361",
    name: "Cross Currency Interest Rate Swap Confirmation",
    description: "Confirms a cross-currency interest rate swap involving exchange of interest and principal in different currencies.",
    fields: [
      { tag: "15A", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: false },
      { tag: "22A", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "77H", mandatory: true },
      { tag: "15B", mandatory: true },
      { tag: "30T", mandatory: true },
      { tag: "30V", mandatory: true },
      { tag: "30F", mandatory: false },
      { tag: "32B", mandatory: true },
      { tag: "33B", mandatory: true },
      { tag: "36",  mandatory: false },
      { tag: "37G", mandatory: false },
      { tag: "15C", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "362": {
    type: "362",
    name: "Interest Rate Reset/Advice of Payment",
    description: "Advises the rate reset and/or payment details for an interest rate derivative.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "22A", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "30V", mandatory: true },
      { tag: "32B", mandatory: false },
      { tag: "37G", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "364": {
    type: "364",
    name: "Single Currency IRS Termination/Recouponing Confirmation",
    description: "Confirms early termination or recouponing of a single currency interest rate derivative.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "22A", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "30T", mandatory: true },
      { tag: "32B", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "365": {
    type: "365",
    name: "Cross Currency IRS Termination/Recouponing Confirmation",
    description: "Confirms early termination or recouponing of a cross-currency interest rate swap.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "22A", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "30T", mandatory: true },
      { tag: "32B", mandatory: false },
      { tag: "33B", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "380": {
    type: "380",
    name: "Foreign Exchange Order",
    description: "Used to place a foreign exchange order with a financial institution.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: false },
      { tag: "22A", mandatory: true },
      { tag: "30T", mandatory: false },
      { tag: "30V", mandatory: false },
      { tag: "36",  mandatory: false },
      { tag: "32B", mandatory: true },
      { tag: "33B", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "381": {
    type: "381",
    name: "Foreign Exchange Order Confirmation",
    description: "Confirms execution or rejection of a foreign exchange order.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "22A", mandatory: true },
      { tag: "30T", mandatory: false },
      { tag: "30V", mandatory: false },
      { tag: "36",  mandatory: false },
      { tag: "32B", mandatory: false },
      { tag: "33B", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "390": {
    type: "390",
    name: "Advice of Charges (Category 3)",
    description: "Advises of charges related to Category 3 treasury operations.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "72", mandatory: false }
    ]
  },
  "392": {
    type: "392",
    name: "Request for Cancellation (Category 3)",
    description: "Requests cancellation of a previously sent Category 3 message.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "11S", mandatory: true },
      { tag: "79", mandatory: true }
    ]
  },
  "395": {
    type: "395",
    name: "Queries (Category 3)",
    description: "Free-format query related to a Category 3 message.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "79", mandatory: true }
    ]
  },
  "396": {
    type: "396",
    name: "Answers (Category 3)",
    description: "Free-format answer to a Category 3 query.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "79", mandatory: false }
    ]
  },
  "399": {
    type: "399",
    name: "Free Format Message (Category 3)",
    description: "Free-format message for Category 3 when no specific MT exists.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "79", mandatory: true }
    ]
  },
  // ── Category 4: Collections & Cash Letters ──
  "400": {
    type: "400",
    name: "Advice of Payment",
    description: "Advises that a collection has been paid and provides settlement details.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "32A", mandatory: true },
      { tag: "33A", mandatory: false },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "53A", mandatory: false },
      { tag: "54A", mandatory: false },
      { tag: "57A", mandatory: false },
      { tag: "57D", mandatory: false },
      { tag: "71F", mandatory: false },
      { tag: "72",  mandatory: false },
      { tag: "77A", mandatory: false }
    ]
  },
  "405": {
    type: "405",
    name: "Clean Collection",
    description: "Instructs collection of financial documents not accompanied by commercial documents.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "32A", mandatory: true },
      { tag: "50A", mandatory: false },
      { tag: "50K", mandatory: false },
      { tag: "59",  mandatory: true },
      { tag: "72",  mandatory: false },
      { tag: "77A", mandatory: false }
    ]
  },
  "410": {
    type: "410",
    name: "Acknowledgement",
    description: "Acknowledges receipt of a collection instruction or related message.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "32A", mandatory: false },
      { tag: "72",  mandatory: false },
      { tag: "77A", mandatory: false }
    ]
  },
  "412": {
    type: "412",
    name: "Advice of Acceptance",
    description: "Advises that a draft or bill of exchange has been accepted.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "32A", mandatory: true },
      { tag: "72",  mandatory: false },
      { tag: "77A", mandatory: false }
    ]
  },
  "416": {
    type: "416",
    name: "Advice of Non-Payment/Non-Acceptance",
    description: "Advises that a collection has not been paid or accepted, providing the reason.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "32A", mandatory: true },
      { tag: "77A", mandatory: true }
    ]
  },
  "420": {
    type: "420",
    name: "Tracer",
    description: "Requests information on the status of a previously sent collection instruction.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "32A", mandatory: false },
      { tag: "59",  mandatory: false },
      { tag: "79",  mandatory: false }
    ]
  },
  "422": {
    type: "422",
    name: "Advice of Fate and Request for Instructions",
    description: "Advises the presenting bank of the fate of documents and requests further instructions.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "32A", mandatory: false },
      { tag: "72",  mandatory: false },
      { tag: "77A", mandatory: false }
    ]
  },
  "430": {
    type: "430",
    name: "Amendment of Instructions",
    description: "Amends a previously sent collection instruction.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "32A", mandatory: false },
      { tag: "59",  mandatory: false },
      { tag: "72",  mandatory: false },
      { tag: "79",  mandatory: false }
    ]
  },
  "450": {
    type: "450",
    name: "Cash Letter Credit Advice",
    description: "Advises credit for a cash letter (bundle of cheques or drafts).",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "25",  mandatory: false },
      { tag: "32A", mandatory: true },
      { tag: "52A", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "455": {
    type: "455",
    name: "Cash Letter Credit Adjustment Advice",
    description: "Advises adjustment to a previously sent cash letter credit.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "32A", mandatory: true },
      { tag: "33A", mandatory: false },
      { tag: "52A", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "456": {
    type: "456",
    name: "Advice of Dishonour",
    description: "Advises that an item in a cash letter has been dishonoured.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "32A", mandatory: true },
      { tag: "59",  mandatory: false },
      { tag: "72",  mandatory: false },
      { tag: "77A", mandatory: false }
    ]
  },
  "490": {
    type: "490",
    name: "Advice of Charges (Category 4)",
    description: "Advises of charges related to Category 4 collection operations.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "72", mandatory: false }
    ]
  },
  "492": {
    type: "492",
    name: "Request for Cancellation (Category 4)",
    description: "Requests cancellation of a previously sent Category 4 message.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "11S", mandatory: true },
      { tag: "79", mandatory: true }
    ]
  },
  "495": {
    type: "495",
    name: "Queries (Category 4)",
    description: "Free-format query related to a Category 4 message.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "79", mandatory: true }
    ]
  },
  "496": {
    type: "496",
    name: "Answers (Category 4)",
    description: "Free-format answer to a Category 4 query.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "79", mandatory: false }
    ]
  },
  "499": {
    type: "499",
    name: "Free Format Message (Category 4)",
    description: "Free-format message for Category 4 when no specific MT exists.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "79", mandatory: true }
    ]
  },
  // ── Category 5: Securities Markets ──
  "502": {
    type: "502",
    name: "Order to Buy or Sell",
    description: "Instructs the purchase or sale of a financial instrument.",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "23B", mandatory: true },
      { tag: "22H", mandatory: true },
      { tag: "35B", mandatory: true },
      { tag: "36B", mandatory: true },
      { tag: "97A", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "509": {
    type: "509",
    name: "Trade Status Message",
    description: "Reports the status of a securities trade instruction (matched, unmatched, settled, etc.).",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "22F", mandatory: true },
      { tag: "25",  mandatory: false },
      { tag: "35B", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "513": {
    type: "513",
    name: "Client Advice of Execution",
    description: "Advises a client that a securities order has been executed.",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "22H", mandatory: true },
      { tag: "35B", mandatory: true },
      { tag: "36B", mandatory: true },
      { tag: "98A", mandatory: false },
      { tag: "19A", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "515": {
    type: "515",
    name: "Client Confirmation of Purchase or Sale",
    description: "Confirms a securities purchase or sale to the client, including trade and settlement details.",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: false },
      { tag: "22H", mandatory: true },
      { tag: "35B", mandatory: true },
      { tag: "36B", mandatory: true },
      { tag: "98A", mandatory: true },
      { tag: "19A", mandatory: true },
      { tag: "97A", mandatory: false },
      { tag: "95P", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "518": {
    type: "518",
    name: "Market-Side Securities Trade Confirmation",
    description: "Confirms a securities trade between market counterparties.",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "22H", mandatory: true },
      { tag: "35B", mandatory: true },
      { tag: "36B", mandatory: true },
      { tag: "98A", mandatory: true },
      { tag: "19A", mandatory: true },
      { tag: "95P", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "535": {
    type: "535",
    name: "Statement of Holdings",
    description: "Reports securities holdings in an account, typically end-of-day or periodic. Provides positions across all instruments.",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "98A", mandatory: true },
      { tag: "22F", mandatory: true },
      { tag: "97A", mandatory: true },
      { tag: "35B", mandatory: false },
      { tag: "36B", mandatory: false },
      { tag: "19A", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "536": {
    type: "536",
    name: "Statement of Transactions",
    description: "Reports all securities transactions in an account over a specified period.",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "98A", mandatory: true },
      { tag: "22F", mandatory: true },
      { tag: "97A", mandatory: true },
      { tag: "35B", mandatory: false },
      { tag: "36B", mandatory: false },
      { tag: "19A", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "537": {
    type: "537",
    name: "Statement of Pending Transactions",
    description: "Reports securities transactions that are pending settlement.",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "98A", mandatory: true },
      { tag: "22F", mandatory: true },
      { tag: "97A", mandatory: true },
      { tag: "35B", mandatory: false },
      { tag: "36B", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "540": {
    type: "540",
    name: "Receive Free",
    description: "Instructs receipt of securities without payment (free of payment delivery).",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "23G", mandatory: true },
      { tag: "22F", mandatory: false },
      { tag: "98A", mandatory: true },
      { tag: "35B", mandatory: true },
      { tag: "36B", mandatory: true },
      { tag: "97A", mandatory: true },
      { tag: "95P", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "541": {
    type: "541",
    name: "Receive Against Payment",
    description: "Instructs receipt of securities against payment (delivery versus payment — buy side).",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "23G", mandatory: true },
      { tag: "22F", mandatory: false },
      { tag: "98A", mandatory: true },
      { tag: "35B", mandatory: true },
      { tag: "36B", mandatory: true },
      { tag: "19A", mandatory: true },
      { tag: "97A", mandatory: true },
      { tag: "95P", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "542": {
    type: "542",
    name: "Deliver Free",
    description: "Instructs delivery of securities without payment (free of payment delivery).",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "23G", mandatory: true },
      { tag: "22F", mandatory: false },
      { tag: "98A", mandatory: true },
      { tag: "35B", mandatory: true },
      { tag: "36B", mandatory: true },
      { tag: "97A", mandatory: true },
      { tag: "95P", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "543": {
    type: "543",
    name: "Deliver Against Payment",
    description: "Instructs delivery of securities against payment (delivery versus payment — sell side).",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "23G", mandatory: true },
      { tag: "22F", mandatory: false },
      { tag: "98A", mandatory: true },
      { tag: "35B", mandatory: true },
      { tag: "36B", mandatory: true },
      { tag: "19A", mandatory: true },
      { tag: "97A", mandatory: true },
      { tag: "95P", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "544": {
    type: "544",
    name: "Receive Free Confirmation",
    description: "Confirms that securities have been received free of payment.",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "98A", mandatory: true },
      { tag: "35B", mandatory: true },
      { tag: "36B", mandatory: true },
      { tag: "97A", mandatory: true },
      { tag: "16S", mandatory: true }
    ]
  },
  "545": {
    type: "545",
    name: "Receive Against Payment Confirmation",
    description: "Confirms that securities have been received against payment.",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "98A", mandatory: true },
      { tag: "35B", mandatory: true },
      { tag: "36B", mandatory: true },
      { tag: "19A", mandatory: true },
      { tag: "97A", mandatory: true },
      { tag: "16S", mandatory: true }
    ]
  },
  "546": {
    type: "546",
    name: "Deliver Free Confirmation",
    description: "Confirms that securities have been delivered free of payment.",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "98A", mandatory: true },
      { tag: "35B", mandatory: true },
      { tag: "36B", mandatory: true },
      { tag: "97A", mandatory: true },
      { tag: "16S", mandatory: true }
    ]
  },
  "547": {
    type: "547",
    name: "Deliver Against Payment Confirmation",
    description: "Confirms that securities have been delivered against payment.",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "98A", mandatory: true },
      { tag: "35B", mandatory: true },
      { tag: "36B", mandatory: true },
      { tag: "19A", mandatory: true },
      { tag: "97A", mandatory: true },
      { tag: "16S", mandatory: true }
    ]
  },
  "548": {
    type: "548",
    name: "Settlement Status and Processing Advice",
    description: "Reports the status of a securities settlement instruction (matched, pending, failing, settled).",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "22F", mandatory: true },
      { tag: "25",  mandatory: true },
      { tag: "35B", mandatory: false },
      { tag: "36B", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "564": {
    type: "564",
    name: "Corporate Action Notification",
    description: "Notifies account holders of a corporate action event (dividend, rights issue, merger, etc.).",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "22F", mandatory: true },
      { tag: "35B", mandatory: true },
      { tag: "98A", mandatory: true },
      { tag: "16S", mandatory: true }
    ]
  },
  "565": {
    type: "565",
    name: "Corporate Action Instruction",
    description: "Instructs response to a corporate action event (e.g., elect dividend reinvestment).",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "22F", mandatory: true },
      { tag: "35B", mandatory: true },
      { tag: "36B", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "566": {
    type: "566",
    name: "Corporate Action Confirmation",
    description: "Confirms the processing of a corporate action and the resulting movement of securities or cash.",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "22F", mandatory: true },
      { tag: "35B", mandatory: true },
      { tag: "98A", mandatory: true },
      { tag: "19A", mandatory: false },
      { tag: "36B", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "567": {
    type: "567",
    name: "Corporate Action Status and Processing Advice",
    description: "Reports the processing status of a corporate action instruction.",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "22F", mandatory: true },
      { tag: "25",  mandatory: false },
      { tag: "35B", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "568": {
    type: "568",
    name: "Corporate Action Narrative",
    description: "Provides narrative information about a corporate action event.",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "35B", mandatory: false },
      { tag: "70E", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "575": {
    type: "575",
    name: "Combined Activity Report",
    description: "Combined report of securities transactions and holdings activity.",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "98A", mandatory: true },
      { tag: "22F", mandatory: true },
      { tag: "97A", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "578": {
    type: "578",
    name: "Settlement Allegement",
    description: "Alleges a securities settlement instruction to a counterparty that has not yet sent a matching instruction.",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "22H", mandatory: true },
      { tag: "98A", mandatory: true },
      { tag: "35B", mandatory: true },
      { tag: "36B", mandatory: true },
      { tag: "97A", mandatory: false },
      { tag: "95P", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "586": {
    type: "586",
    name: "Statement of Settlement Allegements",
    description: "Reports all outstanding settlement allegements for an account.",
    fields: [
      { tag: "16R", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "98A", mandatory: true },
      { tag: "22F", mandatory: true },
      { tag: "97A", mandatory: true },
      { tag: "35B", mandatory: false },
      { tag: "16S", mandatory: true }
    ]
  },
  "590": {
    type: "590",
    name: "Advice of Charges (Category 5)",
    description: "Advises of charges related to Category 5 securities operations.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "72", mandatory: false }
    ]
  },
  "592": {
    type: "592",
    name: "Request for Cancellation (Category 5)",
    description: "Requests cancellation of a previously sent Category 5 securities message.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "11S", mandatory: true },
      { tag: "79", mandatory: true }
    ]
  },
  "595": {
    type: "595",
    name: "Queries (Category 5)",
    description: "Free-format query related to a Category 5 message.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "79", mandatory: true }
    ]
  },
  "596": {
    type: "596",
    name: "Answers (Category 5)",
    description: "Free-format answer to a Category 5 query.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "79", mandatory: false }
    ]
  },
  "598": {
    type: "598",
    name: "Proprietary Message (Category 5)",
    description: "Proprietary message format agreed bilaterally for Category 5 operations.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "12", mandatory: true }
    ]
  },
  "599": {
    type: "599",
    name: "Free Format Message (Category 5)",
    description: "Free-format message for Category 5 when no specific MT exists.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "79", mandatory: true }
    ]
  },
  // ── Category 6: Treasury Markets — Precious Metals & Syndications ──
  "600": {
    type: "600",
    name: "Precious Metal Trade Confirmation",
    description: "Confirms a precious metal trade (gold, silver, platinum, palladium).",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: false },
      { tag: "22A", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "30T", mandatory: true },
      { tag: "30V", mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "36",  mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "601": {
    type: "601",
    name: "Precious Metal Option Confirmation",
    description: "Confirms a precious metal option deal.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: false },
      { tag: "22A", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "30T", mandatory: true },
      { tag: "30X", mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "36",  mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "604": {
    type: "604",
    name: "Precious Metal Transfer/Delivery Order",
    description: "Orders the transfer or delivery of precious metals from one party to another.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: false },
      { tag: "23",  mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "57A", mandatory: false },
      { tag: "59",  mandatory: true },
      { tag: "72",  mandatory: false }
    ]
  },
  "605": {
    type: "605",
    name: "Precious Metal Notice to Receive",
    description: "Advises a precious metals depository of an expected receipt of metal.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: false },
      { tag: "23",  mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "52A", mandatory: false },
      { tag: "56A", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "606": {
    type: "606",
    name: "Precious Metal Debit Advice",
    description: "Advises of a debit to a precious metal account.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "23",  mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "57A", mandatory: false },
      { tag: "59",  mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "607": {
    type: "607",
    name: "Precious Metal Credit Advice",
    description: "Advises of a credit to a precious metal account.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "23",  mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "52A", mandatory: false },
      { tag: "56A", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "608": {
    type: "608",
    name: "Statement of a Metal Account",
    description: "Reports the balance and transactions of a precious metal account.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "25",  mandatory: true },
      { tag: "28C", mandatory: true },
      { tag: "60F", mandatory: false, oneOf: ["60F", "60M"] },
      { tag: "60M", mandatory: false, oneOf: ["60F", "60M"] },
      { tag: "61",  mandatory: false, repetitive: true },
      { tag: "62F", mandatory: false, oneOf: ["62F", "62M"] },
      { tag: "62M", mandatory: false, oneOf: ["62F", "62M"] }
    ]
  },
  "620": {
    type: "620",
    name: "Metal Fixed Loan/Deposit Confirmation",
    description: "Confirms a fixed-term precious metal loan or deposit.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: false },
      { tag: "22A", mandatory: true },
      { tag: "82A", mandatory: false },
      { tag: "87A", mandatory: false },
      { tag: "30T", mandatory: true },
      { tag: "30V", mandatory: true },
      { tag: "30F", mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "37G", mandatory: true },
      { tag: "72",  mandatory: false }
    ]
  },
  "643": {
    type: "643",
    name: "Notice of Drawdown/Renewal",
    description: "Notifies of a drawdown or renewal under a syndicated facility.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "72",  mandatory: false }
    ]
  },
  "644": {
    type: "644",
    name: "Advice of Rate and Amount Fixing",
    description: "Advises the rate and amount fixing for a syndicated facility.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "37G", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "645": {
    type: "645",
    name: "Notice of Fee Due",
    description: "Advises of a fee payment due under a syndicated facility.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "72",  mandatory: false }
    ]
  },
  "646": {
    type: "646",
    name: "Payment of Principal and/or Interest",
    description: "Advises of principal and/or interest payment under a syndicated facility.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "37G", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "649": {
    type: "649",
    name: "General Syndicated Facility Message",
    description: "Free-format message for communication between parties in a syndicated facility.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "79",  mandatory: true }
    ]
  },
  "690": {
    type: "690",
    name: "Advice of Charges (Category 6)",
    description: "Advises of charges related to Category 6 operations.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "72", mandatory: false }
    ]
  },
  "699": {
    type: "699",
    name: "Free Format Message (Category 6)",
    description: "Free-format message for Category 6 when no specific MT exists.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "79", mandatory: true }
    ]
  },
  // ── Category 7: Documentary Credits & Guarantees ──
  "700": {
    type: "700",
    name: "Issue of a Documentary Credit",
    description: "Issued by the issuing bank to the advising bank to advise a documentary credit to the beneficiary.",
    fields: [
      { tag: "27",  mandatory: true },
      { tag: "40A", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "23",  mandatory: false },
      { tag: "31C", mandatory: true },
      { tag: "40E", mandatory: true },
      { tag: "31D", mandatory: true },
      { tag: "50",  mandatory: false },
      { tag: "50K", mandatory: false },
      { tag: "59",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "39A", mandatory: false },
      { tag: "39B", mandatory: false },
      { tag: "39C", mandatory: false },
      { tag: "41A", mandatory: false, oneOf: ["41A", "41D"] },
      { tag: "41D", mandatory: false, oneOf: ["41A", "41D"] },
      { tag: "42C", mandatory: false },
      { tag: "42A", mandatory: false },
      { tag: "42D", mandatory: false },
      { tag: "42M", mandatory: false },
      { tag: "42P", mandatory: false },
      { tag: "43P", mandatory: false },
      { tag: "43T", mandatory: false },
      { tag: "44A", mandatory: false },
      { tag: "44E", mandatory: false },
      { tag: "44F", mandatory: false },
      { tag: "44B", mandatory: false },
      { tag: "44C", mandatory: false },
      { tag: "44D", mandatory: false },
      { tag: "45A", mandatory: false },
      { tag: "46A", mandatory: false },
      { tag: "47A", mandatory: false },
      { tag: "49",  mandatory: false },
      { tag: "53A", mandatory: false },
      { tag: "53D", mandatory: false },
      { tag: "71D", mandatory: false },
      { tag: "48",  mandatory: false },
      { tag: "78",  mandatory: false },
      { tag: "57A", mandatory: false },
      { tag: "57D", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "701": {
    type: "701",
    name: "Issue of a Documentary Credit (Continuation)",
    description: "Continuation of MT700 when the documentary credit details exceed the capacity of a single message.",
    fields: [
      { tag: "27",  mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "45B", mandatory: false },
      { tag: "46B", mandatory: false },
      { tag: "47B", mandatory: false }
    ]
  },
  "705": {
    type: "705",
    name: "Pre-Advice of a Documentary Credit",
    description: "Pre-advises the advising bank of the issuance of a documentary credit, allowing preparation before the full credit arrives.",
    fields: [
      { tag: "27",  mandatory: true },
      { tag: "40A", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "31C", mandatory: false },
      { tag: "31D", mandatory: false },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "59",  mandatory: false },
      { tag: "32B", mandatory: false },
      { tag: "79",  mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "707": {
    type: "707",
    name: "Amendment to a Documentary Credit",
    description: "Amends the terms and conditions of a previously issued documentary credit.",
    fields: [
      { tag: "27",  mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "23",  mandatory: false },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "31C", mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "26E", mandatory: true },
      { tag: "31D", mandatory: false },
      { tag: "32B", mandatory: false },
      { tag: "33B", mandatory: false },
      { tag: "39A", mandatory: false },
      { tag: "39B", mandatory: false },
      { tag: "39C", mandatory: false },
      { tag: "44A", mandatory: false },
      { tag: "44E", mandatory: false },
      { tag: "44F", mandatory: false },
      { tag: "44B", mandatory: false },
      { tag: "44C", mandatory: false },
      { tag: "44D", mandatory: false },
      { tag: "79",  mandatory: false },
      { tag: "72",  mandatory: false },
      { tag: "77A", mandatory: false }
    ]
  },
  "710": {
    type: "710",
    name: "Advice of a Third Bank's Documentary Credit",
    description: "Sent by the advising bank to another advising bank to advise a documentary credit received from a third bank.",
    fields: [
      { tag: "27",  mandatory: true },
      { tag: "40A", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "23",  mandatory: false },
      { tag: "31C", mandatory: true },
      { tag: "40E", mandatory: false },
      { tag: "31D", mandatory: true },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "50K", mandatory: false },
      { tag: "59",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "41A", mandatory: false },
      { tag: "41D", mandatory: false },
      { tag: "42C", mandatory: false },
      { tag: "42A", mandatory: false },
      { tag: "42D", mandatory: false },
      { tag: "43P", mandatory: false },
      { tag: "43T", mandatory: false },
      { tag: "44A", mandatory: false },
      { tag: "44E", mandatory: false },
      { tag: "44F", mandatory: false },
      { tag: "44B", mandatory: false },
      { tag: "44C", mandatory: false },
      { tag: "45A", mandatory: false },
      { tag: "46A", mandatory: false },
      { tag: "47A", mandatory: false },
      { tag: "49",  mandatory: false },
      { tag: "53A", mandatory: false },
      { tag: "78",  mandatory: false },
      { tag: "57A", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "711": {
    type: "711",
    name: "Advice of a Third Bank's Documentary Credit (Continuation)",
    description: "Continuation of MT710.",
    fields: [
      { tag: "27", mandatory: true },
      { tag: "20", mandatory: true },
      { tag: "45B", mandatory: false },
      { tag: "46B", mandatory: false },
      { tag: "47B", mandatory: false }
    ]
  },
  "720": {
    type: "720",
    name: "Transfer of a Documentary Credit",
    description: "Transfers a documentary credit or part thereof to a second beneficiary.",
    fields: [
      { tag: "27",  mandatory: true },
      { tag: "40A", mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "31C", mandatory: true },
      { tag: "31D", mandatory: true },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "50K", mandatory: false },
      { tag: "59",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "41A", mandatory: false },
      { tag: "41D", mandatory: false },
      { tag: "43P", mandatory: false },
      { tag: "43T", mandatory: false },
      { tag: "44A", mandatory: false },
      { tag: "44B", mandatory: false },
      { tag: "44C", mandatory: false },
      { tag: "45A", mandatory: false },
      { tag: "46A", mandatory: false },
      { tag: "47A", mandatory: false },
      { tag: "49",  mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "721": {
    type: "721",
    name: "Transfer of a Documentary Credit (Continuation)",
    description: "Continuation of MT720.",
    fields: [
      { tag: "27", mandatory: true },
      { tag: "20", mandatory: true },
      { tag: "45B", mandatory: false },
      { tag: "46B", mandatory: false },
      { tag: "47B", mandatory: false }
    ]
  },
  "730": {
    type: "730",
    name: "Acknowledgement",
    description: "Acknowledges receipt of a documentary credit, amendment, or transfer.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "30", mandatory: true },
      { tag: "77A", mandatory: false }
    ]
  },
  "732": {
    type: "732",
    name: "Advice of Discharge",
    description: "Advises that a documentary credit has been discharged (fully utilized or expired).",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "30", mandatory: true },
      { tag: "77A", mandatory: false }
    ]
  },
  "734": {
    type: "734",
    name: "Advice of Refusal",
    description: "Advises that documents presented under a documentary credit are refused due to discrepancies.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "30", mandatory: true },
      { tag: "77A", mandatory: true },
      { tag: "77B", mandatory: false }
    ]
  },
  "740": {
    type: "740",
    name: "Authorisation to Reimburse",
    description: "Authorises a reimbursing bank to honour claims from a claiming bank under a documentary credit.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "25",  mandatory: false },
      { tag: "21",  mandatory: true },
      { tag: "31D", mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "41A", mandatory: false },
      { tag: "41D", mandatory: false },
      { tag: "71D", mandatory: false },
      { tag: "72",  mandatory: false },
      { tag: "77A", mandatory: false }
    ]
  },
  "742": {
    type: "742",
    name: "Reimbursement Claim",
    description: "Claims reimbursement from a reimbursing bank for payment made under a documentary credit.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "57A", mandatory: false },
      { tag: "57D", mandatory: false },
      { tag: "71F", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "747": {
    type: "747",
    name: "Amendment to an Authorisation to Reimburse",
    description: "Amends a previously sent authorisation to reimburse.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "31D", mandatory: false },
      { tag: "32B", mandatory: false },
      { tag: "33B", mandatory: false },
      { tag: "71D", mandatory: false },
      { tag: "72",  mandatory: false },
      { tag: "77A", mandatory: false }
    ]
  },
  "750": {
    type: "750",
    name: "Advice of Discrepancy",
    description: "Advises the issuing bank of discrepancies found in documents presented under a documentary credit.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "30", mandatory: true },
      { tag: "77A", mandatory: true }
    ]
  },
  "752": {
    type: "752",
    name: "Authorisation to Pay, Accept or Negotiate",
    description: "Authorises the nominated bank to pay, accept, or negotiate under a documentary credit.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "30", mandatory: true },
      { tag: "32B", mandatory: false },
      { tag: "72", mandatory: false },
      { tag: "77A", mandatory: false }
    ]
  },
  "754": {
    type: "754",
    name: "Advice of Payment/Acceptance/Negotiation",
    description: "Advises that documents have been paid, accepted, or negotiated under a documentary credit.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "30", mandatory: true },
      { tag: "32B", mandatory: false },
      { tag: "71F", mandatory: false },
      { tag: "72", mandatory: false },
      { tag: "77A", mandatory: false }
    ]
  },
  "756": {
    type: "756",
    name: "Advice of Reimbursement or Payment",
    description: "Advises of reimbursement or payment made under a documentary credit.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "30", mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "71F", mandatory: false },
      { tag: "72", mandatory: false }
    ]
  },
  "760": {
    type: "760",
    name: "Guarantee / Standby Letter of Credit",
    description: "Issues or requests issuance of a guarantee or standby letter of credit.",
    fields: [
      { tag: "15A", mandatory: true },
      { tag: "27",  mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "22D", mandatory: true },
      { tag: "23",  mandatory: false },
      { tag: "30",  mandatory: true },
      { tag: "22K", mandatory: false },
      { tag: "40C", mandatory: false },
      { tag: "40E", mandatory: false },
      { tag: "23B", mandatory: false },
      { tag: "31E", mandatory: false },
      { tag: "35G", mandatory: false },
      { tag: "50",  mandatory: false },
      { tag: "51A", mandatory: false },
      { tag: "52A", mandatory: false },
      { tag: "52D", mandatory: false },
      { tag: "59",  mandatory: false },
      { tag: "32B", mandatory: false },
      { tag: "77C", mandatory: false },
      { tag: "15B", mandatory: false },
      { tag: "20",  mandatory: false },
      { tag: "72",  mandatory: false },
      { tag: "23B", mandatory: false }
    ]
  },
  "767": {
    type: "767",
    name: "Guarantee / Standby Letter of Credit Amendment",
    description: "Amends a previously issued guarantee or standby letter of credit.",
    fields: [
      { tag: "15A", mandatory: true },
      { tag: "27",  mandatory: true },
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "22D", mandatory: false },
      { tag: "23",  mandatory: false },
      { tag: "30",  mandatory: true },
      { tag: "31E", mandatory: false },
      { tag: "32B", mandatory: false },
      { tag: "77C", mandatory: false },
      { tag: "15B", mandatory: false },
      { tag: "72",  mandatory: false }
    ]
  },
  "768": {
    type: "768",
    name: "Acknowledgement of a Guarantee / Standby LC",
    description: "Acknowledges receipt of a guarantee or standby LC message.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "22D", mandatory: false },
      { tag: "30", mandatory: true },
      { tag: "77A", mandatory: false }
    ]
  },
  "769": {
    type: "769",
    name: "Advice of Reduction or Release of Guarantee",
    description: "Advises reduction in amount or release of a guarantee or standby LC.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "30", mandatory: true },
      { tag: "32B", mandatory: false },
      { tag: "77A", mandatory: false },
      { tag: "72", mandatory: false }
    ]
  },
  "790": {
    type: "790",
    name: "Advice of Charges (Category 7)",
    description: "Advises of charges related to Category 7 documentary credit and guarantee operations.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "72", mandatory: false }
    ]
  },
  "791": {
    type: "791",
    name: "Request for Payment of Charges (Category 7)",
    description: "Requests payment of charges related to Category 7 operations.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "72", mandatory: false }
    ]
  },
  "795": {
    type: "795",
    name: "Queries (Category 7)",
    description: "Free-format query related to a Category 7 message.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "79", mandatory: true }
    ]
  },
  "796": {
    type: "796",
    name: "Answers (Category 7)",
    description: "Free-format answer to a Category 7 query.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "79", mandatory: false }
    ]
  },
  "798": {
    type: "798",
    name: "Proprietary Message (Category 7)",
    description: "Proprietary message format for trade finance operations agreed bilaterally.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "12", mandatory: true }
    ]
  },
  "799": {
    type: "799",
    name: "Free Format Message (Category 7)",
    description: "Free-format message for Category 7 when no specific MT exists. Widely used for bank-to-bank trade finance communication.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "79", mandatory: true }
    ]
  },
  // ── Category 9: Cash Management & Customer Status ──
  "920": {
    type: "920",
    name: "Request Message",
    description: "Requests one or more statement messages (MT940, MT941, MT942, MT950) from an account servicing institution.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "12",  mandatory: true },
      { tag: "25",  mandatory: true },
      { tag: "34F", mandatory: false },
      { tag: "13D", mandatory: false }
    ]
  },
  "935": {
    type: "935",
    name: "Rate Change Advice",
    description: "Advises account holders of changes in interest rates applicable to their accounts.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "25",  mandatory: true },
      { tag: "37G", mandatory: true },
      { tag: "30",  mandatory: true },
      { tag: "72",  mandatory: false }
    ]
  },
  "941": {
    type: "941",
    name: "Balance Report",
    description: "Reports the balances of a customer account without transaction details. A lightweight alternative to MT940.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "25",  mandatory: true },
      { tag: "28C", mandatory: true },
      { tag: "13D", mandatory: false },
      { tag: "60F", mandatory: false, oneOf: ["60F", "60M"] },
      { tag: "60M", mandatory: false, oneOf: ["60F", "60M"] },
      { tag: "62F", mandatory: false, oneOf: ["62F", "62M"] },
      { tag: "62M", mandatory: false, oneOf: ["62F", "62M"] },
      { tag: "64",  mandatory: false },
      { tag: "65",  mandatory: false, repetitive: true }
    ]
  },
  "970": {
    type: "970",
    name: "Netting Statement",
    description: "Reports the net position resulting from bilateral netting of financial obligations.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "25",  mandatory: true },
      { tag: "28C", mandatory: true },
      { tag: "60F", mandatory: false },
      { tag: "61",  mandatory: false, repetitive: true },
      { tag: "62F", mandatory: false },
      { tag: "64",  mandatory: false }
    ]
  },
  "971": {
    type: "971",
    name: "Netting Balance Report",
    description: "Reports the net balance position without individual transaction details.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "25",  mandatory: true },
      { tag: "28C", mandatory: true },
      { tag: "60F", mandatory: false },
      { tag: "62F", mandatory: false },
      { tag: "64",  mandatory: false }
    ]
  },
  "972": {
    type: "972",
    name: "Netting Interim Statement",
    description: "Reports interim netting positions during a netting cycle.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "25",  mandatory: true },
      { tag: "28C", mandatory: true },
      { tag: "60F", mandatory: false },
      { tag: "61",  mandatory: false, repetitive: true },
      { tag: "62F", mandatory: false }
    ]
  },
  "973": {
    type: "973",
    name: "Netting Request Message",
    description: "Requests netting statements or balance reports.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "12",  mandatory: true },
      { tag: "25",  mandatory: true }
    ]
  },
  "985": {
    type: "985",
    name: "Status Enquiry",
    description: "Enquires about the status of a previously sent message.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "11S", mandatory: true }
    ]
  },
  "986": {
    type: "986",
    name: "Status Report",
    description: "Reports the status of a previously sent message in response to an MT985.",
    fields: [
      { tag: "20",  mandatory: true },
      { tag: "21",  mandatory: true },
      { tag: "76",  mandatory: false },
      { tag: "79",  mandatory: false }
    ]
  },
  "990": {
    type: "990",
    name: "Advice of Charges (Category 9)",
    description: "Advises of charges related to Category 9 cash management messages.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "32B", mandatory: true },
      { tag: "72", mandatory: false }
    ]
  },
  "992": {
    type: "992",
    name: "Request for Cancellation (Category 9)",
    description: "Requests cancellation of a previously sent Category 9 message.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "11S", mandatory: true },
      { tag: "79", mandatory: true }
    ]
  },
  "995": {
    type: "995",
    name: "Queries (Category 9)",
    description: "Free-format query related to a Category 9 message.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "79", mandatory: true }
    ]
  },
  "996": {
    type: "996",
    name: "Answers (Category 9)",
    description: "Free-format answer to a Category 9 query.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "79", mandatory: false }
    ]
  },
  "999": {
    type: "999",
    name: "Free Format Message (Category 9)",
    description: "Free-format message for Category 9 when no specific MT exists.",
    fields: [
      { tag: "20", mandatory: true },
      { tag: "21", mandatory: true },
      { tag: "79", mandatory: true }
    ]
  }
};

export function getFieldDef(tag: string): FieldDef | undefined {
  return FIELD_DEFS[tag];
}

export function getMTTypeDef(mtType: string): MTTypeDef | undefined {
  return MT_TYPE_DEFS[mtType];
}

export function getFieldMandatoryStatus(tag: string, mtType: string): 'mandatory' | 'optional' | 'unknown' {
  const typeDef = MT_TYPE_DEFS[mtType];
  if (!typeDef) return 'unknown';
  const spec = typeDef.fields.find(f => f.tag === tag);
  if (!spec) return 'unknown';
  if (spec.mandatory) return 'mandatory';
  if (spec.oneOf) {
    // It's mandatory as part of a group — report it as "mandatory (one of group)"
    return 'mandatory';
  }
  return 'optional';
}

export function getMTTypeSummary(mtType: string): string {
  const def = MT_TYPE_DEFS[mtType];
  return def ? `MT${mtType} — ${def.name}` : `MT${mtType}`;
}

export function getAllKnownTags(): Set<string> {
  return new Set(Object.keys(FIELD_DEFS));
}
