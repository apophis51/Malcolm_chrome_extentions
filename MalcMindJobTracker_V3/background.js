checkStatus()

let tabStatusTracker = {}

async function checkStatus() {
  console.log('checkstatus triggered')
  let status = await chrome.storage.local.get('disabled')
  console.log(status.disabled)
  if (status.disabled == 'false') {
    console.log('the status is enabled and ON')
    chrome.action.setBadgeText({
      text: 'ON'
    });
  }
  if (status.disabled == 'true') {
    console.log('disabled and Off')
    chrome.action.setBadgeText({
      text: 'OFF'
    });
  }
}

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.action.setBadgeText({
//     text: 'OFF'
//   });
//   console.log('clicked')
// });

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
 tabStatusTracker[sender.tab.id] = message.value
 console.log(tabStatusTracker)
  console.log('triggered on message')
  console.log(message)
  if (message.action == "updateStatus" && message.value == "true") {
    console.log('we are setting the tab to OFF')
    await chrome.action.setBadgeText({
      // tabId: sender.tab.id,
      text: "OFF"
    });
  }
  if (message.action == "updateStatus" && message.value == "false") {
    console.log('we are setting the tab to ON')

    await chrome.action.setBadgeText({
      // tabId: sender.tab.id,
      text: "ON"
    });
  }
  //  chrome.tabs.reload()
});

chrome.tabs.onActivated.addListener(async function(activeInfo) {
  chrome.tabs.sendMessage(activeInfo.tabId,{action: "fuckface"})
  // Use the chrome.runtime.reload() function to reload the extension
  console.log(activeInfo.tabId)
  let disabledStatus = await chrome.storage.local.get('disabled').then((result) => { return result.disabled; })
  console.log("onactivated disabled status", disabledStatus) 
  console.log('current status', tabStatusTracker)
  if (tabStatusTracker[activeInfo.tabId] != disabledStatus) {
    tabStatusTracker[activeInfo.tabId] = disabledStatus
    chrome.tabs.reload();
  }
  // chrome.tabs.reload()
  // chrome.runtime.reload();
});

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  console.log('clicked')
  // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  // Next state will always be the opposite
  const nextState = prevState === 'ON' ? 'OFF' : 'ON';

  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    // tabId: tab.id,
    text: nextState
  });

  if (nextState === 'ON') {
    await chrome.storage.local.set({ 'disabled': "false" })
    console.log('Value is set to "false"');

    let result = await chrome.storage.local.get('disabled').then((result) => { return result.disabled; })
    console.log(result)

  } else if (nextState === 'OFF') {
    await chrome.storage.local.set({ 'disabled': "true" });
    console.log('Value is set to "true"');

    let result = await chrome.storage.local.get('disabled').then((result) => { return result.disabled; })

    console.log(result)
    // chrome.tabs.reload(tab.id);
  }
  chrome.tabs.reload()

});


