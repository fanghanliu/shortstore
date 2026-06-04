const path = require("path");
const fs = require("fs");
const express = require("express");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const {
  generateContinuationDeliveryPackage
} = require("./scripts/generate-docx-deliveries");

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT || 3000);
const siteDir = path.join(__dirname, "public", "site");
const adminDir = path.join(__dirname, "public", "admin");
const downloadsDir = path.join(__dirname, "downloads");
const scriptsDataDir = path.join(__dirname, "scripts-data");
const authCookieName = process.env.AUTH_COOKIE_NAME || "script_marketplace_session";
const authJwtSecret =
  process.env.AUTH_JWT_SECRET || "local-dev-auth-secret-change-before-production";
const continuationRequestTypes = new Set(["buyout", "pay_per_episode", "revenue_share"]);
const testReportStatuses = new Set(["submitted", "reviewed", "valuable", "not_valuable", "invalid"]);
const continuationRequestStatuses = new Set(["submitted", "contacted", "approved", "rejected", "closed"]);
const activeContinuationRequestStatuses = ["submitted", "contacted", "approved"];
const userStatuses = new Set(["active", "disabled"]);
const scriptStatuses = new Set(["draft", "published", "archived"]);
const deliveryStatuses = new Set(["pending_payment", "ready", "delivered", "archived"]);
const orderStatuses = new Set(["pending_payment", "paid", "delivered", "cancelled"]);
const activeOrderStatuses = ["pending_payment", "paid", "delivered"];
const exclusiveContinuationTypes = ["buyout", "revenue_share"];
const revenueShareProjectStatuses = new Set(["draft", "pending_contract", "active", "paused", "terminated", "completed"]);
const revenueShareContractStatuses = new Set(["not_uploaded", "pending_user_confirmation", "confirmed", "rejected"]);
const revenueShareRiskStatuses = new Set(["normal", "warning", "paused", "terminated"]);
const revenueShareStatementStatuses = new Set(["submitted", "reviewing", "confirmed", "settled", "rejected"]);
const revenueShareVideoStatuses = new Set(["submitted", "reviewed", "invalid"]);
const revenueShareEvidenceStatuses = new Set(["pending", "approved", "rejected"]);
const revenueShareEvidenceTypes = new Set(["revenue_screenshot", "platform_statement", "analytics_screenshot", "other"]);

app.use(express.json());
app.use(cookieParser());
app.use(express.static(siteDir));
app.use("/admin", express.static(adminDir));
app.use("/downloads", express.static(downloadsDir));

function parseJsonList(value) {
  if (!value) return [];

  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

function parseOptionalInteger(value) {
  if (value === undefined || value === null || value === "") return null;

  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) return null;

  return number;
}

function parsePageNumber(value, fallback = 1) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) return fallback;
  return number;
}

function parsePageSize(value, fallback = 20, max = 100) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) return fallback;
  return Math.min(number, max);
}

function parseMoneyCents(value) {
  if (value === undefined || value === null || value === "") return null;

  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;

  return Math.round(number * 100);
}

function parseRequiredDate(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function parseStringList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  const raw = String(value || "").trim();
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item || "").trim()).filter(Boolean);
    }
  } catch {
    // Plain comma-separated input is also accepted.
  }

  return raw
    .split(/[,，、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePercentInteger(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;

  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number > 100) return fallback;

  return number;
}

function normalizePath(value) {
  return String(value || "").trim().replace(/^\/+/, "");
}

function normalizeEvidencePath(value) {
  return String(value || "").trim();
}

function sanitizeDownloadFileName(value, fallback = "download.docx") {
  const cleaned = String(value || "")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || fallback;
}

function getFileExtension(filePath, fallback = "docx") {
  return path.extname(String(filePath || "")).replace(".", "").toLowerCase() || fallback;
}

function ensureFileNameExtension(fileName, extension) {
  const expected = `.${extension}`;
  return fileName.toLowerCase().endsWith(expected) ? fileName : `${fileName}${expected}`;
}

function buildScriptAssetDownloadName(asset, script) {
  const extension = getFileExtension(asset.filePath, asset.fileFormat || "docx");
  const scriptTitle = script?.title || asset.title || "剧本";

  if (asset.assetType === "free_preview") {
    return ensureFileNameExtension(sanitizeDownloadFileName(`${scriptTitle}-前三集免费验证包`), extension);
  }

  return ensureFileNameExtension(sanitizeDownloadFileName(`${scriptTitle}-${asset.title || "剧本文件"}`), extension);
}

function formatDeliveryEpisodeScope(delivery) {
  const batch = delivery.revenueShareBatch;
  if (batch?.episodeStart && batch?.episodeEnd) {
    return `${batch.episodeStart}-${batch.episodeEnd}`;
  }

  const raw = String(delivery.continuationRequest?.episodeRange || "").trim();
  if (!raw) return "";

  return raw
    .replace(/^第/, "")
    .replace(/集$/g, "")
    .trim();
}

function buildDeliveryAssetDownloadName(asset, delivery) {
  const extension = getFileExtension(asset.filePath, asset.fileFormat || "docx");
  const scriptTitle = delivery.script?.title || "剧本";
  const scope = formatDeliveryEpisodeScope(delivery);

  if (delivery.deliveryType === "buyout") {
    return ensureFileNameExtension(sanitizeDownloadFileName(`${scriptTitle}-完整买断交付包`), extension);
  }

  if (delivery.deliveryType === "revenue_share") {
    const suffix = scope ? `第${scope}集分成合作交付包` : "分成合作交付包";
    return ensureFileNameExtension(sanitizeDownloadFileName(`${scriptTitle}-${suffix}`), extension);
  }

  if (delivery.deliveryType === "pay_per_episode") {
    const suffix = scope ? `第${scope}集按集购买交付包` : "按集购买交付包";
    return ensureFileNameExtension(sanitizeDownloadFileName(`${scriptTitle}-${suffix}`), extension);
  }

  return ensureFileNameExtension(sanitizeDownloadFileName(`${scriptTitle}-${asset.title || "交付文件"}`), extension);
}

function resolveDownloadFilePath(filePath) {
  const normalized = normalizePath(filePath);
  const absolutePath = path.resolve(__dirname, normalized);
  const downloadsRoot = path.resolve(downloadsDir);

  if (absolutePath !== downloadsRoot && !absolutePath.startsWith(`${downloadsRoot}${path.sep}`)) {
    const error = new Error("Invalid download file path");
    error.status = 400;
    throw error;
  }

  if (!fs.existsSync(absolutePath)) {
    const error = new Error("Download file not found");
    error.status = 404;
    throw error;
  }

  return absolutePath;
}

function getMimeType(fileFormat) {
  const format = String(fileFormat || "").toLowerCase();
  if (format === "docx") {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  if (format === "pdf") return "application/pdf";
  if (format === "zip") return "application/zip";
  if (format === "md") return "text/markdown; charset=utf-8";
  return "application/octet-stream";
}

function sendDownloadFile(response, filePath, downloadName, fileFormat) {
  const absolutePath = resolveDownloadFilePath(filePath);
  const safeName = sanitizeDownloadFileName(downloadName);
  const fallbackName = safeName.replace(/[^\x20-\x7E]/g, "_") || "download.docx";

  response.setHeader("Content-Type", getMimeType(fileFormat));
  response.setHeader(
    "Content-Disposition",
    `attachment; filename="${fallbackName}"; filename*=UTF-8''${encodeURIComponent(safeName)}`
  );
  response.sendFile(absolutePath);
}

function formatEpisodeScope(episodeRange) {
  const scope = String(episodeRange || "").trim();
  if (!scope) return "后续内容";
  if (scope.includes("集")) return scope;
  return `第${scope}集`;
}

function parseEpisodeNumbersInput(value) {
  const source = Array.isArray(value) ? value.join(",") : String(value || "");
  const normalized = source.replace(/[，、\s]+/g, ",");
  const numbers = new Set();

  normalized
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      const rangeMatch = part.match(/(\d+)\s*(?:-|~|至|到)\s*(\d+)/);
      if (rangeMatch) {
        const start = Number(rangeMatch[1]);
        const end = Number(rangeMatch[2]);
        if (Number.isInteger(start) && Number.isInteger(end)) {
          const min = Math.min(start, end);
          const max = Math.max(start, end);
          for (let episodeNumber = min; episodeNumber <= max; episodeNumber += 1) {
            numbers.add(episodeNumber);
          }
        }
        return;
      }

      (part.match(/\d+/g) || []).forEach((match) => {
        const episodeNumber = Number(match);
        if (Number.isInteger(episodeNumber)) {
          numbers.add(episodeNumber);
        }
      });
    });

  return Array.from(numbers).sort((a, b) => a - b);
}

function formatEpisodeNumbers(numbers) {
  const sorted = Array.from(new Set(numbers)).sort((a, b) => a - b);
  if (!sorted.length) return null;

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

function buildEpisodeSlots(script, unavailableEpisodeNumbers = new Set()) {
  const episodeMap = new Map((script.episodes || []).map((episode) => [episode.episodeNumber, episode]));
  const storedEpisodeNumbers = Array.from(episodeMap.keys());
  const maxEpisodeNumber = script.episodeCount || Math.max(0, ...storedEpisodeNumbers);
  const firstPaidEpisodeNumber = (script.freeEpisodeCount || 3) + 1;
  const episodes = [];

  for (let episodeNumber = firstPaidEpisodeNumber; episodeNumber <= maxEpisodeNumber; episodeNumber += 1) {
    const episode = episodeMap.get(episodeNumber);
    const disabled = unavailableEpisodeNumbers.has(episodeNumber);
    episodes.push({
      episodeNumber,
      title: episode?.title || `第${episodeNumber}集`,
      disabled,
      disabledReason: disabled ? "已申请或已购买" : null
    });
  }

  return episodes;
}

async function getContinuationRestrictions(userId, scriptIds) {
  if (!scriptIds.length) {
    return {
      exclusiveScriptIds: new Set(),
      unavailableEpisodeNumbersByScriptId: new Map()
    };
  }

  const [requests, orders] = await Promise.all([
    prisma.continuationRequest.findMany({
      where: {
        userId,
        scriptId: { in: scriptIds },
        status: { in: activeContinuationRequestStatuses }
      }
    }),
    prisma.order.findMany({
      where: {
        userId,
        scriptId: { in: scriptIds },
        status: { in: activeOrderStatuses }
      },
      include: {
        continuationRequest: true
      }
    })
  ]);

  const exclusiveScriptIds = new Set();
  const unavailableEpisodeNumbersByScriptId = new Map();

  const addUnavailableEpisodes = (scriptId, episodeRange) => {
    const episodeNumbers = parseEpisodeNumbersInput(episodeRange);
    if (!episodeNumbers.length) return;

    if (!unavailableEpisodeNumbersByScriptId.has(scriptId)) {
      unavailableEpisodeNumbersByScriptId.set(scriptId, new Set());
    }

    const target = unavailableEpisodeNumbersByScriptId.get(scriptId);
    episodeNumbers.forEach((episodeNumber) => target.add(episodeNumber));
  };

  requests.forEach((item) => {
    if (exclusiveContinuationTypes.includes(item.type)) {
      exclusiveScriptIds.add(item.scriptId);
      return;
    }

    if (item.type === "pay_per_episode") {
      addUnavailableEpisodes(item.scriptId, item.episodeRange);
    }
  });

  orders.forEach((item) => {
    if (exclusiveContinuationTypes.includes(item.orderType)) {
      exclusiveScriptIds.add(item.scriptId);
      return;
    }

    if (item.orderType === "pay_per_episode") {
      addUnavailableEpisodes(item.scriptId, item.continuationRequest?.episodeRange);
    }
  });

  return {
    exclusiveScriptIds,
    unavailableEpisodeNumbersByScriptId
  };
}

function buildOrderCopyDefaults(continuationRequest) {
  const scriptTitle = continuationRequest?.script?.title || "剧本名";
  const episodeScope = formatEpisodeScope(continuationRequest?.episodeRange);
  const type = continuationRequest?.type || "pay_per_episode";
  const commonPaymentNote =
    "请按照客服提供的收款方式完成付款。付款备注建议填写你的注册邮箱和剧本名称，便于后台核对。后台确认付款后，交付内容会开放到用户中心。";

  if (type === "buyout") {
    return {
      orderTitle: `《${scriptTitle}》完整买断订单`,
      orderUserVisibleNote: `你的买断申请已通过。本订单对应《${scriptTitle}》的完整后续内容交付，包含双方确认范围内的剧集正文、分镜和 AI 提示词。请按平台约定完成付款，付款确认后交付内容将在用户中心开放。`,
      paymentNote: commonPaymentNote,
      deliveryTitle: `《${scriptTitle}》完整买断交付包`,
      deliveryNote: `本交付包包含《${scriptTitle}》双方确认范围内的完整后续内容。请优先阅读使用说明和授权边界，再进行视频制作、发布和团队分发。未经额外约定，不得转售原始剧本文件、分镜文件或提示词资源包。`
    };
  }

  if (type === "revenue_share") {
    return {
      orderTitle: `《${scriptTitle}》版权分成合作确认单`,
      orderUserVisibleNote: `你的版权分成合作申请已通过。本合作无需预付剧本费用，后续将按照双方确认的收益口径和分成比例结算。请先确认合作范围、分成比例、结算周期和数据回传方式，确认后平台将开放后续制作内容。`,
      paymentNote: "本合作无需预付费用。请先与平台确认收益口径、分成比例、结算周期和数据回传方式。",
      deliveryTitle: `《${scriptTitle}》分成合作交付包`,
      deliveryNote: `本交付包用于版权分成合作场景。用户可按照双方确认范围制作后续内容，并需按约定周期回传播放、收益和账号数据。收益口径、分成比例、结算周期和退出机制应以双方确认的合作说明或正式协议为准。`
    };
  }

  return {
    orderTitle: `《${scriptTitle}》${episodeScope}按集购买订单`,
    orderUserVisibleNote: `你的按集购买申请已通过。本订单对应《${scriptTitle}》${episodeScope}内容。请按平台约定完成付款，付款确认后，对应剧集的正文、分镜和 AI 提示词将在用户中心开放。后续如需继续购买，可再次提交合作申请。`,
    paymentNote: commonPaymentNote,
    deliveryTitle: `《${scriptTitle}》${episodeScope}交付包`,
    deliveryNote: `本交付包仅包含《${scriptTitle}》${episodeScope}内容，授权范围仅覆盖本次购买剧集。请勿擅自续写、转售或分发未购买的后续内容。如本批次测试效果良好，可在用户中心继续提交后续合作申请。`
  };
}

function buildRevenueShareDeliveryDefaults(continuationRequest, episodeStart = 4, episodeEnd = 10) {
  const scriptTitle = continuationRequest?.script?.title || "剧本名";
  const scriptSlug = continuationRequest?.script?.slug || "script";
  const episodeScope = `第${episodeStart}-${episodeEnd}集`;

  return {
    deliveryTitle: `《${scriptTitle}》分成合作${episodeScope}交付包`,
    deliveryNote: `本交付包用于版权分成合作第一批内容，范围为《${scriptTitle}》${episodeScope}。请仅在双方确认的平台和账号中制作发布，并按月回传视频链接、收益数据和证明材料。`,
    assetTitle: `${episodeScope}分成合作交付文件`,
    assetPath: `downloads/${scriptSlug}/deliveries/revenue-share-episodes-${episodeStart}-${episodeEnd}-package-v1.docx`
  };
}

function formatDeliveryPathScope(episodeRange) {
  const scope = String(episodeRange || "continuation").trim().toLowerCase();
  return scope.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "continuation";
}

function buildDeliveryAssetDefaultsForRequest(continuationRequest, options = {}) {
  const slug = continuationRequest.script?.slug || "script";
  const type = continuationRequest.type || "pay_per_episode";

  if (type === "buyout") {
    return {
      title: "完整买断交付文件",
      filePath: `downloads/${slug}/deliveries/buyout-full-package-v1.docx`,
      fileFormat: "docx"
    };
  }

  if (type === "revenue_share") {
    const episodeStart = options.episodeStart || parseOptionalInteger(options.firstEpisodeNumber) || 4;
    const episodeEnd = options.episodeEnd || parseOptionalInteger(options.currentEpisodeEnd) || 10;
    const defaults = buildRevenueShareDeliveryDefaults(continuationRequest, episodeStart, episodeEnd);
    return {
      title: defaults.assetTitle,
      filePath: defaults.assetPath,
      fileFormat: "docx"
    };
  }

  return {
    title: `${formatEpisodeScope(continuationRequest.episodeRange)}交付文件`,
    filePath: `downloads/${slug}/deliveries/episodes-${formatDeliveryPathScope(continuationRequest.episodeRange)}-package-v1.docx`,
    fileFormat: "docx"
  };
}

function buildDeliveryGenerationOptions(continuationRequest, options = {}) {
  const script = continuationRequest.script || {};
  const type = continuationRequest.type || "pay_per_episode";
  const freeEpisodeCount = script.freeEpisodeCount || 3;
  const maxEpisodeNumber = script.episodeCount || freeEpisodeCount;

  if (type === "buyout") {
    return {
      deliveryType: type,
      episodeStart: freeEpisodeCount + 1,
      episodeEnd: maxEpisodeNumber
    };
  }

  if (type === "revenue_share") {
    return {
      deliveryType: type,
      episodeStart: parseOptionalInteger(options.episodeStart ?? options.firstEpisodeNumber) || 4,
      episodeEnd: parseOptionalInteger(options.episodeEnd ?? options.currentEpisodeEnd) || 10
    };
  }

  const episodeNumbers = parseEpisodeNumbersInput(options.episodeNumbers || continuationRequest.episodeRange);
  return {
    deliveryType: type,
    episodeNumbers,
    episodeStart: episodeNumbers[0] || freeEpisodeCount + 1,
    episodeEnd: episodeNumbers[episodeNumbers.length - 1] || freeEpisodeCount + 1
  };
}

async function loadDeliveryScriptData(scriptId) {
  const script = await prisma.script.findUnique({
    where: { id: scriptId },
    include: {
      episodes: {
        orderBy: { episodeNumber: "asc" }
      }
    }
  });

  if (!script) {
    const error = new Error("Script not found for delivery generation");
    error.status = 404;
    throw error;
  }

  const sourcePath = path.join(scriptsDataDir, `${script.slug}.json`);
  if (fs.existsSync(sourcePath)) {
    try {
      const sourceData = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
      if (sourceData?.script?.slug === script.slug && Array.isArray(sourceData.episodes)) {
        return {
          ...sourceData,
          script: {
            ...sourceData.script,
            id: script.id,
            slug: script.slug,
            title: script.title,
            titleEn: script.titleEn || sourceData.script.titleEn,
            logline: script.logline || sourceData.script.logline,
            synopsis: script.synopsis || sourceData.script.synopsis,
            category: script.category || sourceData.script.category,
            coverImage: script.coverImage || sourceData.script.coverImage,
            status: script.status,
            featured: script.featured,
            productionDifficulty: script.productionDifficulty || sourceData.script.productionDifficulty,
            episodeCount: script.episodeCount || sourceData.script.episodeCount,
            freeEpisodeCount: script.freeEpisodeCount || sourceData.script.freeEpisodeCount || 3
          }
        };
      }
    } catch (error) {
      console.warn(`Failed to read complete script data for ${script.slug}:`, error.message);
    }
  }

  return {
    script,
    episodes: script.episodes
  };
}

async function regenerateDeliveryAssetForDownload(asset) {
  const delivery = asset.delivery;
  const scriptSlug = delivery.script?.slug || "";
  const filePath = normalizePath(asset.filePath);
  const fileFormat = String(asset.fileFormat || filePath.split(".").pop() || "").toLowerCase();
  const deliveryDirPrefix = `downloads/${scriptSlug}/deliveries/`;

  if (!scriptSlug || fileFormat !== "docx" || !filePath.startsWith(deliveryDirPrefix)) {
    return;
  }

  const continuationRequest = delivery.continuationRequest
    ? {
        ...delivery.continuationRequest,
        script: delivery.script
      }
    : {
        type: delivery.deliveryType,
        episodeRange: "",
        script: delivery.script
      };
  const generationOptions = buildDeliveryGenerationOptions(continuationRequest, {
    episodeStart: delivery.revenueShareBatch?.episodeStart,
    episodeEnd: delivery.revenueShareBatch?.episodeEnd
  });
  const scriptData = await loadDeliveryScriptData(delivery.scriptId);
  const generated = await generateContinuationDeliveryPackage(scriptData, {
    ...generationOptions,
    outputRelativePath: filePath,
    deliveryNote: delivery.note || undefined
  });

  if (generated.bytes && generated.bytes !== asset.fileSize) {
    await prisma.deliveryAsset.update({
      where: { id: asset.id },
      data: { fileSize: generated.bytes }
    });
    asset.fileSize = generated.bytes;
  }
}

async function ensureDeliveryAssetsForRequest(continuationRequest, assets, options = {}) {
  const requestedAssets = Array.isArray(assets) ? assets : [];
  const normalizedAssets = requestedAssets
    .map((asset) => ({
      title: String(asset.title || "").trim(),
      filePath: normalizePath(asset.filePath),
      fileFormat: String(asset.fileFormat || "").trim() || "docx",
      fileSize: parseOptionalInteger(asset.fileSize),
      sortOrder: parseOptionalInteger(asset.sortOrder)
    }))
    .filter((asset) => asset.filePath);

  const deliveryAssets = normalizedAssets.length
    ? normalizedAssets
    : [buildDeliveryAssetDefaultsForRequest(continuationRequest, options)];
  const generationOptions = buildDeliveryGenerationOptions(continuationRequest, options);
  const scriptSlug = continuationRequest.script?.slug || "script";
  const deliveryDirPrefix = `downloads/${scriptSlug}/deliveries/`;
  let scriptData = null;

  const preparedAssets = [];
  for (let index = 0; index < deliveryAssets.length; index += 1) {
    const asset = deliveryAssets[index];
    const filePath = normalizePath(asset.filePath);
    const fileFormat = String(asset.fileFormat || filePath.split(".").pop() || "docx").trim() || "docx";

    if (fileFormat === "docx" && filePath.startsWith(deliveryDirPrefix)) {
      scriptData = scriptData || (await loadDeliveryScriptData(continuationRequest.scriptId));
      const generated = await generateContinuationDeliveryPackage(scriptData, {
        ...generationOptions,
        outputRelativePath: filePath,
        deliveryNote: options.deliveryNote
      });
      asset.fileSize = generated.bytes;
    } else {
      const absolutePath = path.resolve(__dirname, filePath);
      if (!asset.fileSize && fs.existsSync(absolutePath)) {
        asset.fileSize = fs.statSync(absolutePath).size;
      }
    }

    preparedAssets.push({
      title: asset.title || `交付资源 ${index + 1}`,
      filePath,
      fileFormat,
      fileSize: asset.fileSize,
      sortOrder: asset.sortOrder ?? index
    });
  }

  return preparedAssets;
}

function buildRevenueShareProjectInclude() {
  return {
    user: true,
    script: true,
    continuationRequest: true,
    batches: {
      include: {
        delivery: {
          include: {
            assets: {
              orderBy: { sortOrder: "asc" }
            }
          }
        }
      },
      orderBy: { batchNumber: "asc" }
    },
    statements: {
      include: {
        videos: {
          orderBy: { createdAt: "asc" }
        },
        evidence: {
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 5
    }
  };
}

function toRevenueShareVideoResponse(video) {
  return {
    id: video.id,
    projectId: video.projectId,
    statementId: video.statementId,
    batchId: video.batchId,
    episodeNumber: video.episodeNumber,
    title: video.title,
    videoUrl: video.videoUrl,
    platform: video.platform,
    accountName: video.accountName,
    publishedAt: video.publishedAt,
    viewCount: video.viewCount,
    likeCount: video.likeCount,
    commentCount: video.commentCount,
    reportedRevenueCents: video.reportedRevenueCents,
    revenueType: video.revenueType,
    status: video.status,
    note: video.note,
    adminNote: video.adminNote,
    createdAt: video.createdAt,
    updatedAt: video.updatedAt
  };
}

function toRevenueShareEvidenceResponse(evidence) {
  return {
    id: evidence.id,
    projectId: evidence.projectId,
    statementId: evidence.statementId,
    videoId: evidence.videoId,
    evidenceType: evidence.evidenceType,
    filePath: evidence.filePath,
    originalFileName: evidence.originalFileName,
    uploadedBy: evidence.uploadedBy,
    reviewStatus: evidence.reviewStatus,
    adminNote: evidence.adminNote,
    createdAt: evidence.createdAt
  };
}

function toRevenueShareStatementResponse(statement) {
  return {
    id: statement.id,
    projectId: statement.projectId,
    userId: statement.userId,
    scriptId: statement.scriptId,
    periodStart: statement.periodStart,
    periodEnd: statement.periodEnd,
    status: statement.status,
    reportedRevenueCents: statement.reportedRevenueCents,
    confirmedRevenueCents: statement.confirmedRevenueCents,
    platformShareRatio: statement.platformShareRatio,
    platformShareCents: statement.platformShareCents,
    userShareCents: statement.userShareCents,
    videoCount: statement.videoCount,
    evidenceCount: statement.evidenceCount,
    userNote: statement.userNote,
    adminNote: statement.adminNote,
    settlementProofPath: statement.settlementProofPath,
    paymentReference: statement.paymentReference,
    submittedAt: statement.submittedAt,
    reviewedAt: statement.reviewedAt,
    paidAt: statement.paidAt,
    createdAt: statement.createdAt,
    updatedAt: statement.updatedAt,
    user: statement.user ? sanitizeUser(statement.user) : null,
    script: statement.script
      ? {
          id: statement.script.id,
          slug: statement.script.slug,
          title: statement.script.title,
          category: statement.script.category
        }
      : null,
    project: statement.project
      ? {
          id: statement.project.id,
          status: statement.project.status,
          shareRatioPlatform: statement.project.shareRatioPlatform,
          shareRatioUser: statement.project.shareRatioUser,
          authorizedPlatforms: parseJsonList(statement.project.authorizedPlatforms),
          authorizedAccounts: parseJsonList(statement.project.authorizedAccounts)
        }
      : null,
    videos: (statement.videos || []).map(toRevenueShareVideoResponse),
    evidence: (statement.evidence || []).map(toRevenueShareEvidenceResponse)
  };
}

function toRevenueShareProjectResponse(project) {
  return {
    id: project.id,
    status: project.status,
    contractStatus: project.contractStatus,
    contractFilePath: project.contractFilePath,
    shareRatioPlatform: project.shareRatioPlatform,
    shareRatioUser: project.shareRatioUser,
    settlementCycle: project.settlementCycle,
    authorizedPlatforms: parseJsonList(project.authorizedPlatforms),
    authorizedAccounts: parseJsonList(project.authorizedAccounts),
    revenueDefinition: project.revenueDefinition,
    firstEpisodeNumber: project.firstEpisodeNumber,
    currentEpisodeEnd: project.currentEpisodeEnd,
    riskStatus: project.riskStatus,
    adminNote: project.adminNote,
    userVisibleNote: project.userVisibleNote,
    startedAt: project.startedAt,
    endedAt: project.endedAt,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    user: project.user ? sanitizeUser(project.user) : null,
    script: project.script
      ? {
          id: project.script.id,
          slug: project.script.slug,
          title: project.script.title,
          category: project.script.category
        }
      : null,
    continuationRequest: project.continuationRequest
      ? {
          id: project.continuationRequest.id,
          type: project.continuationRequest.type,
          status: project.continuationRequest.status
        }
      : null,
    batches: (project.batches || []).map((batch) => ({
      id: batch.id,
      batchNumber: batch.batchNumber,
      episodeStart: batch.episodeStart,
      episodeEnd: batch.episodeEnd,
      status: batch.status,
      releaseCondition: batch.releaseCondition,
      lockedReason: batch.lockedReason,
      releasedAt: batch.releasedAt,
      delivery: batch.delivery
        ? {
            id: batch.delivery.id,
            title: batch.delivery.title,
            status: batch.delivery.status,
            assetCount: batch.delivery.assets?.length || 0
          }
        : null
    })),
    statements: (project.statements || []).map(toRevenueShareStatementResponse)
  };
}

function toAdminRevenueShareProjectResponse(project) {
  return toRevenueShareProjectResponse(project);
}

async function createRevenueShareProjectForRequest(continuationRequest, body = {}) {
  if (continuationRequest.type !== "revenue_share") {
    const error = new Error("Revenue share project can only be created for revenue-share requests");
    error.status = 400;
    throw error;
  }

  const existingProject = await prisma.revenueShareProject.findFirst({
    where: {
      continuationRequestId: continuationRequest.id,
      status: {
        in: ["draft", "pending_contract", "active", "paused"]
      }
    }
  });

  if (existingProject) {
    const error = new Error("Revenue share project already exists for this request");
    error.status = 409;
    throw error;
  }

  const firstEpisodeNumber = parseOptionalInteger(body.firstEpisodeNumber) || 4;
  const currentEpisodeEnd = parseOptionalInteger(body.currentEpisodeEnd) || 10;
  const maxEpisodeNumber = continuationRequest.script.episodeCount || currentEpisodeEnd;
  const freeEpisodeCount = continuationRequest.script.freeEpisodeCount || 3;

  if (
    firstEpisodeNumber <= freeEpisodeCount ||
    currentEpisodeEnd < firstEpisodeNumber ||
    currentEpisodeEnd > maxEpisodeNumber
  ) {
    const error = new Error("Invalid revenue share first batch episode range");
    error.status = 400;
    throw error;
  }

  const shareRatioPlatform = parsePercentInteger(body.shareRatioPlatform, 30);
  const shareRatioUser = parsePercentInteger(body.shareRatioUser, 100 - shareRatioPlatform);
  if (shareRatioPlatform + shareRatioUser !== 100) {
    const error = new Error("Revenue share ratios must add up to 100");
    error.status = 400;
    throw error;
  }

  const contractStatus = String(body.contractStatus || "not_uploaded").trim();
  if (!revenueShareContractStatuses.has(contractStatus)) {
    const error = new Error("Invalid revenue share contract status");
    error.status = 400;
    throw error;
  }

  const authorizedPlatforms = parseStringList(body.authorizedPlatforms);
  const authorizedAccounts = parseStringList(body.authorizedAccounts);
  const defaults = buildRevenueShareDeliveryDefaults(continuationRequest, firstEpisodeNumber, currentEpisodeEnd);
  const deliveryTitle = String(body.deliveryTitle || "").trim() || defaults.deliveryTitle;
  const deliveryNote = String(body.deliveryNote || "").trim() || defaults.deliveryNote;
  const assetPath = normalizePath(body.assetPath || body.deliveryAssetPath || defaults.assetPath);
  const assetTitle = String(body.assetTitle || "").trim() || defaults.assetTitle;
  const preparedAssets = await ensureDeliveryAssetsForRequest(
    continuationRequest,
    assetPath
      ? [
          {
            title: assetTitle,
            filePath: assetPath,
            fileFormat: assetPath.split(".").pop() || "docx"
          }
        ]
      : [],
    {
      episodeStart: firstEpisodeNumber,
      episodeEnd: currentEpisodeEnd,
      deliveryNote
    }
  );

  const createdProject = await prisma.$transaction(async (tx) => {
    const project = await tx.revenueShareProject.create({
      data: {
        userId: continuationRequest.userId,
        scriptId: continuationRequest.scriptId,
        continuationRequestId: continuationRequest.id,
        status: String(body.projectStatus || "active").trim() || "active",
        contractStatus,
        contractFilePath: normalizePath(body.contractFilePath) || null,
        shareRatioPlatform,
        shareRatioUser,
        settlementCycle: String(body.settlementCycle || "monthly").trim() || "monthly",
        authorizedPlatforms: JSON.stringify(authorizedPlatforms),
        authorizedAccounts: JSON.stringify(authorizedAccounts),
        revenueDefinition: String(body.revenueDefinition || "").trim() || null,
        firstEpisodeNumber,
        currentEpisodeEnd,
        riskStatus: "normal",
        adminNote: String(body.projectAdminNote || "").trim() || null,
        userVisibleNote:
          String(body.projectUserVisibleNote || body.userVisibleNote || "").trim() ||
          "版权分成合作已通过，平台已开放第一批后续内容。请按约定账号发布，并按月回传视频和收益数据。",
        startedAt: new Date()
      }
    });

    const delivery = await tx.delivery.create({
      data: {
        userId: continuationRequest.userId,
        scriptId: continuationRequest.scriptId,
        continuationRequestId: continuationRequest.id,
        deliveryType: "revenue_share",
        title: deliveryTitle,
        note: deliveryNote,
        status: "ready",
        assets: {
          create: preparedAssets
        }
      }
    });

    await tx.revenueShareBatch.create({
      data: {
        projectId: project.id,
        deliveryId: delivery.id,
        batchNumber: 1,
        episodeStart: firstEpisodeNumber,
        episodeEnd: currentEpisodeEnd,
        status: "released",
        releaseCondition: "First revenue-share batch is released after admin approval.",
        releasedAt: new Date()
      }
    });

    return tx.revenueShareProject.findUnique({
      where: { id: project.id },
      include: buildRevenueShareProjectInclude()
    });
  });

  return createdProject;
}

function toContinuationRequestResponse(request) {
  return {
    id: request.id,
    type: request.type,
    episodeRange: request.episodeRange,
    message: request.message,
    contactPreference: request.contactPreference,
    status: request.status,
    userVisibleNote: request.userVisibleNote,
    reviewedAt: request.reviewedAt,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    script: {
      id: request.script.id,
      slug: request.script.slug,
      title: request.script.title,
      category: request.script.category,
      episodeCount: request.script.episodeCount,
      freeEpisodeCount: request.script.freeEpisodeCount
    },
    downloadId: request.downloadId,
    testReportId: request.testReportId,
    deliveries: (request.deliveries || []).map((delivery) => ({
      id: delivery.id,
      title: delivery.title,
      status: delivery.status,
      assetCount: delivery.assets?.length || 0
    })),
    orders: (request.orders || []).map((order) => ({
      id: order.id,
      title: order.title,
      amountCents: order.amountCents,
      currency: order.currency,
      status: order.status
    })),
    revenueShareProjects: (request.revenueShareProjects || []).map((project) => ({
      id: project.id,
      status: project.status,
      contractStatus: project.contractStatus,
      currentEpisodeEnd: project.currentEpisodeEnd,
      riskStatus: project.riskStatus
    }))
  };
}

function toAdminContinuationRequestResponse(request) {
  return {
    id: request.id,
    type: request.type,
    episodeRange: request.episodeRange,
    message: request.message,
    contactPreference: request.contactPreference,
    status: request.status,
    adminNote: request.adminNote,
    userVisibleNote: request.userVisibleNote,
    reviewedAt: request.reviewedAt,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    user: sanitizeUser(request.user),
    script: {
      id: request.script.id,
      slug: request.script.slug,
      title: request.script.title,
      category: request.script.category,
      episodeCount: request.script.episodeCount,
      freeEpisodeCount: request.script.freeEpisodeCount
    },
    download: request.download
      ? {
          id: request.download.id,
          createdAt: request.download.createdAt,
          visitorId: request.download.visitorId
        }
      : null,
    testReport: request.testReport
      ? {
          id: request.testReport.id,
          platform: request.testReport.platform,
          videoUrl: request.testReport.videoUrl,
          viewCount: request.testReport.viewCount,
          likeCount: request.testReport.likeCount,
          commentCount: request.testReport.commentCount,
          followerDelta: request.testReport.followerDelta,
          status: request.testReport.status
        }
      : null,
    deliveries: (request.deliveries || []).map(toDeliveryResponse),
    orders: (request.orders || []).map(toOrderResponse),
    revenueShareProjects: (request.revenueShareProjects || []).map(toAdminRevenueShareProjectResponse)
  };
}

function toDeliveryResponse(delivery) {
  return {
    id: delivery.id,
    deliveryType: delivery.deliveryType,
    title: delivery.title,
    note: delivery.note,
    status: delivery.status,
    createdAt: delivery.createdAt,
    updatedAt: delivery.updatedAt,
    script: delivery.script
      ? {
          id: delivery.script.id,
          slug: delivery.script.slug,
          title: delivery.script.title,
          category: delivery.script.category
        }
      : null,
    continuationRequest: delivery.continuationRequest
      ? {
          id: delivery.continuationRequest.id,
          type: delivery.continuationRequest.type,
          status: delivery.continuationRequest.status
        }
      : null,
    order: delivery.order
      ? {
          id: delivery.order.id,
          title: delivery.order.title,
          amountCents: delivery.order.amountCents,
          currency: delivery.order.currency,
          status: delivery.order.status
        }
      : null,
    assets: (delivery.assets || []).map((asset) => ({
      id: asset.id,
      title: asset.title,
      filePath: asset.filePath,
      fileFormat: asset.fileFormat,
      fileSize: asset.fileSize,
      downloadUrl: `/api/download-files/delivery-assets/${asset.id}`,
      sortOrder: asset.sortOrder
    }))
  };
}

function toOrderResponse(order) {
  return {
    id: order.id,
    orderType: order.orderType,
    title: order.title,
    amountCents: order.amountCents,
    currency: order.currency,
    status: order.status,
    paymentNote: order.paymentNote,
    adminNote: order.adminNote,
    userVisibleNote: order.userVisibleNote,
    paidAt: order.paidAt,
    deliveredAt: order.deliveredAt,
    cancelledAt: order.cancelledAt,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    user: order.user ? sanitizeUser(order.user) : null,
    script: order.script
      ? {
          id: order.script.id,
          slug: order.script.slug,
          title: order.script.title,
          category: order.script.category
        }
      : null,
    continuationRequest: order.continuationRequest
      ? {
          id: order.continuationRequest.id,
          type: order.continuationRequest.type,
          status: order.continuationRequest.status
        }
      : null,
    deliveries: (order.deliveries || []).map((delivery) => ({
      id: delivery.id,
      title: delivery.title,
      status: delivery.status,
      assetCount: delivery.assets?.length || 0
    }))
  };
}

function toAdminTestReportResponse(report) {
  return {
    id: report.id,
    platform: report.platform,
    videoUrl: report.videoUrl,
    viewCount: report.viewCount,
    likeCount: report.likeCount,
    commentCount: report.commentCount,
    followerDelta: report.followerDelta,
    publishTime: report.publishTime,
    notes: report.notes,
    status: report.status,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    user: sanitizeUser(report.user),
    script: {
      id: report.script.id,
      slug: report.script.slug,
      title: report.script.title,
      category: report.script.category
    },
    download: report.download
      ? {
          id: report.download.id,
          createdAt: report.download.createdAt,
          visitorId: report.download.visitorId
        }
      : null,
    continuationRequests: report.continuationRequests.map((request) => ({
      id: request.id,
      type: request.type,
      status: request.status,
      createdAt: request.createdAt
    }))
  };
}

function toAdminDownloadResponse(download) {
  return {
    id: download.id,
    visitorId: download.visitorId,
    ipAddress: download.ipAddress,
    userAgent: download.userAgent,
    referrer: download.referrer,
    licenseConfirmed: download.licenseConfirmed,
    createdAt: download.createdAt,
    user: download.user ? sanitizeUser(download.user) : null,
    script: {
      id: download.script.id,
      slug: download.script.slug,
      title: download.script.title,
      category: download.script.category
    },
    asset: {
      id: download.asset.id,
      assetType: download.asset.assetType,
      title: download.asset.title,
      version: download.asset.version,
      filePath: download.asset.filePath,
      fileFormat: download.asset.fileFormat
    },
    testReportCount: download._count?.testReports || 0,
    continuationRequestCount: download._count?.continuationRequests || 0
  };
}

function toAdminUserResponse(user) {
  return {
    ...sanitizeUser(user),
    updatedAt: user.updatedAt,
    counts: {
      downloads: user._count?.downloads || 0,
      testReports: user._count?.testReports || 0,
      continuationRequests: user._count?.continuationRequests || 0
    }
  };
}

function toAdminScriptResponse(script) {
  return {
    id: script.id,
    slug: script.slug,
    title: script.title,
    titleEn: script.titleEn,
    logline: script.logline,
    synopsis: script.synopsis,
    category: script.category,
    coverImage: script.coverImage,
    status: script.status,
    featured: script.featured,
    productionDifficulty: script.productionDifficulty,
    episodeCount: script.episodeCount,
    freeEpisodeCount: script.freeEpisodeCount,
    createdAt: script.createdAt,
    updatedAt: script.updatedAt,
    counts: {
      assets: script._count?.assets || 0,
      episodes: script._count?.episodes || 0,
      downloads: script._count?.downloads || 0,
      testReports: script._count?.testReports || 0,
      continuationRequests: script._count?.continuationRequests || 0
    }
  };
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    contactWechat: user.contactWechat,
    contactPhone: user.contactPhone,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt
  };
}

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 30
  };
}

function createSessionToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role
    },
    authJwtSecret,
    { expiresIn: "30d" }
  );
}

async function getCurrentUser(request) {
  const token = request.cookies?.[authCookieName];
  if (!token) return null;

  try {
    const payload = jwt.verify(token, authJwtSecret);
    if (!payload?.sub) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub }
    });

    if (!user || user.status !== "active") {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

function setSessionCookie(response, user) {
  response.cookie(authCookieName, createSessionToken(user), getCookieOptions());
}

function clearSessionCookie(response) {
  response.clearCookie(authCookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

async function requireAuth(request, response, next) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      response.status(401).json({ error: "Authentication required" });
      return;
    }

    request.currentUser = user;
    next();
  } catch (error) {
    next(error);
  }
}

async function requireAdmin(request, response, next) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      response.status(401).json({ error: "Authentication required" });
      return;
    }

    if (user.role !== "admin") {
      response.status(403).json({ error: "Admin permission required" });
      return;
    }

    request.currentUser = user;
    next();
  } catch (error) {
    next(error);
  }
}

function requireDeleteConfirmation(request, response) {
  if (request.body?.confirmDelete === true) {
    return true;
  }

  response.status(400).json({ error: "Delete confirmation is required" });
  return false;
}

function toScriptCard(script) {
  return {
    id: script.id,
    slug: script.slug,
    title: script.title,
    titleEn: script.titleEn,
    logline: script.logline,
    synopsis: script.synopsis,
    category: script.category,
    coverImage: script.coverImage,
    status: script.status,
    featured: script.featured,
    recommendedPlatforms: parseJsonList(script.recommendedPlatforms),
    audienceTags: parseJsonList(script.audienceTags),
    productionDifficulty: script.productionDifficulty,
    episodeCount: script.episodeCount,
    freeEpisodeCount: script.freeEpisodeCount
  };
}

function toScriptDetail(script) {
  return {
    ...toScriptCard(script),
    assets: script.assets.map((asset) => ({
      id: asset.id,
      assetType: asset.assetType,
      title: asset.title,
      version: asset.version,
      filePath: asset.filePath,
      fileFormat: asset.fileFormat,
      fileSize: asset.fileSize,
      downloadUrl: `/api/download-files/script-assets/${asset.id}`,
      isPublic: asset.isPublic,
      status: asset.status
    })),
    episodes: script.episodes.map((episode) => ({
      id: episode.id,
      episodeNumber: episode.episodeNumber,
      title: episode.title,
      hook: episode.hook,
      summary: episode.summary,
      endingHook: episode.endingHook,
      aiPromptZh: episode.aiPromptZh,
      aiPromptEn: episode.aiPromptEn,
      isFreePreview: episode.isFreePreview,
      status: episode.status
    })),
    continuationOptions: script.continuationOptions.map((option) => ({
      id: option.id,
      type: option.type,
      title: option.title,
      description: option.description,
      startingPrice: option.startingPrice,
      enabled: option.enabled,
      sortOrder: option.sortOrder
    }))
  };
}

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.post("/api/auth/register", async (request, response, next) => {
  try {
    const email = normalizeEmail(request.body.email);
    const password = String(request.body.password || "");
    const displayName = String(request.body.displayName || "").trim() || null;
    const contactWechat = String(request.body.contactWechat || "").trim() || null;
    const contactPhone = String(request.body.contactPhone || "").trim() || null;

    if (!isValidEmail(email)) {
      response.status(400).json({ error: "A valid email is required" });
      return;
    }

    if (password.length < 8) {
      response.status(400).json({ error: "Password must be at least 8 characters" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      response.status(409).json({ error: "Email is already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName,
        contactWechat,
        contactPhone
      }
    });

    setSessionCookie(response, user);
    response.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/login", async (request, response, next) => {
  try {
    const email = normalizeEmail(request.body.email);
    const password = String(request.body.password || "");
    const loginError = { error: "Email or password is incorrect" };

    if (!isValidEmail(email) || !password) {
      response.status(401).json(loginError);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.status !== "active") {
      response.status(401).json(loginError);
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      response.status(401).json(loginError);
      return;
    }

    setSessionCookie(response, user);
    response.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/logout", (_request, response) => {
  clearSessionCookie(response);
  response.json({ ok: true });
});

app.get("/api/me", async (request, response, next) => {
  try {
    const user = await getCurrentUser(request);
    response.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/me", requireAdmin, (request, response) => {
  response.json({ user: sanitizeUser(request.currentUser) });
});

app.get("/api/admin/overview", requireAdmin, async (_request, response, next) => {
  try {
    const [
      publishedScriptCount,
      draftScriptCount,
      userCount,
      downloadCount,
      testReportCount,
      pendingTestReportCount,
      continuationRequestCount,
      pendingContinuationRequestCount,
      revenueShareStatementCount,
      pendingRevenueShareStatementCount
    ] = await Promise.all([
      prisma.script.count({ where: { status: "published" } }),
      prisma.script.count({ where: { status: "draft" } }),
      prisma.user.count(),
      prisma.download.count(),
      prisma.testReport.count(),
      prisma.testReport.count({ where: { status: "submitted" } }),
      prisma.continuationRequest.count(),
      prisma.continuationRequest.count({ where: { status: "submitted" } }),
      prisma.revenueShareStatement.count(),
      prisma.revenueShareStatement.count({ where: { status: "submitted" } })
    ]);

    const [recentDownloads, recentTestReports, recentContinuationRequests] = await Promise.all([
      prisma.download.findMany({
        take: 5,
        include: {
          script: true,
          user: true
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.testReport.findMany({
        take: 5,
        include: {
          script: true,
          user: true
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.continuationRequest.findMany({
        take: 5,
        include: {
          script: true,
          user: true
        },
        orderBy: { createdAt: "desc" }
      })
    ]);

    response.json({
      metrics: {
        publishedScriptCount,
        draftScriptCount,
        userCount,
        downloadCount,
        testReportCount,
        pendingTestReportCount,
        continuationRequestCount,
        pendingContinuationRequestCount,
        revenueShareStatementCount,
        pendingRevenueShareStatementCount
      },
      recentDownloads: recentDownloads.map((download) => ({
        id: download.id,
        createdAt: download.createdAt,
        visitorId: download.visitorId,
        user: download.user ? sanitizeUser(download.user) : null,
        script: {
          id: download.script.id,
          slug: download.script.slug,
          title: download.script.title,
          category: download.script.category
        }
      })),
      recentTestReports: recentTestReports.map((report) => ({
        id: report.id,
        platform: report.platform,
        videoUrl: report.videoUrl,
        viewCount: report.viewCount,
        likeCount: report.likeCount,
        commentCount: report.commentCount,
        followerDelta: report.followerDelta,
        status: report.status,
        createdAt: report.createdAt,
        user: sanitizeUser(report.user),
        script: {
          id: report.script.id,
          slug: report.script.slug,
          title: report.script.title,
          category: report.script.category
        }
      })),
      recentContinuationRequests: recentContinuationRequests.map((request) => ({
        id: request.id,
        type: request.type,
        episodeRange: request.episodeRange,
        contactPreference: request.contactPreference,
        status: request.status,
        createdAt: request.createdAt,
        user: sanitizeUser(request.user),
        script: {
          id: request.script.id,
          slug: request.script.slug,
          title: request.script.title,
          category: request.script.category
        }
      })),
      allowedStatuses: {
        testReports: Array.from(testReportStatuses),
        continuationRequests: Array.from(continuationRequestStatuses)
      }
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/continuation-requests", requireAdmin, async (request, response, next) => {
  try {
    const page = parsePageNumber(request.query.page);
    const pageSize = parsePageSize(request.query.pageSize);
    const status = String(request.query.status || "").trim();
    const type = String(request.query.type || "").trim();
    const q = String(request.query.q || "").trim();

    if (status && !continuationRequestStatuses.has(status)) {
      response.status(400).json({ error: "Invalid continuation request status" });
      return;
    }

    if (type && !continuationRequestTypes.has(type)) {
      response.status(400).json({ error: "Invalid continuation request type" });
      return;
    }

    const where = {
      ...(status ? { status } : {}),
      ...(type ? { type } : {}),
      ...(q
        ? {
            OR: [
              { message: { contains: q } },
              { episodeRange: { contains: q } },
              { contactPreference: { contains: q } },
              { script: { title: { contains: q } } },
              { script: { slug: { contains: q } } },
              { user: { email: { contains: q } } },
              { user: { displayName: { contains: q } } }
            ]
          }
        : {})
    };

    const [total, requests] = await Promise.all([
      prisma.continuationRequest.count({ where }),
      prisma.continuationRequest.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: true,
          script: true,
          download: true,
          testReport: true,
          orders: {
            include: {
              user: true,
              script: true,
              continuationRequest: true,
              deliveries: {
                include: {
                  assets: true
                }
              }
            },
            orderBy: { createdAt: "desc" }
          },
          deliveries: {
            include: {
              script: true,
              continuationRequest: true,
              order: true,
              assets: {
                orderBy: { sortOrder: "asc" }
              }
            },
            orderBy: { createdAt: "desc" }
          },
          revenueShareProjects: {
            include: buildRevenueShareProjectInclude(),
            orderBy: { createdAt: "desc" }
          }
        },
        orderBy: { createdAt: "desc" }
      })
    ]);

    response.json({
      items: requests.map(toAdminContinuationRequestResponse),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      allowedStatuses: Array.from(continuationRequestStatuses),
      allowedTypes: Array.from(continuationRequestTypes)
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/admin/continuation-requests/:id", requireAdmin, async (request, response, next) => {
  try {
    const status = String(request.body.status || "").trim();
    const adminNote = Object.hasOwn(request.body, "adminNote")
      ? String(request.body.adminNote || "").trim() || null
      : undefined;
    const userVisibleNote = Object.hasOwn(request.body, "userVisibleNote")
      ? String(request.body.userVisibleNote || "").trim() || null
      : undefined;

    if (!continuationRequestStatuses.has(status)) {
      response.status(400).json({ error: "Invalid continuation request status" });
      return;
    }

    const existingRequest = await prisma.continuationRequest.findUnique({
      where: { id: request.params.id }
    });

    if (!existingRequest) {
      response.status(404).json({ error: "Continuation request not found" });
      return;
    }

    const updateData = {
      status,
      ...(adminNote !== undefined ? { adminNote } : {}),
      ...(userVisibleNote !== undefined ? { userVisibleNote } : {}),
      ...(status !== existingRequest.status ? { reviewedAt: new Date() } : {})
    };

    if (request.body.createDelivery === true && status !== "approved") {
      response.status(400).json({ error: "Delivery can only be created after approval" });
      return;
    }

    const updatedRequest = await prisma.continuationRequest.update({
      where: { id: existingRequest.id },
      data: updateData,
      include: {
        user: true,
        script: true,
        download: true,
        testReport: true,
        orders: {
          include: {
            user: true,
            script: true,
            continuationRequest: true,
            deliveries: {
              include: {
                assets: true
              }
            }
          },
          orderBy: { createdAt: "desc" }
        },
        deliveries: {
          include: {
            script: true,
            continuationRequest: true,
            order: true,
            assets: {
              orderBy: { sortOrder: "asc" }
            }
          },
          orderBy: { createdAt: "desc" }
        },
        revenueShareProjects: {
          include: buildRevenueShareProjectInclude(),
          orderBy: { createdAt: "desc" }
        }
      }
    });

    const orderCopyDefaults = buildOrderCopyDefaults(updatedRequest);

    let createdRevenueShareProject = null;
    if (request.body.createRevenueShareProject === true) {
      if (status !== "approved") {
        response.status(400).json({ error: "Revenue share project can only be created after approval" });
        return;
      }

      createdRevenueShareProject = await createRevenueShareProjectForRequest(updatedRequest, request.body);
    }

    let createdOrder = null;
    if (request.body.createOrder === true) {
      if (status !== "approved") {
        response.status(400).json({ error: "Order can only be created after approval" });
        return;
      }

      const amountCents = Number.isInteger(request.body.amountCents)
        ? request.body.amountCents
        : parseMoneyCents(request.body.amountYuan);

      if (!Number.isInteger(amountCents) || amountCents < 0) {
        response.status(400).json({ error: "A valid order amount is required" });
        return;
      }

      const requestedOrderStatus = String(request.body.orderInitialStatus || "").trim();
      const orderInitialStatus =
        updatedRequest.type === "revenue_share" && amountCents === 0 && requestedOrderStatus === "paid"
          ? "paid"
          : "pending_payment";

      createdOrder = await prisma.order.create({
        data: {
          userId: updatedRequest.userId,
          scriptId: updatedRequest.scriptId,
          continuationRequestId: updatedRequest.id,
          orderType: updatedRequest.type,
          title:
            String(request.body.orderTitle || "").trim() ||
            orderCopyDefaults.orderTitle,
          amountCents,
          currency: String(request.body.currency || "CNY").trim() || "CNY",
          status: orderInitialStatus,
          paymentNote:
            String(request.body.paymentNote || "").trim() ||
            orderCopyDefaults.paymentNote,
          adminNote: String(request.body.orderAdminNote || "").trim() || null,
          userVisibleNote:
            String(request.body.orderUserVisibleNote || "").trim() ||
            orderCopyDefaults.orderUserVisibleNote,
          ...(orderInitialStatus === "paid" ? { paidAt: new Date() } : {})
        },
        include: {
          user: true,
          script: true,
          continuationRequest: true,
          deliveries: {
            include: {
              assets: true
            }
          }
        }
      });
    }

    let createdDelivery = null;
    if (request.body.createDelivery === true) {
      const deliveryAssets = await ensureDeliveryAssetsForRequest(
        updatedRequest,
        Array.isArray(request.body.deliveryAssets) ? request.body.deliveryAssets : [],
        {
          ...request.body,
          deliveryNote:
            String(request.body.deliveryNote || "").trim() ||
            userVisibleNote ||
            orderCopyDefaults.deliveryNote
        }
      );
      createdDelivery = await prisma.delivery.create({
        data: {
          userId: updatedRequest.userId,
          scriptId: updatedRequest.scriptId,
          continuationRequestId: updatedRequest.id,
          orderId: createdOrder?.id || null,
          deliveryType: updatedRequest.type,
          title:
            String(request.body.deliveryTitle || "").trim() ||
            orderCopyDefaults.deliveryTitle,
          note:
            String(request.body.deliveryNote || "").trim() ||
            userVisibleNote ||
            orderCopyDefaults.deliveryNote,
          status: createdOrder && createdOrder.status !== "paid" ? "pending_payment" : "ready",
          assets: {
            create: deliveryAssets
          }
        },
        include: {
          script: true,
          continuationRequest: true,
          order: true,
          assets: {
            orderBy: { sortOrder: "asc" }
          }
        }
      });
    }

    response.json({
      request: toAdminContinuationRequestResponse(updatedRequest),
      order: createdOrder ? toOrderResponse(createdOrder) : null,
      delivery: createdDelivery ? toDeliveryResponse(createdDelivery) : null,
      revenueShareProject: createdRevenueShareProject
        ? toAdminRevenueShareProjectResponse(createdRevenueShareProject)
        : null
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/continuation-requests/:id", requireAdmin, async (request, response, next) => {
  try {
    if (!requireDeleteConfirmation(request, response)) return;

    const existingRequest = await prisma.continuationRequest.findUnique({
      where: { id: request.params.id }
    });

    if (!existingRequest) {
      response.status(404).json({ error: "Continuation request not found" });
      return;
    }

    await prisma.continuationRequest.delete({
      where: { id: existingRequest.id }
    });

    response.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/revenue-share-projects", requireAdmin, async (request, response, next) => {
  try {
    const page = parsePageNumber(request.query.page);
    const pageSize = parsePageSize(request.query.pageSize);
    const status = String(request.query.status || "").trim();
    const q = String(request.query.q || "").trim();

    if (status && !revenueShareProjectStatuses.has(status)) {
      response.status(400).json({ error: "Invalid revenue share project status" });
      return;
    }

    const where = {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { script: { title: { contains: q } } },
              { script: { slug: { contains: q } } },
              { user: { email: { contains: q } } },
              { user: { displayName: { contains: q } } },
              { authorizedAccounts: { contains: q } },
              { authorizedPlatforms: { contains: q } }
            ]
          }
        : {})
    };

    const [total, projects] = await Promise.all([
      prisma.revenueShareProject.count({ where }),
      prisma.revenueShareProject.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: buildRevenueShareProjectInclude(),
        orderBy: { createdAt: "desc" }
      })
    ]);

    response.json({
      items: projects.map(toAdminRevenueShareProjectResponse),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      allowedStatuses: Array.from(revenueShareProjectStatuses)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/revenue-share-projects", requireAdmin, async (request, response, next) => {
  try {
    const continuationRequestId = String(request.body.continuationRequestId || "").trim();
    if (!continuationRequestId) {
      response.status(400).json({ error: "continuationRequestId is required" });
      return;
    }

    const continuationRequest = await prisma.continuationRequest.update({
      where: { id: continuationRequestId },
      data: {
        status: "approved",
        reviewedAt: new Date(),
        ...(Object.hasOwn(request.body, "userVisibleNote")
          ? { userVisibleNote: String(request.body.userVisibleNote || "").trim() || null }
          : {})
      },
      include: {
        user: true,
        script: true,
        download: true,
        testReport: true
      }
    });

    const project = await createRevenueShareProjectForRequest(continuationRequest, request.body);

    response.status(201).json({
      project: toAdminRevenueShareProjectResponse(project)
    });
  } catch (error) {
    if (error.code === "P2025") {
      response.status(404).json({ error: "Continuation request not found" });
      return;
    }
    next(error);
  }
});

app.delete("/api/admin/revenue-share-projects/:id", requireAdmin, async (request, response, next) => {
  try {
    if (!requireDeleteConfirmation(request, response)) return;

    const existingProject = await prisma.revenueShareProject.findUnique({
      where: { id: request.params.id }
    });

    if (!existingProject) {
      response.status(404).json({ error: "Revenue share project not found" });
      return;
    }

    await prisma.revenueShareProject.delete({
      where: { id: existingProject.id }
    });

    response.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/revenue-share-statements", requireAdmin, async (request, response, next) => {
  try {
    const page = parsePageNumber(request.query.page);
    const pageSize = parsePageSize(request.query.pageSize);
    const status = String(request.query.status || "").trim();
    const q = String(request.query.q || "").trim();

    if (status && !revenueShareStatementStatuses.has(status)) {
      response.status(400).json({ error: "Invalid revenue share statement status" });
      return;
    }

    const where = {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { script: { title: { contains: q } } },
              { script: { slug: { contains: q } } },
              { user: { email: { contains: q } } },
              { user: { displayName: { contains: q } } },
              { userNote: { contains: q } }
            ]
          }
        : {})
    };

    const include = {
      user: true,
      script: true,
      project: true,
      videos: {
        orderBy: { createdAt: "asc" }
      },
      evidence: {
        orderBy: { createdAt: "asc" }
      }
    };

    const [total, statements] = await Promise.all([
      prisma.revenueShareStatement.count({ where }),
      prisma.revenueShareStatement.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include,
        orderBy: { createdAt: "desc" }
      })
    ]);

    response.json({
      items: statements.map(toRevenueShareStatementResponse),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      allowedStatuses: Array.from(revenueShareStatementStatuses)
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/admin/revenue-share-statements/:id", requireAdmin, async (request, response, next) => {
  try {
    const status = String(request.body.status || "").trim();
    if (status && !revenueShareStatementStatuses.has(status)) {
      response.status(400).json({ error: "Invalid revenue share statement status" });
      return;
    }

    const current = await prisma.revenueShareStatement.findUnique({
      where: { id: request.params.id },
      include: {
        project: true
      }
    });

    if (!current) {
      response.status(404).json({ error: "Revenue share statement not found" });
      return;
    }

    const confirmedRevenueCents = Object.hasOwn(request.body, "confirmedRevenueYuan")
      ? parseMoneyCents(request.body.confirmedRevenueYuan)
      : current.confirmedRevenueCents;
    const platformShareRatio = parsePercentInteger(
      request.body.platformShareRatio,
      current.platformShareRatio || current.project.shareRatioPlatform
    );
    const paidAt = Object.hasOwn(request.body, "paidAt")
      ? parseRequiredDate(request.body.paidAt)
      : current.paidAt;
    const revenueForShare =
      confirmedRevenueCents ?? current.confirmedRevenueCents ?? current.reportedRevenueCents;
    const platformShareCents = Math.round((revenueForShare * platformShareRatio) / 100);
    const userShareCents = Math.max(0, revenueForShare - platformShareCents);
    const nextStatus = status || current.status;

    const statement = await prisma.revenueShareStatement.update({
      where: { id: request.params.id },
      data: {
        status: nextStatus,
        confirmedRevenueCents,
        platformShareRatio,
        platformShareCents,
        userShareCents,
        ...(Object.hasOwn(request.body, "adminNote")
          ? { adminNote: String(request.body.adminNote || "").trim() || null }
          : {}),
        ...(Object.hasOwn(request.body, "settlementProofPath")
          ? { settlementProofPath: normalizeEvidencePath(request.body.settlementProofPath) || null }
          : {}),
        ...(Object.hasOwn(request.body, "paymentReference")
          ? { paymentReference: String(request.body.paymentReference || "").trim() || null }
          : {}),
        ...(nextStatus === "reviewing" || nextStatus === "confirmed" || nextStatus === "settled" || nextStatus === "rejected"
          ? { reviewedAt: new Date() }
          : {}),
        ...(nextStatus === "settled" ? { paidAt: paidAt || new Date() } : Object.hasOwn(request.body, "paidAt") ? { paidAt } : {})
      },
      include: {
        user: true,
        script: true,
        project: true,
        videos: {
          orderBy: { createdAt: "asc" }
        },
        evidence: {
          orderBy: { createdAt: "asc" }
        }
      }
    });

    response.json({
      statement: toRevenueShareStatementResponse(statement)
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/revenue-share-statements/:id", requireAdmin, async (request, response, next) => {
  try {
    if (!requireDeleteConfirmation(request, response)) return;

    const existingStatement = await prisma.revenueShareStatement.findUnique({
      where: { id: request.params.id }
    });

    if (!existingStatement) {
      response.status(404).json({ error: "Revenue share statement not found" });
      return;
    }

    await prisma.revenueShareStatement.delete({
      where: { id: existingStatement.id }
    });

    response.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/test-reports", requireAdmin, async (request, response, next) => {
  try {
    const page = parsePageNumber(request.query.page);
    const pageSize = parsePageSize(request.query.pageSize);
    const status = String(request.query.status || "").trim();
    const platform = String(request.query.platform || "").trim();
    const q = String(request.query.q || "").trim();

    if (status && !testReportStatuses.has(status)) {
      response.status(400).json({ error: "Invalid test report status" });
      return;
    }

    const where = {
      ...(status ? { status } : {}),
      ...(platform ? { platform: { contains: platform } } : {}),
      ...(q
        ? {
            OR: [
              { platform: { contains: q } },
              { videoUrl: { contains: q } },
              { notes: { contains: q } },
              { script: { title: { contains: q } } },
              { script: { slug: { contains: q } } },
              { user: { email: { contains: q } } },
              { user: { displayName: { contains: q } } }
            ]
          }
        : {})
    };

    const [total, reports] = await Promise.all([
      prisma.testReport.count({ where }),
      prisma.testReport.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: true,
          script: true,
          download: true,
          continuationRequests: {
            orderBy: { createdAt: "desc" }
          }
        },
        orderBy: { createdAt: "desc" }
      })
    ]);

    response.json({
      items: reports.map(toAdminTestReportResponse),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      allowedStatuses: Array.from(testReportStatuses)
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/admin/test-reports/:id", requireAdmin, async (request, response, next) => {
  try {
    const status = String(request.body.status || "").trim();

    if (!testReportStatuses.has(status)) {
      response.status(400).json({ error: "Invalid test report status" });
      return;
    }

    const existingReport = await prisma.testReport.findUnique({
      where: { id: request.params.id }
    });

    if (!existingReport) {
      response.status(404).json({ error: "Test report not found" });
      return;
    }

    const updatedReport = await prisma.testReport.update({
      where: { id: existingReport.id },
      data: { status },
      include: {
        user: true,
        script: true,
        download: true,
        continuationRequests: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    response.json({ report: toAdminTestReportResponse(updatedReport) });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/test-reports/:id", requireAdmin, async (request, response, next) => {
  try {
    if (!requireDeleteConfirmation(request, response)) return;

    const existingReport = await prisma.testReport.findUnique({
      where: { id: request.params.id }
    });

    if (!existingReport) {
      response.status(404).json({ error: "Test report not found" });
      return;
    }

    await prisma.testReport.delete({
      where: { id: existingReport.id }
    });

    response.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/orders", requireAdmin, async (request, response, next) => {
  try {
    const page = parsePageNumber(request.query.page);
    const pageSize = parsePageSize(request.query.pageSize);
    const status = String(request.query.status || "").trim();
    const q = String(request.query.q || "").trim();

    if (status && !orderStatuses.has(status)) {
      response.status(400).json({ error: "Invalid order status" });
      return;
    }

    const where = {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { userVisibleNote: { contains: q } },
              { paymentNote: { contains: q } },
              { script: { title: { contains: q } } },
              { script: { slug: { contains: q } } },
              { user: { email: { contains: q } } },
              { user: { displayName: { contains: q } } }
            ]
          }
        : {})
    };

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: true,
          script: true,
          continuationRequest: true,
          deliveries: {
            include: {
              assets: true
            },
            orderBy: { createdAt: "desc" }
          }
        },
        orderBy: { createdAt: "desc" }
      })
    ]);

    response.json({
      items: orders.map(toOrderResponse),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      allowedStatuses: Array.from(orderStatuses)
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/admin/orders/:id", requireAdmin, async (request, response, next) => {
  try {
    const status = String(request.body.status || "").trim();
    if (!orderStatuses.has(status)) {
      response.status(400).json({ error: "Invalid order status" });
      return;
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: request.params.id }
    });

    if (!existingOrder) {
      response.status(404).json({ error: "Order not found" });
      return;
    }

    const updateData = {
      status,
      ...(Object.hasOwn(request.body, "paymentNote")
        ? { paymentNote: String(request.body.paymentNote || "").trim() || null }
        : {}),
      ...(Object.hasOwn(request.body, "userVisibleNote")
        ? { userVisibleNote: String(request.body.userVisibleNote || "").trim() || null }
        : {})
    };

    if (status === "paid" && existingOrder.status !== "paid") {
      updateData.paidAt = new Date();
    }
    if (status === "delivered" && existingOrder.status !== "delivered") {
      updateData.deliveredAt = new Date();
    }
    if (status === "cancelled" && existingOrder.status !== "cancelled") {
      updateData.cancelledAt = new Date();
    }

    const updatedOrder = await prisma.order.update({
      where: { id: existingOrder.id },
      data: updateData,
      include: {
        user: true,
        script: true,
        continuationRequest: true,
        deliveries: {
          include: {
            assets: true
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (status === "paid" || status === "delivered") {
      await prisma.delivery.updateMany({
        where: {
          orderId: updatedOrder.id,
          status: "pending_payment"
        },
        data: {
          status: "ready"
        }
      });
    }

    if (status === "cancelled") {
      await prisma.delivery.updateMany({
        where: {
          orderId: updatedOrder.id,
          status: {
            in: ["pending_payment", "ready"]
          }
        },
        data: {
          status: "archived"
        }
      });
    }

    const refreshedOrder = await prisma.order.findUnique({
      where: { id: updatedOrder.id },
      include: {
        user: true,
        script: true,
        continuationRequest: true,
        deliveries: {
          include: {
            assets: true
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    response.json({ order: toOrderResponse(refreshedOrder) });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/orders/:id", requireAdmin, async (request, response, next) => {
  try {
    if (!requireDeleteConfirmation(request, response)) return;

    const existingOrder = await prisma.order.findUnique({
      where: { id: request.params.id }
    });

    if (!existingOrder) {
      response.status(404).json({ error: "Order not found" });
      return;
    }

    await prisma.order.delete({
      where: { id: existingOrder.id }
    });

    response.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/downloads", requireAdmin, async (request, response, next) => {
  try {
    const page = parsePageNumber(request.query.page);
    const pageSize = parsePageSize(request.query.pageSize);
    const scriptId = String(request.query.scriptId || "").trim();
    const userId = String(request.query.userId || "").trim();
    const visitorId = String(request.query.visitorId || "").trim();
    const q = String(request.query.q || "").trim();

    const where = {
      ...(scriptId ? { scriptId } : {}),
      ...(userId ? { userId } : {}),
      ...(visitorId ? { visitorId: { contains: visitorId } } : {}),
      ...(q
        ? {
            OR: [
              { visitorId: { contains: q } },
              { ipAddress: { contains: q } },
              { referrer: { contains: q } },
              { script: { title: { contains: q } } },
              { script: { slug: { contains: q } } },
              { user: { email: { contains: q } } },
              { user: { displayName: { contains: q } } }
            ]
          }
        : {})
    };

    const [total, downloads] = await Promise.all([
      prisma.download.count({ where }),
      prisma.download.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: true,
          script: true,
          asset: true,
          _count: {
            select: {
              testReports: true,
              continuationRequests: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      })
    ]);

    response.json({
      items: downloads.map(toAdminDownloadResponse),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize))
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/downloads/:id", requireAdmin, async (request, response, next) => {
  try {
    if (!requireDeleteConfirmation(request, response)) return;

    const existingDownload = await prisma.download.findUnique({
      where: { id: request.params.id }
    });

    if (!existingDownload) {
      response.status(404).json({ error: "Download not found" });
      return;
    }

    await prisma.download.delete({
      where: { id: existingDownload.id }
    });

    response.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/users", requireAdmin, async (request, response, next) => {
  try {
    const page = parsePageNumber(request.query.page);
    const pageSize = parsePageSize(request.query.pageSize);
    const status = String(request.query.status || "").trim();
    const role = String(request.query.role || "").trim();
    const q = String(request.query.q || "").trim();

    if (status && !userStatuses.has(status)) {
      response.status(400).json({ error: "Invalid user status" });
      return;
    }

    if (role && !["user", "admin"].includes(role)) {
      response.status(400).json({ error: "Invalid user role" });
      return;
    }

    const where = {
      ...(status ? { status } : {}),
      ...(role ? { role } : {}),
      ...(q
        ? {
            OR: [
              { email: { contains: q } },
              { displayName: { contains: q } },
              { contactWechat: { contains: q } },
              { contactPhone: { contains: q } }
            ]
          }
        : {})
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: {
            select: {
              downloads: true,
              testReports: true,
              continuationRequests: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      })
    ]);

    response.json({
      items: users.map(toAdminUserResponse),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      allowedStatuses: Array.from(userStatuses),
      allowedRoles: ["user", "admin"]
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/admin/users/:id", requireAdmin, async (request, response, next) => {
  try {
    const status = String(request.body.status || "").trim();

    if (!userStatuses.has(status)) {
      response.status(400).json({ error: "Invalid user status" });
      return;
    }

    if (request.params.id === request.currentUser.id && status === "disabled") {
      response.status(400).json({ error: "Current admin user cannot disable itself" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: request.params.id }
    });

    if (!existingUser) {
      response.status(404).json({ error: "User not found" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: { status },
      include: {
        _count: {
          select: {
            downloads: true,
            testReports: true,
            continuationRequests: true
          }
        }
      }
    });

    response.json({ user: toAdminUserResponse(updatedUser) });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/users/:id", requireAdmin, async (request, response, next) => {
  try {
    if (!requireDeleteConfirmation(request, response)) return;

    if (request.params.id === request.currentUser.id) {
      response.status(400).json({ error: "Current admin user cannot delete itself" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: request.params.id }
    });

    if (!existingUser) {
      response.status(404).json({ error: "User not found" });
      return;
    }

    await prisma.user.delete({
      where: { id: existingUser.id }
    });

    response.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/scripts", requireAdmin, async (request, response, next) => {
  try {
    const page = parsePageNumber(request.query.page);
    const pageSize = parsePageSize(request.query.pageSize);
    const status = String(request.query.status || "").trim();
    const featured = String(request.query.featured || "").trim();
    const q = String(request.query.q || "").trim();

    if (status && !scriptStatuses.has(status)) {
      response.status(400).json({ error: "Invalid script status" });
      return;
    }

    if (featured && !["true", "false"].includes(featured)) {
      response.status(400).json({ error: "Invalid featured filter" });
      return;
    }

    const where = {
      ...(status ? { status } : {}),
      ...(featured ? { featured: featured === "true" } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { titleEn: { contains: q } },
              { slug: { contains: q } },
              { category: { contains: q } },
              { logline: { contains: q } }
            ]
          }
        : {})
    };

    const [total, scripts] = await Promise.all([
      prisma.script.count({ where }),
      prisma.script.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: {
            select: {
              assets: true,
              episodes: true,
              downloads: true,
              testReports: true,
              continuationRequests: true
            }
          }
        },
        orderBy: [{ featured: "desc" }, { updatedAt: "desc" }]
      })
    ]);

    response.json({
      items: scripts.map(toAdminScriptResponse),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      allowedStatuses: Array.from(scriptStatuses)
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/admin/scripts/:id", requireAdmin, async (request, response, next) => {
  try {
    const updates = {};

    if (Object.hasOwn(request.body, "status")) {
      const status = String(request.body.status || "").trim();
      if (!scriptStatuses.has(status)) {
        response.status(400).json({ error: "Invalid script status" });
        return;
      }

      if (status === "archived" && request.body.confirmArchive !== true) {
        response.status(400).json({ error: "Archive confirmation is required" });
        return;
      }

      updates.status = status;
    }

    if (Object.hasOwn(request.body, "featured")) {
      if (typeof request.body.featured !== "boolean") {
        response.status(400).json({ error: "featured must be a boolean" });
        return;
      }
      updates.featured = request.body.featured;
    }

    if (Object.keys(updates).length === 0) {
      response.status(400).json({ error: "No supported script fields to update" });
      return;
    }

    const existingScript = await prisma.script.findUnique({
      where: { id: request.params.id }
    });

    if (!existingScript) {
      response.status(404).json({ error: "Script not found" });
      return;
    }

    const updatedScript = await prisma.script.update({
      where: { id: existingScript.id },
      data: updates,
      include: {
        _count: {
          select: {
            assets: true,
            episodes: true,
            downloads: true,
            testReports: true,
            continuationRequests: true
          }
        }
      }
    });

    response.json({ script: toAdminScriptResponse(updatedScript) });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/scripts/:id", requireAdmin, async (request, response, next) => {
  try {
    if (!requireDeleteConfirmation(request, response)) return;

    const existingScript = await prisma.script.findUnique({
      where: { id: request.params.id }
    });

    if (!existingScript) {
      response.status(404).json({ error: "Script not found" });
      return;
    }

    await prisma.script.delete({
      where: { id: existingScript.id }
    });

    response.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.post("/api/me/bind-visitor-downloads", requireAuth, async (request, response, next) => {
  try {
    const visitorId = String(request.body.visitorId || "").trim();
    if (!visitorId) {
      response.status(400).json({ error: "visitorId is required" });
      return;
    }

    const earliestCreatedAt = new Date();
    earliestCreatedAt.setDate(earliestCreatedAt.getDate() - 30);

    const result = await prisma.download.updateMany({
      where: {
        userId: null,
        visitorId,
        createdAt: {
          gte: earliestCreatedAt
        }
      },
      data: {
        userId: request.currentUser.id
      }
    });

    response.json({ boundCount: result.count });
  } catch (error) {
    next(error);
  }
});

app.get("/api/me/downloads", requireAuth, async (request, response, next) => {
  try {
    const downloads = await prisma.download.findMany({
      where: {
        userId: request.currentUser.id
      },
      include: {
        script: true,
        asset: true
      },
      orderBy: { createdAt: "desc" }
    });

    response.json({
      items: downloads.map((download) => ({
        id: download.id,
        createdAt: download.createdAt,
        licenseConfirmed: download.licenseConfirmed,
        script: {
          id: download.script.id,
          slug: download.script.slug,
          title: download.script.title,
          category: download.script.category,
          coverImage: download.script.coverImage
        },
        asset: {
          id: download.asset.id,
          title: download.asset.title,
          assetType: download.asset.assetType,
          version: download.asset.version,
          filePath: download.asset.filePath,
          fileFormat: download.asset.fileFormat,
          downloadUrl: `/api/download-files/script-assets/${download.asset.id}`
        }
      }))
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/me/test-reports", requireAuth, async (request, response, next) => {
  try {
    const reports = await prisma.testReport.findMany({
      where: {
        userId: request.currentUser.id
      },
      include: {
        script: true,
        download: true
      },
      orderBy: { createdAt: "desc" }
    });

    response.json({
      items: reports.map((report) => ({
        id: report.id,
        platform: report.platform,
        videoUrl: report.videoUrl,
        viewCount: report.viewCount,
        likeCount: report.likeCount,
        commentCount: report.commentCount,
        followerDelta: report.followerDelta,
        publishTime: report.publishTime,
        notes: report.notes,
        status: report.status,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        script: {
          id: report.script.id,
          slug: report.script.slug,
          title: report.script.title,
          category: report.script.category
        },
        downloadId: report.downloadId
      }))
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/test-reports", requireAuth, async (request, response, next) => {
  try {
    const scriptId = String(request.body.scriptId || "").trim();
    const downloadId = String(request.body.downloadId || "").trim() || null;
    const platform = String(request.body.platform || "").trim();
    const videoUrl = String(request.body.videoUrl || "").trim();
    const notes = String(request.body.notes || "").trim() || null;
    const publishTime = request.body.publishTime ? new Date(request.body.publishTime) : null;

    if (!scriptId || !platform || !videoUrl) {
      response.status(400).json({ error: "scriptId, platform and videoUrl are required" });
      return;
    }

    if (publishTime && Number.isNaN(publishTime.getTime())) {
      response.status(400).json({ error: "publishTime is invalid" });
      return;
    }

    const download = await prisma.download.findFirst({
      where: {
        userId: request.currentUser.id,
        scriptId,
        ...(downloadId ? { id: downloadId } : {})
      }
    });

    if (!download) {
      response.status(403).json({ error: "A bound download record is required before submitting test data" });
      return;
    }

    const report = await prisma.testReport.create({
      data: {
        userId: request.currentUser.id,
        scriptId,
        downloadId: download.id,
        platform,
        videoUrl,
        viewCount: parseOptionalInteger(request.body.viewCount),
        likeCount: parseOptionalInteger(request.body.likeCount),
        commentCount: parseOptionalInteger(request.body.commentCount),
        followerDelta: parseOptionalInteger(request.body.followerDelta),
        publishTime,
        notes
      },
      include: {
        script: true
      }
    });

    response.status(201).json({
      report: {
        id: report.id,
        platform: report.platform,
        videoUrl: report.videoUrl,
        viewCount: report.viewCount,
        likeCount: report.likeCount,
        commentCount: report.commentCount,
        followerDelta: report.followerDelta,
        publishTime: report.publishTime,
        notes: report.notes,
        status: report.status,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        script: {
          id: report.script.id,
          slug: report.script.slug,
          title: report.script.title,
          category: report.script.category
        },
        downloadId: report.downloadId
      }
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/me/continuation-requests", requireAuth, async (request, response, next) => {
  try {
    const requests = await prisma.continuationRequest.findMany({
      where: {
        userId: request.currentUser.id
      },
      include: {
        script: true,
        deliveries: {
          include: {
            assets: {
              orderBy: { sortOrder: "asc" }
            }
          },
          orderBy: { createdAt: "desc" }
        },
        revenueShareProjects: {
          include: buildRevenueShareProjectInclude(),
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    response.json({
      items: requests.map(toContinuationRequestResponse)
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/me/continuation-options", requireAuth, async (request, response, next) => {
  try {
    const type = String(request.query.type || "").trim();

    if (!continuationRequestTypes.has(type)) {
      response.status(400).json({ error: "A valid continuation request type is required" });
      return;
    }

    const downloads = await prisma.download.findMany({
      where: {
        userId: request.currentUser.id
      },
      include: {
        script: {
          include: {
            episodes: {
              orderBy: { episodeNumber: "asc" }
            }
          }
        },
        asset: true
      },
      orderBy: { createdAt: "desc" }
    });

    const latestDownloadByScriptId = new Map();
    downloads.forEach((download) => {
      if (!latestDownloadByScriptId.has(download.scriptId)) {
        latestDownloadByScriptId.set(download.scriptId, download);
      }
    });

    const uniqueDownloads = Array.from(latestDownloadByScriptId.values());
    const scriptIds = uniqueDownloads.map((download) => download.scriptId);
    const restrictions = await getContinuationRestrictions(request.currentUser.id, scriptIds);

    const items = uniqueDownloads
      .map((download) => {
        const unavailableEpisodeNumbers =
          restrictions.unavailableEpisodeNumbersByScriptId.get(download.scriptId) || new Set();
        const episodes = buildEpisodeSlots(download.script, unavailableEpisodeNumbers);
        const enabledEpisodeCount = episodes.filter((episode) => !episode.disabled).length;

        return {
          downloadId: download.id,
          downloadedAt: download.createdAt,
          script: {
            id: download.script.id,
            slug: download.script.slug,
            title: download.script.title,
            category: download.script.category,
            episodeCount: download.script.episodeCount,
            freeEpisodeCount: download.script.freeEpisodeCount
          },
          episodes,
          enabledEpisodeCount,
          blockedByExclusiveCooperation: restrictions.exclusiveScriptIds.has(download.scriptId)
        };
      })
      .filter((item) => {
        if (item.blockedByExclusiveCooperation) return false;
        if (type === "pay_per_episode") return item.enabledEpisodeCount > 0;
        return true;
      });

    response.json({
      type,
      items
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/me/revenue-share-projects", requireAuth, async (request, response, next) => {
  try {
    const projects = await prisma.revenueShareProject.findMany({
      where: {
        userId: request.currentUser.id
      },
      include: buildRevenueShareProjectInclude(),
      orderBy: { createdAt: "desc" }
    });

    response.json({
      items: projects.map(toRevenueShareProjectResponse)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/me/revenue-share-statements", requireAuth, async (request, response, next) => {
  try {
    const projectId = String(request.body.projectId || "").trim();
    const periodStart = parseRequiredDate(request.body.periodStart);
    const periodEnd = parseRequiredDate(request.body.periodEnd);
    const reportedRevenueCents = parseMoneyCents(request.body.reportedRevenueYuan);
    const videos = Array.isArray(request.body.videos) ? request.body.videos : [];
    const evidence = Array.isArray(request.body.evidence) ? request.body.evidence : [];
    const userNote = String(request.body.userNote || "").trim() || null;

    if (!projectId || !periodStart || !periodEnd || periodEnd < periodStart || reportedRevenueCents === null) {
      response.status(400).json({ error: "projectId, periodStart, periodEnd and reportedRevenueYuan are required" });
      return;
    }

    if (!videos.length) {
      response.status(400).json({ error: "At least one revenue-share video is required" });
      return;
    }

    if (!evidence.length) {
      response.status(400).json({ error: "At least one evidence item is required" });
      return;
    }

    const project = await prisma.revenueShareProject.findFirst({
      where: {
        id: projectId,
        userId: request.currentUser.id
      },
      include: {
        batches: true,
        script: true
      }
    });

    if (!project) {
      response.status(404).json({ error: "Revenue share project not found" });
      return;
    }

    if (project.status !== "active") {
      response.status(409).json({ error: "Only active revenue share projects can submit monthly statements" });
      return;
    }

    const existingStatement = await prisma.revenueShareStatement.findFirst({
      where: {
        projectId,
        periodStart,
        periodEnd,
        status: { in: ["submitted", "reviewing", "confirmed", "settled"] }
      }
    });
    if (existingStatement) {
      response.status(409).json({ error: "This settlement period has already been submitted" });
      return;
    }

    const releasedBatches = project.batches.filter((batch) => batch.status === "released" || batch.status === "completed");
    const findBatchIdForEpisode = (episodeNumber) =>
      releasedBatches.find((batch) => episodeNumber >= batch.episodeStart && episodeNumber <= batch.episodeEnd)?.id || null;

    const normalizedVideos = videos.map((item, index) => {
      const episodeNumber = Number(item.episodeNumber);
      const title = String(item.title || "").trim();
      const videoUrl = String(item.videoUrl || "").trim();
      const platform = String(item.platform || "").trim();
      const accountName = String(item.accountName || "").trim();
      const publishedAt = parseRequiredDate(item.publishedAt);
      const reportedVideoRevenueCents = parseMoneyCents(item.reportedRevenueYuan);
      const revenueType = String(item.revenueType || "platform_income").trim();

      try {
        new URL(videoUrl);
      } catch {
        throw Object.assign(new Error(`Video ${index + 1} has an invalid URL`), { status: 400 });
      }

      if (
        !Number.isInteger(episodeNumber) ||
        episodeNumber < project.firstEpisodeNumber ||
        episodeNumber > project.currentEpisodeEnd ||
        !findBatchIdForEpisode(episodeNumber)
      ) {
        throw Object.assign(new Error(`Video ${index + 1} episode is outside the released scope`), { status: 400 });
      }

      if (!title || !platform || !accountName || !publishedAt || reportedVideoRevenueCents === null) {
        throw Object.assign(new Error(`Video ${index + 1} is incomplete`), { status: 400 });
      }

      return {
        projectId,
        batchId: findBatchIdForEpisode(episodeNumber),
        episodeNumber,
        title,
        videoUrl,
        platform,
        accountName,
        publishedAt,
        viewCount: parseOptionalInteger(item.viewCount),
        likeCount: parseOptionalInteger(item.likeCount),
        commentCount: parseOptionalInteger(item.commentCount),
        reportedRevenueCents: reportedVideoRevenueCents,
        revenueType,
        status: "submitted",
        note: String(item.note || "").trim() || null
      };
    });

    const normalizedEvidence = evidence.map((item, index) => {
      const evidenceType = String(item.evidenceType || "revenue_screenshot").trim();
      const filePath = normalizeEvidencePath(item.filePath);

      if (!revenueShareEvidenceTypes.has(evidenceType) || !filePath) {
        throw Object.assign(new Error(`Evidence ${index + 1} is incomplete`), { status: 400 });
      }

      return {
        projectId,
        evidenceType,
        filePath,
        originalFileName: String(item.originalFileName || "").trim() || null,
        uploadedBy: "user",
        reviewStatus: "pending"
      };
    });

    const platformShareRatio = project.shareRatioPlatform;
    const platformShareCents = Math.round((reportedRevenueCents * platformShareRatio) / 100);
    const userShareCents = Math.max(0, reportedRevenueCents - platformShareCents);

    const statement = await prisma.$transaction(async (tx) => {
      const createdStatement = await tx.revenueShareStatement.create({
        data: {
          projectId,
          userId: request.currentUser.id,
          scriptId: project.scriptId,
          periodStart,
          periodEnd,
          status: "submitted",
          reportedRevenueCents,
          platformShareRatio,
          platformShareCents,
          userShareCents,
          videoCount: normalizedVideos.length,
          evidenceCount: normalizedEvidence.length,
          userNote,
          submittedAt: new Date()
        }
      });

      await tx.revenueShareVideo.createMany({
        data: normalizedVideos.map((item) => ({
          ...item,
          statementId: createdStatement.id
        }))
      });

      await tx.revenueShareEvidence.createMany({
        data: normalizedEvidence.map((item) => ({
          ...item,
          statementId: createdStatement.id
        }))
      });

      return tx.revenueShareStatement.findUnique({
        where: { id: createdStatement.id },
        include: {
          user: true,
          script: true,
          project: true,
          videos: {
            orderBy: { createdAt: "asc" }
          },
          evidence: {
            orderBy: { createdAt: "asc" }
          }
        }
      });
    });

    response.status(201).json({
      statement: toRevenueShareStatementResponse(statement)
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/me/deliveries", requireAuth, async (request, response, next) => {
  try {
    const deliveries = await prisma.delivery.findMany({
      where: {
        userId: request.currentUser.id,
        status: {
          in: ["ready", "delivered"]
        }
      },
      include: {
        script: true,
        continuationRequest: true,
        order: true,
        assets: {
          orderBy: { sortOrder: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    response.json({
      items: deliveries.map(toDeliveryResponse)
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/me/orders", requireAuth, async (request, response, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: request.currentUser.id
      },
      include: {
        script: true,
        continuationRequest: true,
        deliveries: {
          include: {
            assets: true
          },
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    response.json({
      items: orders.map(toOrderResponse)
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/continuation-requests", requireAuth, async (request, response, next) => {
  try {
    const scriptId = String(request.body.scriptId || "").trim();
    const downloadId = String(request.body.downloadId || "").trim() || null;
    const testReportId = String(request.body.testReportId || "").trim() || null;
    const type = String(request.body.type || "").trim();
    let episodeRange = String(request.body.episodeRange || "").trim() || null;
    const message = String(request.body.message || "").trim() || null;
    const contactPreference = String(request.body.contactPreference || "").trim() || null;

    if (!scriptId || !continuationRequestTypes.has(type)) {
      response.status(400).json({ error: "scriptId and a valid request type are required" });
      return;
    }

    const download = await prisma.download.findFirst({
      where: {
        userId: request.currentUser.id,
        scriptId,
        ...(downloadId ? { id: downloadId } : {})
      },
      include: {
        script: {
          include: {
            episodes: {
              orderBy: { episodeNumber: "asc" }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    if (!download) {
      response.status(403).json({ error: "A bound download record is required before requesting continuation" });
      return;
    }

    const restrictions = await getContinuationRestrictions(request.currentUser.id, [scriptId]);
    if (restrictions.exclusiveScriptIds.has(scriptId)) {
      response.status(409).json({ error: "This script already has an active buyout or revenue-share cooperation" });
      return;
    }

    if (type === "pay_per_episode") {
      const requestedEpisodeNumbers = parseEpisodeNumbersInput(request.body.episodeNumbers || episodeRange);
      const unavailableEpisodeNumbers =
        restrictions.unavailableEpisodeNumbersByScriptId.get(scriptId) || new Set();
      const maxEpisodeNumber =
        download.script.episodeCount ||
        Math.max(0, ...(download.script.episodes || []).map((episode) => episode.episodeNumber));
      const firstPaidEpisodeNumber = (download.script.freeEpisodeCount || 3) + 1;

      if (!requestedEpisodeNumbers.length) {
        response.status(400).json({ error: "At least one paid episode must be selected" });
        return;
      }

      const invalidEpisodeNumber = requestedEpisodeNumbers.find(
        (episodeNumber) => episodeNumber < firstPaidEpisodeNumber || episodeNumber > maxEpisodeNumber
      );
      if (invalidEpisodeNumber) {
        response.status(400).json({ error: "Selected episode is outside the paid episode range" });
        return;
      }

      const duplicatedEpisodeNumber = requestedEpisodeNumbers.find((episodeNumber) =>
        unavailableEpisodeNumbers.has(episodeNumber)
      );
      if (duplicatedEpisodeNumber) {
        response.status(409).json({ error: "Selected episode has already been requested or purchased" });
        return;
      }

      episodeRange = formatEpisodeNumbers(requestedEpisodeNumbers);
    } else {
      episodeRange = null;
    }

    let testReport = null;
    if (testReportId) {
      testReport = await prisma.testReport.findFirst({
        where: {
          id: testReportId,
          userId: request.currentUser.id,
          scriptId
        }
      });

      if (!testReport) {
        response.status(400).json({ error: "testReportId is invalid" });
        return;
      }
    }

    const continuationRequest = await prisma.continuationRequest.create({
      data: {
        userId: request.currentUser.id,
        scriptId,
        downloadId: download.id,
        testReportId: testReport?.id || null,
        type,
        episodeRange,
        message,
        contactPreference
      },
      include: {
        script: true
      }
    });

    response.status(201).json({
      request: toContinuationRequestResponse(continuationRequest)
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/scripts", async (request, response, next) => {
  try {
    const status = request.query.status || "published";
    const featured = request.query.featured;
    const q = String(request.query.q || "").trim();

    const scripts = await prisma.script.findMany({
      where: {
        status: String(status),
        ...(featured === "true" ? { featured: true } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q } },
                { titleEn: { contains: q } },
                { logline: { contains: q } },
                { category: { contains: q } }
              ]
            }
          : {})
      },
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }]
    });

    response.json({
      items: scripts.map(toScriptCard),
      total: scripts.length
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/scripts/:slug", async (request, response, next) => {
  try {
    const script = await prisma.script.findFirst({
      where: {
        slug: request.params.slug,
        status: "published"
      },
      include: {
        assets: {
          where: { status: "published" },
          orderBy: { createdAt: "asc" }
        },
        episodes: {
          where: { status: "published" },
          orderBy: { episodeNumber: "asc" }
        },
        continuationOptions: {
          where: { enabled: true },
          orderBy: { sortOrder: "asc" }
        }
      }
    });

    if (!script) {
      response.status(404).json({ error: "Script not found" });
      return;
    }

    response.json(toScriptDetail(script));
  } catch (error) {
    next(error);
  }
});

app.get("/api/scripts/:slug/free-preview", async (request, response, next) => {
  try {
    const script = await prisma.script.findFirst({
      where: {
        slug: request.params.slug,
        status: "published"
      },
      include: {
        assets: {
          where: {
            assetType: "free_preview",
            isPublic: true,
            status: "published"
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!script || script.assets.length === 0) {
      response.status(404).json({ error: "Free preview package not found" });
      return;
    }

    const asset = script.assets[0];

    response.json({
      script: toScriptCard(script),
      asset: {
        id: asset.id,
        title: asset.title,
        version: asset.version,
        filePath: asset.filePath,
        fileFormat: asset.fileFormat,
        fileSize: asset.fileSize,
        downloadUrl: `/api/download-files/script-assets/${asset.id}`
      }
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/downloads", async (request, response, next) => {
  try {
    const { scriptSlug, assetId, visitorId, licenseConfirmed } = request.body;
    const currentUser = await getCurrentUser(request);

    if (!scriptSlug || !assetId) {
      response.status(400).json({ error: "scriptSlug and assetId are required" });
      return;
    }

    if (licenseConfirmed !== true) {
      response.status(400).json({ error: "License confirmation is required" });
      return;
    }

    const script = await prisma.script.findFirst({
      where: {
        slug: scriptSlug,
        status: "published"
      },
      include: {
        assets: {
          where: {
            id: assetId,
            isPublic: true,
            status: "published"
          }
        }
      }
    });

    if (!script || script.assets.length === 0) {
      response.status(404).json({ error: "Download asset not found" });
      return;
    }

    const asset = script.assets[0];
    const download = await prisma.download.create({
      data: {
        scriptId: script.id,
        assetId: asset.id,
        visitorId: visitorId || null,
        userId: currentUser?.id || null,
        ipAddress: request.ip,
        userAgent: request.get("user-agent") || null,
        referrer: request.get("referer") || null,
        licenseConfirmed: true
      }
    });

    response.status(201).json({
      downloadId: download.id,
      downloadUrl: `/api/download-files/script-assets/${asset.id}`
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/download-files/script-assets/:id", async (request, response, next) => {
  try {
    const asset = await prisma.scriptAsset.findFirst({
      where: {
        id: request.params.id,
        status: "published",
        isPublic: true
      },
      include: {
        script: true
      }
    });

    if (!asset || asset.script.status !== "published") {
      response.status(404).json({ error: "Download asset not found" });
      return;
    }

    sendDownloadFile(
      response,
      asset.filePath,
      buildScriptAssetDownloadName(asset, asset.script),
      asset.fileFormat
    );
  } catch (error) {
    next(error);
  }
});

app.get("/api/download-files/delivery-assets/:id", requireAuth, async (request, response, next) => {
  try {
    const asset = await prisma.deliveryAsset.findUnique({
      where: {
        id: request.params.id
      },
      include: {
        delivery: {
          include: {
            script: true,
            continuationRequest: true,
            revenueShareBatch: true
          }
        }
      }
    });

    if (!asset || !asset.delivery) {
      response.status(404).json({ error: "Delivery asset not found" });
      return;
    }

    if (asset.delivery.userId !== request.currentUser.id) {
      response.status(403).json({ error: "No permission to download this delivery asset" });
      return;
    }

    if (!["ready", "delivered"].includes(asset.delivery.status)) {
      response.status(403).json({ error: "Delivery asset is not available yet" });
      return;
    }

    await regenerateDeliveryAssetForDownload(asset);

    sendDownloadFile(
      response,
      asset.filePath,
      buildDeliveryAssetDownloadName(asset, asset.delivery),
      asset.fileFormat
    );
  } catch (error) {
    next(error);
  }
});

app.use((request, response, next) => {
  if (request.path.startsWith("/api/")) {
    next();
    return;
  }

  response.sendFile(path.join(siteDir, "index.html"));
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(error.status || 500).json({ error: error.status ? error.message : "Internal server error" });
});

app.listen(port, () => {
  console.log(`API server is running at http://localhost:${port}`);
});
