// api.js
// must load AFTER firebase is initialized (or include firebase-init.js before this)

if (typeof BACKEND_BASE === 'undefined') {
  console.error('Please create config.js and set BACKEND_BASE');
}

function getSavedApiKey() {
  return localStorage.getItem('backend_api_key') || null;
}
function setSavedApiKey(key) {
  if (key) localStorage.setItem('backend_api_key', key);
  else localStorage.removeItem('backend_api_key');
}

// get fresh firebase ID token (forces refresh to avoid stale auth)
async function getIdTokenSafe() {
  if (!window.firebase || !firebase.auth) {
    throw new Error('Firebase not initialized. Include firebase-init.js or ensure firebase sdk is loaded.');
  }
  const user = firebase.auth().currentUser;
  if (!user) throw new Error('No logged-in user (firebase.auth().currentUser is null).');
  return user.getIdToken(/* forceRefresh */ true);
}

/**
 * apiFetch(path, options)
 * path can be full URL or starting with /api/...
 */
async function apiFetch(path, options = {}) {
  const url = (path.startsWith('http')) ? path : `${BACKEND_BASE}${path}`;
  options.headers = options.headers || {};

  // Add Firebase token if available (non-blocking: try/catch)
  try {
    const token = await getIdTokenSafe();
    options.headers['Authorization'] = `Bearer ${token}`;
  } catch (err) {
    console.warn('Could not attach Firebase token to apiFetch:', err.message);
    // allow unauthenticated endpoints if backend supports them
  }

  // Add optional x-api-key
  const apiKey = getSavedApiKey();
  if (apiKey) options.headers['x-api-key'] = apiKey;

  // JSON request helper
  if (options.body && !(options.body instanceof FormData)) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  // defaults
  options.method = options.method || 'GET';
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`API ${res.status}: ${text}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

// Handy exported functions (use these in trading.js)
window.PTH_API = {
  fetch: apiFetch,
  setBackendApiKey: setSavedApiKey,
  getBackendApiKey: getSavedApiKey
};
