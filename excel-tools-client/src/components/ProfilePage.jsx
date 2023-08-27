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

            <button className="px-4 py-1 text-sm text-blue-600 font-semibold rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2" onClick={logoutSuccess}>Logout</button>
            <button className="px-4 py-1 text-sm text-blue-600 font-semibold rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2" onClick={handleTryTool}>Try our tool</button>
        </div>
    )
}