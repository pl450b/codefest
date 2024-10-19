import os
import psycopg2
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Database connection details
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_NAME = os.environ.get('DB_NAME', 'codefest')
DB_USER = os.environ.get('DB_USER', 'codefest_user')
DB_PASS = os.environ.get('DB_PASS', 'Party@H0tel')

# Initialize the sentence transformer model
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Your predefined quests
AVAILABLE_QUESTS = [
    "Walk Among the Legends - Join a free walking tour guided by a local expert to discover hidden stories of the city.",
    "Feast of the Senses - Embark on a local food or drink tour, savoring authentic flavors with fellow adventurers.",
    "The Traveler's Hearth - Participate in a hostel or community event (pub crawl, game night, etc.) to meet other travelers.",
    "Daybreak Expedition - Book a small group day trip through the hotel to explore a nearby destination.",
    "Tavern Ties - Join a local pub crawl or happy hour to connect with townsfolk and fellow adventurers.",
    "The Digital Call to Arms - Respond to a traveler's meetup event via social media. Join a group adventure or spontaneous gathering.",
    "Art of the Moment - Participate in a local craft or cooking class and create something uniquely yours.",
    "Song of the Streets - Attend a free street performance or outdoor concert to soak in the city's culture.",
    "The Fittest Shall Thrive - Join a drop-in fitness class (yoga, boot camp, cycling) to boost your health and meet other fitness enthusiasts.",
    "The Tongue's Tapestry - Attend a language exchange cafe to practice the local language with others.",
    "Feast Among Strangers - Visit a local street food market and dine at communal tables to bond with fellow travelers.",
    "The Traveler's Feast - Join a traveler-exclusive dinner organized by the hotel or a local hostel.",
    "Capture the Horizon - Participate in a photography or Instagram tour to capture the city's best views.",
    "Flame and Flavor - Attend a short cooking class and master a local dish.",
    "Swift Sights - Join a quick sightseeing tour (bike, segway, or boat) to cover more ground in less time."
]

def get_user_profile(user_id):
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST
        )
        cur = conn.cursor()
        cur.execute("""
            SELECT travel_frequency, destination_preference, traveler_type, 
                   time_preference, documentation_style
            FROM user_travel_profiles
            WHERE user_id = %s
        """, (user_id,))
        user_profile = cur.fetchone()
        cur.close()
        conn.close()
        return user_profile
    except psycopg2.Error as e:
        print(f"Database connection error: {e}")
        return None

def create_profile_embedding(profile):
    profile_text = f"{profile[0]} traveler, {profile[1]} preference, {profile[2]} type, {profile[3]} time, {profile[4]} documentation"
    return model.encode([profile_text])[0]

def create_quest_embeddings():
    return model.encode(AVAILABLE_QUESTS)

def find_matching_quest(user_profile):
    profile_embedding = create_profile_embedding(user_profile)
    quest_embeddings = create_quest_embeddings()
    
    # Calculate similarities
    similarities = cosine_similarity([profile_embedding], quest_embeddings)[0]
    
    # Get the best matching quest
    best_match_idx = np.argmax(similarities)
    return AVAILABLE_QUESTS[best_match_idx]

def main():
    user_id = input("Enter the user ID: ")
    user_profile = get_user_profile(user_id)
    
    if user_profile:
        print("\nUser Travel Profile:")
        print(f"Travel Frequency: {user_profile[0]}")
        print(f"Destination Preference: {user_profile[1]}")
        print(f"Traveler Type: {user_profile[2]}")
        print(f"Time Preference: {user_profile[3]}")
        print(f"Documentation Style: {user_profile[4]}")
        
        suggested_quest = find_matching_quest(user_profile)
        print(f"\nSuggested Quest: {suggested_quest}")
    else:
        print("User not found in the database.")

if __name__ == "__main__":
    main()
