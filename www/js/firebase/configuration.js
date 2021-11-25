// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAejED9ThyJvPUMHJugifPN9FUEgYE_8Dc",
  authDomain: "cadastro-logintcc.firebaseapp.com",
  databaseURL: "https://cadastro-logintcc-default-rtdb.firebaseio.com",
  projectId: "cadastro-logintcc",
  storageBucket: "cadastro-logintcc.appspot.com",
  messagingSenderId: "340619087252",
  appId: "1:340619087252:web:d4afab8b1c3b0645e29381"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var storage = firebase.storage();