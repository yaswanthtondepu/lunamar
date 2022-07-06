import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import '../css/manage-visitors-manager.css';
import axios from "axios";
import formatDateWithoutTime from "../formatDateWithoutTime";
import { Link } from "react-router-dom";
const ManageVisitorsManager = () => {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  today = yyyy + "-" + mm + "-" + dd;
  let formatedToday = mm + "/" + dd + "/" + yyyy;
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
  let statusMeta = [
    { name: 'Approved' },
    { name: 'Rejected' },
    { name: 'Pending' },
    { name: 'All' }
  ]
  const [visitDate, setVisitDate] = useState(today);
  const [visitorList, setVisitorList] = useState([]);
  const [filterStatus, setFilterStatus] = useState('Approved');
  useEffect(() => {
    getVisits();
  }, []);
  function getVisits() {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getVisitListAdmin.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { visitDate: visitDate, status: filterStatus }
    })
      .then(result => {
        setVisitorList(result.data);
      })
      .catch(error => console.log(error));
  }
  function changeDate(e) {
    setVisitDate(e.target.value);
    setVisitorList([]);

  }
  useEffect(() => {
    getVisits();
  }, [visitDate]);
  useEffect(() => {
    getVisits();
  }, [filterStatus]);
  function changeStatus(e) {
    setFilterStatus(e.target.value);
    setVisitorList([]);
  }
  function allowInVisitor(visitId, firstName) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/InAndOutVisitor.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { visitId: visitId, userId: currentUser.userId, requestType: "In" }
    })
      .then(result => {
        if (result.data === "success") {
          alert(firstName + " is allowed in successfully.")
          getVisits();
        }
        else {
          alert("Something went wrong. Please try again");

        }

      })
      .catch(error => console.log(error));
  }
  function outVisitor(visitId, firstName) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/InAndOutVisitor.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { visitId: visitId, userId: currentUser.userId, requestType: "Out" }
    })
      .then(result => {
        if (result.data === "success") {
          alert(firstName + " is out successfully.")
          getVisits();
        }
        else {
          alert("Something went wrong. Please try again");

        }

      })
      .catch(error => console.log(error));
  }
  return (
    currentRole === "Admin" || currentRole === "Manager" ?
      <>
        <Navbar />
        <div className="main-div">
          <div className="main-title">Manage Visitors</div>
          <div className="content">
            <div className="filters">
              <div>
                <label htmlFor="visitDate">Visit Date:</label>
                <input type="date" id="visitDate" name="visitDate" value={visitDate} required
                  onChange={changeDate} />
              </div>
              <div>
                <label htmlFor="visitStatus">Status:</label>
                <select
                  name="visitStatus"
                  id="visitStatus"
                  title="Select a status"
                  required
                  value={filterStatus}
                  onChange={changeStatus}
                >
                  {statusMeta.map(i => <option value={i.name}>{i.name}</option>)}
                </select>
              </div>
            </div>
            <div className="table-div">
              <table className="styled-table" id="visitor-table" style={{ fontSize: "16px" }}>
                <thead>
                  <tr>
                    <td>First Name</td>
                    <td>Last Name</td>
                    <td>Phone Number</td>
                    <td>Email</td>
                    <td>Building</td>
                    <td>Apartment</td>
                    <td>Status</td>
                    <td>Actions</td>
                  </tr>
                </thead>
                <tbody>
                  {visitorList.length > 0 ? visitorList.map(i =>
                    <tr>
                      <td>{i.firstName}</td>
                      <td>{i.lastName}</td>
                      <td>{i.phoneNumber}</td>
                      <td>{i.email}</td>
                      <td>{i.buildingName}</td>
                      <td>{i.apartmentNumber}</td>
                      <td>{i.status}</td>
                      <td style={{ display: "flex", gap: "10px" }}>
                        <button type="button" className="btn visit-in-button"
                          disabled={formatDateWithoutTime(i.dateOut) < formatedToday || i.allowedInByUser > 0 || i.status.toLowerCase() !== 'approved'}
                          onClick={() => allowInVisitor(i.visitId, i.firstName)}>In</button>

                        <button type="button" className="btn visit-out-button"
                          disabled={!i.allowedInByUser || i.outByUser} onClick={() => outVisitor(i.visitId, i.firstName)}>
                          Out
                        </button>
                      </td>
                    </tr>
                  )
                    :
                    <tr><td colSpan={7}>Looks like there are no visitors on
                      {formatDateWithoutTime(visitDate)} with status {filterStatus}!
                      Please choose another combination.</td></tr>}
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
          <Link to="/login" style={{ color: "red" }}> login </Link> with admin or manager role to view this page.
        </div>

      </>
  )
}

export default ManageVisitorsManager;