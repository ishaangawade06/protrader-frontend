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
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Auth Functions
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("✅ Account created!"))
    .catch(err => alert("❌ " + err.message));
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => alert("✅ Logged in!"))
    .catch(err => alert("❌ " + err.message));
}

function logout() {
  auth.signOut();
}

// Switch UI on login/logout
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("auth-screen").style.display = "none";
    document.getElementById("home-screen").style.display = "block";
    fetchSignals();
  } else {
    document.getElementById("auth-screen").style.display = "block";
    document.getElementById("home-screen").style.display = "none";
  }
});

// Fetch trading signals from backend API
async function fetchSignals() {
  try {
    const res = await fetch("https://your-backend-url.com/api/signals"); 
    const data = await res.json();

    const signalsList = document.getElementById("signals");
    signalsList.innerHTML = "";

    data.forEach(signal => {
      const li = document.createElement("li");
      li.innerText = `${signal.asset} → ${signal.direction} @ ${signal.entry}`;
      signalsList.appendChild(li);
    });
  } catch (err) {
    console.error("Error fetching signals:", err);
  }
      }
