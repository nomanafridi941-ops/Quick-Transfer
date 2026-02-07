// DownloadSystem.js
// Modular download system for site

const DOWNLOAD_LIMIT = 5; // Set your max downloads
const COUNTDOWN_SECONDS = 60; // Set your countdown duration (seconds)
const DOWNLOAD_COUNT_KEY = "download_count";

let timerState = "running"; // "running", "finished"
let countdown = COUNTDOWN_SECONDS;
let downloadCount = 0;
let isLimitReached = false;
let countdownInterval = null;

// Utility: Load/Persist Download Count
function loadDownloadCount() {
  const saved = localStorage.getItem(DOWNLOAD_COUNT_KEY);
  return saved ? parseInt(saved, 10) : 0;
}
function saveDownloadCount(count) {
  localStorage.setItem(DOWNLOAD_COUNT_KEY, count);
}

// Timer Logic (Independent)
function startCountdown() {
  timerState = "running";
  const countdownDisplay = document.getElementById("countdown");
  countdownDisplay.textContent = countdown;
  countdownInterval = setInterval(() => {
    countdown--;
    countdownDisplay.textContent = countdown;
    if (countdown <= 0) {
      timerState = "finished";
      clearInterval(countdownInterval);
      countdownDisplay.textContent = "0";
      // Optionally disable download after timer ends
      // document.getElementById("download-btn").disabled = true;
    }
  }, 1000);
}

// Download Logic
function handleDownload() {
  if (isLimitReached || timerState === "finished") return;
  // Simulate file download (replace with actual logic)
  alert("File downloaded!");
  downloadCount++;
  saveDownloadCount(downloadCount);
  updateUI();
}

// UI State Logic
function updateUI() {
  isLimitReached = downloadCount >= DOWNLOAD_LIMIT;
  const downloadBtn = document.getElementById("download-btn");
  const limitMsg = document.getElementById("limit-msg");
  downloadBtn.disabled = isLimitReached || timerState === "finished";
  limitMsg.style.display = isLimitReached ? "block" : "none";
  document.getElementById("count-display").textContent = `${downloadCount}/${DOWNLOAD_LIMIT}`;
}

// Initialization
function initDownloadSystem() {
  downloadCount = loadDownloadCount();
  isLimitReached = downloadCount >= DOWNLOAD_LIMIT;
  updateUI();
  startCountdown();
  document.getElementById("download-btn").addEventListener("click", handleDownload);

  // Refresh only Downloads count every 2 seconds
  setInterval(() => {
    downloadCount = loadDownloadCount();
    document.getElementById("count-display").textContent = `${downloadCount}/${DOWNLOAD_LIMIT}`;
  }, 2000);
}

window.addEventListener("DOMContentLoaded", initDownloadSystem);

// --- Comments ---
// - Countdown timer runs independently and always completes
// - Download logic only increments count and disables button/message when limit is reached
// - Download count is persisted in localStorage, so refresh does not reset limit
// - UI states (button/message) update based on downloadCount and timerState
// - Edge cases: disables download if timer ends or limit is reached
