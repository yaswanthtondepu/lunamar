import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../css/check-inquiries-manager.css";
import { Link } from "react-router-dom";
import axios from "axios";

const CheckInquiriesManager = () => {
  let currentUser;
  if (window.sessionStorage.getItem("userDetails")) {
    currentUser = JSON.parse(window.sessionStorage.getItem("userDetails"));
  }
  let currentRole;
  if (currentUser) {
    currentRole = currentUser.role
  }
  else {
    currentRole = null;
  }
  useEffect(() => {
    getInquiries();
  }, [])
  const [inquiriesList, setInquiriesList] = useState([]);
  async function getInquiries() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getInquiries.php'
    }

    let res = await axios(config)
    setInquiriesList(res.data);
  }
  function changeInquiryStatus(inquiryId) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/changeInquiryStatus.php',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        inquiryId: inquiryId, userId: currentUser.userId
      }
    })
      .then(result => {

        if (result.data === "success") {
          alert("Status of the inquiry is changed successfully.");
          getInquiries();
        }
        else {
          alert("Something went wrong.");
        }
      })
      .catch(error => console.log(error));
  }
  return (
    currentRole === "Admin" || currentRole === "Manager" ?
      <>
        <Navbar />
        <div className="main-div">
          <div className="main-title">Check Inquiries</div>
          <div className="cim-content">
            <div className="table-div">
              <table className="styled-table" id="inquiry-table">
                <thead>
                  <tr>
                    <td>First Name</td>
                    <td>Last Name</td>
                    <td>Phone Number</td>
                    <td>Email</td>
                    <td>Comments</td>
                    <td>Actions</td>
                  </tr>
                </thead>
                <tbody>
                  {inquiriesList.length > 0 ? inquiriesList.map(i =>
                    <tr>
                      <td>{i.firstName}</td>
                      <td>{i.lastName}</td>
                      <td>{i.phoneNumber}</td>
                      <td>{i.email}</td>
                      <td>{i.comment}</td>
                      <td>
                        <div className="btn-div" onClick={() => changeInquiryStatus(i.id)}>
                          <a href={"mailto:" + i.email} className="btn send-email">Reply</a>
                        </div>
                      </td>
                    </tr>
                  ) : <tr><td colSpan={6}>You are all caught up!</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
      :
      <>
        <div style={{ marginTop: "200px" }}>

          You are not authorised to access this page. Please
          <Link to="/login" style={{ color: "red" }}> login </Link> with admin or Manager account to view this page.
        </div>

      </>
  )
}

export default CheckInquiriesManager;