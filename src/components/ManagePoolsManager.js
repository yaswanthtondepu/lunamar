import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import '../css/manage-pools-manager.css';
import axios from "axios";
import { Link } from "react-router-dom";

const ManagePoolsManger = () => {
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
    getPools();
  }, [])

  const [buildingList, setBuildingList] = useState([]);
  const [poolName, setPoolName] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [poolSize, setPoolSize] = useState('');
  const [poolCost, setPoolCost] = useState('');
  const [poolList, setPoolList] = useState([]);
  const [delPoolName, setDelPoolName] = useState('');
  const [poolDetailsList, setPoolDetailsList] = useState([]);
  async function getBuildings() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getBuildings.php'
    }

    let res = await axios(config)
    setBuildingList(res.data);
  }
  async function getPools() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getPools.php'
    }

    let res = await axios(config)
    setPoolList(res.data);
    setPoolDetailsList(res.data);
  }
  function addPoolForm(e) {
    let gnameRegex = /^[a-zA-Z ]*$/;
    let numregex = /[+-]?([0-9]*[.])?[0-9]+/;
    if (poolName.match(gnameRegex) && poolSize.match(numregex) && poolCost.match(numregex)) {
      axios({
        method: 'post',
        url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/addPool.php',
        headers: {
          'content-type': 'application/json'
        },
        data: {
          poolName: poolName, buildingName: buildingName,
          poolSize: poolSize, poolCost: poolCost, createdBy: currentUser.userId
        }
      })
        .then(result => {

          if (result.data === "success") {
            alert("Pool " + poolName + " is added successfully.");
            getPools();
          }
          else {
            alert("Pool " + poolName + " alredy exists.");
          }
        })
        .catch(error => console.log(error));
    }
    else {
      alert("Please check the fields. Pool Name should only have aplhabets and spaces, pool size and cost should only have numbers and a dot")
    }
    setPoolName('');
    setBuildingName('');
    setPoolSize('');
    setPoolCost('');
    e.preventDefault();
  }

  function deletePoolForm(e) {
    axios({
      method: 'post',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/deletePool.php',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        poolName: delPoolName
      }
    })
      .then(result => {

        if (result.data === "success") {
          alert("Pool " + delPoolName + " is deleted successfully.");
          getPools();
        }
        else {
          alert("Something went wrong.")
        }
      })
      .catch(error => console.log(error));
    setDelPoolName('');
    e.preventDefault();
  }
  return (
    currentRole === "Admin" || currentRole === "Manager" ?
      <>
        <Navbar />
        <div className="mpm-main-div">
          <div className="main-title">Manage Pools</div>
          <div className="mpm-content">
            <div className="mpm-sub-content">
              <div>
                <div className="sub-title">Add a new pool</div>
                <form className="mpm-ctm-form" onSubmit={addPoolForm}>
                  <div className="mpm-box">
                    <div className="mpm-single-option">
                      <div>
                        <label htmlFor="add-pool" style={{ fontSize: "15px" }}
                        >Name of new pool</label
                        >
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Enter pool name"
                          autoComplete="nope"
                          required
                          name="add-pool"
                          id="add-pool"
                          value={poolName}
                          onChange={e => setPoolName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mpm-single-option">
                      <div>
                        <label htmlFor="add-pool-building" style={{ fontSize: "15px" }}
                        >Select a building the pool belongs to</label>
                      </div>
                      <div>
                        <select
                          name="add-pool-building"
                          id="add-pool-building"
                          title="select a building"
                          required
                          value={buildingName}
                          onChange={e => setBuildingName(e.target.value)}
                        >
                          <option disabled value=''>
                            -- Select a building --
                          </option>
                          {buildingList.map(i => <option value={i.buildingName}>{i.buildingName}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="mpm-single-option">
                      <div>
                        <label htmlFor="add-pool-size" style={{ fontSize: "15px" }}
                        >Pool size in sq ft</label
                        >
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Enter size of pool"
                          autoComplete="nope"
                          required
                          name="add-pool-size"
                          id="add-pool-size"
                          value={poolSize}
                          onChange={e => setPoolSize(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mpm-single-option">
                      <div>
                        <label htmlFor="add-pool-cost" style={{ fontSize: "15px" }}
                        >Cost of pool in USD</label
                        >
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Enter cost of pool"
                          autoComplete="nope"
                          required
                          name="add-pool-cost"
                          id="add-pool-cost"
                          value={poolCost}
                          onChange={e => setPoolCost(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="button-div">
                      <div>
                        <button type="submit" className="submit-btn btn">
                          Add pool
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div>
                <div className="sub-title">Delete a pool</div>
                <form className="ctm-form" onSubmit={deletePoolForm} >
                  <div className="mpm-box">
                    <div className="mpm-single-option">
                      <div>
                        <label htmlFor="del-pool" style={{ fontSize: "15px" }}
                        >Name of the pool</label>
                      </div>
                      <div>
                        <select
                          name="del-pool"
                          id="del-pool"
                          title="select a pool"
                          required
                          value={delPoolName}
                          onChange={e => setDelPoolName(e.target.value)}
                        >
                          <option disabled value=''>
                            -- Select a pool --
                          </option>
                          {poolList.map(i => <option value={i.poolName}>{i.poolName}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="button-div">
                      <div>
                        <button type="submit" className="delete-btn btn">
                          Delete pool
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

            </div>
            <div className="pool-table">
              <div style={{ textAlign: "left" }}>Pool Details</div>
              <div className="table-div">
                <table className="styled-table" id="pool-table">
                  <thead>
                    <tr>
                      <td>Pool Name</td>
                      <td>Building Name</td>
                      <td>Size</td>
                      <td>Cost</td>
                    </tr>
                  </thead>
                  <tbody>
                    {poolDetailsList.length > 0 ? poolDetailsList.map(i =>
                      <tr>
                        <td>{i.poolName}</td>
                        <td>{i.buildingName}</td>
                        <td>{i.size}</td>
                        <td>{i.cost}</td>
                      </tr>
                    ) : <tr><td colSpan={4}>Sorry! There are no pools to swim. Please add new ones to see them here</td></tr>}

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
          <Link to="/login" style={{ color: "red" }}> login </Link> with admin account to view this page.
        </div>

      </>
  )
}

export default ManagePoolsManger;