document.getElementById("building").onchange = function () {
  document.getElementById("apartment").removeAttribute("disabled");
  document.getElementById("apartment").style.cursor = "pointer";
  document.getElementById("apartment").value = "";
};

function deleteRequest(btn) {
  let row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);
}
