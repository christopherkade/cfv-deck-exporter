const input = document.querySelector("#deck-list-input");
const copyButton = document.querySelector(".copy-button");
const copiedIcon = document.querySelector(".copied-icon");
const copyIcon = document.querySelector(".copy-icon");
const wrongPageWrapper = document.querySelector(".wrong-page-wrapper");
const contentWrapper = document.querySelector(".content-wrapper");

copyButton.addEventListener("click", function copyToClipboard() {
  navigator.clipboard.writeText(input.value);
  copiedIcon.style.display = "inline-block";
  copyIcon.style.display = "none";
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id, allFrames: true },
    files: ["content.js"],
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { type, data } = request;

  if (type === "deck-list-message") {
    contentWrapper.style.display = "inline-block";
    wrongPageWrapper.style.display = "none";
    input.value = data;
  }
});
