/**
 * Backend Google Apps Script para Agrícola Huarmey
 * ID de hoja: Form_Responses
 * Pestaña: BDComensales
 */

const SPREADSHEET_ID = "Form_Responses"; 
const SHEET_NAME = "BDComensales";

function getSheet() {
  let ss;
  try {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Configurar cabeceras obligatorias según mapeo
    sheet.appendRow([
      "Marca temporal",
      "Seleccionar Área",
      "Ingrese la Cantidad de Almuerzos(Modulos)",
      "Ingrese la Cantidad Dietas(Modulos)",
      "Ingrese la Cantidad de Almuerzos(Batallón)",
      "Ingrese la Cantidad Dietas(Batallón)"
    ]);
  }
  return sheet;
}

// Endpoint GET: Retorna todos los registros en JSON
function doGet(e) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return createJsonResponse({ status: "success", data: [] });
    }

    const headers = data[0];
    const rows = data.slice(1);

    const result = rows.map(row => {
      let obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    return createJsonResponse({ status: "success", data: result });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

// Endpoint POST: Recibe y registra datos de la PWA
function doPost(e) {
  try {
    const sheet = getSheet();
    const contents = JSON.parse(e.postData.contents);

    const timestamp = contents["Marca temporal"] ? new Date(contents["Marca temporal"]) : new Date();
    const area = contents["Seleccionar Área"] || "";
    const modAlmuerzo = Number(contents["Ingrese la Cantidad de Almuerzos(Modulos)"]) || 0;
    const modDieta = Number(contents["Ingrese la Cantidad Dietas(Modulos)"]) || 0;
    const batAlmuerzo = Number(contents["Ingrese la Cantidad de Almuerzos(Batallón)"]) || 0;
    const batDieta = Number(contents["Ingrese la Cantidad Dietas(Batallón)"]) || 0;

    sheet.appendRow([
      timestamp,
      area,
      modAlmuerzo,
      modDieta,
      batAlmuerzo,
      batDieta
    ]);

    return createJsonResponse({ status: "success", message: "Registro guardado correctamente" });
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}