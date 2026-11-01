function showSummary(): void {
	const html = HtmlService.createHtmlOutputFromFile("Sidebar").setTitle(
		"Income & Expenses",
	);

	SpreadsheetApp.getUi().showSidebar(html);
}

function getSummary(): SummaryResult {
	const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
	const sheet = spreadsheet.getActiveSheet();
	const timeZone = spreadsheet.getSpreadsheetTimeZone();
	const lastRow = sheet.getLastRow();

	if (lastRow < 2) return calculateSummary([]);

	// A = Date, B = Tags, C = Expenses, D = Income.
	const rows = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
	const transactions: SummaryTransaction[] = rows.map((row) => {
		const date: unknown = row[0];
		let monthKey: string | null = null;
		let month: string | null = null;

		if (date instanceof Date && !Number.isNaN(date.getTime())) {
			monthKey = Utilities.formatDate(date, timeZone, "yyyy-MM");
			month = Utilities.formatDate(date, timeZone, "MMMM yyyy");
		}

		return {
			month,
			monthKey,
			tag: row[1],
			income: row[3],
			expense: row[2],
		};
	});

	return calculateSummary(transactions);
}

function addOpenSummaryButton(): void {
	SpreadsheetApp.getUi()
		.createMenu("Expense Tools")
		.addItem("Open summary", "showSummary")
		.addToUi();
}
