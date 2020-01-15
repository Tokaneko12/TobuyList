// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCAOHjxIIAOzg9J4kXSXvAn4LZlrD-oqcM",
  authDomain: "tobuy-86979.firebaseapp.com",
  databaseURL: "https://tobuy-86979.firebaseio.com",
  projectId: "tobuy-86979",
  storageBucket: "tobuy-86979.appspot.com",
  messagingSenderId: "244020507559",
  appId: "1:244020507559:web:b991b6dfb50faf62007c82",
  measurementId: "G-1SM05G4STM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.firestore();
var authUser;

// 匿名ユーザを生成
firebase.auth().signInAnonymously().then(function(authUser) {
  var localAuth = {
    uid: authUser.user.uid
  }
  localStorage.setItem('localAuth', JSON.stringify(localAuth));
})

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    authUser = user;
  } else {
    // User is signed out.
    console.log('認証切れ');
    authUser = localStorage.getItem('localAuth', JSON.parse(localAuth));
  }
});

var Module = ons.bootstrap();

ons.ready(function() {
});
