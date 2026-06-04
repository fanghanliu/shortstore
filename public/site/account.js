const accountName = document.querySelector("#accountName");
const accountEmail = document.querySelector("#accountEmail");
const downloadCount = document.querySelector("#downloadCount");
const downloadList = document.querySelector("#downloadList");
const logoutButton = document.querySelector("#logoutButton");
const reportCount = document.querySelector("#reportCount");
const reportDownloadSelect = document.querySelector("#reportDownloadSelect");
const reportForm = document.querySelector("#testReportForm");
const reportList = document.querySelector("#reportList");
const reportMessage = document.querySelector("#reportMessage");
const reportSubmit = document.querySelector("#reportSubmit");
const refreshReportsButton = document.querySelector("#refreshReportsButton");
const requestCount = document.querySelector("#requestCount");
const requestDownloadSelect = document.querySelector("#requestDownloadSelect");
const requestTypeSelect = document.querySelector("#requestType");
const requestReportSelect = document.querySelector("#requestReportSelect");
const requestEpisodeField = document.querySelector("#requestEpisodeField");
const requestEpisodeSelect = document.querySelector("#requestEpisodeSelect");
const requestEpisodeRange = document.querySelector("#requestEpisodeRange");
const requestForm = document.querySelector("#continuationRequestForm");
const requestList = document.querySelector("#requestList");
const requestMessage = document.querySelector("#requestMessage");
const requestSubmit = document.querySelector("#requestSubmit");
const refreshRequestsButton = document.querySelector("#refreshRequestsButton");
const revenueShareCount = document.querySelector("#revenueShareCount");
const revenueShareList = document.querySelector("#revenueShareList");
const refreshRevenueShareButton = document.querySelector("#refreshRevenueShareButton");
const revenueShareStatementForm = document.querySelector("#revenueShareStatementForm");
const revenueShareProjectSelect = document.querySelector("#revenueShareProjectSelect");
const revenueShareStatementMessage = document.querySelector("#revenueShareStatementMessage");
const revenueShareStatementSubmit = document.querySelector("#revenueShareStatementSubmit");
const orderCount = document.querySelector("#orderCount");
const orderList = document.querySelector("#orderList");
const refreshOrdersButton = document.querySelector("#refreshOrdersButton");
const deliveryCount = document.querySelector("#deliveryCount");
const deliveryList = document.querySelector("#deliveryList");
const refreshDeliveriesButton = document.querySelector("#refreshDeliveriesButton");
const statDownloadCount = document.querySelector("#statDownloadCount");
const statReportCount = document.querySelector("#statReportCount");
const statRequestCount = document.querySelector("#statRequestCount");
const statRevenueShareCount = document.querySelector("#statRevenueShareCount");
const statOrderCount = document.querySelector("#statOrderCount");
const statDeliveryCount = document.querySelector("#statDeliveryCount");
const accountTabs = Array.from(document.querySelectorAll("[data-account-tab]"));
const accountPanels = Array.from(document.querySelectorAll("[data-account-panel]"));

let accountDownloads = [];
let accountReports = [];
let accountRequests = [];
let accountRevenueShareProjects = [];
let accountOrders = [];
let accountDeliveries = [];
let requestContinuationOptions = [];
let reportSubmitting = false;
let requestSubmitting = false;
let revenueShareStatementSubmitting = false;

const continuationTypeLabels = {
  buyout: "一次性买断",
  pay_per_episode: "按集购买",
  revenue_share: "版权分成"
};

const testReportStatusLabels = {
  submitted: "已提交",
  reviewed: "平台已查看",
  valuable: "有继续价值",
  not_valuable: "暂不建议继续",
  invalid: "数据无效"
};

const testReportStatusNotes = {
  submitted: "平台还在查看这条测试数据。",
  reviewed: "平台已经看过这条测试数据，后续会结合合作申请继续判断。",
  valuable: "这条测试数据表现较好，可以优先申请后续内容或合作。",
  not_valuable: "当前数据暂时不适合继续投入，可以换剧本或优化账号内容后再测。",
  invalid: "这条反馈暂时无法作为合作判断依据，请检查链接或数据。"
};

const continuationStatusLabels = {
  submitted: "已提交",
  contacted: "平台已联系",
  approved: "合作已通过",
  rejected: "暂未通过",
  closed: "已关闭"
};

const revenueShareProjectStatusLabels = {
  draft: "草稿",
  pending_contract: "待确认协议",
  active: "合作中",
  paused: "已暂停",
  completed: "已完成",
  terminated: "已终止"
};

const revenueShareContractStatusLabels = {
  not_uploaded: "协议待上传",
  pending_user_confirmation: "待用户确认",
  confirmed: "协议已确认",
  rejected: "协议需调整"
};

const revenueShareRiskStatusLabels = {
  normal: "正常",
  warning: "预警",
  paused: "已暂停",
  terminated: "已终止"
};

const revenueShareBatchStatusLabels = {
  locked: "未开放",
  released: "已开放",
  paused: "已暂停",
  completed: "已完成"
};

const revenueShareStatementStatusLabels = {
  submitted: "已提交",
  reviewing: "审核中",
  confirmed: "已确认",
  settled: "已结算",
  rejected: "已驳回"
};

const orderStatusLabels = {
  pending_payment: "待付款",
  paid: "已付款",
  delivered: "已交付",
  cancelled: "已取消"
};

const orderStatusNotes = {
  pending_payment: "订单已生成，请按平台约定完成付款。付款确认后交付内容会开放。",
  paid: "付款已确认，关联交付内容已开放领取。",
  delivered: "订单已完成交付。",
  cancelled: "订单已取消，如需继续合作请重新提交申请。"
};

const continuationStatusNotes = {
  submitted: "申请已进入后台，平台会结合下载记录和测试反馈判断。",
  contacted: "平台已经开始跟进，请留意你填写的联系方式。",
  approved: "申请已通过。下一步需要确认具体授权、交付范围和付款/分成规则。",
  rejected: "本次申请暂未通过，可以补充更完整的测试数据后再次申请。",
  closed: "这条申请已经结束，如需继续合作可以重新提交申请。"
};

function setText(element, text) {
  if (element) {
    element.textContent = text || "";
  }
}

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent !== undefined && textContent !== null) {
    element.textContent = textContent;
  }

  return element;
}

function createLink(className, href, text) {
  const link = createElement("a", className, text);
  link.href = href;
  return link;
}

function createButton(className, text, attributes = {}) {
  const button = createElement("button", className, text);
  button.type = "button";

  Object.entries(attributes).forEach(([key, value]) => {
    button.dataset[key] = value;
  });

  return button;
}

function createStatusBadge(status, labels) {
  const badge = createElement("span", `account-status-badge ${status || "unknown"}`, labels[status] || status || "状态未知");
  return badge;
}

function formatMoney(amountCents, currency = "CNY") {
  const amount = Number(amountCents || 0) / 100;
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency
  }).format(amount);
}

function formatDate(value) {
  if (!value) return "时间未知";

  try {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  } catch {
    return "时间未知";
  }
}

function formatList(values, fallback = "待确认") {
  if (!Array.isArray(values) || !values.length) {
    return fallback;
  }

  return values.filter(Boolean).join("、") || fallback;
}

function formatEpisodeNumbers(numbers) {
  const sorted = Array.from(new Set(numbers.map((number) => Number(number)))).sort((a, b) => a - b);
  if (!sorted.length) return "";

  const ranges = [];
  let start = sorted[0];
  let previous = sorted[0];

  for (let index = 1; index <= sorted.length; index += 1) {
    const current = sorted[index];
    if (current === previous + 1) {
      previous = current;
      continue;
    }

    ranges.push(start === previous ? String(start) : `${start}-${previous}`);
    start = current;
    previous = current;
  }

  return `第${ranges.join(",")}集`;
}

function setActivePanel(panelName) {
  accountTabs.forEach((tab) => {
    const active = tab.dataset.accountTab === panelName;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  accountPanels.forEach((panel) => {
    panel.hidden = panel.dataset.accountPanel !== panelName;
  });

  const hashMap = {
    downloads: "downloads-section",
    reports: "test-reports",
    requests: "continuation-requests",
    revenueShare: "revenue-share-projects",
    orders: "orders",
    deliveries: "deliveries"
  };

  if (hashMap[panelName]) {
    history.replaceState(null, "", `#${hashMap[panelName]}`);
  }
}

function panelFromHash() {
  if (window.location.hash === "#test-reports") return "reports";
  if (window.location.hash === "#continuation-requests") return "requests";
  if (window.location.hash === "#revenue-share-projects") return "revenueShare";
  if (window.location.hash === "#orders") return "orders";
  if (window.location.hash === "#deliveries") return "deliveries";
  return "downloads";
}

function updateStats() {
  setText(statDownloadCount, String(accountDownloads.length));
  setText(statReportCount, String(accountReports.length));
  setText(statRequestCount, String(accountRequests.length));
  setText(statRevenueShareCount, String(accountRevenueShareProjects.length));
  setText(statOrderCount, String(accountOrders.length));
  setText(statDeliveryCount, String(accountDeliveries.length));
}

function populateDownloadSelects(downloads) {
  reportDownloadSelect.replaceChildren();

  if (!downloads.length) {
    reportDownloadSelect.appendChild(new Option("请先下载一套剧本", ""));
    reportDownloadSelect.disabled = true;
    reportSubmit.disabled = true;
    return;
  }

  reportDownloadSelect.disabled = false;
  reportSubmit.disabled = false;
  reportDownloadSelect.appendChild(new Option("请选择下载记录", ""));

  downloads.forEach((download) => {
    const label = `${download.script.title} / ${formatDate(download.createdAt)}`;
    const reportOption = new Option(label, download.id);
    reportOption.dataset.scriptId = download.script.id;
    reportDownloadSelect.appendChild(reportOption);
  });
}

function renderEmptyDownloads() {
  downloadList.replaceChildren();

  const empty = createElement("article", "account-empty");
  empty.appendChild(createElement("strong", "", "你还没有下载记录"));
  empty.appendChild(createElement("p", "", "先去剧本库挑选一套剧本，下载前三集验证包后，这里会自动出现记录。"));
  empty.appendChild(createLink("primary-button", "scripts.html", "进入剧本库"));
  downloadList.appendChild(empty);
  setText(downloadCount, "暂无下载记录");
  populateDownloadSelects([]);
}

function renderDownloads(downloads) {
  accountDownloads = downloads;
  downloadList.replaceChildren();

  if (!downloads.length) {
    renderEmptyDownloads();
    updateStats();
    return;
  }

  setText(downloadCount, `共 ${downloads.length} 条下载记录`);

  downloads.forEach((download) => {
    const card = createElement("article", "account-download-card");
    const top = createElement("div", "account-download-top");
    top.appendChild(createElement("span", "", download.script.category || "剧本"));
    top.appendChild(createElement("em", "", formatDate(download.createdAt)));
    card.appendChild(top);

    card.appendChild(createElement("h3", "", download.script.title));
    card.appendChild(createElement("p", "", download.asset.title || "免费前三集验证包"));

    const meta = createElement("div", "account-download-meta");
    meta.appendChild(createElement("span", "", download.asset.version || "v1"));
    meta.appendChild(createElement("span", "", download.asset.fileFormat?.toUpperCase() || "MD"));
    meta.appendChild(createElement("span", "", download.licenseConfirmed ? "已确认授权边界" : "授权状态待确认"));
    card.appendChild(meta);

    const actions = createElement("div", "account-download-actions");
    actions.appendChild(createLink("secondary-button", `script-preview.html?slug=${download.script.slug}`, "查看详情"));
    actions.appendChild(
      createLink(
        "secondary-button",
        download.asset.downloadUrl || `/api/download-files/script-assets/${download.asset.id}`,
        "重新下载 Word 文档"
      )
    );
    actions.appendChild(createButton("secondary-button", "提交反馈", { panelTarget: "reports", downloadId: download.id }));
    actions.appendChild(createButton("primary-button", "申请合作", { panelTarget: "requests", downloadId: download.id }));
    card.appendChild(actions);

    downloadList.appendChild(card);
  });

  populateDownloadSelects(downloads);
  updateStats();
}

function getSelectedDownload() {
  return accountDownloads.find((download) => download.id === reportDownloadSelect.value) || null;
}

function getSelectedRequestDownload() {
  return requestContinuationOptions.find((item) => item.downloadId === requestDownloadSelect.value) || null;
}

function getSelectedEpisodeNumbers() {
  return Array.from(requestEpisodeSelect.querySelectorAll("input[type='checkbox']:checked")).map((input) =>
    Number(input.value)
  );
}

function renderEpisodeChoices(optionItem) {
  requestEpisodeSelect.replaceChildren();
  requestEpisodeRange.value = "";

  if (requestTypeSelect.value !== "pay_per_episode") {
    requestEpisodeField.hidden = true;
    return;
  }

  requestEpisodeField.hidden = false;

  if (!optionItem) {
    requestEpisodeSelect.appendChild(createElement("p", "account-status-note", "请先选择一套可按集购买的剧本。"));
    return;
  }

  (optionItem.episodes || []).forEach((episode) => {
    const label = createElement("label", episode.disabled ? "disabled" : "");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "episodeNumbers";
    checkbox.value = String(episode.episodeNumber);
    checkbox.disabled = Boolean(episode.disabled);
    label.appendChild(checkbox);
    label.appendChild(
      createElement(
        "span",
        "",
        episode.disabled
          ? `第${episode.episodeNumber}集（${episode.disabledReason || "不可选"}）`
          : `第${episode.episodeNumber}集`
      )
    );
    requestEpisodeSelect.appendChild(label);
  });

  if (!optionItem.episodes?.length) {
    requestEpisodeSelect.appendChild(createElement("p", "account-status-note", "当前剧本暂无可购买的后续集数。"));
  }
}

function populateRequestDownloadSelect(items, preferredDownloadId = "") {
  requestContinuationOptions = items;
  requestDownloadSelect.replaceChildren();

  if (!items.length) {
    requestDownloadSelect.appendChild(new Option("当前合作方式下暂无可申请剧本", ""));
    requestDownloadSelect.disabled = true;
    requestSubmit.disabled = true;
    renderEpisodeChoices(null);
    return;
  }

  requestDownloadSelect.disabled = false;
  requestSubmit.disabled = false;
  requestDownloadSelect.appendChild(new Option("请选择可申请剧本", ""));

  items.forEach((item) => {
    const suffix =
      requestTypeSelect.value === "pay_per_episode"
        ? ` / 可选 ${item.enabledEpisodeCount || 0} 集`
        : ` / ${formatDate(item.downloadedAt)}`;
    const option = new Option(`${item.script.title}${suffix}`, item.downloadId);
    option.dataset.scriptId = item.script.id;
    requestDownloadSelect.appendChild(option);
  });

  if (preferredDownloadId && items.some((item) => item.downloadId === preferredDownloadId)) {
    requestDownloadSelect.value = preferredDownloadId;
  }

  renderEpisodeChoices(getSelectedRequestDownload());
}

function setReportMessage(text, type = "neutral") {
  setText(reportMessage, text);
  reportMessage.dataset.type = type;
}

function setReportSubmitting(submitting) {
  reportSubmitting = submitting;
  reportSubmit.disabled = submitting || reportDownloadSelect.disabled;
  reportSubmit.textContent = submitting ? "正在提交..." : "提交测试反馈";
}

function setRequestMessage(text, type = "neutral") {
  setText(requestMessage, text);
  requestMessage.dataset.type = type;
}

function setRequestSubmitting(submitting) {
  requestSubmitting = submitting;
  requestSubmit.disabled = submitting || requestDownloadSelect.disabled;
  requestSubmit.textContent = submitting ? "正在提交..." : "提交后续合作申请";
}

function numberOrEmpty(formData, name) {
  const value = String(formData.get(name) || "").trim();
  return value === "" ? null : Number(value);
}

function setRevenueShareStatementMessage(text, type = "neutral") {
  setText(revenueShareStatementMessage, text);
  revenueShareStatementMessage.dataset.type = type;
}

function setRevenueShareStatementSubmitting(submitting) {
  revenueShareStatementSubmitting = submitting;
  revenueShareStatementSubmit.disabled = submitting || revenueShareProjectSelect.disabled;
  revenueShareStatementSubmit.textContent = submitting ? "正在提交..." : "提交月度回传";
}

function populateRequestReportSelect(reports) {
  requestReportSelect.replaceChildren();
  requestReportSelect.appendChild(new Option("暂不关联测试反馈", ""));

  reports.forEach((report) => {
    const option = new Option(`${report.script.title} / ${report.platform} / ${formatDate(report.createdAt)}`, report.id);
    option.dataset.scriptId = report.script.id;
    requestReportSelect.appendChild(option);
  });
}

function renderEmptyReports() {
  accountReports = [];
  populateRequestReportSelect([]);
  reportList.replaceChildren();
  const empty = createElement("article", "account-empty");
  empty.appendChild(createElement("strong", "", "还没有测试反馈"));
  empty.appendChild(createElement("p", "", "用前三集发布测试视频后，把链接和数据提交到这里，后续合作会更有判断依据。"));
  reportList.appendChild(empty);
  setText(reportCount, "暂无测试反馈");
  updateStats();
}

function renderReports(reports) {
  accountReports = reports;
  populateRequestReportSelect(reports);
  reportList.replaceChildren();

  if (!reports.length) {
    renderEmptyReports();
    return;
  }

  setText(reportCount, `共 ${reports.length} 条测试反馈`);

  reports.forEach((report) => {
    const card = createElement("article", "test-report-card");
    const top = createElement("div", "account-download-top");
    top.appendChild(createElement("span", "", report.platform));
    top.appendChild(createElement("em", "", formatDate(report.createdAt)));
    card.appendChild(top);

    card.appendChild(createElement("h3", "", report.script.title));
    card.appendChild(createLink("", report.videoUrl, report.videoUrl));

    const metrics = createElement("div", "account-download-meta");
    metrics.appendChild(createElement("span", "", `播放 ${report.viewCount ?? 0}`));
    metrics.appendChild(createElement("span", "", `点赞 ${report.likeCount ?? 0}`));
    metrics.appendChild(createElement("span", "", `评论 ${report.commentCount ?? 0}`));
    metrics.appendChild(createElement("span", "", `涨粉 ${report.followerDelta ?? 0}`));
    metrics.appendChild(createStatusBadge(report.status, testReportStatusLabels));
    card.appendChild(metrics);

    if (testReportStatusNotes[report.status]) {
      card.appendChild(createElement("p", "account-status-note", testReportStatusNotes[report.status]));
    }

    if (report.notes) {
      card.appendChild(createElement("p", "", report.notes));
    }

    reportList.appendChild(card);
  });

  updateStats();
}

function renderEmptyRequests() {
  accountRequests = [];
  requestList.replaceChildren();
  const empty = createElement("article", "account-empty");
  empty.appendChild(createElement("strong", "", "还没有后续合作申请"));
  empty.appendChild(createElement("p", "", "当某套剧本的数据值得继续制作时，可以在这里提交买断、按集购买或分成合作申请。"));
  requestList.appendChild(empty);
  setText(requestCount, "暂无后续合作申请");
  updateStats();
}

function renderRequests(requests) {
  accountRequests = requests;
  requestList.replaceChildren();

  if (!requests.length) {
    renderEmptyRequests();
    return;
  }

  setText(requestCount, `共 ${requests.length} 条后续合作申请`);

  requests.forEach((item) => {
    const card = createElement("article", "test-report-card");
    const top = createElement("div", "account-download-top");
    top.appendChild(createElement("span", "", continuationTypeLabels[item.type] || item.type));
    top.appendChild(createElement("em", "", formatDate(item.createdAt)));
    card.appendChild(top);

    card.appendChild(createElement("h3", "", item.script.title));

    const meta = createElement("div", "account-download-meta");
    meta.appendChild(createStatusBadge(item.status, continuationStatusLabels));
    if (item.episodeRange) {
      meta.appendChild(createElement("span", "", item.episodeRange));
    }
    if (item.testReportId) {
      meta.appendChild(createElement("span", "", "已关联测试反馈"));
    }
    card.appendChild(meta);

    if (continuationStatusNotes[item.status]) {
      card.appendChild(createElement("p", "account-status-note", continuationStatusNotes[item.status]));
    }

    if (item.contactPreference) {
      card.appendChild(createElement("p", "", `联系方式偏好：${item.contactPreference}`));
    }

    if (item.message) {
      card.appendChild(createElement("p", "", item.message));
    }

    requestList.appendChild(card);
  });

  updateStats();
}

function renderEmptyRevenueShareProjects() {
  accountRevenueShareProjects = [];
  revenueShareProjectSelect.replaceChildren();
  revenueShareProjectSelect.appendChild(new Option("暂无可回传的分成项目", ""));
  revenueShareProjectSelect.disabled = true;
  revenueShareStatementSubmit.disabled = true;
  revenueShareList.replaceChildren();

  const empty = createElement("article", "account-empty");
  empty.appendChild(createElement("strong", "", "还没有版权分成项目"));
  empty.appendChild(createElement("p", "", "当后台通过分成合作并创建分成项目后，你会在这里看到协议状态、开放集数和交付批次。"));
  revenueShareList.appendChild(empty);
  setText(revenueShareCount, "暂无版权分成项目");
  updateStats();
}

function populateRevenueShareProjectSelect(projects) {
  revenueShareProjectSelect.replaceChildren();
  const activeProjects = projects.filter((project) => project.status === "active");

  if (!activeProjects.length) {
    revenueShareProjectSelect.appendChild(new Option("暂无可回传的分成项目", ""));
    revenueShareProjectSelect.disabled = true;
    revenueShareStatementSubmit.disabled = true;
    return;
  }

  revenueShareProjectSelect.disabled = false;
  revenueShareStatementSubmit.disabled = revenueShareStatementSubmitting;
  revenueShareProjectSelect.appendChild(new Option("请选择分成项目", ""));

  activeProjects.forEach((project) => {
    revenueShareProjectSelect.appendChild(
      new Option(
        `${project.script?.title || "剧本"} / 第 ${project.firstEpisodeNumber || 4}-${project.currentEpisodeEnd || 10} 集`,
        project.id
      )
    );
  });
}

function renderRevenueShareBatch(batch) {
  const row = createElement("div", "account-download-meta");
  row.appendChild(createStatusBadge(batch.status, revenueShareBatchStatusLabels));
  row.appendChild(createElement("span", "", `第 ${batch.episodeStart}-${batch.episodeEnd} 集`));

  if (batch.delivery) {
    row.appendChild(createElement("span", "", `${batch.delivery.title || "交付包"} · ${batch.delivery.assetCount || 0} 个文件`));
  } else if (batch.lockedReason) {
    row.appendChild(createElement("span", "", batch.lockedReason));
  }

  return row;
}

function renderRevenueShareStatement(statement) {
  const row = createElement("div", "account-download-meta");
  const periodStart = statement.periodStart ? formatDate(statement.periodStart).slice(0, 10) : "";
  const periodEnd = statement.periodEnd ? formatDate(statement.periodEnd).slice(0, 10) : "";
  const revenueCents = statement.confirmedRevenueCents ?? statement.reportedRevenueCents ?? 0;
  row.appendChild(createStatusBadge(statement.status, revenueShareStatementStatusLabels));
  row.appendChild(createElement("span", "", periodStart && periodEnd ? `${periodStart} 至 ${periodEnd}` : "结算周期待确认"));
  row.appendChild(createElement("span", "", `确认收益 ${formatMoney(revenueCents)}`));
  row.appendChild(createElement("span", "", `平台分成 ${formatMoney(statement.platformShareCents)}`));
  return row;
}

function renderRevenueShareProjects(projects) {
  accountRevenueShareProjects = projects;
  revenueShareList.replaceChildren();
  populateRevenueShareProjectSelect(projects);

  if (!projects.length) {
    renderEmptyRevenueShareProjects();
    return;
  }

  setText(revenueShareCount, `共 ${projects.length} 个版权分成项目`);

  projects.forEach((project) => {
    const card = createElement("article", "test-report-card");
    const top = createElement("div", "account-download-top");
    top.appendChild(createElement("span", "", project.script?.title || "版权分成项目"));
    top.appendChild(createElement("em", "", formatDate(project.startedAt || project.createdAt)));
    card.appendChild(top);

    card.appendChild(createElement("h3", "", `${project.script?.title || "剧本"} · 分成合作`));

    const meta = createElement("div", "account-download-meta");
    meta.appendChild(createStatusBadge(project.status, revenueShareProjectStatusLabels));
    meta.appendChild(createStatusBadge(project.contractStatus, revenueShareContractStatusLabels));
    meta.appendChild(createStatusBadge(project.riskStatus, revenueShareRiskStatusLabels));
    meta.appendChild(createElement("span", "", `平台 ${project.shareRatioPlatform ?? 0}% / 用户 ${project.shareRatioUser ?? 0}%`));
    meta.appendChild(createElement("span", "", `已开放第 ${project.firstEpisodeNumber || 4}-${project.currentEpisodeEnd || 10} 集`));
    card.appendChild(meta);

    const scope = createElement("div", "account-download-meta");
    scope.appendChild(createElement("span", "", `授权平台：${formatList(project.authorizedPlatforms)}`));
    scope.appendChild(createElement("span", "", `授权账号：${formatList(project.authorizedAccounts)}`));
    card.appendChild(scope);

    if (project.userVisibleNote) {
      card.appendChild(createElement("p", "account-status-note", project.userVisibleNote));
    } else {
      card.appendChild(createElement("p", "account-status-note", "分成项目已建立。月度收益回传和结算功能会在下一阶段开放。"));
    }

    if (project.batches?.length) {
      card.appendChild(createElement("strong", "", "开放批次"));
      project.batches.forEach((batch) => {
        card.appendChild(renderRevenueShareBatch(batch));
      });
    }

    if (project.statements?.length) {
      card.appendChild(createElement("strong", "", "最近结算"));
      project.statements.slice(0, 2).forEach((statement) => {
        card.appendChild(renderRevenueShareStatement(statement));
      });
    }

    const actions = createElement("div", "account-download-actions");
    actions.appendChild(createButton("primary-button", "查看交付内容", { panelTarget: "deliveries" }));
    if (project.contractFilePath) {
      actions.appendChild(createLink("secondary-button", `/${project.contractFilePath}`, "查看分成协议"));
    }
    card.appendChild(actions);

    revenueShareList.appendChild(card);
  });

  updateStats();
}

function renderEmptyDeliveries() {
  accountDeliveries = [];
  deliveryList.replaceChildren();

  const empty = createElement("article", "account-empty");
  empty.appendChild(createElement("strong", "", "还没有可领取的交付内容"));
  empty.appendChild(createElement("p", "", "当后台通过合作申请并创建交付后，后续剧集、完整剧本包或授权文件会显示在这里。"));
  deliveryList.appendChild(empty);
  setText(deliveryCount, "暂无交付内容");
  updateStats();
}

function renderEmptyOrders() {
  accountOrders = [];
  orderList.replaceChildren();

  const empty = createElement("article", "account-empty");
  empty.appendChild(createElement("strong", "", "还没有订单"));
  empty.appendChild(createElement("p", "", "当后台通过合作申请并生成报价后，待付款订单会显示在这里。"));
  orderList.appendChild(empty);
  setText(orderCount, "暂无订单");
  updateStats();
}

function renderOrders(orders) {
  accountOrders = orders;
  orderList.replaceChildren();

  if (!orders.length) {
    renderEmptyOrders();
    return;
  }

  setText(orderCount, `共 ${orders.length} 个订单`);

  orders.forEach((order) => {
    const card = createElement("article", "test-report-card");
    const top = createElement("div", "account-download-top");
    top.appendChild(createElement("span", "", order.script?.title || "订单"));
    top.appendChild(createElement("em", "", formatDate(order.createdAt)));
    card.appendChild(top);

    card.appendChild(createElement("h3", "", order.title));

    const meta = createElement("div", "account-download-meta");
    meta.appendChild(createStatusBadge(order.status, orderStatusLabels));
    meta.appendChild(createElement("span", "", formatMoney(order.amountCents, order.currency)));
    meta.appendChild(createElement("span", "", continuationTypeLabels[order.orderType] || order.orderType || "合作订单"));
    card.appendChild(meta);

    if (order.userVisibleNote || orderStatusNotes[order.status]) {
      card.appendChild(createElement("p", "account-status-note", order.userVisibleNote || orderStatusNotes[order.status]));
    }

    if (order.paymentNote) {
      card.appendChild(createElement("p", "", `付款备注：${order.paymentNote}`));
    }

    if (order.status === "paid" || order.status === "delivered") {
      const actions = createElement("div", "account-download-actions");
      actions.appendChild(createButton("primary-button", "查看交付内容", { panelTarget: "deliveries" }));
      card.appendChild(actions);
    }

    orderList.appendChild(card);
  });

  updateStats();
}

function renderDeliveries(deliveries) {
  accountDeliveries = deliveries;
  deliveryList.replaceChildren();

  if (!deliveries.length) {
    renderEmptyDeliveries();
    return;
  }

  setText(deliveryCount, `共 ${deliveries.length} 个交付包`);

  deliveries.forEach((delivery) => {
    const card = createElement("article", "test-report-card");
    const top = createElement("div", "account-download-top");
    top.appendChild(createElement("span", "", delivery.script?.title || "交付内容"));
    top.appendChild(createElement("em", "", formatDate(delivery.createdAt)));
    card.appendChild(top);

    card.appendChild(createElement("h3", "", delivery.title));

    const meta = createElement("div", "account-download-meta");
    meta.appendChild(createStatusBadge(delivery.status, { ready: "可领取", delivered: "已交付", archived: "已归档" }));
    meta.appendChild(createElement("span", "", delivery.deliveryType ? continuationTypeLabels[delivery.deliveryType] || delivery.deliveryType : "交付包"));
    meta.appendChild(createElement("span", "", `${delivery.assets?.length || 0} 个文件`));
    card.appendChild(meta);

    if (delivery.note) {
      card.appendChild(createElement("p", "account-status-note", delivery.note));
    }

    const actions = createElement("div", "account-download-actions");
    (delivery.assets || []).forEach((asset) => {
      actions.appendChild(
        createLink(
          "primary-button",
          asset.downloadUrl || `/api/download-files/delivery-assets/${asset.id}`,
          asset.title || "下载交付文件"
        )
      );
    });

    if (!delivery.assets?.length) {
      actions.appendChild(createElement("p", "account-status-note", "平台已创建交付记录，交付文件会在确认后补充。"));
    }

    card.appendChild(actions);
    deliveryList.appendChild(card);
  });

  updateStats();
}

async function loadDownloads() {
  const response = await fetch("/api/me/downloads", {
    credentials: "same-origin"
  });

  if (response.status === 401) {
    window.location.href = "auth.html?mode=login&next=account.html";
    return;
  }

  if (!response.ok) {
    throw new Error(`Downloads request failed: ${response.status}`);
  }

  const data = await response.json();
  renderDownloads(data.items || []);
}

async function loadReports() {
  if (refreshReportsButton) {
    refreshReportsButton.disabled = true;
  }

  try {
    const response = await fetch("/api/me/test-reports", {
      credentials: "same-origin"
    });

    if (response.status === 401) {
      window.location.href = "auth.html?mode=login&next=account.html";
      return;
    }

    if (!response.ok) {
      throw new Error(`Test reports request failed: ${response.status}`);
    }

    const data = await response.json();
    renderReports(data.items || []);
  } finally {
    if (refreshReportsButton) {
      refreshReportsButton.disabled = false;
    }
  }
}

async function loadContinuationRequests() {
  if (refreshRequestsButton) {
    refreshRequestsButton.disabled = true;
  }

  try {
    const response = await fetch("/api/me/continuation-requests", {
      credentials: "same-origin"
    });

    if (response.status === 401) {
      window.location.href = "auth.html?mode=login&next=account.html";
      return;
    }

    if (!response.ok) {
      throw new Error(`Continuation requests request failed: ${response.status}`);
    }

    const data = await response.json();
    renderRequests(data.items || []);
  } finally {
    if (refreshRequestsButton) {
      refreshRequestsButton.disabled = false;
    }
  }
}

async function loadContinuationOptions(preferredDownloadId = "") {
  const type = requestTypeSelect.value;
  if (!type) {
    populateRequestDownloadSelect([]);
    return;
  }

  requestDownloadSelect.disabled = true;
  requestSubmit.disabled = true;
  requestDownloadSelect.replaceChildren();
  requestDownloadSelect.appendChild(new Option("正在读取可申请剧本...", ""));
  renderEpisodeChoices(null);

  const response = await fetch(`/api/me/continuation-options?type=${encodeURIComponent(type)}`, {
    credentials: "same-origin"
  });

  if (response.status === 401) {
    window.location.href = "auth.html?mode=login&next=account.html";
    return;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Continuation options request failed: ${response.status}`);
  }

  populateRequestDownloadSelect(data.items || [], preferredDownloadId);
}

async function loadRevenueShareProjects() {
  if (refreshRevenueShareButton) {
    refreshRevenueShareButton.disabled = true;
  }

  try {
    const response = await fetch("/api/me/revenue-share-projects", {
      credentials: "same-origin"
    });

    if (response.status === 401) {
      window.location.href = "auth.html?mode=login&next=account.html";
      return;
    }

    if (!response.ok) {
      throw new Error(`Revenue share projects request failed: ${response.status}`);
    }

    const data = await response.json();
    renderRevenueShareProjects(data.items || []);
  } finally {
    if (refreshRevenueShareButton) {
      refreshRevenueShareButton.disabled = false;
    }
  }
}

async function loadDeliveries() {
  if (refreshDeliveriesButton) {
    refreshDeliveriesButton.disabled = true;
  }

  try {
    const response = await fetch("/api/me/deliveries", {
      credentials: "same-origin"
    });

    if (response.status === 401) {
      window.location.href = "auth.html?mode=login&next=account.html";
      return;
    }

    if (!response.ok) {
      throw new Error(`Deliveries request failed: ${response.status}`);
    }

    const data = await response.json();
    renderDeliveries(data.items || []);
  } finally {
    if (refreshDeliveriesButton) {
      refreshDeliveriesButton.disabled = false;
    }
  }
}

async function loadOrders() {
  if (refreshOrdersButton) {
    refreshOrdersButton.disabled = true;
  }

  try {
    const response = await fetch("/api/me/orders", {
      credentials: "same-origin"
    });

    if (response.status === 401) {
      window.location.href = "auth.html?mode=login&next=account.html";
      return;
    }

    if (!response.ok) {
      throw new Error(`Orders request failed: ${response.status}`);
    }

    const data = await response.json();
    renderOrders(data.items || []);
  } finally {
    if (refreshOrdersButton) {
      refreshOrdersButton.disabled = false;
    }
  }
}

async function submitReport(event) {
  event.preventDefault();

  if (reportSubmitting) return;

  const selectedDownload = getSelectedDownload();
  if (!selectedDownload) {
    setReportMessage("请先选择一条下载记录。", "error");
    return;
  }

  const formData = new FormData(reportForm);
  const publishTimeValue = String(formData.get("publishTime") || "").trim();

  const payload = {
    scriptId: selectedDownload.script.id,
    downloadId: selectedDownload.id,
    platform: String(formData.get("platform") || "").trim(),
    videoUrl: String(formData.get("videoUrl") || "").trim(),
    viewCount: numberOrEmpty(formData, "viewCount"),
    likeCount: numberOrEmpty(formData, "likeCount"),
    commentCount: numberOrEmpty(formData, "commentCount"),
    followerDelta: numberOrEmpty(formData, "followerDelta"),
    publishTime: publishTimeValue || null,
    notes: String(formData.get("notes") || "").trim()
  };

  setReportSubmitting(true);
  setReportMessage("正在提交测试反馈...");

  try {
    const response = await fetch("/api/test-reports", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "测试反馈提交失败");
    }

    reportForm.reset();
    setReportMessage("测试反馈已提交。", "success");
    await loadReports();
  } catch (error) {
    setReportMessage(error.message || "请稍后再试。", "error");
  } finally {
    setReportSubmitting(false);
  }
}

async function submitContinuationRequest(event) {
  event.preventDefault();

  if (requestSubmitting) return;

  const selectedDownload = getSelectedRequestDownload();
  if (!selectedDownload) {
    setRequestMessage("请先选择一条下载记录。", "error");
    return;
  }

  const formData = new FormData(requestForm);
  const selectedReport = accountReports.find((report) => report.id === String(formData.get("testReportId") || ""));
  const requestType = String(formData.get("type") || "");
  const selectedEpisodeNumbers = getSelectedEpisodeNumbers();

  if (requestType === "pay_per_episode" && !selectedEpisodeNumbers.length) {
    setRequestMessage("请选择至少一集需要购买的后续内容。", "error");
    return;
  }

  const payload = {
    scriptId: selectedDownload.script.id,
    downloadId: selectedDownload.downloadId,
    testReportId: selectedReport?.script?.id === selectedDownload.script.id ? selectedReport.id : null,
    type: requestType,
    episodeNumbers: requestType === "pay_per_episode" ? selectedEpisodeNumbers : [],
    episodeRange: requestType === "pay_per_episode" ? formatEpisodeNumbers(selectedEpisodeNumbers) : "",
    contactPreference: String(formData.get("contactPreference") || "").trim(),
    message: String(formData.get("message") || "").trim()
  };

  setRequestSubmitting(true);
  setRequestMessage("正在提交后续合作申请...");

  try {
    const response = await fetch("/api/continuation-requests", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "后续合作申请提交失败");
    }

    requestForm.reset();
    requestEpisodeRange.value = "";
    setRequestMessage("后续合作申请已提交。", "success");
    await Promise.all([loadContinuationRequests(), loadContinuationOptions()]);
  } catch (error) {
    setRequestMessage(error.message || "请稍后再试。", "error");
  } finally {
    setRequestSubmitting(false);
  }
}

async function submitRevenueShareStatement(event) {
  event.preventDefault();

  if (revenueShareStatementSubmitting) return;

  const formData = new FormData(revenueShareStatementForm);
  const projectId = String(formData.get("projectId") || "").trim();
  const selectedProject = accountRevenueShareProjects.find((project) => project.id === projectId);
  const episodeNumber = Number(formData.get("episodeNumber"));

  if (!selectedProject) {
    setRevenueShareStatementMessage("请先选择一个分成项目。", "error");
    return;
  }

  if (
    !Number.isInteger(episodeNumber) ||
    episodeNumber < selectedProject.firstEpisodeNumber ||
    episodeNumber > selectedProject.currentEpisodeEnd
  ) {
    setRevenueShareStatementMessage("集数必须在当前已开放范围内。", "error");
    return;
  }

  const payload = {
    projectId,
    periodStart: String(formData.get("periodStart") || "").trim(),
    periodEnd: String(formData.get("periodEnd") || "").trim(),
    reportedRevenueYuan: String(formData.get("reportedRevenueYuan") || "").trim(),
    userNote: String(formData.get("userNote") || "").trim(),
    videos: [
      {
        episodeNumber,
        title: String(formData.get("videoTitle") || "").trim(),
        videoUrl: String(formData.get("videoUrl") || "").trim(),
        platform: String(formData.get("platform") || "").trim(),
        accountName: String(formData.get("accountName") || "").trim(),
        publishedAt: String(formData.get("publishedAt") || "").trim(),
        viewCount: numberOrEmpty(formData, "viewCount"),
        likeCount: numberOrEmpty(formData, "likeCount"),
        commentCount: numberOrEmpty(formData, "commentCount"),
        reportedRevenueYuan: String(formData.get("videoRevenueYuan") || "").trim(),
        revenueType: "platform_income"
      }
    ],
    evidence: [
      {
        evidenceType: String(formData.get("evidenceType") || "revenue_screenshot").trim(),
        filePath: String(formData.get("evidencePath") || "").trim()
      }
    ]
  };

  setRevenueShareStatementSubmitting(true);
  setRevenueShareStatementMessage("正在提交分成月度回传...");

  try {
    const response = await fetch("/api/me/revenue-share-statements", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "分成月度回传提交失败");
    }

    revenueShareStatementForm.reset();
    setRevenueShareStatementMessage("月度回传已提交，等待后台审核。", "success");
    await loadRevenueShareProjects();
  } catch (error) {
    setRevenueShareStatementMessage(error.message || "请稍后再试。", "error");
  } finally {
    setRevenueShareStatementSubmitting(false);
  }
}

function handleDownloadQuickAction(event) {
  const button = event.target.closest("[data-panel-target]");
  if (!button) return;

  const panel = button.dataset.panelTarget;
  const downloadId = button.dataset.downloadId;

  setActivePanel(panel);

  if (panel === "reports") {
    reportDownloadSelect.value = downloadId;
    reportForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (panel === "requests") {
    requestTypeSelect.value = "pay_per_episode";
    loadContinuationOptions(downloadId).catch((error) => {
      setRequestMessage(error.message || "可申请剧本读取失败，请稍后再试。", "error");
    });
    requestForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (panel === "deliveries") {
    deliveryList.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

async function initializeAccount() {
  const user = await window.ScriptMarketplaceSession.getCurrentUser({ refresh: true });

  if (!user) {
    window.location.href = "auth.html?mode=login&next=account.html";
    return;
  }

  setText(accountName, user.displayName || user.email);
  setText(accountEmail, user.email);

  try {
    await window.ScriptMarketplaceSession.bindVisitorDownloads();
  } catch {
    // Binding is helpful, but the account page should still load if it fails.
  }

  setActivePanel(panelFromHash());
  await loadDownloads();
  await loadReports();
  await loadContinuationRequests();
  await loadContinuationOptions();
  await loadRevenueShareProjects();
  await loadOrders();
  await loadDeliveries();
}

accountTabs.forEach((tab) => {
  tab.addEventListener("click", () => setActivePanel(tab.dataset.accountTab));
});

downloadList.addEventListener("click", handleDownloadQuickAction);
revenueShareList.addEventListener("click", handleDownloadQuickAction);
orderList.addEventListener("click", handleDownloadQuickAction);
reportForm.addEventListener("submit", submitReport);
requestForm.addEventListener("submit", submitContinuationRequest);
revenueShareStatementForm.addEventListener("submit", submitRevenueShareStatement);
requestTypeSelect.addEventListener("change", async () => {
  setRequestMessage("正在根据合作方式刷新可申请剧本...");
  try {
    await loadContinuationOptions();
    setRequestMessage("", "neutral");
  } catch (error) {
    setRequestMessage(error.message || "可申请剧本读取失败，请稍后再试。", "error");
  }
});
requestDownloadSelect.addEventListener("change", () => {
  renderEpisodeChoices(getSelectedRequestDownload());
});
requestEpisodeSelect.addEventListener("change", () => {
  requestEpisodeRange.value = formatEpisodeNumbers(getSelectedEpisodeNumbers());
});
refreshReportsButton?.addEventListener("click", async () => {
  setReportMessage("正在刷新测试反馈状态...");
  try {
    await loadReports();
    setReportMessage("测试反馈状态已刷新。", "success");
  } catch (error) {
    setReportMessage(error.message || "刷新失败，请稍后再试。", "error");
  }
});
refreshRequestsButton?.addEventListener("click", async () => {
  setRequestMessage("正在刷新后续合作状态...");
  try {
    await loadContinuationRequests();
    setRequestMessage("后续合作状态已刷新。", "success");
  } catch (error) {
    setRequestMessage(error.message || "刷新失败，请稍后再试。", "error");
  }
});
refreshRevenueShareButton?.addEventListener("click", async () => {
  try {
    await loadRevenueShareProjects();
  } catch (error) {
    revenueShareList.replaceChildren();
    const errorCard = createElement("article", "account-empty");
    errorCard.appendChild(createElement("strong", "", "分成项目刷新失败"));
    errorCard.appendChild(createElement("p", "", error.message || "请稍后再试。"));
    revenueShareList.appendChild(errorCard);
  }
});
refreshOrdersButton?.addEventListener("click", async () => {
  try {
    await loadOrders();
  } catch (error) {
    orderList.replaceChildren();
    const errorCard = createElement("article", "account-empty");
    errorCard.appendChild(createElement("strong", "", "订单刷新失败"));
    errorCard.appendChild(createElement("p", "", error.message || "请稍后再试。"));
    orderList.appendChild(errorCard);
  }
});
refreshDeliveriesButton?.addEventListener("click", async () => {
  try {
    await loadDeliveries();
  } catch (error) {
    deliveryList.replaceChildren();
    const errorCard = createElement("article", "account-empty");
    errorCard.appendChild(createElement("strong", "", "交付内容刷新失败"));
    errorCard.appendChild(createElement("p", "", error.message || "请稍后再试。"));
    deliveryList.appendChild(errorCard);
  }
});

logoutButton.addEventListener("click", async () => {
  await window.ScriptMarketplaceSession.logout();
  window.location.href = "auth.html?mode=login";
});

initializeAccount().catch((error) => {
  console.error(error);
  setText(downloadCount, "下载记录读取失败");
  downloadList.replaceChildren();
  const errorCard = createElement("article", "account-empty");
  errorCard.appendChild(createElement("strong", "", "暂时无法读取用户中心数据"));
  errorCard.appendChild(createElement("p", "", "请确认后端服务已启动，然后刷新页面重试。"));
  downloadList.appendChild(errorCard);
});
