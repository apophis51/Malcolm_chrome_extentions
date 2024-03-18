
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
  let data = await fetch('http://localhost:3000/WorkSearchApp/Authorize/api')
  data = await data.json()
  return data.hash
}

export default function AppConfig(mode = 'local') {
  if (mode == 'local') {
    console.log(localStorage.getItem('disabled'))
    return {
      Url: 'http://localhost:3000/WorkSearchApp/Authorize',
      WebSocket: 'ws://localhost:3532',
      storageDisableTrue: (() => localStorage.setItem('disabled', "true")),
      storageDisableFalse: (() => localStorage.setItem('disabled', "false")),
      storageStatus: (() => localStorage.getItem('disabled')),
      // storageSaveId: (() => localStorage.setItem('id', generateId())),
      idStatus: (() => localStorage.getItem('id')),
      clearStorage: (() => localStorage.clear()),
      storeID: ((id) => localStorage.setItem('id', id)),
      generateID: (() => generateId()),
    };
  }
  if (mode == 'production') {
    return {
      Url: 'https://malcmind.com',
      WebSocket: 'wss://cryptoai-production.up.railway.app',
      storageDisableTrue: (() => chrome.storage.local.set({ 'disabled': "true" })),
      storageDisableFalse: (() => chrome.storage.local.set({ 'disabled': "false" })),
      storageStatus: ((() => chrome.storage.local.get('disabled').then((result) => { return result.disabled; }))),
      // storageSaveId: (() => chrome.storage.local.set({ 'id': generateId() })),
      idStatus: (() => chrome.storage.local.get('id').then((result) => { return result.id; })),
      clearStorage: (() => chrome.storage.local.clear()),
      storeID: ((id) => chrome.storage.local.set({ 'id': id })),
      generateID: (() => generateId()),

    };
  }

};
