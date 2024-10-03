const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDhcWDRTEDHBMqBziVs_wVBrnb3qvLKP1c",
  authDomain: "confidentoai.firebaseapp.com",
  projectId: "confidentoai",
  storageBucket: "confidentoai.appspot.com",
  messagingSenderId: "1049768820403",
  appId: "1:1049768820403:web:97189e129303353dc0fac6"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
module.exports = db;