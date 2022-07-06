import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import '../css/login.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const btnStyle = {
        padding: "0.5rem 2rem",
        color: "white",
        backgroundColor: "#47525e",
        fontSize: "16px",
        cursor: "pointer",
        borderRadius: "5px"
    };
    function checkUser(e) {
        e.preventDefault();
    }
    return (
        <>
            <Navbar />
            <div className="login-div">
                <div className="signin-box">
                    <div >Forgot Password</div>
                    <form onSubmit={checkUser}>
                        <div className="pad-top">
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                id="email"
                                required
                                value={email}
                                autoComplete="nope"
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="pad-top">
                            <button type="submit" style={btnStyle}>
                                Submit
                            </button>
                        </div>
                    </form>

                    <div className="pad-top align-center">
                        <Link to="/login" className="forgot-link" style={{ fontSize: "17px" }} > Back to login</Link>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ForgotPassword;