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
    return_val = False
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
        cursor.execute(query, (username, hash_pass(password)))

        # Fetch the result
        fetched_hash = cursor.fetchone()[0]

        if fetched_hash:
            print("[DATABASE] Login successfull!")
            return_val = True
        else:
            print("Login failure")
            return_val = False

    except Exception as error:
        print(f"Error while logging in: {error}")
        return_val = False

    finally:
        # Close the cursor and connection
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        return return_val

def add_token(username, token):
    return_val = False
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
        query = sql.SQL("UPDATE auth SET token = %s WHERE username = %s;")

        # Execute the SQL query
        cursor.execute(query, (token, username))
        connection.commit()
        print("[DATABASE] Token updated!")
        return_val = True

    except Exception as error:
        print(f"Error while updating token: {error}")
        return_val = False

    finally:
        # Close the cursor and connection
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        return return_val

def get_user_from_token(token):
    try:
        connection = psycopg2.connect(
                host=DB_HOST,
                database=DB_NAME,
                user=DB_USER,
                password=DB_PASS
                )

        cursor = connection.cursor()

        query = "SELECT username FROM users WHERE token = %s;"

        cursor.execute(query, (token,))

        result = cursor.fetchone()

        if result:
            username = result[0]
            return result
        else:
            print("[DATABASE] Token not found")
            return None

    except Exception as error:
        print("Error fetching username from the database:", error)
    finally:
        if cursor:
            cursor.close()  # Close the cursor
        if connection:
            connection.close()  # Close the connection

def add_user(username, password):
    return_val = False
    try:
        # Connect to the PostgreSQL server
        connection = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        
        cursor = connection.cursor()

        query = sql.SQL("SELECT COUNT(*) FROM auth WHERE username = %s;")
        cursor.execute(query, (username,))
        count = cursor.fetchone()[0]

        if count > 0:
            print("User already exists")
            return_val = False
        else:
            # add new user to database
            query = sql.SQL(f"INSERT INTO auth (username, hash) VALUES (%s, %s);")
            cursor.execute(query, (username, hash_pass(password)))
            connection.commit()
            print(f"User '{username}' created!!")
            return_val = True

    finally:
        # Close the cursor and connection
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        return return_val

def remove_user(username):
    try:
        # Connect to the PostgreSQL server
        connection = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        
        cursor = connection.cursor()

        # Check if the user exists
        query = sql.SQL("SELECT COUNT(*) FROM auth WHERE username = %s;")
        cursor.execute(query, (username,))
        count = cursor.fetchone()[0]

        if count == 0:
            print("User does not exist.")
            return False
        else:
            # Remove the user from the database
            query = sql.SQL("DELETE FROM auth WHERE username = %s;")
            cursor.execute(query, (username,))
            connection.commit()
            print(f"User '{username}' removed successfully!")
            return True

    finally:
        # Close the cursor and connection
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == "__main__":
    while True:
        print("\n----------------------------")
        print("Select functionality to test\n1) Hashing\n2) Creating User\n3) Login\n4) Remove User")
        
        selection = input()

        if(selection == '1'):
            test_username = input("Enter text to hash: ")
            print(f"Hashed input: '{hash_pass(test_username)}'\n")

        if(selection == '2'):
            test_username = input("Enter username: ")
            test_password = input("Enter password: ")

            add_user(test_username, test_password)

        if(selection == '3'):
            test_username = input("Enter username: ")
            test_password = input("Enter password: ")

            attempt_login(test_username, test_password)
        
        if(selection == '4'):
            test_username = input("Enter username: ")
            test_password = input("Enter password: ")

            attempt_login(test_username, test_password)

            print("Before removing:")
            print(f"User '{test_username}'")

            remove_user(test_username)

            print("After removing:")
            print(f"User '{test_username}'")
