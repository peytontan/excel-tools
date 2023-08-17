import { useContext, useState } from "react";
import { AuthContext } from "../components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";


export default function FileUpload() {
  // const { logoutSuccess } = useContext(AuthContext);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
    console.log("handlefilechange->",[...event.target.files])
  };

  const handleFileUpload = async () => {
    const formData = new FormData();

    for (const file of selectedFiles) {
      formData.append("data", file);
      console.log("file of selectedfiles ->",file)
    }

    try {
      await axios.post("http://localhost:3000/api/tools/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("userAuthToken")}`
        }
      });
      alert("Files uploaded successfully");
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="container">
      <h2>Merging Excel</h2>
      <p>Upload the excel files you would like to combine</p>
      <input type="file" onChange={handleFileChange} multiple></input>
      
      <button onClick={handleFileUpload}>Upload</button>
      <h3>Selected Files to merge</h3>
      <ul>
        {selectedFiles.map((file,index)=> (<li key={index}>{file.name}</li>))}
      </ul>
    </div>
  );
}
