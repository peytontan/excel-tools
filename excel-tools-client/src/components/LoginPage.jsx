import axios from "axios"
import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom";
import {AuthContext} from '../components/auth/AuthProvider'

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
        <div className="container">
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" onChange={ (e) => { handleFormChange(e, 'email') } } />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" onChange={ (e) => { handleFormChange(e, 'password') } } />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}