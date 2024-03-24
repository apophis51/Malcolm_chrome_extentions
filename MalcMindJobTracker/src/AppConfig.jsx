
// import crypto from 'crypto'

// // function generateId() {
// //   return Math.random().toString(36).substr(2, 9);
// // }

// function generateId(data) {
//   // Create a SHA-256 hash object
//   const hash = crypto.createHash('sha256');

//   // Update the hash object with the data
//   hash.update(data);

//   // Generate the hash in hexadecimal format
//   return hash.digest('hex');
// }
async function generateId(){
  let website = AppConfig().idGeneratorURL
  console.log(website)
  try{
  let data = await fetch(website)
  data = await data.json()
  console.log(data)
  await AppConfig().storeID(data.hash)
  return data.hash
  }
  catch(error){
    console.error('failed to fetch in generateID',error)
  }

}
export default function AppConfig(mode = 'local') {
  if (mode == 'local') {
    console.log(localStorage.getItem('disabled'))
    return {
      Url: ((id) => `http://localhost:3000/WorkSearchApp/Authorize?id=${id}`),
      WebSocket: 'ws://localhost:3532',
      jobApiURL: 'http://localhost:3000/WorkSearchApp/api',
      storageDisableTrue: (() => localStorage.setItem('disabled', "true")),
      storageDisableFalse: (() => localStorage.setItem('disabled', "false")),
      storageStatus: (() => localStorage.getItem('disabled')),
      // storageSaveId: (() => localStorage.setItem('id', generateId())),
      idStatus: (() => localStorage.getItem('id')),
      clearStorage: (() => localStorage.clear()),
      storeID: ((id) => localStorage.setItem('id', id)),
      idGeneratorURL: 'http://localhost:3000/WorkSearchApp/Authorize/api',
      generateID: (() => generateId()),
    };
  }
  if (mode == 'custom') {
    console.log(localStorage.getItem('disabled'))
    return {
      Url: ((id) => `http://localhost:3000/WorkSearchApp/Authorize?id=${id}`),
      WebSocket: 'ws://localhost:3532',
      jobApiURL: 'http://localhost:3000/WorkSearchApp/api',
      storageDisableTrue: (() => chrome.storage.local.set({ 'disabled': "true" })),
      storageDisableFalse: (() => chrome.storage.local.set({ 'disabled': "false" })),
      storageStatus: ((() => chrome.storage.local.get('disabled').then((result) => { return result.disabled; }))),
      // storageSaveId: (() => chrome.storage.local.set({ 'id': generateId() })),
      idStatus: (() => chrome.storage.local.get('id').then((result) => { return result.id; })),
      clearStorage: (() => chrome.storage.local.clear()),
      storeID: ((id) => chrome.storage.local.set({ 'id': id })),
      idGeneratorURL: 'http://localhost:3000/WorkSearchApp/Authorize/api',
      generateID: (() => generateId()),
    };
  }
  if (mode == 'production') {
    return {
      Url: ((id) => `https://malcmind.com/WorkSearchApp/Authorize?id=${id}`),
      WebSocket: 'wss://cryptoai-production.up.railway.app',
      jobApiURL: 'https://malcmind.com/WorkSearchApp/api',
      storageDisableTrue: (() => chrome.storage.local.set({ 'disabled': "true" })),
      storageDisableFalse: (() => chrome.storage.local.set({ 'disabled': "false" })),
      storageStatus: ((() => chrome.storage.local.get('disabled').then((result) => { return result.disabled; }))),
      // storageSaveId: (() => chrome.storage.local.set({ 'id': generateId() })),
      idStatus: (() => chrome.storage.local.get('id').then((result) => { return result.id; })),
      clearStorage: (() => chrome.storage.local.clear()),
      storeID: ((id) => chrome.storage.local.set({ 'id': id })),
      idGeneratorURL: 'https://malcmind.com/WorkSearchApp/Authorize/api',
      generateID: (() => generateId()),

    };
  }

};
