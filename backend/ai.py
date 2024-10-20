import os
import psycopg2
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import json

# Database connection details
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_NAME = os.environ.get('DB_NAME', 'codefest')
DB_USER = os.environ.get('DB_USER', 'codefest_user')
DB_PASS = os.environ.get('DB_PASS', 'Party@H0tel')

# Initialize the sentence transformer model
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Your predefined quests
# AVAILABLE_QUESTS = [
#     "Walk Among the Legends - Join a free walking tour guided by a local expert to discover hidden stories of the city.",
#     "Feast of the Senses - Embark on a local food or drink tour, savoring authentic flavors with fellow adventurers.",
#     "The Traveler's Hearth - Participate in a hostel or community event (pub crawl, game night, etc.) to meet other travelers.",
#     "Daybreak Expedition - Book a small group day trip through the hotel to explore a nearby destination.",
#     "Tavern Ties - Join a local pub crawl or happy hour to connect with townsfolk and fellow adventurers.",
#     "The Digital Call to Arms - Respond to a traveler's meetup event via social media. Join a group adventure or spontaneous gathering.",
#     "Art of the Moment - Participate in a local craft or cooking class and create something uniquely yours.",
#     "Song of the Streets - Attend a free street performance or outdoor concert to soak in the city's culture.",
#     "The Fittest Shall Thrive - Join a drop-in fitness class (yoga, boot camp, cycling) to boost your health and meet other fitness enthusiasts.",
#     "The Tongue's Tapestry - Attend a language exchange cafe to practice the local language with others.",
#     "Feast Among Strangers - Visit a local street food market and dine at communal tables to bond with fellow travelers.",
#     "The Traveler's Feast - Join a traveler-exclusive dinner organized by the hotel or a local hostel.",
#     "Capture the Horizon - Participate in a photography or Instagram tour to capture the city's best views.",
#     "Flame and Flavor - Attend a short cooking class and master a local dish.",
#     "Swift Sights - Join a quick sightseeing tour (bike, segway, or boat) to cover more ground in less time."
# ]


def get_quests_from_db():
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST
        )
        cur = conn.cursor()
        cur.execute("""
            SELECT challenge
            FROM challenges
        """)
        challenges = cur.fetchall()
        cur.close()
        conn.close()
        return challenges
    except psycopg2.Error as e:
        print(f"Database connection error: {e}")
        return None


def get_user_profile(username):
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST
        )
        cur = conn.cursor()
        cur.execute("""
            SELECT preferences
            FROM user_survey
            WHERE username = %s
        """, (username,))
        user_profile = cur.fetchone()

        preferences = user_profile[0]
        data_dict = json.loads(preferences)

        cur.close()
        conn.close()
        return data_dict
    except psycopg2.Error as e:
        print(f"Database connection error: {e}")
        return None

def create_profile_embedding(profile):
    profile_text = f"{profile["travelFrequency"]} traveler, {profile["travelDestinations"]} preference, {profile["travelPersonality"]} type, {profile["travelHabits"]} time, {profile["documentingTravel"]} documentation"
    return model.encode([profile_text])[0]

def create_quest_embeddings():

    print(get_quests_from_db())
    return model.encode(get_quests_from_db())

def find_matching_quest(user_profile):
    profile_embedding = create_profile_embedding(user_profile)
    quest_embeddings = create_quest_embeddings()
    
    # Calculate similarities
    similarities = cosine_similarity([profile_embedding], quest_embeddings)[0]
    
    # Get the best matching quest
    top_3_indices = np.argsort(similarities)[-3:][::-1]  # Sort, then get the last 3 indices in descending order

    return top_3_indices

def main():
    username = input("Enter the username: ")
    user_profile = get_user_profile(username)
    
    if user_profile:
        print("\nUser Travel Profile:")
        print(f"Travel Frequency: {user_profile["travelFrequency"]}")
        print(f"Destination Preference: {user_profile["travelDestinations"]}")
        print(f"Traveler Type: {user_profile["travelPersonality"]}")
        print(f"Time Preference: {user_profile["travelHabits"]}")
        print(f"Documentation Style: {user_profile["documentingTravel"]}")
        
        suggested_quest = find_matching_quest(user_profile)
        print(f"\nSuggested Quest: {suggested_quest}")
    else:
        print("User not found in the database.")

if __name__ == "__main__":
    main()
