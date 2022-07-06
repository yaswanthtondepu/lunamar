import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import '../css/service-request-resident.css';
import { Link } from "react-router-dom";
import axios from "axios";
import formatDateWithoutTime from "../formatDateWithoutTime";
const ServiceRequestResident = () => {
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

  const [description, setDescription] = useState('');
  const [selectedApartment, setSelectedApartment] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [apartmentList, setApartmentList] = useState([]);
  const [requestStatusList, setRequestStatusList] = useState([]);
  const locationList = [
    { name: "Living Room" },
    { name: "Bedroom" },
    { name: "Bathroom" },
    { name: "Kitchen" },
    { name: "Laundry Room" }
  ]
  const issueList = [
    { name: "Air conditioning/Heating" },
    { name: "Light Bulbs" },
    { name: "Pest Control" },
    { name: "Windows" },
    { name: "Tub/Shower" },
    { name: "Microwave" },
    { name: "Cooktop" }
  ];
  useEffect(() => {
    getUserApartments();
    getServiceRequests();
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

  function getServiceRequests() {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getResidentServiceRequests.php',
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

  function checkApartment(e) {
    setSelectedApartment(e.target.value);
  }
  function checkLocation(e) {
    setSelectedLocation(e.target.value)
  }
  function checkCategory(e) {
    setSelectedCategory(e.target.value)
  }

  function requestServiceForm(e) {
    let build = apartmentList.filter(x => x.apartmentNumber === selectedApartment);
    let building = build[0].buildingName;
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/serviceRequest.php',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        building: building, issueLocation: selectedLocation, category: selectedCategory,
        apartment: selectedApartment, description: description, requestedBy: currentUser.userId
      }
    })
      .then(result => {
        if (result.data === "success") {
          alert("Service request was submitted successfully.")
          setSelectedLocation('');
          setSelectedCategory('');
          setSelectedApartment('');
          setDescription('');
          getServiceRequests();
        }
        else {
          alert("Something went wrong. Please try again");
        }
      })
      .catch(error => console.log(error));
    e.preventDefault();
  }
  return (
    currentRole === "Resident" ?
      <>
        <Navbar />
        <div className="service-request">
          <div>
            <div className="service-request-title">Raise a service request</div>
            <div className="srr-content">
              <div>
                <form onSubmit={requestServiceForm}>
                  <div className="srr-sub-content">
                    <div className="srr-single-option">
                      <div>
                        <label for="issue-location">Select Issue Location</label>
                      </div>
                      <div>
                        <select
                          name="issue-location"
                          id="issue-location"
                          title="select issue location"
                          required
                          value={selectedLocation}
                          onChange={checkLocation}
                        >
                          <option disabled value=''>
                            -- Select Issue Location --
                          </option>
                          {locationList.map(i => <option value={i.name}>{i.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="srr-single-option">
                      <div>
                        <label for="issue-category">Select Category</label>
                      </div>
                      <div>
                        <select
                          name="issue-category"
                          id="issue-category"
                          title="select issue category"
                          required
                          value={selectedCategory}
                          disabled={selectedLocation.length === 0}
                          onChange={checkCategory}
                        >
                          <option disabled value=''>
                            -- Select Issue Category --
                          </option>
                          {issueList.map(i => <option value={i.name}>{i.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="srr-sub-content pad-top-2">
                    <div className="srr-single-option">
                      <label for="apartment">Select an Apartment:</label>
                      <select
                        name="apartment"
                        id="apartment"
                        title="select an apartment"
                        required
                        value={selectedApartment}
                        onChange={checkApartment}
                      >
                        <option value='' disabled>
                          ---Select an apartment ---
                        </option>
                        {apartmentList.map(i => <option value={i.apartmentNumber}>{i.apartmentNumber}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="srr-sub-content pad-top-2">
                    <textarea
                      name="issue-description"
                      placeholder="Description"
                      required
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="srr-sub-content pad-top-2">
                    <div>
                      <button type="submit" className="btn submit-btn">
                        Submit Request
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="req-status">
            <div style={{ textAlign: "left" }}>Request Status</div>
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
                  </tr>
                </thead>
                <tbody>
                  {requestStatusList.length > 0 ? requestStatusList.map(i =>
                    <tr>
                      <td>{i.issueLocation}</td>
                      <td>{i.category}</td>
                      <td>{i.buildingName}</td>
                      <td>{i.apartmentNumber}</td>
                      <td>{i.description}</td>
                      <td>{formatDateWithoutTime(i.requestDate)}</td>
                      <td>{i.status}</td>
                    </tr>) : <tr><td colSpan={7}> Looks like everything is fine! You have no service requests.</td></tr>}
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

export default ServiceRequestResident;