/**
 * Automatically finds month transitions and draws divider lines.
 */
function applyMonthBorders(sheet) {
	const COLOR = "#434343";
	const lastRow = sheet.getLastRow();
	if (lastRow < 2) return; // Exit if the sheet is empty

	// 1. Clear any existing custom borders in the 6-column range (Columns A to F)
	sheet
		.getRange(2, 1, lastRow - 1, 6)
		.setBorder(null, null, null, null, null, null);

	// 2. Fetch all dates from Column A (assuming dates start from Row 2)
	const dates = sheet.getRange(2, 1, lastRow - 1, 1).getValues();

	// 3. Loop through rows to detect where the month changes
	for (let i = 0; i < dates.length - 1; i++) {
		const currentDate = new Date(dates[i]);
		const nextDate = new Date(dates[i + 1]);

		// Validate that both cells contain valid dates
		if (isNaN(currentDate.getTime()) || isNaN(nextDate.getTime())) continue;

		// Check if the next row has a different month or year
		if (
			currentDate.getMonth() !== nextDate.getMonth() ||
			currentDate.getFullYear() !== nextDate.getFullYear()
		) {
			const rowToBorder = i + 2; // Map loop index to the actual spreadsheet row number
			const rowRange = sheet.getRange(rowToBorder, 1, 1, 6); // Select all 6 columns for this row

			// Apply a solid, medium-weight dark grey bottom border
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
