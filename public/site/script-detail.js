const downloadDialog = document.querySelector("#downloadDialog");
const scrim = document.querySelector("#scrim");
const closeDownload = document.querySelector("#closeDownload");
const openDownloadButtons = [
  document.querySelector("#openDownload"),
  document.querySelector("#openDownloadSecondary")
].filter(Boolean);
const licenseConfirm = document.querySelector("#licenseConfirm");
const confirmDownload = document.querySelector("#confirmDownload");
const defaultDownloadText = confirmDownload.textContent;

let downloadPending = false;

function createPostDownloadDialog() {
  const dialog = document.createElement("aside");
  dialog.className = "post-download-modal";
  dialog.id = "postDownloadDialog";
  dialog.setAttribute("aria-hidden", "true");
  dialog.setAttribute("aria-label", "下载完成后的下一步");

  dialog.innerHTML = `
    <button class="close-button" type="button" id="closePostDownload" aria-label="关闭">×</button>
    <div class="post-download-copy">
      <p class="eyebrow">下载已开始</p>
      <h2 id="postDownloadTitle">前三集验证包已开始下载</h2>
      <p id="postDownloadBody">你可以先用前三集制作测试视频，验证题材、开头钩子和账号受众匹配度。</p>
      <div class="post-download-actions">
        <a class="primary-button" id="postDownloadPrimary" href="account.html">前往用户中心</a>
        <a class="secondary-button" id="postDownloadSecondary" href="scripts.html">继续浏览剧本</a>
        <button class="secondary-button" type="button" id="postDownloadLater">稍后再说</button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);
  return dialog;
}

const postDownloadDialog = createPostDownloadDialog();
const closePostDownload = postDownloadDialog.querySelector("#closePostDownload");
const postDownloadLater = postDownloadDialog.querySelector("#postDownloadLater");
const postDownloadTitle = postDownloadDialog.querySelector("#postDownloadTitle");
const postDownloadBody = postDownloadDialog.querySelector("#postDownloadBody");
const postDownloadPrimary = postDownloadDialog.querySelector("#postDownloadPrimary");
const postDownloadSecondary = postDownloadDialog.querySelector("#postDownloadSecondary");

function getVisitorId() {
  if (window.ScriptMarketplaceSession?.getVisitorId) {
    return window.ScriptMarketplaceSession.getVisitorId();
  }

  const fallback = `visitor_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  try {
    const existing = localStorage.getItem("script_marketplace_visitor_id");
    if (existing) return existing;

    localStorage.setItem("script_marketplace_visitor_id", fallback);
  } catch {
    return fallback;
  }

  return fallback;
}

function setDownloadEnabled(enabled) {
  const shouldDisable = !enabled || downloadPending;
  confirmDownload.setAttribute("aria-disabled", String(shouldDisable));
  confirmDownload.classList.toggle("disabled-link", shouldDisable);
}

function openDownloadDialog() {
  downloadDialog.classList.add("open");
  downloadDialog.setAttribute("aria-hidden", "false");
  scrim.classList.add("open");
}

function closeDownloadDialog() {
  downloadDialog.classList.remove("open");
  downloadDialog.setAttribute("aria-hidden", "true");
  scrim.classList.remove("open");
  licenseConfirm.checked = false;
  setDownloadEnabled(false);
}

function openPostDownloadDialog(user) {
  if (user) {
    postDownloadTitle.textContent = "验证包已开始下载，记录已保存";
    postDownloadBody.textContent =
      "这次下载已经关联到你的账号。你可以在用户中心查看下载记录，后续继续提交测试数据或选择买断、按集购买、版权分成。";
    postDownloadPrimary.textContent = "前往用户中心";
    postDownloadPrimary.href = "account.html";
    postDownloadSecondary.textContent = "查看后续合作方式";
    postDownloadSecondary.href = `${window.location.pathname}${window.location.search}#continuation`;
  } else {
    postDownloadTitle.textContent = "验证包已开始下载";
    postDownloadBody.textContent =
      "注册后可以保存这次下载记录，后续提交测试数据、申请第4集及以后内容，或选择买断、按集购买、版权分成合作。";
    postDownloadPrimary.textContent = "注册并保存记录";
    postDownloadPrimary.href = "auth.html?mode=register&next=account.html";
    postDownloadSecondary.textContent = "登录已有账号";
    postDownloadSecondary.href = "auth.html?mode=login&next=account.html";
  }

  postDownloadDialog.classList.add("open");
  postDownloadDialog.setAttribute("aria-hidden", "false");
  scrim.classList.add("open");
}

function closePostDownloadDialog() {
  postDownloadDialog.classList.remove("open");
  postDownloadDialog.setAttribute("aria-hidden", "true");
  scrim.classList.remove("open");
}

function closeAllDialogs() {
  closeDownloadDialog();
  closePostDownloadDialog();
}

function triggerDownload(downloadUrl) {
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = confirmDownload.getAttribute("download") || "";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function loadFreePreviewAsset() {
  try {
    const scriptSlug = confirmDownload.dataset.scriptSlug || "lie-scent";
    const response = await fetch(`/api/scripts/${scriptSlug}/free-preview`);

    if (!response.ok) {
      throw new Error(`Free preview request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.asset?.id) {
      confirmDownload.dataset.assetId = data.asset.id;
    }

    if (data.asset?.downloadUrl || data.asset?.id) {
      confirmDownload.href = data.asset.downloadUrl || `/api/download-files/script-assets/${data.asset.id}`;
    }
  } catch (error) {
    console.warn("Free preview metadata unavailable, using static download path.", error);
  }
}

openDownloadButtons.forEach((button) => {
  button.addEventListener("click", openDownloadDialog);
});

closeDownload.addEventListener("click", closeDownloadDialog);
closePostDownload.addEventListener("click", closePostDownloadDialog);
postDownloadLater.addEventListener("click", closePostDownloadDialog);
scrim.addEventListener("click", closeAllDialogs);

licenseConfirm.addEventListener("change", () => {
  setDownloadEnabled(licenseConfirm.checked);
});

confirmDownload.addEventListener("click", async (event) => {
  event.preventDefault();

  if (confirmDownload.getAttribute("aria-disabled") === "true") {
    return;
  }

  downloadPending = true;
  confirmDownload.textContent = "正在记录下载...";
  setDownloadEnabled(true);

  try {
    const response = await fetch("/api/downloads", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        scriptSlug: confirmDownload.dataset.scriptSlug || "lie-scent",
        assetId: confirmDownload.dataset.assetId || "asset_lie_scent_free_v1",
        visitorId: getVisitorId(),
        licenseConfirmed: true
      })
    });

    if (!response.ok) {
      throw new Error(`Download request failed: ${response.status}`);
    }

    const data = await response.json();
    const currentUser = window.ScriptMarketplaceSession?.getCurrentUser
      ? await window.ScriptMarketplaceSession.getCurrentUser({ refresh: true })
      : null;

    closeDownloadDialog();
    triggerDownload(data.downloadUrl || confirmDownload.getAttribute("href"));
    openPostDownloadDialog(currentUser);
  } catch (error) {
    console.error(error);
    alert("下载记录写入失败，请确认后端服务已启动后再试。");
  } finally {
    downloadPending = false;
    confirmDownload.textContent = defaultDownloadText;
    setDownloadEnabled(licenseConfirm.checked);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllDialogs();
  }
});

setDownloadEnabled(false);

if (confirmDownload.dataset.scriptSlug) {
  loadFreePreviewAsset();
}
