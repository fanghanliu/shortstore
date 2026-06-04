const rawBaseUrl = process.argv[2] || process.env.STAGING_BASE_URL || "";
const baseUrl = rawBaseUrl.replace(/\/+$/, "");

if (!baseUrl) {
  console.error("Usage: node scripts/staging-smoke-check.js https://staging.example.com");
  console.error("Or set STAGING_BASE_URL in the environment.");
  process.exit(1);
}

async function requestJson(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : { text: await response.text() };

  if (!response.ok) {
    throw new Error(`${path} failed: ${response.status} ${JSON.stringify(body).slice(0, 500)}`);
  }

  return body;
}

async function requestText(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const body = await response.text();

  if (!response.ok) {
    throw new Error(`${path} failed: ${response.status} ${body.slice(0, 500)}`);
  }

  return body;
}

async function main() {
  const summary = {
    baseUrl,
    checkedAt: new Date().toISOString(),
    checks: []
  };

  await requestJson("/api/health");
  summary.checks.push("/api/health");

  const home = await requestText("/");
  if (!home.includes("<html") && !home.includes("<!DOCTYPE html")) {
    throw new Error("Home page did not look like HTML");
  }
  summary.checks.push("/");

  const scripts = await requestJson("/api/scripts?status=published");
  if (!Array.isArray(scripts.items)) {
    throw new Error("/api/scripts did not return an items array");
  }
  if (scripts.items.length === 0) {
    throw new Error("/api/scripts returned zero published scripts");
  }
  summary.publishedScripts = scripts.items.length;
  summary.checks.push("/api/scripts?status=published");

  const sampleScripts = scripts.items.slice(0, 3);
  summary.sampleSlugs = sampleScripts.map((script) => script.slug);

  for (const script of sampleScripts) {
    const detail = await requestJson(`/api/scripts/${encodeURIComponent(script.slug)}`);
    if (!detail.slug || !Array.isArray(detail.episodes) || !Array.isArray(detail.continuationOptions)) {
      throw new Error(`Script detail shape is invalid for ${script.slug}`);
    }
    summary.checks.push(`/api/scripts/${script.slug}`);

    const preview = await requestJson(`/api/scripts/${encodeURIComponent(script.slug)}/free-preview`);
    if (!preview.asset?.id || !preview.asset?.filePath) {
      throw new Error(`Free preview shape is invalid for ${script.slug}`);
    }
    summary.checks.push(`/api/scripts/${script.slug}/free-preview`);
  }

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
