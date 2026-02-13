import { useState, useEffect } from 'react';

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1NWi48LT1emRaWfXNzeobg4472zQ1432_8wicAMm0t2c/export?format=csv";

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
            const response = await fetch(`${GOOGLE_SHEET_CSV_URL}&t=${Date.now()}`);
            const text = await response.text();

            const rawRows = parseCSV(text);

            // Remove header row
            const rows = rawRows.slice(1).map((c, index) => {
                // Debug log for specific problem venue
                if (c[0]?.includes("Ginger Udaipur")) {
                    console.log("Ginger Debug:", {
                        name: c[0],
                        col3: c[3],
                        col4: c[4],
                        col5: c[5],
                        col6: c[6],
                        fullRow: c
                    });
                }

                // Map columns: 0:Name, 1:City, 2:Location, 3:Person, 4:Contact, 9:Rooms
                // CSV Index: 
                // 0: Venue Name
                // 1: City
                // 2: Location
                // 3: Person
                // 4: Person Contact
                // 5: Person 2
                // 6: Person Contact 2
                // ...
                // 9: No of Rooms

                const contactName = c[3] || c[5] || "Not Available";
                const contactPhone = c[4] || c[6] || "Not Available";

                return {
                    id: index,
                    name: c[0] || "Unknown Property",
                    city: c[1] || "Unknown City",
                    location: c[2] || "Unknown Location",
                    contactName: contactName,
                    contactPhone: contactPhone,
                    rooms: parseInt(c[9]) || 0,
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
            }).filter(row => row.name && row.name !== "Venue Name " && row.name !== "Unknown Property");

            // Deduplicate properties by name, preferring those with contact info
            const uniqueProperties = new Map();
            rows.forEach(row => {
                if (!uniqueProperties.has(row.name)) {
                    uniqueProperties.set(row.name, row);
                } else {
                    const existing = uniqueProperties.get(row.name);
                    const hasContact = row.contactName && row.contactName !== "Not Available";
                    const existingHasContact = existing.contactName && existing.contactName !== "Not Available";

                    if (hasContact && !existingHasContact) {
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
