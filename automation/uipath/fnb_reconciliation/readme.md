# F&B Reconciliation

## Purpose

Run nightly for each Meridian property to compare F&B covers recorded for the operating day with expected occupied guests from the reservation system.

## Inputs

- `operating_date`: the UTC calendar date being reconciled.
- F&B source: `GET /api/v1/orders?date={operating_date}&property_id={property_id}`. Sum `total_covers` for each property.
- Expected occupancy source: confirmed and checked-in reservations whose stay includes `operating_date`. This source is owned by the shared reservations contract.

## Calculation

For every property, calculate `variance = actual_covers - expected_occupancy` and `variance_percent = variance / expected_occupancy * 100`. When expected occupancy is zero, retain the absolute variance and leave `variance_percent` empty.

Flag a property when the absolute variance percentage exceeds 20%, or when expected occupancy is zero and actual covers are greater than zero.

## Output Contract

Write one result per property containing `operating_date`, `property_id`, `actual_covers`, `expected_occupancy`, `variance`, `variance_percent`, `flagged`, and `processed_at` in UTC. The process must also produce a summary of processed, flagged, and failed properties.

## Exceptions and Schedule

Schedule after the F&B posting cutoff. Retry a transient API failure up to two times; record unavailable source data as a failed property and continue processing the remaining properties. Escalate flagged variances and failed properties to the overnight operations queue.