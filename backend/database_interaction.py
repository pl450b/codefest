import psycopg2
from psycopg2 import sql
import hashlib

db_codefest = psycopg2.connect(
        host="localhost",
        database="codefest",
        user="postgres",
        password="p0stgr3568"
    )

tbl_auth = "auth"
cursor = db_codefest.cursor()

