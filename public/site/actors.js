const actorLeadDrawer = document.querySelector("#actorLeadDrawer");
const actorModal = document.querySelector("#actorModal");
const actorScrim = document.querySelector("#actorScrim");
const closeActorLead = document.querySelector("#closeActorLead");
const closeActorModal = document.querySelector("#closeActorModal");
const actorLeadButtons = document.querySelectorAll("[data-open-actor-lead]");
const actorDetailButtons = document.querySelectorAll("[data-open-actor-detail]");
const submitActorLead = document.querySelector("#submitActorLead");
const actorSelect = document.querySelector("#actorSelect");
const filterButtons = document.querySelectorAll("[data-filter]");
const actorCards = document.querySelectorAll(".actor-card");

function showActorScrim() {
  actorScrim.classList.add("open");
}

function hideActorScrimIfIdle() {
  if (!actorLeadDrawer.classList.contains("open") && !actorModal.classList.contains("open")) {
    actorScrim.classList.remove("open");
  }
}

function openActorLead(event) {
  event?.stopPropagation();
  const card = event?.target.closest(".actor-card");
  if (card && actorSelect) {
    const option = Array.from(actorSelect.options).find((item) => item.textContent.startsWith(card.dataset.name));
    if (option) actorSelect.value = option.value;
  }
  actorLeadDrawer.classList.add("open");
  actorLeadDrawer.setAttribute("aria-hidden", "false");
  showActorScrim();
}

function closeActorLeadDrawer() {
  actorLeadDrawer.classList.remove("open");
  actorLeadDrawer.setAttribute("aria-hidden", "true");
  hideActorScrimIfIdle();
}

function openActorModal(event) {
  event?.stopPropagation();
  const card = event.target.closest(".actor-card");
  if (!card) return;

  document.querySelector("#actorModalImage").src = card.querySelector("img").src;
  document.querySelector("#actorModalName").textContent = card.dataset.name;
  document.querySelector("#actorModalFit").textContent = card.dataset.fit;
  document.querySelector("#actorModalFee").textContent = card.dataset.fee;
  document.querySelector("#actorModalAsset").textContent = card.dataset.asset;

  actorModal.classList.add("open");
  actorModal.setAttribute("aria-hidden", "false");
  showActorScrim();
}

function closeActorDetailModal() {
  actorModal.classList.remove("open");
  actorModal.setAttribute("aria-hidden", "true");
  hideActorScrimIfIdle();
}

function filterActors(event) {
  const filter = event.currentTarget.dataset.filter;

  filterButtons.forEach((button) => {
    button.classList.toggle("active", button === event.currentTarget);
  });

  actorCards.forEach((card) => {
    const visible = filter === "all" || card.dataset.category.split(" ").includes(filter);
    card.hidden = !visible;
  });
}

actorLeadButtons.forEach((button) => {
  button.addEventListener("click", openActorLead);
});

actorDetailButtons.forEach((button) => {
  button.addEventListener("click", openActorModal);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", filterActors);
});

closeActorLead.addEventListener("click", closeActorLeadDrawer);
closeActorModal.addEventListener("click", closeActorDetailModal);

actorScrim.addEventListener("click", () => {
  closeActorLeadDrawer();
  closeActorDetailModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeActorLeadDrawer();
    closeActorDetailModal();
  }
});

submitActorLead.addEventListener("click", () => {
  submitActorLead.textContent = "已记录选角意向";
  submitActorLead.disabled = true;
  setTimeout(() => {
    submitActorLead.textContent = "提交选角意向";
    submitActorLead.disabled = false;
  }, 1800);
});
