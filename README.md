# How to use
User will need to register for an account before being able to merge excel files.
Once registered, user will be able to merge excel files in the Merging Tool section. 

# Features
Files uploaded to merge are denoted by Session Ids. This will allow users to know which files are merged into 1 file. 

There are 4 buttons in the action column: 
1. Delete
2. Download Raw File
3. Download Merged File
4. Regenerate Merged File

![Alt text](image-1.png)


If user has deleted a file from the dashboard for a particular session, user can click on the fourth button to renegerate merged file. Once its done, user can click on the 3rd download button to retrieve the latest file. 

Raw and Merged Files are uploaded to cloudinary.

Merged Files are generated via a python script located in jobs' folder. Python script is deployed on google cloud's function. 