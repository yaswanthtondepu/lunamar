import React from "react";
import Navbar from "./Navbar";
import '../css/manager.css';
import { Link } from "react-router-dom";
const Manager = () => {
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
  return (
    currentRole === "Manager" ?
      <>
        <Navbar></Navbar>
        <div className="manager-home">
          <div className="manager-title">Hello {currentUser.firstName}! You are a {currentRole}</div>
          <div className="m-contents">
            <div className="m-content-div">
              <Link to="manageBuildings">
                <div className="m-single-option">Manage Buildings</div>
              </Link>
              <Link to="registerApartmentOwners">
                <div className="m-single-option">Register apartments and owners</div>
              </Link>
              <Link to="manageGardenPlants">
                <div className="m-single-option">Manage garden/plants</div>
              </Link>
            </div>
            <div className="m-content-div">
              <Link to="managePools">
                <div className="m-single-option">Manage Pool</div>
              </Link>
              <Link to="manageVisitorsManager">
                <div className="m-single-option">Manage Visitors</div>
              </Link>
              <Link to="checkInquiries">
                <div className="m-single-option">Check Inquiries</div>
              </Link>
            </div>
            <div className="m-content-div">
              <Link to="maintenanceRequestsManager">
                <div className="m-single-option">Maintenance Requests</div>
              </Link>
              <Link to="incidentReportsManager">
                <div className="m-single-option">Incident Reports</div>
              </Link>
              <Link to="chat">
                <div className="m-single-option">Chat</div>
              </Link>
            </div>
          </div>
        </div>
      </>
      :
      <>
        <div style={{ marginTop: "200px" }}>

          You are not authorised to access this page. Please
          <Link to="/login" style={{ color: "red" }}> login </Link> with manager role to view this page.
        </div>

      </>
  )
}

export default Manager;