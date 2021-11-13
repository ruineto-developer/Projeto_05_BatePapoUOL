function userOptionsOpen() {
  let userOptionsBackgroundElement = document.querySelector(".user-options");
  userOptionsBackgroundElement.classList.add("opacity-show");
  userOptionsBackgroundElement.classList.remove("opacity-hidden");

  let userOptionsElement = document.querySelector(".user-options-content-general");
  userOptionsElement.classList.add("visibility-show");
  userOptionsElement.classList.remove("visibility-hidden");
}

function userOptionsClose() {
  let userOptionsBackgroundElement = document.querySelector(".user-options");
  userOptionsBackgroundElement.classList.add("opacity-hidden");

  let userOptionsElement = document.querySelector(".user-options-content-general");
  userOptionsElement.classList.add("visibility-hidden");
}

function enterLobby() {
  if(userNameInput.value == ""){
    return;
  }

  const loadingScreen = document.querySelector(".loading-screen");
  loadingScreen.classList.remove("loading-screen-show");

  const homeScreen = document.querySelector(".home-screen");
  homeScreen.classList.add("home-screen-hidden");

  let contentGeneral = document.querySelector(".content-general-visibility");
  contentGeneral.classList.add("content-general-to-visibility");
}





function chooseOnlineUser(choosedUser) {
  let chooseOnlineUser = choosedUser.querySelector(".user-flex-li").innerText;
  let bottomBarOnlineUser = document.querySelector(".bottom-bar-content .bottom-bar-user");

  bottomBarOnlineUser.innerText = chooseOnlineUser;

  let choosedUserIconReplace = choosedUser.querySelector(".location-icon");
  const iconCheck = document.querySelector(".user-options-select-users .user-options-checkmark");

  if(iconCheck !== null){
    iconCheck.remove();    
  }

  choosedUserIconReplace.innerHTML = `<i class="fa fa-check user-options-checkmark" aria-hidden="true"></i><!--user-options-checkmark-->`;
}

function chooseTypeMessage(typeMessage) {
  let chooseTypeMessage = typeMessage.querySelector(".user-flex-li").innerText;
  let bottomBarTypeMessage = document.querySelector(".bottom-bar-content .bottom-bar-type-message");

  bottomBarTypeMessage.innerText = chooseTypeMessage;

  let typeMessageIconReplace = typeMessage.querySelector(".location-icon");
  const iconCheck = document.querySelector(".user-options-messagens .user-options-checkmark");

  if(iconCheck !== null){
    iconCheck.remove();
    typeMessageIconReplace.innerHTML = `<i class="fa fa-check user-options-checkmark" aria-hidden="true"></i><!--user-options-checkmark-->`;
  }else{
    typeMessageIconReplace.innerHTML = `<i class="fa fa-check user-options-checkmark" aria-hidden="true"></i><!--user-options-checkmark-->`;
  }
}





const userNameInput = document.querySelector(".home-screen-input");
const Invalidfeedback = document.querySelector(".feedback-message-hidden");
const Invalidfeedback2 = document.querySelector(".feedback2-message-hidden");
let attemptName = false;

function nameUser() {
  if(userNameInput.value == ""){
    userNameInput.classList.add("home-screen-input-invalid");
    Invalidfeedback2.classList.add("feedback2-message-show");

    return;
  }

  const user = {
    name: userNameInput.value,
  }

  const promisseNameUser = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", user);

  promisseNameUser.then(loadingScreen);
  promisseNameUser.catch(reload);

  setInterval(keepConnection, 5000);
  setInterval(listMessagesRequest, 3000);
}

function keepConnection() {
  const userNameInput = document.querySelector(".home-screen-input");

  const user = {
    name: userNameInput.value,
  }

  axios.post("https://mock-api.driven.com.br/api/v4/uol/status", user);
}

function loadingScreen() {
  const defaultScreen = document.querySelector(".default-screen");
  const loadingScreen = document.querySelector(".loading-screen");
  defaultScreen.classList.add("default-screen-hidden");
  loadingScreen.classList.add("loading-screen-show");

  setTimeout(enterLobby, 3000);
}

function reload() {
  window.location.reload(true);
}





let messagesContainer;
let lastMensagePick = "";

function listMessagesRequest() {
  const promisseMessagens = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
  promisseMessagens.then(listMessages);
}

function listMessages(answerMessages) {
  const userNameInput = document.querySelector(".home-screen-input");

  let messages = [];
  messages = answerMessages.data;
  messagesContainer = document.querySelector(".container");

  if(messages[messages.length - 1].time === lastMensagePick.time){
    return;
  }

  messagesContainer.innerHTML = "";
  for(let i = 0; i < messages.length ; i++){
    const message = messages[i];

    if(message.type === "status"){
      messagesContainer.innerHTML += `
      <div class="lobby lobby-enter-leave" data-identifier="message">
        <span class="lobby-content lobby-message-width">
          <!--current-time-->
          <span class="current-time lobby-message-width">${message.time}</span>

          <!--lobby-user-name-->
          <span class="lobby-user-name lobby-message-width">${message.from}</span> <span class="lobby-message-width">${message.text}</span>
        </span><!--lobby-content--> 
      </div><!--lobby-->     
      `;
    }else if(message.type === "private_message"){
      if(message.to === userNameInput.value || message.from === userNameInput.value || message.to === "Todos"){
        messagesContainer.innerHTML += `
        <div class="lobby lobby-private" data-identifier="message">
          <span class="lobby-content lobby-message-width">
            <!--current-time-->
            <span class="current-time lobby-message-width">${message.time}</span>
  
            <!--lobby-user-name-->                                                                       <!--lobby-message-private-->
            <span class="lobby-user-name lobby-message-width">${message.from}</span> reservadamente para <span class="lobby-message-private lobby-message-width">${message.to}</span>: <span class="lobby-message-width">${message.text}</span>
          </span><!--lobby-content-->
        </div><!--lobby-->     
        `;
      }      
    }else{
      messagesContainer.innerHTML += `
      <div class="lobby" data-identifier="message">
        <span class="lobby-content lobby-message-width">
          <!--current-time-->
          <span class="current-time lobby-message-width">${message.time}</span>
      
          <!--lobby-user-name-->                                                        <!--lobby-message-everyone-->
          <span class="lobby-user-name lobby-message-width">${message.from}</span> para <span class="lobby-message-everyone">${message.to}</span>: <span class="lobby-message-width">${message.text}</span>
        </span><!--lobby-content-->
      </div><!--lobby-->   
      `;
    }
  }

  lastMensagePick = messages[messages.length - 1];

  const lastMessage = document.querySelector('.container div:last-child');
  lastMessage.scrollIntoView();
}

let nameContact = "Todos";
let optionMessage = "Público";

function sendMessage() {
  const userNameInput = document.querySelector(".home-screen-input");
  const messageInput = document.querySelector(".bottom-bar-input");

  const checkmarkContact = document.querySelector(".user-options-select-users .user-options-checkmark");
  const checkmarkMessage = document.querySelector(".user-options-messagens .user-options-checkmark");
  
  if(checkmarkContact.parentNode.parentNode.children[0].innerText !== "" && checkmarkMessage.parentNode.parentNode.children[0].innerText !== ""){
    nameContact = checkmarkContact.parentNode.parentNode.children[0].innerText;
    optionMessage = checkmarkMessage.parentNode.parentNode.children[0].innerText;
  }
  
  if(nameContact === "Todos" && optionMessage === "Público"){
    const sendMessageAll = {
      from: userNameInput.value,
      to: "Todos",
      text: messageInput.value,
      type: "message"
    }

    let promisseSendMessageAll = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", sendMessageAll);
    promisseSendMessageAll.catch(reload);

    messageInput.value = "";
  }else if(nameContact !== "Todos" && optionMessage === "Reservadamente"){
    const sendMessagePrivate = {
      from: userNameInput.value,
      to: nameContact,
      text: messageInput.value,
      type: "private_message"
    }

    let promisseSendMessagePrivate = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", sendMessagePrivate);
    promisseSendMessagePrivate.catch(reload);

    messageInput.value = "";
  }else if(nameContact !== "Todos" && optionMessage === "Público"){
    const sendMessageAllTo = {
      from: userNameInput.value,
      to: nameContact,
      text: messageInput.value,
      type: "message"
    }

    let promisseSendMessageAllTo = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", sendMessageAllTo);
    promisseSendMessageAllTo.catch(reload);

    messageInput.value = "";
  }else if(nameContact === "Todos" && optionMessage === "Reservadamente"){
    const sendMessageAllPrivate = {
      from: userNameInput.value,
      to: "Todos",
      text: messageInput.value,
      type: "private_message"
    }

    let promisseSendMessageAllPrivate = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", sendMessageAllPrivate);
    promisseSendMessageAllPrivate.catch(reload);

    messageInput.value = "";
  }
}





let usersContainer;
let userSelect;

function listOnlineUsersRequest() {
  const promisseUsers = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
  promisseUsers.then(listOnlineUsers);
}

setInterval(listOnlineUsersRequest, 10000);
function listOnlineUsers(answerUsers) {
  let users = [];
  users = answerUsers.data;
  usersContainer = document.querySelector(".user-options-select-users ul");

  let optionAll = document.querySelectorAll(".user-options-select-users ul li");
  let iconCheck = document.querySelector(".user-options-select-users .user-options-checkmark");
  let iconLiCheck = iconCheck.parentNode.parentNode;

  userSelect = iconLiCheck.children[0].innerText;

  
  /*
  usersContainer.innerHTML = "";
  usersContainer.innerHTML = optionAll.outerHTML;
  */
 

  if(optionAll.length > 1){
    for(let i = 1; i < optionAll.length ; i++){
      optionAll[i].remove();
    }
  }

  for(let i = 0; i < users.length ; i++){
    const user = users[i];

    if(userSelect == user.name){
      usersContainer.innerHTML += iconLiCheck.outerHTML; 
    }else{
      usersContainer.innerHTML += `
      <li class="user-flex-content" onclick="chooseOnlineUser(this)" data-identifier="participant">
        <div class="user-flex-li">
          <ion-icon class="user-flex-icon" name="person-circle"></ion-icon><!--person-circle--> ${user.name}
        </div>
        <div class="location-icon"></div>
      </li>
      `;      
    } 
  }
}





document.addEventListener("keydown" , function (event) {
  if (event.keyCode !== 13) return;
 
  sendMessage();
});