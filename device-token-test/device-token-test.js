// Import the functions you need from the SDKs you need

import {initializeApp} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
    getMessaging,
    getToken,
    isSupported
} from "https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.0/firebase-messaging.min.js";

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyAq0oMcCWPBRP2qMsC0P6BgaxIIydzZESg",
    authDomain: "device-token-test.firebaseapp.com",
    projectId: "device-token-test",
    storageBucket: "device-token-test.appspot.com",
    messagingSenderId: "640602342484",
    appId: "1:640602342484:web:c7cb4c1a3f357854c699c1"
};
const FIREBASE_VAPID_KEY = 'BMhhrE5EFPy7C-m038N1e_kwoCabk7ceYZK1ppzZPjorc7nYdfEy7WUyQYr-HTQxZDwyxQShuBvDhtjKbeTpkdw';
const targetElement = document.getElementById("target")
let app = null;
let messaging = null;

const getFirebaseToken = async () => {
    try {
        const currentToken = await getToken(messaging, {vapidKey: FIREBASE_VAPID_KEY});
        if (currentToken) {
            console.log(currentToken)
            targetElement.innerHTML = `<h1>Your Device Token</h1>${currentToken}`
        } else {
            console.log("No registration token available. Request permission to generate one.");
            targetElement.innerHTML = `<h1>No registration token available</h1>`
        }
    } catch (error) {
        console.log("An error occurred while retrieving token. ", error);
        targetElement.innerHTML = `<h1>Something went wrong</h1>${error}`
    }
};

const requestForToken = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            await getFirebaseToken();
        }
    } catch (error) {
        console.log("An error occurred while getting user permission. ", error);
        targetElement.innerHTML = `<h1>Something went wrong</h1>${error}`
    }
};

const hasFirebaseMessagingSupport = await isSupported();
if (hasFirebaseMessagingSupport) {
    console.log("Getting Token")
    targetElement.innerHTML = `<h1>Getting Token...</h1>`
    app = initializeApp(firebaseConfig);
    messaging = getMessaging()
    await requestForToken();
} else {
    console.log("Browser not supported")
    targetElement.innerHTML = `<h1>Browser not supported</h1>`
}
