function scrollToBottom(sheet: GoogleAppsScript.Spreadsheet.Sheet): void {
	const lastRow = sheet.getLastRow();
	const maxRows = sheet.getMaxRows();

	let targetRow = lastRow + 1;
	if (targetRow > maxRows) targetRow = maxRows;

	sheet.setActiveRange(sheet.getRange(targetRow, 1));
}
