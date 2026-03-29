// APPS_SCRIPT_TEMPLATE.gs
// Copy this into every new game's Apps Script deployment.
// Change nothing. It works for every game as-is.
// The only thing that changes per game is which Sheet it's bound to.

const SHEET_NAME = 'GameData';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({status:'error',msg:'Sheet "GameData" not found'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([
      new Date().toISOString(),
      data.sessionId    || '',
      data.level        || '',
      data.attempts     || 0,
      data.correct      || 0,
      data.wrong        || 0,
      data.accuracy     || '',
      data.hintsUsed    || 0,
      data.timeOnTask   || 0,
      data.coins        || 0,
      data.achievements || 0,
      data.complete     || false
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({status:'ok'}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({status:'error',msg:err.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test endpoint — GET request returns OK
// Use to verify deployment works before pasting URL into game
function doGet() {
  return ContentService.createTextOutput('OK');
}