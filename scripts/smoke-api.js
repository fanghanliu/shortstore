const { spawn } = require("node:child_process");
const { PrismaClient } = require("@prisma/client");

const baseUrl = "http://127.0.0.1:3000";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(path, options) {
  const { body } = await requestWithMeta(path, options);
  return body;
}

async function requestWithMeta(path, options) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json();

  if (!response.ok) {
    throw new Error(`${path} failed: ${response.status} ${JSON.stringify(body)}`);
  }

  return {
    body,
    headers: response.headers
  };
}

async function requestText(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`${path} failed: ${response.status}`);
  }

  return body;
}

async function requestBinary(path, options) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = Buffer.from(await response.arrayBuffer());

  if (!response.ok) {
    throw new Error(`${path} failed: ${response.status}`);
  }

  return {
    body,
    headers: response.headers
  };
}

function assertDocxDownload(download, expectedFileName) {
  if (download.body[0] !== 0x50 || download.body[1] !== 0x4b) {
    throw new Error("Downloaded file did not look like a docx archive");
  }

  const contentType = download.headers.get("content-type") || "";
  if (!contentType.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
    throw new Error(`Unexpected download content type: ${contentType}`);
  }

  const disposition = download.headers.get("content-disposition") || "";
  const encodedFileName = encodeURIComponent(expectedFileName);
  if (!disposition.includes("filename*=") || !disposition.includes(encodedFileName)) {
    throw new Error(`Download disposition did not include the expected filename: ${disposition}`);
  }
}

async function waitForServer() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      return await request("/api/health");
    } catch {
      await wait(300);
    }
  }

  throw new Error("API server did not become ready");
}

async function main() {
  const child = spawn(process.execPath, ["server.js"], {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "pipe"]
  });

  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  try {
    await waitForServer();

    const scripts = await request("/api/scripts");
    if (scripts.total < 4) {
      throw new Error(`Expected at least 4 published scripts, got ${scripts.total}`);
    }
    if (!scripts.items.some((item) => item.slug === "lie-scent")) {
      throw new Error("lie-scent was not returned from /api/scripts");
    }

    const slugs = ["lie-scent", "last-cloud-city", "live-revenge", "love-algorithm"];
    for (const slug of slugs) {
      const detail = await request(`/api/scripts/${slug}`);
      if (detail.episodes.length !== 3) {
        throw new Error(`${slug} expected 3 free preview episodes, got ${detail.episodes.length}`);
      }
      if (!detail.episodes.every((episode) => episode.aiPromptZh && episode.aiPromptEn)) {
        throw new Error(`${slug} free preview episodes must expose bilingual AI prompts`);
      }
    }

    const detailPage = await requestText("/script-preview.html?slug=last-cloud-city");
    if (!detailPage.includes("script-preview.js")) {
      throw new Error("script-preview.html did not include script-preview.js");
    }

    const preview = await request("/api/scripts/lie-scent/free-preview");
    if (preview.asset.id !== "asset_lie_scent_free_v1") {
      throw new Error("Unexpected free preview asset");
    }

    const visitorId = `smoke-test-${Date.now()}`;
    const download = await request("/api/downloads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        scriptSlug: "lie-scent",
        assetId: "asset_lie_scent_free_v1",
        visitorId,
        licenseConfirmed: true
      })
    });

    if (download.downloadUrl !== "/api/download-files/script-assets/asset_lie_scent_free_v1") {
      throw new Error(`Unexpected download URL: ${download.downloadUrl}`);
    }

    const previewDownload = await requestBinary(download.downloadUrl);
    assertDocxDownload(previewDownload, "她闻到谎言-前三集免费验证包.docx");

    const email = `smoke-${Date.now()}@example.com`;
    const register = await requestWithMeta("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email,
        password: "smoke-test-password",
        displayName: "Smoke Test User"
      })
    });

    const cookie = register.headers.get("set-cookie")?.split(";")[0];
    if (!register.body.user?.id || !cookie) {
      throw new Error("Register did not return a user and session cookie");
    }

    const prisma = new PrismaClient();

    const me = await request("/api/me", {
      headers: { cookie }
    });
    if (me.user?.email !== email) {
      throw new Error("/api/me did not return the registered user");
    }

    const nonAdminResponse = await fetch(`${baseUrl}/api/admin/me`, {
      headers: { cookie }
    });
    if (nonAdminResponse.status !== 403) {
      throw new Error(`Expected non-admin /api/admin/me to return 403, got ${nonAdminResponse.status}`);
    }

    await prisma.user.update({
      where: { id: register.body.user.id },
      data: { role: "admin" }
    });

    const adminMe = await request("/api/admin/me", {
      headers: { cookie }
    });
    if (adminMe.user?.role !== "admin") {
      throw new Error("/api/admin/me did not return the promoted admin user");
    }

    const adminOverview = await request("/api/admin/overview", {
      headers: { cookie }
    });
    if (!adminOverview.metrics || adminOverview.metrics.publishedScriptCount < 4) {
      throw new Error("/api/admin/overview did not return expected metrics");
    }

    const adminScripts = await request("/api/admin/scripts", {
      headers: { cookie }
    });
    const lieScentAdminScript = adminScripts.items.find((item) => item.slug === "lie-scent");
    if (!lieScentAdminScript) {
      throw new Error("/api/admin/scripts did not include lie-scent");
    }

    const originalScriptStatus = lieScentAdminScript.status;
    const originalScriptFeatured = lieScentAdminScript.featured;

    const featuredScript = await request(`/api/admin/scripts/${lieScentAdminScript.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({ featured: !originalScriptFeatured })
    });
    if (featuredScript.script?.featured !== !originalScriptFeatured) {
      throw new Error("Admin script featured update failed");
    }

    const archivedScript = await request(`/api/admin/scripts/${lieScentAdminScript.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({ status: "archived", confirmArchive: true })
    });
    if (archivedScript.script?.status !== "archived") {
      throw new Error("Admin script status update failed");
    }

    await request(`/api/admin/scripts/${lieScentAdminScript.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({
        status: originalScriptStatus,
        featured: originalScriptFeatured
      })
    });

    const managedUserEmail = `managed-${Date.now()}@example.com`;
    const managedUser = await prisma.user.create({
      data: {
        email: managedUserEmail,
        passwordHash: "not-used-in-smoke-test",
        displayName: "Managed Smoke User"
      }
    });

    const adminUsers = await request("/api/admin/users", {
      headers: { cookie }
    });
    if (!adminUsers.items.some((item) => item.id === managedUser.id)) {
      throw new Error("/api/admin/users did not include the managed smoke user");
    }

    const disabledUser = await request(`/api/admin/users/${managedUser.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({ status: "disabled" })
    });
    if (disabledUser.user?.status !== "disabled") {
      throw new Error("Admin user status update failed");
    }

    const deletedManagedUser = await request(`/api/admin/users/${managedUser.id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({ confirmDelete: true })
    });
    if (deletedManagedUser.ok !== true) {
      throw new Error("Admin user deletion failed");
    }

    const temporaryScript = await prisma.script.create({
      data: {
        slug: `smoke-delete-script-${Date.now()}`,
        title: "Smoke Delete Script",
        logline: "Temporary script for delete test",
        synopsis: "Temporary script for delete test",
        category: "smoke-test",
        status: "draft"
      }
    });
    const deletedScript = await request(`/api/admin/scripts/${temporaryScript.id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({ confirmDelete: true })
    });
    if (deletedScript.ok !== true) {
      throw new Error("Admin script deletion failed");
    }

    const temporaryDownload = await prisma.download.create({
      data: {
        scriptId: lieScentAdminScript.id,
        assetId: "asset_lie_scent_free_v1",
        userId: register.body.user.id,
        visitorId: `smoke-delete-download-${Date.now()}`,
        licenseConfirmed: true
      }
    });
    const deletedDownload = await request(`/api/admin/downloads/${temporaryDownload.id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({ confirmDelete: true })
    });
    if (deletedDownload.ok !== true) {
      throw new Error("Admin download deletion failed");
    }

    const temporaryTestReport = await prisma.testReport.create({
      data: {
        userId: register.body.user.id,
        scriptId: lieScentAdminScript.id,
        platform: "smoke-delete-platform",
        videoUrl: "https://example.com/delete-test-report"
      }
    });
    const deletedTestReport = await request(`/api/admin/test-reports/${temporaryTestReport.id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({ confirmDelete: true })
    });
    if (deletedTestReport.ok !== true) {
      throw new Error("Admin test report deletion failed");
    }

    const temporaryContinuationRequest = await prisma.continuationRequest.create({
      data: {
        userId: register.body.user.id,
        scriptId: lieScentAdminScript.id,
        type: "pay_per_episode",
        episodeRange: "4-5",
        status: "submitted"
      }
    });
    const deletedContinuationRequest = await request(
      `/api/admin/continuation-requests/${temporaryContinuationRequest.id}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          cookie
        },
        body: JSON.stringify({ confirmDelete: true })
      }
    );
    if (deletedContinuationRequest.ok !== true) {
      throw new Error("Admin continuation request deletion failed");
    }

    const temporaryOrder = await prisma.order.create({
      data: {
        userId: register.body.user.id,
        scriptId: lieScentAdminScript.id,
        orderType: "pay_per_episode",
        title: "Smoke Delete Order",
        amountCents: 100
      }
    });
    const deletedOrder = await request(`/api/admin/orders/${temporaryOrder.id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({ confirmDelete: true })
    });
    if (deletedOrder.ok !== true) {
      throw new Error("Admin order deletion failed");
    }

    const temporaryRevenueShareProject = await prisma.revenueShareProject.create({
      data: {
        userId: register.body.user.id,
        scriptId: lieScentAdminScript.id
      }
    });
    const temporaryRevenueShareStatement = await prisma.revenueShareStatement.create({
      data: {
        projectId: temporaryRevenueShareProject.id,
        userId: register.body.user.id,
        scriptId: lieScentAdminScript.id,
        periodStart: new Date("2026-04-01T00:00:00.000Z"),
        periodEnd: new Date("2026-04-30T00:00:00.000Z"),
        status: "submitted"
      }
    });
    const deletedRevenueShareStatement = await request(
      `/api/admin/revenue-share-statements/${temporaryRevenueShareStatement.id}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          cookie
        },
        body: JSON.stringify({ confirmDelete: true })
      }
    );
    if (deletedRevenueShareStatement.ok !== true) {
      throw new Error("Admin revenue share statement deletion failed");
    }

    const deletedRevenueShareProject = await request(
      `/api/admin/revenue-share-projects/${temporaryRevenueShareProject.id}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          cookie
        },
        body: JSON.stringify({ confirmDelete: true })
      }
    );
    if (deletedRevenueShareProject.ok !== true) {
      throw new Error("Admin revenue share project deletion failed");
    }

    const bound = await request("/api/me/bind-visitor-downloads", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({ visitorId })
    });
    if (bound.boundCount < 1) {
      throw new Error("Visitor download was not bound to the registered user");
    }

    const myDownloads = await request("/api/me/downloads", {
      headers: { cookie }
    });
    if (!myDownloads.items.some((item) => item.script.slug === "lie-scent")) {
      throw new Error("/api/me/downloads did not include the bound lie-scent download");
    }
    const boundDownload = myDownloads.items.find((item) => item.script.slug === "lie-scent");

    const adminDownloads = await request("/api/admin/downloads", {
      headers: { cookie }
    });
    if (!adminDownloads.items.some((item) => item.id === boundDownload.id)) {
      throw new Error("/api/admin/downloads did not include the bound smoke download");
    }

    const testReport = await request("/api/test-reports", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({
        scriptId: boundDownload.script.id,
        downloadId: boundDownload.id,
        platform: "smoke-platform",
        videoUrl: "https://example.com/smoke-video",
        viewCount: 1000,
        likeCount: 120,
        commentCount: 18,
        followerDelta: 9,
        notes: "Smoke test report"
      })
    });
    if (testReport.report?.script?.slug !== "lie-scent") {
      throw new Error("Test report was not created for lie-scent");
    }

    const testReports = await request("/api/me/test-reports", {
      headers: { cookie }
    });
    if (!testReports.items.some((item) => item.id === testReport.report.id)) {
      throw new Error("/api/me/test-reports did not include the submitted report");
    }

    const adminTestReports = await request("/api/admin/test-reports", {
      headers: { cookie }
    });
    if (!adminTestReports.items.some((item) => item.id === testReport.report.id)) {
      throw new Error("/api/admin/test-reports did not include the submitted report");
    }

    const updatedTestReport = await request(`/api/admin/test-reports/${testReport.report.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({ status: "valuable" })
    });
    if (updatedTestReport.report?.status !== "valuable") {
      throw new Error("Admin test report status update failed");
    }

    const myUpdatedTestReports = await request("/api/me/test-reports", {
      headers: { cookie }
    });
    const myUpdatedTestReport = myUpdatedTestReports.items.find((item) => item.id === testReport.report.id);
    if (myUpdatedTestReport?.status !== "valuable") {
      throw new Error("User-facing test report status did not reflect admin update");
    }

    const continuationOptions = await request("/api/me/continuation-options?type=pay_per_episode", {
      headers: { cookie }
    });
    const lieScentOption = continuationOptions.items.find((item) => item.script.slug === "lie-scent");
    if (!lieScentOption || !lieScentOption.episodes.some((episode) => episode.episodeNumber === 4 && !episode.disabled)) {
      throw new Error("/api/me/continuation-options did not expose available paid episodes");
    }

    const continuation = await request("/api/continuation-requests", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({
        scriptId: boundDownload.script.id,
        downloadId: boundDownload.id,
        testReportId: testReport.report.id,
        type: "pay_per_episode",
        episodeNumbers: [4, 5, 6],
        episodeRange: "第4-10集",
        contactPreference: "email",
        message: "Smoke test continuation request"
      })
    });
    if (continuation.request?.type !== "pay_per_episode") {
      throw new Error("Continuation request was not created");
    }
    if (continuation.request?.episodeRange !== "第4-6集") {
      throw new Error("Continuation request did not normalize selected episode numbers");
    }

    const adminContinuationRequests = await request("/api/admin/continuation-requests", {
      headers: { cookie }
    });
    if (!adminContinuationRequests.items.some((item) => item.id === continuation.request.id)) {
      throw new Error("/api/admin/continuation-requests did not include the submitted request");
    }

    const updatedContinuation = await request(`/api/admin/continuation-requests/${continuation.request.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({
        status: "approved",
        userVisibleNote: "Smoke approval note",
        createOrder: true,
        amountYuan: 399,
        orderTitle: "Smoke order quote",
        orderUserVisibleNote: "Smoke payment note",
        createDelivery: true,
        deliveryTitle: "Smoke delivery package",
        deliveryNote: "Smoke delivery note"
      })
    });
    if (updatedContinuation.request?.status !== "approved") {
      throw new Error("Admin continuation request status update failed");
    }
    if (updatedContinuation.order?.status !== "pending_payment") {
      throw new Error("Admin continuation approval did not create a pending payment order");
    }

    const continuationRequests = await request("/api/me/continuation-requests", {
      headers: { cookie }
    });
    const myUpdatedContinuationRequest = continuationRequests.items.find((item) => item.id === continuation.request.id);
    if (!myUpdatedContinuationRequest) {
      throw new Error("/api/me/continuation-requests did not include the submitted request");
    }
    if (myUpdatedContinuationRequest.status !== "approved") {
      throw new Error("User-facing continuation request status did not reflect admin approval");
    }
    if (myUpdatedContinuationRequest.userVisibleNote !== "Smoke approval note") {
      throw new Error("User-facing continuation request did not include approval note");
    }

    const myOrders = await request("/api/me/orders", {
      headers: { cookie }
    });
    const smokeOrder = myOrders.items.find((item) => item.title === "Smoke order quote");
    if (!smokeOrder || smokeOrder.status !== "pending_payment" || smokeOrder.amountCents !== 39900) {
      throw new Error("/api/me/orders did not include the pending smoke order");
    }

    const lockedDeliveries = await request("/api/me/deliveries", {
      headers: { cookie }
    });
    if (lockedDeliveries.items.some((item) => item.title === "Smoke delivery package")) {
      throw new Error("Delivery package should not be visible before payment confirmation");
    }

    const paidOrder = await request(`/api/admin/orders/${smokeOrder.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({
        status: "paid",
        paymentNote: "Smoke payment confirmed"
      })
    });
    if (paidOrder.order?.status !== "paid") {
      throw new Error("Admin order payment confirmation failed");
    }

    const paidOrders = await request("/api/me/orders", {
      headers: { cookie }
    });
    const myPaidOrder = paidOrders.items.find((item) => item.id === smokeOrder.id);
    if (myPaidOrder?.status !== "paid") {
      throw new Error("User-facing order status did not reflect payment confirmation");
    }

    const myDeliveries = await request("/api/me/deliveries", {
      headers: { cookie }
    });
    const smokeDelivery = myDeliveries.items.find((item) => item.title === "Smoke delivery package");
    if (!smokeDelivery || !smokeDelivery.assets.some((asset) => asset.filePath === "downloads/lie-scent/deliveries/episodes-4-6-package-v1.docx")) {
      throw new Error("/api/me/deliveries did not include the approved delivery package");
    }

    const smokeDeliveryAsset = smokeDelivery.assets.find(
      (asset) => asset.filePath === "downloads/lie-scent/deliveries/episodes-4-6-package-v1.docx"
    );
    if (!smokeDeliveryAsset?.downloadUrl?.startsWith("/api/download-files/delivery-assets/")) {
      throw new Error("Delivery asset did not expose the unified download URL");
    }

    const anonymousDeliveryDownload = await fetch(`${baseUrl}${smokeDeliveryAsset.downloadUrl}`);
    if (anonymousDeliveryDownload.status !== 401) {
      throw new Error(`Expected anonymous delivery download to return 401, got ${anonymousDeliveryDownload.status}`);
    }

    const deliveryDownload = await requestBinary(smokeDeliveryAsset.downloadUrl, {
      headers: { cookie }
    });
    assertDocxDownload(deliveryDownload, "她闻到谎言-第4-6集按集购买交付包.docx");

    const revenueShareRequest = await request("/api/continuation-requests", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({
        scriptId: boundDownload.script.id,
        downloadId: boundDownload.id,
        testReportId: testReport.report.id,
        type: "revenue_share",
        contactPreference: "email",
        message: "Smoke test revenue share request"
      })
    });
    if (revenueShareRequest.request?.type !== "revenue_share") {
      throw new Error("Revenue share continuation request was not created");
    }

    const approvedRevenueShare = await request(`/api/admin/continuation-requests/${revenueShareRequest.request.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({
        status: "approved",
        userVisibleNote: "Smoke revenue share approved",
        createRevenueShareProject: true,
        shareRatioPlatform: 30,
        shareRatioUser: 70,
        firstEpisodeNumber: 4,
        currentEpisodeEnd: 10,
        authorizedPlatforms: ["smoke-platform"],
        authorizedAccounts: ["smoke-account"],
        contractStatus: "not_uploaded",
        assetPath: "downloads/lie-scent/deliveries/revenue-share-episodes-4-10-package-v1.docx"
      })
    });
    if (approvedRevenueShare.revenueShareProject?.currentEpisodeEnd !== 10) {
      throw new Error("Admin revenue share approval did not create a first-batch project");
    }
    if (approvedRevenueShare.order) {
      throw new Error("Revenue share approval should not create a normal order");
    }

    const adminRevenueShareProjects = await request("/api/admin/revenue-share-projects", {
      headers: { cookie }
    });
    if (!adminRevenueShareProjects.items.some((item) => item.id === approvedRevenueShare.revenueShareProject.id)) {
      throw new Error("/api/admin/revenue-share-projects did not include the smoke project");
    }

    const myRevenueShareProjects = await request("/api/me/revenue-share-projects", {
      headers: { cookie }
    });
    const myRevenueShareProject = myRevenueShareProjects.items.find(
      (item) => item.id === approvedRevenueShare.revenueShareProject.id
    );
    if (!myRevenueShareProject || myRevenueShareProject.shareRatioPlatform !== 30) {
      throw new Error("/api/me/revenue-share-projects did not include the smoke project");
    }

    const revenueShareDeliveries = await request("/api/me/deliveries", {
      headers: { cookie }
    });
    if (
      !revenueShareDeliveries.items.some((item) =>
        item.assets?.some((asset) => asset.filePath.includes("revenue-share-episodes-4-10-package-v1.docx"))
      )
    ) {
      throw new Error("Revenue share first batch delivery was not visible to the user");
    }
    const revenueShareDelivery = revenueShareDeliveries.items.find((item) =>
      item.assets?.some((asset) => asset.filePath.includes("revenue-share-episodes-4-10-package-v1.docx"))
    );
    const revenueShareDeliveryAsset = revenueShareDelivery.assets.find((asset) =>
      asset.filePath.includes("revenue-share-episodes-4-10-package-v1.docx")
    );
    const revenueShareDeliveryDownload = await requestBinary(revenueShareDeliveryAsset.downloadUrl, {
      headers: { cookie }
    });
    assertDocxDownload(revenueShareDeliveryDownload, "她闻到谎言-第4-10集分成合作交付包.docx");

    const revenueShareStatement = await request("/api/me/revenue-share-statements", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({
        projectId: approvedRevenueShare.revenueShareProject.id,
        periodStart: "2026-05-01",
        periodEnd: "2026-05-31",
        reportedRevenueYuan: "123.45",
        userNote: "Smoke monthly revenue statement",
        videos: [
          {
            episodeNumber: 4,
            title: "Smoke revenue share video",
            videoUrl: "https://example.com/revenue-share-video",
            platform: "smoke-platform",
            accountName: "smoke-account",
            publishedAt: "2026-05-10T08:00:00.000Z",
            viewCount: 1000,
            likeCount: 100,
            commentCount: 10,
            reportedRevenueYuan: "123.45",
            revenueType: "platform_income"
          }
        ],
        evidence: [
          {
            evidenceType: "revenue_screenshot",
            filePath: "screenshots/smoke-revenue.png"
          }
        ]
      })
    });
    if (revenueShareStatement.statement?.status !== "submitted") {
      throw new Error("Revenue share statement was not submitted");
    }

    const adminRevenueShareStatements = await request("/api/admin/revenue-share-statements", {
      headers: { cookie }
    });
    if (!adminRevenueShareStatements.items.some((item) => item.id === revenueShareStatement.statement.id)) {
      throw new Error("/api/admin/revenue-share-statements did not include the submitted statement");
    }

    const confirmedRevenueShareStatement = await request(
      `/api/admin/revenue-share-statements/${revenueShareStatement.statement.id}`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          cookie
        },
        body: JSON.stringify({
          status: "confirmed",
          confirmedRevenueYuan: "123.45",
          settlementProofPath: "settlements/smoke-revenue-share.pdf",
          paymentReference: "SMOKE-SETTLEMENT-001",
          paidAt: "2026-06-05T08:00:00.000Z",
          adminNote: "Smoke confirmed revenue share statement"
        })
      }
    );
    if (
      confirmedRevenueShareStatement.statement?.status !== "confirmed" ||
      confirmedRevenueShareStatement.statement?.settlementProofPath !== "settlements/smoke-revenue-share.pdf" ||
      confirmedRevenueShareStatement.statement?.paymentReference !== "SMOKE-SETTLEMENT-001"
    ) {
      throw new Error("Revenue share statement was not confirmed by admin");
    }

    const myRevenueShareProjectsAfterStatement = await request("/api/me/revenue-share-projects", {
      headers: { cookie }
    });
    const projectAfterStatement = myRevenueShareProjectsAfterStatement.items.find(
      (item) => item.id === approvedRevenueShare.revenueShareProject.id
    );
    if (!projectAfterStatement?.statements?.some((item) => item.id === revenueShareStatement.statement.id)) {
      throw new Error("User-facing revenue share project did not include the submitted statement");
    }

    const logout = await request("/api/auth/logout", {
      method: "POST",
      headers: { cookie }
    });
    if (logout.ok !== true) {
      throw new Error("Logout did not return ok");
    }

    await prisma.continuationRequest.deleteMany({ where: { userId: register.body.user.id } });
    await prisma.testReport.deleteMany({ where: { userId: register.body.user.id } });
    await prisma.download.deleteMany({ where: { visitorId } });
    await prisma.user.deleteMany({ where: { email: { in: [email, managedUserEmail] } } });
    await prisma.$disconnect();

    console.log("API smoke test passed");
  } finally {
    child.kill();
    await wait(200);

    if (child.exitCode && child.exitCode !== 0) {
      console.error(output);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
