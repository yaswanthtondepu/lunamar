let selectedApt =
  parseInt(localStorage.getItem("selectedApt")) ||
  document.getElementById("apartment").value;
let selectedBuilding =
  localStorage.getItem("selectedBuilding") ||
  document.getElementById("building").value;

let loading = true;
if (localStorage.getItem("selectedApt")) {
  document.getElementById("apartment").value = selectedApt;
}
if (localStorage.getItem("selectedBuilding")) {
  document.getElementById("building").value = selectedBuilding;
}
function checkApt() {
  selectedApt = document.getElementById("apartment").value;
  selectedBuilding = document.getElementById("building").value;
  localStorage.setItem("selectedApt", selectedApt);
  localStorage.setItem("selectedBuilding", selectedBuilding);
  let title = document.getElementsByClassName("service-table-title");
  let available = document.getElementsByClassName("available-services-title");
  title[0].innerHTML =
    "Services for Apartment " + selectedBuilding + "-" + selectedApt;
  available[0].innerHTML =
    "Available services for " + selectedBuilding + "-" + selectedApt;
  loading = false;
}
document.getElementById("building").onchange = function () {
  if (!loading) {
    document.getElementById("apartment").value = "";
  }
};
// let removeServiceBtn = document.getElementsByClassName("remove-btn");
// function removeService(service) {
//   let row = service.parentNode.parentNode;
//   let tbodyRef = document
//     .getElementById("available-table")
//     .getElementsByTagName("tbody")[0];
//   let newRow = tbodyRef.insertRow();
//   let cellsLength =
//     document.getElementById("available-table").rows[0].cells.length;
//   for (i = 0; i < cellsLength - 1; i++) {
//     let cell = newRow.insertCell(i);
//     cell.innerHTML = row;
//   }
//   row.parentNode.removeChild(row);
// }
