import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from typing import Any, Text, Dict, List
import logging
from rasa_sdk.events import SlotSet

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Custom action to search for projects via the AI search API
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

        # Log slot values for debugging
        logger.debug(f"Slots - Keywords: {keywords}, Discipline: {discipline}, Duration: {duration}, Size: {size}, Industry: {industry}, Location: {location}")

        # Build query parameters for the API call
        query_params = {
            'keywords': keywords,
            'discipline': discipline,
            'duration': duration,
            'size': size,
            'industry': industry,
            'location': location
        }

        logger.debug(f"Query parameters for API: {query_params}")

        # Make a GET request to the new project search route
        try:
            api_url = 'http://host.docker.internal:3000/api/project/search'
            response = requests.get(api_url, params=query_params)
            logger.debug(f"API Response status: {response.status_code}")

            if response.status_code == 200:
                projects = response.json()
                if projects:
                    # Format the output to display project details
                    project_summaries = "\n\n".join([
                        f"Project ID: {project['project_id']}\n"
                        f"Title: {project['title']}\n"
                        f"Discipline: {project['discipline']}\n"
                        f"Industry: {project['industry']}\n"
                        f"Publish Date: {project['publish_date']}\n"
                        f"Duration: {project['duration']}\n"
                        f"Size: {project['size']}\n"
                        f"Location Type: {project['location_type']}\n"
                        f"Description: {project['description']}\n"
                        f"Address: {project['address']}\n"
                        f"Status: {project['status']}"
                        for project in projects
                    ])
                    dispatcher.utter_message(text=f"Here are some matching projects:\n{project_summaries}")

                    # Return events to update slots with new values
                    return [
                        SlotSet("keywords", keywords),
                        SlotSet("discipline", discipline),
                        SlotSet("duration", duration),
                        SlotSet("size", size),
                        SlotSet("industry", industry),
                        SlotSet("location", location)
                    ]
                else:
                    dispatcher.utter_message(text="No matching projects found based on your search criteria.")
            else:
                dispatcher.utter_message(text="Error fetching data from the API.")
                logger.error(f"API Error: {response.status_code}, {response.text}")

        except requests.RequestException as e:
            dispatcher.utter_message(text="An error occurred while accessing the project search API.")
            logger.error(f"API error: {e}")

        return []

# Custom action for fallback prompt
class ActionFallbackPrompt(Action):
    def name(self) -> Text:
        return "action_fallback_prompt"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="Have you thought of a value proposition for the industry partner?")
        return []
