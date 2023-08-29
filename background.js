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

function createTab() {
    browser.tabs.create(
        {
            url: "https://drive.google.com",
            pinned: false,
            active: true
        }
    )
};

function handleSearch(gdriveTabs) {
    //console.log("currentTabId: " + currentTabId);
    if (gdriveTabs.length > 0) {
        //console.log("there is a gdriveTabs tab");
        gdriveTabId = gdriveTabs[0].id;
        if (gdriveTabId === currentTabId) {
            //console.log("I'm in the gmail tab");
            browser.tabs.update(previousTab, { active: true, });
        } else {
            //console.log("I'm NOT in the gmail tab");
            previousTab = currentTabId;
            browser.tabs.update(gdriveTabId, { active: true, });
        }
        setButtonIcon(gdriveTabs[0].favIconUrl);
    } else {
        //console.log("there is NO gmail tab");
        previousTab = currentTabId;
        createTab();
    }
};

function handleClick(tab) {
    //console.log("*********Button clicked*********");
    currentTabId = tab.id;
    var querying = browser.tabs.query({ url: "*://drive.google.com/*" });
    querying.then(handleSearch, onError);
};

browser.browserAction.onClicked.addListener(handleClick);
