let activeTabId = null;
let startTime = null;
let sessionBuffer = []; // collect sessions before sending in batch

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (tab.url && tab.url.startsWith("http")) {
      handleTabSwitch(tab);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete" && tab.url.startsWith("http")) {
    handleTabSwitch(tab);
  }
});

function handleTabSwitch(tab) {
  const now = new Date();
  const domain = new URL(tab.url).hostname;

  if (activeTabId && startTime) {
    const durationMs = now - startTime;
    const productiveSites = ["github.com", "stackoverflow.com", "copilot.microsoft.com"];
    const isProductive = productiveSites.includes(domain);

    // push session into buffer
    sessionBuffer.push({
      userId: "kousalya@local",
      domain,
      durationMs,
      productive: isProductive,
      category: isProductive ? "productive" : "unproductive",
      start: startTime,
      end: now
    });

    console.log("Buffered session:", sessionBuffer[sessionBuffer.length - 1]);
  }

  activeTabId = tab.id;
  startTime = now;
}

// periodically send batch to backend
setInterval(() => {
  if (sessionBuffer.length > 0) {
    sendBatchSessions("kousalya@local", sessionBuffer);
    sessionBuffer = []; // clear buffer after sending
  }
}, 10000); // every 10 seconds

function sendBatchSessions(userId, sessions) {
  fetch("http://127.0.0.1:3000/api/sessions/batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, sessions })
  })
  .then(res => res.json())
  .then(data => console.log("✅ Batch synced:", data))
  .catch(err => {
    console.error("❌ Sync error:", err.message);
    console.log("Payload:", { userId, sessions });
  });
}
function syncSessions() {
  fetch("http://localhost:3000/api/sessions/batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(collectedSessions) // replace with your actual session array
  })
  .then(res => res.json())
  .then(data => console.log("✅ Synced:", data))
  .catch(err => console.error("❌ Sync error:", err));
}

// Auto-sync every 60 seconds
setInterval(syncSessions, 60000);
