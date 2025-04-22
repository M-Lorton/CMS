function addOrderLineFromForm(formData) {
  var ss = SpreadsheetApp.openById('18YiL3YFLdo_xi_pcLBLqr_E9PqrxA4KnQGGpiWttmz4');
  var sheet = ss.getSheetByName("Schedule");
  
  // Reformat dates and times.
  var startDateFormatted = Helpers.formatDate(formData.startDate);
  var endDateFormatted = Helpers.formatDate(formData.endDate);
  var earliestTimeFormatted = Helpers.formatTime(formData.earliestTime);
  var latestTimeFormatted = Helpers.formatTime(formData.latestTime);
  
  // Build the new row (Columns A–K).
  var newRow = [
    startDateFormatted,         // Column A: Start Date
    endDateFormatted,           // Column B: End Date
    earliestTimeFormatted,      // Column C: Earliest Time
    latestTimeFormatted,        // Column D: Latest Time
    Number(formData.monday),    // Column E (Mon)
    Number(formData.tuesday),   // Column F (Tue)
    Number(formData.wednesday), // Column G (Wed)
    Number(formData.thursday),  // Column H (Thu)
    Number(formData.friday),    // Column I (Fri)
    Number(formData.saturday),  // Column J (Sat)
    Number(formData.sunday)     // Column K (Sun)
  ];
  
  // Calculate weekly sum and add as Column L.
  var weeklySum = newRow.slice(4, 11).reduce(function(sum, value) {
    return sum + value;
  }, 0);
  newRow.push(weeklySum); // Column L
  
  // Determine where to insert the new orderline row.
  var tableStartRow = 13;
  var insertRow = Helpers.getFirstEmptyRowInColumn(sheet, 1, tableStartRow);
  
  // Insert the new row.
  sheet.getRange(insertRow, 1, 1, newRow.length).setValues([newRow]);
  
  Logger.log("Orderline added at row " + insertRow);
  
  // Return the inserted row number for later use.
  return insertRow;
}

function insertOrderlineRow(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Schedule");
  const startRow = 13;
  const startCol = 1;
  const maxCols = 12; // A to L now (added cart)

  const dataRange = sheet.getRange(startRow, startCol, sheet.getMaxRows() - startRow + 1, 1).getValues();
  let targetRow = startRow;
  for (let i = 0; i < dataRange.length; i++) {
    if (!dataRange[i][0]) break;
    targetRow++;
  }

  const row = [
    data.startDate,
    data.endDate,
    data.earliestTime,
    data.latestTime,
    data.monday,
    data.tuesday,
    data.wednesday,
    data.thursday,
    data.friday,
    data.saturday,
    data.sunday,
    data.cart || "" // New column L
  ];

  sheet.getRange(targetRow, startCol, 1, maxCols).setValues([row]);
  return targetRow;
}

