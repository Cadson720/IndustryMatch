FROM rasa/rasa-sdk:3.6.2

# Switch to root to install libraries
USER root

# Install system dependencies for psycopg2
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    python3-dev \
    postgresql-client \
    libpq-dev

# Install required Python libraries
RUN pip install requests
RUN pip install psycopg2

# Switch back to the default user
USER 1001
