// ---------- Firebase Config ----------
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

// ---------- Signup ----------
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(user => alert("✅ Account created!"))
    .catch(err => alert("❌ " + err.message));
}

// ---------- Login ----------
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then(user => alert("✅ Logged in!"))
    .catch(err => alert("❌ " + err.message));
}

// ---------- Logout ----------
function logout() {
  auth.signOut();
}

// ---------- Auth State ----------
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("auth-screen").style.display = "none";
    document.getElementById("home-screen").style.display = "block";
    document.getElementById("user-email").innerText = user.email;

    // Load signals from Firestore
    db.collection("signals").orderBy("created", "desc").limit(10).onSnapshot(snapshot => {
      const list = document.getElementById("signals-list");
      list.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        list.innerHTML += `<li>${data.pair} → ${data.action} @ ${data.price}</li>`;
      });
    });

  } else {
    document.getElementById("auth-screen").style.display = "block";
    document.getElementById("home-screen").style.display = "none";
  }
});
