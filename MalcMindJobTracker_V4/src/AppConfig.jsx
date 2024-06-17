async function generateId() {
  let website = AppConfig().idGeneratorURL
  console.log(website)
  try {
    let data = await fetch(website)
    data = await data.json()
    console.log(data)
    await AppConfig().storeID(data.hash)
    return data.hash
  }
  catch (error) {
    console.error('failed to fetch in generateID', error)
  }

}

async function authorizedStatus(url) {
  let myId = await AppConfig().idStatus()
  if (myId) {
    let result = await fetch(url)
    let resultJson = await result.json()
    console.log(resultJson)
    let authorized = resultJson[myId]
    console.log(myId)
    console.log(authorized)

    if (authorized) {
      return true
    }
    else {
      return false
    }
  }
}

async function codeLogger(message,onOff,type,flavor){

}

export default function AppConfig(mode = 'local') {
  console.log("chrome.storage status:",chrome.storage)
  if (chrome.storage != undefined) mode = 'production'
  // if (chrome.storage != undefined) mode = 'custom'

  // let testLocalStatus = await fetch('http://localhost:5173')
  // console.log(mode)
  // console.log(testLocalStatus.status)
  // console.log(testLocalStatus.status == 200)
  // if (testLocalStatus.status == 200){
  //   console.log('test')
  //   mode = 'local'
  //   console.log('new mode',mode)
  // }
  if (mode == 'local') {
    console.log(localStorage.getItem('disabled'))
    return {
      Mode: mode,
      Url: ((id) => `http://localhost:3000/Work-Search-App/Authorize?id=${id}`),
      WebSocket: 'ws://localhost:3532',
      submittedJobURL: 'http://localhost:3000/Work-Search-App/',
      jobApiURL: 'http://localhost:3000/Work-Search-App/api',
      storageDisableTrue: (() => localStorage.setItem('disabled', "true")),
      storageDisableFalse: (() => localStorage.setItem('disabled', "false")),
      storageHideButtonsFalse:(() => localStorage.setItem('hideButtons', "false")),
      storageHideButtonsTrue:(() => localStorage.setItem('hideButtons', "true")),
      buttonStatus: (() => localStorage.getItem('hideButtons')),
      disableStatus: (() => localStorage.getItem('disabled')),
      // storageSaveId: (() => localStorage.setItem('id', generateId())),
      idStatus: (() => localStorage.getItem('id')),
      clearStorage: (() => localStorage.clear()),
      storeID: ((id) => localStorage.setItem('id', id)),
      idGeneratorURL: 'http://localhost:3000/Work-Search-App/Authorize/api',
      generateID: (() => generateId()),
      isAuthorized: (() => authorizedStatus('http://localhost:3532/userMap')),
      // getJobs: (() => fetch('https://malcmind-strapi-cms-production.up.railway.app/api/job-searches?pagination[page]=1&pagination[pageSize]=80&filters[userEmail][$eqi]=malcolmxvernon@hotmail.com')),
      // get_AI_URL: (()=> fetch('http://localhost:3000/Work-Search-App/groqAPI'))
      get_AI_URL: 'http://localhost:3000/Work-Search-App/groqAPI',
      codeLogger: (()=> codeLogger()),
      get_Job_Rejections: 'http://localhost:3000/Work-Search-App/api-job-rejections',

    };
  }
  if (mode == 'custom') {
    return {
      Mode: mode,
      Url: ((id) => `http://localhost:3000/Work-Search-App/Authorize?id=${id}`),
      WebSocket: 'ws://localhost:3532',
      submittedJobURL: 'http://localhost:3000/Work-Search-App/',
      jobApiURL: 'http://localhost:3000/Work-Search-App/api',
      storageDisableTrue: (() => chrome.storage.local.set({ 'disabled': "true" })),
      storageDisableFalse: (() => chrome.storage.local.set({ 'disabled': "false" })),
      storageHideButtonsFalse:(() => chrome.storage.local.set({ 'hideButtons': "false" })),
      storageHideButtonsTrue:(() => chrome.storage.local.set({ 'hideButtons': "true" })),
      buttonStatus: (() => chrome.storage.local.get('hideButtons').then((result) => { return result.hideButtons; })),
      disableStatus: ((() => chrome.storage.local.get('disabled').then((result) => { return result.disabled; }))),
      // storageSaveId: (() => chrome.storage.local.set({ 'id': generateId() })),
      idStatus: (() => chrome.storage.local.get('id').then((result) => { return result.id; })),
      clearStorage: (() => chrome.storage.local.clear()),
      storeID: ((id) => chrome.storage.local.set({ 'id': id })),
      idGeneratorURL: 'http://localhost:3000/Work-Search-App/Authorize/api',
      generateID: (() => generateId()),
      isAuthorized: (() => authorizedStatus('http://localhost:3532/userMap')),
      get_AI_URL: 'http://localhost:3000/Work-Search-App/groqAPI',
      codeLogger: (()=> codeLogger()),
      get_Job_Rejections: 'http://localhost:3000/Work-Search-App/api-job-rejections',

    };
  }
  if (mode == 'production') {
    return {
      Mode: mode,
      Url: ((id) => `https://malcmind.com/Work-Search-App/Authorize?id=${id}`),
      WebSocket: 'wss://cryptoai-production.up.railway.app',
      submittedJobURL: 'https://malcmind.com/Work-Search-App/',
      jobApiURL: 'https://malcmind.com/Work-Search-App/api',
      storageDisableTrue: (() => chrome.storage.local.set({ 'disabled': "true" })),
      storageDisableFalse: (() => chrome.storage.local.set({ 'disabled': "false" })),
      storageHideButtonsFalse:(() => chrome.storage.local.set({ 'hideButtons': "false" })),
      storageHideButtonsTrue:(() => chrome.storage.local.set({ 'hideButtons': "true" })),
      buttonStatus: (() => chrome.storage.local.get('hideButtons').then((result) => { return result.hideButtons; })),
      disableStatus: ((() => chrome.storage.local.get('disabled').then((result) => { return result.disabled; }))),
      // storageSaveId: (() => chrome.storage.local.set({ 'id': generateId() })),
      idStatus: (() => chrome.storage.local.get('id').then((result) => { return result.id; })),
      clearStorage: (() => chrome.storage.local.clear()),
      storeID: ((id) => chrome.storage.local.set({ 'id': id })),
      idGeneratorURL: 'https://malcmind.com/Work-Search-App/Authorize/api',
      generateID: (() => generateId()),
      isAuthorized: (() => authorizedStatus('https://cryptoai-production.up.railway.app/userMap')),
      get_AI_URL: 'https://malcmind.com/Work-Search-App/groqAPI',
      codeLogger: (()=> codeLogger()),
      get_Job_Rejections: 'https://malcmind.com/Work-Search-App/api-job-rejections',

    };
  }

};
