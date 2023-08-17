import axios from "axios"
import { useState } from "react"
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();

    // create state to store form data
    const [formData, setFormData] = useState({})

    const handleFormChange = (e, fieldName) => {
        console.log(e.target.value)
        setFormData({...formData, [fieldName]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        axios.post('http://localhost:3000/api/users/register', formData)
            .then(response => {
                navigate('/login')
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className="container">
            <h2>Register</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" onChange={ (e) => { handleFormChange(e, 'name') } } />
                </div>
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