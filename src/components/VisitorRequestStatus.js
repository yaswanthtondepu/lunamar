import React, { useState, useEffect } from "react";
import '../css/visitor-request-status.css';
import Navbar from "./Navbar";
import axios from "axios";
import formatDateWithoutTime from "../formatDateWithoutTime";
import { Link } from "react-router-dom";
import formatDate from "../formatDate";
const VisitorRequestStatus = () => {
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
    getVisitList();
  }, []);
  const [visitList, setVisitList] = useState([]);
  function getVisitList() {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getVisitListVisitor.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { visitorId: currentUser.userId }
    })
      .then(result => {
        setVisitList(result.data);
      })
      .catch(error => console.log(error));
  }
  return (
    currentRole === "Visitor" ?
      <>
        <Navbar />
        <div className="visitor">
          <div className="visitor-title">Past/Upcoming visits</div>
          <div className="status-div">
            <div style={{ textAlign: 'left' }}>Status of Request</div>
            <div className="table-div">
              <table className="styled-table" id="status-table">
                <thead>
                  <tr>
                    <th>Building</th>
                    <th>Apartment</th>
                    <th>In Date</th>
                    <th>Out Date</th>
                    <th>Status</th>
                    <th>In Time</th>
                    <th>Out Time</th>
                  </tr>
                </thead>
                <tbody>
                  {visitList.length > 0 ? visitList.map(i =>
                    <tr>
                      <td>{i.buildingName}</td>
                      <td>{i.apartmentNumber}</td>
                      <th>{formatDateWithoutTime(i.dateIn)}</th>
                      <th>{formatDateWithoutTime(i.dateOut)}</th>
                      <th>{i.status}</th>
                      <th>{i.allowedInTime ? formatDate(i.allowedInTime) : "-"}</th>
                      <th>{i.outTime ? formatDate(i.outTime) : "-"}</th>
                    </tr>
                  )
                    : <tr><td colSpan={5}>Relax.You don't have any past or upcoming visits</td></tr>}
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
          <Link to="/login" style={{ color: "red" }}> login </Link> with visitor role to view this page.
        </div>

      </>
  )
}

export default VisitorRequestStatus;