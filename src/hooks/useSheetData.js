import { useState, useEffect } from 'react';

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRACTqdGEHmkSyEsL653V01OqjvNTrKh8K6lzycAjoFgDP8APNVSBaEuX4ikFt67Oi8QqAOt6RUcywY/pub?gid=0&single=true&output=csv";

// Helper to parse CSV ignoring commas inside quotes
const parseCSV = (text) => {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                currentField += '"';
                i++; // skip escaped quote
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentField.trim());
            currentField = '';
        } else if (char === '\n' && !insideQuotes) {
            currentRow.push(currentField.trim());
            rows.push(currentRow);
            currentRow = [];
            currentField = '';
        } else if (char === '\r') {
            // cycle to next char if it's \n
            if (nextChar === '\n') continue;
        } else {
            currentField += char;
        }
    }
    // Push last field/row if exists
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
    }
    return rows;
};

export const useSheetData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            // Add timestamp to bypass browser caching and use 'no-store'
            const response = await fetch(`${GOOGLE_SHEET_CSV_URL}&t=${Date.now()}`, {
                cache: "no-store",
                headers: {
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache'
                }
            });
            const text = await response.text();

            const rawRows = parseCSV(text);

            if (rawRows.length < 2) {
                setData([]);
                setLoading(false);
                return;
            }

            // Extract headers and trim them
            const headers = rawRows[0].map(h => h.trim());
            console.log("CSV Headers:", headers); // Debug log

            const formattedData = rawRows.slice(1).map((row, index) => {
                // Create a JSON object for the current row using headers
                const item = {};
                headers.forEach((header, i) => {
                    item[header] = row[i]?.trim() || "";
                });

                if (index === 0) console.log("First Row Item:", item); // Debug log

                // Extract fields using exact column names as requested
                const contacts = [];

                // Person 1
                if (item["Person"] || item["Person Contact"]) {
                    contacts.push({
                        name: item["Person"] || "Not Available",
                        phone: item["Person Contact"] || "Not Available"
                    });
                }

                // Person 2
                if (item["Person 2"] || item["Person Contact 2"]) {
                    contacts.push({
                        name: item["Person 2"] || "Not Available",
                        phone: item["Person Contact 2"] || "Not Available"
                    });
                }

                return {
                    id: index,
                    name: item["Venue Name"] || "Unknown Property",
                    city: item["City"] || "Unknown City",
                    location: item["Location"] || "Unknown Location",
                    email: item["Email Address"] || "", // Added as requested
                    contacts: contacts,
                    rooms: parseInt(item["No of Rooms"]) || 0,
                    // Placeholder image logic
                    image: `https://images.unsplash.com/photo-${[
                        '1613977257363-707ba9348227',
                        '1600596542815-8007264a7819',
                        '1600585154340-be6161a56a0c',
                        '1512917774080-9991f1c4c750',
                        '1600047509807-c29dd6b03362',
                        '1600607687939-ce8a6c25118c',
                        '1625602812206-535450741442',
                        '1600566753190-17f0baa2a6c3'
                    ][index % 8]}?auto=format&fit=crop&w=800&q=80`
                };
            }).filter(row => row.name && row.name !== "Venue Name" && row.name !== "Unknown Property");

            // Deduplicate properties by name, preferring those with MORE contact info
            const uniqueProperties = new Map();
            formattedData.forEach(row => {
                if (!uniqueProperties.has(row.name)) {
                    uniqueProperties.set(row.name, row);
                } else {
                    const existing = uniqueProperties.get(row.name);
                    const hasMoreContacts = row.contacts.length > existing.contacts.length;

                    if (hasMoreContacts) {
                        uniqueProperties.set(row.name, row);
                    }
                }
            });

            setData(Array.from(uniqueProperties.values()));
            setError(null);
        } catch (err) {
            console.error("Error fetching sheet data:", err);
            setError("Failed to load property data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return { data, loading, error };
};
