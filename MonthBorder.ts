/** Automatically finds month transitions and draws divider lines. */
function applyMonthBorders(sheet: GoogleAppsScript.Spreadsheet.Sheet): void {
	const COLOR = "#434343";
	const lastRow = sheet.getLastRow();
	if (lastRow < 2) return; // Exit if the sheet is empty

	// Clear any existing custom borders in the 6-column range (Columns A to F).
	sheet.getRange(2, 1, lastRow - 1, 6).setBorder(null, null, null, null, null, null);

	// Fetch all dates from Column A (assuming dates start from Row 2).
	const dates = sheet.getRange(2, 1, lastRow - 1, 1).getValues();

	// Detect where the month changes.
	for (let i = 0; i < dates.length - 1; i++) {
		const currentDate = new Date(dates[i][0] as string);
		const nextDate = new Date(dates[i + 1][0] as string);

		// Validate that both cells contain valid dates.
		if (Number.isNaN(currentDate.getTime()) || Number.isNaN(nextDate.getTime())) {
			continue;
		}

		// Check if the next row has a different month or year.
		if (
			currentDate.getMonth() !== nextDate.getMonth() ||
			currentDate.getFullYear() !== nextDate.getFullYear()
		) {
			const rowToBorder = i + 2; // Map loop index to the actual spreadsheet row number.
			const rowRange = sheet.getRange(rowToBorder, 1, 1, 6);

			// Apply a solid, medium-weight dark grey bottom border.
			rowRange.setBorder(
				null,
				null,
				true,
				null,
				null,
				null,
				COLOR,
				SpreadsheetApp.BorderStyle.SOLID,
			);
		}
	}
}
