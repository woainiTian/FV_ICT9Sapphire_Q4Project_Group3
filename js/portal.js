"use strict";

const SP = {
  sessionKey: "sp_session_v1",
  demoUsers: [{ username: "student", password: "sapphire9", name: "Student" }],
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
function sessionSet(session) {
  localStorage.setItem(SP.sessionKey, JSON.stringify(session));
}
function sessionClear() {
  localStorage.removeItem(SP.sessionKey);
}
function requireAuth() {
  const session = sessionGet();
  if (!session) {
    window.location.replace("index.html");
    return null;
  }
  return session;
}
function redirectIfAuthed() {
  if (sessionGet()) window.location.replace("dashboard.html");
}

function findDemoUser(username) {
  return SP.demoUsers.find((u) => u.username.toLowerCase() === String(username || "").toLowerCase()) || null;
}
function login(username, password) {
  const user = findDemoUser(username);
  if (!user || user.password !== password) {
    return { ok: false, error: "Invalid username or password." };
  }
  const session = { username: user.username, name: user.name, loginAt: Date.now() };
  sessionSet(session);
  return { ok: true };
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

function initLoginPage() {
  redirectIfAuthed();
  const form = qs("#loginForm");
  const err = qs("#loginError");
  const demo = qs("#demoHint");
  if (demo) demo.textContent = "Demo login: student / sapphire9";
  const openBtn = qs("#openLogin");
  const modalEl = qs("#loginModal");
  if (openBtn && modalEl && window.bootstrap?.Modal) {
    const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
    openBtn.addEventListener("click", () => {
      modal.show();
      setTimeout(() => qs("#username")?.focus(), 150);
    });
  }
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (err) err.classList.add("d-none");

    const username = String(qs("#username")?.value || "").trim();
    const password = String(qs("#password")?.value || "");

    const res = login(username, password);
    if (!res.ok) {
      if (err) {
        err.textContent = res.error || "Login failed.";
        err.classList.remove("d-none");
      }
      return;
    }
    window.location.href = "dashboard.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.getAttribute("data-page") || "";
  mountCommonUI();

  if (page === "login") {
    initLoginPage();
    return;
  }

  const session = requireAuth();
  if (!session) return;
});
