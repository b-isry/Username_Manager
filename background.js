chrome.commands.onCommand.addListener((command) => {
    if (command === "open-popup") {
        chrome.tabs.create({
            url: chrome.runtime.getURL("popup.html")
        });
    }
});