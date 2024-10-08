import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from typing import Any, Text, Dict, List
import re
import psycopg2

# Database connection
try:
    conn = psycopg2.connect(
        host="159.196.147.89",
        port="5432",
        user="postgres",
        password="EthanIsASillyBilly",
        dbname="industryconnectdb"
    )
    print("DEBUG: Successfully connected to the database.")
except psycopg2.Error as e:
    print(f"ERROR: Could not connect to the database. Details: {e}")

# Custom action to search for projects
class ActionSearchProjects(Action):

    def name(self) -> Text:
        return "action_search_projects"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Extract slots
        keywords = tracker.get_slot('keywords')
        discipline = tracker.get_slot('discipline')
        duration = tracker.get_slot('duration')
        size = tracker.get_slot('size')
        industry = tracker.get_slot('industry')
        location = tracker.get_slot('location')

        # Clean the slot values
        if size:
            size = size.capitalize()

        if duration:
            # Ensure that duration is correctly formatted (e.g., "12 Weeks")
            match = re.search(r'(\d+)\s?weeks?', duration, re.IGNORECASE)
            if match:
                duration = f"{match.group(1)} Weeks"

        print(f"DEBUG: Slots - Discipline: {discipline}, Keywords: {keywords}, Industry: {industry}, Duration: {duration}, Location: {location}, Size: {size}")

        # Fetch data from the database
        try:
            cursor = conn.cursor()
            query = "SELECT title, discipline, duration, location FROM projects WHERE 1=1"
            params = []

            if discipline:
                query += " AND discipline = %s"
                params.append(discipline)

            if keywords:
                query += " AND title ILIKE %s"
                params.append(f"%{keywords}%")

            if industry:
                query += " AND industry = %s"
                params.append(industry)

            query += " LIMIT 5;"
            cursor.execute(query, tuple(params))
            results = cursor.fetchall()
            cursor.close()

            # Check if any results were returned
            if results:
                project_summaries = "\n".join([f"- {title} ({disc}, {dur}, {loc})" for title, disc, dur, loc in results])
                dispatcher.utter_message(text=f"Here are some projects from the database:\n{project_summaries}")
            else:
                dispatcher.utter_message(text="No matching projects found in the database.")

        except psycopg2.Error as e:
            dispatcher.utter_message(text="An error occurred while fetching data from the database.")
            print(f"Database error: {e}")

        # Build query parameters for API call
        query_params = {}
        if keywords:
            query_params['keywords'] = keywords
        if discipline:
            query_params['discipline'] = discipline
        if duration:
            query_params['duration'] = duration
        if size:
            query_params['size'] = size
        if industry:
            query_params['industry'] = industry
        if location:
            query_params['location'] = location

        print(f"DEBUG: Query parameters for API: {query_params}")

        # Make a GET request to the external API
        try:
            api_url = 'http://host.docker.internal:3000/api/project/ai-search'
            response = requests.get(api_url, params=query_params)
            print(f"DEBUG: API Response status: {response.status_code}")

            if response.status_code == 200:
                projects = response.json()
                if projects:
                    project_summaries = "\n".join([f"- {project['title']} ({project['discipline']}, {project['duration']}, {project['location']})" for project in projects])
                    dispatcher.utter_message(text=f"Here are some matching projects from the API:\n{project_summaries}")
                else:
                    dispatcher.utter_message(text="No matching projects found via the API.")
            else:
                dispatcher.utter_message(text="Error fetching data from the API.")
                print(f"API Error: {response.status_code}, {response.text}")

        except requests.RequestException as e:
            dispatcher.utter_message(text="An error occurred while accessing the project search API.")
            print(f"API error: {e}")

        return []
