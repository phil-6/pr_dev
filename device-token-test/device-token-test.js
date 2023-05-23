// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getMessaging, getToken } from "https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.0/firebase-messaging.min.js";

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyAq0oMcCWPBRP2qMsC0P6BgaxIIydzZESg",
    authDomain: "device-token-test.firebaseapp.com",
    projectId: "device-token-test",
    storageBucket: "device-token-test.appspot.com",
    messagingSenderId: "640602342484",
    appId: "1:640602342484:web:c7cb4c1a3f357854c699c1"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app)

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const messaging = getMessaging(app);
getToken(messaging, { vapidKey: 'BMhhrE5EFPy7C-m038N1e_kwoCabk7ceYZK1ppzZPjorc7nYdfEy7WUyQYr-HTQxZDwyxQShuBvDhtjKbeTpkdw' }).then((currentToken) => {
    if (currentToken) {
        // Send the token to your server and update the UI if necessary
        console.log(currentToken)
    } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
    }
}).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
});