function buildFilteredCopyTable() {
// --- Step 1: Open the external spreadsheet and access the "Copy" sheet ---
  var externalSpreadsheetId = "1SdIU-vNd1gI52RIQJBuBqJVEoG9MqP3BdTb2ICjsXo0";  // Replace with your actual ID
  // Retrieves and returns the HTML table with headers (cart, title, length, start date, end date)
// using data filtered by matching the value in column J with cell C1 (from "Schedule" sheet)
  var extSpreadsheet = SpreadsheetApp.openById(externalSpreadsheetId);
  var copySheet = extSpreadsheet.getSheetByName("Copy");
  var data = copySheet.getDataRange().getValues();  // Retrieve all data from the sheet
  
  // Get the lookup value from cell C1 on the "Schedule" sheet of the active spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var scheduleSheet = ss.getSheetByName("Schedule");
  var lookupValue = scheduleSheet.getRange("C1").getValue();
  
  // Filter rows where the value in column J (index 9) matches the lookup value
  var filteredData = data.filter(function(row) {
    return row[9] === lookupValue;
  });
  
  // Define the columns to display and corresponding headers.
  // Here, columns: A (cart), B (title), C (length), G (start date), H (end date)
  var selectedColumns = [0, 1, 2, 6, 7];
  var headers = ["cart", "title", "length", "start date", "end date"];
  
  // Build HTML table string with a header row
  var html = '<table id="dataTable" border="1" style="border-collapse: collapse;">';
  html += "<tr>";
  headers.forEach(function(header) {
    html += "<th style='padding: 4px;'>" + header + "</th>";
  });
  html += "</tr>";
  
  // Loop through each filtered row and select the defined columns.
  filteredData.forEach(function(row) {
    html += "<tr>";
    selectedColumns.forEach(function(colIndex) {
      var cell = row[colIndex];
      // If the cell is a Date object, format it as "MM/dd/yyyy" (or use "MMM dd yyyy" if desired)
      if (cell instanceof Date) {
        cell = Utilities.formatDate(cell, ss.getSpreadsheetTimeZone(), "MM/dd/yyyy");
      }
      html += "<td style='padding: 4px;'>" + cell + "</td>";
    });
    html += "</tr>";
  });
  
  html += "</table>";
  return html;
}

function processCart(cart) {
  Logger.log("Selected Cart: " + cart);
  return cart;
}
