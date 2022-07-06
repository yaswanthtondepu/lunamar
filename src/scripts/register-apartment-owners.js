let ownerDetails = document.getElementsByClassName("owner-details");
function hideResidentDetails() {
  ownerDetails[0].style.display = "none";
}

function showResidentDetails() {
  let residentEmail = document.getElementById("resident-email").value;
  if (residentEmail.trim().length > 3) {
    ownerDetails[0].style.display = "flex";
    document.getElementById("display-email").innerHTML = residentEmail;
  }
}

document
  .getElementById("reset-resgister-owner-btn")
  .addEventListener("click", hideResidentDetails);
