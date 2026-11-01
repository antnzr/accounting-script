function onOpen(): void {
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

	scrollToBottom(sheet);
	applyMonthBorders(sheet);
	addOpenSummaryButton();
}
