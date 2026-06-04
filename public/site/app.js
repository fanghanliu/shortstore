const leadDrawer = document.querySelector("#leadDrawer");
const previewModal = document.querySelector("#previewModal");
const scrim = document.querySelector("#scrim");
const closeLead = document.querySelector("#closeLead");
const closePreview = document.querySelector("#closePreview");
const openLeadButtons = document.querySelectorAll("[data-open-lead]");
const previewTriggers = document.querySelectorAll("[data-open-preview]");
const submitLead = document.querySelector("#submitLead");

async function hydrateProductCards() {
  const cards = document.querySelectorAll("[data-product-json]");
  await Promise.all(
    Array.from(cards).map(async (card) => {
      const source = card.dataset.productId
        ? `/api/scripts/${card.dataset.productId}`
        : card.dataset.productJson;
      const response = await fetch(source);
      if (!response.ok) return;

      const product = await response.json();
      const title = product.title || product.product_metadata?.title?.zh;
      const category = product.category || product.product_metadata?.category?.zh;
      const logline = product.logline || product.product_metadata?.logline?.zh;

      if (title) card.querySelector("[data-product-title]").textContent = title;
      if (category) card.querySelector("[data-product-category]").textContent = category;
      if (logline) card.querySelector("[data-product-logline]").textContent = logline;
    })
  );
}

function showScrim() {
  scrim.classList.add("open");
}

function hideScrimIfIdle() {
  if (!leadDrawer.classList.contains("open") && !previewModal.classList.contains("open")) {
    scrim.classList.remove("open");
  }
}

function openLeadDrawer(event) {
  event?.stopPropagation();
  leadDrawer.classList.add("open");
  leadDrawer.setAttribute("aria-hidden", "false");
  showScrim();
}

function closeLeadDrawer() {
  leadDrawer.classList.remove("open");
  leadDrawer.setAttribute("aria-hidden", "true");
  hideScrimIfIdle();
}

function openPreview(event) {
  if (event?.target.closest("[data-open-lead]")) return;
  previewModal.classList.add("open");
  previewModal.setAttribute("aria-hidden", "false");
  showScrim();
}

function closePreviewModal() {
  previewModal.classList.remove("open");
  previewModal.setAttribute("aria-hidden", "true");
  hideScrimIfIdle();
}

openLeadButtons.forEach((button) => {
  button.addEventListener("click", openLeadDrawer);
});

previewTriggers.forEach((item) => {
  item.addEventListener("click", openPreview);
});

closeLead.addEventListener("click", closeLeadDrawer);
closePreview.addEventListener("click", closePreviewModal);

scrim.addEventListener("click", () => {
  closeLeadDrawer();
  closePreviewModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLeadDrawer();
    closePreviewModal();
  }
});

submitLead.addEventListener("click", () => {
  submitLead.textContent = "已记录领取申请";
  submitLead.disabled = true;
  setTimeout(() => {
    submitLead.textContent = "提交领取申请";
    submitLead.disabled = false;
  }, 1800);
});

hydrateProductCards().catch((error) => {
  console.error("商品数据加载失败", error);
});
