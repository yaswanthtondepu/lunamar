import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import '../css/incident-reports-manager.css'
import { Link } from "react-router-dom";
import axios from "axios";
import formatDateWithoutTime from "../formatDateWithoutTime";
const IncidentReportsManager = () => {
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
  const [incidentsList, setIncidentsList] = useState([]);
  const [status, setStatus] = useState('Pending');
  const [reportDate, setReportDate] = useState(today);
  let statusMeta = [
    { name: 'Pending' },
    { name: 'Resolved' },
    { name: 'All' }
  ];
  function getIncidents() {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getIncidentReports.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { reportedDate: reportDate, status: status }
    })
      .then(result => {

        setIncidentsList(result.data);
      })
      .catch(error => console.log(error));
  }
  useEffect(() => {
    getIncidents();
  }, []);
  useEffect(() => {
    getIncidents();
  }, [reportDate]);
  useEffect(() => {
    getIncidents();
  }, [status]);

  function checkDate(e) {
    setReportDate(e.target.value);
    setIncidentsList([]);
  }

  function checkStatus(e) {
    setStatus(e.target.value);
    setIncidentsList([]);
  }
  function resolveIncident(incidentId) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/resolveIncident.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { incidentId: incidentId, userId: currentUser.userId }
    })
      .then(result => {
        if (result.data === "success") {
          alert("Incident resolved successfully.")
          getIncidents();
        }
        else {
          alert("Something went wrong .please try again");
        }
      })
      .catch(error => console.log(error));
  }
  return (
    currentRole === "Admin" || currentRole === "Manager" ?
      <>
        <Navbar />
        <div className="main-div">
          <div className="main-title">Incident Reports</div>
          <div className="content">
            <div>
              <div className="irm-filters pad-top-2">
                <div>
                  <label htmlFor="resident-reportDate">Report Date:</label>
                  <input
                    type="date"
                    id="resident-reportDate"
                    name="resident-reportDate"
                    onChange={checkDate}
                    value={reportDate}
                    required
                    max={today}
                  />
                </div>
                <div>
                  <label htmlFor="resident-incidentStatus">Status:</label>
                  <select
                    name="resident-incidentStatus"
                    id="resident-incidentStatus"
                    title="Select a status"
                    required
                    value={status}
                    onChange={checkStatus}
                  >
                    {statusMeta.map(i => <option value={i.name}>{i.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="table-div">
                <table className="styled-table" id="resident-incident-table" style={{ fontSize: "18px" }}>
                  <thead>
                    <tr>
                      <td>Building</td>
                      <td>Apartment</td>
                      <td>Place</td>
                      <td>Reported by</td>
                      <td>Email</td>
                      <td>Description</td>
                      <td>Date of incident</td>
                      <td>Reported on</td>
                      <td>Status</td>
                      <td>Actions</td>
                    </tr>
                  </thead>
                  <tbody>
                    {incidentsList.length > 0 ? incidentsList.map(i =>
                      <tr>
                        <td>{i.buildingName}</td>
                        <td>{i.apartmentNumber}</td>
                        <td>{i.place} <span style={i.place.toLowerCase() === 'other' ? { display: "block" } : { display: "none" }}>({i.otherPlace})</span></td>
                        <td>{i.lastName} {i.firstName} ({i.role})</td>
                        <td>{i.email}</td>
                        <td>{i.description}</td>
                        <td>{formatDateWithoutTime(i.incidentDate)}</td>
                        <td>{formatDateWithoutTime(i.reportedDate)}</td>
                        <td>{i.status}</td>
                        <td>
                          <button
                            type="button"
                            className="irm-btn irm-resolve-btn resolve-resident-btn"
                            disabled={i.status.toLowerCase() !== 'pending'}
                            onClick={() => resolveIncident(i.incidentId)}
                          >
                            Resolve
                          </button>
                        </td>
                      </tr>
                    ) : <tr><td colSpan={6}>There are no incidents on {formatDateWithoutTime(reportDate)} with the status {status}</td></tr>}
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
          <Link to="/login" style={{ color: "red" }}> login </Link> with admin or manager role to view this page.
        </div>

      </>
  )
}

export default IncidentReportsManager;