import { useState, useEffect } from 'react';

const GOOGLE_SHEET_API = "https://docs.google.com/spreadsheets/d/1NWi48LT1emRaWfXNzeobg4472zQ1432_8wicAMm0t2c/gviz/tq?tqx=out:json";

export const useSheetData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch(GOOGLE_SHEET_API);
            const text = await response.text();

            // Safer parsing: Remove everything before JSON start and the last 2 chars ");"
            const jsonStart = text.indexOf('{');
            const jsonString = text.substring(jsonStart).slice(0, -2);

            const json = JSON.parse(jsonString);

            const rows = json.table.rows.map((row, index) => {
                const c = row.c;
                return {
                    id: index,
                    name: c[0]?.v || "Unknown Property", // Column A
                    city: c[1]?.v || "Unknown City",     // Column B
                    location: c[2]?.v || "Unknown Location", // Column C
                    rooms: c[9]?.v || 0,                 // Column J
                    // Since there is no image column in the sheet, we use a placeholder logic
                    // We can generate a consistent random image based on the index to avoid flickering
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
            });

            setData(rows);
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
        const interval = setInterval(fetchData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    return { data, loading, error };
};
