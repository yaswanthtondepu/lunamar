import React, { useState, useEffect } from "react";
import '../css/manage-buildings.css'
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import axios from "axios";
const ManageBuildings = () => {
  useEffect(() => {
    getBuildings();
  }, [])
  const [rbBuilding, setRbBuilding] = useState('');
  const [rbApartment, setRbApartment] = useState('');
  const [buildingList, setBuildingList] = useState([]);
  const [delApartmentList, setDelApartmentList] = useState([]);
  const [naBuilding, setNaBuilding] = useState('');
  const [naApartment, setNaApartment] = useState('');
  const [daBuilding, setDaBuilding] = useState('');
  const [daApartment, setDaApartment] = useState('');
  const [dbBuilding, setDbBuilding] = useState('');
  const [rnbBuilding, setRnbBuilding] = useState('');
  const [rnbNewBuilding, setRnbNewBuilding] = useState('');
  const [rnaBuilding, setRnaBuilding] = useState('');
  const [rnaApartment, setRnaApartment] = useState('');
  const [rnaNewApartment, setRnaNewApartment] = useState('');
  const [rnaApartmentList, setRnaApartmentList] = useState([]);
  async function getBuildings() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getBuildings.php'
    }

    let res = await axios(config)
    setBuildingList(res.data);
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
  function registerBuildingForm(e) {
    let aptRegex = /^[0-9,]*$/;
    if (rbApartment.match(aptRegex)) {
      axios({
        method: 'post',
        url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/manageBuildings.php',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          rbBuilding: rbBuilding.trim(), rbApartment: rbApartment.trim(), reqType: 'registerBuilding',
          naBuilding: '', naApartment: '', daBuilding: '', daApartment: '', dbBuilding: '',
          rnbBuilding: '', rnbNewBuilding: '', rnaBuilding: '', rnaApartment: '', rnaNewApartment: ''
        }
      })
        .then(result => {
          if (result.data.building === 'success') {
            alert("Building added successfully");
            let apts = rbApartment.split(',');
            let addedApts = '';
            let failedApts = '';
            setRbBuilding('');
            setRbApartment('');
            getBuildings();
          }
          else {
            alert("Sorry the building was not added. Looks like there's a building the same name. If not please try again");
          }
        })
        .catch(error => console.log(error));
      e.preventDefault();
    }
    else {
      alert("Please check the apartment field. Only numbers and commas are allowed");
      e.preventDefault();
      return false;
    }
  }

  function addNewApartmentForm(e) {
    let aptRegex = /^[0-9,]*$/;
    if (naApartment.match(aptRegex)) {
      axios({
        method: 'post',
        url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/manageBuildings.php',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          naBuilding: naBuilding, naApartment: naApartment.trim(), reqType: 'addNewApt',
          rbBuilding: '', rbApartment: '', daBuilding: '', daApartment: '', dbBuilding: '',
          rnbBuilding: '', rnbNewBuilding: '', rnaBuilding: '', rnaApartment: '', rnaNewApartment: ''
        }
      })
        .then(result => {
          for (let [key, value] of Object.entries(result.data)) {
            alert(`Apartment ${key} ${value}`);
          }
          setNaBuilding('');
          setNaApartment('');
        })
        .catch(error => console.log(error));
      e.preventDefault();
    }
    else {
      alert("Please check the apartment field. Only numbers and commas are allowed");
      e.preventDefault();
      return false;
    }
  }
  function getDeleteApartments(e) {
    setDaBuilding(e.target.value);
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getApartments.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { building: e.target.value }
    })
      .then(result => {
        setDelApartmentList(result.data);
      })
      .catch(error => console.log(error));

  }
  function getRenameApartments(e) {
    setRnaBuilding(e.target.value);
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getApartments.php',
      headers: {
        'content-type': 'application/json'
      },
      data: { building: e.target.value }
    })
      .then(result => {
        setRnaApartmentList(result.data);
      })
      .catch(error => console.log(error));

  }
  function deleteApartmentForm(e) {
    let apt = prompt("Are you sure you want to delete the apartment '" + daApartment + "'? This action can't be undone. Please type the apartment number in the textbox below to confirm.");
    if (apt === daApartment) {
      axios({
        method: 'post',
        url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/manageBuildings.php',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          naBuilding: '', naApartment: '', reqType: 'delApt', rbBuilding: '', rbApartment: '',
          daBuilding: daBuilding.trim(), daApartment: parseInt(daApartment.trim()), dbBuilding: '',
          rnbBuilding: '', rnbNewBuilding: '', rnaBuilding: '', rnaApartment: '', rnaNewApartment: ''
        }
      })
        .then(result => {
          if (result.data === 'success') {
            alert("Apartment " + daApartment + " deleted successfully!");
          }
          else {
            alert("Looks like Apartment " + daApartment + " is Occupied. You can't delete an apartment with a resident in it.");
          }
          setDaBuilding('');
          setDaApartment('');
          setDelApartmentList([]);
        })
        .catch(error => console.log(error));
    }
    e.preventDefault();
  }

  function deleteBuildingForm(e) {
    let build = prompt("Are you sure you want to delete the building '" + dbBuilding + "'? This action can't be undone. Please type the building name in the textbox below to confirm.");
    if (build.toLowerCase() === dbBuilding.toLowerCase()) {
      axios({
        method: 'post',
        url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/manageBuildings.php',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          naBuilding: '', naApartment: '', reqType: 'delBuilding', rbBuilding: '', rbApartment: '',
          daBuilding: '', daApartment: '', dbBuilding: dbBuilding, rnbBuilding: '', rnbNewBuilding: '',
          rnaBuilding: '', rnaApartment: '', rnaNewApartment: ''
        }
      })
        .then(result => {

          if (result.data === 'success') {
            alert("Building " + dbBuilding + " deleted successfully!");
            getBuildings();
          }
          else {
            alert("Looks like Building " + dbBuilding + " has apartments in it. Please delete all the apartments in the building first.");
          }
          setDbBuilding('');
        })
        .catch(error => console.log(error));
    }
    e.preventDefault();
  }
  function renameBuildingForm(e) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/manageBuildings.php',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        naBuilding: '', naApartment: '', reqType: 'renameBuilding', rbBuilding: '', rbApartment: '',
        daBuilding: '', daApartment: '', dbBuilding: '', rnbBuilding: rnbBuilding, rnbNewBuilding: rnbNewBuilding.trim(),
        rnaBuilding: '', rnaApartment: '', rnaNewApartment: ''
      }
    })
      .then(result => {

        if (result.data === 'success') {
          alert("Building " + dbBuilding + " renamed successfully!");
          getBuildings();
        }
        else {
          alert("Looks like something went wrong. Building " + rnbBuilding + " was not renamed. There might me another building with the same name. Please try again using a different name.");
        }
        setRnbBuilding('');
        setRnbNewBuilding('');
      })
      .catch(error => console.log(error));
    e.preventDefault();
  }
  function renameApartmentForm(e) {
    let aptRegex = /^[0-9]*$/;
    if (rnaNewApartment.match(aptRegex)) {
      axios({
        method: 'post',
        url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/manageBuildings.php',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          naBuilding: '', naApartment: '', reqType: 'renameApartment', rbBuilding: '', rbApartment: '',
          daBuilding: '', daApartment: '', dbBuilding: '', rnbBuilding: '', rnbNewBuilding: '',
          rnaBuilding: rnaBuilding, rnaApartment: rnaApartment, rnaNewApartment: rnaNewApartment.trim()
        }
      })
        .then(result => {

          if (result.data === 'success') {
            alert("Apartment " + rnaApartment + " renamed successfully!");
          }
          else {
            alert("Looks like something went wrong. Apartment " + rnaApartment + " was not renamed. There might me another apartment with the same number. Please try again using a different number.");
          }
          setRnaBuilding('');
          setRnaApartment('');
          setRnaNewApartment('');
          setRnaApartmentList([]);
        })
        .catch(error => console.log(error));
    }
    else {
      alert("Only numbers are allowed in the apartment number");
      setRnaNewApartment('');
    }

    e.preventDefault();
  }
  return (
    currentRole === "Admin" || currentRole === "Manager" ?
      <>
        <Navbar />
        <div className="mb-main-div">
          <div className="main-title">Manage Buildings</div>
          <div className="mb-content-div">
            <div className="mb-sub-content">
              <div>
                <div className="sub-title">Register a new building</div>
                <form className="ctm-form" onSubmit={registerBuildingForm}>
                  <div className="add-building">
                    <div className="mb-single-option">
                      <div>
                        <label htmlFor="add-building-name" style={{ fontSize: "15px" }}>Name for new building:</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Building Name"
                          autoComplete="nope"
                          required
                          name="add-building-name"
                          id="add-building-name"
                          value={rbBuilding}
                          onChange={e => setRbBuilding(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-single-option">
                      <div>
                        <label htmlFor="add-apartment-name" style={{ fontSize: "15px" }}
                        >Enter Apartment Numbers followed by comma(,)
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Apartment Number(s)"
                          autoComplete="nope"
                          required
                          name="add-apartment-name"
                          id="add-apartment-name"
                          value={rbApartment}
                          onChange={e => setRbApartment(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="button-div">
                      <div>
                        <button type="submit" className="submit-btn">Submit</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div>
                <div className="sub-title">Add new apartment to a bulding</div>
                <form className="ctm-form" onSubmit={addNewApartmentForm}>
                  <div className="add-new-apartment">
                    <div className="mb-single-option">
                      <div>
                        <label htmlFor="add-apartment-building" style={{ fontSize: "15px" }}
                        >Building to add an apartment</label>
                      </div>
                      <div>
                        <select
                          name="add-apartment-building"
                          id="add-apartment-building"
                          title="select a building"
                          required
                          value={naBuilding}
                          onChange={e => setNaBuilding(e.target.value)}
                        >
                          <option disabled value=''>
                            --Select a building--
                          </option>
                          {buildingList.map(i => <option value={i.buildingName}>{i.buildingName}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="mb-single-option">
                      <div>
                        <label htmlFor="add-new-apartment-name" style={{ fontSize: "15px" }}
                        >Enter Apartment Numbers followed by comma(,)
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Apartment Number(s)"
                          autoComplete="nope"
                          required
                          name="add-new-apartment-name"
                          id="add-new-apartment-name"
                          value={naApartment}
                          onChange={e => setNaApartment(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="button-div">
                      <div>
                        <button type="submit" className="submit-btn">Submit</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div>
                <div className="sub-title">Delete a building</div>
                <form className="ctm-form" onSubmit={deleteBuildingForm}>
                  <div className="delete-building">
                    <div className="mb-single-option">
                      <div>
                        <label htmlFor="delete-building-name" style={{ fontSize: "15px" }}>Building to Delete</label>
                      </div>
                      <div>
                        <select
                          name="delete-building-name"
                          id="delete-building-name"
                          title="select a building"
                          required
                          value={dbBuilding}
                          onChange={e => setDbBuilding(e.target.value)}
                        >
                          <option disabled value=''>
                            -- Select a building --
                          </option>
                          {buildingList.map(i => <option value={i.buildingName}>{i.buildingName}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="button-div">
                      <div>
                        <button type="submit" className="delete-btn">Delete</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div>
                <div className="sub-title">Delete an apartment</div>
                <form className="ctm-form" onSubmit={deleteApartmentForm}>
                  <div className="delete-apartment">
                    <div className="mb-single-option">
                      <div>
                        <label htmlFor="da-building-name" style={{ fontSize: "15px" }}>Select a building</label>
                      </div>
                      <div>
                        <select
                          name="da-building-name"
                          id="da-building-name"
                          title="select a building"
                          required
                          value={daBuilding}
                          onChange={getDeleteApartments}
                        >
                          <option disabled value=''>
                            -- Select a building --
                          </option>
                          {buildingList.map(i => <option value={i.buildingName}>{i.buildingName}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="mb-single-option">
                      <div>
                        <label htmlFor="da-apartment-name" style={{ fontSize: "15px" }}>Select apartment to delete</label>
                      </div>
                      <div>
                        <select
                          name="da-apartment-name"
                          id="da-apartment-name"
                          title="select an apartment"
                          required
                          value={daApartment}
                          onChange={e => setDaApartment(e.target.value)}
                        >
                          <option disabled value=''>
                            -- Select an apartment --
                          </option>
                          {delApartmentList.map(i => <option value={i.apartmentNumber}>{i.apartmentNumber}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="button-div">
                      <div>
                        <button type="submit" className="delete-btn">Delete</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div>
                <div className="sub-title">Rename a building</div>
                <form className="ctm-form" onSubmit={renameBuildingForm}>
                  <div className="rename-building">
                    <div className="mb-single-option">
                      <div>
                        <label htmlFor="old-building-name" style={{ fontSize: "15px" }}
                        >Building to rename</label>
                      </div>
                      <div>
                        <select
                          name="old-building-name"
                          id="old-building-name"
                          title="select a building"
                          required
                          value={rnbBuilding}
                          onChange={e => setRnbBuilding(e.target.value)}
                        >
                          <option disabled value=''>
                            -- Select a building --
                          </option>
                          {buildingList.map(i => <option value={i.buildingName}>{i.buildingName}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="mb-single-option">
                      <div>
                        <label
                          htmlFor="new-rename-building-name"
                          style={{ fontSize: "15px" }}
                        >Enter new name
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="New Name for building"
                          autoComplete="nope"
                          required
                          name="new-rename-building-name"
                          id="new-rename-building-name"
                          value={rnbNewBuilding}
                          onChange={e => setRnbNewBuilding(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="button-div">
                      <div>
                        <button type="submit" className="submit-btn">Rename</button>
                      </div>
                      {/* <div>
                        <button type="reset" className="reset-btn">Reset</button>
                      </div> */}
                    </div>
                  </div>
                </form>
              </div>
              <div>
                <div className="sub-title">Rename an apartment</div>
                <form className="ctm-form" onSubmit={renameApartmentForm}>
                  <div className="rename-apartment">
                    <div className="mb-single-option">
                      <div>
                        <label htmlFor="ra-building-name" style={{ fontSize: "15px" }}
                        >Select a building</label>
                      </div>
                      <div>
                        <select
                          name="ra-building-name"
                          id="ra-building-name"
                          title="select a building"
                          required
                          value={rnaBuilding}
                          onChange={getRenameApartments}
                        >
                          <option disabled value=''>
                            -- Select a building --
                          </option>
                          {buildingList.map(i => <option value={i.buildingName}>{i.buildingName}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="mb-single-option">
                      <div>
                        <label htmlFor="ra-apartment-name" style={{ fontSize: "15px" }}
                        >Select apartment to rename</label>
                      </div>
                      <div>
                        <select
                          name="ra-apartment-name"
                          id="ra-apartment-name"
                          title="select an apartment"
                          required
                          value={rnaApartment}
                          onChange={e => setRnaApartment(e.target.value)}
                        >
                          <option disabled value=''>
                            -- Select an apartment --
                          </option>
                          {rnaApartmentList.map(i => <option value={i.apartmentNumber}>{i.apartmentNumber}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="mb-single-option">
                      <div>
                        <label
                          htmlFor="new-rename-apartment-name"
                          style={{ fontSize: "15px" }}
                        >Enter new name for the apartment
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="New Name for apartment"
                          autoComplete="nope"
                          required
                          name="new-rename-apartment-name"
                          id="new-rename-apartment-name"
                          value={rnaNewApartment}
                          onChange={e => setRnaNewApartment(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="button-div">
                      <div>
                        <button type="submit" className="submit-btn">Rename</button>
                      </div>
                    </div>
                  </div>
                </form>
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

export default ManageBuildings;