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
          });
            };


  return (
    <div>
      <h1>Uploaded Excels</h1>
      <ul>
        <th>File Name</th>
        <th>Date Uploaded</th>
        {excelFiles.map((file, index) => (
          <tr key={index}>
            <td>{file.fileName}</td>
            <td>{new Date(file.createdAt).toLocaleDateString()}</td>
            <td>
              <button onClick={()=>handleDelete(encodeURIComponent(file.filePublicId))}>Delete</button>
              <button onClick={()=>handleRawFileDownload(encodeURIComponent(file.filePublicId),file.fileName)}>Download</button>
              {/* need to use encodeURIComponent or else we will be seeing / in the params instead of %2F */}
            </td>
          </tr>
        ))}
      </ul>
    </div>
  );
}
