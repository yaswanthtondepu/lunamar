function checkRole(role) {
  let roleId = document.getElementById('roles').value
  if (roleId == 1) {
    document.getElementById("manager-warning").style.visibility = "visible"
  }
  else {
    document.getElementById("manager-warning").style.visibility = "hidden"
  }
}
function validateForm() {
  let password = document.forms["signup"]["password"].value;
  let phone = document.forms["signup"]["phoneNumber"].value;
  let reTypePassword = document.forms["signup"]["retypePassword"].value;
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  if (phone.length != 10) {
    alert("Please check the phone number");
    return false;
  }
  if (!password.match(passwordRegex)) {
    alert("Password must be between 8-15 characters long, contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character")
    return false;
  }
  if (reTypePassword !== password) {
    alert("Passwords do not match. Try again!")
    return false;
  }
}

function showInfo() {
  document.getElementById('password-warning').style.display = 'block';
}

function hideInfo() {
  document.getElementById('password-warning').style.display = 'none';
}

function checkPasswords() {
  let password = document.forms["signup"]["password"].value;
  let reTypePassword = document.forms["signup"]["retypePassword"].value;
  if (reTypePassword !== password) {
    document.getElementById('retype-password-warning').style.display = 'block';
    document.getElementById('retype-password-warning').innerHTML = 'Passwords do not match';
    document.getElementById('retype-password-warning').style.color = 'red';
  }
  else {
    document.getElementById('retype-password-warning').innerHTML = 'Passwords matched. Please proceed';
    document.getElementById('retype-password-warning').style.color = 'green';
    setTimeout(function () { document.getElementById('retype-password-warning').style.display = 'none'; }, 1000)
    //document.getElementById('retype-password-warning').style.display = 'none';
  }
}