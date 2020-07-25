import popupHandler from "./popupHandler.js";

// Import File Popup Buttons Click Event Handler Class
import FileHandler from "./file/file.js"
// Import Share Popup Buttons Click Event Handler Class
import SocialShareHandler from "./share/share.js"

var toolbarFileBtn = document.getElementById("toolbar-file-btn");
var toolbarShareBtn = document.getElementById("toolbar-share-btn");
var filePopup = document.getElementById("file-popup");
var sharePopup = document.getElementById("share-popup");
var editor = document.getElementById("editor");

// File Popup Buttons
var fileNewBtn    = document.getElementById("file-new-btn");
var fileOpenBtn   = document.getElementById("file-open-btn");
var fileSaveBtn   = document.getElementById("file-save-btn");
var fileSaveAsBtn = document.getElementById("file-save-as-btn");
var fileCloseBtn  = document.getElementById("file-close-btn");

// Share Popup Buttons
var shareOnWhatsAppBtn = document.getElementById("share-on-whatsapp-btn");
var shareOnTwitterBtn  = document.getElementById("share-on-twitter-btn");
var shareOnEmailBtn    = document.getElementById("share-on-email-btn");

// Menu Popups
var closeFilePopUp = popupHandler(toolbarFileBtn, filePopup);
var closeSharePopUp = popupHandler(toolbarShareBtn, sharePopup);

// File Pupup Button Click Handlers
fileNewBtn.addEventListener("click", FileHandler.new);
fileOpenBtn.addEventListener("click", FileHandler.open.bind(this, closeFilePopUp));
fileSaveBtn.addEventListener("click", FileHandler.save);
fileSaveAsBtn.addEventListener("click", FileHandler.saveAs);
fileCloseBtn.addEventListener("click", FileHandler.close);

// Share Pupup Button Click Handlers
var shareHandler = new SocialShareHandler(editor);
shareOnWhatsAppBtn.addEventListener("click", shareHandler.onWhatsApp);
shareOnTwitterBtn.addEventListener("click", shareHandler.onTwitter);
shareOnEmailBtn.addEventListener("click", shareHandler.onEmail);