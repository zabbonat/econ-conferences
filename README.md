# Economics Conferences & Summer Schools Tracker

An interactive web application to discover, filter, and view the best economics conferences, workshops, and summer schools globally on a map.

## Key Features
- **Interactive Map (Leaflet):** Geographical visualization of events with clean popups containing direct links to each conference website.
- **Search & Filters:** Filter events by type (Conferences, Workshops, Summer Schools), deadline urgency (Open, Urgent), and free-text search.
- **Interactive Stats Bar:** Clickable metrics at the top to filter events quickly based on counts.
- **Automatic Weekly Updates:** Pre-configured script and GitHub Actions workflow to keep the conference data up-to-date.

---

## Running Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/zabbonat/econ-conferences.git
   cd econ-conferences
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Start Development Server
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the site.

---

## Automatic Data Updates

The project includes an automated update system that checks for past events and retrieves details for their next editions.

### How it Works
The [.github/workflows/update-conferences.yml](.github/workflows/update-conferences.yml) file runs a Node.js script automatically every Sunday at midnight (UTC):
1. **Fallback (Zero setup):** If an event's end date has passed, the script automatically shifts it to the next year (adding 1 year to all dates) to keep the event listed and visible.
2. **AI-Powered Live Updates (Recommended):** If you configure a Gemini API key, the script will perform real-time web searches (via Google Search Grounding) to find the actual dates, deadlines, locations, and website URLs of the new edition.

### Setup Gemini API Key (Optional)
To enable the AI-powered automatic updates:
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/).
2. Go to your GitHub repository settings: `Settings` > `Secrets and variables` > `Actions`.
3. Create a **New repository secret** named `GEMINI_API_KEY` and paste your key.

### Run Updates Manually
You can trigger the update check at any time:
- **On GitHub:** Go to the `Actions` tab of your repository, select `Weekly Conference Update`, and click `Run workflow`.
- **Locally:** Run the script (make sure to set the environment variable if you want to use the AI capability):
  ```bash
  # Windows PowerShell:
  $env:GEMINI_API_KEY="your_api_key_here"; node scripts/auto-update.js
  
  # Bash (Mac/Linux):
  GEMINI_API_KEY="your_api_key_here" node scripts/auto-update.js
  ```
