import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from typing import Any, Text, Dict, List
import re
import psycopg2
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

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

        # Handle cases where discipline is used as keyword
        if discipline and not keywords:
            keywords = discipline

        logger.debug(f"Slots - Discipline: {discipline}, Keywords: {keywords}, Industry: {industry}, Duration: {duration}, Location: {location}, Size: {size}")

        try:
            # Open database connection within the run method
            conn = psycopg2.connect(
                host="159.196.147.89",
                port="5432",
                user="postgres",
                password="EvanLovesFinance",
                dbname="industryconnectdb"
            )
            cursor = conn.cursor()

            query = """
                SELECT project_id, industry_id, publish_date, discipline, duration, size, location_type, title, 
                industry, description, status, image_path, address 
                FROM "Projects" 
                WHERE 1=1
            """
            params = []

            if discipline:
                query += " AND discipline = %s"
                params.append(discipline)

            if keywords:
                query += " AND (title ILIKE %s OR description ILIKE %s)"
                params.append(f"%{keywords}%")
                params.append(f"%{keywords}%")

            if industry:
                query += " AND industry = %s"
                params.append(industry)

            if location:
                query += " AND location_type = %s"
                params.append(location)

            query += " LIMIT 5;"
            logger.debug(f"Final query: {query} with params: {params}")

            cursor.execute(query, tuple(params))
            results = cursor.fetchall()
            cursor.close()
            conn.close()

            # Check if any results were returned
            if results:
                project_summaries = "\n\n".join(
                    [f"Project ID: {proj_id}\nTitle: {title}\nDiscipline: {discipline}\nIndustry: {industry}\nPublish Date: {publish_date}\nDuration: {duration}\nSize: {size}\nLocation Type: {location_type}\nDescription: {description}\nStatus: {status}\nImage Path: {image_path}\nAddress: {address}"
                     for proj_id, industry_id, publish_date, discipline, duration, size, location_type, title, industry, description, status, image_path, address in results])
                dispatcher.utter_message(text=f"Here are some projects from the database:\n{project_summaries}")
                logger.debug("Projects found and returned")
            else:
                dispatcher.utter_message(text="No matching projects found in the database.")
                logger.debug("No matching projects found")

        except psycopg2.Error as e:
            dispatcher.utter_message(text="An error occurred while fetching data from the database.")
            logger.error(f"Database error: {e}")

        return []

# Custom action for fallback prompt
class ActionFallbackPrompt(Action):
    def name(self) -> Text:
        return "action_fallback_prompt"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="Have you thought of a value proposition for the industry partner?")
        return []
