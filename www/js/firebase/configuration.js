// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDARmU9LRFXyf64MMpeG4_aKLM5foHyKYs",
  authDomain: "testestreaming-9a6ba.firebaseapp.com",
  projectId: "testestreaming-9a6ba",
  storageBucket: "testestreaming-9a6ba.appspot.com",
  messagingSenderId: "914599063061",
  appId: "1:914599063061:web:21d6eafbcbda6beac1e81c",
  measurementId: "G-86B6WHFZ21"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var storage = firebase.storage();