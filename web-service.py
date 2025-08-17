import base64
import os
import io
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
from google import genai
from google.genai import types
import traceback


api_key = "YOUR_GEMINI_API_KEY_HERE"

if not api_key:
    raise ValueError("Gemini API key not found. Please set your API key.")

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageData(BaseModel):
    imageData: str

class ChartAnalyzer:
    def __init__(self):
        self.default_prompt = """
        Please provide a concise analysis of this financial chart, focusing on the following technical aspects:

        1. Technical Analysis:
        - Overall trend (bullish/bearish/sideways).
        - Key support and resistance levels.
        - Chart patterns (e.g., triangles, channels, flags, head and shoulders).
        - Available technical indicators (e.g., RSI, MACD, Moving Averages).
        - Trading volume and its changes.
        - Fibonacci retracement levels and significant points.

        Please provide your analysis in a brief and comprehensive manner in English.
        """
        self.client = genai.Client(api_key=api_key)

    def analyze_image_from_base64(self, base64_data, prompt=None):
        try:
            analysis_prompt = prompt if prompt else self.default_prompt
            print (analysis_prompt+"\n")
            image_bytes = base64.b64decode(base64_data)
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type='image/jpeg',
                ),
                analysis_prompt
                ]
            )
            
            return {
                "success": True,
                "analysis": response.text,
                "model_used": "gemini-2.5-flash",
                "image_processed": True
            }
        
        except Exception as e:
            return {
                "success": False,
                "error": f"Error in Analysis: {str(e)}"
            }

analyzer = ChartAnalyzer()

@app.post("/analyze")
async def analyze_image_endpoint(data: ImageData):
    try:
        image_data_url = data.imageData
        base64_string = image_data_url.split(',')[1]
        
        result = analyzer.analyze_image_from_base64(base64_string)
        
        if result["success"]:
            return {"result": result["analysis"]}
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error in server: {str(e)}")