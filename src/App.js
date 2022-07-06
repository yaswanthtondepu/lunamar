import logo from './logo.svg';
import './App.css';
import { Route, Switch } from 'react-router';
import About from './components/About';
import Home from './components/Home';
import Services from './components/Services';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import Visitor from './components/Visitor';
import AddNewVisitVisitor from './components/AddNewVisitVisitor';
import VisitorRequestStatus from './components/VisitorRequestStatus';
import RegisterIncidentsVisitor from './components/RegisterIncidentsVisitor';
import Chat from './components/Chat';
import Resident from './components/Resident';
import OccupyApartment from './components/OccupyApartment';
import ManageServicesResident from './components/ManageServicesResident';
import ManageVisitorsResident from './components/ManageVisitorsResident';
import RegisterIncidentsResident from './components/RegisterIncidentsResident';
import ServiceRequestResident from './components/ServiceRequestResident';
import Manager from './components/Manager';
import ManageBuildings from './components/ManageBuildings';
import RegisterApartmentOwners from './components/RegisterApartmentOwners';
import ManageGardenPlants from './components/ManageGardenPlants';
import ManagePoolsManger from './components/ManagePoolsManager';
import ManageVisitorsManager from './components/ManageVisitorsManager';
import CheckInquiriesManager from './components/CheckInquiriesManager';
import MaintenanceRequestsManager from './components/MaintenanceRequestsManager';
import IncidentReportsManager from './components/IncidentReportsManager';
import Admin from './components/Admin';
import ManageManagersAdmin from './components/ManageManagersAdmin';
import ViewReportsAdmin from './components/ViewReportsAdmin';
import UploadFiles from './components/UploadFiles';
import Gallery from './components/Gallery';
import ForgotPassword from './components/ForgotPassword';
import { HashRouter as Router } from 'react-router-dom';
function App() {
  return (
    <div className="App" style={{ height: '100%' }}>
      <Router>
        <Switch>
          <Route path="/" exact><Home /></Route>
          <Route path="/about" exact><About /></Route>
          <Route path="/home" exact><Home /></Route>
          <Route path="/services" exact><Services /></Route>
          <Route path="/contact" exact><Contact /></Route>
          <Route path="/login" exact><Login /></Route>
          <Route path="/signup" exact><Signup /></Route>
          <Route path="/Visitor" exact><Visitor /></Route>
          <Route path="/addNewVisitVisitor" exact><AddNewVisitVisitor /></Route>
          <Route path="/visitorRequestStatus" exact><VisitorRequestStatus /></Route>
          <Route path="/chat" exact><Chat /></Route>
          <Route path="/Resident" exact><Resident /></Route>
          <Route path="/occupyApartment" exact><OccupyApartment /></Route>
          <Route path="/manageServicesResident" exact><ManageServicesResident /></Route>
          <Route path="/manageVisitorsResident" exact><ManageVisitorsResident /></Route>
          <Route path="/registerIncidents" exact><RegisterIncidentsResident /></Route>
          <Route path="/serviceRequestResident" exact><ServiceRequestResident /></Route>
          <Route path="/Manager" exact><Manager /></Route>
          <Route path="/manageBuildings" exact><ManageBuildings /></Route>
          <Route path="/registerApartmentOwners" exact><RegisterApartmentOwners /></Route>
          <Route path="/manageGardenPlants" exact><ManageGardenPlants /></Route>
          <Route path="/managePools" exact><ManagePoolsManger /></Route>
          <Route path='/manageVisitorsManager' exact><ManageVisitorsManager /></Route>
          <Route path="/checkInquiries" exact><CheckInquiriesManager /></Route>
          <Route path="/maintenanceRequestsManager" exact><MaintenanceRequestsManager /></Route>
          <Route path="/incidentReportsManager" exact><IncidentReportsManager /></Route>
          <Route path="/Admin" exact><Admin /></Route>
          <Route path="/manageManagers" exact><ManageManagersAdmin /></Route>
          <Route path="/viewReports" exact><ViewReportsAdmin /></Route>
          <Route path="/uploadFiles" exact><UploadFiles /></Route>
          <Route path="/gallery" exact><Gallery /></Route>
          <Route path="/forgotPassword" exact><ForgotPassword /></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
