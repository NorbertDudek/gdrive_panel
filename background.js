let currentTabId;
let gmailTabId;
let previousTab;

function onError(e) {
    console.log("***Error: " + e);
};

function setButtonIcon(imageURL) {
    try {
        browser.browserAction.setIcon({ path: imageURL });
    } catch (e) {
        onError(e);
    }
};

function createPinnedTab() {
    browser.tabs.create(
        {
            url: "https://drive.google.com",
            pinned: false,
            active: true
        }
    )
};

function handleSearch(gmapTabs) {
    //console.log("currentTabId: " + currentTabId);
    if (gmapTabs.length > 0) {
        //console.log("there is a gmail tab");
        gmailTabId = gmapTabs[0].id;
        if (gmailTabId === currentTabId) {
            //console.log("I'm in the gmail tab");
            browser.tabs.update(previousTab, { active: true, });
        } else {
            //console.log("I'm NOT in the gmail tab");
            previousTab = currentTabId;
            browser.tabs.update(gmailTabId, { active: true, });
        }
        setButtonIcon(gmapTabs[0].favIconUrl);
    } else {
        //console.log("there is NO gmail tab");
        previousTab = currentTabId;
        createPinnedTab();
    }
};

function handleClick(tab) {
    //console.log("*********Button clicked*********");
    currentTabId = tab.id;
    var querying = browser.tabs.query({ url: "*://drive.google.com/*" });
    querying.then(handleSearch, onError);
};

function update(details) {
    if (details.reason === "install" || details.reason === "update") {
        browser.runtime.openOptionsPage();
    }
};

browser.browserAction.onClicked.addListener(handleClick);
browser.runtime.onInstalled.addListener(update);

browser.storage.sync.get("checkMailTime").then(function (item) {
    var checkMailTime = item.checkMailTime || 1;
    setCheckMailTimeOut(checkMailTime);
});