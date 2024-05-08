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
      console.log('route hit')
      return true
    }
    else {
      console.log('route hit')
      return false
    }
  }
}

export default function AppConfig(mode = 'local') {
  console.log("chrome.storage status:",chrome.storage)
  if (chrome.storage != undefined) mode = 'production'
  // console.log('cool')
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
      get_AI_URL: 'http://localhost:3000/Work-Search-App/groqAPI'

    };
  }
  // if (mode == 'custom') {
  //   console.log(localStorage.getItem('disabled'))
  //   return {
  //     Url: ((id) => `https://malcmind.com/WorkSearchApp/Authorize?id=${id}`),
  //     WebSocket: 'wss://cryptoai-production.up.railway.app',
  //     jobApiURL: 'https://malcmind.com/WorkSearchApp/api',
  //     storageDisableTrue: (() => localStorage.setItem('disabled', "true")),
  //     storageDisableFalse: (() => localStorage.setItem('disabled', "false")),
  //     disableStatus: (() => localStorage.getItem('disabled')),
  //     // storageSaveId: (() => localStorage.setItem('id', generateId())),
  //     idStatus: (() => localStorage.getItem('id')),
  //     clearStorage: (() => localStorage.clear()),
  //     storeID: ((id) => localStorage.setItem('id', id)),
  //     idGeneratorURL: 'https://malcmind.com/WorkSearchApp/Authorize/api',
  //     generateID: (() => generateId()),
  //   };
  // }
  if (mode == 'production') {
    return {
      Mode: mode,
      Url: ((id) => `https://malcmind.com/Work-Search-App/Authorize?id=${id}`),
      WebSocket: 'wss://cryptoai-production.up.railway.app',
      submittedJobURL: 'https://malcmind.com/Work-Search-App/',
      jobApiURL: 'https://malcmind.com/Work-Search-App/api',
      storageDisableTrue: (() => chrome.storage.local.set({ 'disabled': "true" })),
      storageDisableFalse: (() => chrome.storage.local.set({ 'disabled': "false" })),
      disableStatus: ((() => chrome.storage.local.get('disabled').then((result) => { return result.disabled; }))),
      // storageSaveId: (() => chrome.storage.local.set({ 'id': generateId() })),
      idStatus: (() => chrome.storage.local.get('id').then((result) => { return result.id; })),
      clearStorage: (() => chrome.storage.local.clear()),
      storeID: ((id) => chrome.storage.local.set({ 'id': id })),
      idGeneratorURL: 'https://malcmind.com/Work-Search-App/Authorize/api',
      generateID: (() => generateId()),
      isAuthorized: (() => authorizedStatus('https://cryptoai-production.up.railway.app/userMap')),
      get_AI_URL: 'https://malcmind.com/Work-Search-App/groqAPI'

    };
  }

};
