import firebase from 'firebase';

// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: "AIzaSyCHqAygGaHeoGxmqWmO-bYlEXnD7Ak_VEs",
   authDomain: "blm-ontario.firebaseapp.com",
   databaseURL: "https://blm-ontario-default-rtdb.firebaseio.com",
   projectId: "blm-ontario",
   storageBucket: "blm-ontario.appspot.com",
   messagingSenderId: "503434974240",
   appId: "1:503434974240:web:e6237809c3b4d863f65845",
   measurementId: "G-TVM74Z7NCS"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
