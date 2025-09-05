// scripts/labs.js
// Lab submission / scoring / progress helpers

// Threshold to mark as completed (percent)
const LAB_PASS_THRESHOLD = 80;

function markLabResult(username, labId, answersObj, scorePercent, completedQuestions){
  const users = getUsers();
  const idx = users.findIndex(u => u.username.toLowerCase() === (username||'').toLowerCase());
  if(idx < 0) return false;
  if(!users[idx].progress) users[idx].progress = {};
  
  // Get existing progress or create new
  const existingProgress = users[idx].progress[labId] || { answers: {}, completed: [] };
  
  users[idx].progress[labId] = {
    answers: { ...existingProgress.answers, ...answersObj },
    completed: completedQuestions || existingProgress.completed || [],
    score: scorePercent,
    completedOverall: scorePercent >= LAB_PASS_THRESHOLD,
    ts: Date.now()
  };
  
  saveUsers(users);
  
  // Check for new badges
  const userObj = users[idx];
  const newBadges = checkAndAwardBadges(userObj);
  
  return {success: true, newBadges};
}

function getUserProgress(username){
  const user = findUser(username);
  return user ? (user.progress || {}) : {};
}

// returns array sorted by completed labs desc
function computeLeaderboard(){
  const users = getUsers();
  const mapped = users.map(u => {
    const progress = u.progress || {};
    const completedCount = Object.values(progress).filter(p => p && p.completedOverall).length;
    return { username: u.username, email: u.email, role: u.role, completedCount, progress };
  });
  return mapped.sort((a,b) => b.completedCount - a.completedCount);
}