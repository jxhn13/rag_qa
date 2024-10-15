import React, { useState } from "react";
import './LoginSignUpForm.css'
import { FaUser,FaLock } from "react-icons/fa";
import ButtonTab from "./ButtonTab";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'


function LoginForm()
{
    const[action,setAction] = useState("Login")

    const[message, setMessage] = useState("")

    const[username, setUsername] = useState("")

    const[email, setEmail] = useState("")

    const[password,SetPassword] = useState("")

    const navigate = useNavigate()

    const handleSubmit = async () => {


        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasDigit = /[0-9]/.test(password);

        if (password.length < minLength) {
            alert("Password must be at least 8 characters long.");
            return; 
        }
        if (!hasUpperCase) {
            alert("Password must contain at least one uppercase letter.");
            return; 
        }
        if (!hasLowerCase) {
            alert("Password must contain at least one lowercase letter.");
            return; 
        }
        if (!hasDigit) {
            alert("Password must contain at least one digit.");
            return; 
        }


        
        try {
            let response;
            
            if (action === "Login") {
                response = await axios.post('http://127.0.0.1:5001/login', {
                    username: username,
                    password: password
                });
                console.log("Login response:", response.data); 
    
                if (response.data.success) {
                    navigate('/homepage', { state: { username } }); 
                } else {
                    setMessage(response.data.message);
                }
            } else {
                response = await axios.post('http://127.0.0.1:5001/signup', {
                    username: username,
                    password: password,
                    email: email
                });
                
                setMessage(response.data.message);
            }
        } catch (error) {
            console.error("Login error:", error); 
            setMessage("An error occurred. Please try again.");
        }
    };
    

    return(
        <div className="wrapper">
            <form>
            <h1>{action}</h1>

            {action === "Login" ? <div></div> : <div className="input-box">
                <input type="email" 
                placeholder="EMAIL-ID"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required/>
                <FaUser className="icon" />
                </div> }



            

            <div className="input-box">
                <input type="text"
                 placeholder="NAME"
                 value={username}
                 onChange={(e) => setUsername(e.target.value)} 
                 required/>
                <FaUser className="icon" />
            </div> 

            <div className="input-box">
                <input type="password" 
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => SetPassword(e.target.value)} 
                required/>
                <FaLock className="icon"/>
            </div>
                
                <div className="buttons">
                    <div className={action === "Login" ? "submit gray" : "submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
                    <div className={action === "Sign Up" ? "submit gray": "submit"} onClick={()=>{setAction("Login")}}>Login</div>
                </div> 

                <ButtonTab onSubmit={handleSubmit} />
                <p>{message}</p>
            
            </form>
            
        </div>
    )
}

export default LoginForm;