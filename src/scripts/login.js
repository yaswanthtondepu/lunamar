function redirectPage() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    if (email == 'resident@lunamar.com') {
        window.location.replace("./resident.html")
        return false;
    }
    else if (email == 'visitor@lunamar.com') {
        window.location.replace("./visitor.html")
        return false;
    }
    else if (email == 'manager@lunamar.com') {
        window.location.replace("./manager.html")
        return false;
    }
    else if (email == 'admin@lunamar.com') {
        window.location.replace("./admin.html")
        return false;
    }
}