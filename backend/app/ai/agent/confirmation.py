"""Explicit confirmation gate for spa booking actions."""

from dataclasses import dataclass
from secrets import token_urlsafe


@dataclass(frozen=True)
class BookingConfirmation:
	"""A recommendation that has not yet been authorized for creation."""

	token: str
	property_id: str
	service: str
	starts_at: str
	guest_id: str


def create_confirmation(
	*, guest_id: str, property_id: str, service: str, starts_at: str
) -> BookingConfirmation:
	"""Create a one-time confirmation payload for a recommended slot."""
	return BookingConfirmation(
		token=token_urlsafe(24),
		guest_id=guest_id,
		property_id=property_id,
		service=service,
		starts_at=starts_at,
	)


def is_explicit_confirmation(message: str) -> bool:
	"""Recognize only clear affirmative booking language."""
	return message.strip().lower() in {
		"confirm",
		"confirmed",
		"yes",
		"yes, book it",
		"book it",
		"please book it",
	}