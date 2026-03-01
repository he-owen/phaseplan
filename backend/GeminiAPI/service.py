import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai.types import GenerateContentConfig, GoogleSearch, Tool

load_dotenv()


class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY not set")
        self.client = genai.Client(api_key=api_key)

    def enrich_device(self, name: str, brand: str, model: str) -> dict:
        """
        Given device name, brand, and model, return inferred device details as a dict:
        type, hourlyEnergy (kWh when in use only), isSmart, runDurationMinutes.
        Uses Google Search grounding for accurate, up-to-date specs.
        """
        prompt = f"""You are an expert on home appliances and energy usage. Use web search to find accurate power/spec data for this exact product when available.

Given this device:
- Name: {name}
- Brand: {brand}
- Model: {model}

Return a JSON object with exactly these fields (no other text, no markdown):
- "type": string, a **specific** device type (e.g. Refrigerator, Dishwasher, Washing Machine, Dryer, Television, Computer, Monitor, Air Conditioner, Space Heater, Microwave, Oven, Smart Speaker, Router, Dehumidifier, Water Heater, EV Charger, Solar Panel, Light Bulb, Ceiling Fan). Do NOT use generic terms like "Appliance" or "Electronics"—use the specific product type. Use "Other" only if no specific type fits.
- "hourlyEnergy": number, typical power consumption in kWh per hour **only when the device is in active use** (e.g. TV on, AC cooling, washer running). Do NOT average with standby; this must be the in-use draw only. Use 0 if unknown.
- "isSmart": boolean, true if this product is typically a smart/connected device
- "runDurationMinutes": number, typical daily run time in minutes when active (e.g. fridge 1440, TV 240). Use 60 if unknown.

Return only valid JSON, no code block or explanation."""

        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=GenerateContentConfig(
                    tools=[Tool(google_search=GoogleSearch())]
                ),
            )
            text = response.text
            if not text:
                raise RuntimeError("Gemini returned empty response")

            text = text.strip()
            if text.startswith("```"):
                lines = text.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].strip() == "```":
                    lines = lines[:-1]
                text = "\n".join(lines)

            data = json.loads(text)
            hourly = data.get("hourlyEnergy")
            return {
                "type": str(data.get("type", "Other")).strip() or "Other",
                "hourlyEnergy": float(hourly) if hourly is not None else 0.0,
                "isSmart": bool(data.get("isSmart", False)),
                "runDurationMinutes": int(data.get("runDurationMinutes", 60)) if data.get("runDurationMinutes") is not None else 60,
            }
        except json.JSONDecodeError as e:
            raise ValueError(f"Gemini returned invalid JSON: {e}")
        except Exception as e:
            raise RuntimeError(f"Failed to enrich device: {e}")
