function insertOrderlineRow(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Schedule"); // your corrected name
  const startRow = 13;
  const startCol = 1;
  const maxCols = 15; // A–O

  const dataRange = sheet.getRange(startRow, startCol, sheet.getMaxRows() - startRow + 1, 1).getValues();
  let targetRow = startRow;
  for (let i = 0; i < dataRange.length; i++) {
    if (!dataRange[i][0]) break;
    targetRow++;
  }

  // Parse and calculate weekly total
  const weekdays = [
    parseInt(data.monday) || 0,
    parseInt(data.tuesday) || 0,
    parseInt(data.wednesday) || 0,
    parseInt(data.thursday) || 0,
    parseInt(data.friday) || 0,
    parseInt(data.saturday) || 0,
    parseInt(data.sunday) || 0
  ];
  const weeklyTotal = weekdays.reduce((a, b) => a + b, 0);

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
    weeklyTotal,         // Column L
    data.cart || "",     // Column M
    data.length || "",   // Column N
    data.title || ""     // Column O
  ];

  sheet.getRange(targetRow, startCol, 1, maxCols).setValues([row]);
  return targetRow;
}
