import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import '../css/manage-services-resident.css';
import { Link } from "react-router-dom";
import axios from "axios";
const ManageServicesResident = () => {
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
  const [apartmentList, setApartmentList] = useState([]);
  const [selectedApartment, setSelectedApartment] = useState('');
  const [showServicesTable, setShowServicesTable] = useState(false);
  const [selectedSevices, setSelectedSevices] = useState([]);
  const [servicesMeta, setServicesMeta] = useState([]);
  const [activeServices, setActiveServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  useEffect(() => {
    getUserApartments();
    getServicesMeta();
  }, []);
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
  async function getServicesMeta() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getServicesMeta.php'
    }

    let res = await axios(config)
    setServicesMeta(res.data);
  }
  function setApartment(e) {
    setSelectedApartment(e.target.value);
    setShowServicesTable(false);
    setActiveServices([]);
    setAvailableServices([]);
  }
  function getServicesForm(e) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getActiveServicesForApartment.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { apartment: selectedApartment }
    })
      .then(result => {
        setActiveServices(result.data);
        setShowServicesTable(true);
      })
      .catch(error => console.log(error));
    e.preventDefault();
  }
  useEffect(() => {
    setAvailableServices(servicesMeta.filter(o1 => !activeServices.some(o2 => o1.serviceId === o2.serviceId)));
  }, [activeServices]);

  function removeService(serviceId) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/removeApartmentService.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { apartment: selectedApartment, serviceId: serviceId }
    })
      .then(result => {
        if (result.data === "success") {
          alert("Service removed successfully");
          getServicesForm();
        }
        else {
          alert("something went wrong");

        }
      })
      .catch(error => console.log(error));
  }

  function addService(serviceId) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/addApartmentService.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { apartment: selectedApartment, serviceId: serviceId }
    })
      .then(result => {
        if (result.data === "success") {
          alert("Service added successfully");
          getServicesForm();
        }
        else {
          alert("something went wrong");

        }
      })
      .catch(error => console.log(error));
  }
  return (
    currentRole === "Resident" ?
      <>
        <Navbar />
        <div className="manage-services">
          <div className="manage-title">Manage your services</div>
          <div className="msr-content">
            <div>
              <form onSubmit={getServicesForm}>
                <div className="msr-contents">
                  <div className="msr-apt-select">
                    <div className="msr-single-option">
                      <label htmlFor="apartment">Select an Apartment:</label>
                      <select
                        name="apartment"
                        id="apartment"
                        title="select an apartment"
                        required
                        value={selectedApartment}
                        onChange={setApartment}
                      >
                        <option disabled value=''>
                          -- Select an apartment --
                        </option>
                        {apartmentList.map(i => <option value={i.apartmentNumber}>{i.apartmentNumber}</option>)}
                      </select>
                    </div>
                    <div className="msr-single-option">
                      <label style={{ visibility: "hidden" }} className="hide">Submit</label>
                      <input type="submit" value="Submit" className="msr-submit" style={{ width: 'fit-content' }} />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="registred-services" style={showServicesTable ? { display: "flex" } : { display: "none" }}>
            <div>
              <div className="service-table-title">
                Active Services for {selectedApartment}
              </div>
              <table className="styled-table" id="service-table">
                <thead>

                  <tr>
                    <td>Service</td>
                    <td>Cost</td>
                    <td>Tax</td>
                    <td>Actions</td>
                  </tr>
                </thead>
                <tbody>
                  {activeServices.length > 0 ? activeServices.map(i =>
                    <tr>
                      <td>{i.serviceName}</td>
                      <td>${i.cost}</td>
                      <td>${i.tax}</td>
                      <td>
                        <input
                          type="button"
                          value="Remove Service"
                          className="msr-remove-btn"
                          onClick={() => removeService(i.serviceId)}
                        />
                      </td>
                    </tr>
                  ) : <tr><td colSpan={4}>Oops! Looks like  {selectedApartment} doesn't have any active services</td></tr>}
                </tbody>
              </table>
            </div>
            <div>
              <div className="available-services-title">
                Available Services for {selectedApartment}
              </div>
              <table className="styled-table" id="available-table">
                <thead>
                  <tr>
                    <td>Service</td>
                    <td>Cost</td>
                    <td>Tax</td>
                    <td>Actions</td>
                  </tr>
                </thead>
                <tbody>
                  {availableServices.length > 0 ? availableServices.map(i =>
                    <tr>
                      <td>{i.serviceName}</td>
                      <td>${i.cost}</td>
                      <td>${i.tax}</td>
                      <td>
                        <input type="button" value="Add Service" className="msr-add-btn" onClick={() => addService(i.serviceId)} />
                      </td>
                    </tr>
                  ) : <tr><td colSpan={4}>Oops! Looks like {selectedApartment} doesn't have any available services</td></tr>}
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
          <Link to="/login" style={{ color: "red" }}> login </Link> with resident role to view this page.
        </div>

      </>
  )
}

export default ManageServicesResident;