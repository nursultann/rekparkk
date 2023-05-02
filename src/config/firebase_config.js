import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyD8lvrmQyKutKyzwK7AFg39ilfqlurBc8k",
    authDomain: "rekpark-8cf2d.firebaseapp.com",
    databaseURL: "https://rekpark-8cf2d-default-rtdb.firebaseio.com",
    projectId: "rekpark-8cf2d",
    storageBucket: "rekpark-8cf2d.appspot.com",
    messagingSenderId: "334742355730",
    appId: "1:334742355730:web:db8fd5574e057b28e0fdcb",
    measurementId: "G-T3NLHPLY3P"
};
const clientId = "334742355730-7cv274fegjrka2n60vkpch5jl8ccsi2k.apps.googleusercontent.com";

const app = firebase.initializeApp(firebaseConfig);
const googleAuthProvider = firebase.auth.GoogleAuthProvider;
const auth = app.auth();
const analytics = app.analytics()

export { firebase, auth, clientId, googleAuthProvider, analytics };