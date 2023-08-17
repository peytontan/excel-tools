import axios from "axios"
import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import {AuthContext} from '../components/auth/AuthProvider'
import Cookies from "js-cookie";

export default function Login() {
    const navigate = useNavigate();
    const {loginSuccess} = useContext(AuthContext)

    const [excelFiles, setExcelFiles] = useState([]);
    const [deletedFile, setDeletedFile] = useState(null); // State to track the file to be deleted


    // To get excel files that were uploaded every time it refreshes
    useEffect(() => {
        axios
        .get("http://localhost:3000/api/tools/files", {
            headers: { Authorization: `Bearer ${Cookies.get("userAuthToken")}` },
        })
        .then((res) => {
            // console.info(">>> get trips res: ", res);
            setExcelFiles(res.data);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    const handleDelete = async () => {
        if (deletedFile) {
          try {
            await axios.delete(
              "http://localhost:3000/api/tools/deleteFile",
              {
                data: { file: deletedFile }, // Send the file name or public ID to delete
                headers: { Authorization: `Bearer ${Cookies.get("userAuthToken")}` },
              }
            );
            console.log("File deleted successfully");
            setDeletedFile(null); // Reset deletedFile state after successful deletion
          } catch (error) {
            console.error("Error deleting file:", error);
          }
        }
      };
 

    return (
        <div>
            <h1>Merged Excels</h1>
            <ul>
            {excelFiles.map((file,index)=>
                (<li key={index}>
                    {file.name}
                    <button onClick={() => setDeletedFile(file.name)}>Delete</button>
                  </li>)
            )}
            </ul>
            <button onClick={handleDelete}>Delete Selected File</button>

        </div>
    )
}