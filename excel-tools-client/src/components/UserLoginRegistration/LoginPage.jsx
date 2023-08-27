import axios from "axios"
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom";
import {AuthContext} from '../auth/AuthProvider'
// import "./LoginPage.css"


export default function Login() {
    const navigate = useNavigate();
    const {loginSuccess} = useContext(AuthContext)

    // create state to store form data
    const [formData, setFormData] = useState({})

    const handleFormChange = (e, fieldName) => {
        console.log(e.target.value)
        setFormData({...formData, [fieldName]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3000/api/users/login', formData)
            .then(response => {
                loginSuccess(response.data.token)
                navigate('/profile')
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className="container mx-auto max-width:1280px">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                    <input type="email"  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" id="email" name="email" onChange={ (e) => { handleFormChange(e, 'email') } } />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                    <input type="password"  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" id="password" name="password" onChange={ (e) => { handleFormChange(e, 'password') } } />
                </div>
                <button type="submit" className="px-4 py-1 text-sm text-blue-600 font-semibold rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2">Login</button>
                <button className="px-4 py-1 text-sm text-blue-600 font-semibold rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2" onClick={()=>{navigate("/register")}}>Register</button>
            </form>
        </div>
    )
}