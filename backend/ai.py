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
# Additional 100 Vague Challenges
AVAILABLE_QUESTS = [
    ["Sunrise Stroll", "Wake up early and take a walk to enjoy the sunrise.", "+25 Travel Points"],
    ["Taste of Tradition", "Try a dish that is considered a local specialty.", "+35 Travel Points"],
    ["The Storyteller's Circle", "Listen to someone share a story about the place.", "+30 Travel Points"],
    ["Sketch the Scene", "Capture your surroundings by drawing or sketching.", "+40 Travel Points"],
    ["The Wanderer's Path", "Walk aimlessly for an hour and discover something new.", "+20 Travel Points"],
    ["Quiet Corner", "Find a peaceful spot to sit and reflect for a while.", "+15 Travel Points"],
    ["Local Flavors", "Buy and try a snack or drink you've never had before.", "+20 Travel Points"],
    ["The Midnight Walk", "Go for a walk at night to see the area in a different light.", "+30 Travel Points"],
    ["People Watch", "Spend time in a public space observing life around you.", "+10 Travel Points"],
    ["Café Conversation", "Have a chat with someone over a cup of coffee or tea.", "+25 Travel Points"],
    ["Art in the Wild", "Find an art piece or mural in an unexpected place.", "+35 Travel Points"],
    ["Nature's Call", "Spend time in a natural setting, away from buildings and roads.", "+45 Travel Points"],
    ["Bookshop Browse", "Visit a local bookstore and explore their selection.", "+20 Travel Points"],
    ["The Collector's Quest", "Buy a small souvenir that represents the place.", "+15 Travel Points"],
    ["Dance Like No One's Watching", "Find a place to dance, even if it's just for yourself.", "+25 Travel Points"],
    ["The Taste Test", "Try two similar foods and decide which one you like better.", "+20 Travel Points"],
    ["Window to the World", "Spend time looking out a window and observe what you see.", "+10 Travel Points"],
    ["Capture the Moment", "Take a photo that captures the essence of the day.", "+30 Travel Points"],
    ["Under the Open Sky", "Sit outside and watch the clouds or stars for a while.", "+15 Travel Points"],
    ["Take a Different Route", "Get somewhere by a route you've never taken before.", "+20 Travel Points"],
    ["The Explorer's Journal", "Write about your experience in a journal or diary.", "+30 Travel Points"],
    ["Sounds of the City", "Close your eyes and listen to the sounds around you.", "+15 Travel Points"],
    ["Try Something New", "Experience something you've never done before.", "+40 Travel Points"],
    ["The Market Walk", "Wander through a local market or shopping area.", "+25 Travel Points"],
    ["Hidden Gem", "Find a place that's off the beaten path and explore it.", "+35 Travel Points"],
    ["The Solitary Meal", "Enjoy a meal alone and savor every bite.", "+20 Travel Points"],
    ["Artistic Expression", "Create something artistic, no matter how small.", "+25 Travel Points"],
    ["The Secret Spot", "Discover a spot that feels like a hidden secret.", "+30 Travel Points"],
    ["Silent Observer", "Spend an hour in a busy place without speaking.", "+15 Travel Points"],
    ["Self-Guided Tour", "Guide yourself through an area as if you're a local expert.", "+20 Travel Points"],
    ["Read a Local Paper", "Find and read a local newspaper or magazine.", "+10 Travel Points"],
    ["Find a Green Space", "Relax in a park or garden for at least an hour.", "+25 Travel Points"],
    ["The Wanderer's Feast", "Try a food you can find in any street food stall.", "+20 Travel Points"],
    ["Quiet Reflection", "Take some time to reflect on your journey so far.", "+10 Travel Points"],
    ["The Early Bird", "Wake up early and observe the city or town waking up.", "+30 Travel Points"],
    ["The Tinker's Task", "Find something broken and try to fix it.", "+35 Travel Points"],
    ["Follow the Music", "Walk towards the sound of live music and listen.", "+30 Travel Points"],
    ["Try a Local Beverage", "Sample a drink that is commonly enjoyed in the area.", "+15 Travel Points"],
    ["Find a Great View", "Locate a spot with a stunning view and take it in.", "+35 Travel Points"],
    ["The Short Walk", "Take a short walk and see where it leads you.", "+10 Travel Points"],
    ["The Traveler's Question", "Ask a local for a recommendation and follow their advice.", "+25 Travel Points"],
    ["The Collectible Hunt", "Look for a unique item to add to your collection.", "+20 Travel Points"],
    ["Light Up the Night", "Watch the city or town come to life after sunset.", "+30 Travel Points"],
    ["Find a Quiet Café", "Sit in a café and observe life around you without distractions.", "+20 Travel Points"],
    ["The Breeze's Embrace", "Find a spot where you can feel a natural breeze.", "+10 Travel Points"],
    ["The Curious Wanderer", "Follow your curiosity and explore a new area.", "+30 Travel Points"],
    ["The Lone Explorer", "Spend time exploring an area by yourself.", "+40 Travel Points"],
    ["The Lively Square", "Spend an hour in a busy square and observe the activity.", "+25 Travel Points"],
    ["The Garden's Gift", "Visit a garden and find your favorite plant or flower.", "+15 Travel Points"],
    ["The Old Book", "Find an old book and read a few pages.", "+20 Travel Points"],
    ["The Short Nap", "Take a nap outdoors if the weather allows.", "+10 Travel Points"],
    ["The Hobbyist's Quest", "Spend time engaging in a personal hobby.", "+25 Travel Points"],
    ["The Local Conversation", "Talk to someone about what it's like to live here.", "+35 Travel Points"],
    ["Follow a Trail", "Find and follow a walking trail for a while.", "+40 Travel Points"],
    ["The Cafe Crawl", "Visit at least three different cafes and compare them.", "+50 Travel Points"],
    ["Find Local Art", "Discover a piece of art that is unique to the area.", "+30 Travel Points"],
    ["The Quiet Watch", "Sit still and watch a body of water for a while.", "+20 Travel Points"],
    ["Follow Your Nose", "Walk towards a pleasant scent and find its source.", "+25 Travel Points"],
    ["The Traveler's Retreat", "Spend a relaxing day without a schedule.", "+30 Travel Points"],
    ["The Road Less Traveled", "Choose a less common path and explore it.", "+35 Travel Points"],
    ["The Musician's Corner", "Find a spot where someone is playing music and listen.", "+20 Travel Points"],
    ["The Unexpected Feast", "Stumble upon a place to eat and give it a try.", "+25 Travel Points"],
    ["A View from Above", "Find a place that gives you a bird's-eye view of the area.", "+40 Travel Points"],
    ["The Water's Edge", "Walk along a river, lake, or ocean shore.", "+30 Travel Points"],
    ["Taste a Local Dessert", "Indulge in a sweet treat that is popular locally.", "+15 Travel Points"],
    ["The Old Path", "Follow an old street or alley and see where it leads.", "+20 Travel Points"],
    ["Find a Place of Reflection", "Locate a place where you can be alone with your thoughts.", "+25 Travel Points"],
    ["The Shared Experience", "Join a group activity or tour.", "+35 Travel Points"],
    ["The Unexpected Purchase", "Buy something small that catches your eye.", "+15 Travel Points"],
    ["The Long Walk", "Walk for at least an hour without any specific destination.", "+40 Travel Points"],
    ["The Window Seat", "Sit by a window and observe what you can see from there.", "+10 Travel Points"],
    ["The Warm Drink", "Enjoy a warm drink on a chilly day.", "+15 Travel Points"],
    ["The Local Flavor", "Try a dish or drink that’s said to be 'authentic'.", "+25 Travel Points"],
    ["Find a Local Event", "Attend an event that's open to the public.", "+30 Travel Points"],
    ["Take a Scenic Drive", "Drive or ride through a scenic area without rushing.", "+35 Travel Points"],
    ["The Afternoon Rest", "Find a quiet place to rest for a little while.", "+10 Travel Points"],
    ["The Book Lover's Corner", "Spend time reading in a cozy spot.", "+20 Travel Points"],
    ["Morning Ritual", "Take a moment to observe the morning routines around you.", "+30 Travel Points"],
    ["Evening Walk", "Take a walk during the evening to wind down the day.", "+25 Travel Points"],
    ["The Green Oasis", "Find a green space amidst the urban area and enjoy it.", "+15 Travel Points"],
    ["Share a Smile", "Smile at someone you meet and notice their reaction.", "+10 Travel Points"],
    ["The Traveler's Delight", "Find something delightful that makes you smile.", "+20 Travel Points"],
    ["The Unexpected Turn", "Turn down a street you haven't been to yet.", "+25 Travel Points"],
    ["Taste Test Challenge", "Try two similar foods and pick your favorite.", "+20 Travel Points"],
    ["The Early Morning", "Wake up early and appreciate the morning quiet.", "+30 Travel Points"],
    ["The Local's Tip", "Ask a local for their favorite spot and visit it.", "+35 Travel Points"],
]


def add_quests_to_db():
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            host=DB_HOST
        )
        cur = conn.cursor()
        insert_query = "INSERT INTO challenges VALUES (?)"

        # Loop through the challenges array and insert each one
        for challenge in AVAILABLE_QUESTS:
            cursor.execute(insert_query, (challenge,)) 

            # Commit the transaction
            conn.commit()

        # Close the connection
        conn.close()
    except:
        print()


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
    add_quests_to_db()
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
