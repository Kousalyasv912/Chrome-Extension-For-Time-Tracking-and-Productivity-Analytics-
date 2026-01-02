document.getElementById("save").addEventListener("click", () => {
  const backendUrl = document.getElementById("backendUrl").value.trim();
  const userId = document.getElementById("userId").value.trim();

  chrome.storage.sync.set({ backendUrl, userId }, () => {
    document.getElementById("status").textContent = "✅ Settings saved";
  });
});

document.getElementById("sync").addEventListener("click", async () => {
  const { backendUrl, userId } = await new Promise((resolve) => {
    chrome.storage.sync.get(["backendUrl", "userId"], (items) => resolve(items));
  });

  if (!backendUrl || !userId) {
    document.getElementById("status").textContent = "⚠️ Configure settings first";
    return;
  }

  const payload = {
    userId,
    sessions: [{ domain: "manual-sync", durationMs: 1000 }]
  };

  fetch(`${backendUrl}/api/sessions/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(() => {
      document.getElementById("status").textContent = "✅ Synced test session";
    })
    .catch(() => {
      document.getElementById("status").textContent = "❌ Sync failed";
    });
});
