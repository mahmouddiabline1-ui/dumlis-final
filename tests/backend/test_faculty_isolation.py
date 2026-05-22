# tests/backend/test_faculty_isolation.py
"""Backend tests for faculty‑scoped isolation.
Uses httpx.AsyncClient to call the FastAPI app directly.
"""

import pytest


@pytest.mark.asyncio
async def test_committee_isolation(client, faculty_admin_fcai_token, seed_faculty, db_session):
    """Faculty admin sees only their faculty's committees."""
    from backend.app.models import Committee

    c1 = Committee(name="لجنة TEST_FCAI", type="إداري", faculty_id="TEST_FCAI")
    c2 = Committee(name="لجنة TEST_SCI", type="إداري", faculty_id="TEST_SCI")
    db_session.add_all([c1, c2])
    db_session.flush()

    resp = await client.get(
        "/committees/",
        headers={"Authorization": f"Bearer {faculty_admin_fcai_token}"}
    )
    assert resp.status_code == 200
    data = resp.json()
    # All returned committees must belong to TEST_FCAI
    for c in data:
        assert c["faculty_id"] == "TEST_FCAI"


@pytest.mark.asyncio
async def test_committee_cross_access_denied(client, faculty_admin_fcai_token, seed_faculty, db_session):
    """Faculty admin cannot access other faculty's committees."""
    from backend.app.models import Committee

    sci_committee = Committee(name="لجنة TEST_SCI", type="إداري", faculty_id="TEST_SCI")
    db_session.add(sci_committee)
    db_session.flush()
    sci_committee_id = sci_committee.id

    resp = await client.get(
        f"/committees/{sci_committee_id}",
        headers={"Authorization": f"Bearer {faculty_admin_fcai_token}"}
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_attendance_isolation(client, faculty_admin_fcai_token, seed_faculty, db_session):
    """Faculty admin sees only their faculty's attendance records."""
    resp = await client.get(
        "/attendance/",
        headers={"Authorization": f"Bearer {faculty_admin_fcai_token}"}
    )
    assert resp.status_code == 200
    records = resp.json()
    for r in records:
        assert r["faculty_id"] == "TEST_FCAI"
