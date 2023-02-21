const deckListInput = document.querySelector("#deck-list-input");

const copyButton = document.querySelector(".copy-button");
const aboutButton = document.querySelector(".about-button");
const closeButton = document.querySelector(".close-button");

const copiedIcon = document.querySelector(".copied-icon");
const copyIcon = document.querySelector(".copy-icon");

const wrongPageWrapper = document.querySelector(".wrong-page-wrapper");
const contentWrapper = document.querySelector(".content-wrapper");
const aboutTextWrapper = document.querySelector(".info-text-wrapper");

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

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    files: ["content.js"],
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
