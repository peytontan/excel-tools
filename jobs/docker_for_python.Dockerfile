FROM python:3.8

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the script into the container
COPY combine_excel_files.py .

# Specify the command to run your script
CMD ["python", "main.py"]
