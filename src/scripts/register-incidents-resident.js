document.getElementById("place").onchange = function () {
  let place = document.getElementById("place").value;
  if (place == "other") {
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
document.getElementById("incidentDate").setAttribute("max", today);
document.getElementById("incidentDate").value = today;

function checkDate(e) {
  if (e.target.value > today) {
    document.getElementById("incidentDate").value = "";
  }
}
