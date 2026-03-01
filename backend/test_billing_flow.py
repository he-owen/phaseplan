"""
End-to-end test for the full billing flow:

  1. Clear utility_providers and hourly_rates tables
  2. Fetch providers for zip 19805 from OpenEI
  3. Select Delmarva Power — Residential Service (Bundled)
  4. Generate hourly rates for January 2026 and February 2026
  5. Verify both months are populated correctly in hourly_rates
  6. Simulate the Billing page query (getUserProfile + getMonthlyRates)
  7. Verify the API-level query returns data for both months

Usage:
    cd backend
    python test_billing_flow.py
"""

import asyncio
import calendar
import sys

from config import DATABASE_URL

print(f"DB: {DATABASE_URL[:40]}...\n")


async def main():
    from database import (
        async_session,
        get_providers_by_zip,
        get_provider_by_id,
        get_hourly_rates,
        set_user_provider,
        get_user_profile,
        check_database,
    )
    from rate_service import fetch_and_store_providers, generate_monthly_rates
    from sqlalchemy import text

    ZIP = "19805"
    TARGET_UTILITY = "Delmarva Power"
    TARGET_RATE = "Residential Service (Bundled)"
    MONTHS_TO_TEST = [(1, 2026), (2, 2026)]

    passed = 0
    failed = 0

    def ok(label):
        nonlocal passed
        passed += 1
        print(f"  [PASS] {label}")

    def fail(label, detail=""):
        nonlocal failed
        failed += 1
        print(f"  [FAIL] {label}  {detail}")

    # ==================================================================
    print("=" * 60)
    print("STEP 1: Database connectivity")
    print("=" * 60)
    db_ok = await check_database()
    if db_ok:
        ok("Database connected")
    else:
        fail("Database connection failed")
        sys.exit(1)

    # ==================================================================
    print("\n" + "=" * 60)
    print("STEP 2: Clear utility tables")
    print("=" * 60)
    async with async_session() as session:
        r1 = await session.execute(text("DELETE FROM hourly_rates"))
        r2 = await session.execute(text("DELETE FROM utility_providers"))
        await session.commit()
        print(f"  Deleted {r1.rowcount} hourly_rates rows")
        print(f"  Deleted {r2.rowcount} utility_providers rows")

    hr_check = await get_hourly_rates("fake-id", 1, 2026)
    providers_check = await get_providers_by_zip(ZIP)
    if len(hr_check) == 0 and len(providers_check) == 0:
        ok("Tables are empty")
    else:
        fail(f"Tables not fully cleared: {len(hr_check)} rates, {len(providers_check)} providers")

    # ==================================================================
    print("\n" + "=" * 60)
    print("STEP 3: Fetch providers for zip 19805")
    print("=" * 60)
    try:
        providers = await fetch_and_store_providers(ZIP)
        print(f"  Fetched {len(providers)} providers from OpenEI")
        if len(providers) > 0:
            ok(f"Providers stored: {len(providers)}")
        else:
            fail("No providers returned")
    except Exception as e:
        fail("fetch_and_store_providers failed", str(e))
        providers = []

    db_providers = await get_providers_by_zip(ZIP)
    for p in db_providers:
        print(f"    • {p['utility_name']} — {p['rate_name']} (id: {p['provider_id'][:8]}...)")

    # ==================================================================
    print("\n" + "=" * 60)
    print(f"STEP 4: Find '{TARGET_UTILITY}' — '{TARGET_RATE}'")
    print("=" * 60)
    target_provider = None
    for p in db_providers:
        if TARGET_UTILITY in p["utility_name"] and TARGET_RATE in p["rate_name"]:
            target_provider = p
            break

    if target_provider:
        ok(f"Found target provider: {target_provider['provider_id'][:8]}...")
        pid = target_provider["provider_id"]
    else:
        fail(f"Could not find '{TARGET_UTILITY}' — '{TARGET_RATE}'")
        print("  Available providers:")
        for p in db_providers:
            print(f"    • {p['utility_name']} — {p['rate_name']}")
        if db_providers:
            target_provider = db_providers[0]
            pid = target_provider["provider_id"]
            print(f"\n  [FALLBACK] Using first provider: {target_provider['utility_name']} — {target_provider['rate_name']}")
        else:
            print("  No providers available. Cannot continue.")
            sys.exit(1)

    detail = await get_provider_by_id(pid)
    rs = detail.get("rate_structure_json") if detail else None
    wd = detail.get("weekday_schedule_json") if detail else None
    if rs and isinstance(rs, list):
        ok(f"rate_structure_json has {len(rs)} period(s)")
    else:
        fail(f"rate_structure_json missing or invalid: {type(rs)}")
    if wd and isinstance(wd, list) and len(wd) == 12:
        ok("weekday_schedule_json has 12 months x 24 hours")
    else:
        print(f"  [WARN] weekday_schedule_json shape: {type(wd)}, len={len(wd) if isinstance(wd, list) else '?'}")

    # ==================================================================
    print("\n" + "=" * 60)
    print("STEP 5: Generate rates for January 2026 and February 2026")
    print("=" * 60)
    for month, year in MONTHS_TO_TEST:
        month_name = calendar.month_name[month]
        try:
            count = await generate_monthly_rates(pid, month, year)
            expected_days = calendar.monthrange(year, month)[1]
            expected = expected_days * 24
            print(f"  {month_name} {year}: generated {count} rows (expected {expected})")
            if count == expected:
                ok(f"{month_name}: {count} rows = {expected_days} days × 24 hours")
            elif count > 0:
                fail(f"{month_name}: got {count}, expected {expected}")
            else:
                fail(f"{month_name}: 0 rows generated")
        except Exception as e:
            fail(f"{month_name}: generation failed", str(e))

    # ==================================================================
    print("\n" + "=" * 60)
    print("STEP 6: Verify hourly_rates table — query each month")
    print("=" * 60)
    for month, year in MONTHS_TO_TEST:
        month_name = calendar.month_name[month]
        rates = await get_hourly_rates(pid, month, year)
        expected_days = calendar.monthrange(year, month)[1]
        expected = expected_days * 24
        print(f"  {month_name} {year}: {len(rates)} rows in DB")

        if len(rates) == expected:
            ok(f"{month_name}: correct row count ({len(rates)})")
        elif len(rates) > 0:
            fail(f"{month_name}: {len(rates)} rows, expected {expected}")
        else:
            fail(f"{month_name}: NO DATA in hourly_rates")

        if rates:
            r = rates[0]
            if r["provider_id"] == pid:
                ok(f"{month_name}: provider_id matches")
            else:
                fail(f"{month_name}: provider_id mismatch {r['provider_id']} != {pid}")

            days = set()
            hours_per_day = {}
            for r in rates:
                d = str(r["date"])
                days.add(d)
                hours_per_day.setdefault(d, set()).add(r["hour"])

            if len(days) == expected_days:
                ok(f"{month_name}: all {expected_days} days present")
            else:
                fail(f"{month_name}: only {len(days)} days, expected {expected_days}")

            bad = [(d, len(h)) for d, h in hours_per_day.items() if len(h) != 24]
            if not bad:
                ok(f"{month_name}: every day has 24 hourly entries")
            else:
                fail(f"{month_name}: {len(bad)} days with wrong hour count")

    # ==================================================================
    print("\n" + "=" * 60)
    print("STEP 7: Cross-month isolation")
    print("=" * 60)
    jan_rates = await get_hourly_rates(pid, 1, 2026)
    feb_rates = await get_hourly_rates(pid, 2, 2026)
    mar_rates = await get_hourly_rates(pid, 3, 2026)

    jan_dates = {str(r["date"]) for r in jan_rates}
    feb_dates = {str(r["date"]) for r in feb_rates}

    overlap = jan_dates & feb_dates
    if not overlap:
        ok("No date overlap between January and February")
    else:
        fail(f"Date overlap found: {overlap}")

    if all("2026-01" in d for d in jan_dates):
        ok("All January dates are in 2026-01-xx")
    else:
        fail(f"January has wrong dates: {jan_dates - {d for d in jan_dates if '2026-01' in d}}")

    if all("2026-02" in d for d in feb_dates):
        ok("All February dates are in 2026-02-xx")
    else:
        fail(f"February has wrong dates: {feb_dates - {d for d in feb_dates if '2026-02' in d}}")

    if len(mar_rates) == 0:
        ok("March has no data (not generated)")
    else:
        print(f"  [INFO] March has {len(mar_rates)} rates (may have been generated previously)")

    # ==================================================================
    print("\n" + "=" * 60)
    print("STEP 8: Simulate Billing page flow")
    print("=" * 60)
    print("  Simulating: user has selected_provider_id set, loads Billing page")

    # First set the provider on a test user (simulate what onboarding does)
    # We'll check if there's any user in the DB
    async with async_session() as session:
        result = await session.execute(text("SELECT id, email, selected_provider_id FROM users LIMIT 1"))
        user_row = result.mappings().first()

    if user_row:
        user_id = user_row["id"]
        print(f"  Test user: {user_row['email']} (id: {user_id[:20]}...)")

        # Set provider on user
        await set_user_provider(user_id, pid)
        ok(f"Set selected_provider_id = {pid[:8]}... on user")

        # Simulate getUserProfile call (what Billing page does on mount)
        profile = await get_user_profile(user_id)
        if profile and profile["selected_provider_id"] == pid:
            ok("getUserProfile returns correct selected_provider_id")
        else:
            fail(f"getUserProfile returned wrong provider: {profile}")

        # Simulate getMonthlyRates for each month (what Billing page does)
        for month, year in MONTHS_TO_TEST:
            month_name = calendar.month_name[month]
            rates = await get_hourly_rates(profile["selected_provider_id"], month, year)
            if len(rates) > 0:
                ok(f"Billing query for {month_name} {year}: {len(rates)} rows returned")
            else:
                fail(f"Billing query for {month_name} {year}: 0 rows — THIS IS THE BUG")
                # Debug: check with raw SQL
                async with async_session() as session:
                    debug = await session.execute(
                        text("""
                            SELECT COUNT(*) as cnt,
                                   MIN(date) as min_date,
                                   MAX(date) as max_date
                            FROM hourly_rates
                            WHERE provider_id = :pid
                        """),
                        {"pid": profile["selected_provider_id"]},
                    )
                    row = debug.mappings().first()
                    print(f"    DEBUG: total rates for provider: {row['cnt']}, date range: {row['min_date']} to {row['max_date']}")

                    debug2 = await session.execute(
                        text("""
                            SELECT EXTRACT(MONTH FROM date) as m,
                                   EXTRACT(YEAR FROM date) as y,
                                   COUNT(*) as cnt
                            FROM hourly_rates
                            WHERE provider_id = :pid
                            GROUP BY m, y
                            ORDER BY y, m
                        """),
                        {"pid": profile["selected_provider_id"]},
                    )
                    for r in debug2.mappings().all():
                        print(f"    DEBUG: month={int(r['m'])}, year={int(r['y'])}, count={r['cnt']}")
    else:
        print("  [SKIP] No users in DB — cannot simulate Billing page user flow")
        print("  Testing API query directly with provider_id...")
        for month, year in MONTHS_TO_TEST:
            month_name = calendar.month_name[month]
            rates = await get_hourly_rates(pid, month, year)
            if len(rates) > 0:
                ok(f"Direct query for {month_name} {year}: {len(rates)} rows")
            else:
                fail(f"Direct query for {month_name} {year}: 0 rows")

    # ==================================================================
    print("\n" + "=" * 60)
    print(f"RESULTS: {passed} passed, {failed} failed")
    print("=" * 60)
    if failed == 0:
        print("All checks passed! DB is correctly populated.")
        print(f"\nProvider ID for Billing page: {pid}")
    else:
        print("Some checks failed — review output above.")
    print()
    return failed


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(min(exit_code, 1))
