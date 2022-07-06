import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import '../css/occupy-apartment.css';
import cloneDeep from 'lodash/cloneDeep';
import { Link } from "react-router-dom";
import axios from "axios";
import formatDate from "../formatDate";
const OccupyApartment = () => {
  const deleteBtn = {
    backgroundColor: "#d11a2a",
    padding: "1rem",
    width: "-moz-fit-content",
    width: "fit-content",
    color: "#ffffff",
    cursor: "pointer",
    borderRadius: "5px",
    outline: "none",
    border: "none"
  };
  const deleteBtnDisabled = {
    backgroundColor: "#ddd",
    padding: "1rem",
    width: "-moz-fit-content",
    width: "fit-content",
    color: "#ffffff",
    cursor: "not-allowed",
    borderRadius: "5px",
    outline: "none",
    border: "none"
  };
  const [buildingList, setBuildingList] = useState([]);
  const [apartmentList, setApartmentList] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedApartment, setSelectedApartment] = useState('');
  const [requestStatusList, setRequestStatusList] = useState([]);
  useEffect(() => {
    getBuildings();
    getRequests();
  }, [])
  async function getBuildings() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getBuildings.php'
    }

    let res = await axios(config)
    setBuildingList(res.data);
  }
  function getRequests() {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getResidentApartmentRequests.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { userId: currentUser.userId }
    })
      .then(result => {

        setRequestStatusList(result.data);
      })
      .catch(error => console.log(error));
  }
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
  let formatedToday = mm + '/' + dd + "/" + yyyy;


  function deleteRequest(requestId) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/cancelApartmentRequestResident.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { requestId: requestId, userId: currentUser.userId }
    })
      .then(result => {
        if (result.data === "success") {
          alert("Your request has been cancelled successfully!");
          getRequests();
        }
        else {
          alert("Something went wrong. Please try again");
        }
      })
      .catch(error => console.log(error));
  }
  function setBuilding(e) {
    setSelectedApartment('');
    setSelectedBuilding(e.target.value);
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getApartmentsForResidentRequest.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { building: e.target.value }
    })
      .then(result => {
        setApartmentList(result.data);
      })
      .catch(error => console.log(error));

  }
  function setApartment(e) {
    setSelectedApartment(e.target.value);
  }
  function requestApartment(e) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/requestOccupyApartmentResident.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { building: selectedBuilding.trim(), apartment: selectedApartment.trim(), userId: currentUser.userId }
    })
      .then(result => {
        if (result.data === "success") {
          alert("Your request is submitted successfully! Please wait for Admin or manager to process your request.")
          setSelectedBuilding('');
          setSelectedApartment('');
          setApartmentList([]);
          getRequests();
        }
        else {

          alert("Something went wrong. Please try again.");
        }
      })
      .catch(error => console.log(error));
    e.preventDefault();

  }

  return (
    currentRole === "Resident" ?
      <>
        <Navbar></Navbar>
        <div className="occupy-apartment">
          <div className="occupy-title">Occupy an apartment</div>
          <form onSubmit={requestApartment}>
            <div className="oa-contents">
              <div className="oa-content-div">
                <div className="oa-single-option">
                  <label htmlFor="building">Select a building:</label>
                  <select
                    name="building"
                    id="building"
                    title="select a building"
                    required
                    value={selectedBuilding}
                    onChange={setBuilding}
                  >
                    <option disabled value=''>-- Select a building --</option>
                    {buildingList.map(i => <option value={i.buildingName}>{i.buildingName}</option>)}
                  </select>
                </div>
                <div className="oa-single-option">
                  <label htmlFor="apartment">Select an apartment:</label>
                  <select
                    name="apartment"
                    id="apartment"
                    title="select an apartment"
                    required
                    disabled={selectedBuilding.length === 0}
                    style={selectedBuilding.length === 0 ? { cursor: "not-allowed" } : { cursor: "pointer" }}
                    onChange={setApartment}
                    value={selectedApartment}
                  >
                    <option disabled value=''>
                      -- Select an apartment --
                    </option>
                    {apartmentList.map(i => <option value={i.apartmentNumber}>{i.apartmentNumber}</option>)}
                  </select>
                </div>

                <div className="oa-single-option">
                  <label style={{ visibility: "hidden" }}>Submit</label>
                  <input type="submit" value="Request to occupy" />
                </div>
              </div>
            </div>
            <div className="oa-warning-text">
              Note: After you request the apartment you wanted to occupy, either a
              Manager or an Admin must approve your request. Only after that, you
              can manage your apartment in this portal
            </div>
          </form>
          <div className="oa-status-div">
            <div style={{ textAlign: "left" }}>Status of your request(s)</div>
            <div className="table-div">
              <table className="styled-table" id="status-table" style={{ fontSize: "16px" }}>
                <thead>
                  <tr>
                    <th>Building</th>
                    <th>Apartment</th>
                    <th>Status</th>
                    <th>Date of Request</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requestStatusList.length > 0 ? requestStatusList.map(i =>
                    <tr>
                      <td>{i.buildingName}</td>
                      <td>{i.apartmentNumber}</td>
                      <td>{i.status}</td>
                      <th>{formatDate(i.requestedOn)}</th>
                      <th>
                        <input
                          type="button"
                          className="delete-btn"
                          value="Cancel Request"
                          onClick={() => deleteRequest(i.requestId)}
                          disabled={i.status.toLowerCase() !== 'pending'}
                          style={i.status.toLowerCase() !== 'pending' ? deleteBtnDisabled : deleteBtn}
                        />
                      </th>
                    </tr>
                  ) : <tr><td colSpan={4}>You haven't requested for any apartments yet.</td></tr>}
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
          <Link to="/login" style={{ color: "red" }}> login </Link> as Resident role to view this page.
        </div>
      </>
  )
}

export default OccupyApartment;