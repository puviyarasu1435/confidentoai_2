const { initializeApp } = require('firebase/app');
const { getDatabase } = require("firebase/database");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyDhcWDRTEDHBMqBziVs_wVBrnb3qvLKP1c",
    authDomain: "confidentoai.firebaseapp.com",
    projectId: "confidentoai",
    storageBucket: "confidentoai.appspot.com",
    messagingSenderId: "1049768820403",
    appId: "1:1049768820403:web:97189e129303353dc0fac6"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestoreDb = getFirestore(app);

// Initialize Realtime Database
const realtimeDb = getDatabase(app);

// Export both databases for use in your application
module.exports = {
    firestoreDb,
    realtimeDb,
};
