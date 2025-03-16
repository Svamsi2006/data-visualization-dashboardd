import * as XLSX from 'xlsx';

export function convertXlsToJson(file, callback) {
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Ensure data is cleaned and converted properly
            const jsonData = {};
            workbook.SheetNames.forEach(sheetName => {
                const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                // Clean data (optional but recommended)
                jsonData[sheetName] = sheetData.map(row =>
                    Object.fromEntries(
                        Object.entries(row).map(([key, value]) => [key.trim(), value])
                    )
                );
            });

            callback(jsonData);
        } catch (error) {
            console.error("Error processing XLS file:", error);
            document.getElementById('error-message').innerText = "Error: Invalid XLS file format.";
        }
    };

    reader.onerror = (error) => {
        console.error("Error reading XLS file:", error);
        document.getElementById('error-message').innerText = "Error reading file. Please try again.";
    };

    reader.readAsArrayBuffer(file);
}
