"""Fetch Auth0 user profile from the userinfo endpoint using the access token."""

import logging
import time
import httpx
from config import AUTH0_DOMAIN

logger = logging.getLogger(__name__)
_cache: dict[str, tuple[dict, float]] = {}
_CACHE_TTL = 300  # 5 minutes


def _evict_expired():
    now = time.monotonic()
    expired = [k for k, (_, ts) in _cache.items() if now - ts > _CACHE_TTL]
    for k in expired:
        del _cache[k]


async def get_userinfo(access_token: str) -> dict | None:
    """Call Auth0 /userinfo and return the user payload (sub, email, etc.) or None if invalid."""
    if not AUTH0_DOMAIN:
        logger.warning("Auth0 userinfo skipped: AUTH0_DOMAIN (or VITE_AUTH0_DOMAIN) is not set on the server")
        return None

    now = time.monotonic()
    cached = _cache.get(access_token)
    if cached and now - cached[1] < _CACHE_TTL:
        return cached[0]

    url = f"https://{AUTH0_DOMAIN}/userinfo"
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            url,
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=10.0,
        )
    if resp.status_code != 200:
        try:
            body = resp.text[:500] if resp.text else "(empty)"
        except Exception:
            body = "(unable to read)"
        logger.warning(
            "Auth0 userinfo failed: status=%s url=%s body=%s",
            resp.status_code,
            url,
            body,
        )
        return None

    data = resp.json()
    _cache[access_token] = (data, now)
    _evict_expired()
    return data
