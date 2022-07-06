import React from "react";
import { Link } from "react-router-dom";
import '../css/resident.css';
import Navbar from "./Navbar";

const Visitor = () => {
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
    currentRole === "Visitor" ?
      <>
        <Navbar></Navbar>
        <div className="resident-home">
          <div className="resident-title">Hello {currentUser.firstName}! You are a {currentRole}</div>
          <div className="contents">
            <div className="rv-content-div">
              <Link to="addNewVisitVisitor">
                <div className="rv-single-option">Add new visit</div>
              </Link>
              <Link to="visitorRequestStatus">
                <div className="rv-single-option">Check Visit Request Status</div>
              </Link>
              <Link to="registerIncidents">
                <div className="rv-single-option">Register Incidents</div>
              </Link>
              <Link to="chat">
                <div className="rv-single-option">Chat</div>
              </Link>
            </div>
          </div>
        </div>
      </>
      :
      <>
        <div style={{ marginTop: "200px" }}>

          You are not authorised to access this page. Please
          <Link to="/login" style={{ color: "red" }}> login </Link> with Visitor role to view this page.
        </div>

      </>
  )
}

export default Visitor;