const Helpers = {
  formatDate: function (isoDateString) {
    const parts = isoDateString.split("-");
    return parts[1] + "/" + parts[2] + "/" + parts[0];
  },
  formatTime: function (timeStr) {
    const parts = timeStr.split(":");
    if (parts.length < 2) return timeStr;
    let hour = parseInt(parts[0], 10);
    const minute = parts[1];
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return hour + ":" + minute + " " + period;
  },
  parseMMDDYYYY: function (dateValue) {
    if (!dateValue) return null;
    if (dateValue instanceof Date) {
      return new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate());
    }
    const parts = dateValue.split("/");
    if (parts.length < 3) return null;
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  },
  getFirstEmptyRowInColumn: function (sheet, column, startRow) {
    const lastRow = sheet.getLastRow();
    const data = sheet.getRange(startRow, column, lastRow - startRow + 1, 1).getValues();
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === "" || data[i][0] === null) {
        return startRow + i;
      }
    }
    return lastRow + 1;
  }
};
