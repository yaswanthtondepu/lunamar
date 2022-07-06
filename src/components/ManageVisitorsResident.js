import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import '../css/manage-visitors-resident.css'
import { Link } from "react-router-dom";
import axios from "axios";
import formatDateWithoutTime from "../formatDateWithoutTime";
const ManageVisitorsResident = () => {
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
    getUserApartments();
    getUpcomingVisits();
    getPastVisits();
  }, [])
  function getUserApartments() {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getUserApartments.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { userId: currentUser.userId }
    })
      .then(result => {

        setApartmentList(result.data);
      })
      .catch(error => console.log(error));
  }
  function getUpcomingVisits() {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getUpcomingVisits.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { userId: currentUser.userId }
    })
      .then(result => {

        setUpcomingVisitList(result.data);
      })
      .catch(error => console.log(error));
  }
  function getPastVisits() {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getPastVisits.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { userId: currentUser.userId }
    })
      .then(result => {

        setPastVisitList(result.data);
      })
      .catch(error => console.log(error));
  }
  const [showAddVisitBtn, setShowAddVisitBtn] = useState(true);
  const [visitInDate, setVisitInDate] = useState(today);
  const [visitOutDate, setVisitOutDate] = useState('');
  const [apartmentList, setApartmentList] = useState([]);
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitingApt, setVisitingApt] = useState('');
  const [upcomingVisitList, setUpcomingVisitList] = useState([]);
  const [pastVisitList, setPastVisitList] = useState([]);
  function showVisitForm() {
    setShowAddVisitBtn(false);
  }
  function hideForm() {
    setShowAddVisitBtn(true);
  }
  function visitInDateSet(e) {
    setVisitInDate(e.target.value);
    setVisitOutDate('');
  }
  function visitOutDateSet(e) {
    setVisitOutDate(e.target.value);
  }
  function approveVisit(visitId) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/approveAndRejectVisits.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { visitId: visitId, requestType: "Approve" }
    })
      .then(result => {
        if (result.data === "success") {
          alert("Visit was approved successfully");
          getUpcomingVisits();
        }
        else {
          alert("Something went wromg. Please try again")
        }
      })
      .catch(error => console.log(error));
  }
  function rejectVisit(visitId) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/approveAndRejectVisits.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { visitId: visitId, requestType: "Reject" }
    })
      .then(result => {
        if (result.data === "success") {
          alert("Visit was reject successfully");
          getUpcomingVisits();
        }
        else {
          alert("Something went wromg. Please try again")
        }

      })
      .catch(error => console.log(error));
  }
  function addVisitForm(e) {
    let build = apartmentList.filter(x => x.apartmentNumber === visitingApt);
    let building = build[0].buildingName;
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getUserDetailsOnEmail.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { email: visitorEmail }
    })
      .then(result => {
        if (result.data.length > 0) {
          let user = result.data;
          axios({
            method: 'post',
            url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/addNewVisitResident.php',
            headers: {
              'content-type': 'application/json'
            },
            data: {
              building: building, apartment: visitingApt, visitorId: user[0].userId,
              createdBy: currentUser.userId, dateIn: visitInDate, dateOut: visitOutDate, ownerUserId: currentUser.userId
            }
          })
            .then(result => {
              if (result.data === 'success') {
                alert("Visit for " + user[0].firstName + " was added successfully");
                setVisitingApt('');
                setVisitorEmail('');
                setVisitOutDate('');
                getUpcomingVisits();
                hideForm();
              }
              else {

                alert("Something went wrong. Please try again.")
              }
            })
            .catch(error => console.log(error));
        }
        else {
          alert("There's no visitor registered with the email " + visitorEmail);
        }

      })
      .catch(error => console.log(error));
    e.preventDefault();
  }
  return (
    currentRole === "Resident" ?
      <>
        <Navbar></Navbar>
        <div className="manage-visitors">
          <div className="manage-title">Manage your visitors</div>
          <div>
            <div className="add-visit-container">
              <div className="add-visit" id="add-visit" style={showAddVisitBtn ? { display: "flex" } : { display: 'none' }}>
                <button className="add-visit-btn" id="add-visit-btn" onClick={showVisitForm}>
                  <span style={{ fontSize: "18px" }}>+</span> Add new visit
                </button>
              </div>
              <form onSubmit={addVisitForm}>
                <div className="parent-visit-form" id="parent-visit-form" style={showAddVisitBtn ? { display: "none" } : { display: 'flex' }}>
                  <div className="visit-form">
                    <div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Visitor Email"
                        required
                        autoComplete="nope"
                        value={visitorEmail}
                        onChange={e => setVisitorEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <select
                        name="visit-apartment"
                        id="visit-apartment"
                        title="Select an apartment"
                        required
                        value={visitingApt}
                        onChange={e => setVisitingApt(e.target.value)}
                      >
                        <option disabled value=''>
                          -- Apartment they are visiting --
                        </option>
                        {apartmentList.map(i => <option value={i.apartmentNumber}>{i.apartmentNumber}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="visit-form">

                    <div>
                      <label htmlFor="visitInDate">In Date:</label>
                      <input
                        type="date"
                        id="visitInDate"
                        name="visitInDate"
                        required
                        min={today}
                        value={visitInDate}
                        onChange={visitInDateSet}
                      />
                    </div>
                    <div>
                      <label htmlFor="visitOutDate">Out Date:</label>
                      <input
                        type="date"
                        id="visitOutDate"
                        name="visitOutDate"
                        required
                        value={visitOutDate}
                        min={visitInDate ? visitInDate : today}
                        onChange={visitOutDateSet}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", color: "red", fontSize: "15px" }}>
                    Note: Adding the visit directly approves it. You can't change it later.
                  </div>
                  <div className="visit-form" style={{ flexDirection: "row" }}>
                    <div>
                      <button
                        type="submit"
                        className="add-visit-btn"
                        id="add-visit-form"
                      >
                        Add Visit
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="mvr-reject-btn"
                        id="cancel-visit-form"
                        onClick={hideForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="upcoming-visits">
              <div style={{ textAlign: "left" }}>Upcoming Visits</div>
              <div className="table-div">
                <table className="styled-table" style={{ fontSize: "16px", marginRight: "0", width: "95%" }}>
                  <thead>
                    <tr>
                      <td>Building</td>
                      <td>Apartment</td>
                      <td>Visitor First Name</td>
                      <td>Visitor Last Name</td>
                      <td>In Date</td>
                      <td>Out Date</td>
                      <td>Reason</td>
                      <td>Status</td>
                      <td>Actions</td>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingVisitList.length > 0 ? upcomingVisitList.map(i =>
                      <tr>
                        <td>{i.buildingName}</td>
                        <td>{i.apartmentNumber}</td>
                        <td>{i.firstName}</td>
                        <td>{i.lastName}</td>
                        <td>{formatDateWithoutTime(i.dateIn)}</td>
                        <td>{formatDateWithoutTime(i.dateOut)}</td>
                        <td>{i.reason}</td>
                        <td>{i.status}</td>
                        <td style={{ display: "flex", gap: "0.5rem" }}>
                          <button className="mvr-approve-btn" disabled={i.status.toLowerCase() !== 'pending'}
                            onClick={() => approveVisit(i.visitId)}>Approve</button>
                          <button className="mvr-reject-btn" disabled={i.status.toLowerCase() !== 'pending'}
                            onClick={() => rejectVisit(i.visitId)}>Reject</button>
                        </td>
                      </tr>
                    ) : <tr><td colSpan={9}>Sit back and relax! You don't have any upcoming visits</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="all-visits">
              <div style={{ paddingBottom: "1.5rem", textAlign: "left", fontWeight: "bold" }}>Past Visits</div>
              {/* <div>
                <form action="#">
                  <div className="filters">
                    <div className="single-filter">
                      <div>
                        <label htmlFor="fromDate">From:</label>
                      </div>
                      <div>
                        <input
                          type="date"
                          id="fromDate"
                          name="fromDate"
                          min="2021-01-01"
                          required
                        />
                      </div>
                    </div>
                    <div className="single-filter">
                      <div>
                        <label htmlFor="fromDate">To:</label>
                      </div>
                      <div>
                        <input type="date" id="toDate" name="toDate" required />
                      </div>
                    </div>
                    <div className="single-filter">
                      <div>
                        <label htmlFor="building">Select a building:</label>
                      </div>
                      <div>
                        <select
                          name="building"
                          id="building"
                          title="select a building"
                          required
                        >
                          <option value="B1">B1</option>
                          <option value="B2">B2</option>
                        </select>
                      </div>
                    </div>
                    <div className="single-filter">
                      <div>
                        <label htmlFor="apartment">Select an Apartment:</label>
                      </div>
                      <div>
                        <select
                          name="apartment"
                          id="apartment"
                          title="select an apartment"
                          required
                        >
                          <option value="102">102</option>
                          <option value="205">205</option>
                          <option value="312">312</option>
                        </select>
                      </div>
                    </div>
                    <div className="single-filter">
                      <div>
                        <label style={{ visibility: "hidden" }} className="hide">Submit</label>
                      </div>
                      <div>
                        <input type="submit" style={{ width: "fit-content", padding: "0.5rem 1rem" }} value="Submit" />
                      </div>
                    </div>
                  </div>
                </form>
              </div> */}
              <div className="table-div">
                <table className="styled-table" style={{ fontSize: "16px", width: "95%" }}>
                  <thead>
                    <tr>
                      <td>Building</td>
                      <td>Apartment</td>
                      <td>Visitor First Name</td>
                      <td>Visitor Last Name</td>
                      <td>In Date</td>
                      <td>Out Date</td>
                      <td>Reason</td>
                      <td>Status</td>
                    </tr>
                  </thead>
                  <tbody>
                    {pastVisitList.length > 0 ? pastVisitList.map(i =>
                      <tr>
                        <td>{i.buildingName}</td>
                        <td>{i.apartmentNumber}</td>
                        <td>{i.firstName}</td>
                        <td>{i.lastName}</td>
                        <td>{formatDateWithoutTime(i.dateIn)}</td>
                        <td>{formatDateWithoutTime(i.dateOut)}</td>
                        <td>{i.reason}</td>
                        <td>{i.status}</td>
                      </tr>
                    ) : <tr><td colSpan={5}>You don't have any past visits</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
      :
      <>
        <div style={{ marginTop: "200px" }}>

          You are not authorised to access this page. Please
          <Link to="/login" style={{ color: "red" }}> login </Link> with resident account to view this page.
        </div>

      </>
  )
}

export default ManageVisitorsResident;