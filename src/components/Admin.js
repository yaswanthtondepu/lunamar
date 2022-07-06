import React from "react";
import Navbar from "./Navbar";
import '../css/admin.css';
import { Link } from "react-router-dom";

const Admin = () => {
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
    currentRole === "Admin" ?
      <>
        <Navbar />
        <div className="main-div">
          <div className="main-title">Hello {currentUser.firstName}! You are an {currentRole}</div>
          <div className="admin-contents">
            <div className="admin-content-div">
              <Link to="manageBuildings">
                <div className="admin-single-option">Manage Buildings</div>
              </Link>
              <Link to="registerApartmentOwners">
                <div className="admin-single-option">Register apartments and owners</div>
              </Link>
              <Link to="manageGardenPlants">
                <div className="admin-single-option">Manage garden/plants</div>
              </Link>
              <Link to="managePools">
                <div className="admin-single-option">Manage Pool</div>
              </Link>
            </div>
            <div className="admin-content-div">
              <Link to="manageVisitorsManager">
                <div className="admin-single-option">Manage Visitors</div>
              </Link>
              <Link to="checkInquiries">
                <div className="admin-single-option">Check Inquiries</div>
              </Link>
              <Link to="maintenanceRequestsManager">
                <div className="admin-single-option">Maintenance Requests</div>
              </Link>
              <Link to="incidentReportsManager">
                <div className="admin-single-option">Incident Reports</div>
              </Link>
            </div>
            <div className="admin-content-div">
              <Link to="manageManagers">
                <div className="admin-single-option">Manage Managers</div>
              </Link>
              <Link to="viewReports">
                <div className="admin-single-option">View Reports</div>
              </Link>
              <Link to="chat">
                <div className="admin-single-option">Chat</div>
              </Link>
              <Link>
                <div className="admin-blank-single-option"></div>
              </Link>
            </div>
          </div>
        </div>
      </>
      :
      <>
        <div style={{ marginTop: "200px" }}>

          You are not authorised to access this page. Please
          <Link to="/login" style={{ color: "red" }}> login </Link>to view this page.
        </div>

      </>
  )
}

export default Admin;