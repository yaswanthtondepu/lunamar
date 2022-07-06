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
document.getElementById("resident-incidentDate").setAttribute("max", today);
document.getElementById("resident-incidentDate").value = today;
document.getElementById("visitor-incidentDate").setAttribute("max", today);
document.getElementById("visitor-incidentDate").value = today;

function checkResIncDate(e) {
  if (e.target.value > today) {
    document.getElementById("resident-incidentDate").value = "";
  }
}
function checkVisIncDate(e) {
  if (e.target.value > today) {
    document.getElementById("visitor-incidentDate").value = "";
  }
}
