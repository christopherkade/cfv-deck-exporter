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

  const getDeckListFromDom = (format = "D") => {
    const cardData = document.querySelectorAll(".card-controller-inner");
    let deckList = "";

    cardData.forEach((data, index) => {
      let name = data.firstChild.title.split(":")[1].trim();
      const number = data.lastChild.innerText;

      name = name.concat(` [${format} Format]`);

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
