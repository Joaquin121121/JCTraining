const apiKey = "AIzaSyCTMuX2AxFOqd_g96sF8KJAXH_fisEMQgo";

function determineCategoria(ejercicio) {
  if (!ejercicio) return "";

  // Convert to lowercase for case-insensitive matching
  const ejercicioLower = ejercicio.toLowerCase();

  if (ejercicioLower.includes("z1")) return "Recuperacion Activa";
  if (ejercicioLower.includes("z2")) return "Resistencia";
  if (ejercicioLower.includes("z3")) return "Ritmo";
  if (ejercicioLower.includes("z4")) return "Umbral";
  if (ejercicioLower.includes("z5")) return "VO2 Max";
  if (ejercicioLower.includes("z6")) return "Cap. anaeróbica";
  if (ejercicioLower.includes("z7")) return "Potencia";

  return "";
}
function getSpreadsheetIdFromUrl(url) {
  const matches = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return matches ? matches[1] : null;
}

function normalizeSheetName(sheetName) {
  const cleaned = sheetName.replace(/SEMANA\s+/i, "").trim();
  return cleaned;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, maxRetries = 3, initialDelay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        if (data.error.code === 429) {
          const delayTime = initialDelay * Math.pow(2, i);
          console.log(
            `Rate limit hit, waiting ${
              delayTime / 1000
            } seconds before retry...`
          );
          await delay(delayTime);
          continue;
        }
        throw new Error(data.error.message);
      }

      return data;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delayTime = initialDelay * Math.pow(2, i);
      await delay(delayTime);
    }
  }
}

function getTargetWeeks(weeksBack) {
  const dates = [];
  const today = new Date();

  // Go back to most recent Monday
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const currentMonday = new Date(today.setDate(diff));

  // Add current week and previous weeks as requested
  for (let i = 0; i <= weeksBack; i++) {
    const targetDate = new Date(currentMonday);
    targetDate.setDate(currentMonday.getDate() - i * 7);

    const dd = String(targetDate.getDate()).padStart(2, "0");
    const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
    dates.push(`${dd}/${mm}`);
  }

  return dates;
}

export default async function loadData(email, weeksBack = 0) {
  try {
    // 1. Get Dashboard data
    const dashboardUrl =
      "https://docs.google.com/spreadsheets/d/1fyXJ6qcJwCeNjFFnuD4-ly8vxD6TAKdLsOhKRsPHLCY/edit?usp=sharing";
    const dashboardId = getSpreadsheetIdFromUrl(dashboardUrl);

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${dashboardId}/values/Dashboard?key=${apiKey}`;

    const data = await fetchWithRetry(url);
    const values = data.values || [];
    if (!values.length) return null;

    const headerIndex = values.findIndex(
      (row) => row.includes("mail") && row.includes("api")
    );
    if (headerIndex === -1) return null;

    const headers = values[headerIndex];
    const mailIndex = headers.indexOf("mail");
    const apiIndex = headers.indexOf("api");

    if (mailIndex === -1 || apiIndex === -1) return null;

    let userdataLink;
    for (let i = headerIndex + 1; i < values.length; i++) {
      const row = values[i];
      if (row[mailIndex] === email) {
        userdataLink = row[apiIndex];
        break;
      }
    }

    if (!userdataLink) return null;

    const userSpreadsheetId = getSpreadsheetIdFromUrl(userdataLink);
    const sheetsMetadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${userSpreadsheetId}?key=${apiKey}`;
    const metadata = await fetchWithRetry(sheetsMetadataUrl);

    const sheets = metadata.sheets;
    console.log("Total sheets found:", sheets.length);

    // Get the target weeks
    const targetDates = getTargetWeeks(weeksBack);
    console.log("Fetching data for weeks:", targetDates);

    // Process each sheet
    const dayMapping = {
      0: "monday",
      1: "tuesday",
      2: "wednesday",
      3: "thursday",
      4: "friday",
      5: "saturday",
      6: "sunday",
    };

    // Process each sheet
    const allSheetsData = {};
    targetDates.forEach((date) => {
      allSheetsData[date] = {
        monday: {
          duracion: "No Registrado",
          ejercicio: "No Registrado",
          comentarios: "No Registrado",
          categoria: "No Registrado",
        },
        tuesday: {
          duracion: "No Registrado",
          ejercicio: "No Registrado",
          comentarios: "No Registrado",
          categoria: "No Registrado",
        },
        wednesday: {
          duracion: "No Registrado",
          ejercicio: "No Registrado",
          comentarios: "No Registrado",
          categoria: "No Registrado",
        },
        thursday: {
          duracion: "No Registrado",
          ejercicio: "No Registrado",
          comentarios: "No Registrado",
          categoria: "No Registrado",
        },
        friday: {
          duracion: "No Registrado",
          ejercicio: "No Registrado",
          comentarios: "No Registrado",
          categoria: "No Registrado",
        },
        saturday: {
          duracion: "No Registrado",
          ejercicio: "No Registrado",
          comentarios: "No Registrado",
          categoria: "No Registrado",
        },
        sunday: {
          duracion: "No Registrado",
          ejercicio: "No Registrado",
          comentarios: "No Registrado",
          categoria: "No Registrado",
        },
      };
    });
    let processedSheets = 0;

    for (let i = 0; i < sheets.length; i++) {
      const sheet = sheets[i];
      const sheetName = sheet.properties.title;

      if (!sheetName.match(/(\d{2}\/\d{2}|SEMANA\s+\d{2}\/\d{2})/i)) {
        console.log(
          `Skipping sheet ${sheetName} - doesn't match expected format`
        );
        continue;
      }

      const normalizedName = normalizeSheetName(sheetName);

      // Skip if this week is not in our target weeks
      if (!targetDates.includes(normalizedName)) {
        console.log(`Skipping sheet ${normalizedName} - not in target weeks`);
        continue;
      }

      const encodedSheetName = encodeURIComponent(sheetName);
      const rangeUrl = `https://sheets.googleapis.com/v4/spreadsheets/${userSpreadsheetId}/values/${encodedSheetName}!B6:I12?key=${apiKey}`;

      console.log(`Fetching sheet ${++processedSheets}: ${sheetName}`);

      try {
        const rangeData = await fetchWithRetry(rangeUrl);
        const sheetValues = rangeData.values || [];

        if (sheetValues.length > 0) {
          // Initialize the week data with empty days
          allSheetsData[normalizedName] = {
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
            saturday: null,
            sunday: null,
          };

          // Process each row and assign to corresponding day
          sheetValues.forEach((row, index) => {
            if (row && (row[0] || row[1])) {
              const ejercicio = row[1] || "";
              const dayName = dayMapping[index];
              allSheetsData[normalizedName][dayName] = {
                duracion: row[0] || "",
                ejercicio: ejercicio,
                comentarios: row.slice(2).filter(Boolean).join(" ").trim(),
                categoria: determineCategoria(ejercicio),
              };
            }
          });
        }

        if (i < sheets.length - 1) {
          await delay(1000);
        }
      } catch (error) {
        console.log(`Error processing sheet ${sheetName}:`, error);
        continue;
      }
    }

    return allSheetsData;
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
}

// Example usage:
// For just this week:
/* loadData("joaquindelrio121@gmail.com", 0).then((result) => {
  console.log("This week's data:", result);
});

// For this week and last week:
loadData("joaquindelrio121@gmail.com", 1).then((result) => {
  console.log("Last two weeks' data:", result);
});

// For this week and three weeks back:
loadData("joaquindelrio121@gmail.com", 3).then((result) => {
  console.log("Last four weeks' data:", result);
});
 */
