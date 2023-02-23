const deckListInput = document.querySelector("#deck-list-input");

const storeSelect = document.querySelector(".store-select");

const copyButton = document.querySelector(".copy-button");
const aboutButton = document.querySelector(".about-button");
const closeButton = document.querySelector(".close-button");

const copiedIcon = document.querySelector(".copied-icon");
const copyIcon = document.querySelector(".copy-icon");

const wrongPageWrapper = document.querySelector(".wrong-page-wrapper");
const contentWrapper = document.querySelector(".content-wrapper");
const aboutTextWrapper = document.querySelector(".info-text-wrapper");

const CARDMARKET = "Cardmarket";
const TCGPLAYER = "TCGPlayer";
const ALLOWED_URL = "decklog-en.bushiroad.com/view/";

let tabId = null;

copyButton.addEventListener("click", function copyToClipboard() {
  navigator.clipboard.writeText(deckListInput.value);
  copiedIcon.style.display = "inline-block";
  copyIcon.style.display = "none";
});

aboutButton.addEventListener("click", function openAboutSection() {
  aboutTextWrapper.style.display = "inline-block";
});

closeButton.addEventListener("click", function closeAboutSection() {
  aboutTextWrapper.style.display = "none";
});

storeSelect.addEventListener("input", function triggerStoreFormatChange(e) {
  chrome.storage.sync.set({ store: e.target.value });

  chrome.tabs.sendMessage(tabId, {
    type: "store-change",
    data: e.target.value,
  });
});

chrome.runtime.onMessage.addListener(function (request) {
  const { type, data } = request;

  if (type === "deck-list-message") {
    contentWrapper.style.display = "flex";
    wrongPageWrapper.style.display = "none";
    deckListInput.value = data;
  }
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  tabId = tabs[0].id;

  if (!tabs[0].url?.includes(ALLOWED_URL)) {
    contentWrapper.style.display = "none";
    wrongPageWrapper.style.display = "inline-block";
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId },
    files: ["content.js"],
  });
});

const setDefaultSettings = () => {
  chrome.storage.sync.get("store", function (data) {
    storeSelect.value = data.store ? data.store : CARDMARKET;
  });
};

setDefaultSettings();
