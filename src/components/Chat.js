import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import useWindowDimensions from "./Dimensions";
import '../css/chat.css';
import { Link } from "react-router-dom";
import axios from "axios";
import formatDate from "../formatDate";
import socketClient, { io } from "socket.io-client";
import cloneDeep from 'lodash/cloneDeep';
import { animateScroll } from "react-scroll";
import $ from 'jquery';
const Chat = () => {
  let currentUser1;
  const SERVER = "http://localhost:8081";
  let socket = io(SERVER);
  if (window.sessionStorage.getItem("userDetails")) {
    currentUser1 = JSON.parse(window.sessionStorage.getItem("userDetails"));
    socket.emit("user_connected", currentUser1.userId);
  }
  let currentRole = null;
  if (currentUser1) {
    currentRole = currentUser1.role;
  }
  else {
    currentRole = null;
  }
  const [currentUser, setCurrentUser] = useState({});
  const [inputMessage, setInputMessage] = useState('');
  const { height, width } = useWindowDimensions();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [currentUserMessages, setCurrentUserMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // const scrollToBottom = () => {
  //   messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  // }
  function scrollToBottom() {
    animateScroll.scrollToBottom({
      containerId: "chat-message-container"
    });
  }

  useEffect(scrollToBottom, [currentUserMessages]);
  useEffect(() => {
    getUsers();
    getPreviousChatUsers();
  }, [])
  let i;

  function getUsers() {
    axios({
      method: 'post',
      url: 'http://localhost/Lunamar-Management/php/getUsers.php',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        userId: currentUser1 ? currentUser1.userId : 0
      }
    })
      .then(result => {

        if (result.data) {
          setUsers(result.data);
        }
      })
      .catch(error => console.log(error));
  }
  async function getPreviousChatUsers() {
    axios({
      method: 'post',
      url: 'http://localhost/Lunamar-Management/php/getPreviousChatUsers.php',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        userId: currentUser1 ? currentUser1.userId : 0
      }
    })
      .then(result => {

        if (result) {

          let tempLst = Object.keys(result.data.users).map((key) => result.data.users[key]);
          setChatUsers(tempLst);
        }
      })
      .catch(error => console.log(error));
  }

  function displayChat(userId) {
    setInputMessage('');
    users.forEach((user) => {
      if (user.userId === userId) {
        setCurrentUser(user);
      }
    });
    if (width < 768) {
      document.getElementById('side-bar').style.display = 'none';
      document.getElementById('chat-container').style.display = 'block';
      document.getElementById('chat-container').style.width = '100%';
    }
    //let ajax = new XMLHttpRequest();
    // $.ajax({
    //   url: "http://localhost:8081/get_messages",
    //   method: "POST",
    //   data: {
    //     fromUserId: currentUser1 ? currentUser1.userId : 0,
    //     toUserId: userId
    //   },
    //   success: function (response) {
    //     console.log(response);
    //   }
    // })
    getChatsOfSelectedUser(userId);
  }
  function getChatsOfSelectedUser(userId) {
    axios({
      method: 'post',
      url: 'http://localhost/Lunamar-Management/php/getChatsOfSelectedUser.php',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        userId: currentUser1.userId, selectedUser: userId
      }
    })
      .then(result => {

        if (result.data) {
          setCurrentUserMessages(result.data)
        }
      })
      .catch(error => console.log(error));
  }
  function closeChat() {
    document.getElementById('side-bar').style.display = 'block';
    document.getElementById('chat-container').style.display = 'none';
    document.getElementById('side-bar').style.width = '100%';
  }

  // function showSendMessage() {
  //   let message = document.getElementById("chat-message-input").value;
  //   if (message.length > 0) {
  //     document.getElementById("send-message-icon").style.display = "block";
  //   }
  //   else {
  //     document.getElementById("send-message-icon").style.display = "none";
  //   }
  // }

  function showSearchResults(e) {

    setSearchQuery(e.target.value);

    let chatIds = [];
    let x = [];
    if (chatUsers.length > 0) {
      chatUsers.forEach(y => chatIds.push(y.userId));
    }
    if (searchQuery.length >= 3) {
      users.forEach((user) => {
        if (
          (user.firstName.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1 ||
            user.lastName.toLowerCase().indexOf(searchQuery.toLowerCase()) >
            -1) && !chatIds.includes(user.userId)
        ) {
          x.push(user);
        }
      });
      setFilteredUsers(x);
    } else {
      setFilteredUsers([]);
    }
  }
  function handleKeyUp(e) {
    if (e.keyCode === 13) {
      sendMessage();
    }
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
    let filteredUser = filteredUsers.filter(user => user.userId === chatUserId);
    setFilteredUsers([]);
    chatUsers.unshift(filteredUser[0]);
    setSearchQuery('');
    setCurrentUser(filteredUser[0]);
    chats[0].classList.add("active-chat");
  }

  function showSendMessageBtn(e) {
    setInputMessage(e.target.value);
  }

  function sendMessage(e) {
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

    let dateOnly = yyyy + "-" + mm + "-" + dd;
    let time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    let dateTime = dateOnly + " " + time;
    socket.emit("send_message", {
      fromUserId: currentUser1.userId,
      toUserId: currentUser.userId,
      message: inputMessage,
      sentTime: dateTime
    });
    let x = cloneDeep(currentUserMessages);
    x.push({ fromUserId: currentUser1.userId, toUserId: currentUser.userId, message: inputMessage, sentTime: dateTime });
    setCurrentUserMessages(x);
    setInputMessage('');
  }

  socket.on("user_connected", function (userId) {

  });

  socket.on("new_message", function (data) {
    let x = cloneDeep(currentUserMessages);
    x.push(data);
    let chatIds = [];
    setCurrentUserMessages(x);
    if (chatUsers.length > 0) {
      chatUsers.forEach(y => chatIds.push(y.userId));
    }

    if (!chatIds.includes(data.fromUserId)) {
      getUsers();
      getPreviousChatUsers();
      let z = users.filter(x => x.userId === data.fromUserId);
      setCurrentUser(z[0]);
      //getChatsOfSelectedUser(data.fromUserId);
      // let index;

      // setTimeout(() => {
      //   index = chatUsers.findIndex(x => x.userId === data.fromUserId);
      //   console.log(index);
      //   getChatsOfSelectedUser(data.fromUserId);
      //   Array.from(chats).forEach((element) => {
      //     element.classList.remove("active-chat");
      //   });
      //   chats[index].classList.add("active-chat");
      // }, 1000);

    }
  });
  return (
    currentRole !== null ?
      <>
        <Navbar />
        <div className="chat-main-div">
          <div className="chat-content">
            <div className="side-bar" id="side-bar">
              <div className="search-div">
                <div style={{ width: "fit-content" }}>
                  <input
                    type="text"
                    placeholder="Search users"
                    name="search-users"
                    id="search-users"
                    autoComplete="off"
                    value={searchQuery}
                    onChange={showSearchResults}
                    maxLength="1024"
                  />
                </div>
                <div className="search-results" id="search-results" style={filteredUsers.length > 0 ? { display: "block" } : { display: "none" }}>
                  {filteredUsers.length > 0 ? filteredUsers.map(i => {
                    return (
                      <div className="search-result-user" onClick={() => sendMessageTo(i.userId)}>
                        <div className="search-user-image"></div>
                        <div className="search-results-name-container">
                          <div className="search-results-name">
                            <div>
                              {i.lastName}
                            </div>
                            <div>
                              {i.firstName}
                            </div>
                          </div>
                          <div className='search-results-role'>
                            {i.role}
                          </div>
                        </div>
                      </div>
                    )
                  }) : <div>No users found</div>}
                </div>
              </div>
              <div className="users-div" id="users-div">
                {chatUsers.length > 0 ? chatUsers.map(i => {
                  return (
                    <div className="single-user" onClick={() => displayChat(i.userId)}>
                      <div className="profile-image"></div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div className="name-div">
                          <div>{i.lastName}, {i.firstName}</div>
                        </div>
                        <div style={{ fontSize: "14px", color: "black", textAlign: "left" }}>
                          <div>{i.role}</div>
                        </div>
                      </div>
                    </div>)
                })
                  : <div>Please message someone to show them here</div>}
              </div>
            </div>
            <div className="chat-container" id="chat-container">
              <div className="no-chat" id="no-chat" style={Object.keys(currentUser).length === 0 ? { display: 'flex' } : { display: 'none' }}>
                <div className="no-chat-image"></div>
                <div>Please select a coversation to start messaging</div>
              </div>
              <div className="sigle-user-chat" id="sigle-user-chat" style={Object.keys(currentUser).length !== 0 ? { display: 'block' } : { display: 'none' }}>
                <div className="chat-name-div">
                  <div id="back-arrow" onClick={closeChat}>
                  </div>
                  <div className="chat-profile-img"></div>
                  <div className="chat-name">
                    <div> {currentUser ? currentUser.lastName : ''}, {currentUser ? currentUser.firstName : ''}</div>
                  </div>
                </div>
                <div className="chat-message-container" id="chat-message-container" style={{ backgroundColor: "#f3f2f1" }} ref={messagesEndRef}>
                  {currentUserMessages.length > 0 ? currentUserMessages.map(i => {
                    return (
                      <div style={i.fromUserId === currentUser1.userId ? { display: "flex", justifyContent: "flex-end", width: '100%' }
                        : { display: "flex", justifyContent: "flex-start", width: '100%' }}>
                        <div style={i.fromUserId === currentUser1.userId
                          ? { backgroundColor: "#e5e5f1", display: "flex", flexDirection: "column", margin: "1rem 2rem", padding: "5px", borderRadius: "0 0 0 10px" }
                          : { backgroundColor: "white", display: "flex", flexDirection: "column", margin: "1rem 2rem", padding: "5px", borderRadius: "10px 0 0 0" }}>
                          <div style={{ fontSize: "18px" }}> {i.message}</div>
                          <div style={{ fontSize: "10px" }}>{formatDate(i.sentTime)}</div>
                        </div>
                      </div>
                    )
                  }) : <div></div>}
                </div>
                <div className="send-message-div">
                  <div style={{ flexGrow: "2" }}>
                    <input type="text" placeholder="Type your message..." name="message"
                      value={inputMessage} className="chat-message-input"
                      id="chat-message-input" onChange={showSendMessageBtn}
                      onKeyUp={handleKeyUp}
                      autoComplete="nope" />
                  </div>
                  <div>
                    <div className="send-message-icon" id="send-message-icon" style={inputMessage.length > 0 ? { display: 'block' } : { display: "none" }} onClick={sendMessage}>
                      <div className="send-message-image">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      :
      <>
        <div style={{ marginTop: "200px" }}>

          You are not authorised to access this page. Please
          <Link to="/login" style={{ color: "red" }}> login </Link>  to view this page.
        </div>
      </>
  )
}

export default Chat;