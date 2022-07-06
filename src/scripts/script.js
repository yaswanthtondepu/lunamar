const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLink = document.querySelectorAll(".nav-link");
const navDropDown = document.getElementsByClassName("nav-dropdown");
let dropDown = document.getElementsByClassName("dropdown-content");

hamburger.addEventListener("click", openMenu);
navLink.forEach((n) => n.addEventListener("click", closeMenu));

function openMenu() {
  if (dropDown.length > 0) {
    dropDown[0].style.display = "none";
  }
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}
if (navDropDown.length > 0) {
  for (let i = 0; i < navDropDown.length; i++) {
    navDropDown[i].addEventListener("click", openDropDown);
  }
}

function openDropDown() {
  dropDown = document.getElementsByClassName("dropdown-content");
  if (dropDown[0].style.display == "block") {
    dropDown[0].style.display = "none";
  } else {
    dropDown[0].style.display = "block";
  }
}

function logOut() {
  window.location.href = "./login.html"
}