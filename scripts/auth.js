// scripts/auth.js
// Auth / user management for CyberLabs Fortress (localStorage based demo)

// Keys
const USERS_KEY = 'clf_users';
const CUR_USER_KEY = 'clf_currentUser';
const DEFAULT_ADMIN = { 
  username: 'admin', 
  email: 'admin@cyberlabs.local', 
  password: btoa('Admin@123'), 
  role: 'admin', 
  progress: {},
  badges: [] 
};

// --- Basic helpers ---
function getUsers(){
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch(e){ return []; }
}
function saveUsers(users){ localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function findUser(username){
  return getUsers().find(u => u.username.toLowerCase() === (username||'').toLowerCase());
}
function hashPassword(pw){ return btoa(pw); }
function getCurrentUsername(){ return localStorage.getItem(CUR_USER_KEY) || null; }
function getCurrentUserObj(){
  const uname = getCurrentUsername();
  if(!uname) return null;
  return findUser(uname) || null;
}

// --- Bootstrap default admin if none exist ---
function initDefaultAdmin(){
  const users = getUsers();
  if(!users || users.length === 0){
    users.push(DEFAULT_ADMIN);
    saveUsers(users);
    console.info('Default admin created: username=admin password=Admin@123');
  }
}
initDefaultAdmin();

// --- Registration ---
function registerUser({username, email, password}) {
  username = (username||'').trim();
  email = (email||'').trim();
  if(!username || !email || !password) throw new Error('Missing fields.');
  if(password.length < 6) throw new Error('Password must be at least 6 characters.');
  if(findUser(username)) throw new Error('Username already exists.');

  const users = getUsers();
  const user = { 
    username, 
    email, 
    password: hashPassword(password), 
    role: 'user', 
    progress: {},
    badges: []
  };
  users.push(user);
  saveUsers(users);
  // auto-login after register
  localStorage.setItem(CUR_USER_KEY, username);
  return true;
}

// --- Login ---
function loginUser({username, password}){
  username = (username||'').trim();
  if(!username || !password) throw new Error('Missing credentials.');

  const user = findUser(username);
  if(!user) throw new Error('User not found.');
  if(user.password !== hashPassword(password)) throw new Error('Incorrect password.');

  localStorage.setItem(CUR_USER_KEY, user.username);
  return true;
}

// --- Logout ---
function logoutUser(){
  localStorage.removeItem(CUR_USER_KEY);
  // update UI if available and redirect
  if(window && window.location) window.location.href = 'index.html';
}

// --- Password Reset ---
function resetPassword(username, currentPassword, newPassword) {
  username = (username||'').trim();
  if(!username || !currentPassword || !newPassword) throw new Error('Missing fields.');
  if(newPassword.length < 6) throw new Error('New password must be at least 6 characters.');

  // Verify current password
  try {
    loginUser({ username, password: currentPassword });
  } catch (err) {
    throw new Error('Current password is incorrect.');
  }

  // Update password
  const users = getUsers();
  const userIndex = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
  if(userIndex < 0) throw new Error('User not found.');
  
  users[userIndex].password = hashPassword(newPassword);
  saveUsers(users);
  
  return true;
}

// --- Admin actions ---
function addUser({username,email,password,role='user'}){
  username = (username||'').trim();
  email = (email||'').trim();
  if(!username || !email || !password) throw new Error('Missing fields.');
  if(findUser(username)) throw new Error('Username exists.');
  const users = getUsers();
  users.push({ 
    username, 
    email, 
    password: hashPassword(password), 
    role, 
    progress: {},
    badges: []
  });
  saveUsers(users);
  return true;
}
function deleteUser(username){
  username = (username||'').trim();
  let users = getUsers().filter(u => u.username.toLowerCase() !== username.toLowerCase());
  saveUsers(users);
  // if deleting currently logged in user, log them out
  if(getCurrentUsername() && getCurrentUsername().toLowerCase() === username.toLowerCase()){
    localStorage.removeItem(CUR_USER_KEY);
    window.location.href = 'index.html';
  }
}
function updateUserRole(username, newRole){
  const users = getUsers();
  const idx = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
  if(idx >= 0){ users[idx].role = newRole; saveUsers(users); return true; }
  return false;
}
function updateUserProgress(username, progress){
  const users = getUsers();
  const idx = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
  if(idx >= 0){ 
    users[idx].progress = progress; 
    saveUsers(users); 
    
    // Update the current user object in memory if it's the current user
    if(getCurrentUsername() && getCurrentUsername().toLowerCase() === username.toLowerCase()){
      localStorage.setItem(CUR_USER_KEY, username); // This will trigger a refresh of the user object
    }
    
    return true; 
  }
  return false;
}