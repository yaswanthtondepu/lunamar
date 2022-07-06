import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "../css/manage-managers-admin.css";
import { Link } from "react-router-dom";
import axios from "axios";
const ManageManagersAdmin = () => {
  useEffect(() => {
    getManagerDetails();
  }, [])
  const [managerRoleRequestList, setManagerRoleRequestList] = useState([]);
  const [activeManagersList, setActiveManagersList] = useState([]);
  const [inActiveManagersList, setInActiveManagersList] = useState([]);
  async function getManagerDetails() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/manageManagers.php'
    }

    let res = await axios(config)
    setManagerRoleRequestList(res.data.managerRequests);
    setActiveManagersList(res.data.activeManagers);
    setInActiveManagersList(res.data.inActiveManagers);
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
  function approveManagerRequest(email) {
    axios({
      method: 'post',
      url: "https://vxt9613.uta.cloud/Lunamar-Management/php/approveManagerRequest.php",
      headers: {
        'content-type': 'application/json'
      },
      data: { email: email, isApprove: true }
    })
      .then(result => {

        getManagerDetails();
      })
      .catch(error => console.log(error));
  }
  function removeManagerRequest(email) {
    axios({
      method: 'post',
      url: "https://vxt9613.uta.cloud/Lunamar-Management/php/approveManagerRequest.php",
      headers: {
        'content-type': 'application/json'
      },
      data: { email: email, isApprove: false }
    })
      .then(result => {

        getManagerDetails();
      })
      .catch(error => console.log(error));
  }
  return (
    currentRole === "Admin" ?
      <>
        <Navbar />
        <div className="main-div">
          <div className="main-title">Manage Managers</div>
          <div className="mma-content">
            <div>
              <div style={{ textAlign: "left" }}>Manager Role Requests</div>
              <div className="table-div">
                <table className="styled-table" id="manager-requests-table">
                  <thead>
                    <tr>
                      <td>First Name</td>
                      <td>Last Name</td>
                      <td>Phone Number</td>
                      <td>Email</td>
                      <td>Actions</td>
                    </tr>
                  </thead>
                  <tbody>
                    {managerRoleRequestList.length > 0 ? managerRoleRequestList.map(i =>
                      <tr>
                        <td>{i.firstName}</td>
                        <td>{i.lastName}</td>
                        <td>{i.phoneNumber}</td>
                        <td>{i.email}</td>
                        <td style={{ display: "flex", gap: "10px" }}>
                          <button type="button" className="mma-btn mma-approve-access-btn" onClick={() => approveManagerRequest(i.email)}>
                            Approve
                          </button>
                          <button type="button" className="mma-btn  mma-reject-access-btn" onClick={() => removeManagerRequest(i.email)}>
                            Reject
                          </button>
                        </td>
                      </tr>
                    ) : <tr><td colSpan={4}> There are no pending requests</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="pad-top-2">
              <div style={{ textAlign: "left" }}>Active Managers</div>
              <div className="table-div">
                <table className="styled-table" id="active-manager-table">
                  <thead>
                    <tr>
                      <td>First Name</td>
                      <td>Last Name</td>
                      <td>Phone Number</td>
                      <td>Email</td>
                      <td>Actions</td>
                    </tr>
                  </thead>
                  <tbody>
                    {activeManagersList.length > 0 ? activeManagersList.map(i =>
                      <tr>
                        <td>{i.firstName}</td>
                        <td>{i.lastName}</td>
                        <td>{i.phoneNumber}</td>
                        <td>{i.email}</td>
                        <td style={{ display: "flex", gap: "10px" }}>
                          <button type="button" className="mma-btn mma-remove-access-btn" onClick={() => removeManagerRequest(i.email)}>
                            Remove Access
                          </button>
                        </td>
                      </tr>
                    ) : <tr><td colSpan={4}> There are no active managers</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="pad-top-2">
              <div style={{ textAlign: "left" }}>Inactive Managers</div>
              <div className="table-div">
                <table className="styled-table" id="inactive-manager-table">
                  <thead>
                    <tr>
                      <td>First Name</td>
                      <td>Last Name</td>
                      <td>Phone Number</td>
                      <td>Email</td>
                      <td>Actions</td>
                    </tr>
                  </thead>
                  <tbody>
                    {inActiveManagersList.length > 0 ? inActiveManagersList.map(i =>
                      <tr>
                        <td>{i.firstName}</td>
                        <td>{i.lastName}</td>
                        <td>{i.phoneNumber}</td>
                        <td>{i.email}</td>
                        <td style={{ display: "flex", gap: "10px" }}>
                          <button type="button" className="mma-btn mma-grant-access-btn" onClick={() => approveManagerRequest(i.email)}>
                            Grant Access
                          </button>
                        </td>
                      </tr>
                    ) : <tr><td colSpan={4}> There are no in active managers</td></tr>}
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

export default ManageManagersAdmin;