import pandas as pd
import os
import cloudinary
import cloudinary.uploader
import cloudinary.api
import xlrd
import openpyxl
from dotenv import load_dotenv
import requests

load_dotenv() #to load environment variables from the .env file

CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY')
CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET')
CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')

cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET,
)

# To change subfolder path
subfolder_path="1692516168415" 


file_links = []

# Get all the files from cloudinary if the resource type is raw
retrieve_files_in_cloudinary = cloudinary.api.resources(type="upload",resource_type="raw",prefix=f'excels/{subfolder_path}')

# Get all the secure URL links and append them into file_links so that we can use the files 
for resource in retrieve_files_in_cloudinary['resources']:
    file_links.append(resource["secure_url"])

# Initialize an empty dictionary to store the combined data
combined_data = {}

# Iterate through each ExcelFile object
for excel_file in file_links:
    # For every link in file_links, convert the file into an excel file
    get_file = pd.ExcelFile(requests.get(excel_file).content)
    # Create df_dict for each Excel file in the folder
    df_dict = pd.read_excel(get_file, sheet_name=None)

    # Iterate through sheets in the current ExcelFile
    for sheet_name, df in df_dict.items():# .items() will return a key-value pairs of the dictionary as tuples in a list.
        # print("sheet name ->", sheet_name,"\n\n\n","df: ",df,'\n')
        if sheet_name in combined_data: 
            # Combine data for sheets with the same name
            combined_data[sheet_name] = pd.concat([combined_data[sheet_name], df], ignore_index=True)
        else:
            # Sheet doesn't exist in combined_data yet
            combined_data[sheet_name] = df

# Write combined data to a new Excel file
output_file_path = "Merged Excel File.xlsx"
with pd.ExcelWriter(output_file_path) as writer:
    for sheet_name, df_combined in combined_data.items():
        df_combined.to_excel(writer, sheet_name=sheet_name, index=False)

print("Combined Excel file created successfully.")

# Upload the merged Excel file to Cloudinary
upload_merge_file_cloudinary = cloudinary.uploader.upload(output_file_path, resource_type="raw",folder=f"excels/{subfolder_path}",use_filename=True)

print("Merged Excel file uploaded to Cloudinary:", upload_merge_file_cloudinary['secure_url'])
