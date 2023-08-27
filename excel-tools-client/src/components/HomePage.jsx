import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/auth/AuthProvider";
import Cookies from "js-cookie";

export default function Login() {
  const navigate = useNavigate();
  const { loginSuccess } = useContext(AuthContext);

  const [excelFiles, setExcelFiles] = useState([]);

  // To get excel files that were uploaded every time it refreshes
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/tools/files", {
        headers: { Authorization: `Bearer ${Cookies.get("userAuthToken")}` },
      })
      .then((res) => {
        setExcelFiles(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDelete = async (assetId) => {
    await axios
      .delete(`http://localhost:3000/api/tools/deleteFile/${assetId}`, {
        headers: { Authorization: `Bearer ${Cookies.get("userAuthToken")}` },
      }).then((res)=>{
        console.log(res);
        // setExcelFiles((excelFile) =>
        // excelFile.filter((file) => file.filePublicId !== assetId))
      }).catch((error) => {
        console.error("Error deleting file:", error);
      });
  };

  const handleRawFileDownload = async (publicId,fileName) => {
    await axios
      .get(`http://localhost:3000/api/tools/rawFile/${publicId}`, {
        headers: { Authorization: `Bearer ${Cookies.get("userAuthToken")}` },
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
          link.download = `${fileName}`; // Set the desired filename
          link.click();
      
          // Clean up the temporary URL -> to prevent memory leak
          URL.revokeObjectURL(blobUrl)
        })
          .catch((error) => {
            console.error(error)
            alert("Raw File Not Found")
          });
            };

  const handleMergedFileDownload = async(folderpath) => {

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
            alert("Requested File Not Found")
          });
            }

  const executePythonScript = async(folder) => {
    const response = await axios.post("https://asia-southeast1-seif-project-4-excel.cloudfunctions.net/merge_excel_files",
    {folderFile:folder}, 
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


  return (
    <div class="flex flex-col">
    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
        <div class="overflow-hidden">
          <table class="min-w-full text-left text-sm font-light">
            <thead class="font-medium dark:border-neutral-500">
            {/* <thead class="border-b font-medium dark:border-neutral-500"> */}
              <tr>
                <th scope="col" class="py-4 text-center justify-evenly">File Name</th>
                <th scope="col" class="py-4 text-center justify-evenly">Created At</th>
                <th scope="col" class="py-4 text-center justify-evenly">Session Id</th>
                <th scope="col" class="py-4 text-center justify-evenly">Action</th>
              </tr>
            </thead>
            <tbody>
            {excelFiles.map((file, index) => (
          <tr class="transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-blue-200" key={index}>
          {/* <tr class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-zinc-300" key={index}> */}
            <td class="whitespace-nowrap px-10 py-3 justify-evenly">{file.fileName}</td>
            <td class="whitespace-nowrap px-10 py-3 justify-evenly">{new Date(new Date(file.createdAt).toISOString()).toLocaleString("en-GB")}</td>
            <td class="whitespace-nowrap px-10 py-3 justify-evenly">{file.folderPath.split('/')[1]}</td>
            <td>
              <button className="justify-evenly px-10 py-1 text-sm text-blue-600 font-semibold rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2" onClick={()=>handleDelete(encodeURIComponent(file.filePublicId))}>Delete File</button>

              <button className="justify-evenly px-10 py-1 text-sm text-blue-600 font-semibold rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2" onClick={()=>handleRawFileDownload(encodeURIComponent(file.filePublicId),file.fileName)}>Download Raw File</button>
              
              <button className="justify-evenly px-10 py-1 text-sm text-blue-600 font-semibold rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2" onClick={()=>handleMergedFileDownload(file.folderPath.split('/')[1])}>Download Merged File</button>
              {/* need to use encodeURIComponent or else we will be seeing / in the params instead of %2F */}
              
              <button className="justify-evenly px-10 py-1 text-sm text-blue-600 font-semibold rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2" onClick={()=>executePythonScript(file.folderPath.split('/')[1])}>Regenerate Merged File</button>
            </td>
          </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
}
