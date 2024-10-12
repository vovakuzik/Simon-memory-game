class RequestsSender {

  constructor(url, callback, isAsync = false) {
    this.url = url;
    this.callback = callback;
    this.isAsync = isAsync;
  }

  httpGet(path = "", headers = {}) {
    var xmlHttp = new XMLHttpRequest();
    // xmlHttp.withCredentials = true;

    let callback = this.callback;
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4)
        callback(xmlHttp.responseText);
    }

    xmlHttp.open("GET", this.url + "/" + path, this.isAsync);

    for (let key in headers)
      xmlHttp.setRequestHeader(key, headers[key]);

    xmlHttp.send(null);
  }

  httpPost(data, path = "", headers = {}) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.withCredentials = true;

      let callback = this.callback;
      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4)
          callback(xmlHttp.responseText);
      }

      xmlHttp.open("POST", this.url + "/" + path, this.isAsync);

      for (let key in headers)
        xmlHttp.setRequestHeader(key, headers[key]);

      xmlHttp.send(data);
  }

  httpPut(data, path = "", headers = {}) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.withCredentials = true;

    let callback = this.callback;
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4)
        callback(xmlHttp.responseText);
    }

    xmlHttp.open("PUT", this.url + "/" + path, this.isAsync);

    for (let key in headers)
      xmlHttp.setRequestHeader(key, headers[key]);

    xmlHttp.send(data);
  }
}

function logCallback(text) {
  console.log(text);
}

function alertCallback(text) {
  alert(text);
}

const devApiURL = "http://127.0.0.1:8000";
const apiURL = "https://d5dsv84kj5buag61adme.apigw.yandexcloud.net";





// Функция для хэширования пароля
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function register() {
  const username = document.getElementById('login').value;
  const password = document.getElementById('password').value;
  const hashedPassword = await hashPassword(password);

  const data = JSON.stringify({
    "login": username,
    "password": hashedPassword
  });

  const sender = new RequestsSender("https://d5dsv84kj5buag61adme.apigw.yandexcloud.net", logCallback);
  sender.httpPost(data ,"players");
}

async function userlogin() {
  const username = document.getElementById('login').value;
  const password = document.getElementById('password').value;
  const hashedPassword = await hashPassword(password);

  const data = JSON.stringify({
    "login": username,
    "password": hashedPassword
  });

  const sender = new RequestsSender("https://d5dsv84kj5buag61adme.apigw.yandexcloud.net", authCallback);
  sender.httpPost(data, "login");
}

function sendScore(){
  const score = document.getElementById('score').value;
  const scoreNumber = parseInt(score);

  const sender = new RequestsSender("https://d5dsv84kj5buag61adme.apigw.yandexcloud.net", logCallback);
  sender.httpPut(JSON.stringify({"score": scoreNumber}),"players/jiku228");
}

function authCallback(text) {
  const data = JSON.parse(text);
  localStorage.setItem(data.message ,"auth");
  console.log(text);
}

function logCallback(text) {
  console.log(text); 
  alert('Ответ сервера: ' + text);
}