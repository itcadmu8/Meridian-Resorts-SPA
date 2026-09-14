# F&B Reconciliation

This Member 3 workflow reconciles recorded F&B covers with expected occupied
reservations for every Meridian property. It runs after daily service closes and
produces one manager-review record per property.

## Workflow Inputs

The UiPath process receives these Config values:

| Key | Example | Use |
| --- | --- | --- |
| `ApiBaseUrl` | `http://backend:8000/api/v1` | Base URL for the shared REST API. |
| `ReconciliationDate` | `2026-09-11` | Optional backfill date; otherwise use the previous local service day. |
| `VarianceThresholdPercent` | `20` | Absolute percentage at which a property is unusual. |
| `OutputFolder` | `Reports/FnbReconciliation` | Folder for the manager-review workbook or CSV. |

For the selected date, the process requests:

```text
GET {ApiBaseUrl}/orders?date={ReconciliationDate}&page=1&page_size=100
GET {ApiBaseUrl}/reservations?date_from={ReconciliationDate}&date_to={ReconciliationDate}
```

The orders response uses the Team 2 response envelope. Use its `data` array;
each order contains `property_id`, `property_name`, `items`, `total`,
`placed_at`, and `covers`. Read `meta.total` and continue requesting order pages
until every matching order has been collected. The reservations endpoint is a
shared baseline API and returns its list directly.

## UiPath Sequence

Build the sequence in the project's shared UiPath workspace after the team
chooses its project naming convention:

1. Read Config and set `targetDate` to `ReconciliationDate` or the previous
	service date in the property's operating timezone.
2. Use HTTP Request activities to retrieve every page of the orders response and
	the reservation list. Retry transient HTTP failures up to three times.
3. Deserialize the JSON payloads and reject malformed records into an exception
	log without stopping the remaining properties.
4. For each of the six properties, sum F&B covers and calculate expected
	occupancy from active reservations.
5. Write the output rows to the dated manager-review report and add a queue or
	email exception only for rows where `is_unusual` is `true`.
6. Record the run ID, source response counts, completed timestamp, and output
	path in the UiPath log.

## Calculation Rules

The implementation in `backend/app/services/order_service.py` is the source of
truth for the same calculation used by the workflow.

- Count an order's explicit `covers` value when present.
- Otherwise, count an item when `is_cover` is `true` or its `name` contains
  `cover`; add that item's non-negative `qty`.
- Count expected occupancy as one per reservation whose status is `confirmed` or
  `checked_in`, and where `check_in <= targetDate < check_out`.
- `variance = fnb_covers - expected_occupancy`.
- When expected occupancy is positive,
  `variance_percentage = variance / expected_occupancy * 100`.
- When expected occupancy is zero, use `0` percent for zero covers and `100`
  percent for a non-zero cover count.
- Set `is_unusual` when the absolute variance percentage is at least the
  configured threshold, defaulting to `20` percent.

## Output Contract

Write one row per property to
`{OutputFolder}/fnb-reconciliation-{targetDate}.csv` and retain the same rows in
the UiPath run output. The columns are:

```text
property_id,property_name,reconciliation_date,expected_occupancy,fnb_covers,
variance,variance_percentage,is_unusual,run_id,completed_at_utc
```

Example row:

```text
PROP-001,Meridian Azure Coast,2026-09-11,42,53,11,26.19,true,
run-20260912-020000,2026-09-12T02:04:18Z
```

The report is the manager-review record. An unusual row should create an
Orchestrator queue item or a manager notification with the property, date,
actual covers, expected occupancy, and variance percentage.

## Exception Handling

| Condition | Workflow behavior |
| --- | --- |
| API returns 401, 403, or 5xx | Retry only 5xx responses; log and mark the run failed after the final retry. |
| Orders response is not a successful envelope | Log the API message and mark the run failed. |
| One malformed order or reservation | Log its source ID, omit it, and complete the other properties. |
| No orders for a property | Output zero covers; do not treat this as an exception by itself. |
| Covers with zero expected occupancy | Output `100` percent and flag as unusual. |
| Output write fails | Preserve the in-memory result, log the target path, and raise a business exception for retry. |

## Schedule And Acceptance Checks

Schedule the unattended process daily at 02:00 in the reporting property's
timezone, after the late-night F&B close. Validate the workflow with these
cases before release:

1. A normal property whose absolute variance is below 20 percent is not flagged.
2. A property with 3 covers and 1 expected occupied reservation is flagged.
3. A property with no expected occupancy and non-zero covers is flagged.
4. An empty daily order result still produces six property rows.
5. A malformed source row is logged while the remaining property rows are
	written.

Concrete `.xaml` and UiPath project files remain deferred until the team's
shared UiPath workspace and package convention are agreed, as specified by the
starter contract. This runbook defines the exact inputs, output, and sequence
for that implementation.