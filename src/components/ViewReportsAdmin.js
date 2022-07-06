import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import '../css/view-reports-admin.css';
import Chart from "react-google-charts";
import { Link } from "react-router-dom";
import axios from "axios";
const ViewReportsAdmin = () => {
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
    getVisitorsCount();
  }, []);
  const [buildings, setBuildings] = useState([]);
  const [showChart, setShowChart] = useState('');
  const [visitsList, setVisitsList] = useState([]);
  async function getBuildings() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getBuildingReports.php'
    }

    let res = await axios(config)
    setBuildings(res.data);
  }
  async function getVisitorsCount() {
    const config = {
      method: 'get',
      url: 'https://vxt9613.uta.cloud/Lunamar-Management/php/getVisitorsReport.php'
    }

    let res = await axios(config)
    setVisitsList(res.data);
  }
  let ctmData = [[
    'Building',
    'Total',
    'Occupied',
    'Unoccupied',
  ]];
  buildings.forEach(x => ctmData.push([x.buildingName, parseInt(x.Total), parseInt(x.occupied), parseInt(x.unOccupied)]));

  let ctmVisitorData = [
    ['Buildings', 'Visitor Count']
  ];
  visitsList.forEach(x => ctmVisitorData.push([x.buildingName, parseInt(x.visitorsCount)]))
  function changeChart(e) {
    let option = e.target.value;
    setShowChart(option);
  }
  return (
    currentRole === "Admin" ?
      <>
        <Navbar />
        <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
        <div className="main-div">
          <div className="main-title">View Reports</div>
          <div className="vra-content">
            <div className="vra-filters">
              <div>
                <select
                  name="filter1"
                  id="filter1"
                  title="select an option"
                  required
                  value={showChart}
                  onChange={changeChart}
                >
                  <option disabled value=''>-- Choose an option --</option>
                  <option value="building">Building occupancy</option>
                  <option value="visits">Visits</option>
                </select>
              </div>
            </div>
            <div className="empty" id="empty" style={showChart === '' ? { display: "flex" } : { display: "none" }}>
              <div>Please select an option to view the reports</div>
            </div>
            <div>
              <div id="building-reports" style={showChart === 'building' ? { display: "block" } : { display: "none" }}>
                <Chart
                  width={'800px'}
                  height={'300px'}
                  chartType="ComboChart"
                  loader={<div>Loading Chart</div>}
                  data={ctmData}
                  options={{
                    title: 'Building Occupancy',
                    vAxis: { title: 'Numbers' },
                    hAxis: { title: 'Buildings' },
                    seriesType: 'bars',
                    series: { 3: { type: 'line' } },
                  }}
                  rootProps={{ 'data-testid': '1' }}
                />
              </div>
              <div id="visit-reports" style={showChart === 'visits' ? { display: "block" } : { display: "none" }}>
                <Chart
                  width={'500px'}
                  height={'300px'}
                  chartType="PieChart"
                  loader={<div>Loading Chart</div>}
                  data={ctmVisitorData}
                  options={{
                    title: 'Visitors'
                  }}
                  rootProps={{ 'data-testid': '1' }}
                />
              </div>
            </div>
          </div>
        </div>

      </>
      :
      <>
        <div style={{ marginTop: "200px" }}>

          You are not authorised to access this page. Please
          <Link to="/login" style={{ color: "red" }}> login </Link> with admin role to view this page.
        </div>

      </>
  )
}

export default ViewReportsAdmin;