.PHONY: seed test lint sync

seed:
	cd backend && uv run python -m app.seed

sync:
	cd backend && uv sync --group dev

test: sync
	cd backend && uv run pytest

lint: sync
	cd backend && uv run ruff check app tests

