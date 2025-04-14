function showCopySelectionDialog() {
  const html = HtmlService.createHtmlOutputFromFile("popup")
    .setWidth(600)
    .setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(html, "Select a Cart Row");
}
