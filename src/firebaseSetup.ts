import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC2p9T-BTNYhQKRhrREjZjndSbs3T9lniY",
    authDomain: "aiqdor.firebaseapp.com",
    databaseURL: "https://aiqdor-default-rtdb.firebaseio.com",
    projectId: "aiqdor",
    storageBucket: "aiqdor.appspot.com",
    messagingSenderId: "594611970098",
    appId: "1:594611970098:web:ebc4c5936191e71fc2dc2b",
    measurementId: "G-RPPMEHWKMJ"
}; 

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();