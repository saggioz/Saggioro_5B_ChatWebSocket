const input = document.getElementById("input");
const button = document.getElementById("sendButton");
const chat = document.getElementById("chat");
const userListElement = document.getElementById("userList");
const setNameButton = document.getElementById("ButtonSent");
const usernameInput = document.getElementById("username");
const modal = document.getElementById("nameModal");

const template = "<li class=\"list-group-item\">%MESSAGE</li>";
const messages = [];
const users = [];

const socket = io();

window.onload = () => {
    modal.style.display = "block";
};

setNameButton.onclick = () => {
  const username = usernameInput.value.trim();
  if (username) {
    socket.emit("setName", username);
    modal.style.display = "none";
  }
};

button.onclick = () => {
  socket.emit("message", input.value);
  input.value = "";
};

socket.on("chat", (message) => {
  console.log(message);
  messages.push(message);
  renderChat();
});

socket.on("list", (list) => {
  users.length = 0;
  list.forEach(user => {
    users.push(user.name);
  });
  renderUserList();
});

const renderChat = () => {
  let html = "";
  messages.forEach((message) => {
    const row = template.replace("%MESSAGE", message);
    html += row;
  });
  chat.innerHTML = html;
  window.scrollTo(0, document.body.scrollHeight);
};

const renderUserList = () => {
  userListElement.innerHTML = "";
  users.forEach((user) => {
    const row = `<li class="list-group-item">${user}</li>`;
    userListElement.innerHTML += row;
  });
};