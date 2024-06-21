chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: "checkArtContextMenu",
        title: "Check AI Art",
        contexts: ["image"]
    });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "checkArtContextMenu") {
        console.log('Context menu item clicked');

        // Fetch the URL of the clicked image
        const imageURL = info.srcUrl;
        console.log('Image URL:', imageURL);

        // Send a message to the content script to create the overlay
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tab.id, { action: "createOverlay", imageURL: imageURL });
        });
    }
});



