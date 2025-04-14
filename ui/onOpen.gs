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
