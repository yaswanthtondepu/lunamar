import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import '../css/register-apartment-owners.css';
import { Link } from "react-router-dom";
import axios from "axios";
import formatDate from "../formatDate";
const RegisterApartmentOwners = () => {
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
    getBuildings();
    getOccupiedApartmentsList();
    getResidentRequests();
  }, [])
  const [buildingList, setBuildingList] = useState([]);
  const [apartmentList, setApartmentList] = useState([]);
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);
  const [searchedEmail, setSearchedEmail] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedApartment, setSelectedApartment] = useState('');
  const [registerOwnerDetails, setRegisterOwnerDetails] = useState([
    {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      role: "",
      userId: ""
    }
  ]);
  const [residentPendingRequests, setResidentPendingRequests] = useState([]);
  const [occupiedApartmentsList, setOccupiedApartmentsList] = useState([]);
  const [filterBuilding, setFilterBuilding] = useState('');
  async function getBuildings() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getBuildings.php'
    }

    let res = await axios(config)
    setBuildingList(res.data);
  }
  async function getOccupiedApartmentsList() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getAllOccupiedApartments.php'
    }

    let res = await axios(config);
    console.log(res.data);
    setOccupiedApartmentsList(res.data);
  }

  async function getResidentRequests() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/residentPendingRequests.php'
    }

    let res = await axios(config);
    console.log(res.data);
    setResidentPendingRequests(res.data);
  }
  function hideResidentDetails() {
    setShowOwnerDetails(false);
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  function checkEmail(e) {
    setSearchedEmail(e.target.value);
  }
  function showResidentDetails() {
    searchedEmail.trim().length > 3 && validateEmail(searchedEmail) ?
      axios({
        method: 'post',
        url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/searchUsersByEmail.php',
        headers: {
          'content-type': 'application/json'
        },
        data: { email: searchedEmail, role: 'Resident' }
      })
        .then(result => {
          if (result.data.length > 0 && result.status === 200) {
            setRegisterOwnerDetails(result.data);
            setShowOwnerDetails(true);
          }
          else {
            setRegisterOwnerDetails([
              {
                email: "",
                firstName: "",
                lastName: "",
                phoneNumber: "",
                role: "",
                userId: ""
              }
            ])
            alert("Sorry there's no resident with that email. Make sure you entered the correct email.");
          }
        })
        .catch(error => console.log(error))

      : setShowOwnerDetails(false);
  }

  function getApartments(e) {
    setSelectedBuilding(e.target.value);
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getUnoccupiedApartments.php',
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
  function registerOwnerForm(e) {
    console.log(selectedBuilding, selectedApartment, searchedEmail)
    if (selectedBuilding.trim().length > 0 && selectedApartment.trim().length > 0 && searchedEmail.trim().length > 0) {
      axios({
        method: 'post',
        url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/registerApartmentOwner.php',
        headers: {
          'content-type': 'application/json'
        },
        data: { email: searchedEmail.trim(), building: selectedBuilding.trim(), apartment: selectedApartment.trim() }
      })
        .then(result => {

          if (result.data === "success") {
            alert("Apartment " + selectedApartment + " is registered to " + registerOwnerDetails[0].firstName);
            getOccupiedApartmentsList();
          }
          else if (result.data === "failed") {
            alert("Something went wrong. Please try again");
          }
          else if (result.data == "pending request") {
            alert("Looks like there is a pending request on Apartment " + selectedApartment + " by another resident. Please take action on that request before proceeding.")
          }
          setSelectedBuilding('');
          setSelectedApartment('');
          setSearchedEmail('');
          setShowOwnerDetails(false);
          setApartmentList([]);
        })
        .catch(error => console.log(error));
    }
    else {
      alert('Please check the form.')
    }
    e.preventDefault();
  }
  function getFilteredApartments(e) {
    setFilterBuilding(e.target.value);
    setOccupiedApartmentsList([]);
    if (e.target.value != '') {
      axios({
        method: 'post',
        url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getAllOccupiedApartmentsByBuilding.php',
        headers: {
          'content-type': 'application/json'
        },
        data: { building: e.target.value }
      })
        .then(result => {
          setOccupiedApartmentsList(result.data);
        })
        .catch(error => console.log(error));
    }
    else {
      getOccupiedApartmentsList();
    }
  }
  function approveRequest(requestId, apartmentNumber, aptUser) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/approveOrRejectResidentRequest.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { requestId: requestId, requestType: 'Approve', userId: currentUser.userId, apartment: apartmentNumber, aptUser: aptUser }
    })
      .then(result => {
        if (result.data === "success") {
          alert("Apartment " + apartmentNumber + " is registered successfully");
          getResidentRequests();
        }
        else {
          alert("Oops! Something went wrong. Please try again");
        }
      })
      .catch(error => console.log(error));
  }
  function rejectRequest(requestId, apartmentNumber) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/approveOrRejectResidentRequest.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { requestId: requestId, requestType: 'Reject', userId: currentUser.userId, apartment: 0, aptUser: 0 }
    })
      .then(result => {
        if (result.data === "success") {
          alert("Request for Apartment " + apartmentNumber + " was rejected successfully");
          getResidentRequests();
        }
        else {
          alert("Oops! Something went wrong. Please try again");
        }

      })
      .catch(error => console.log(error));
  }
  return (
    currentRole === "Admin" || currentRole === "Manager" ?
      <>
        <Navbar />
        <div className="main-div">
          <div className="main-title">Register apartment owners</div>
          <div className="rao-content">
            <div className="rao-sub-content">
              <div className="rao-sub-title">Register Apartment owners</div>
              <form onSubmit={registerOwnerForm}>
                <div className="register-apartment-owners">
                  <div className="rao-single-option">
                    <div>
                      <label htmlFor="rgo-building">Select a building:</label>
                    </div>
                    <div>
                      <select
                        name="rgo-building"
                        id="rgo-building"
                        title="select a building"
                        required
                        value={selectedBuilding}
                        onChange={getApartments}
                      >
                        <option disabled value=''>
                          -- Select a building --
                        </option>
                        {buildingList.map(i => <option value={i.buildingName}>{i.buildingName}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="rao-single-option">
                    <div>
                      <label htmlFor="rgo-apartment">Select an apartment:</label>
                    </div>
                    <div>
                      <select
                        name="rgo-apartment"
                        id="rgo-apartment"
                        title="select an apartment"
                        required
                        value={selectedApartment}
                        onChange={e => setSelectedApartment(e.target.value)}
                      >
                        <option disabled value=''>
                          -- Select an apartment --
                        </option>
                        {apartmentList.map(i => <option value={i.apartmentNumber}>{i.apartmentNumber}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="rao-single-option">
                    <div>
                      <label htmlFor="resident-email">Enter Resident's email</label>
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Enter Resident's email"
                        name="resident-email"
                        id="resident-email"
                        required
                        onFocus={hideResidentDetails}
                        onBlur={showResidentDetails}
                        value={searchedEmail}

                        onChange={checkEmail}
                        autoComplete="nope"
                      />
                    </div>
                  </div>
                </div>
                <div className="owner-details" style={showOwnerDetails ? { display: 'flex' } : { display: "none" }}>
                  <div className="rao-single-option">
                    <div style={{ textAlign: "center" }}>Resident Details</div>
                    <div className="resident-content">
                      <div className="flex-display">
                        <div>First Name:</div>
                        <div>{registerOwnerDetails[0].firstName}</div>
                      </div>
                      <div className="flex-display">
                        <div>Last Name:</div>
                        <div>{registerOwnerDetails[0].lastName}</div>
                      </div>
                    </div>
                    <div className="resident-content">
                      <div className="flex-display">
                        <div>Phone Number:</div>
                        <div>{registerOwnerDetails[0].phoneNumber}</div>
                      </div>
                      <div className="flex-display">
                        <div>Email:</div>
                        <div id="display-email">{registerOwnerDetails[0].email}</div>
                      </div>
                    </div>
                    <div className="flex-display">
                      <div>
                        <button
                          type="submit"
                          className="btn submit-btn"
                          id="register-owner-btn"
                        >
                          Register owner
                        </button>
                      </div>
                      <div>
                        <button
                          type="reset"
                          className="btn reset-btn"
                          id="reset-resgister-owner-btn"
                          onClick={hideResidentDetails}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="rao-sub-content">
              <div className="rao-sub-title">Resident Requests to occupy apartments
                {residentPendingRequests.length > 0 ? <span>({residentPendingRequests.length})</span> : <span></span>}</div>
              <div className="table-div">
                <table className="styled-table">
                  <thead>
                    <tr>
                      <td>Building</td>
                      <td>Apartment</td>
                      <td>First Name</td>
                      <td>Last Name</td>
                      <td>Request Date</td>
                      <td>Status</td>
                      <td>Actions</td>
                    </tr>
                  </thead>
                  <tbody>
                    {residentPendingRequests.length > 0 ? residentPendingRequests.map(i =>
                      <tr>
                        <td>{i.buildingName}</td>
                        <td>{i.apartmentNumber}</td>
                        <td>{i.firstName}</td>
                        <td>{i.lastName}</td>
                        <td>{formatDate(i.requestedOn)}</td>
                        <td>{i.status}</td>
                        <td style={{ display: "flex", gap: "10px" }}>
                          <button type="button" className="btn approve-apt-btn" onClick={() => approveRequest(i.requestId, i.apartmentNumber, i.userId)}>
                            Approve
                          </button>
                          <button type="button" className="btn reject-apt-btn" onClick={() => rejectRequest(i.requestId, i.apartmentNumber)}>
                            Reject
                          </button>
                        </td>
                      </tr>
                    ) : <tr><td colSpan={4}>There are no pending requests</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rao-sub-content">
              <div className="rao-sub-title">Residents
                {occupiedApartmentsList.length > 0 ? <span>({occupiedApartmentsList.length})</span> : <span></span>}</div>
              <div className="rao-sub-title" style={{ fontWeight: "normal" }}>Filter Residents by building</div>
              <div className="filters-div">
                <div>
                  <select
                    name="sfr-building"
                    id="sfr-building"
                    title="select a building"
                    required
                    value={filterBuilding}
                    onChange={getFilteredApartments}
                  >
                    <option value="">-- Select a building/clear filter --</option>
                    {buildingList.map(i => <option value={i.buildingName}>{i.buildingName}</option>)}
                  </select>
                </div>
                {/* <div>
                  <input
                    type="text"
                    name="filter-search-text"
                    placeholder="Search Last Name or email"
                  />
                </div> */}
              </div>
              <div className="table-div">
                <table className="styled-table table-scroll">
                  <thead>
                    <tr>
                      <td>Building</td>
                      <td>Apartment</td>
                      <td>First Name</td>
                      <td>Last Name</td>
                      <td>Phone Number</td>
                      <td>Email</td>
                    </tr>
                  </thead>
                  <tbody className="tbody-scroll">
                    {occupiedApartmentsList.length > 0 ? occupiedApartmentsList.map(i =>
                      <tr>
                        <td title="Building">{i.buildingName}</td>
                        <td title="Apartment">{i.apartmentNumber}</td>
                        <td title="First Name">{i.firstName}</td>
                        <td title="Last Name">{i.lastName}</td>
                        <td title="Phone Number">{i.phoneNumber}</td>
                        <td title="Email">{i.email}</td>
                      </tr>
                    ) : <tr><td colSpan={4}>There are no residents matching the search criteria</td></tr>}
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

export default RegisterApartmentOwners;