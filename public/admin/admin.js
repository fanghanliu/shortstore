const adminUserNode = document.querySelector("[data-admin-user]");
const noticeNode = document.querySelector("[data-admin-notice]");
const metricsNode = document.querySelector("[data-metrics]");
const recentRequestsNode = document.querySelector("[data-recent-requests]");
const recentReportsNode = document.querySelector("[data-recent-reports]");
const requestCountNode = document.querySelector("[data-request-count]");
const reportCountNode = document.querySelector("[data-report-count]");

const requestsTableNode = document.querySelector("[data-requests-table]");
const requestsSummaryNode = document.querySelector("[data-requests-summary]");
const requestsPageNode = document.querySelector("[data-requests-page]");
const requestsStatusNode = document.querySelector("[data-requests-status]");
const requestsTypeNode = document.querySelector("[data-requests-type]");
const requestsSearchNode = document.querySelector("[data-requests-search]");

const ordersTableNode = document.querySelector("[data-orders-table]");
const ordersSummaryNode = document.querySelector("[data-orders-summary]");
const ordersPageNode = document.querySelector("[data-orders-page]");
const ordersStatusNode = document.querySelector("[data-orders-status]");
const ordersSearchNode = document.querySelector("[data-orders-search]");

const reportsTableNode = document.querySelector("[data-reports-table]");
const reportsSummaryNode = document.querySelector("[data-reports-summary]");
const reportsPageNode = document.querySelector("[data-reports-page]");
const reportsStatusNode = document.querySelector("[data-reports-status]");
const reportsPlatformNode = document.querySelector("[data-reports-platform]");
const reportsSearchNode = document.querySelector("[data-reports-search]");

const revenueShareStatementsTableNode = document.querySelector("[data-revenue-share-statements-table]");
const revenueShareStatementsSummaryNode = document.querySelector("[data-revenue-share-statements-summary]");
const revenueShareStatementsPageNode = document.querySelector("[data-revenue-share-statements-page]");
const revenueShareStatementsStatusNode = document.querySelector("[data-revenue-share-statements-status]");
const revenueShareStatementsSearchNode = document.querySelector("[data-revenue-share-statements-search]");

const downloadsTableNode = document.querySelector("[data-downloads-table]");
const downloadsSummaryNode = document.querySelector("[data-downloads-summary]");
const downloadsPageNode = document.querySelector("[data-downloads-page]");
const downloadsSearchNode = document.querySelector("[data-downloads-search]");

const usersTableNode = document.querySelector("[data-users-table]");
const usersSummaryNode = document.querySelector("[data-users-summary]");
const usersPageNode = document.querySelector("[data-users-page]");
const usersStatusNode = document.querySelector("[data-users-status]");
const usersRoleNode = document.querySelector("[data-users-role]");
const usersSearchNode = document.querySelector("[data-users-search]");

const scriptsTableNode = document.querySelector("[data-scripts-table]");
const scriptsSummaryNode = document.querySelector("[data-scripts-summary]");
const scriptsPageNode = document.querySelector("[data-scripts-page]");
const scriptsStatusNode = document.querySelector("[data-scripts-status]");
const scriptsFeaturedNode = document.querySelector("[data-scripts-featured]");
const scriptsSearchNode = document.querySelector("[data-scripts-search]");

const approvalDialogNode = document.querySelector("[data-approval-dialog]");
const approvalFormNode = document.querySelector("[data-approval-form]");
const approvalSummaryNode = document.querySelector("[data-approval-summary]");
const approvalWorkflowLabelNode = document.querySelector("[data-approval-workflow-label]");
const approvalRequestIdNode = document.querySelector("[data-approval-request-id]");
const approvalOrderStatusNode = document.querySelector("[data-approval-order-status]");
const approvalUserNoteNode = document.querySelector("[data-approval-user-note]");
const approvalAmountNode = document.querySelector("[data-approval-amount]");
const approvalOrderTitleNode = document.querySelector("[data-approval-order-title]");
const approvalOrderNoteNode = document.querySelector("[data-approval-order-note]");
const approvalPaymentNoteNode = document.querySelector("[data-approval-payment-note]");
const approvalDeliveryTitleNode = document.querySelector("[data-approval-delivery-title]");
const approvalAssetPathNode = document.querySelector("[data-approval-asset-path]");
const approvalDeliveryNoteNode = document.querySelector("[data-approval-delivery-note]");
const approvalAssetTitleNode = document.querySelector("[data-approval-asset-title]");
const approvalOrderFieldNodes = Array.from(document.querySelectorAll("[data-order-fields]"));
const revenueShareFieldsNode = document.querySelector("[data-revenue-share-fields]");
const revenueSharePlatformRatioNode = document.querySelector("[data-revenue-share-platform-ratio]");
const revenueShareUserRatioNode = document.querySelector("[data-revenue-share-user-ratio]");
const revenueShareEpisodeStartNode = document.querySelector("[data-revenue-share-episode-start]");
const revenueShareEpisodeEndNode = document.querySelector("[data-revenue-share-episode-end]");
const revenueSharePlatformsNode = document.querySelector("[data-revenue-share-platforms]");
const revenueShareAccountsNode = document.querySelector("[data-revenue-share-accounts]");
const revenueShareContractStatusNode = document.querySelector("[data-revenue-share-contract-status]");
const revenueShareContractPathNode = document.querySelector("[data-revenue-share-contract-path]");

const orderDialogNode = document.querySelector("[data-order-dialog]");
const orderFormNode = document.querySelector("[data-order-form]");
const orderIdNode = document.querySelector("[data-order-id]");
const orderStatusNode = document.querySelector("[data-order-status]");
const orderSummaryNode = document.querySelector("[data-order-summary]");
const orderPaymentNoteNode = document.querySelector("[data-order-payment-note]");
const orderUserNoteNode = document.querySelector("[data-order-user-note]");

const revenueShareStatementDialogNode = document.querySelector("[data-revenue-share-statement-dialog]");
const revenueShareStatementFormNode = document.querySelector("[data-revenue-share-statement-form]");
const revenueShareStatementIdNode = document.querySelector("[data-revenue-share-statement-id]");
const revenueShareStatementStatusNode = document.querySelector("[data-revenue-share-statement-status]");
const revenueShareStatementSummaryNode = document.querySelector("[data-revenue-share-statement-summary]");
const revenueShareConfirmedRevenueNode = document.querySelector("[data-revenue-share-confirmed-revenue]");
const revenueShareStatementRatioNode = document.querySelector("[data-revenue-share-statement-ratio]");
const revenueShareSettlementProofNode = document.querySelector("[data-revenue-share-settlement-proof]");
const revenueSharePaymentReferenceNode = document.querySelector("[data-revenue-share-payment-reference]");
const revenueSharePaidAtNode = document.querySelector("[data-revenue-share-paid-at]");
const revenueShareStatementAdminNoteNode = document.querySelector("[data-revenue-share-statement-admin-note]");

const requestTypeLabels = {
  buyout: "一次性买断",
  pay_per_episode: "按集付费",
  revenue_share: "版权分成"
};

const statusLabels = {
  submitted: "待处理",
  contacted: "已联系",
  approved: "已通过",
  rejected: "已拒绝",
  closed: "已关闭",
  reviewed: "已查看",
  valuable: "有价值",
  not_valuable: "价值较低",
  invalid: "无效",
  active: "启用",
  disabled: "禁用",
  user: "普通用户",
  admin: "管理员",
  draft: "草稿",
  published: "已发布",
  archived: "已归档"
  ,
  pending_payment: "待付款",
  paid: "已付款",
  delivered: "已交付",
  cancelled: "已取消",
  reviewing: "审核中",
  confirmed: "已确认",
  settled: "已结算",
  revenue_screenshot: "收益截图",
  platform_statement: "平台结算单",
  analytics_screenshot: "数据后台截图",
  other: "其他证明"
};

const requestStatusOptions = ["submitted", "contacted", "approved", "rejected", "closed"];
const requestTypeOptions = ["buyout", "pay_per_episode", "revenue_share"];
const orderStatusOptions = ["pending_payment", "paid", "delivered", "cancelled"];
const reportStatusOptions = ["submitted", "reviewed", "valuable", "not_valuable", "invalid"];
const revenueShareStatementStatusOptions = ["submitted", "reviewing", "confirmed", "settled", "rejected"];
const userStatusOptions = ["active", "disabled"];
const userRoleOptions = ["user", "admin"];
const scriptStatusOptions = ["draft", "published", "archived"];

const requestState = {
  loaded: false,
  page: 1,
  pageSize: 20,
  totalPages: 1
};

const orderState = {
  loaded: false,
  page: 1,
  pageSize: 20,
  totalPages: 1
};

const reportState = {
  loaded: false,
  page: 1,
  pageSize: 20,
  totalPages: 1
};

const revenueShareStatementState = {
  loaded: false,
  page: 1,
  pageSize: 20,
  totalPages: 1
};

const downloadState = {
  loaded: false,
  page: 1,
  pageSize: 20,
  totalPages: 1
};

const userState = {
  loaded: false,
  page: 1,
  pageSize: 20,
  totalPages: 1
};

const scriptState = {
  loaded: false,
  page: 1,
  pageSize: 20,
  totalPages: 1
};

let currentAdminEmail = "";
let continuationRequestsById = new Map();
let ordersById = new Map();
let revenueShareStatementsById = new Map();
let pendingApprovalSelectNode = null;
let pendingOrderSelectNode = null;
let pendingRevenueShareStatementSelectNode = null;

function formatEpisodeScope(episodeRange) {
  const scope = String(episodeRange || "").trim();
  if (!scope) return "后续内容";
  if (scope.includes("集")) return scope;
  return `第${scope}集`;
}

function formatPathScope(episodeRange) {
  const scope = String(episodeRange || "continuation").trim().toLowerCase();
  return scope.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "continuation";
}

function buildDeliveryAssetDefaults(requestItem = {}) {
  const slug = requestItem.script?.slug || "script";
  const type = requestItem.type || "pay_per_episode";
  const scope = formatPathScope(requestItem.episodeRange);

  if (type === "buyout") {
    return {
      title: "完整买断交付文件",
      filePath: `downloads/${slug}/deliveries/buyout-full-package-v1.docx`
    };
  }

  if (type === "revenue_share") {
    return {
      title: "第4-10集分成合作交付文件",
      filePath: `downloads/${slug}/deliveries/revenue-share-episodes-4-10-package-v1.docx`
    };
  }

  return {
    title: `${formatEpisodeScope(requestItem.episodeRange)}交付文件`,
    filePath: `downloads/${slug}/deliveries/episodes-${scope}-package-v1.docx`
  };
}

function buildOrderCopyDefaults(requestItem = {}) {
  const scriptTitle = requestItem.script?.title || "剧本名";
  const episodeScope = formatEpisodeScope(requestItem.episodeRange);
  const type = requestItem.type || "pay_per_episode";
  const commonPaymentNote =
    "请按照客服提供的收款方式完成付款。付款备注建议填写你的注册邮箱和剧本名称，便于后台核对。后台确认付款后，交付内容会开放到用户中心。";

  if (type === "buyout") {
    return {
      amountYuan: "4999",
      requestUserVisibleNote:
        "合作申请已通过。平台将为你生成买断订单，付款确认后开放完整后续内容。",
      orderTitle: `《${scriptTitle}》完整买断订单`,
      orderUserVisibleNote: `你的买断申请已通过。本订单对应《${scriptTitle}》的完整后续内容交付，包含双方确认范围内的剧集正文、分镜和 AI 提示词。请按平台约定完成付款，付款确认后交付内容将在用户中心开放。`,
      paymentNote: commonPaymentNote,
      deliveryTitle: `《${scriptTitle}》完整买断交付包`,
      deliveryNote: `本交付包包含《${scriptTitle}》双方确认范围内的完整后续内容。请优先阅读使用说明和授权边界，再进行视频制作、发布和团队分发。未经额外约定，不得转售原始剧本文件、分镜文件或提示词资源包。`
    };
  }

  if (type === "revenue_share") {
    return {
      amountYuan: "0",
      requestUserVisibleNote:
        "版权分成合作申请已通过。请先确认合作范围、分成比例、结算周期和数据回传方式。",
      orderTitle: `《${scriptTitle}》版权分成合作确认单`,
      orderUserVisibleNote: `你的版权分成合作申请已通过。本合作无需预付剧本费用，后续将按照双方确认的收益口径和分成比例结算。请先确认合作范围、分成比例、结算周期和数据回传方式，确认后平台将开放后续制作内容。`,
      paymentNote: "本合作无需预付费用。请先与平台确认收益口径、分成比例、结算周期和数据回传方式。",
      deliveryTitle: `《${scriptTitle}》分成合作交付包`,
      deliveryNote: `本交付包用于版权分成合作场景。用户可按照双方确认范围制作后续内容，并需按约定周期回传播放、收益和账号数据。收益口径、分成比例、结算周期和退出机制应以双方确认的合作说明或正式协议为准。`
    };
  }

  return {
    amountYuan: "699",
    requestUserVisibleNote:
      "合作申请已通过。平台将为你生成按集购买订单，付款确认后开放对应剧集内容。",
    orderTitle: `《${scriptTitle}》${episodeScope}按集购买订单`,
    orderUserVisibleNote: `你的按集购买申请已通过。本订单对应《${scriptTitle}》${episodeScope}内容。请按平台约定完成付款，付款确认后，对应剧集的正文、分镜和 AI 提示词将在用户中心开放。后续如需继续购买，可再次提交合作申请。`,
    paymentNote: commonPaymentNote,
    deliveryTitle: `《${scriptTitle}》${episodeScope}交付包`,
    deliveryNote: `本交付包仅包含《${scriptTitle}》${episodeScope}内容，授权范围仅覆盖本次购买剧集。请勿擅自续写、转售或分发未购买的后续内容。如本批次测试效果良好，可在用户中心继续提交后续合作申请。`
  };
}

function showNotice(message, type = "info") {
  if (!noticeNode) return;

  noticeNode.textContent = message;
  noticeNode.hidden = false;
  noticeNode.classList.toggle("danger", type === "danger");
  noticeNode.classList.toggle("success", type === "success");
}

function hideNotice() {
  if (!noticeNode) return;

  noticeNode.hidden = true;
  noticeNode.textContent = "";
  noticeNode.classList.remove("danger");
  noticeNode.classList.remove("success");
}

async function fetchJson(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...(options.headers || {})
    }
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(body.error || "请求失败");
    error.status = response.status;
    throw error;
  }

  return body;
}

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatNumber(value) {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("zh-CN").format(value);
}

function formatMoney(amountCents, currency = "CNY") {
  const amount = Number(amountCents || 0) / 100;
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency
  }).format(amount);
}

function formatYuanInput(amountCents) {
  if (amountCents === null || amountCents === undefined) return "";
  return (Number(amountCents || 0) / 100).toFixed(2);
}

function formatDateTimeLocalInput(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function statusPill(status) {
  const label = statusLabels[status] || status || "-";
  return `<span class="status-pill ${escapeHtml(status)}">${escapeHtml(label)}</span>`;
}

function buildStatusSelect(currentStatus, id, statuses, dataAttribute) {
  const options = statuses
    .map((status) => {
      const selected = status === currentStatus ? "selected" : "";
      return `<option value="${escapeHtml(status)}" ${selected}>${escapeHtml(statusLabels[status])}</option>`;
    })
    .join("");

  return `<select class="status-select" ${dataAttribute} data-item-id="${escapeHtml(id)}">${options}</select>`;
}

function buildDeleteButton(itemId, deleteType, label) {
  return `<button class="danger-button" type="button" data-delete-type="${escapeHtml(deleteType)}" data-item-id="${escapeHtml(itemId)}" data-delete-label="${escapeHtml(label)}">删除</button>`;
}

function setActiveTab(tabName) {
  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });

  document.querySelectorAll("[data-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === tabName);
  });

  if (tabName === "requests" && !requestState.loaded) {
    loadRequests();
  }

  if (tabName === "orders" && !orderState.loaded) {
    loadOrders();
  }

  if (tabName === "reports" && !reportState.loaded) {
    loadReports();
  }

  if (tabName === "revenueShareStatements" && !revenueShareStatementState.loaded) {
    loadRevenueShareStatements();
  }

  if (tabName === "downloads" && !downloadState.loaded) {
    loadDownloads();
  }

  if (tabName === "scripts" && !scriptState.loaded) {
    loadScripts();
  }

  if (tabName === "users" && !userState.loaded) {
    loadUsers();
  }
}

function renderMetrics(metrics) {
  if (!metricsNode) return;

  const items = [
    ["已发布剧本", metrics.publishedScriptCount],
    ["注册用户", metrics.userCount],
    ["下载总数", metrics.downloadCount],
    ["待处理合作", metrics.pendingContinuationRequestCount],
    ["测试反馈", metrics.testReportCount],
    ["待看反馈", metrics.pendingTestReportCount],
    ["合作申请", metrics.continuationRequestCount],
    ["待审分成回传", metrics.pendingRevenueShareStatementCount],
    ["分成回传", metrics.revenueShareStatementCount],
    ["草稿剧本", metrics.draftScriptCount]
  ];

  metricsNode.innerHTML = items
    .map(
      ([label, value]) => `
        <article class="metric-card">
          <span>${escapeHtml(label)}</span>
          <strong>${formatNumber(value)}</strong>
        </article>
      `
    )
    .join("");
}

function renderRecentRequests(items) {
  if (!recentRequestsNode) return;

  requestCountNode.textContent = `${items.length} 条`;

  if (!items.length) {
    recentRequestsNode.innerHTML = `<tr><td colspan="5">暂无合作申请</td></tr>`;
    return;
  }

  recentRequestsNode.innerHTML = items
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.script?.title || "-")}</td>
          <td>${escapeHtml(item.user?.email || "-")}</td>
          <td>${escapeHtml(requestTypeLabels[item.type] || item.type || "-")}</td>
          <td>${statusPill(item.status)}</td>
          <td>${escapeHtml(formatDate(item.createdAt))}</td>
        </tr>
      `
    )
    .join("");
}

function renderRecentReports(items) {
  if (!recentReportsNode) return;

  reportCountNode.textContent = `${items.length} 条`;

  if (!items.length) {
    recentReportsNode.innerHTML = `<tr><td colspan="5">暂无测试反馈</td></tr>`;
    return;
  }

  recentReportsNode.innerHTML = items
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.script?.title || "-")}</td>
          <td>${escapeHtml(item.platform || "-")}</td>
          <td>${formatNumber(item.viewCount)}</td>
          <td>${statusPill(item.status)}</td>
          <td>${escapeHtml(formatDate(item.createdAt))}</td>
        </tr>
      `
    )
    .join("");
}

function renderRequestsTable(items) {
  if (!requestsTableNode) return;
  continuationRequestsById = new Map(items.map((item) => [item.id, item]));

  if (!items.length) {
    requestsTableNode.innerHTML = `<tr><td colspan="8">暂无符合条件的合作申请</td></tr>`;
    return;
  }

  requestsTableNode.innerHTML = items
    .map((item) => {
      const testReportText = item.testReport
        ? `${formatNumber(item.testReport.viewCount)} 播放 / ${formatNumber(item.testReport.likeCount)} 赞`
        : "未关联";
      const message = item.message ? `<div class="message-line">${escapeHtml(item.message)}</div>` : "";

      return `
        <tr>
          <td>
            <div class="cell-main">
              <strong>${escapeHtml(item.script?.title || "-")}</strong>
              <span>${escapeHtml(item.script?.slug || "")}</span>
            </div>
          </td>
          <td>
            <div class="cell-main">
              <strong>${escapeHtml(item.user?.email || "-")}</strong>
              <span>${escapeHtml(item.contactPreference || "未填写偏好")}</span>
            </div>
          </td>
          <td>${escapeHtml(requestTypeLabels[item.type] || item.type || "-")}${message}</td>
          <td>${escapeHtml(item.episodeRange || "-")}</td>
          <td>
            <div class="cell-main">
              <strong>${escapeHtml(testReportText)}</strong>
              <span>${escapeHtml(item.testReport?.platform || "")}</span>
            </div>
          </td>
          <td>${buildStatusSelect(item.status, item.id, requestStatusOptions, "data-request-status-select")}</td>
          <td>${escapeHtml(formatDate(item.createdAt))}</td>
          <td>${buildDeleteButton(item.id, "continuationRequest", `合作申请 ${item.script?.title || item.id}`)}</td>
        </tr>
      `;
    })
    .join("");
}

function renderOrdersTable(items) {
  if (!ordersTableNode) return;
  ordersById = new Map(items.map((item) => [item.id, item]));

  if (!items.length) {
    ordersTableNode.innerHTML = `<tr><td colspan="8">暂无符合条件的订单</td></tr>`;
    return;
  }

  ordersTableNode.innerHTML = items
    .map((item) => {
      const deliveryText = `${item.deliveries?.length || 0} 个交付包`;

      return `
        <tr>
          <td>
            <div class="cell-main">
              <strong>${escapeHtml(item.title || "-")}</strong>
              <span>${escapeHtml(item.script?.title || "")}</span>
            </div>
          </td>
          <td>
            <div class="cell-main">
              <strong>${escapeHtml(item.user?.email || "-")}</strong>
              <span>${escapeHtml(item.user?.displayName || "")}</span>
            </div>
          </td>
          <td>${escapeHtml(formatMoney(item.amountCents, item.currency))}</td>
          <td>${escapeHtml(requestTypeLabels[item.orderType] || item.orderType || "-")}</td>
          <td>${escapeHtml(deliveryText)}</td>
          <td>${buildStatusSelect(item.status, item.id, orderStatusOptions, "data-order-status-select")}</td>
          <td>${escapeHtml(formatDate(item.createdAt))}</td>
          <td>${buildDeleteButton(item.id, "order", `订单 ${item.title || item.id}`)}</td>
        </tr>
      `;
    })
    .join("");
}

function renderReportsTable(items) {
  if (!reportsTableNode) return;

  if (!items.length) {
    reportsTableNode.innerHTML = `<tr><td colspan="8">暂无符合条件的测试反馈</td></tr>`;
    return;
  }

  reportsTableNode.innerHTML = items
    .map((item) => {
      const notes = item.notes ? `<div class="message-line">${escapeHtml(item.notes)}</div>` : "";
      const videoUrl = item.videoUrl
        ? `<a class="video-link" href="${escapeHtml(item.videoUrl)}" target="_blank" rel="noreferrer">打开视频</a>`
        : "-";

      return `
        <tr>
          <td>
            <div class="cell-main">
              <strong>${escapeHtml(item.script?.title || "-")}</strong>
              <span>${escapeHtml(item.script?.slug || "")}</span>
            </div>
          </td>
          <td>
            <div class="cell-main">
              <strong>${escapeHtml(item.user?.email || "-")}</strong>
              <span>${escapeHtml(item.user?.displayName || "")}</span>
            </div>
          </td>
          <td>${escapeHtml(item.platform || "-")}${notes}</td>
          <td>
            <div class="cell-main">
              <strong>${formatNumber(item.viewCount)} 播放</strong>
              <span>${formatNumber(item.likeCount)} 赞 / ${formatNumber(item.commentCount)} 评论 / ${formatNumber(item.followerDelta)} 涨粉</span>
            </div>
          </td>
          <td>
            <div class="cell-main">
              <strong>${videoUrl}</strong>
              <span>${item.continuationRequests?.length || 0} 个合作申请</span>
            </div>
          </td>
          <td>${buildStatusSelect(item.status, item.id, reportStatusOptions, "data-report-status-select")}</td>
          <td>${escapeHtml(formatDate(item.createdAt))}</td>
          <td>${buildDeleteButton(item.id, "testReport", `测试反馈 ${item.script?.title || item.id}`)}</td>
        </tr>
      `;
    })
    .join("");
}

function renderRevenueShareStatementsTable(items) {
  if (!revenueShareStatementsTableNode) return;
  revenueShareStatementsById = new Map(items.map((item) => [item.id, item]));

  if (!items.length) {
    revenueShareStatementsTableNode.innerHTML = `<tr><td colspan="8">暂无符合条件的分成回传</td></tr>`;
    return;
  }

  revenueShareStatementsTableNode.innerHTML = items
    .map((item) => {
      const period = `${formatDate(item.periodStart)} - ${formatDate(item.periodEnd)}`;
      const videos = (item.videos || [])
        .slice(0, 2)
        .map((video) =>
          video.videoUrl
            ? `<a class="video-link" href="${escapeHtml(video.videoUrl)}" target="_blank" rel="noreferrer">${escapeHtml(video.platform || "视频")}</a>`
            : escapeHtml(video.platform || "视频")
        )
        .join(" / ");
      const evidence = (item.evidence || [])
        .slice(0, 2)
        .map((file) =>
          file.filePath
            ? `<a class="video-link" href="${escapeHtml(file.filePath)}" target="_blank" rel="noreferrer">${escapeHtml(statusLabels[file.evidenceType] || file.evidenceType || "证明")}</a>`
            : escapeHtml(statusLabels[file.evidenceType] || file.evidenceType || "证明")
        )
        .join(" / ");
      const note = item.userNote ? `<div class="message-line">${escapeHtml(item.userNote)}</div>` : "";

      return `
        <tr>
          <td>
            <div class="cell-main">
              <strong>${escapeHtml(item.script?.title || "-")}</strong>
              <span>${escapeHtml(item.script?.slug || "")}</span>
            </div>
          </td>
          <td>
            <div class="cell-main">
              <strong>${escapeHtml(item.user?.email || "-")}</strong>
              <span>${escapeHtml(item.user?.displayName || "")}</span>
            </div>
          </td>
          <td>${escapeHtml(period)}${note}</td>
          <td>
            <div class="cell-main">
              <strong>${escapeHtml(formatMoney(item.confirmedRevenueCents ?? item.reportedRevenueCents))}</strong>
              <span>申报 ${escapeHtml(formatMoney(item.reportedRevenueCents))} / 平台 ${escapeHtml(formatMoney(item.platformShareCents))} / 用户 ${escapeHtml(formatMoney(item.userShareCents))}</span>
              ${item.paymentReference ? `<span>${escapeHtml(item.paymentReference)}</span>` : ""}
            </div>
          </td>
          <td>
            <div class="cell-main">
              <strong>${videos || `${formatNumber(item.videoCount)} 条视频`}</strong>
              <span>${evidence || `${formatNumber(item.evidenceCount)} 个证明`}</span>
            </div>
          </td>
          <td>${buildStatusSelect(item.status, item.id, revenueShareStatementStatusOptions, "data-revenue-share-statement-status-select")}</td>
          <td>${escapeHtml(formatDate(item.createdAt))}</td>
          <td>${buildDeleteButton(item.id, "revenueShareStatement", `分成回传 ${item.script?.title || item.id}`)}</td>
        </tr>
      `;
    })
    .join("");
}

function renderDownloadsTable(items) {
  if (!downloadsTableNode) return;

  if (!items.length) {
    downloadsTableNode.innerHTML = `<tr><td colspan="8">暂无符合条件的下载记录</td></tr>`;
    return;
  }

  downloadsTableNode.innerHTML = items
    .map((item) => {
      const behaviorText = `${formatNumber(item.testReportCount)} 反馈 / ${formatNumber(item.continuationRequestCount)} 合作`;
      const referrer = item.referrer ? item.referrer.replace(/^https?:\/\//, "") : "直接访问";
      const visitorId = item.visitorId || "未记录";

      return `
        <tr>
          <td>
            <div class="cell-main">
              <strong>${escapeHtml(item.script?.title || "-")}</strong>
              <span>${escapeHtml(item.script?.slug || "")}</span>
            </div>
          </td>
          <td>
            <div class="cell-main">
              <strong>${escapeHtml(item.user?.email || "游客")}</strong>
              <span>${escapeHtml(item.user?.displayName || item.ipAddress || "")}</span>
            </div>
          </td>
          <td>
            <div class="cell-main">
              <strong>${escapeHtml(item.asset?.title || "-")}</strong>
              <span>${escapeHtml(item.asset?.fileFormat || "")}</span>
            </div>
          </td>
          <td><span class="muted-line">${escapeHtml(visitorId)}</span></td>
          <td>${escapeHtml(behaviorText)}</td>
          <td><div class="message-line">${escapeHtml(referrer)}</div></td>
          <td>${escapeHtml(formatDate(item.createdAt))}</td>
          <td>${buildDeleteButton(item.id, "download", `下载记录 ${item.script?.title || item.id}`)}</td>
        </tr>
      `;
    })
    .join("");
}

function renderUsersTable(items, currentUserEmail) {
  if (!usersTableNode) return;

  if (!items.length) {
    usersTableNode.innerHTML = `<tr><td colspan="7">暂无符合条件的用户</td></tr>`;
    return;
  }

  usersTableNode.innerHTML = items
    .map((item) => {
      const contactLines = [item.contactWechat, item.contactPhone].filter(Boolean);
      const contactText = contactLines.length ? contactLines.join(" / ") : "未填写";
      const behaviorText = `${formatNumber(item.counts?.downloads)} 下载 / ${formatNumber(item.counts?.testReports)} 反馈 / ${formatNumber(item.counts?.continuationRequests)} 合作`;
      const isCurrentAdmin = item.email === currentUserEmail;
      const statusCell = isCurrentAdmin
        ? `${statusPill(item.status)}<div class="muted-line">当前账号</div>`
        : buildStatusSelect(item.status, item.id, userStatusOptions, "data-user-status-select");

      return `
        <tr>
          <td>
            <div class="cell-main">
              <strong>${escapeHtml(item.email || "-")}</strong>
              <span>${escapeHtml(item.displayName || "未填写昵称")}</span>
            </div>
          </td>
          <td><div class="message-line">${escapeHtml(contactText)}</div></td>
          <td>${statusPill(item.role)}</td>
          <td>${escapeHtml(behaviorText)}</td>
          <td>${statusCell}</td>
          <td>${escapeHtml(formatDate(item.createdAt))}</td>
          <td>${item.email === currentUserEmail ? '<span class="muted-line">当前账号不可删</span>' : buildDeleteButton(item.id, "user", `用户 ${item.email || item.id}`)}</td>
        </tr>
      `;
    })
    .join("");
}

function renderScriptsTable(items) {
  if (!scriptsTableNode) return;

  if (!items.length) {
    scriptsTableNode.innerHTML = `<tr><td colspan="8">暂无符合条件的剧本</td></tr>`;
    return;
  }

  scriptsTableNode.innerHTML = items
    .map((item) => {
      const contentText = `${formatNumber(item.counts?.episodes)} 集 / ${formatNumber(item.counts?.assets)} 资源`;
      const behaviorText = `${formatNumber(item.counts?.downloads)} 下载 / ${formatNumber(item.counts?.testReports)} 反馈 / ${formatNumber(item.counts?.continuationRequests)} 合作`;

      return `
        <tr>
          <td>
            <div class="cell-main">
              <strong>${escapeHtml(item.title || "-")}</strong>
              <span>${escapeHtml(item.slug || "")}</span>
            </div>
          </td>
          <td>
            <div class="cell-main">
              <strong>${escapeHtml(item.category || "-")}</strong>
              <span>${escapeHtml(item.productionDifficulty || "")}</span>
            </div>
          </td>
          <td>${escapeHtml(contentText)}</td>
          <td>${escapeHtml(behaviorText)}</td>
          <td>${buildStatusSelect(item.status, item.id, scriptStatusOptions, "data-script-status-select")}</td>
          <td>
            <label class="toggle-control">
              <input type="checkbox" data-script-featured-toggle data-item-id="${escapeHtml(item.id)}" ${item.featured ? "checked" : ""} />
              <span>${item.featured ? "主推" : "普通"}</span>
            </label>
          </td>
          <td>${escapeHtml(formatDate(item.updatedAt))}</td>
          <td>${buildDeleteButton(item.id, "script", `剧本 ${item.title || item.id}`)}</td>
        </tr>
      `;
    })
    .join("");
}

function populateRequestFilters() {
  if (requestsStatusNode && requestsStatusNode.options.length <= 1) {
    requestStatusOptions.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = statusLabels[status] || status;
      requestsStatusNode.append(option);
    });
    requestsStatusNode.value = "submitted";
  }

  if (requestsTypeNode && requestsTypeNode.options.length <= 1) {
    requestTypeOptions.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = requestTypeLabels[type] || type;
      requestsTypeNode.append(option);
    });
  }
}

function populateOrderFilters() {
  if (ordersStatusNode && ordersStatusNode.options.length <= 1) {
    orderStatusOptions.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = statusLabels[status] || status;
      ordersStatusNode.append(option);
    });
    ordersStatusNode.value = "pending_payment";
  }
}

function populateReportFilters() {
  if (reportsStatusNode && reportsStatusNode.options.length <= 1) {
    reportStatusOptions.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = statusLabels[status] || status;
      reportsStatusNode.append(option);
    });
    reportsStatusNode.value = "submitted";
  }
}

function populateRevenueShareStatementFilters() {
  if (revenueShareStatementsStatusNode && revenueShareStatementsStatusNode.options.length <= 1) {
    revenueShareStatementStatusOptions.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = statusLabels[status] || status;
      revenueShareStatementsStatusNode.append(option);
    });
    revenueShareStatementsStatusNode.value = "submitted";
  }
}

function populateUserFilters() {
  if (usersStatusNode && usersStatusNode.options.length <= 1) {
    userStatusOptions.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = statusLabels[status] || status;
      usersStatusNode.append(option);
    });
  }

  if (usersRoleNode && usersRoleNode.options.length <= 1) {
    userRoleOptions.forEach((role) => {
      const option = document.createElement("option");
      option.value = role;
      option.textContent = statusLabels[role] || role;
      usersRoleNode.append(option);
    });
  }
}

function populateScriptFilters() {
  if (scriptsStatusNode && scriptsStatusNode.options.length <= 1) {
    scriptStatusOptions.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = statusLabels[status] || status;
      scriptsStatusNode.append(option);
    });
  }
}

async function loadOverview() {
  hideNotice();

  try {
    const overview = await fetchJson("/api/admin/overview");
    renderMetrics(overview.metrics || {});
    renderRecentRequests(overview.recentContinuationRequests || []);
    renderRecentReports(overview.recentTestReports || []);
  } catch (error) {
    handleAdminError(error, "后台概况加载失败，请稍后重试。");
  }
}

async function loadRequests() {
  hideNotice();
  requestState.loaded = true;

  if (requestsTableNode) {
    requestsTableNode.innerHTML = `<tr><td colspan="8">加载中</td></tr>`;
  }

  const params = new URLSearchParams({
    page: String(requestState.page),
    pageSize: String(requestState.pageSize)
  });
  if (requestsStatusNode?.value) params.set("status", requestsStatusNode.value);
  if (requestsTypeNode?.value) params.set("type", requestsTypeNode.value);
  if (requestsSearchNode?.value.trim()) params.set("q", requestsSearchNode.value.trim());

  try {
    const data = await fetchJson(`/api/admin/continuation-requests?${params.toString()}`);
    requestState.totalPages = data.totalPages || 1;
    renderRequestsTable(data.items || []);
    requestsSummaryNode.textContent = `共 ${formatNumber(data.total)} 条`;
    requestsPageNode.textContent = `第 ${data.page} / ${data.totalPages} 页`;
  } catch (error) {
    handleAdminError(error, "合作申请加载失败，请稍后重试。");
    if (requestsTableNode) {
      requestsTableNode.innerHTML = `<tr><td colspan="8">加载失败</td></tr>`;
    }
  }
}

async function loadOrders() {
  hideNotice();
  orderState.loaded = true;

  if (ordersTableNode) {
    ordersTableNode.innerHTML = `<tr><td colspan="8">加载中</td></tr>`;
  }

  const params = new URLSearchParams({
    page: String(orderState.page),
    pageSize: String(orderState.pageSize)
  });
  if (ordersStatusNode?.value) params.set("status", ordersStatusNode.value);
  if (ordersSearchNode?.value.trim()) params.set("q", ordersSearchNode.value.trim());

  try {
    const data = await fetchJson(`/api/admin/orders?${params.toString()}`);
    orderState.totalPages = data.totalPages || 1;
    renderOrdersTable(data.items || []);
    ordersSummaryNode.textContent = `共 ${formatNumber(data.total)} 条`;
    ordersPageNode.textContent = `第 ${data.page} / ${data.totalPages} 页`;
  } catch (error) {
    handleAdminError(error, "订单列表加载失败，请稍后重试。");
    if (ordersTableNode) {
      ordersTableNode.innerHTML = `<tr><td colspan="8">加载失败</td></tr>`;
    }
  }
}

async function loadReports() {
  hideNotice();
  reportState.loaded = true;

  if (reportsTableNode) {
    reportsTableNode.innerHTML = `<tr><td colspan="8">加载中</td></tr>`;
  }

  const params = new URLSearchParams({
    page: String(reportState.page),
    pageSize: String(reportState.pageSize)
  });
  if (reportsStatusNode?.value) params.set("status", reportsStatusNode.value);
  if (reportsPlatformNode?.value.trim()) params.set("platform", reportsPlatformNode.value.trim());
  if (reportsSearchNode?.value.trim()) params.set("q", reportsSearchNode.value.trim());

  try {
    const data = await fetchJson(`/api/admin/test-reports?${params.toString()}`);
    reportState.totalPages = data.totalPages || 1;
    renderReportsTable(data.items || []);
    reportsSummaryNode.textContent = `共 ${formatNumber(data.total)} 条`;
    reportsPageNode.textContent = `第 ${data.page} / ${data.totalPages} 页`;
  } catch (error) {
    handleAdminError(error, "测试反馈加载失败，请稍后重试。");
    if (reportsTableNode) {
      reportsTableNode.innerHTML = `<tr><td colspan="8">加载失败</td></tr>`;
    }
  }
}

async function loadRevenueShareStatements() {
  hideNotice();
  revenueShareStatementState.loaded = true;

  if (revenueShareStatementsTableNode) {
    revenueShareStatementsTableNode.innerHTML = `<tr><td colspan="8">加载中</td></tr>`;
  }

  const params = new URLSearchParams({
    page: String(revenueShareStatementState.page),
    pageSize: String(revenueShareStatementState.pageSize)
  });
  if (revenueShareStatementsStatusNode?.value) params.set("status", revenueShareStatementsStatusNode.value);
  if (revenueShareStatementsSearchNode?.value.trim()) params.set("q", revenueShareStatementsSearchNode.value.trim());

  try {
    const data = await fetchJson(`/api/admin/revenue-share-statements?${params.toString()}`);
    revenueShareStatementState.totalPages = data.totalPages || 1;
    renderRevenueShareStatementsTable(data.items || []);
    revenueShareStatementsSummaryNode.textContent = `共 ${formatNumber(data.total)} 条`;
    revenueShareStatementsPageNode.textContent = `第 ${data.page} / ${data.totalPages} 页`;
  } catch (error) {
    handleAdminError(error, "分成回传加载失败，请稍后重试。");
    if (revenueShareStatementsTableNode) {
      revenueShareStatementsTableNode.innerHTML = `<tr><td colspan="8">加载失败</td></tr>`;
    }
  }
}

async function loadDownloads() {
  hideNotice();
  downloadState.loaded = true;

  if (downloadsTableNode) {
    downloadsTableNode.innerHTML = `<tr><td colspan="8">加载中</td></tr>`;
  }

  const params = new URLSearchParams({
    page: String(downloadState.page),
    pageSize: String(downloadState.pageSize)
  });
  if (downloadsSearchNode?.value.trim()) params.set("q", downloadsSearchNode.value.trim());

  try {
    const data = await fetchJson(`/api/admin/downloads?${params.toString()}`);
    downloadState.totalPages = data.totalPages || 1;
    renderDownloadsTable(data.items || []);
    downloadsSummaryNode.textContent = `共 ${formatNumber(data.total)} 条`;
    downloadsPageNode.textContent = `第 ${data.page} / ${data.totalPages} 页`;
  } catch (error) {
    handleAdminError(error, "下载记录加载失败，请稍后重试。");
    if (downloadsTableNode) {
      downloadsTableNode.innerHTML = `<tr><td colspan="8">加载失败</td></tr>`;
    }
  }
}

async function loadUsers() {
  hideNotice();
  userState.loaded = true;

  if (usersTableNode) {
    usersTableNode.innerHTML = `<tr><td colspan="7">加载中</td></tr>`;
  }

  const params = new URLSearchParams({
    page: String(userState.page),
    pageSize: String(userState.pageSize)
  });
  if (usersStatusNode?.value) params.set("status", usersStatusNode.value);
  if (usersRoleNode?.value) params.set("role", usersRoleNode.value);
  if (usersSearchNode?.value.trim()) params.set("q", usersSearchNode.value.trim());

  try {
    const data = await fetchJson(`/api/admin/users?${params.toString()}`);
    userState.totalPages = data.totalPages || 1;
    renderUsersTable(data.items || [], currentAdminEmail);
    usersSummaryNode.textContent = `共 ${formatNumber(data.total)} 个`;
    usersPageNode.textContent = `第 ${data.page} / ${data.totalPages} 页`;
  } catch (error) {
    handleAdminError(error, "用户列表加载失败，请稍后重试。");
    if (usersTableNode) {
      usersTableNode.innerHTML = `<tr><td colspan="7">加载失败</td></tr>`;
    }
  }
}

async function loadScripts() {
  hideNotice();
  scriptState.loaded = true;

  if (scriptsTableNode) {
    scriptsTableNode.innerHTML = `<tr><td colspan="8">加载中</td></tr>`;
  }

  const params = new URLSearchParams({
    page: String(scriptState.page),
    pageSize: String(scriptState.pageSize)
  });
  if (scriptsStatusNode?.value) params.set("status", scriptsStatusNode.value);
  if (scriptsFeaturedNode?.value) params.set("featured", scriptsFeaturedNode.value);
  if (scriptsSearchNode?.value.trim()) params.set("q", scriptsSearchNode.value.trim());

  try {
    const data = await fetchJson(`/api/admin/scripts?${params.toString()}`);
    scriptState.totalPages = data.totalPages || 1;
    renderScriptsTable(data.items || []);
    scriptsSummaryNode.textContent = `共 ${formatNumber(data.total)} 套`;
    scriptsPageNode.textContent = `第 ${data.page} / ${data.totalPages} 页`;
  } catch (error) {
    handleAdminError(error, "剧本列表加载失败，请稍后重试。");
    if (scriptsTableNode) {
      scriptsTableNode.innerHTML = `<tr><td colspan="8">加载失败</td></tr>`;
    }
  }
}

function openApprovalForm(requestId, selectNode) {
  const requestItem = continuationRequestsById.get(requestId) || {};
  const copyDefaults = buildOrderCopyDefaults(requestItem);
  const assetDefaults = buildDeliveryAssetDefaults(requestItem);
  const typeLabel = requestTypeLabels[requestItem.type] || requestItem.type || "合作";
  const isRevenueShare = requestItem.type === "revenue_share";

  pendingApprovalSelectNode = selectNode;

  approvalRequestIdNode.value = requestId;
  approvalOrderStatusNode.value = isRevenueShare ? "paid" : "pending_payment";
  approvalSummaryNode.textContent = `${requestItem.script?.title || "-"} / ${requestItem.user?.email || "-"} / ${typeLabel} / ${requestItem.episodeRange || "未填写集数"}`;
  approvalWorkflowLabelNode.textContent = isRevenueShare
    ? "版权分成流程：通过申请 -> 创建分成项目 -> 开放第4-10集 -> 后续按月回传数据和结算"
    : requestItem.type === "buyout"
      ? "买断流程：通过申请 -> 生成待付款买断订单 -> 创建锁定交付包 -> 付款确认后开放完整交付"
      : "按集购买流程：通过申请 -> 生成待付款按集订单 -> 创建锁定交付包 -> 付款确认后开放对应剧集";

  revenueShareFieldsNode.hidden = !isRevenueShare;
  approvalOrderFieldNodes.forEach((node) => {
    node.hidden = isRevenueShare;
  });

  approvalUserNoteNode.value = copyDefaults.requestUserVisibleNote;
  approvalAmountNode.value = copyDefaults.amountYuan;
  approvalAmountNode.readOnly = isRevenueShare;
  approvalOrderTitleNode.value = copyDefaults.orderTitle;
  approvalOrderNoteNode.value = copyDefaults.orderUserVisibleNote;
  approvalPaymentNoteNode.value = copyDefaults.paymentNote;
  approvalDeliveryTitleNode.value = copyDefaults.deliveryTitle;
  approvalDeliveryNoteNode.value = copyDefaults.deliveryNote;
  approvalAssetTitleNode.value = assetDefaults.title;
  approvalAssetPathNode.value = assetDefaults.filePath;
  revenueSharePlatformRatioNode.value = "30";
  revenueShareUserRatioNode.value = "70";
  revenueShareEpisodeStartNode.value = "4";
  revenueShareEpisodeEndNode.value = "10";
  revenueSharePlatformsNode.value = "";
  revenueShareAccountsNode.value = "";
  revenueShareContractStatusNode.value = "not_uploaded";
  revenueShareContractPathNode.value = "";

  approvalDialogNode?.showModal();
}

function closeApprovalForm(shouldReload = true) {
  approvalDialogNode?.close();
  pendingApprovalSelectNode = null;
  if (shouldReload) loadRequests();
}

function buildApprovalFormPayload() {
  const assetPath = approvalAssetPathNode.value.trim();
  const assetTitle = approvalAssetTitleNode.value.trim() || approvalDeliveryTitleNode.value.trim();
  const requestItem = continuationRequestsById.get(approvalRequestIdNode.value) || {};

  if (requestItem.type === "revenue_share") {
    return {
      status: "approved",
      userVisibleNote: approvalUserNoteNode.value.trim(),
      createRevenueShareProject: true,
      shareRatioPlatform: Number(revenueSharePlatformRatioNode.value || 30),
      shareRatioUser: Number(revenueShareUserRatioNode.value || 70),
      firstEpisodeNumber: Number(revenueShareEpisodeStartNode.value || 4),
      currentEpisodeEnd: Number(revenueShareEpisodeEndNode.value || 10),
      authorizedPlatforms: revenueSharePlatformsNode.value,
      authorizedAccounts: revenueShareAccountsNode.value,
      contractStatus: revenueShareContractStatusNode.value,
      contractFilePath: revenueShareContractPathNode.value.trim(),
      projectUserVisibleNote: approvalUserNoteNode.value.trim(),
      deliveryTitle: approvalDeliveryTitleNode.value.trim(),
      deliveryNote: approvalDeliveryNoteNode.value.trim(),
      assetTitle,
      assetPath
    };
  }

  return {
    status: "approved",
    userVisibleNote: approvalUserNoteNode.value.trim(),
    createOrder: true,
    amountYuan: approvalAmountNode.value.trim(),
    orderInitialStatus: approvalOrderStatusNode.value,
    orderTitle: approvalOrderTitleNode.value.trim(),
    orderUserVisibleNote: approvalOrderNoteNode.value.trim(),
    paymentNote: approvalPaymentNoteNode.value.trim(),
    createDelivery: true,
    deliveryTitle: approvalDeliveryTitleNode.value.trim(),
    deliveryNote: approvalDeliveryNoteNode.value.trim(),
    deliveryAssets: assetPath
      ? [
          {
            title: assetTitle,
            filePath: assetPath,
            fileFormat: assetPath.split(".").pop() || "docx"
          }
        ]
      : []
  };
}

function buildContinuationUpdatePayload(status, requestItem = {}) {
  const payload = { status };
  const copyDefaults = buildOrderCopyDefaults(requestItem);

  if (status !== "submitted") {
    const userVisibleNote = window.prompt(
      "填写给用户看的处理说明。用户会在用户中心看到这段内容。",
      status === "approved" ? copyDefaults.requestUserVisibleNote : ""
    );

    if (userVisibleNote === null) {
      return null;
    }

    payload.userVisibleNote = userVisibleNote.trim();
  }

  if (status === "approved") {
    const createOrder = window.confirm("是否为用户生成待付款订单？");
    if (createOrder) {
      const amountYuan = window.prompt("订单金额，单位：元", copyDefaults.amountYuan);
      if (amountYuan === null) {
        return null;
      }

      payload.createOrder = true;
      payload.amountYuan = amountYuan.trim();
      const orderTitle = window.prompt("订单标题", copyDefaults.orderTitle);
      if (orderTitle === null) {
        return null;
      }

      const orderUserVisibleNote = window.prompt("订单用户可见说明", copyDefaults.orderUserVisibleNote);
      if (orderUserVisibleNote === null) {
        return null;
      }

      const paymentNote = window.prompt("付款说明", copyDefaults.paymentNote);
      if (paymentNote === null) {
        return null;
      }

      payload.orderTitle = orderTitle.trim() || copyDefaults.orderTitle;
      payload.orderUserVisibleNote = orderUserVisibleNote.trim() || copyDefaults.orderUserVisibleNote;
      payload.paymentNote = paymentNote.trim() || copyDefaults.paymentNote;
    }

    const createDelivery = window.confirm("是否同时为用户创建一条交付记录？");
    if (createDelivery) {
      const deliveryTitle = window.prompt("交付标题", copyDefaults.deliveryTitle);
      if (deliveryTitle === null) {
        return null;
      }

      const deliveryNote = window.prompt("交付说明", copyDefaults.deliveryNote);
      if (deliveryNote === null) {
        return null;
      }

      const assetPath = window.prompt(
        "交付文件路径。示例：downloads/lie-scent/free-preview-lie-scent-v1.docx。暂时没有文件可留空，之后再补交付资源。",
        ""
      );
      if (assetPath === null) {
        return null;
      }

      payload.createDelivery = true;
      payload.deliveryTitle = deliveryTitle.trim() || copyDefaults.deliveryTitle;
      payload.deliveryNote = deliveryNote.trim() || copyDefaults.deliveryNote;

      if (assetPath.trim()) {
        payload.deliveryAssets = [
          {
            title: window.prompt("交付文件名称", payload.deliveryTitle) || payload.deliveryTitle,
            filePath: assetPath.trim(),
            fileFormat: assetPath.split(".").pop() || "docx"
          }
        ];
      }
    }
  }

  return payload;
}

async function updateRequestStatus(requestId, payload, selectNode) {
  selectNode.disabled = true;

  try {
    await fetchJson(`/api/admin/continuation-requests/${encodeURIComponent(requestId)}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    await Promise.all([loadRequests(), loadOverview(), orderState.loaded ? loadOrders() : Promise.resolve()]);
    showNotice(`合作申请已更新为：${statusLabels[payload.status] || payload.status}`, "success");
  } catch (error) {
    handleAdminError(error, "状态更新失败，请稍后重试。");
    selectNode.disabled = false;
  }
}

async function updateOrderStatus(orderId, payload, selectNode) {
  selectNode.disabled = true;

  try {
    await fetchJson(`/api/admin/orders/${encodeURIComponent(orderId)}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    await Promise.all([loadOrders(), loadOverview()]);
    showNotice(`订单状态已更新为：${statusLabels[payload.status] || payload.status}`, "success");
  } catch (error) {
    handleAdminError(error, "订单状态更新失败，请稍后重试。");
    selectNode.disabled = false;
  }
}

function buildOrderStatusDefaults(orderItem = {}, status) {
  if (status === "paid") {
    return {
      paymentNote: "付款已确认，交付内容已开放领取。",
      userVisibleNote: "付款已确认。请前往用户中心的“我的交付”查看后续剧本内容和使用说明。"
    };
  }

  if (status === "delivered") {
    return {
      paymentNote: "订单内容已完成交付。",
      userVisibleNote: "本订单对应内容已完成交付，请在用户中心查看交付文件和使用说明。"
    };
  }

  if (status === "cancelled") {
    return {
      paymentNote: "订单已取消。",
      userVisibleNote: "本订单已取消，如需继续合作，请重新提交后续合作申请或联系平台确认新的合作方案。"
    };
  }

  return {
    paymentNote: orderItem.paymentNote || "",
    userVisibleNote: orderItem.userVisibleNote || ""
  };
}

function openOrderStatusForm(orderId, status, selectNode) {
  const orderItem = ordersById.get(orderId) || {};
  const defaults = buildOrderStatusDefaults(orderItem, status);
  pendingOrderSelectNode = selectNode;

  orderIdNode.value = orderId;
  orderStatusNode.value = status;
  orderSummaryNode.textContent = `${orderItem.title || "-"} / ${orderItem.user?.email || "-"} / ${statusLabels[status] || status}`;
  orderPaymentNoteNode.value = defaults.paymentNote;
  orderUserNoteNode.value = defaults.userVisibleNote;
  orderDialogNode?.showModal();
}

function closeOrderStatusForm(shouldReload = true) {
  orderDialogNode?.close();
  pendingOrderSelectNode = null;
  if (shouldReload) loadOrders();
}

async function updateReportStatus(reportId, status, selectNode) {
  selectNode.disabled = true;

  try {
    await fetchJson(`/api/admin/test-reports/${encodeURIComponent(reportId)}`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    await Promise.all([loadReports(), loadOverview()]);
    showNotice(`测试反馈已更新为：${statusLabels[status] || status}`, "success");
  } catch (error) {
    handleAdminError(error, "反馈状态更新失败，请稍后重试。");
    selectNode.disabled = false;
  }
}

async function updateRevenueShareStatementStatus(statementId, status, selectNode, payloadOverride = null) {
  selectNode.disabled = true;
  const payload = payloadOverride || { status };

  try {
    await fetchJson(`/api/admin/revenue-share-statements/${encodeURIComponent(statementId)}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
    await Promise.all([loadRevenueShareStatements(), loadOverview()]);
    showNotice(`分成回传已更新为：${statusLabels[status] || status}`, "success");
  } catch (error) {
    handleAdminError(error, "分成回传状态更新失败，请稍后重试。");
    selectNode.disabled = false;
  }
}

function buildRevenueShareStatementDefaults(statement = {}, status) {
  const confirmedRevenueCents = statement.confirmedRevenueCents ?? statement.reportedRevenueCents ?? 0;
  const platformShareRatio = statement.platformShareRatio ?? statement.project?.shareRatioPlatform ?? 30;

  if (status === "settled") {
    return {
      confirmedRevenueYuan: formatYuanInput(confirmedRevenueCents),
      platformShareRatio,
      settlementProofPath: statement.settlementProofPath || "",
      paymentReference: statement.paymentReference || "",
      paidAt: formatDateTimeLocalInput(statement.paidAt || new Date()),
      adminNote:
        statement.adminNote ||
        "已核对平台收益截图、视频链接和结算周期。本期分成金额已确认，按约定完成结算。"
    };
  }

  if (status === "confirmed") {
    return {
      confirmedRevenueYuan: formatYuanInput(confirmedRevenueCents),
      platformShareRatio,
      settlementProofPath: statement.settlementProofPath || "",
      paymentReference: statement.paymentReference || "",
      paidAt: formatDateTimeLocalInput(statement.paidAt),
      adminNote:
        statement.adminNote ||
        "已核对用户提交的收益数据和证明材料。本期收益金额已确认，等待结算。"
    };
  }

  if (status === "rejected") {
    return {
      confirmedRevenueYuan: formatYuanInput(statement.confirmedRevenueCents ?? 0),
      platformShareRatio,
      settlementProofPath: statement.settlementProofPath || "",
      paymentReference: statement.paymentReference || "",
      paidAt: formatDateTimeLocalInput(statement.paidAt),
      adminNote:
        statement.adminNote ||
        "本期回传材料暂未通过审核，请用户补充收益截图、平台结算单或视频后台数据。"
    };
  }

  return {
    confirmedRevenueYuan: formatYuanInput(confirmedRevenueCents),
    platformShareRatio,
    settlementProofPath: statement.settlementProofPath || "",
    paymentReference: statement.paymentReference || "",
    paidAt: formatDateTimeLocalInput(statement.paidAt),
    adminNote: statement.adminNote || ""
  };
}

function openRevenueShareStatementForm(statementId, status, selectNode) {
  const statement = revenueShareStatementsById.get(statementId) || {};
  const defaults = buildRevenueShareStatementDefaults(statement, status);
  pendingRevenueShareStatementSelectNode = selectNode;

  revenueShareStatementIdNode.value = statementId;
  revenueShareStatementStatusNode.value = status;
  revenueShareStatementSummaryNode.textContent = `${statement.script?.title || "-"} / ${statement.user?.email || "-"} / ${formatDate(statement.periodStart)} - ${formatDate(statement.periodEnd)} / ${statusLabels[status] || status}`;
  revenueShareConfirmedRevenueNode.value = defaults.confirmedRevenueYuan;
  revenueShareStatementRatioNode.value = defaults.platformShareRatio;
  revenueShareSettlementProofNode.value = defaults.settlementProofPath;
  revenueSharePaymentReferenceNode.value = defaults.paymentReference;
  revenueSharePaidAtNode.value = defaults.paidAt;
  revenueShareStatementAdminNoteNode.value = defaults.adminNote;
  revenueShareStatementDialogNode?.showModal();
}

function closeRevenueShareStatementForm(shouldReload = true) {
  revenueShareStatementDialogNode?.close();
  pendingRevenueShareStatementSelectNode = null;
  if (shouldReload) loadRevenueShareStatements();
}

async function updateUserStatus(userId, status, selectNode) {
  selectNode.disabled = true;

  try {
    await fetchJson(`/api/admin/users/${encodeURIComponent(userId)}`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    await Promise.all([loadUsers(), loadOverview()]);
    showNotice(`用户状态已更新为：${statusLabels[status] || status}`, "success");
  } catch (error) {
    handleAdminError(error, "用户状态更新失败，请稍后重试。");
    selectNode.disabled = false;
  }
}

async function updateScript(scriptId, updates, controlNode) {
  controlNode.disabled = true;

  try {
    await fetchJson(`/api/admin/scripts/${encodeURIComponent(scriptId)}`, {
      method: "PATCH",
      body: JSON.stringify(updates)
    });
    await Promise.all([loadScripts(), loadOverview()]);
    if (Object.hasOwn(updates, "status")) {
      showNotice(`剧本状态已更新为：${statusLabels[updates.status] || updates.status}`, "success");
    } else if (Object.hasOwn(updates, "featured")) {
      showNotice(updates.featured ? "剧本已设为主推。" : "剧本已取消主推。", "success");
    }
  } catch (error) {
    handleAdminError(error, "剧本状态更新失败，请稍后重试。");
    controlNode.disabled = false;
  }
}

function getDeleteConfig(deleteType) {
  return {
    continuationRequest: {
      endpoint: "/api/admin/continuation-requests",
      reload: () => Promise.all([loadRequests(), loadOverview()])
    },
    order: {
      endpoint: "/api/admin/orders",
      reload: () => Promise.all([loadOrders(), loadOverview()])
    },
    testReport: {
      endpoint: "/api/admin/test-reports",
      reload: () => Promise.all([loadReports(), loadOverview()])
    },
    revenueShareStatement: {
      endpoint: "/api/admin/revenue-share-statements",
      reload: () => Promise.all([loadRevenueShareStatements(), loadOverview()])
    },
    download: {
      endpoint: "/api/admin/downloads",
      reload: () => Promise.all([loadDownloads(), loadOverview()])
    },
    user: {
      endpoint: "/api/admin/users",
      reload: () => Promise.all([loadUsers(), loadOverview()])
    },
    script: {
      endpoint: "/api/admin/scripts",
      reload: () => Promise.all([loadScripts(), loadOverview()])
    }
  }[deleteType];
}

async function deleteAdminItem(deleteType, itemId, label, buttonNode) {
  const config = getDeleteConfig(deleteType);
  if (!config) return;

  const extraWarning =
    deleteType === "script" || deleteType === "user"
      ? "\n\n注意：删除剧本或用户会连带影响其关联数据。"
      : "";
  const confirmed = window.confirm(`确认永久删除：${label}？\n\n这会直接删除数据库数据，无法在后台恢复。${extraWarning}`);
  if (!confirmed) return;

  buttonNode.disabled = true;

  try {
    await fetchJson(`${config.endpoint}/${encodeURIComponent(itemId)}`, {
      method: "DELETE",
      body: JSON.stringify({ confirmDelete: true })
    });
    await config.reload();
    showNotice(`已删除：${label}`, "success");
  } catch (error) {
    handleAdminError(error, "删除失败，请稍后重试。");
    buttonNode.disabled = false;
  }
}

function handleAdminError(error, fallbackMessage) {
  if (error.status === 401) {
    window.location.href = `/auth.html?mode=login&next=${encodeURIComponent("/admin/")}`;
    return;
  }

  if (error.status === 403) {
    showNotice("当前账号没有后台管理权限。", "danger");
    return;
  }

  showNotice(error.message || fallbackMessage, "danger");
}

function bindRequestEvents() {
  document.querySelector("[data-requests-refresh]")?.addEventListener("click", loadRequests);
  document.querySelector("[data-requests-search-button]")?.addEventListener("click", () => {
    requestState.page = 1;
    loadRequests();
  });

  requestsSearchNode?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      requestState.page = 1;
      loadRequests();
    }
  });

  requestsStatusNode?.addEventListener("change", () => {
    requestState.page = 1;
    loadRequests();
  });

  requestsTypeNode?.addEventListener("change", () => {
    requestState.page = 1;
    loadRequests();
  });

  document.querySelector("[data-requests-prev]")?.addEventListener("click", () => {
    if (requestState.page <= 1) return;
    requestState.page -= 1;
    loadRequests();
  });

  document.querySelector("[data-requests-next]")?.addEventListener("click", () => {
    if (requestState.page >= requestState.totalPages) return;
    requestState.page += 1;
    loadRequests();
  });

  requestsTableNode?.addEventListener("change", (event) => {
    const selectNode = event.target.closest("[data-request-status-select]");
    if (!selectNode) return;

    if (selectNode.value === "approved") {
      openApprovalForm(selectNode.dataset.itemId, selectNode);
      return;
    }

    const requestItem = continuationRequestsById.get(selectNode.dataset.itemId) || {};
    const payload = buildContinuationUpdatePayload(selectNode.value, requestItem);
    if (!payload) {
      loadRequests();
      return;
    }

    updateRequestStatus(selectNode.dataset.itemId, payload, selectNode);
  });
}

function bindOrderEvents() {
  document.querySelector("[data-orders-refresh]")?.addEventListener("click", loadOrders);
  document.querySelector("[data-orders-search-button]")?.addEventListener("click", () => {
    orderState.page = 1;
    loadOrders();
  });

  ordersSearchNode?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      orderState.page = 1;
      loadOrders();
    }
  });

  ordersStatusNode?.addEventListener("change", () => {
    orderState.page = 1;
    loadOrders();
  });

  document.querySelector("[data-orders-prev]")?.addEventListener("click", () => {
    if (orderState.page <= 1) return;
    orderState.page -= 1;
    loadOrders();
  });

  document.querySelector("[data-orders-next]")?.addEventListener("click", () => {
    if (orderState.page >= orderState.totalPages) return;
    orderState.page += 1;
    loadOrders();
  });

  ordersTableNode?.addEventListener("change", (event) => {
    const selectNode = event.target.closest("[data-order-status-select]");
    if (!selectNode) return;

    if (["paid", "delivered", "cancelled"].includes(selectNode.value)) {
      openOrderStatusForm(selectNode.dataset.itemId, selectNode.value, selectNode);
      return;
    }

    updateOrderStatus(selectNode.dataset.itemId, { status: selectNode.value }, selectNode);
  });
}

function bindReportEvents() {
  document.querySelector("[data-reports-refresh]")?.addEventListener("click", loadReports);
  document.querySelector("[data-reports-search-button]")?.addEventListener("click", () => {
    reportState.page = 1;
    loadReports();
  });

  [reportsSearchNode, reportsPlatformNode].forEach((node) => {
    node?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        reportState.page = 1;
        loadReports();
      }
    });
  });

  reportsStatusNode?.addEventListener("change", () => {
    reportState.page = 1;
    loadReports();
  });

  document.querySelector("[data-reports-prev]")?.addEventListener("click", () => {
    if (reportState.page <= 1) return;
    reportState.page -= 1;
    loadReports();
  });

  document.querySelector("[data-reports-next]")?.addEventListener("click", () => {
    if (reportState.page >= reportState.totalPages) return;
    reportState.page += 1;
    loadReports();
  });

  reportsTableNode?.addEventListener("change", (event) => {
    const selectNode = event.target.closest("[data-report-status-select]");
    if (!selectNode) return;

    updateReportStatus(selectNode.dataset.itemId, selectNode.value, selectNode);
  });
}

function bindRevenueShareStatementEvents() {
  document.querySelector("[data-revenue-share-statements-refresh]")?.addEventListener("click", loadRevenueShareStatements);
  document.querySelector("[data-revenue-share-statements-search-button]")?.addEventListener("click", () => {
    revenueShareStatementState.page = 1;
    loadRevenueShareStatements();
  });

  revenueShareStatementsSearchNode?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      revenueShareStatementState.page = 1;
      loadRevenueShareStatements();
    }
  });

  revenueShareStatementsStatusNode?.addEventListener("change", () => {
    revenueShareStatementState.page = 1;
    loadRevenueShareStatements();
  });

  document.querySelector("[data-revenue-share-statements-prev]")?.addEventListener("click", () => {
    if (revenueShareStatementState.page <= 1) return;
    revenueShareStatementState.page -= 1;
    loadRevenueShareStatements();
  });

  document.querySelector("[data-revenue-share-statements-next]")?.addEventListener("click", () => {
    if (revenueShareStatementState.page >= revenueShareStatementState.totalPages) return;
    revenueShareStatementState.page += 1;
    loadRevenueShareStatements();
  });

  revenueShareStatementsTableNode?.addEventListener("change", (event) => {
    const selectNode = event.target.closest("[data-revenue-share-statement-status-select]");
    if (!selectNode) return;

    if (["confirmed", "settled", "rejected"].includes(selectNode.value)) {
      openRevenueShareStatementForm(selectNode.dataset.itemId, selectNode.value, selectNode);
      return;
    }

    updateRevenueShareStatementStatus(selectNode.dataset.itemId, selectNode.value, selectNode);
  });
}

function bindDownloadEvents() {
  document.querySelector("[data-downloads-refresh]")?.addEventListener("click", loadDownloads);
  document.querySelector("[data-downloads-search-button]")?.addEventListener("click", () => {
    downloadState.page = 1;
    loadDownloads();
  });

  downloadsSearchNode?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      downloadState.page = 1;
      loadDownloads();
    }
  });

  document.querySelector("[data-downloads-prev]")?.addEventListener("click", () => {
    if (downloadState.page <= 1) return;
    downloadState.page -= 1;
    loadDownloads();
  });

  document.querySelector("[data-downloads-next]")?.addEventListener("click", () => {
    if (downloadState.page >= downloadState.totalPages) return;
    downloadState.page += 1;
    loadDownloads();
  });
}

function bindUserEvents() {
  document.querySelector("[data-users-refresh]")?.addEventListener("click", loadUsers);
  document.querySelector("[data-users-search-button]")?.addEventListener("click", () => {
    userState.page = 1;
    loadUsers();
  });

  usersSearchNode?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      userState.page = 1;
      loadUsers();
    }
  });

  usersStatusNode?.addEventListener("change", () => {
    userState.page = 1;
    loadUsers();
  });

  usersRoleNode?.addEventListener("change", () => {
    userState.page = 1;
    loadUsers();
  });

  document.querySelector("[data-users-prev]")?.addEventListener("click", () => {
    if (userState.page <= 1) return;
    userState.page -= 1;
    loadUsers();
  });

  document.querySelector("[data-users-next]")?.addEventListener("click", () => {
    if (userState.page >= userState.totalPages) return;
    userState.page += 1;
    loadUsers();
  });

  usersTableNode?.addEventListener("change", (event) => {
    const selectNode = event.target.closest("[data-user-status-select]");
    if (!selectNode) return;

    updateUserStatus(selectNode.dataset.itemId, selectNode.value, selectNode);
  });
}

function bindScriptEvents() {
  document.querySelector("[data-scripts-refresh]")?.addEventListener("click", loadScripts);
  document.querySelector("[data-scripts-search-button]")?.addEventListener("click", () => {
    scriptState.page = 1;
    loadScripts();
  });

  scriptsSearchNode?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      scriptState.page = 1;
      loadScripts();
    }
  });

  scriptsStatusNode?.addEventListener("change", () => {
    scriptState.page = 1;
    loadScripts();
  });

  scriptsFeaturedNode?.addEventListener("change", () => {
    scriptState.page = 1;
    loadScripts();
  });

  document.querySelector("[data-scripts-prev]")?.addEventListener("click", () => {
    if (scriptState.page <= 1) return;
    scriptState.page -= 1;
    loadScripts();
  });

  document.querySelector("[data-scripts-next]")?.addEventListener("click", () => {
    if (scriptState.page >= scriptState.totalPages) return;
    scriptState.page += 1;
    loadScripts();
  });

  scriptsTableNode?.addEventListener("change", (event) => {
    const statusSelect = event.target.closest("[data-script-status-select]");
    if (statusSelect) {
      const updates = { status: statusSelect.value };

      if (statusSelect.value === "archived") {
        const confirmed = window.confirm("归档后该剧本会从用户端下架，确认继续吗？");
        if (!confirmed) {
          loadScripts();
          return;
        }
        updates.confirmArchive = true;
      }

      updateScript(statusSelect.dataset.itemId, updates, statusSelect);
      return;
    }

    const featuredToggle = event.target.closest("[data-script-featured-toggle]");
    if (featuredToggle) {
      updateScript(featuredToggle.dataset.itemId, { featured: featuredToggle.checked }, featuredToggle);
    }
  });
}

function bindDeleteEvents() {
  document.addEventListener("click", (event) => {
    const buttonNode = event.target.closest("[data-delete-type]");
    if (!buttonNode) return;

    deleteAdminItem(
      buttonNode.dataset.deleteType,
      buttonNode.dataset.itemId,
      buttonNode.dataset.deleteLabel || buttonNode.dataset.itemId,
      buttonNode
    );
  });
}

function bindDialogEvents() {
  document.querySelectorAll("[data-approval-cancel]").forEach((button) => {
    button.addEventListener("click", () => closeApprovalForm(true));
  });

  approvalFormNode?.addEventListener("submit", (event) => {
    event.preventDefault();
    const requestId = approvalRequestIdNode.value;
    const payload = buildApprovalFormPayload();
    approvalDialogNode?.close();
    updateRequestStatus(requestId, payload, pendingApprovalSelectNode);
  });

  document.querySelectorAll("[data-order-cancel]").forEach((button) => {
    button.addEventListener("click", () => closeOrderStatusForm(true));
  });

  orderFormNode?.addEventListener("submit", (event) => {
    event.preventDefault();
    const payload = {
      status: orderStatusNode.value,
      paymentNote: orderPaymentNoteNode.value.trim(),
      userVisibleNote: orderUserNoteNode.value.trim()
    };
    const orderId = orderIdNode.value;
    orderDialogNode?.close();
    updateOrderStatus(orderId, payload, pendingOrderSelectNode);
  });

  document.querySelectorAll("[data-revenue-share-statement-cancel]").forEach((button) => {
    button.addEventListener("click", () => closeRevenueShareStatementForm(true));
  });

  revenueShareStatementFormNode?.addEventListener("submit", (event) => {
    event.preventDefault();
    const payload = {
      status: revenueShareStatementStatusNode.value,
      confirmedRevenueYuan: revenueShareConfirmedRevenueNode.value,
      platformShareRatio: Number(revenueShareStatementRatioNode.value),
      settlementProofPath: revenueShareSettlementProofNode.value.trim(),
      paymentReference: revenueSharePaymentReferenceNode.value.trim(),
      paidAt: revenueSharePaidAtNode.value || null,
      adminNote: revenueShareStatementAdminNoteNode.value.trim()
    };
    const statementId = revenueShareStatementIdNode.value;
    revenueShareStatementDialogNode?.close();
    updateRevenueShareStatementStatus(statementId, payload.status, pendingRevenueShareStatementSelectNode, payload);
  });
}

async function initAdmin() {
  populateRequestFilters();
  populateOrderFilters();
  populateReportFilters();
  populateRevenueShareStatementFilters();
  populateUserFilters();
  populateScriptFilters();
  bindRequestEvents();
  bindOrderEvents();
  bindReportEvents();
  bindRevenueShareStatementEvents();
  bindDownloadEvents();
  bindUserEvents();
  bindScriptEvents();
  bindDeleteEvents();
  bindDialogEvents();

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => setActiveTab(button.dataset.tab));
  });

  document.querySelector("[data-refresh]")?.addEventListener("click", loadOverview);

  try {
    const { user } = await fetchJson("/api/admin/me");
    currentAdminEmail = user?.email || "";
    adminUserNode.textContent = user?.email || "管理员";
    await loadOverview();
  } catch (error) {
    if (error.status === 401) {
      window.location.href = `/auth.html?mode=login&next=${encodeURIComponent("/admin/")}`;
      return;
    }

    if (error.status === 403) {
      adminUserNode.textContent = "无权限";
      showNotice("当前账号不是管理员，无法访问后台数据。", "danger");
      return;
    }

    adminUserNode.textContent = "校验失败";
    showNotice("后台权限校验失败，请刷新页面重试。", "danger");
  }
}

initAdmin();
