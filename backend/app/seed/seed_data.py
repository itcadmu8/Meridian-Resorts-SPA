from datetime import date, timedelta


PROPERTIES = {
    1: "Meridian Grand Resort",
    2: "Meridian Seabreeze",
    3: "Meridian Hillside",
    4: "Meridian City Suites",
    5: "Meridian Garden Spa",
    6: "Meridian Coastal Retreat",
}

GUESTS = {
    "G-1001": {"name": "Ava Thompson", "loyalty_tier": "Gold"},
    "G-1002": {"name": "Daniel Rodriguez", "loyalty_tier": "Platinum"},
    "G-1003": {"name": "Priya Nair", "loyalty_tier": "Silver"},
    "G-1004": {"name": "Samuel Lee", "loyalty_tier": "Gold"},
    "G-1005": {"name": "Emily Carter", "loyalty_tier": "Platinum"},
    "G-1006": {"name": "Lucas Martin", "loyalty_tier": "Silver"},
    "G-1007": {"name": "Olivia Patel", "loyalty_tier": "Gold"},
    "G-1008": {"name": "Noah Kim", "loyalty_tier": "Platinum"},
    "G-1009": {"name": "Sophia Nguyen", "loyalty_tier": "Gold"},
    "G-1010": {"name": "Ethan Brooks", "loyalty_tier": "Silver"},
}


def _today() -> date:
    return date.today()


RESERVATIONS = [
    {
        "id": "R-2001",
        "guest_id": "G-1001",
        "property_id": 1,
        "check_in": _today(),
        "check_out": _today() + timedelta(days=3),
        "status": "Confirmed",
    },
    {
        "id": "R-2002",
        "guest_id": "G-1002",
        "property_id": 2,
        "check_in": _today(),
        "check_out": _today() + timedelta(days=2),
        "status": "Checked-In",
    },
    {
        "id": "R-2003",
        "guest_id": "G-1003",
        "property_id": 3,
        "check_in": _today(),
        "check_out": _today() + timedelta(days=4),
        "status": "Confirmed",
    },
    {
        "id": "R-2004",
        "guest_id": "G-1004",
        "property_id": 4,
        "check_in": _today(),
        "check_out": _today() + timedelta(days=5),
        "status": "Pending",
    },
    {
        "id": "R-2005",
        "guest_id": "G-1005",
        "property_id": 5,
        "check_in": _today(),
        "check_out": _today() + timedelta(days=2),
        "status": "Confirmed",
    },
    {
        "id": "R-2006",
        "guest_id": "G-1006",
        "property_id": 6,
        "check_in": _today(),
        "check_out": _today() + timedelta(days=1),
        "status": "Checked-In",
    },
    {
        "id": "R-2007",
        "guest_id": "G-1007",
        "property_id": 1,
        "check_in": _today(),
        "check_out": _today() + timedelta(days=3),
        "status": "Confirmed",
    },
    {
        "id": "R-2008",
        "guest_id": "G-1008",
        "property_id": 2,
        "check_in": _today() - timedelta(days=1),
        "check_out": _today() + timedelta(days=2),
        "status": "Checked-In",
    },
    {
        "id": "R-2009",
        "guest_id": "G-1009",
        "property_id": 3,
        "check_in": _today() + timedelta(days=1),
        "check_out": _today() + timedelta(days=4),
        "status": "Confirmed",
    },
    {
        "id": "R-2010",
        "guest_id": "G-1010",
        "property_id": 4,
        "check_in": _today() + timedelta(days=1),
        "check_out": _today() + timedelta(days=3),
        "status": "Pending",
    },
]
