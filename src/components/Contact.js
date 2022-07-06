import React, { useState } from "react";
import '../css/contact.css';
import Navbar from "./Navbar";
import axios from 'axios';
const Contact = () => {
  const [phoneNum, setPhoneNum] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  let API_PATH = "https://vxt9613.uta.cloud/Lunamar-Management/php/contact-email.php";
  function phoneSet(e) {
    if (e.target.value.length > 10) {
      e.target.value = e.target.value.slice(0, 10);
    }
    setPhoneNum(e.target.value);
  }
  function validateForm(e) {
    if (phoneNum.length == 0 || phoneNum.length == 10) {
      axios({
        method: 'post',
        url: API_PATH,
        headers: {
          'content-type': 'application/json'
        },
        data: { firstName: firstName, lastName: lastName, phoneNumber: phoneNum, email: email, query: query }
      })
        .then(result => {
          alert('Your details were sent successfully!');
          clearValues();

        })
        .catch(error => this.setState({
          error: error.message
        }));
      e.preventDefault();
    } else {
      alert("Please check the phone number!")
      e.preventDefault();
    }
  }
  function clearValues() {
    setFirstName(''); setLastName(''); setEmail(''); setPhoneNum(''); setQuery('');
  }
  return (
    <>
      <Navbar></Navbar>
      <div className="contact-us">
        <div className="contact-title">Contact us</div>
        <div className="pad-top align-center contact-content-div">
          <div className="pad-top-2">
            <form method="post" id="contact-form" onSubmit={validateForm}>
              <div className="contact-form-div">
                <div className="left-div">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    required
                    autoComplete="nope"
                    id="firstName"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />
                </div>
                <div>
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
              </div>
              <div className="contact-form-div second-row">
                <div className="left-div">
                  <input
                    name="phoneNumber"
                    placeholder="Phone Number(optional)"
                    type="number"
                    maxLength="10"
                    autoComplete="nope"
                    value={phoneNum}
                    onChange={phoneSet}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    autoComplete="nope"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="pad-top-2">
                <textarea
                  name="query"
                  placeholder="Enter your comments"
                  required
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                ></textarea>
              </div>

              <div className="pad-top-2">
                <input type="submit" className="submit-btn" value="Submit" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact;