"use strict";

const SP = {
  sessionKey: "sp_session_v1",
};

function qs(sel, root = document) {
  return root.querySelector(sel);
}
function jsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function sessionGet() {
  return jsonParse(localStorage.getItem(SP.sessionKey), null);
}
function sessionClear() {
  localStorage.removeItem(SP.sessionKey);
}

function mountCommonUI() {
  const session = sessionGet();
  const nameEl = qs("[data-sp='username']");
  if (nameEl && session) nameEl.textContent = session.name || session.username || "Student";

  const logoutBtn = qs("[data-sp='logout']");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sessionClear();
      window.location.href = "index.html";
    });
  }

}

document.addEventListener("DOMContentLoaded", () => {
  mountCommonUI();
});
