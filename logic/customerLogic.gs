const EXTERNAL_SPREADSHEET_ID = "1SdIU-vNd1gI52RIQJBuBqJVEoG9MqP3BdTb2ICjsXo0";
const LOCAL_SHEET = "Schedule";

function getCustomerMatches(query) {
  var externalSS = SpreadsheetApp.openById(EXTERNAL_SPREADSHEET_ID);
  var sourceSheet = externalSS.getSheetByName("WJBM Customer Account Browser");
  Logger.log("Query received: " + query);
  if (!sourceSheet) {
    Logger.log("Error: Sheet 'WJBM Customer Account Browser' not found in external file.");
    return [];
  }

  // Assuming the sponsor names are in Column B starting at row 2
  var data = sourceSheet.getRange("B2:B").getValues().flat();
  Logger.log("Total Customers Found: " + data.length);
  
  var matches = [];
  query = query.toLowerCase();
  for (var i = 0; i < data.length; i++) {
    if (data[i] && data[i].toLowerCase().includes(query)) {
      matches.push(data[i]);
    }
  }
  Logger.log("Matching Customers: " + matches.join(", "));
  return matches.slice(0, 10); // Limit to 10 matches
}

function selectCustomer(customerName) {
  var localSS = SpreadsheetApp.getActiveSpreadsheet();
  var localSheet = localSS.getSheetByName(LOCAL_SHEET);
  if (!localSheet) {
    Logger.log("Local sheet 'sheet1' not found.");
    return;
  }
  // Optionally, set the selected sponsor name (for example, cell B2)
  localSheet.getRange("B2").setValue(customerName);
  // Retrieve and populate customer details from the external spreadsheet into local sheet1
  fillCustomerDetails(customerName);
}

// This function looks up the sponsor in the external file and populates the local file’s LOCAL_SHEET with:
// Sponsor → B3, Address → B4, City/State → B5, Zipcode → B6, Account Rep → F3.
function fillCustomerDetails(sponsorName) {
  var externalSS = SpreadsheetApp.openById(EXTERNAL_SPREADSHEET_ID);
  var sourceSheet = externalSS.getSheetByName("WJBM Customer Account Browser");
  if (!sourceSheet) {
    Logger.log("Error: Source sheet not found in external file.");
    return;
  }
  
  // Retrieve all data (assuming row 1 contains headers)
  var data = sourceSheet.getDataRange().getValues();
  
  // Column mapping (0-indexed): Column B (index 1) = Sponsor, C (2) = Address, D (3) = City/State, 
  // E (4) = Zipcode, F (5) = Account Rep
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] && data[i][1].toString().toLowerCase() === sponsorName.toLowerCase()) {
      var custID     = data[i][0];
      var sponsor    = data[i][1];
      var address    = data[i][2];
      var cityState  = data[i][3];
      var zipcode    = data[i][4];
      var accountRep = data[i][5];
      
      var localSS = SpreadsheetApp.getActiveSpreadsheet();
      var localSheet = localSS.getSheetByName(LOCAL_SHEET);
      if (!localSheet) {
        Logger.log("Local sheet 'sheet1' not found.");
        return;
      }
      
      localSheet.getRange("C1").setValue(custID)
      localSheet.getRange("C3").setValue(sponsor);
      localSheet.getRange("C4").setValue(address);
      localSheet.getRange("C5").setValue(cityState);
      localSheet.getRange("C6").setValue(zipcode);
      localSheet.getRange("I3").setValue(accountRep);
      
      break; // Exit loop after finding the matching sponsor
    }
  }
}
