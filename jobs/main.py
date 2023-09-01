import pandas as pd
import os
import cloudinary
import cloudinary.uploader
import cloudinary.api
import xlrd
import openpyxl
from dotenv import load_dotenv
import requests
from io import BytesIO
from flask import jsonify
import functions_framework
import flask


@functions_framework.http
def cors_enabled_function(request):
    # For more information about CORS and CORS preflight requests, see:
    # https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request

    # Set CORS headers for the preflight request
    if request.method == "OPTIONS":
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for 3600s
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Max-Age": "3600",
            # "Access-Control-Allow-Credentials": "true",  # Allow credentials

        }

        return ("", 204, headers)

    # Set CORS headers for the main request
    headers = {"Access-Control-Allow-Origin": "*",
                # "Access-Control-Allow-Credentials": "true",  # Allow credentials
}

    return ("Hello World!", 200, headers)

def merge_excel_files(request:flask.Request):
    try: 
        request_json = request.get_json()
        folderFile = request_json['folderFile']

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

        subfolder_path = folderFile
        print("subfolder path",subfolder_path)
        # print("getting request.args",request.args)

        file_links = []
        print("these are the current file links",file_links)

        # Get all the files from cloudinary if the resource type is raw
        retrieve_files_in_cloudinary = cloudinary.api.resources(type="upload",resource_type="raw",prefix=f'excels/{subfolder_path}/tmp')

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
            for sheet_name, df in df_dict.items():# .items() will return key-value pairs of the dictionary as tuples in a list.
                # print("sheet name ->", sheet_name,"\n\n\n","df: ",df,'\n')
                if sheet_name in combined_data: 
                    # Combine data for sheets with the same name
                    combined_data[sheet_name] = pd.concat([combined_data[sheet_name], df], ignore_index=True)
                else:
                    # Sheet doesn't exist in combined_data yet
                    combined_data[sheet_name] = df

        output_file_buffer = BytesIO()
        with pd.ExcelWriter(output_file_buffer, engine='openpyxl') as writer:
            for sheet_name, df_combined in combined_data.items():
                df_combined.to_excel(writer, sheet_name=sheet_name, index=False)
        
        # Check if there is an existing merged file, if there is delete it so that user can retrieve the latest merged file
        stream_files_in_cloudinary = cloudinary.api.resources(type="upload",resource_type="raw",prefix=f'excels/{subfolder_path}/stream')
        for resource in stream_files_in_cloudinary['resources']:
            if "stream" in resource['public_id']:
                image_delete_result = cloudinary.api.delete_resources(resource['public_id'], resource_type="raw", type="upload")
                print("exisiting merged file has been deleted",image_delete_result)
            else: 
                print ("no existing merged file found")

        # Upload the merged Excel file to Cloudinary 
        output_file_buffer.seek(0)
        upload_merge_file_cloudinary = cloudinary.uploader.upload(output_file_buffer, resource_type="raw",folder=f"excels/{subfolder_path}",use_filename=True)

        print("Combined Excel file created successfully.")

        print("Merged Excel file uploaded to Cloudinary:", upload_merge_file_cloudinary['secure_url']) 

        return ("Sucessfully merged",200)
    except Exception as e:
        print("error occurred lol")
        return str(e)
    
# Main entry point for google cloud function
@functions_framework.http
def main(request):
    if request.method == "OPTIONS":
        return cors_enabled_function(request)
    elif request.method == "POST":
        return merge_excel_files(request)
    else:
        return ("Method not allowed", 405)

if __name__ == "__main__":
    functions_framework.http.serve(main)
