const params = new URLSearchParams(window.location.search);
const authForm = document.querySelector("#authForm");
const authMessage = document.querySelector("#authMessage");
const authSubmit = document.querySelector("#authSubmit");
const logoutButton = document.querySelector("#logoutButton");
const modeButtons = Array.from(document.querySelectorAll("[data-auth-mode]"));
const registerOnlyFields = Array.from(document.querySelectorAll(".register-only"));

let authMode = params.get("mode") === "register" ? "register" : "login";
let isSubmitting = false;

function setMessage(text, type = "neutral") {
  authMessage.textContent = text || "";
  authMessage.dataset.type = type;
}

function setSubmitting(submitting) {
  isSubmitting = submitting;
  authSubmit.disabled = submitting;
  authSubmit.textContent = submitting ? "处理中..." : authMode === "register" ? "注册并同步下载记录" : "登录并同步下载记录";
}

function setMode(nextMode) {
  authMode = nextMode === "register" ? "register" : "login";

  modeButtons.forEach((button) => {
    const active = button.dataset.authMode === authMode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });

  registerOnlyFields.forEach((field) => {
    field.hidden = authMode !== "register";
  });

  const password = authForm.elements.password;
  password.autocomplete = authMode === "register" ? "new-password" : "current-password";

  setSubmitting(false);
  setMessage("");
}

function getRedirectUrl() {
  const next = params.get("next");
  if (next && !next.startsWith("http")) {
    return next;
  }

  return "account.html";
}

async function submitAuth(event) {
  event.preventDefault();

  if (isSubmitting) return;

  const formData = new FormData(authForm);
  const payload = {
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || "")
  };

  if (authMode === "register") {
    payload.displayName = String(formData.get("displayName") || "").trim();
    payload.contactWechat = String(formData.get("contactWechat") || "").trim();
  }

  setSubmitting(true);
  setMessage(authMode === "register" ? "正在创建账号..." : "正在登录...");

  try {
    const response = await fetch(`/api/auth/${authMode}`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "账号请求失败");
    }

    const bound = await window.ScriptMarketplaceSession.bindVisitorDownloads();
    const boundText = bound.boundCount > 0 ? `已同步 ${bound.boundCount} 条游客下载记录。` : "暂无需要同步的游客下载记录。";
    setMessage(`${authMode === "register" ? "注册成功。" : "登录成功。"}${boundText}`, "success");

    setTimeout(() => {
      window.location.href = getRedirectUrl();
    }, 900);
  } catch (error) {
    setMessage(error.message || "请稍后再试。", "error");
  } finally {
    setSubmitting(false);
  }
}

async function logout() {
  setMessage("正在退出...");

  try {
    await window.ScriptMarketplaceSession.logout();
    await window.ScriptMarketplaceSession.updateAuthLinks();
    setMessage("已退出当前账号。", "success");
  } catch {
    setMessage("退出失败，请稍后再试。", "error");
  }
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.authMode));
});

authForm.addEventListener("submit", submitAuth);
logoutButton.addEventListener("click", logout);

setMode(authMode);
