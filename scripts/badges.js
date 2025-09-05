// scripts/badges.js
// Badge and achievement system for CyberLabs Fortress

const BADGES = {
  FIRST_LAB: {
    id: 'first_lab',
    name: 'First Steps',
    description: 'Complete your first lab',
    icon: 'bi-flag-fill',
    color: '#00ff9d'
  },
  WINDOWS_MASTER: {
    id: 'windows_master',
    name: 'Windows Forensics Master',
    description: 'Complete all Windows Forensics labs',
    icon: 'bi-windows',
    color: '#0078d7'
  },
  NETWORK_EXPERT: {
    id: 'network_expert',
    name: 'Network Analysis Expert',
    description: 'Complete all Network Analysis labs',
    icon: 'bi-hdd-network',
    color: '#107c10'
  },
  MALWARE_ANALYST: {
    id: 'malware_analyst',
    name: 'Malware Analyst',
    description: 'Complete all Malware Analysis labs',
    icon: 'bi-bug-fill',
    color: '#e81123'
  },
  MEMORY_FORENSICS: {
    id: 'memory_forensics',
    name: 'Memory Forensics Specialist',
    description: 'Complete all Memory Forensics labs',
    icon: 'bi-motherboard',
    color: '#ffb900'
  },
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: 'Perfectionist',
    description: 'Score 100% on any lab',
    icon: 'bi-star-fill',
    color: '#ffcc00'
  },
  WEEK_STREAK: {
    id: 'week_streak',
    name: 'Consistent Learner',
    description: 'Complete labs for 7 days in a row',
    icon: 'bi-calendar-week',
    color: '#881798'
  },
  HALFWAY: {
    id: 'halfway',
    name: 'Halfway There',
    description: 'Complete 10 labs',
    icon: 'bi-signpost-split',
    color: '#008575'
  },
  ALL_LABS: {
    id: 'all_labs',
    name: 'Cyber Defender',
    description: 'Complete all labs',
    icon: 'bi-shield-check',
    color: '#0063b1'
  }
};

// Check and award badges based on user progress
function checkAndAwardBadges(user) {
  const progress = user.progress || {};
  const completedLabs = Object.values(progress).filter(p => p && p.completedOverall);
  const completedCount = completedLabs.length;
  
  let badges = user.badges || [];
  let newBadges = [];
  
  // Check for First Lab badge
  if (completedCount >= 1 && !badges.includes(BADGES.FIRST_LAB.id)) {
    badges.push(BADGES.FIRST_LAB.id);
    newBadges.push(BADGES.FIRST_LAB);
  }
  
  // Check for category completion badges (simplified logic)
  const windowsLabs = ['lab1', 'lab2', 'lab3', 'lab4', 'lab5', 'lab6', 'lab7', 'lab8', 'lab9', 'lab10'];
  const windowsCompleted = windowsLabs.every(lab => progress[lab] && progress[lab].completedOverall);
  
  if (windowsCompleted && !badges.includes(BADGES.WINDOWS_MASTER.id)) {
    badges.push(BADGES.WINDOWS_MASTER.id);
    newBadges.push(BADGES.WINDOWS_MASTER);
  }
  
  // Check for perfect score badge
  const hasPerfectScore = Object.values(progress).some(p => p && p.score === 100);
  if (hasPerfectScore && !badges.includes(BADGES.PERFECT_SCORE.id)) {
    badges.push(BADGES.PERFECT_SCORE.id);
    newBadges.push(BADGES.PERFECT_SCORE);
  }
  
  // Check for halfway badge
  if (completedCount >= 10 && !badges.includes(BADGES.HALFWAY.id)) {
    badges.push(BADGES.HALFWAY.id);
    newBadges.push(BADGES.HALFWAY);
  }
  
  // Check for all labs badge
  if (completedCount >= 20 && !badges.includes(BADGES.ALL_LABS.id)) {
    badges.push(BADGES.ALL_LABS.id);
    newBadges.push(BADGES.ALL_LABS);
  }
  
  // Save badges if any new ones were awarded
  if (newBadges.length > 0) {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === user.username);
    if (userIndex !== -1) {
      users[userIndex].badges = badges;
      saveUsers(users);
    }
    
    // Return new badges for notification
    return newBadges;
  }
  
  return [];
}

// Display user badges on profile
function displayUserBadges(user) {
  const badges = user.badges || [];
  const container = document.getElementById('badgesContainer');
  
  if (badges.length === 0) {
    container.innerHTML = '<p class="text-muted">No badges earned yet. Complete labs to earn badges!</p>';
    return;
  }
  
  let html = '';
  for (const badgeId of badges) {
    const badge = Object.values(BADGES).find(b => b.id === badgeId);
    if (badge) {
      html += `
        <div class="badge-item" title="${badge.description}">
          <div class="badge-icon" style="color: ${badge.color}">
            <i class="${badge.icon}"></i>
          </div>
          <div class="badge-name">${badge.name}</div>
        </div>
      `;
    }
  }
  
  container.innerHTML = html;
}

// Calculate total badge count
function calculateBadgeCount(user) {
  return (user.badges || []).length;
}