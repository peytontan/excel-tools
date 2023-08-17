import pandas as pd
import os
import xlrd
import openpyxl

folder="/Volumes/Extreme SSD/testing excel/"
os.chdir(folder)
files=os.listdir(folder)

files_xlsx_format = [f for f in files if ((f[-5:] == '.xlsx') and (f[:2] != "._"))] #this is to not select mac's ._ metafiles

# List of ExcelFile objects
excel_files = [pd.ExcelFile(os.path.join(folder, name)) for name in files_xlsx_format]

# Initialize an empty dictionary to store the combined data
combined_data = {}

# Iterate through each ExcelFile object
for excel_file in excel_files:
    # Create df_dict for each Excel file in the folder
    df_dict = pd.read_excel(excel_file, sheet_name=None)

    # Iterate through sheets in the current ExcelFile
    for sheet_name, df in df_dict.items():#.items() will return a key-value pairs of the dictionary as tuples in a list.
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