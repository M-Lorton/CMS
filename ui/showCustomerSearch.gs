function showCustomerSearch() {
  const html = HtmlService.createHtmlOutputFromFile("CustomerSearch")
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, "Search for a Customer");
}
