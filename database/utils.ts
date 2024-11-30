/* Get the current data and time in UTC
 * format: YYYY-MM-DD HH:MM:SS
 */
export function getDateNow() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function convertIntoJSONFormat(list: any[], targetColumn: string) {
  return list.map((item) => {
    if (Array.isArray(item[targetColumn])) {
      item[targetColumn] = item[targetColumn].map((value) => `"${value}"`);
    }
    return item;
  });
}

export function convertOutJSONFormat(list: any[], targetColumn: string) {
  return list.map((item) => {
    if (typeof item[targetColumn] === "string") {
      // Parse the JSON string into an array
      const parsedArray = JSON.parse(item[targetColumn]);

      // Ensure it's an array and process elements if necessary
      if (Array.isArray(parsedArray)) {
        item[targetColumn] = parsedArray.map((value) =>
          typeof value === "string" ? value.replace(/^"|"$/g, "") : value
        );
      }
    }
    return item;
  });
}
