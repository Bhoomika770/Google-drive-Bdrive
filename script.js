document.addEventListener("DOMContentLoaded", () => {

const splash = document.getElementById("splash-screen");
const login = document.getElementById("login-page");
const drive = document.getElementById("drive-page");

const loginBtn = document.getElementById("login-btn");
const uploadBtn = document.getElementById("upload-btn");
const uploadArea = document.getElementById("file-upload-area");
const filesContainer = document.getElementById("files-container");

/* Splash → Login */
setTimeout(() => {
splash.style.display = "none";
login.style.display = "flex";
}, 1500);

/* Login */
loginBtn.onclick = () => {
login.style.display = "none";
drive.style.display = "block";
};

/* Upload */
uploadBtn.onclick = () => {
uploadArea.style.display = "block";
};

/* Dummy files */
let files = ["Photo.jpg", "Doc.pdf", "Report.xlsx"];

function renderFiles() {
filesContainer.innerHTML = "";
files.forEach(file => {
const div = document.createElement("div");
div.className = "file";
div.innerText = file;
filesContainer.appendChild(div);
});
}

renderFiles();

});
