import psycopg2
from psycopg2 import sql
import hashlib

DB_HOST = 'localhost'
DB_NAME = 'codefest'
DB_USER = 'codefest_user'
DB_PASS = 'Party@H0tel'

def hash_pass(input_string):
    # Encode the string to bytes
    encoded_string = input_string.encode()
    
    # Perform SHA-256 hashing
    sha256_hash_object = hashlib.sha256(encoded_string)
    
    # Get the hexadecimal representation of the hash
    hex_digest = sha256_hash_object.hexdigest()
    
    return hex_digest

def attempt_login(username, password):
    try:
        # Connect to the PostgreSQL server
        connection = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )

        # Create a cursor object
        cursor = connection.cursor()

        # Write the SQL query
        query = sql.SQL("SELECT EXISTS (SELECT 1 FROM auth WHERE username = %s AND hash = %s);")

        # Execute the SQL query
        cursor.execute(query, (username, hash))

        # Fetch the result
        fetched_hash = cursor.fetchone()[0]
        if hash:
            if hash == hash_pass(password):
                print("Login succesfull!")
                return True
            else:
                print("Incorrect password")
                return False
        else:
            print("User does not exist")
            return False

    except Exception as error:
        print(f"Error while connecting to PostgreSQL: {error}")
        return False

    finally:
        # Close the cursor and connection
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def add_user(username, password):
    try:
        # Connect to the PostgreSQL server
        connection = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        
        cursor = connection.cursor()

        query = sql.SQL("SELECT COUNT(*) FROM your_table_name WHERE username = %s;")

        cursor.execute(query, (username,))
        count = cursor.fetchone()[0]

        if count > 0:
            print("User already exists")
            return False
        else:
            # add new user to database
            query = sql.SQL("CREATE USER {} WITH PASSWORD %s;").format(sql.Indentifier(username))
            cursor.execute(query, (hash_pass(password),))
            connection.commit()
            print(f"User '{username}' created!!")
            return True

    finally:
        # Close the cursor and connection
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == "__main__":
    while True:
        print("Select functionality to test\n1) Hashing\n2) Creating User\n3) Removing User\n")
        
        selection = input()

        if(selection == '1'):
            test_username = input("Enter text to hash: ")
            print(f"Hashed input: '{hash_pass(test_username)}'\n")

        if(selection == '2'):
            test_username = input()
