import React, { useState } from "react";
import '../css/login.css';
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router-dom";
var Loader = require('react-loader');

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loaded, setLoaded] = useState(true);
  function checkUser(e) {
    setLoaded(false);
    axios({
      method: 'post',
      url: "https://vxt9613.uta.cloud/Lunamar-Management/php/login.php",
      headers: {
        'content-type': 'application/json'
      },
      data: { email: email, password: password }
    })
      .then(result => {

        if (result.data === 'wrong password') {
          alert("Please check username and password. If you are a manager your account might be inactive.")
          setLoaded(true);
        }
        else {
          window.sessionStorage.setItem("userDetails", JSON.stringify(result.data[0]));
          let path = result.data[0].role;
          history.push('/' + path);
        }
      })
      .catch(error => { alert("Please check username and password"); setLoaded(true); }

      );
    e.preventDefault();
  }
  return (
    <>
      <Navbar></Navbar>
      <div className="login-div">
        <div className="signin-box">
          <div className="signin-title">Sign in</div>
          <form onSubmit={checkUser}>
            <div className="pad-top">
              <input
                type="email"
                placeholder="Email"
                name="email"
                id="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="pad-top">
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="pad-top">
              <input type="submit" value="Sign in" name="sign-in" id="sign-in" />
              <Loader loaded={loaded}>
              </Loader>
            </div>
          </form>

          <div className="pad-top align-center">
            <Link to="/forgotPassword" className="forgot-link">Forgot your password?</Link>
          </div>

          <div className="align-center login-register-div">
            <span>Don't have an account? </span>
            <Link to="/signup" className="register-link">Register</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login;
