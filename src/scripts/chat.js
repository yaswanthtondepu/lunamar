userId = 1;
let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
let users = [
    { userId: 1, firstName: "Yaswanth", lastName: "Tondepu", role: "Admin" },
    { userId: 2, firstName: "Sunil", lastName: "Aleti", role: "Manager" },
    { userId: 3, firstName: "Sampath", lastName: "Macharla", role: "Manager" },
    { userId: 4, firstName: "Test", lastName: "Test", role: "Visitor" },
    { userId: 5, firstName: "Admin", lastName: "Admin", role: "Admin" },
    { userId: 6, firstName: "Manager", lastName: "Manager", role: "Manager" },
    { userId: 7, firstName: "Resident", lastName: "Resident", role: "Resident" },
    { userId: 8, firstName: "Resident", lastName: "Resident", role: "Resident" },
    { userId: 9, firstName: "Resident", lastName: "Resident", role: "Resident" },
    { userId: 10, firstName: "Resident", lastName: "Resident", role: "Resident" },
];

let chatUsers = [
    { userId: 2, firstName: "Sunil", lastName: "Aleti", role: "Manager" },
    { userId: 3, firstName: "Sampath", lastName: "Macharla", role: "Manager" },
    { userId: 4, firstName: "Test", lastName: "Test", role: "Visitor" },
    { userId: 5, firstName: "Admin", lastName: "Admin", role: "Admin" },
    { userId: 6, firstName: "Manager", lastName: "Manager", role: "Manager" },
];
let chatResults = document.getElementById("users-div");
function currentChat() {
    let output = "";
    for (i = 0; i < chatUsers.length; i++) {
        output +=
            '<div id="chatUser-' +
            chatUsers[i].userId +
            '" class="single-user" onclick="displayChat(' +
            chatUsers[i].userId +
            ')"><div class="profile-image"></div><div class="name-div"><div>' +
            chatUsers[i].lastName +
            "</div><div>" +
            chatUsers[i].firstName +
            "</div></div></div>";
    }
    chatResults.innerHTML = output;
}
currentChat();

let singleUserChat = document.getElementById("sigle-user-chat");
function displayChat(chatUserId) {
    let currentUser;
    users.forEach((user) => {
        if (user.userId == chatUserId) {
            currentUser = user;
        }
    });
    document.getElementById("no-chat").style.display = "none";
    let output = "";
    output = '<div class="chat-name-div"> <div id="back-arrow" onclick="closeChat()"></div><div class="chat-profile-img"></div><div class="chat-name"><div>' + currentUser.lastName + ' </div><div>' + currentUser.firstName + '</div></div></div><div class="chat-message-container"></div><div class="send-message-div"><div style="flex-grow: 2"><input type="text" placeholder="Type your message..."name="message" class="chat-message-input" id="chat-message-input"/></div><div><div class="send-message-icon" id="send-message-icon"><div class="send-message-image"></div></div></div></div>';
    singleUserChat.innerHTML = output;
    document.getElementById("chat-message-input").addEventListener("keyup", showSendMessage);
    if (width < 768) {
        document.getElementById('side-bar').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';
        document.getElementById('chat-container').style.width = '100%';
    }
}

function closeChat() {
    document.getElementById('side-bar').style.display = 'block';
    document.getElementById('chat-container').style.display = 'none';
    document.getElementById('side-bar').style.width = '100%';
}

function showSendMessage() {
    let message = document.getElementById("chat-message-input").value;
    if (message.length > 0) {
        document.getElementById("send-message-icon").style.display = "block";
    }
    else {
        document.getElementById("send-message-icon").style.display = "none";
    }
}

let filteredUsers = [];

let searchResults = document.getElementById("search-results");

function addUsers() {
    let output = "";
    for (i = 0; i < filteredUsers.length; i++) {
        output +=
            '<div id="searchUser-' +
            filteredUsers[i].userId +
            '" class="search-result-user" onclick= sendMessageTo(' + filteredUsers[i].userId + ')><div class="search-user-image"></div><div class="search-results-name-container"><div class="search-results-name"><div>' +
            filteredUsers[i].lastName +
            "</div><div>" +
            filteredUsers[i].firstName +
            "</div></div><div class='search-results-role'>" +
            filteredUsers[i].role +
            "</div></div></div>";
    }
    searchResults.innerHTML = output;
}

document
    .getElementById("search-users")
    .addEventListener("keyup", showSearchResults);

function showSearchResults() {
    let searchQuery = document.getElementById("search-users").value;
    let chatIds = []
    chatUsers.forEach(x => chatIds.push(x.userId));
    if (searchQuery.length >= 3) {
        filteredUsers = [];
        users.forEach((user) => {
            if (
                (user.firstName.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1 ||
                    user.lastName.toLowerCase().indexOf(searchQuery.toLowerCase()) >
                    -1) &&
                user.userId != userId && !chatIds.includes(user.userId)
            ) {
                filteredUsers.push(user);
            }
        });
        addUsers();
        document.getElementById("search-results").style.display = "block";
    } else {
        document.getElementById("search-results").style.display = "none";
        searchResults.innerHTML = "";
        filteredUsers = [];
    }
}

function hideSearchResults() {
    document.getElementById("search-users").value = "";
    document.getElementById("search-results").style.display = "none";
    searchResults.innerHTML = "";
    filteredUsers = [];
}

const chats = document.getElementsByClassName("single-user");

Array.from(chats).forEach((element) => {
    element.addEventListener("click", () => {
        Array.from(chats).forEach((element) => {
            element.classList.remove("active-chat");
        });
        element.classList.add("active-chat");
    });
});

function sendMessageTo(chatUserId) {
    let msg = filteredUsers.filter(user => user.userId == chatUserId);
    chatUsers.unshift(msg[0]);
    currentChat();
    hideSearchResults()
}