function sendEmail() {
    document.getElementById('block').style.display = 'block';
    document.getElementById('wait').style.display = 'flex';
    let email = document.getElementById("email").value;
    let firstName = document.getElementById("firstName").value;
    Email.send({
        Host: "smtp.gmail.com",
        Username: "lunamarmanagement@gmail.com",
        Password: "a12345678.",
        To: email,
        From: "lunamarmanagement@gmail.com",
        Subject: "We have recived your message!",
        Body: "Hello " + firstName + "! We have received your message. We will get back to you soon",
    }).then(function (message) {
        alert("mail sent successfully");
        document.getElementById("contact-form").reset();
        document.getElementById('block').style.display = 'none';
        document.getElementById('wait').style.display = 'none';
    });
}