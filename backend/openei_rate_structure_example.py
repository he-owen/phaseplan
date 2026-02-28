"""
OpenEI utility_rates API — rate structure example.

Fetches a rate by address (e.g. zipcode), prints the energy rate structure
(schedules, periods, tiers, fuel adjustments), and optionally computes
$/kWh for a given hour on a given date.

Usage:
  Set API key in environment, or add OPENEI_API_KEY=... to .env in project root.
  PowerShell: $env:OPENEI_API_KEY = "your_key"
  CMD:        set OPENEI_API_KEY=your_key

  python openei_rate_structure_example.py [address]
  (default address: 90210)

Uses only stdlib: urllib, json, datetime.
"""

import json
import os
import sys
from datetime import datetime
from urllib.parse import urlencode
from urllib.request import Request, urlopen

API_BASE = "https://api.openei.org/utility_rates"


def _load_dotenv() -> None:
    """If OPENEI_API_KEY is not set, try loading it from a .env file (stdlib only)."""
    if os.environ.get("OPENEI_API_KEY"):
        return
    for base in (os.getcwd(), os.path.dirname(os.path.abspath(__file__)), os.path.dirname(os.path.dirname(os.path.abspath(__file__)))):
        path = os.path.join(base, ".env")
        if not os.path.isfile(path):
            continue
        try:
            with open(path, encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#"):
                        continue
                    if "=" in line:
                        key, _, value = line.partition("=")
                        key = key.strip()
                        value = value.strip().strip('"').strip("'")
                        if key == "OPENEI_API_KEY" and value:
                            os.environ["OPENEI_API_KEY"] = value
                            return
        except OSError:
            continue


def fetch_rates(api_key: str, address: str = "90210", limit: int = 1, sector: str = "Residential"):
    params = {
        "version": 7,
        "format": "json",
        "detail": "full",
        "api_key": api_key,
        "address": address,
        "limit": limit,
        "sector": sector,
    }
    url = f"{API_BASE}?{urlencode(params)}"
    req = Request(url, headers={"User-Agent": "OpenEI-Rate-Example/1.0"})
    with urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())


def _safe_get(obj, *keys, default=None):
    for key in keys:
        if obj is None:
            return default
        obj = obj.get(key) if isinstance(obj, dict) else default
    return obj


def print_rate_metadata(rate: dict) -> None:
    print("--- Rate metadata ---")
    print("  label     ", rate.get("label"))
    print("  utility   ", rate.get("utility"))
    print("  name      ", rate.get("name"))
    print("  sector    ", rate.get("sector"))
    print("  startdate ", rate.get("startdate"))
    print("  enddate   ", rate.get("enddate"))
    print("  uri       ", rate.get("uri"))


def print_energy_structure(rate: dict) -> None:
    ers = rate.get("energyratestructure")
    if not ers:
        print("--- Energy rate structure: (none / flat or N/A) ---")
        return
    print("--- Energy rate structure ---")
    print(f"  Number of periods: {len(ers)}")
    for pidx, period in enumerate(ers):
        tiers = period if isinstance(period, list) else [period]
        print(f"  Period {pidx}: {len(tiers)} tier(s)")
        for tidx, tier in enumerate(tiers):
            if isinstance(tier, dict):
                r = tier.get("rate")
                adj = tier.get("adj", 0)
                mx = tier.get("max")
                u = tier.get("unit", "kWh")
                print(f"    tier {tidx}: rate={r} $/kWh, adj={adj}, max={mx} {u}")
            else:
                print(f"    tier {tidx}: {tier}")

    wds = rate.get("energyweekdayschedule")
    wes = rate.get("energyweekendschedule")
    if wds:
        print(f"  energyweekdayschedule: {len(wds)} months x {len(wds[0]) if wds else 0} hours")
        if len(wds) >= 7 and len(wds[7]) >= 14:
            print(f"    sample July 2pm weekday -> period index: {wds[7][14]}")
    if wes:
        print(f"  energyweekendschedule: {len(wes)} months x {len(wes[0]) if wes else 0} hours")
        if len(wes) >= 7 and len(wes[7]) >= 14:
            print(f"    sample July 2pm weekend -> period index: {wes[7][14]}")

    fam = rate.get("fueladjustmentsmonthly")
    if fam is not None:
        print(f"  fueladjustmentsmonthly: {len(fam)} values (one per month) $/kWh")
        print(f"    values: {fam}")


def get_rate_per_kwh_for_datetime(rate: dict, dt: datetime) -> tuple[float | None, str]:
    """
    Returns (effective $/kWh for that hour on that date, description)
    or (None, error_message). Uses first tier of the period; does not apply usage-based tier.
    """
    ers = rate.get("energyratestructure")
    wds = rate.get("energyweekdayschedule")
    wes = rate.get("energyweekendschedule")
    fam = rate.get("fueladjustmentsmonthly") or [0] * 12

    if not ers:
        return None, "No energyratestructure (flat or N/A)"
    if not wds or len(wds) != 12 or (wds and len(wds[0]) != 24):
        return None, "Missing or invalid energyweekdayschedule (expected 12x24)"
    if not wes or len(wes) != 12 or (wes and len(wes[0]) != 24):
        return None, "Missing or invalid energyweekendschedule (expected 12x24)"

    month_idx = dt.month - 1
    hour_idx = dt.hour
    is_weekend = dt.weekday() >= 5
    schedule = wes if is_weekend else wds
    period_idx = schedule[month_idx][hour_idx]

    if period_idx >= len(ers):
        return None, f"Period index {period_idx} out of range (max {len(ers) - 1})"
    period = ers[period_idx]
    tiers = period if isinstance(period, list) else [period]
    if not tiers:
        return None, "Empty period"
    tier = tiers[0]
    if not isinstance(tier, dict):
        return None, "Tier is not a dict"
    rate_val = tier.get("rate")
    adj = tier.get("adj") or 0
    if rate_val is None:
        return None, "No 'rate' in tier"
    fuel = fam[month_idx] if month_idx < len(fam) else 0
    total = float(rate_val) + float(adj) + float(fuel)
    desc = f"period={period_idx}, tier0 rate={rate_val}, adj={adj}, fuel(month)={fuel}"
    return total, desc


# Seasonal and time-of-day examples: (datetime, label, typical_cost_note)
# Typical pattern: summer afternoon/evening = peak (highest); overnight = off-peak (lowest).
SEASONAL_EXAMPLES = [
    (datetime(2025, 1, 8, 3, 0, 0), "Winter overnight (3 AM Wed)", "off-peak — usually lowest"),
    (datetime(2025, 1, 8, 12, 0, 0), "Winter midday (12 PM Wed)", "mid"),
    (datetime(2025, 1, 8, 18, 0, 0), "Winter evening (6 PM Wed)", "peak — heating demand"),
    (datetime(2025, 4, 15, 7, 0, 0), "Spring morning (7 AM Tue)", "mid"),
    (datetime(2025, 4, 15, 14, 0, 0), "Spring afternoon (2 PM Tue)", "mid to peak"),
    (datetime(2025, 7, 15, 3, 0, 0), "Summer overnight (3 AM Tue)", "off-peak — usually lowest"),
    (datetime(2025, 7, 15, 14, 0, 0), "Summer afternoon peak (2 PM Tue)", "peak — often highest"),
    (datetime(2025, 7, 15, 19, 0, 0), "Summer evening peak (7 PM Tue)", "peak — high cooling demand"),
    (datetime(2025, 7, 19, 14, 0, 0), "Summer afternoon weekend (2 PM Sat)", "weekend rate"),
    (datetime(2025, 10, 10, 6, 0, 0), "Fall early morning (6 AM Fri)", "off-peak"),
    (datetime(2025, 10, 10, 17, 0, 0), "Fall evening (5 PM Fri)", "peak"),
]


def main() -> None:
    _load_dotenv()
    api_key = os.environ.get("OPENEI_API_KEY")
    if not api_key:
        print("Set OPENEI_API_KEY in the environment.", file=sys.stderr)
        sys.exit(1)
    address = sys.argv[1] if len(sys.argv) > 1 else "90210"

    print(f"Fetching rates for address={address!r} (limit=1, sector=Residential)...")
    try:
        data = fetch_rates(api_key, address=address)
    except Exception as e:
        print(f"Request failed: {e}", file=sys.stderr)
        sys.exit(1)

    items = data.get("items") or data.get("results") or []
    if not items:
        print("No rate items returned. Response keys:", list(data.keys()))
        if "error" in data:
            print("Error:", data.get("error"))
        sys.exit(1)

    rate = items[0]
    print_rate_metadata(rate)
    print()
    print_energy_structure(rate)
    print()

    # Multiple examples: seasonal and time-of-day (peak vs off-peak)
    print("--- Seasonal / time-of-day examples: $/kWh by date and hour ---")
    print("  (Peak times = summer afternoon/evening; off-peak = overnight. Actual rates depend on utility.)")
    print()
    results = []
    for dt, label, cost_note in SEASONAL_EXAMPLES:
        total, desc = get_rate_per_kwh_for_datetime(rate, dt)
        if total is not None:
            results.append((dt, label, cost_note, total, desc))
        else:
            print(f"  {dt.strftime('%Y-%m-%d %H:%M')}  {label}")
            print(f"    -> {desc}")
    if results:
        # Sort by rate so higher (peak) and lower (off-peak) are visible
        results.sort(key=lambda x: x[3], reverse=True)
        for dt, label, cost_note, total, desc in results:
            print(f"  {dt.strftime('%Y-%m-%d %H:%M')}  ${total:.4f}/kWh  — {label}  ({cost_note})")
        print()
        high = max(r[3] for r in results)
        low = min(r[3] for r in results)
        print(f"  Range for this rate: ${low:.4f}/kWh (low) to ${high:.4f}/kWh (high)")
        if high == low:
            print("  -> This is a flat rate: no time-of-use (TOU) variation; same $/kWh all hours and seasons.")


if __name__ == "__main__":
    main()
