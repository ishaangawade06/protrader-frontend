// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC-Vt0JpfAMj9uTdZHXXyot2FvB4lQ_vvE",
  authDomain: "protraderhack-d67f0.firebaseapp.com",
  projectId: "protraderhack-d67f0",
  storageBucket: "protraderhack-d67f0.firebasestorage.app",
  messagingSenderId: "1062485216321",
  appId: "1:1062485216321:web:f34bb52a8acc0a75b24ac0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Signup
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("✅ Account created!"))
    .catch(err => alert("❌ " + err.message));
}

// Login
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => alert("✅ Logged in!"))
    .catch(err => alert("❌ " + err.message));
}

// Logout
function logout() {
  auth.signOut();
}

// Auth State Listener
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("auth-screen").style.display = "none";
    document.getElementById("home-screen").style.display = "block";

    // Load trading signals from Firestore
    db.collection("signals").onSnapshot(snapshot => {
      const signalList = document.getElementById("signal-list");
      signalList.innerHTML = "";
      snapshot.forEach(doc => {
        const li = document.createElement("li");
        li.textContent = doc.data().text;
        signalList.appendChild(li);
      });
    });
  } else {
    document.getElementById("auth-screen").style.display = "block";
    document.getElementById("home-screen").style.display = "none";
  }
});
