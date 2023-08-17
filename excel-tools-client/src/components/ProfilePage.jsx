import { useContext } from "react"
import {AuthContext} from '../components/auth/AuthProvider'
import { useNavigate } from "react-router-dom";


export default function ProfilePage() {
    const {logoutSuccess} = useContext(AuthContext)
    const navigate = useNavigate();
 

    const handleTryTool = () => {
        // Open the tool page in a new tab or window
        navigate('/tool'); // Replace '/tool' with the actual route for your tool page
    }

    return (
        <div className="container">
            <h2>Profile Page</h2>

            <p>Can only see if logged in</p>

            <button className="btn btn-danger" onClick={logoutSuccess}>Logout</button>
            <button className="btn btn-excel-tool" onClick={handleTryTool}>Try our tool</button>
        </div>
    )
}