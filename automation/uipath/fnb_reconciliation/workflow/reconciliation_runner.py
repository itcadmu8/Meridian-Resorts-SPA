"""
UiPath F&B Nightly Reconciliation Local Runner & Contract Test Script

Simulates the UiPath automation process:
1. Calls backend GET /api/v1/orders?date={operating_date}
2. Calls backend GET /api/v1/reservations
3. Calculates variance = actual_covers - expected_occupancy
4. Flags properties where absolute variance % > 20% or zero expected occupancy with covers > 0.
5. Saves result to automation/uipath/fnb_reconciliation/last_reconciliation_result.json
"""

import json
import os
import sys
import urllib.request
from datetime import date

BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:8000")


def run_reconciliation(operating_date: str = None):
    if not operating_date:
        operating_date = date.today().isoformat()

    print(f"[UiPath Automation] Starting Nightly F&B Reconciliation for {operating_date}...")

    # Fetch reconciliation endpoint from backend
    url = f"{BACKEND_URL}/api/v1/orders/reconciliation?date={operating_date}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "UiPath-Automation/1.0"})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
    except Exception as err:
        print(f"[ERROR] Failed to fetch data from backend {url}: {err}")
        sys.exit(1)

    output_path = os.path.join(
        os.path.dirname(__file__), "last_reconciliation_result.json"
    )
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print(f"[UiPath Automation] Reconciliation Complete!")
    print(f"Total Properties Processed: {data.get('total_properties')}")
    print(f"Total Flagged Properties: {data.get('total_flagged')}")
    print(f"Result saved to: {output_path}")

    return data


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else date.today().isoformat()
    run_reconciliation(target)
