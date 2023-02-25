const deckListInput = document.querySelector("#deck-list-input");

const storeSelect = document.querySelector(".store-select");

const copyButton = document.querySelector(".copy-button");
const aboutButton = document.querySelector(".about-button");
const closeButton = document.querySelector(".close-button");
const setCheckbox = document.querySelector("#set-checkbox");

const copiedIcon = document.querySelector(".copied-icon");
const copyIcon = document.querySelector(".copy-icon");

const footer = document.querySelector(".footer");
const wrongPageWrapper = document.querySelector(".wrong-page-wrapper");
const contentWrapper = document.querySelector(".content-wrapper");
const aboutTextWrapper = document.querySelector(".info-text-wrapper");
const showSetWrapper = document.querySelector(".show-set-wrapper");

const CARDMARKET = "Cardmarket";
const TCGPLAYER = "TCGPlayer";
const ALLOWED_URL = "decklog-en.bushiroad.com/view/";

let tabId = null;

const resetCopyIcon = () => {
  copiedIcon.style.display = "none";
  copyIcon.style.display = "inline-block";
};

// If the store is TCGPlayer, we display the set display checkbox
const handleSetCheckboxDisplay = (store) => {
  if (store === TCGPLAYER) {
    showSetWrapper.style.display = "flex";
    footer.style["grid-template-columns"] = "repeat(3, 1fr)";
    storeSelect.style["grid-column-start"] = "initial";
  } else {
    setCheckbox.checked = false;
    showSetWrapper.style.display = "none";
    footer.style["grid-template-columns"] = "repeat(2, 1fr)";
    storeSelect.style["grid-column-start"] = "none";
  }
};

copyButton.addEventListener("click", function copyToClipboard() {
  navigator.clipboard.writeText(deckListInput.innerText);
  copiedIcon.style.display = "inline-block";
  copyIcon.style.display = "none";
});

aboutButton.addEventListener("click", function openAboutSection() {
  aboutTextWrapper.style.display = "inline-block";
});

closeButton.addEventListener("click", function closeAboutSection() {
  aboutTextWrapper.style.display = "none";
});

setCheckbox.addEventListener("click", function hideOrShowSet(e) {
  const checked = e.target.checked;

  chrome.tabs.sendMessage(tabId, {
    type: "show-set",
    data: {
      store: TCGPLAYER,
      checked,
    },
  });
});

storeSelect.addEventListener("input", function triggerStoreFormatChange(e) {
  const store = e.target.value;

  chrome.storage.sync.set({ store });

  handleSetCheckboxDisplay(store);
  resetCopyIcon();

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
    deckListInput.innerHTML = data;
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
    handleSetCheckboxDisplay(data.store);
  });
};

setDefaultSettings();
