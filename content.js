{
  const sendDeckListMessage = (deckList) => {
    if (!deckList) {
      chrome.runtime.sendMessage({
        type: "wrong-page",
        data: null,
      });
      return;
    }

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

  const getDeckListFromDom = (format = "D") => {
    const deckFormat = document
      .querySelector(".deck-preview-top-info")
      .firstChild.innerHTML.split(":")[1]
      .trim();
    const cardData = document.querySelectorAll(".card-controller-inner");
    let deckList = "";

    cardData.forEach((data, index) => {
      const cardTitle = data.firstChild.title;
      const cardFormat = cardTitle.split("/")[0];
      const parsedFormat = parseCardFormat(deckFormat, cardFormat);
      let name = cardTitle.split(":")[1].trim();
      const number = data.lastChild.innerText;

      name = name.concat(` [${parsedFormat} Format]`);

      if (index > 0) {
        deckList = deckList.concat("\n", `${number} ${name}`);
      } else {
        deckList = deckList.concat(`${number} ${name}`);
      }
    });

    sendDeckListMessage(deckList);
  };

  getDeckListFromDom();
}
