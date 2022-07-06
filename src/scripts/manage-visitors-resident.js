function setToDate(e) {
  let toDate = document.getElementById("toDate");
  toDate.setAttribute("min", e.target.value);
  toDate.value = "";
}

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
document.getElementById("visitInDate").setAttribute("min", today);

function setVisitOutDate(e) {
  if (e.target.value < today) {
    document.getElementById("visitInDate").value = "";
  }
  let toDate = document.getElementById("visitOutDate");
  toDate.setAttribute("min", e.target.value);
  toDate.value = "";
}
document.getElementById("add-visit-btn").onclick = function () {
  document.getElementById("add-visit").style.display = "none";
  document.getElementById("parent-visit-form").style.display = "flex";
};

function hideForm() {
  document.getElementById("add-visit").style.display = "flex";
  document.getElementById("parent-visit-form").style.display = "none";
}
