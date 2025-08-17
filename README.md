**Crypto Chart Analyzer**

This project provides a Chrome extension that captures a screenshot of a cryptocurrency chart and sends it to an AI-powered web service for a detailed technical analysis. The AI's analysis is then displayed in a new, beautifully formatted browser tab.

Project Structure

The project is divided into two main components:
1. extension/: This directory contains all the files for the Chrome extension (HTML, CSS, and JavaScript). This is what end-users will install and use daily.
2. web-service.py: This file is the Python backend service (using FastAPI) that receives the chart screenshots, sends them to an AI for analysis, and returns the result. This part is intended for developers who want to deploy the service.

**For Users: How to Load the Extension**

You can easily load and use this extension on a day-to-day basis directly from the extension/ directory.

1. Open Google Chrome and navigate to chrome://extensions.
2. Enable "Developer mode" in the top-right corner.
3. Click "Load unpacked" and select the extension/ directory.
4. The extension's icon will appear in your toolbar. You can pin it for easy access.

Note: For the extension to work, the web-service.py backend must be running. If the developer has not deployed a public instance, you may be subject to usage limits.

**For Developers: Deploying the Web Service**

The web-service.py file is a Python service built with FastAPI. It handles the core AI analysis.

Prerequisites
- A Google Gemini API Key. You can get a free API key from Google AI Studio with some usage limits.
- Python 3.9+
- The required libraries (fastapi, uvicorn, google-generativeai, Pillow)

**Deployment**

You can deploy this service on any hosting platform that supports Python. For testing and free hosting, platforms like Replit or PythonAnywhere are great options.
- Replace "YOUR_GEMINI_API_KEY_HERE" in the web-service.py file with your actual API key.
- Deploy the web-service.py file. On Replit, this can be as simple as uploading the file and installing the dependencies.
- Make sure the service is accessible via a public URL. You will then need to update the serverUrl variable in the popup.js file with your public URL.

AI Model Used: This project uses the gemini-1.5-flash model and is designed to work within the free tier limits provided by Google.
