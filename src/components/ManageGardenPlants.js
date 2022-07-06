import React, { useEffect } from "react";
import Navbar from "./Navbar";
import '../css/manage-garden-plants.css';
import { Link } from "react-router-dom";
import { useState } from "react/cjs/react.development";
import axios from "axios";
const ManageGardenPlants = () => {
  useEffect(() => {
    getPlants();
    getBuildings();
    getGardens();
  }, [])
  const [buildingList, setBuildingList] = useState([]);
  const [gardenList, setGardenList] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [gardenDetailsList, setGardenDetailsList] = useState([]);
  const [addPlant, setAddPlant] = useState('');
  const [newGardenName, setNewGardenName] = useState('');
  const [newGardenBuilding, setNewGardenBuilding] = useState('');
  const [newGardenPlant, setNewGardenPlant] = useState('');
  const [newGardenSize, setNewGardenSize] = useState('');
  const [newGardenCost, setNewGardenCost] = useState('');
  const [delPlantName, setDelPlantName] = useState('');
  const [delGardenName, setDelGardenName] = useState('');

  async function getPlants() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getPlants.php'
    }

    let res = await axios(config)
    setPlantList(res.data);
  }

  async function getGardens() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getGardens.php'
    }

    let res = await axios(config)
    setGardenList(res.data);
    setGardenDetailsList(res.data);
  }

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
  function addPlantForm(e) {
    let regex = /^[a-zA-Z ]*$/;
    if (addPlant.trim().match(regex)) {
      axios({
        method: 'post',
        url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/addPlant.php',
        headers: {
          'content-type': 'application/json'
        },
        data: { plant: addPlant }
      })
        .then(result => {
          if (result.data === "success") {
            alert("Plant " + addPlant + " is added successfully.");
            getPlants();
          }
          else {
            alert("Plant " + addPlant + " alredy exists.");
          }
        })
        .catch(error => console.log(error));
    }
    else {
      alert("Only letters and spaces allowed in plant name");
    }
    setAddPlant('');
    e.preventDefault();
  }

  function addGardenForm(e) {
    let gnameRegex = /^[a-zA-Z ]*$/;
    let numregex = /[+-]?([0-9]*[.])?[0-9]+/;
    if (newGardenName.match(gnameRegex) && newGardenSize.match(numregex) && newGardenCost.match(numregex)) {
      axios({
        method: 'post',
        url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/addNewGarden.php',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          gardenName: newGardenName, buildingName: newGardenBuilding, plantId: newGardenPlant,
          size: newGardenSize, cost: newGardenCost, createdBy: currentUser.userId
        }
      })
        .then(result => {

          if (result.data === "success") {
            alert("Garden " + newGardenName + " is added successfully.");
            getGardens();
          }
          else {
            alert("Garden " + newGardenName + " alredy exists.");
          }
        })
        .catch(error => console.log(error));
    }
    else {
      alert("Please check the fields. Garden Name should only have aplhabets and spaces, garden size and cost should only have numbers and a dot")
    }
    setNewGardenName('');
    setNewGardenBuilding('');
    setNewGardenPlant('');
    setNewGardenSize('');
    setNewGardenCost('');
    e.preventDefault();
  }

  function deletePlantForm(e) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/deletePlant.php',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        plantId: delPlantName
      }
    })
      .then(result => {

        if (result.data === "success") {
          alert("Plant is deleted  successfully.");
        }
        else if (result.data === "garden exists") {
          alert("The plant is added to some gardens. Please delete those gardens first.");
        }
        else {
          alert("Something went wrong. Try again");
        }
      })
      .catch(error => console.log(error));
    setDelPlantName('');
    getPlants();
    e.preventDefault();

  }
  function deleteGardenForm(e) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/deleteGarden.php',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        gardenName: delGardenName
      }
    })
      .then(result => {

        if (result.data === "success") {
          alert("Garden " + delGardenName + " was deleted  successfully.");
          getGardens();
        }
        else {
          alert("Something went wrong. Try again");
        }
      })
      .catch(error => console.log(error));
    setDelGardenName('');
    e.preventDefault();
  }
  return (
    currentRole === "Admin" || currentRole === "Manager" ?
      <>
        <Navbar />
        <div className="mgp-main-div">
          <div className="main-title">Manage Garden/Plants</div>
          <div className="mgp-content">
            <div className="mgp-sub-content">
              <div>
                <div className="mgp-sub-title">Add a new plant</div>
                <form className="mgp-ctm-form" onSubmit={addPlantForm}>
                  <div className="mgp-box">
                    <div className="mgp-single-option">
                      <div style={{ marginBottom: "10px" }}>
                        <label htmlFor="add-plant" style={{ fontSize: "15px" }}>Name of new plant</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Enter plant name"
                          autoComplete="nope"
                          required
                          name="add-plant"
                          id="add-plant"
                          value={addPlant}
                          onChange={e => setAddPlant(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="button-div">
                      <div>
                        <button type="submit" className="submit-btn btn">
                          Add plant
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div>
                <div className="mgp-sub-title">Delete a garden</div>
                <form className="mgp-ctm-form" onSubmit={deleteGardenForm}>
                  <div className="mgp-box">
                    <div className="mgp-single-option">
                      <div>
                        <label htmlFor="del-garden" style={{ fontSize: "15px" }}>Name of the garden</label>
                      </div>
                      <div>
                        <select
                          name="del-garden"
                          id="del-garden"
                          title="select a garden"
                          required
                          value={delGardenName}
                          onChange={e => setDelGardenName(e.target.value)}
                        >
                          <option disabled value=''>
                            -- Select a garden --
                          </option>
                          {gardenList.map(i => <option value={i.gardenName}>{i.gardenName}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="button-div">
                      <div>
                        <button type="submit" className="delete-btn btn">
                          Delete Garden
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div>
                <div className="mgp-sub-title">Delete a plant</div>
                <form className="mgp-ctm-form" onSubmit={deletePlantForm}>
                  <div className="mgp-box">
                    <div className="mgp-single-option">
                      <div>
                        <label htmlFor="del-plant" style={{ fontSize: "15px" }}>Name of the plant</label>
                      </div>
                      <div>
                        <select
                          name="del-plant"
                          id="del-plant"
                          title="select a plant"
                          required
                          value={delPlantName}
                          onChange={e => setDelPlantName(e.target.value)}
                        >
                          <option disabled value=''>
                            -- Select a plant --
                          </option>
                          {plantList.map(i => <option value={i.plantId}>{i.plantName}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="button-div">
                      <div>
                        <button type="submit" className="delete-btn btn">
                          Delete Plant
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div>
                <div className="mgp-sub-title">Add a new garden</div>
                <form className="mgp-ctm-form" onSubmit={addGardenForm}>
                  <div className="mgp-box">
                    <div className="mgp-single-option">
                      <div>
                        <label htmlFor="add-garden" style={{ fontSize: "15px" }}>Name of new garden</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Enter garden name"
                          autoComplete="nope"
                          required
                          name="add-garden"
                          id="add-garden"
                          value={newGardenName}
                          onChange={e => setNewGardenName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mgp-single-option">
                      <div>
                        <label htmlFor="add-garden-building" style={{ fontSize: "15px" }}>Select a building the garden belongs to</label>
                      </div>
                      <div>
                        <select
                          name="add-garden-building"
                          id="add-garden-building"
                          title="select a building"
                          required
                          value={newGardenBuilding}
                          onChange={e => setNewGardenBuilding(e.target.value)}
                        >
                          <option disabled value=''>
                            -- Select a building --
                          </option>
                          {buildingList.map(i => <option value={i.buildingName}>{i.buildingName}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="mgp-single-option">
                      <div>
                        <label htmlFor="add-garden-plant" style={{ fontSize: "15px" }} >Plant in this garden</label>
                      </div>
                      <div>
                        <select
                          name="add-garden-plant"
                          id="add-garden-plant"
                          title="select a plant"
                          required
                          value={newGardenPlant}
                          onChange={e => setNewGardenPlant(e.target.value)}
                        >
                          <option disabled value=''>
                            -- Select a plant --
                          </option>
                          {plantList.map(i => <option value={i.plantId}>{i.plantName}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="mgp-single-option">
                      <div>
                        <label htmlFor="add-garden-size" style={{ fontSize: "15px" }}>Garden size in sq ft</label>
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Enter size of garden"
                          autoComplete="nope"
                          required
                          name="add-garden-size"
                          id="add-garden-size"
                          value={newGardenSize}
                          onChange={e => setNewGardenSize(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mgp-single-option">
                      <div>
                        <label htmlFor="add-garden-cost" style={{ fontSize: "15px" }}>Cost of garden in USD</label>
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Enter cost of garden"
                          autoComplete="nope"
                          required
                          name="add-garden-cost"
                          id="add-garden-cost"
                          value={newGardenCost}
                          onChange={e => setNewGardenCost(e.target.value)}
                        />
                      </div>
                    </div >
                    <div className="button-div">
                      <div>
                        <button type="submit" className="submit-btn btn">
                          Add Garden
                        </button>
                      </div>
                    </div>
                  </div >
                </form >
              </div >
            </div >
            <div className="garden-table">
              <div style={{ textAlign: "left" }}>Garden Details</div>
              <div className="table-div">
                <table className="styled-table" id="garden-table">
                  <thead>
                    <tr>
                      <td>Garden Name</td>
                      <td>Building Name</td>
                      <td>Plant</td>
                      <td>Size</td>
                      <td>Cost</td>
                    </tr>
                  </thead>
                  <tbody>
                    {gardenDetailsList.length > 0 ? gardenDetailsList.map(i =>
                      <tr>
                        <td>{i.gardenName}</td>
                        <td>{i.buildingName}</td>
                        <td>{i.plantName}</td>
                        <td>{i.size}</td>
                        <td>{i.cost}</td>
                      </tr>
                    ) : <tr><td colSpan={5}>Sorry! There are no gardens. Please create new to view them here.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div >
        </div >
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
export default ManageGardenPlants;