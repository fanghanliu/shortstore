(function () {
  const visitorKey = "script_marketplace_visitor_id";
  let currentUserPromise = null;

  function createVisitorId() {
    const randomPart =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

    return `visitor_${randomPart}`;
  }

  function getVisitorId() {
    const fallback = createVisitorId();

    try {
      const existing = localStorage.getItem(visitorKey);
      if (existing) return existing;

      localStorage.setItem(visitorKey, fallback);
    } catch {
      return fallback;
    }

    return fallback;
  }

  async function getCurrentUser(options = {}) {
    if (!currentUserPromise || options.refresh) {
      currentUserPromise = fetch("/api/me", {
        credentials: "same-origin"
      })
        .then((response) => response.json())
        .then((data) => data.user || null)
        .catch(() => null);
    }

    return currentUserPromise;
  }

  async function bindVisitorDownloads() {
    const visitorId = getVisitorId();
    const response = await fetch("/api/me/bind-visitor-downloads", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ visitorId })
    });

    if (response.status === 401) {
      return { boundCount: 0, authenticated: false };
    }

    if (!response.ok) {
      throw new Error(`Bind visitor downloads failed: ${response.status}`);
    }

    const data = await response.json();
    return { ...data, authenticated: true };
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin"
    });
    currentUserPromise = Promise.resolve(null);
  }

  async function updateAuthLinks() {
    const links = document.querySelectorAll("[data-auth-link]");
    if (!links.length) return;

    const user = await getCurrentUser();
    links.forEach((link) => {
      if (user) {
        link.textContent = user.displayName || user.email || "用户中心";
        link.href = "account.html";
        link.classList.add("is-signed-in");
      } else {
        link.textContent = "登录 / 注册";
        link.href = "auth.html?mode=login";
        link.classList.remove("is-signed-in");
      }
    });
  }

  window.ScriptMarketplaceSession = {
    bindVisitorDownloads,
    getCurrentUser,
    getVisitorId,
    logout,
    updateAuthLinks
  };

  document.addEventListener("DOMContentLoaded", updateAuthLinks);
})();
