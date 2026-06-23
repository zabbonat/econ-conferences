const fs = require('fs');
const path = require('path');

const CONFERENCES_FILE = path.join(__dirname, '../src/data/conferences.json');

async function run() {
  const data = JSON.parse(fs.readFileSync(CONFERENCES_FILE, 'utf8'));
  const today = new Date().toISOString().split('T')[0];
  let updatedCount = 0;
  const apiKey = process.env.GEMINI_API_KEY;

  console.log(`Checking updates for ${data.length} conferences...`);

  for (let i = 0; i < data.length; i++) {
    const conf = data[i];
    
    // Skip past events that are imported for CV/archive purposes (marked with "Past Event" topic)
    if (conf.topics && conf.topics.includes('Past Event')) {
      continue;
    }

    // Check if the event date has passed
    if (conf.eventDateEnd && conf.eventDateEnd < today) {
      console.log(`Event passed: "${conf.name}" (ended ${conf.eventDateEnd}). Updating to next edition...`);
      
      const currentYearMatch = conf.eventDateStart.match(/^(\d{4})/);
      if (!currentYearMatch) continue;
      
      const currentYear = parseInt(currentYearMatch[1]);
      const nextYear = currentYear + 1;
      
      let newDetails = null;

      if (apiKey) {
        try {
          console.log(`Querying Gemini API for "${conf.name}" ${nextYear} details...`);
          newDetails = await fetchLiveDetails(conf, nextYear, apiKey);
        } catch (e) {
          console.error(`Error fetching live details for "${conf.name}":`, e.message);
        }
      }

      if (newDetails) {
        console.log(`Successfully fetched live details for "${conf.name}" ${nextYear}:`, newDetails);
        conf.eventDateStart = newDetails.eventDateStart || conf.eventDateStart;
        conf.eventDateEnd = newDetails.eventDateEnd || conf.eventDateEnd;
        conf.deadline = newDetails.deadline || conf.deadline;
        conf.location = newDetails.location || conf.location;
        conf.coordinates = newDetails.coordinates || conf.coordinates;
        conf.website = newDetails.website || conf.website;
        if (conf.name.includes(currentYear.toString())) {
          conf.name = conf.name.replace(currentYear.toString(), nextYear.toString());
        }
      } else {
        // Fallback: Roll over dates by 1 year
        console.log(`Using fallback: shifting dates by 1 year for "${conf.name}"`);
        conf.eventDateStart = shiftYear(conf.eventDateStart, 1);
        conf.eventDateEnd = shiftYear(conf.eventDateEnd, 1);
        if (conf.deadline && conf.deadline !== 'TBD') {
          conf.deadline = shiftYear(conf.deadline, 1);
        }
        if (conf.name.includes(currentYear.toString())) {
          conf.name = conf.name.replace(currentYear.toString(), nextYear.toString());
        }
      }
      updatedCount++;
    }
  }

  if (updatedCount > 0) {
    fs.writeFileSync(CONFERENCES_FILE, JSON.stringify(data, null, 2));
    console.log(`Completed. Updated ${updatedCount} conferences.`);
  } else {
    console.log("No conferences needed updates.");
  }
}

function shiftYear(dateStr, years) {
  if (!dateStr || dateStr === 'TBD' || dateStr === '#') return dateStr;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0]) + years;
  return `${year}-${parts[1]}-${parts[2]}`;
}

async function fetchLiveDetails(conf, nextYear, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const prompt = `You are a data assistant. We have an economics conference:
Name: ${conf.name}
Current Location: ${conf.location}
Current Website: ${conf.website}

Search the web for the upcoming ${nextYear} edition of this conference. Find:
1. Official start and end dates (format YYYY-MM-DD).
2. Paper submission deadline (format YYYY-MM-DD, or "TBD" if not announced yet).
3. Location (City, Country, or "Online").
4. Coordinates [latitude, longitude] for the city.
5. Official website URL.

Return ONLY a valid JSON object matching the following structure (no markdown formatting, no other text):
{
  "eventDateStart": "YYYY-MM-DD",
  "eventDateEnd": "YYYY-MM-DD",
  "deadline": "YYYY-MM-DD",
  "location": "City, Country",
  "coordinates": [latitude, longitude],
  "website": "URL"
}

If you cannot find reliable details for the ${nextYear} edition, return exactly: null`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      },
      tools: [{ googleSearch: {} }]
    })
  });

  if (!response.ok) {
    throw new Error(`API returned status ${response.status}`);
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  try {
    const parsed = JSON.parse(text.trim());
    return parsed;
  } catch (e) {
    console.error("Failed to parse response text:", text);
    return null;
  }
}

run();
