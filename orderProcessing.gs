function processOrderSubmission() {
  try {
    validateOrderData();
    const orderNumber = submitOrder();
    const copiedFileName = copyOrderForm(orderNumber);
    clearOrderForm();
    Logger.log("Order submitted and saved as " + copiedFileName);
    return "Order submitted and saved as " + copiedFileName;
  } catch (error) {
    Logger.log("Error in order submission: " + error.message);
    throw error;
  }
}
/**
 * Subfunction :
 * Checks cells to see if there required data was added
 * If the fields were not filled the submission is rejected and the necessary fields are highlighted red
 * 
 */
function validateOrderData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Define the required fields along with their cell ranges and labels.
  var requiredFields = [
    {range: sheet.getRange("C1"), label: "Customer ID (cell C1)"},
    {range: sheet.getRange("C3"), label: "Sponsor (cell C3)"},
    {range: sheet.getRange("C9"), label: "Start Date (cell C9)"},
    {range: sheet.getRange("C10"), label: "End Date (cell C10)"},
    {range: sheet.getRange("I8"), label: "Invoice Period (cell I8)"},
    {range: sheet.getRange("I5"), label: "Total Cost (cell I5)"},
    {range: sheet.getRange("I3"), label: "Account Rep (cell I3)"}
  ];
  
  var missingFields = [];
  
  // Loop through each required field to check if it contains data.
  for (var i = 0; i < requiredFields.length; i++) {
    var cell = requiredFields[i].range;
    var value = cell.getValue();
    
    // If the field is empty, mark it red and record the missing field.
    if (!value || value.toString().trim() === "") {
      cell.setBackground("rgb(255,100,100)");
      missingFields.push(requiredFields[i].label);
    } else {
      // If the field is filled, reset its background to light gray.
      cell.setBackground("rgb(200,200,200)");
    }
  }
  
  // If any required fields are missing, throw an error with a descriptive message.
  if (missingFields.length > 0) {
    throw new Error("Missing required fields: " + missingFields.join(", "));
  }
}

/**
 * Subfunction :
 * Reads values from the active order form, calculates the order number,
 * and appends the order data to the "Broadcast Orders" sheet.
 * Returns the generated order number.
 */
function submitOrder() {
  // Open the "Broadcast Orders" spreadsheet by its file ID.
  var broadcastSS = SpreadsheetApp.openById('1y9CccjD6yW74tPFz9MgUvsp32RJUFenp3AhaOR32VaM');
  var broadcastSheet = broadcastSS.getSheetByName("Broadcast Orders");
  
  // Get values from the active order submission sheet.
  var activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Retrieve values.
  // CustID is in cell C1. We'll pad it to 4 digits.
  var custID = activeSheet.getRange("C1").getValue().toString().padStart(4, '0');
  var sponsor = activeSheet.getRange("C3").getValue();
  var startDate = activeSheet.getRange("C9").getValue();
  var endDate = activeSheet.getRange("C10").getValue();
  var invoicePeriod = activeSheet.getRange("I8").getValue();
  var totalCost = activeSheet.getRange("I5").getValue();
  var timestamp = new Date()
  
  // Calculate the Order Number by counting previous orders for this custID in column A.
  var lastRow = broadcastSheet.getLastRow();
  var orderCount = 0;
  if (lastRow >= 2) { // Assuming row 1 is headers.
    var data = broadcastSheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < data.length; i++) {
      // Pad the stored custID to 4 digits for proper comparison.
      var existingCustID = data[i][0].toString().padStart(4, '0');
      if (existingCustID === custID) {
        orderCount++;
      }
    }
  }
  
  // Generate the Order Number in the format "CustID-XXX" (e.g., "0001-001").
  var newOrderCount = orderCount + 1;
  var orderNumber = custID + "-" + ("00" + newOrderCount).slice(-3);
  
  // Build the row array in the order: CustID, Order Number, Sponsor, Start Date, End Date, Invoice Period, Total Cost.
  var newRow = [custID, orderNumber, sponsor, startDate, endDate, invoicePeriod, totalCost, timestamp];
  
  // Append the new row to the "Broadcast Orders" sheet.
  broadcastSheet.appendRow(newRow);
  Logger.log("New broadcast order submitted: " + newRow);
  
  // Return the generated order number for further use.
  return orderNumber;
}
/**
 * Subfunction :
 * Copies the current order form file to the proper folder structure based on Account Rep and Sponsor.
 * The Account Rep is retrieved from cell I3, and Sponsor from cell C3.
 * The copied file is renamed "Order [orderNumber]".
 */
function copyOrderForm(orderNumber) {
  // Get the active order form (container-bound spreadsheet) and its active sheet.
  var orderForm = SpreadsheetApp.getActiveSpreadsheet();
  var activeSheet = orderForm.getActiveSheet();
  
  // Retrieve Account Rep from cell I3 and Sponsor from cell C3.
  var accountRep = activeSheet.getRange("I3").getValue();
  var sponsor = activeSheet.getRange("C3").getValue();
  
  // Get the file of the active order form.
  var file = DriveApp.getFileById(orderForm.getId());
  
  // Navigate the folder structure (as before)...
  var topFolderIter = DriveApp.getFoldersByName("WJBM");
  if (!topFolderIter.hasNext()) throw new Error("Top folder 'WJBM' not found.");
  var topFolder = topFolderIter.next();
  
  var advertiserFolderIter = topFolder.getFoldersByName("Advertiser Files");
  if (!advertiserFolderIter.hasNext()) throw new Error("Folder 'Advertiser Files' not found.");
  var advertiserFolder = advertiserFolderIter.next();
  
  var accountRepFolderIter = advertiserFolder.getFoldersByName(accountRep);
  if (!accountRepFolderIter.hasNext()) throw new Error("Folder for Account Rep '" + accountRep + "' not found.");
  var accountRepFolder = accountRepFolderIter.next();
  
  var sponsorFolderIter = accountRepFolder.getFoldersByName(sponsor);
  if (!sponsorFolderIter.hasNext()) throw new Error("Folder for Sponsor '" + sponsor + "' not found.");
  var sponsorFolder = sponsorFolderIter.next();
  
  // Create a new file name in the format "Order [orderNumber]".
  var newFileName = "Order " + orderNumber;
  
  // Make a copy of the active order form and save it in the Sponsor folder.
  var newFile = file.makeCopy(newFileName, sponsorFolder);
  
  // *** Remove buttons from the copied file:
  var newSpreadsheet = SpreadsheetApp.open(newFile);
  removeButtonsFromSpreadsheet(newSpreadsheet);
  
  Logger.log("Order form copied and saved as: " + newFileName);
  
  return newFileName;
  
}
// Helper Function-- called when making a copy and then saving to file
function removeButtonsFromSpreadsheet(spreadsheet) {
  var sheets = spreadsheet.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var drawings = sheets[i].getDrawings();
    for (var j = 0; j < drawings.length; j++) {
      drawings[j].remove();
    }
  }
}
