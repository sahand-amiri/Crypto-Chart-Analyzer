document.addEventListener('DOMContentLoaded', function() {
    const captureButton = document.getElementById('captureButton');
    const spinnerElement = document.querySelector('.spinner');
    
    captureButton.addEventListener('click', async function() {
        spinnerElement.classList.remove('hidden');
        captureButton.disabled = true;

        chrome.tabs.captureVisibleTab(null, { format: "png" }, async function(dataUrl) {
            if (chrome.runtime.lastError) {
                console.error("Error capturing visible tab:", chrome.runtime.lastError.message);
                spinnerElement.classList.add('hidden');
                captureButton.disabled = false;
                return;
            }

            if (dataUrl) {
                console.log("Screenshot captured successfully! Sending to server...");
                await sendToPythonServer(dataUrl);
            } else {
                console.error("Failed to capture screenshot.");
                spinnerElement.classList.add('hidden');
                captureButton.disabled = false;
            }
        });
    });

    async function sendToPythonServer(imageData) {
        const serverUrl = 'YOUR-WEBSERVICE-ADDRESS'; 

        try {
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ imageData: imageData })
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Analysis Result:", result.result);
                displayAnalysisInNewTab(result.result);
            } else {
                console.error("Server responded with an error:", response.status, response.statusText);
                alert('Analysis failed: ' + result.detail);
            }
        } catch (error) {
            console.error("Error sending data to server:", error);
            alert("An error occurred. Please check the server console.");
        } finally {
            spinnerElement.classList.add('hidden');
            captureButton.disabled = false;
        }
    }

    function displayAnalysisInNewTab(analysisText) {
        const newTabHtml = `
            <!DOCTYPE html>
            <html lang="en" dir="ltr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>AI Analysis Result</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        background-color: #f9fafb;
                        line-height: 1.6;
                        color: #333;
                        margin: 0;
                        padding: 0;
                        direction: ltr;
                    }
                    .analysis-card {
                        background-color: #ffffff;
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        padding: 30px;
                        margin: 20px auto;
                        max-width: 800px;
                    }
                    .analysis-card h1 {
                        color: #1a237e;
                        font-size: 2em;
                        border-bottom: 2px solid #e0e0e0;
                        padding-bottom: 10px;
                        margin-bottom: 20px;
                        text-align: center;
                    }
                    .analysis-card pre {
                        white-space: pre-wrap;
                        background-color: #f1f1f1;
                        border-radius: 8px;
                        padding: 15px;
                        overflow-x: auto;
                        font-family: 'Segoe UI', monospace;
                        font-size: 1em;
                        text-align: left;
                    }
                </style>
            </head>
            <body>
                <div class="analysis-card">
                    <h1>AI Crypto Chart Analysis</h1>
                    <pre>${analysisText}</pre>
                </div>
            </body>
            </html>
        `;

        const dataUri = `data:text/html;charset=UTF-8,${encodeURIComponent(newTabHtml)}`;

        chrome.tabs.create({ url: dataUri }, function(newTab) {
            if (chrome.runtime.lastError) {
                console.error("Error creating new tab with data URI:", chrome.runtime.lastError.message);
                alert("Failed to create a new tab.");
            }
        });
    }
});