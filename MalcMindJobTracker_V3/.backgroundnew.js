checkStatus()
 console.log('#1 first console.log in backgorund.js')

let tabStatusTracker = {}
// console.log('#2 this is the active tab', activeInfo.tabId)  - this caused the function to fail
// chrome.storage.local.get('disabled').then((result) => { return result.disabled; })
// let currentTab = activeInfo.tabId //testing
// let status = await chrome.storage.local.get('disabled') //testing
//chrome.storage.local.set({currentTab : status}); //testing

async function checkStatus() {
  console.log('checkstatus triggered')
  let status = await chrome.storage.local.get('disabled') //testing
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
  console.log('#webworker got a == message')
  console.log(message)
  if (message.action == "updateStatus" && message.value == "true") {
    console.log('we are setting the tab to OFF')
    try {
      await chrome.action.setBadgeText({
        // tabId: sender.tab.id,
        text: "OFF"
      });
    }
    catch (error) {
      console.log('error', error)
    }

  }
  if (message.action == "updateStatus" && message.value == "false") {
    console.log('we are setting the tab to ON')
    try {
      await chrome.action.setBadgeText({
        // tabId: sender.tab.id,
        text: "ON"
      });
    }
    catch (error) {
      console.log('error', error)
    }

  }
  if (message.action == "disabledStatus") {
    let currentStatus = await chrome.action.getBadgeText({ tabId: sender.tab.id })
    if (currentStatus == "ON") currentStatus = "false"
    if (currentStatus == "OFF") currentStatus = "true"
    console.log("our disabled status is", message.value)
    if (currentStatus != message.value) chrome.tabs.reload()
  }
  //  chrome.tabs.reload()
});




/**
 * listner will only be added once even with multiple clicks
 * cuz the background service workers are terminated withen the worker stops
 */
chrome.tabs.onActivated.addListener(async function (activeInfo) {
  let status = await chrome.storage.local.get('disabled') //testing
  console.log('#onActivated disabled status', status)
  //chrome.storage.local.set({currentTab : status}); //testing
  console.log('#OnActivated background.js flagship test')
  let activeStatus = (activeInfo.tabId).toString()
  console.log('background.js activeTabInfo Function:', activeStatus)
  ///////test
  let prevState = null
  try {
    prevState = await chrome.action.getBadgeText({ tabId: activeInfo.id })
  }
  catch (error) {
    console.log("failed promise", error)
  }
  console.log('####the prevstate is ', prevState)
  if (prevState == null || prevState == undefined) {
    console.log('### altering the prevState')
    await chrome.action.setBadgeText({
    text: 'OFF'
  });}
  console.log('#Onactivated prevstate:', prevState)
  console.log('#2 background.js onactivated prevState:', prevState)
  let appStatus = null
  console.log("active Info", activeInfo)
  await chrome.tabs.sendMessage(activeInfo.tabId, { action: "getDisabledStatus" })
  try {
    appStatus = await chrome.storage.local.get(activeStatus).then((result) => { return result.activeStatus })
    console.log('#Onactivated saved chromestorage appstatus is:', appStatus)
  }
  catch {
    if (prevState == 'OFF') {
      await chrome.storage.local.set({ activeStatus: "false" })
      console.log('testpoint27')
      console.log(await chrome.storage.local.get(activeStatus))
      appStatus = await chrome.storage.local.get(activeStatus).then((result) => { return result.activeStatus })
    }
    else if (prevState == 'ON') {
      await chrome.storage.local.set({ activeStatus: "true" })
      console.log('testpoint 28')
      console.log(await chrome.storage.local.get(activeStatus))

      appStatus = await chrome.storage.local.get(activeStatus).then((result) => { return result.activeStatus })

    }
  }
  ////////test
  chrome.tabs.sendMessage(activeInfo.tabId, { action: "fuckface" })
  // Use the chrome.runtime.reload() function to reload the extension
  // let disabledStatus = await chrome.storage.local.get('disabled').then((result) => { return result.disabled; })
  // console.log("background.js onactivated disabled status", disabledStatus) 
  console.log("background.js: current status", tabStatusTracker)
  console.log("background.js: tabStatusTracker", tabStatusTracker[activeInfo.tabId])


  // console.log('#3 backgroundjs appstatus:', appStatus,'and disabledStatus:', disabledStatus)
  // if (disabledStatus == appStatus ){}
  // if (disabledStatus != appStatus){
  //   await chrome.storage.local.set({ activeStatus: disabledStatus })
  //   chrome.tabs.reload()
  // }
  //depricating this
  // if (tabStatusTracker[activeInfo.tabId] != disabledStatus) {
  //   tabStatusTracker[activeInfo.tabId] = disabledStatus
  //   chrome.tabs.reload();
  // }
  //end deprication
  // chrome.runtime.reload();
});

/**
 * executed when the user clicks on the extention action
 * listner will only be added once even with multiple clicks
 * cuz the background service workers are terminated withen the worker stops
 */
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


