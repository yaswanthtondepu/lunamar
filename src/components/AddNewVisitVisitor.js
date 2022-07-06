import React, { useEffect, useState } from "react";
import '../css/add-new-visit-visitor.css';
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import axios from "axios";
const AddNewVisitVisitor = () => {
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
  const [buildingList, setBuildingList] = useState([]);
  const [apartmentList, setApartmentList] = useState([]);
  const [buildingName, setBuildingName] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [inDate, setInDate] = useState('');
  const [outDate, setOutDate] = useState('');
  const [reason, setReason] = useState('')
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
  useEffect(() => {
    getBuildings();
    setInDate(today);
  }, [])
  async function getBuildings() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getBuildings.php'
    }

    let res = await axios(config)
    setBuildingList(res.data);
  }
  function getApartments(e) {
    setBuildingName(e.target.value);
    setApartmentNumber('');
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getOccupiedApartmentsForVisit.php',
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
  function visitForm(e) {
    if (inDate >= today && outDate >= inDate) {

      let apt = apartmentList.filter(x => x.apartmentNumber = apartmentNumber);
      axios({
        method: 'post',
        url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/addNewVisitVisitor.php',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          building: buildingName, apartment: apartmentNumber, visitorId: currentUser.userId,
          reason: reason, createdBy: currentUser.userId, dateIn: inDate, dateOut: outDate, ownerUserId: apt[0].userId
        }
      })
        .then(result => {
          if (result.data === 'success') {
            alert("Your visit is added successfully. Please wait for the apartment resident to approve your visit request");
            setApartmentList([]);
            setBuildingName('');
            setApartmentNumber('');
            setOutDate('');
            setReason('');
          }
          else {

            alert("Something went wrong. Please try again.")
          }
        })
        .catch(error => console.log(error));
    }
    else if (inDate < today) {
      alert("In Date should be today or a future Date.")
    }
    else if (outDate < inDate) {
      alert("Out date should be on or after In date");
    }
    e.preventDefault();
  }
  return (
    currentRole === "Visitor" ?
      <>
        <Navbar />
        <div className="main-div">
          <div className="anvv-title">Request a visit</div>
          <div className="pad-top align-center anvv-content-div">
            <div className="pad-top" style={{ paddingBottom: '1rem' }}>
              <form onSubmit={visitForm}>
                <div className="anvv-form-div">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      required
                      autoComplete="nope"
                      value={currentUser.firstName}
                      style={{ backgroundColor: "#ccc" }}
                      readOnly
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      required
                      autoComplete="nope"
                      value={currentUser.lastName}
                      readOnly
                      style={{ backgroundColor: "#ccc" }}
                    />
                  </div>
                </div>
                <div className="anvv-form-div second-row">
                  <div>
                    <select
                      name="building"
                      id="building"
                      title="select a building"
                      required
                      style={{ width: '274.39px' }}
                      value={buildingName}
                      onChange={getApartments}
                    >
                      <option disabled value=''>
                        -- Select a building --
                      </option>
                      {buildingList.map(i => <option value={i.buildingName}>{i.buildingName}</option>)}
                    </select>
                  </div>
                  <div>
                    <select
                      name="apartment"
                      id="apartment"
                      title="select an apartment"
                      required
                      defaultValue
                      style={{ width: '274.39px' }}
                      value={apartmentNumber}
                      onChange={e => setApartmentNumber(e.target.value)}
                    >
                      <option disabled value=''>
                        -- Select an apartment --
                      </option>
                      {apartmentList.map(i => <option value={i.apartmentNumber}>{i.apartmentNumber}</option>)}
                    </select>
                  </div>
                </div>
                <div className="anvv-form-div second-row">
                  <div className="date">
                    <label htmlFor="start">In date:</label>

                    <input
                      type="date"
                      id="start"
                      name="trip-start"
                      min={today}
                      value={inDate}
                      onChange={e => setInDate(e.target.value)}
                    />
                  </div>
                  <div className="date">
                    <label htmlFor="start">Out date:</label>

                    <input
                      type="date"
                      name="trip-start"
                      min={inDate}
                      value={outDate}
                      onChange={e => setOutDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pad-top-2">
                  <textarea
                    name="query"
                    placeholder="Reason for visit"
                    required
                    style={{ width: '100%' }}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                  ></textarea>
                </div>

                <div className="pad-top-2">
                  <input type="submit" style={{ padding: '0.5rem 1rem', width: 'fit-content' }} value="Submit" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
      :
      <>
        <div style={{ marginTop: "200px" }}>

          You are not authorised to access this page. Please
          <Link to="/login" style={{ color: "red" }}> login </Link> with visitor account to view this page.
        </div>

      </>
  )
}

export default AddNewVisitVisitor;