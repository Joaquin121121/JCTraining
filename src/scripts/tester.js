const apiKey = "AIzaSyCTMuX2AxFOqd_g96sF8KJAXH_fisEMQgo";
function getSpreadsheetIdFromUrl(url) {
  const matches = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return matches ? matches[1] : null;
}
async function loadData(email) {
  try {
    // 1. Get Dashboard data
    const dashboardUrl =
      "https://docs.google.com/spreadsheets/d/1fyXJ6qcJwCeNjFFnuD6-ly8vxD6TAKdLsOhKRsPHLCY/edit?usp=sharing";
    const dashboardId = getSpreadsheetIdFromUrl(dashboardUrl);

    console.log("Dashboard ID:", dashboardId);

    // First, let's get the spreadsheet metadata to see all available sheets
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${dashboardId}?key=${apiKey}`;
    console.log("Fetching metadata from:", metadataUrl);

    const metadataResponse = await fetch(metadataUrl);
    const metadata = await metadataResponse.json();

    if (metadata.error) {
      throw new Error(`Metadata API Error: ${metadata.error.message}`);
    }

    // Log all available sheet names
    console.log(
      "Available sheets:",
      metadata.sheets.map((sheet) => sheet.properties.title)
    );

    // Now try to fetch the specific sheet
    const sheetName = metadata.sheets[0].properties.title; // Use the first sheet's actual name
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${dashboardId}/values/${sheetName}?key=${apiKey}`;

    console.log("Fetching from URL:", url);

    const response = await fetch(url);
    console.log("Response status:", response.status);

    const data = await response.json();
    console.log("Response data:", data);

    if (data.error) {
      throw new Error(`API Error: ${data.error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
}

// Test the function
loadData("joaquindelrio121@gmail.com")
  .then((result) => {
    console.log("Final result:", result);
  })
  .catch((error) => {
    console.error("Final error:", error);
  });
