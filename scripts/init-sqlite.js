const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const dbPath = path.join(__dirname, "..", "prisma", "dev.db");
const db = new DatabaseSync(dbPath);

function columnExists(tableName, columnName) {
  return db
    .prepare(`PRAGMA table_info("${tableName}")`)
    .all()
    .some((column) => column.name === columnName);
}

function addColumnIfMissing(tableName, columnName, definition) {
  if (!columnExists(tableName, columnName)) {
    db.exec(`ALTER TABLE "${tableName}" ADD COLUMN "${columnName}" ${definition};`);
  }
}

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS "Script" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "titleEn" TEXT,
    "logline" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "coverImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "recommendedPlatforms" TEXT NOT NULL DEFAULT '[]',
    "audienceTags" TEXT NOT NULL DEFAULT '[]',
    "productionDifficulty" TEXT,
    "episodeCount" INTEGER,
    "freeEpisodeCount" INTEGER NOT NULL DEFAULT 3,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT,
    "contactWechat" TEXT,
    "contactPhone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "ScriptAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scriptId" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileFormat" TEXT NOT NULL,
    "fileSize" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ScriptAsset_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "ScriptEpisode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scriptId" TEXT NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "hook" TEXT,
    "summary" TEXT NOT NULL,
    "endingHook" TEXT,
    "aiPromptZh" TEXT,
    "aiPromptEn" TEXT,
    "isFreePreview" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ScriptEpisode_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "Download" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scriptId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "visitorId" TEXT,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "licenseConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Download_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Download_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "ScriptAsset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "TestReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scriptId" TEXT NOT NULL,
    "downloadId" TEXT,
    "platform" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "viewCount" INTEGER,
    "likeCount" INTEGER,
    "commentCount" INTEGER,
    "followerDelta" INTEGER,
    "publishTime" DATETIME,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TestReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TestReport_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TestReport_downloadId_fkey" FOREIGN KEY ("downloadId") REFERENCES "Download" ("id") ON DELETE SET NULL ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "ContinuationRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scriptId" TEXT NOT NULL,
    "downloadId" TEXT,
    "testReportId" TEXT,
    "type" TEXT NOT NULL,
    "episodeRange" TEXT,
    "message" TEXT,
    "contactPreference" TEXT,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "adminNote" TEXT,
    "userVisibleNote" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContinuationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContinuationRequest_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContinuationRequest_downloadId_fkey" FOREIGN KEY ("downloadId") REFERENCES "Download" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ContinuationRequest_testReportId_fkey" FOREIGN KEY ("testReportId") REFERENCES "TestReport" ("id") ON DELETE SET NULL ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "Delivery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scriptId" TEXT NOT NULL,
    "continuationRequestId" TEXT,
    "orderId" TEXT,
    "deliveryType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ready',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Delivery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Delivery_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Delivery_continuationRequestId_fkey" FOREIGN KEY ("continuationRequestId") REFERENCES "ContinuationRequest" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Delivery_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scriptId" TEXT NOT NULL,
    "continuationRequestId" TEXT,
    "orderType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CNY',
    "status" TEXT NOT NULL DEFAULT 'pending_payment',
    "paymentNote" TEXT,
    "adminNote" TEXT,
    "userVisibleNote" TEXT,
    "paidAt" DATETIME,
    "deliveredAt" DATETIME,
    "cancelledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Order_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Order_continuationRequestId_fkey" FOREIGN KEY ("continuationRequestId") REFERENCES "ContinuationRequest" ("id") ON DELETE SET NULL ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "DeliveryAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deliveryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileFormat" TEXT NOT NULL,
    "fileSize" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DeliveryAsset_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "ContinuationOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scriptId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startingPrice" INTEGER,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContinuationOption_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "RevenueShareProject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scriptId" TEXT NOT NULL,
    "continuationRequestId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "contractStatus" TEXT NOT NULL DEFAULT 'not_uploaded',
    "contractFilePath" TEXT,
    "shareRatioPlatform" INTEGER NOT NULL DEFAULT 30,
    "shareRatioUser" INTEGER NOT NULL DEFAULT 70,
    "settlementCycle" TEXT NOT NULL DEFAULT 'monthly',
    "authorizedPlatforms" TEXT NOT NULL DEFAULT '[]',
    "authorizedAccounts" TEXT NOT NULL DEFAULT '[]',
    "revenueDefinition" TEXT,
    "firstEpisodeNumber" INTEGER NOT NULL DEFAULT 4,
    "currentEpisodeEnd" INTEGER NOT NULL DEFAULT 10,
    "riskStatus" TEXT NOT NULL DEFAULT 'normal',
    "adminNote" TEXT,
    "userVisibleNote" TEXT,
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RevenueShareProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RevenueShareProject_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RevenueShareProject_continuationRequestId_fkey" FOREIGN KEY ("continuationRequestId") REFERENCES "ContinuationRequest" ("id") ON DELETE SET NULL ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "RevenueShareBatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "deliveryId" TEXT UNIQUE,
    "batchNumber" INTEGER NOT NULL,
    "episodeStart" INTEGER NOT NULL,
    "episodeEnd" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'released',
    "releaseCondition" TEXT,
    "lockedReason" TEXT,
    "releasedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RevenueShareBatch_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "RevenueShareProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RevenueShareBatch_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery" ("id") ON DELETE SET NULL ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "RevenueShareStatement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scriptId" TEXT NOT NULL,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "reportedRevenueCents" INTEGER NOT NULL DEFAULT 0,
    "confirmedRevenueCents" INTEGER,
    "platformShareRatio" INTEGER NOT NULL DEFAULT 30,
    "platformShareCents" INTEGER,
    "userShareCents" INTEGER,
    "videoCount" INTEGER NOT NULL DEFAULT 0,
    "evidenceCount" INTEGER NOT NULL DEFAULT 0,
    "userNote" TEXT,
    "adminNote" TEXT,
    "settlementProofPath" TEXT,
    "paymentReference" TEXT,
    "submittedAt" DATETIME,
    "reviewedAt" DATETIME,
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RevenueShareStatement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "RevenueShareProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RevenueShareStatement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RevenueShareStatement_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Script" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "RevenueShareVideo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "statementId" TEXT,
    "batchId" TEXT,
    "episodeNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL,
    "viewCount" INTEGER,
    "likeCount" INTEGER,
    "commentCount" INTEGER,
    "reportedRevenueCents" INTEGER NOT NULL DEFAULT 0,
    "revenueType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "note" TEXT,
    "adminNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RevenueShareVideo_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "RevenueShareProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RevenueShareVideo_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "RevenueShareStatement" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RevenueShareVideo_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "RevenueShareBatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "RevenueShareEvidence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "statementId" TEXT,
    "videoId" TEXT,
    "evidenceType" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "originalFileName" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "reviewStatus" TEXT NOT NULL DEFAULT 'pending',
    "adminNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RevenueShareEvidence_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "RevenueShareProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RevenueShareEvidence_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "RevenueShareStatement" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RevenueShareEvidence_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "RevenueShareVideo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
  );

  CREATE INDEX IF NOT EXISTS "ScriptAsset_scriptId_idx" ON "ScriptAsset"("scriptId");
  CREATE UNIQUE INDEX IF NOT EXISTS "ScriptEpisode_scriptId_episodeNumber_key" ON "ScriptEpisode"("scriptId", "episodeNumber");
  CREATE INDEX IF NOT EXISTS "ScriptEpisode_scriptId_idx" ON "ScriptEpisode"("scriptId");
  CREATE INDEX IF NOT EXISTS "Download_scriptId_idx" ON "Download"("scriptId");
  CREATE INDEX IF NOT EXISTS "Download_assetId_idx" ON "Download"("assetId");
  CREATE INDEX IF NOT EXISTS "Download_visitorId_idx" ON "Download"("visitorId");
  CREATE INDEX IF NOT EXISTS "Download_userId_idx" ON "Download"("userId");
  CREATE INDEX IF NOT EXISTS "TestReport_userId_idx" ON "TestReport"("userId");
  CREATE INDEX IF NOT EXISTS "TestReport_scriptId_idx" ON "TestReport"("scriptId");
  CREATE INDEX IF NOT EXISTS "TestReport_downloadId_idx" ON "TestReport"("downloadId");
  CREATE INDEX IF NOT EXISTS "ContinuationRequest_userId_idx" ON "ContinuationRequest"("userId");
  CREATE INDEX IF NOT EXISTS "ContinuationRequest_scriptId_idx" ON "ContinuationRequest"("scriptId");
  CREATE INDEX IF NOT EXISTS "ContinuationRequest_downloadId_idx" ON "ContinuationRequest"("downloadId");
  CREATE INDEX IF NOT EXISTS "ContinuationRequest_testReportId_idx" ON "ContinuationRequest"("testReportId");
  CREATE INDEX IF NOT EXISTS "ContinuationRequest_type_idx" ON "ContinuationRequest"("type");
  CREATE INDEX IF NOT EXISTS "ContinuationRequest_status_idx" ON "ContinuationRequest"("status");
  CREATE INDEX IF NOT EXISTS "Delivery_userId_idx" ON "Delivery"("userId");
  CREATE INDEX IF NOT EXISTS "Delivery_scriptId_idx" ON "Delivery"("scriptId");
  CREATE INDEX IF NOT EXISTS "Delivery_continuationRequestId_idx" ON "Delivery"("continuationRequestId");
  CREATE INDEX IF NOT EXISTS "Delivery_status_idx" ON "Delivery"("status");
  CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId");
  CREATE INDEX IF NOT EXISTS "Order_scriptId_idx" ON "Order"("scriptId");
  CREATE INDEX IF NOT EXISTS "Order_continuationRequestId_idx" ON "Order"("continuationRequestId");
  CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order"("status");
  CREATE INDEX IF NOT EXISTS "DeliveryAsset_deliveryId_idx" ON "DeliveryAsset"("deliveryId");
  CREATE UNIQUE INDEX IF NOT EXISTS "ContinuationOption_scriptId_type_key" ON "ContinuationOption"("scriptId", "type");
  CREATE INDEX IF NOT EXISTS "ContinuationOption_scriptId_idx" ON "ContinuationOption"("scriptId");
  CREATE INDEX IF NOT EXISTS "RevenueShareProject_userId_idx" ON "RevenueShareProject"("userId");
  CREATE INDEX IF NOT EXISTS "RevenueShareProject_scriptId_idx" ON "RevenueShareProject"("scriptId");
  CREATE INDEX IF NOT EXISTS "RevenueShareProject_continuationRequestId_idx" ON "RevenueShareProject"("continuationRequestId");
  CREATE INDEX IF NOT EXISTS "RevenueShareProject_status_idx" ON "RevenueShareProject"("status");
  CREATE INDEX IF NOT EXISTS "RevenueShareProject_riskStatus_idx" ON "RevenueShareProject"("riskStatus");
  CREATE INDEX IF NOT EXISTS "RevenueShareBatch_projectId_idx" ON "RevenueShareBatch"("projectId");
  CREATE INDEX IF NOT EXISTS "RevenueShareBatch_status_idx" ON "RevenueShareBatch"("status");
  CREATE INDEX IF NOT EXISTS "RevenueShareStatement_projectId_idx" ON "RevenueShareStatement"("projectId");
  CREATE INDEX IF NOT EXISTS "RevenueShareStatement_userId_idx" ON "RevenueShareStatement"("userId");
  CREATE INDEX IF NOT EXISTS "RevenueShareStatement_scriptId_idx" ON "RevenueShareStatement"("scriptId");
  CREATE INDEX IF NOT EXISTS "RevenueShareStatement_status_idx" ON "RevenueShareStatement"("status");
  CREATE INDEX IF NOT EXISTS "RevenueShareVideo_projectId_idx" ON "RevenueShareVideo"("projectId");
  CREATE INDEX IF NOT EXISTS "RevenueShareVideo_statementId_idx" ON "RevenueShareVideo"("statementId");
  CREATE INDEX IF NOT EXISTS "RevenueShareVideo_batchId_idx" ON "RevenueShareVideo"("batchId");
  CREATE INDEX IF NOT EXISTS "RevenueShareVideo_status_idx" ON "RevenueShareVideo"("status");
  CREATE INDEX IF NOT EXISTS "RevenueShareEvidence_projectId_idx" ON "RevenueShareEvidence"("projectId");
  CREATE INDEX IF NOT EXISTS "RevenueShareEvidence_statementId_idx" ON "RevenueShareEvidence"("statementId");
  CREATE INDEX IF NOT EXISTS "RevenueShareEvidence_videoId_idx" ON "RevenueShareEvidence"("videoId");
  CREATE INDEX IF NOT EXISTS "RevenueShareEvidence_reviewStatus_idx" ON "RevenueShareEvidence"("reviewStatus");
`);

addColumnIfMissing("ScriptEpisode", "aiPromptZh", "TEXT");
addColumnIfMissing("ScriptEpisode", "aiPromptEn", "TEXT");
addColumnIfMissing("ContinuationRequest", "adminNote", "TEXT");
addColumnIfMissing("ContinuationRequest", "userVisibleNote", "TEXT");
addColumnIfMissing("ContinuationRequest", "reviewedAt", "DATETIME");
addColumnIfMissing("Delivery", "orderId", "TEXT");
addColumnIfMissing("RevenueShareStatement", "settlementProofPath", "TEXT");
addColumnIfMissing("RevenueShareStatement", "paymentReference", "TEXT");

db.exec(`
  CREATE INDEX IF NOT EXISTS "Delivery_orderId_idx" ON "Delivery"("orderId");
`);

db.close();

console.log(`SQLite database initialized at ${dbPath}`);
