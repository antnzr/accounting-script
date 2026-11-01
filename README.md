# Accounting Script

A Google Apps Script project for tracking personal income and expenses in Google Sheets. It adds a monthly summary sidebar and visual month dividers to the active sheet.

## Spreadsheet layout

The active sheet should use these columns, with transactions starting on row 2:

| Column | Contents |
| --- | --- |
| A | Date |
| B | Item description |
| C | Expense amount |
| D | Income amount |
| E | Payment type |
| F | Notes |

The summary shows overall income, expenses, and balance; totals by month; and expenses grouped by category for a selected month. Rows with missing or invalid dates count toward overall totals, but not monthly totals. Expenses without a category are grouped under “Untagged.”

When the spreadsheet opens, the script selects the next row after the last transaction (or the last available row), adds dividers between months, and creates the **Expense Tools → Open summary** menu.

## Project files

- `Triggers.ts` contains the spreadsheet `onOpen()` trigger.
- `SheetNavigation.ts` moves the active selection near the bottom of the sheet.
- `MonthBorder.ts` draws borders where adjacent rows cross a month boundary.
- `SummarySidebar.ts` creates the menu and sidebar and reads transactions from the active sheet.
- `Summary.ts` contains the summary types and calculation logic.
- `Sidebar.html` defines the sidebar UI and its browser-side JavaScript.
- `appsscript.json` configures the Apps Script runtime and timezone.
- `scripts/prepare-build.mjs` prepares the generated Apps Script directory.

## Development and deployment

This project uses Node.js 26 LTS. Use fnm to select that version, install dependencies with pnpm, then check types and build the Apps Script files:

```sh
fnm install
fnm use
pnpm install
pnpm run check-types
pnpm run build
```

The build clears and recreates `build/`, compiling TypeScript to JavaScript and copying `Sidebar.html` and `appsscript.json` into it. The generated directory is ignored by Git.

To connect the project, install and authenticate the clasp CLI and configure the local, Git-ignored `.clasp.json` with the Apps Script project ID and `rootDir` set to `build`. After building, push manually:

```sh
clasp push
```

The Apps Script manifest sets the timezone to `Asia/Almaty` and uses the V8 runtime.
