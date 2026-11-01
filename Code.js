function onOpen() {
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

	scrollToBottom(sheet);
	applyMonthBorders(sheet);

	addOpenSummaryButton();
}

function showSummary() {
	const html =
		HtmlService.createHtmlOutputFromFile("Sidebar").setTitle(
			"Income & Expenses",
		);

	SpreadsheetApp.getUi().showSidebar(html);
}

function getSummary() {
	const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
	const sheet = spreadsheet.getActiveSheet();
	const timeZone = spreadsheet.getSpreadsheetTimeZone();
	const lastRow = sheet.getLastRow();

	let expenses = 0;
	let income = 0;

	// Month key -> monthly totals and category totals.
	const monthlyTotals = new Map();

	if (lastRow >= 2) {
		// A = Date, B = Tags, C = Expenses, D = Income.
		const rows = sheet.getRange(2, 1, lastRow - 1, 4).getValues();

		for (const row of rows) {
			const date = row[0];
			const tagValue = row[1];
			const expense = row[2];
			const earned = row[3];

			const expenseValue = typeof expense === "number" ? expense : 0;

			const incomeValue = typeof earned === "number" ? earned : 0;

			// Overall totals include rows with missing or invalid dates.
			expenses += expenseValue;
			income += incomeValue;

			// Monthly reports require a valid date.
			if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
				continue;
			}

			const monthKey = Utilities.formatDate(date, timeZone, "yyyy-MM");

			if (!monthlyTotals.has(monthKey)) {
				monthlyTotals.set(monthKey, {
					key: monthKey,
					month: Utilities.formatDate(date, timeZone, "MMMM yyyy"),
					expenses: 0,
					income: 0,
					categoryTotals: new Map(),
				});
			}

			const month = monthlyTotals.get(monthKey);

			month.expenses += expenseValue;
			month.income += incomeValue;

			// Categorize non-zero numeric expenses only.
			if (typeof expense !== "number" || expenseValue === 0) {
				continue;
			}

			const originalTag = tagValue == null ? "" : String(tagValue).trim();

			const normalizedTag = originalTag
				? originalTag.toLowerCase()
				: "untagged";

			const displayTag = originalTag || "Untagged";

			if (!month.categoryTotals.has(normalizedTag)) {
				month.categoryTotals.set(normalizedTag, {
					tag: displayTag,
					expenses: 0,
				});
			}

			month.categoryTotals.get(normalizedTag).expenses += expenseValue;
		}
	}

	const months = Array.from(monthlyTotals.entries())
		.sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
		.map(([, month]) => {
			const categories = Array.from(month.categoryTotals.values())
				.map((category) => ({
					tag: category.tag,
					expenses: category.expenses,
					percentage:
						month.expenses !== 0
							? (category.expenses / month.expenses) * 100
							: 0,
				}))
				.sort((a, b) => b.expenses - a.expenses || a.tag.localeCompare(b.tag));

			return {
				categories,
				key: month.key,
				month: month.month,
				income: month.income,
				expenses: month.expenses,
				balance: month.income - month.expenses,
			};
		});

	return {
		months,
		income,
		expenses,
		balance: income - expenses,
	};
}

function addOpenSummaryButton() {
	SpreadsheetApp.getUi()
		.createMenu("Expense Tools")
		.addItem("Open summary", "showSummary")
		.addToUi();
}

function scrollToBottom(sheet) {
	const lastRow = sheet.getLastRow();
	const maxRows = sheet.getMaxRows();

	let targetRow = lastRow + 1;

	if (targetRow > maxRows) targetRow = maxRows;

	sheet.setActiveRange(sheet.getRange(targetRow, 1));
}
