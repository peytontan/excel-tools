import { useContext, useState } from "react";
import { AuthContext } from "../components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";


export default function FileUpload() {
  // const { logoutSuccess } = useContext(AuthContext);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [folderFile, setFolderFile] = useState(String(""));
  // const [fileName, setFileName] = useState(String(""));
  // const [response, setResponse] = useState();


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
    <div className="container mx-auto max-width:1280px">
      <p>Upload the excel files you would like to combine</p>

      {/* <div class="container mx-auto max-width:1280px"> */}
      <div class="mb-3">
      {/* <label
        for="formFileMultiple"
        class="mb-2 inline-block text-neutral-700 dark:text-neutral-200"
        >Multiple files input example</label
      > */}
      <input
        class="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-sky-600 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-700 dark:file:bg-blue-600 dark:file:text-neutral-100 dark:focus:border-primary"
        type="file"
        id="formFileMultiple"
        multiple onChange={handleFileChange}/>
    </div>
      
      {/* <input type="file" onChange={handleFileChange} multiple></input> */}
      
      <button className="px-4 py-1 text-sm text-blue-600 font-semibold rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2" onClick={handleFileUpload}>Upload</button>
      <h3>Selected Files to merge</h3>
      <ul>
        {selectedFiles.map((file,index)=> (<li key={index}>{file.name}</li>))}
      </ul>

      <button className="px-4 py-1 text-sm text-blue-600 font-semibold rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2" onClick ={()=>handleFileDownload(folderFile)}>Download Merged File</button>
    </div>
  );
}
