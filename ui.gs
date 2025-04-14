/**
 * Optional: Add custom menu items.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Custom Scripts")
    .addItem("Add Orderline (Form)", "showOrderlineForm")
    .addItem("Select Copy Row", "showFilteredPopup")
    .addToUi();
}

function showOrderlineForm() {
  const html = HtmlService.createHtmlOutputFromFile("OrderlineForm")
    .setWidth(600)
    .setHeight(350);
  SpreadsheetApp.getUi().showModalDialog(html, "Add Orderline");
}

function showCustomerSearch() {
  const html = HtmlService.createHtmlOutputFromFile("CustomerSearch")
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, "Search for a Customer");
}

function showCopySelectionDialog() {
  const html = HtmlService.createHtmlOutputFromFile("popup")
    .setWidth(600)
    .setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(html, "Select a Cart Row");
}
