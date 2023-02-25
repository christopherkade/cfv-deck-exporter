{
  const CARDMARKET = "Cardmarket";
  const TCGPLAYER = "TCGPlayer";

  const sendDeckListMessage = (deckList) => {
    if (!deckList) return;

    chrome.runtime.sendMessage({
      type: "deck-list-message",
      data: deckList,
    });
  };

  // https://www.cardmarket.com/en/Vanguard/Expansions
  const parseCardFormat = (deckFormat, cardFormat) => {
    if (deckFormat === "Standard") return "D";
    if (deckFormat === "V Premium") return "V";

    const legacySets = {
      G: ["G-", "D-PS", "V-SS01", "V-SS07", "V-SS09"],
      P: ["D-PS"],
    };

    const format = Object.keys(legacySets).find((setsArray) =>
      legacySets[setsArray].find((set) => cardFormat.includes(set))
    );

    return format;
  };

  const getDeckListFromDom = (store = CARDMARKET, showSet = false) => {
    const deckFormat = document
      .querySelector(".deck-preview-top-info")
      ?.firstChild.innerHTML.split(":")[1]
      .trim();
    const cardData = document.querySelectorAll(".card-controller-inner");
    let deckList = "";

    cardData.forEach((data, index) => {
      const cardTitle = data.firstChild.title;
      const cardFormat = cardTitle.split("/")[0];
      const parsedFormat = parseCardFormat(deckFormat, cardFormat);
      let name = cardTitle.split(/:(.*)/s)[1].trim();
      const number = data.lastChild.innerText;

      if (store === CARDMARKET) {
        name = name.concat(` [${parsedFormat} Format]`);
      } else if (store === TCGPLAYER) {
        name = name.replaceAll("'", '"');

        if (showSet) {
          name = name.concat(` [${cardFormat}]`);
        }
      }

      if (index > 0) {
        deckList = deckList.concat("<br />", `${number} ${name}`);
      } else {
        deckList = deckList.concat(`${number} ${name}`);
      }
    });

    sendDeckListMessage(deckList);
  };

  chrome.runtime.onMessage.addListener((message) => {
    const { type, data } = message;

    if (type === "store-change") {
      getDeckListFromDom(data);
    } else if (type === "show-set") {
      getDeckListFromDom(data.store, data.checked);
    }
  });

  // On launch, get the user's saved store and generate the card list
  chrome.storage.sync.get("store", function ({ store }) {
    getDeckListFromDom(store);
  });
}
