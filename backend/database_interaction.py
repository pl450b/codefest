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

        query = "SELECT username FROM auth WHERE token = %s;"

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

def check_selected_challenge(username):
    try:
        # Connect to the PostgreSQL server
        connection = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        
        cursor = connection.cursor()

        # Update or set the selected_challenge for the user
        query = sql.SQL("SELECT sel_challenge FROM user_survey WHERE username = %s;")
        cursor.execute(query, (username,))
        
        result = cursor.fetchone()
        cursor.close()

        print(f"[DATABASE] Grabed challenge {result[0]} from user {username}")

        return result[0] if result else NONE

    except Exception as error:
        print(f"Error while finding challenge: {error}")
        return False

    finally:
        # Close the cursor and connection
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def update_selected_challenge(username, selected_challenge):
    try:
        # Connect to the PostgreSQL server
        connection = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        
        cursor = connection.cursor()

        # Update or set the selected_challenge for the user
        query = sql.SQL("UPDATE user_survey SET sel_challenge = %s WHERE username = %s;")
        cursor.execute(query, (selected_challenge, username))
        connection.commit()

        print(f"[DATABASE] Challenge '{selected_challenge}' set for user '{username}'")
        return True

    except Exception as error:
        print(f"Error while updating selected challenge: {error}")
        return False

    finally:
        # Close the cursor and connection
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def update_user_preferences(username, preferences):
    try:
        # Connect to the PostgreSQL server
        connection = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        
        cursor = connection.cursor()

        # Check if the user already exists
        cursor.execute("SELECT COUNT(*) FROM user_survey WHERE username = %s;", (username,))
        user_exists = cursor.fetchone()[0] > 0

        if user_exists:
            # User exists: Update their preferences
            query = """
            UPDATE user_survey SET
                preferences = %s
            WHERE username = %s;
            """
            cursor.execute(query, (preferences, username))
        else:
            # User does not exist: Insert new user
            query = """
            INSERT INTO user_survey (username, preferences)
            VALUES (%s, %s);
            """
            cursor.execute(query, (username, preferences))

        # Commit the transaction
        connection.commit()

        print(f"[DATABASE] Preferences set for user '{username}'")
        return True

    except Exception as error:
        print(f"Error while updating user preferences: {error}")
        return False

    finally:
        # Close the cursor and connection
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def user_exists_in_survey(username):
    try:
        # Connect to the PostgreSQL server
        connection = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        
        cursor = connection.cursor()

        # Check if the username exists in the user_survey table
        query = "SELECT COUNT(*) FROM user_survey WHERE username = %s;"
        cursor.execute(query, (username,))
        user_exists = cursor.fetchone()[0] > 0

        return user_exists

    except Exception as error:
        print(f"Error while checking if user exists in survey: {error}")
        return False

    finally:
        # Close the cursor and connection
        if cursor:
            cursor.close()
        if connection:
            connection.close()


if __name__ == "__main__":
    while True:
        print("\n----------------------------")
        print("Select functionality to test\n1) Hashing\n2) Creating User\n3) Login\n4) Remove User\n5) Check User Challenge\n")
        
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
        if(selection == '5'):
            test_username = input("Enter username: ")

            result = check_selected_challenge(test_username)

            print(result)
