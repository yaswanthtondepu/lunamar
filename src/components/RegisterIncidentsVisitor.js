import React from "react";
import Navbar from "./Navbar";
import '../css/register-incidents-visitor.css'
const RegisterIncidentsVisitor = () => {
  function CheckPlace() {

    let place = document.getElementById("place").value;
    if (place === "other") {
      document.getElementById("other-place-div").style.display = "block";
    } else {
      document.getElementById("other-place-div").style.display = "none";
      document.getElementById("otherPlace").value = "";
    }

  };

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
  function CheckDate(e) {
    if (e.target.value > today) {
      document.getElementById("incidentDate").value = "";
    }
  }

  return (
    <>
      <Navbar />
      <div className="main-div">
        <div className="main-title">Register incidents</div>
        <div className="content">
          <form>
            <div className="form-div">
              <div className="left-div">
                <select
                  name="building"
                  id="building"
                  title="select a building"
                  required
                  defaultValue
                >
                  <option disabled value>-- Select a building --</option>
                  <option value="b1">B1</option>
                  <option value="b2">B2</option>
                  <option value="b3">B3</option>
                  <option value="b4">B4</option>
                  <option value="b5">B5</option>
                  <option value="b6">B6</option>
                  <option value="b7">B7</option>
                </select>
              </div>
              <div>
                <select
                  name="apartment"
                  id="apartment"
                  title="select an apartment"
                  required
                  defaultValue
                >
                  <option disabled value>
                    -- Select an apartment --
                  </option>
                  <option value="101">101</option>
                  <option value="102">102</option>
                  <option value="103">103</option>
                  <option value="104">104</option>
                </select>
              </div>
            </div>
            <div className="form-div pad-top-2">
              <div className="left-div">
                <div style={{ display: "flex", flexDirection: "column", rowGap: "5px" }}>
                  <label for="place">Place of Incident:</label>
                  <select name="place" id="place" title="Select Place" required onChange={CheckPlace}>
                    <option disabled selected value>-- Select a place --</option>
                    <option value="pr">Pool Area</option>
                    <option value="gr">Garage</option>
                    <option value="bd">Bedroom</option>
                    <option value="ca">Common Area</option>
                    <option value="bp">Balcony/Patio</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", rowGap: "5px" }}>
                <label for="incidentDate">Date of Incident:</label>
                <input
                  type="date"
                  id="incidentDate"
                  name="incidentDate"
                  title="Date of Incident"
                  required
                  max={today}
                  value={today}
                  onBlur={CheckDate}
                />
              </div>
            </div>
            <div className="form-div pad-top">
              <div className="left-div" id="other-place-div">
                <input
                  type="text"
                  id="otherPlace"
                  name="otherPlace"
                  placeholder="Enter place"
                />
              </div>
              <div></div>
            </div>
            <div className="pad-top-2">
              <textarea
                name="description"
                placeholder="More details of the incident"
                required
              ></textarea>
            </div>

            <div className="pad-top-2 btn-div">
              <button type="submit" className="btn submit-btn">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default RegisterIncidentsVisitor;