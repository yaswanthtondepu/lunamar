import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import '../css/maintenance-requests-manager.css'
import { Link } from "react-router-dom";
import axios from "axios";
import formatDateWithoutTime from "../formatDateWithoutTime";
const MaintenanceRequestsManager = () => {
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

  const [requestDate, setRequestDate] = useState(today);
  const [maintenanceRequestList, setMaintenanceRequestList] = useState([]);
  const [filterStatus, setFilterStatus] = useState('Pending');
  const [pendingRequests, setPendingRequests] = useState([]);
  let statusMeta = [
    { name: 'Pending' },
    { name: 'Resolved' },
    { name: 'All' }
  ];
  function checkDate(e) {
    setRequestDate(e.target.value);
    if (e.target.value > today) {
      setRequestDate(today);
    }
  }

  function changeStatus(e) {
    setFilterStatus(e.target.value);
  }

  function getMaintenanceRequests() {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getMaintenanceRequests.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { requestDate: requestDate, status: filterStatus }
    })
      .then(result => {

        setMaintenanceRequestList(result.data);
      })
      .catch(error => console.log(error));
  }

  useEffect(() => {
    getMaintenanceRequests();
    getPendingrequests();
  }, []);
  useEffect(() => {
    getMaintenanceRequests();
  }, [requestDate]);
  useEffect(() => {
    getMaintenanceRequests();
  }, [filterStatus]);

  async function getPendingrequests() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getPendingServiceRequests.php'
    }

    let res = await axios(config)
    setPendingRequests(res.data);
  }

  function resolveServiceRequest(requestId) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/resolveServiceRequest.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { requestId: requestId, userId: currentUser.userId }
    })
      .then(result => {
        if (result.data === "success") {
          alert("Service Request resolved successfully.")
          getMaintenanceRequests();
          getPendingrequests();
        }
        else {
          alert("Something went wrong. please try again");
        }
      })
      .catch(error => console.log(error));
  }
  return (
    currentRole === "Admin" || currentRole === "Manager" ?
      <>
        <Navbar />
        <div className="main-div">
          <div className="main-title">Maintenance Requests</div>
          <div className="mrm-content">
            <div className="mrm-filters">
              <div>
                <label for="requestDate">Request Date:</label>
                <input
                  type="date"
                  id="requestDate"
                  name="requestDate"
                  max={today}
                  value={requestDate}
                  required
                  onChange={checkDate}
                />
              </div>
              <div>
                <label for="requestStatus">Status:</label>
                <select
                  name="requestStatus"
                  id="requestStatus"
                  title="Select a status"
                  required
                  value={filterStatus}
                  onChange={changeStatus}
                >
                  {statusMeta.map(i => <option value={i.name}>{i.name}</option>)}
                </select>
              </div>
            </div>
            <div style={pendingRequests.length > 0 ? { display: "flex", justifyContent: "center", color: "red" } : { display: "none" }}>
              <span>You have request(s) pending on &nbsp;</span>
              {pendingRequests.length > 0 ?
                pendingRequests.map(i =>
                  <span>{formatDateWithoutTime(i.requestDate)}&nbsp;</span>) : <div></div>}
            </div>
            <div className="table-div">
              <table className="styled-table" id="inquiry-table">
                <thead>
                  <tr>
                    <td>Issue Location</td>
                    <td>Category</td>
                    <td>Building</td>
                    <td>Apartment</td>
                    <td>Description</td>
                    <td>Request Date</td>
                    <td>Status</td>
                    <td>Actions</td>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceRequestList.length > 0 ? maintenanceRequestList.map(i =>
                    <tr>
                      <td>{i.issueLocation}</td>
                      <td>{i.category}</td>
                      <td>{i.buildingName}</td>
                      <td>{i.apartmentNumber}</td>
                      <td>{i.description}</td>
                      <td>{formatDateWithoutTime(i.requestDate)}</td>
                      <td>{i.status}</td>
                      <td>
                        <button type="button" className="btn mrm-resolve-btn"
                          disabled={i.status.toLowerCase() != 'pending'}
                          onClick={() => resolveServiceRequest(i.requestId)}>Resolve</button>
                      </td>
                    </tr>
                  ) : <tr><td colSpan={8}>There are no maintenance requests requested on {formatDateWithoutTime(requestDate)} with status {filterStatus}. Try using another filters.</td></tr>}
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
export default MaintenanceRequestsManager;