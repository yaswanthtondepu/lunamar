import React from "react";
import '../css/resident.css';
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const Resident = () => {
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
    currentRole === "Resident" ?
      <>
        <Navbar />
        <div className="resident-home">
          <div className="resident-title">Hello {currentUser.firstName}! You are a {currentRole}.</div>
          <div className="contents">
            <div className="rv-content-div">
              <Link to="occupyApartment">
                <div className="rv-single-option">Occupy an apartment / check status</div>
              </Link>
              <Link to="manageServicesResident">
                <div className="rv-single-option">Manage your apartment services</div>
              </Link>
              <Link to="manageVisitorsResident">
                <div className="rv-single-option">Manage your visitors</div>
              </Link>
              <Link to="uploadFiles">
                <div className="rv-single-option">Upload Photos/Videos</div>
              </Link>
            </div>
            <div className="rv-content-div">
              <Link to="registerIncidents">
                <div className="rv-single-option">Register incidents</div>
              </Link>
              <Link to="serviceRequestResident">
                <div className="rv-single-option">Service Requests</div>
              </Link>
              <Link to="chat">
                <div className="rv-single-option">Chat</div>
              </Link>
              <div className="rv-blank-single-option"></div>
            </div>
          </div>
        </div>
      </>
      :
      <>
        <div style={{ marginTop: "200px" }}>

          You are not authorised to access this page. Please
          <Link to="/login" style={{ color: "red" }}> login </Link> as Resident role to view this page.
        </div>
      </>
  )
};
export default Resident;