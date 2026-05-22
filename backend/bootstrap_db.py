"""
Quick database bootstrap script — runs as postgres superuser via psycopg2.
Creates the dumlis_user (if missing), creates dumlis_db, then exits.
Usage:  python bootstrap_db.py --pg-pass diab
"""
import argparse
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--pg-pass",   default="diab",        help="postgres superuser password")
    parser.add_argument("--pg-user",   default="postgres",    help="postgres superuser name")
    parser.add_argument("--pg-host",   default="localhost")
    parser.add_argument("--pg-port",   type=int, default=5432)
    parser.add_argument("--db-user",   default="dumlis_user")
    parser.add_argument("--db-pass",   default="dumlis_pass")
    parser.add_argument("--db-name",   default="dumlis_db")
    args = parser.parse_args()

    print(f"Connecting to PostgreSQL as {args.pg_user}@{args.pg_host}:{args.pg_port} ...")
    conn = psycopg2.connect(
        host=args.pg_host,
        port=args.pg_port,
        user=args.pg_user,
        password=args.pg_pass,
        dbname="postgres",
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()

    # Create / update user
    cur.execute("SELECT 1 FROM pg_roles WHERE rolname = %s", (args.db_user,))
    if cur.fetchone():
        cur.execute(f"ALTER USER {args.db_user} WITH PASSWORD %s", (args.db_pass,))
        print(f"  ✅  User '{args.db_user}' password updated.")
    else:
        cur.execute(f"CREATE USER {args.db_user} WITH PASSWORD %s", (args.db_pass,))
        print(f"  ✅  User '{args.db_user}' created.")

    # Create database
    cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (args.db_name,))
    if cur.fetchone():
        print(f"  ✅  Database '{args.db_name}' already exists.")
    else:
        cur.execute(f'CREATE DATABASE {args.db_name} OWNER {args.db_user}')
        print(f"  ✅  Database '{args.db_name}' created.")

    # Grant privileges
    cur.execute(f"GRANT ALL PRIVILEGES ON DATABASE {args.db_name} TO {args.db_user}")
    print(f"  ✅  Privileges granted.")

    cur.close()
    conn.close()
    print("\nDatabase bootstrap complete!\n")

if __name__ == "__main__":
    main()
