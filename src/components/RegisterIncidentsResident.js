import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import '../css/register-incidents-resident.css';

const RegisterIncidentsResident = () => {
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
  const [incidentDate, setIncidentDate] = useState(today);
  const [place, setPlace] = useState('');
  const [otherPlace, setOtherPlace] = useState('');
  const [building, setBuilding] = useState('');
  const [apartment, setApartment] = useState('');
  const [buildingList, setBuildingList] = useState([]);
  const [apartmentList, setApartmentList] = useState([]);
  const [description, setDescription] = useState('');
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
  }, [])
  function checkDate(e) {
    if (e.target.value > today) {
      setIncidentDate('');
    }
    else {
      setIncidentDate(e.target.value);
    }
  }
  function checkPlace(e) {
    setPlace(e.target.value);
    setOtherPlace('');
  }
  function checkOtherPlace(e) {
    setOtherPlace(e.target.value);
  }
  let placesMeta = [
    { name: 'Pool Area' },
    { name: 'Garage' },
    { name: 'Bedroom' },
    { name: 'Common Area' },
    { name: 'Balcony/Patio' },
    { name: 'Other' }

  ]
  function checkBuilding(e) {
    setBuilding(e.target.value);
    setApartment('');
    setApartmentList([]);
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getApartments.php',
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
  function checkApartment(e) {
    setApartment(e.target.value);
  }

  async function getBuildings() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getBuildings.php'
    }

    let res = await axios(config)
    setBuildingList(res.data);
  }

  function registerIncidentForm(e) {
    if (place === "Other") {
      if (otherPlace.trim().length > 3) {
        axios({
          method: 'post',
          url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/registerIncidents.php',
          headers: {
            'content-type': 'application/json'
          },
          data: {
            building: building, apartment: apartment, place: place, otherPlace: otherPlace,
            description: description, incidentDate: incidentDate, reportedBy: currentUser.userId
          }
        })
          .then(result => {
            if (result.data === "success") {
              alert("The incident was repoted successfully.")
              setBuilding('');
              setApartment('');
              setApartmentList([]);
              setPlace('');
              setOtherPlace('');
              setIncidentDate(today);
              setDescription('');
            }
            else {
              alert("Something went wrong.Please try again.")
            }
          })
          .catch(error => console.log(error));
      }
      else {
        alert("Other place must be greater than 3 characters.")
      }
    }
    else {
      axios({
        method: 'post',
        url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/registerIncidents.php',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          building: building, apartment: apartment, place: place, otherPlace: '-',
          description: description, incidentDate: incidentDate, reportedBy: currentUser.userId
        }
      })
        .then(result => {
          if (result.data === "success") {
            alert("The incident was repoted successfully.")
            setBuilding('');
            setApartment('');
            setApartmentList([]);
            setPlace('');
            setOtherPlace('');
            setIncidentDate(today);
            setDescription('');
          }
          else {
            alert("Something went wrong.Please try again.")
          }
        })
        .catch(error => console.log(error));

    }
    e.preventDefault();
  }
  return (
    currentRole === "Resident" || currentRole === "Visitor" ?
      <>
        <Navbar />
        <div className="main-div">
          <div className="main-title">Register incidents</div>
          <div className="rir-content">
            <form onSubmit={registerIncidentForm}>
              <div className="form-div">
                <div className="left-div">
                  <select
                    name="building"
                    id="building"
                    title="select a building"
                    required
                    value={building}
                    onChange={checkBuilding}
                  >
                    <option disabled value=''>-- Select a building --</option>
                    {buildingList.map(i => <option value={i.buildingName}>{i.buildingName}</option>)}
                  </select>
                </div>
                <div>
                  <select
                    name="apartment"
                    id="apartment"
                    title="select an apartment"
                    required
                    value={apartment}
                    onChange={checkApartment}
                  >
                    <option disabled value=''>
                      -- Select an apartment --
                    </option>
                    {apartmentList.map(i => <option value={i.apartmentNumber}>{i.apartmentNumber}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-div pad-top-2">
                <div className="left-div">
                  <div style={{ display: "flex", flexDirection: "column", rowGap: "5px" }}>
                    <label for="place">Place of Incident:</label>
                    <select name="place" id="place" title="Select Place" value={place} required onChange={checkPlace}>
                      <option disabled value=''>-- Select a place --</option>
                      {placesMeta.map(i => <option value={i.name}>{i.name}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", rowGap: "5px" }}>
                  <label for="incidentDate">Date of Incident:</label>
                  <input
                    type="date"
                    id="incidentDate"
                    name="incidentDate"
                    required
                    value={incidentDate}
                    onChange={checkDate}
                    max={today}

                  />
                </div>
              </div>
              <div className="form-div pad-top" style={place.toLocaleLowerCase() === 'other' ? { display: "flex" } : { display: "none" }}>
                <div className="left-div">
                  <input
                    type="text"
                    id="otherPlace"
                    name="otherPlace"
                    placeholder="Enter place"
                    value={otherPlace}
                    onChange={checkOtherPlace}
                  />
                </div>
                <div></div>
              </div>
              <div className="pad-top-2">
                <textarea
                  name="description"
                  placeholder="More details of the incident"
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="pad-top-2 btn-div">
                <button type="submit" className="btn submit-btn">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </>
      :
      <>
        <div style={{ marginTop: "200px" }}>

          You are not authorised to access this page. Please
          <Link to="/login" style={{ color: "red" }}> login </Link> with Resident or Visitor role to view this page.
        </div>

      </>
  )
}
export default RegisterIncidentsResident;