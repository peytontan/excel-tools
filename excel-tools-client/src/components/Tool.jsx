import { useContext, useState } from "react";
import { AuthContext } from "../components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";


export default function FileUpload() {
  // const { logoutSuccess } = useContext(AuthContext);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [folderFile, setFolderFile] = useState(String(""));
  const [fileName, setFileName] = useState(String(""));
  const [response, setResponse] = useState();


  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
    // console.log("handlefilechange->",[...event.target.files])
  };

  const handleFileUpload = async () => {
    const formData = new FormData();

    for (const file of selectedFiles) {
      formData.append("data", file);
      // console.log("file of selectedfiles ->",file)
    }

    await axios.post("http://localhost:3000/api/tools/upload", formData, {
      headers: {
             "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${Cookies.get("userAuthToken")}`
            }
          })
          .then((response) => {
            setFolderFile(response['data']['folder'])
            alert("Files uploaded successfully");
            setSelectedFiles([]); // once it shows that files are uploaded, it should remove the selected files to merge so that it doesn't confuse the user
          })
          .catch((error) => {
            console.error("Error uploading files:", error);
          });
        };

  
        const handleFileDownload = async(folderpath) => {
          const pythonScript = await executePythonScript(folderpath)
      
          await axios.get(`http://localhost:3000/api/tools/mergedFile/${folderpath}`, {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${Cookies.get("userAuthToken")}`
                },
              responseType: 'arraybuffer'}) //we need to use arraybuffer 
              .then((response) => {
                // Create a Blob from the response data
                // blob = binary large object -> often used for handling files 
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                
                // Create a temporary URL for the blob -> blob is to bridge the gap between binary data and browser interacts 
                const blobUrl = URL.createObjectURL(blob);
            
                // Create a link element and simulate a click to trigger download
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = 'Merged File.xlsx'; // Set the desired filename
                link.click();
            
                // Clean up the temporary URL -> to prevent memory leak
                URL.revokeObjectURL(blobUrl)
              })
                .catch((error) => {
                  console.error(error)
                });
                  }

  const executePythonScript = async() => {
    const response = await axios.post("https://asia-southeast1-seif-project-4-excel.cloudfunctions.net/merge_excel_files",
    {folderFile:folderFile}, 
      {headers:{
        Authorization: `Bearer ${Cookies.get("userAuthToken")}`,
      },
    }
    ).then((response) => {
      console.log(response.data)
    })
      .catch((error) => {
        console.error(error)
      });
        } 

  console.log(folderFile)


  return (
    <div className="container">
      <h2>Upload Excel</h2>
      <p>Upload the excel files you would like to combine</p>
      <input type="file" onChange={handleFileChange} multiple></input>
      
      <button onClick={handleFileUpload}>Upload</button>
      <h3>Selected Files to merge</h3>
      <ul>
        {selectedFiles.map((file,index)=> (<li key={index}>{file.name}</li>))}
      </ul>

      <button onClick ={()=>handleFileDownload(folderFile)}>Download Merged File</button>
    </div>
  );
}
