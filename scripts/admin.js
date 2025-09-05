// scripts/admin.js

// Get all users
function getUsers() {
  return JSON.parse(localStorage.getItem("clf_users") || "[]");
}

// Save users
function saveUsers(users) {
  localStorage.setItem("clf_users", JSON.stringify(users));
}

// Remove user
function removeUser(username) {
  let users = getUsers().filter(u => u.username !== username);
  saveUsers(users);
  alert(`User ${username} removed`);
}

// Add lab
function createLab(labData) {
  let labs = getLabs();
  labData.id = "lab" + (labs.length + 1);
  labs.push(labData);
  saveLabs(labs);
  alert("Lab created successfully!");
}

// Reset a lab for all users
function resetLab(labId) {
  let locks = JSON.parse(localStorage.getItem("clf_labLocks") || "{}");
  Object.keys(locks).forEach(user => {
    locks[user] = locks[user].filter(l => l !== labId);
  });
  localStorage.setItem("clf_labLocks", JSON.stringify(locks));
  alert(`Lab ${labId} unlocked for all users`);
}

// Scoreboard
function getScoreboard() {
  const answers = JSON.parse(localStorage.getItem("clf_answers") || "{}");
  const labs = getLabs();
  let scores = [];

  Object.keys(answers).forEach(user => {
    let total = 0;
    labs.forEach(lab => {
      if (answers[user][lab.id]) {
        Object.values(answers[user][lab.id]).forEach(q => {
          if (q.correct) total += lab.scorePerQuestion || 1;
        });
      }
    });
    scores.push({ user, score: total });
  });

  return scores.sort((a, b) => b.score - a.score);
}
