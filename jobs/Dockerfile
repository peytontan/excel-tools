FROM python:3.10.10

# Allow statements and log messages to immediately appear in the logs
ENV PYTHONUNBUFFERED True

# Set the working directory
# WORKDIR /app

# ENV PORT 3000
ENV HOST 0.0.0.0

# Copy the requirements file
COPY requirements.txt .
COPY .env .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the script into the container
COPY main.py .

# Specify the command to run your script
CMD ["python", "main.py"]
