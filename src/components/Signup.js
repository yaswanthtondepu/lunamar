import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../css/signup.css';
import Navbar from "./Navbar";
import axios from "axios";
import { useHistory } from "react-router-dom";
var Loader = require('react-loader');
const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPassword, setSelectedPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [loaded, setLoaded] = useState(true);
  const history = useHistory();
  useEffect(() => {
    getUser();
  }, []);
  async function getUser() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getRoles.php'
    }

    let res = await axios(config)
    console.log(res.data);
    setRoles(res.data);
  }
  function checkRole(e) {
    setSelectedRole(e.target.value)
    if (e.target.value === "Manager") {
      document.getElementById("manager-warning").style.visibility = "visible";
    }
    else {
      document.getElementById("manager-warning").style.visibility = "hidden";
    }
  }
  function validateForm(e) {
    setLoaded(false);
    let password = document.forms["signup"]["password"].value;
    let phone = document.forms["signup"]["phoneNumber"].value;
    let reTypePassword = document.forms["signup"]["retypePassword"].value;
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (phone.length !== 10) {
      alert("Please check the phone number");
      e.preventDefault();
      setLoaded(true);
      return false;
    }
    else if (!password.match(passwordRegex)) {
      alert("Password must be between 8-15 characters long, contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character")
      e.preventDefault();
      setLoaded(true);
      return false;
    }
    else if (reTypePassword !== password) {
      alert("Passwords do not match. Try again!")
      e.preventDefault();
      setLoaded(true);
      return false;
    }
    else {
      axios({
        method: 'post',
        url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/signup.php',
        headers: {
          'content-type': 'application/json'
        },
        data: { firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, email: email, password: selectedPassword, role: selectedRole }
      })
        .then(result => {
          if (result.data.sent === 1) {
            setLoaded(true);
            alert('Signup success. You will be redirected to login page');
            setTimeout(() => {
              history.push("/login")
            }, 500)
          }
          else {

            setLoaded(true);
            alert('Email already exists. please try another one or login');
          }
        })
        .catch(error => console.log(error));
      e.preventDefault();
    }
  }

  function showInfo() {
    document.getElementById('password-warning').style.display = 'block';
  }

  function hideInfo() {
    document.getElementById('password-warning').style.display = 'none';
  }

  function checkPasswords() {
    let password = document.forms["signup"]["password"].value;
    let reTypePassword = document.forms["signup"]["retypePassword"].value;
    if (reTypePassword !== password) {
      document.getElementById('retype-password-warning').style.display = 'block';
      document.getElementById('retype-password-warning').innerHTML = 'Passwords do not match';
      document.getElementById('retype-password-warning').style.color = 'red';
    }
    else {
      document.getElementById('retype-password-warning').innerHTML = 'Passwords matched. Please proceed';
      document.getElementById('retype-password-warning').style.color = 'green';
      setTimeout(function () { document.getElementById('retype-password-warning').style.display = 'none'; }, 1000)
      //document.getElementById('retype-password-warning').style.display = 'none';
    }
  }
  function phoneSet(e) {
    if (e.target.value.length > 10) {
      e.target.value = e.target.value.slice(0, 10);
    }
    setPhoneNumber(e.target.value);
  }
  return (
    <>
      <Navbar></Navbar>
      <div className="register-div">
        <div className="register-box">
          <div className="register-title">Register</div>
          <form name="signup" action="#" onSubmit={validateForm}>
            <div className="clearfix flex">
              <div className="left-container">
                <div className="pad-top">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    required
                    autoComplete="nope"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />
                </div>
                <div className="pad-top">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    required
                    autoComplete="nope"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                  />
                </div>
                <div className="pad-top">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    autoComplete="nope"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="pad-top">
                  <input
                    name="phoneNumber"
                    placeholder="Phone Number"
                    type="number"
                    minLength="10"
                    maxLength="10"
                    required
                    autoComplete="nope"
                    value={phoneNumber}
                    onChange={phoneSet}
                  />
                </div>
              </div>
              <div>
                <div className="pad-top">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    onFocus={showInfo}
                    onBlur={hideInfo}
                    value={selectedPassword}
                    onChange={e => setSelectedPassword(e.target.value)}
                  />
                  <div className="pad-top warning-text" id="password-warning">
                    Password must be between 8-15 characters long, contain at
                    least one lowercase letter, one uppercase letter, one numeric
                    digit, and one special character
                  </div>
                </div>
                <div className="pad-top">
                  <input
                    type="password"
                    name="retypePassword"
                    placeholder="Re-type Password"
                    required
                    onKeyUp={checkPasswords}
                  />
                  <div className="pad-top warning-text" id="retype-password-warning">
                    Passwords do not match
                  </div>
                </div>
                <div className="pad-top">
                  {/* <label for="roles" style="font-size: 18px;">Role:</label> */}
                  <select
                    name="roles"
                    id="roles"
                    title="select role"
                    required
                    defaultValue
                    onChange={checkRole}
                    style={{ width: "274px", outline: "none" }}
                  >
                    <option disabled value>
                      -- Role you are applying for? --
                    </option>
                    {roles.map(i => <option value={i.roleName}>{i.roleName}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="pad-top-2 align-center">
              <input type="submit" value="Register" />
              <Loader loaded={loaded}>
              </Loader>
            </div>
          </form>
          <div className="align-center pad-top">
            <Link to="login" className="login-link">Back to login</Link>
          </div>
          <div className="pad-top warning-text" id="manager-warning">
            Note: If you are applying for "Manager" Role, you'll have to wait for
            an Admin to approve your request before logging in.
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup;