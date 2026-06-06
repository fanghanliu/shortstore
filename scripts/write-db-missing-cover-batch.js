const fs = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const projectRoot = path.join(__dirname, "..");
const outputPath = path.join(projectRoot, "tmp", "imagegen", "db-missing-covers.jsonl");

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function coverPathExists(coverImage) {
  if (!coverImage) return false;
  return fs.existsSync(path.join(projectRoot, "public", "site", coverImage));
}

function expectedCoverImage(script) {
  const existing = String(script.coverImage || "").trim();
  if (/\.png$/i.test(existing)) return existing;
  if (existing) return existing.replace(/\.(svg|jpg|jpeg|webp)$/i, ".png");
  return `assets/covers/cover-${script.slug}.png`;
}

function hashText(value) {
  let hash = 0;
  for (const char of String(value || "")) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function pickBySlug(slug, values) {
  return values[hashText(slug) % values.length];
}

function inferCentralSubject(title, category, storyCore) {
  const text = `${title} ${category} ${storyCore}`;
  const titleRules = [
    [/爷爷|退休校长|老校长|老人/, "an elderly Chinese man as the central figure, expressive, weathered, dignified"],
    [/男护士/, "a male night-shift nurse as the central figure inside an uncanny AI ward"],
    [/机器人爸爸|爸爸|父亲/, "a robot father or father figure with visible emotional conflict"],
    [/班长|庙童|儿子|孩子/, "a child or teenage protagonist in a story-specific environment"],
    [/新郎/, "a male groom figure caught in a high-stakes inheritance lottery"],
    [/妻子|女王|女帝|女法官|嫦娥/, "a female lead only because the title specifically calls for her, with the core setting dominating the image"],
    [/长颈鹿/, "a surreal giraffe connected to dream elevators and childhood height as the central subject"],
    [/玉兔|兔/, "a moon rabbit court figure as the central subject"],
    [/虫|复眼/, "an insect-swarm delivery empire with compound-eye surveillance as the central subject"],
    [/纸鹤/, "a paper crane army as the central subject, with folded soldiers and emotional fragility"],
    [/猫|猫咖|猫灵/, "a mysterious cat as the key subject, with humans secondary or absent"],
    [/狗|狗证人/, "a dog witness as the central subject inside a courtroom or evidence scene"],
    [/乌鸦|鸦/, "a raven-like news messenger as the central subject in a dramatic urban information scene"],
    [/仓鼠/, "a tiny hamster connected to a bank vault or heist scene as the central subject"],
    [/熊猫/, "a shadowy panda security guard motif inside a museum at night"],
    [/狼/, "a wolf leader and live-streaming grassland power struggle as the central subject"],
    [/龟|龟岛/, "a giant quantum turtle island as the central subject, human figures tiny for scale"],
    [/驼|骆驼/, "a desert camel king carrying a moving city as the central subject"],
    [/雪鸮/, "a snow owl border patrol subject in a blizzard landscape"],
    [/凤凰/, "a phoenix and volcanic mail route as the central subject"],
    [/章鱼/, "an octopus librarian in a deep-sea library as the central subject"],
    [/海豚/, "an ocean court witness scene with a dolphin as the key evidence subject"]
  ];

  for (const [pattern, subject] of titleRules) {
    if (pattern.test(title)) return subject;
  }

  const rules = [
    [/戏|祖宗|面具|唱/, "an opera performer, ancestral apparition, or dramatic mask as the central subject"],
    [/猫|猫咖|猫灵/, "a mysterious cat as the key subject, with humans secondary or absent"],
    [/狗|狗证人/, "a dog witness as the central subject inside a courtroom or evidence scene"],
    [/乌鸦|鸦/, "a raven-like news messenger as the central subject in a dramatic urban information scene"],
    [/仓鼠/, "a tiny hamster connected to a bank vault or heist scene as the central subject"],
    [/熊猫/, "a shadowy panda security guard motif inside a museum at night"],
    [/狼/, "a wolf leader and live-streaming grassland power struggle as the central subject"],
    [/龟|龟岛/, "a giant quantum turtle island as the central subject, human figures tiny for scale"],
    [/驼|骆驼/, "a desert camel king carrying a moving city as the central subject"],
    [/雪鸮/, "a snow owl border patrol subject in a blizzard landscape"],
    [/凤凰/, "a phoenix and volcanic mail route as the central subject"],
    [/章鱼/, "an octopus librarian in a deep-sea library as the central subject"],
    [/海豚/, "an ocean court witness scene with a dolphin as the key evidence subject"],
    [/黑洞|行星|星球|星田|云鲸|龙骨|骨车站/, "a large-scale speculative subject or environment, with human figures used only for scale"],
    [/爸爸|父亲/, "a robot father or father figure with visible emotional conflict"],
    [/机器人|AI|无人机|机甲|服务器|算法|卫星/, "a technological subject: robot, AI interface, drone, mecha, server, satellite, or algorithmic presence"],
    [/爷爷|退休校长|老校长|老人/, "an elderly Chinese man as the central figure, expressive, weathered, dignified"],
    [/男护士|新郎|邮差|厨|保安/, "a male lead matching the profession or title, not a glamorous female portrait"],
    [/儿子|孩子|班长|庙童|童年/, "a child or teenage protagonist in a story-specific environment"],
    [/妻子|女王|女帝|女法官|女主|嫦娥/, "a female lead only if the story specifically calls for her, with the core setting dominating the image"],
    [/法庭|法官|上庭|打官司|审判/, "a courtroom or tribunal composition with evidence, witness, and judge silhouette"],
    [/医院|病房|护士|病人/, "a medical thriller composition with hospital equipment and uncanny evidence"],
    [/图书馆|档案|通讯社|理发店|税务所|宠物店|酒店|猫咖|车站|河镇|寺|庙|厨房|银行/, "the named workplace or institution as the main character of the image"],
    [/直播|弹幕|全网|短视频/, "a live-stream interface scene with screens, audience pressure, and public judgment energy"]
  ];

  for (const [pattern, subject] of rules) {
    if (pattern.test(text)) return subject;
  }

  return "the story-specific protagonist or symbolic subject inferred from the title, not a repeated generic young woman portrait";
}

function inferEnvironment(title, category, storyCore) {
  const text = `${title} ${category} ${storyCore}`;
  const titleRules = [
    [/梦境电梯|电梯/, "a surreal dream elevator shaft opening into impossible childhood spaces"],
    [/纸鹤|军团/, "a battlefield-like ritual space filled with folded paper crane soldiers"],
    [/快递|送餐|邮差|包裹|信/, "a delivery route with packages, destination tension, and strong motion"],
    [/发条河镇|河镇/, "a clockwork river town where time machinery is built into streets and bridges"],
    [/骨车站|车站/, "an afterlife railway platform built from bone-white architecture and cold light"],
    [/青铜狮|地铁/, "a metro terminal that opens into an ancient hidden city"],
    [/理发店/, "a memory barbershop interior with mirrors, white hair, and erased identity"],
    [/星田|稻草人/, "a cosmic farmland where the field protects planets instead of crops"]
  ];

  for (const [pattern, environment] of titleRules) {
    if (pattern.test(title)) return environment;
  }

  const rules = [
    [/下乡|全村|村|乡村/, "a rural Chinese village with modern AI intrusion and local public pressure"],
    [/戏|祖宗|面具|唱/, "a traditional opera stage where ancestral presence breaks through the performance"],
    [/狼|草原/, "a vast grassland live-stream power struggle with wind, dust, and a dominant pack silhouette"],
    [/火山|凤凰/, "a volcanic ash-and-lava route where a messenger crosses impossible terrain"],
    [/直播|电竞|弹幕/, "a screen-filled live broadcast or esports command space with visible stakes but no readable text"],
    [/宠物店|猫咖/, "a distinctive pet shop or cat cafe interior where the animal premise is immediately visible"],
    [/外星|星球|行星|卫星|月庭|星田/, "a cosmic or planetary environment with believable scale and atmosphere"],
    [/黑洞|量子/, "a surreal science-fiction space-time environment grounded by a concrete everyday object"],
    [/厨|汤|灶|菜/, "a tense kitchen or food scene where taste, evidence, and fate collide"],
    [/车站|地铁|巡城|邮差|快递|送餐/, "a transit or delivery route with strong depth, motion, and destination tension"],
    [/猫咖|宠物店|银行|酒店|理发店|税务所|通讯社/, "a distinctive commercial interior that reveals the premise through objects and lighting"],
    [/医院|病房/, "a hospital night shift scene with clinical light and uncanny AI surveillance"],
    [/法庭|审判|上庭|打官司/, "a tribunal, courtroom, or public hearing with evidence in the foreground"],
    [/深海|珊瑚|海|鲸/, "an underwater or coastal environment with luminous aquatic atmosphere"],
    [/雨林|蘑菇|孢子/, "a dense rainforest court with giant fungi and spore-lit air"],
    [/沙暴|火山|雪|边防|暴风雪/, "an extreme weather landscape that shapes the composition"],
    [/寺|庙|佛|和尚/, "a temple or monastery where ritual architecture clashes with machines"],
    [/博物馆|朝代/, "a museum after hours where historical dynasties visually overlap"],
  ];

  for (const [pattern, environment] of rules) {
    if (pattern.test(text)) return environment;
  }

  return "a highly specific environment that can only belong to this story";
}

function inferKeyProp(title, category, storyCore) {
  const text = `${title} ${category} ${storyCore}`;
  const titleRules = [
    [/纸鹤/, "folded paper cranes shaped like soldiers"],
    [/梦境电梯|电梯/, "an elevator button, door, or height marker without readable text"],
    [/快递|送餐|邮差|包裹|信/, "a sealed package, delivery bag, or letter as the plot trigger"],
    [/发条|钟|时间/, "a clockwork gear, broken clock, or time token"],
    [/面具|戏面/, "a dramatic opera mask"],
    [/理发店|白发/, "a strand of white hair, scissors, mirror, or barber cape"],
    [/星田|稻草人/, "a scarecrow, seed, or small glowing planet"],
    [/虫|复眼/, "a package watched by compound insect eyes"]
  ];

  for (const [pattern, prop] of titleRules) {
    if (pattern.test(title)) return prop;
  }

  const rules = [
    [/合同|契约|抽签/, "a contract, lottery slip, or binding document"],
    [/面具|戏面/, "a dramatic opera mask"],
    [/房租|租/, "a rental agreement, old key, or unpaid bill"],
    [/猫|狗|乌鸦|仓鼠|熊猫|狼|龟|驼|雪鸮|凤凰|章鱼|海豚/, "the named creature as the symbolic prop and narrative anchor"],
    [/汤|厨|灶|菜/, "a bowl, cooking flame, or kitchen tool that hides evidence"],
    [/车票|车站|地铁/, "a ticket, route sign shape without readable text, or vehicle door"],
    [/服务器|算法|卫星|AI|机器人|无人机|机甲/, "a glowing device, server core, robot part, drone, satellite signal, or mechanical relic"],
    [/法庭|法官|上庭|证人|审判/, "case files, evidence bag, witness stand, or judge's hammer without readable text"],
    [/图书馆|借书|档案|通讯社/, "a book, archive folder, file card, or message capsule without readable text"],
    [/医院|病房|护士|病人/, "a medical chart shape, monitor, syringe, or ward door without readable text"],
    [/直播|弹幕|电竞|全网/, "phone screen glow, cameras, control desk, or floating UI blocks without readable text"],
    [/佛|寺|庙|香火|经/, "incense, prayer beads, ritual bell, or mechanical scripture device"],
    [/邮差|快递|包裹|信/, "a sealed package or letter as the plot trigger"]
  ];

  for (const [pattern, prop] of rules) {
    if (pattern.test(text)) return prop;
  }

  return "one unmistakable symbolic object from the story premise";
}

function buildPrompt(script) {
  const title = script.title;
  const category = script.category || "AI drama / AI manhua drama";
  const synopsis = script.synopsis || "";
  const logline = script.logline || "";
  const storyCore = [logline, synopsis].filter(Boolean).join(" ");
  const core = storyCore || "a high-concept serialized short drama with strong commercial hooks";
  const centralSubject = inferCentralSubject(title, category, core);
  const environment = inferEnvironment(title, category, core);
  const keyProp = inferKeyProp(title, category, core);
  const camera = pickBySlug(script.slug, [
    "low-angle cinematic poster shot",
    "wide environmental poster with the subject framed by the setting",
    "close foreground prop with the subject behind it in shallow depth of field",
    "over-the-shoulder investigative composition",
    "dynamic diagonal action composition",
    "symmetrical ritual or courtroom composition",
    "bird's-eye scale shot with tiny human figures",
    "intimate character-and-object portrait with strong story context"
  ]);
  const palette = pickBySlug(script.slug, [
    "cold blue and silver with sharp practical lights",
    "warm amber and deep shadow",
    "storm gray with electric cyan accents",
    "jade green and gold ritual glow",
    "volcanic orange against black smoke",
    "moonlit violet and porcelain white",
    "dusty earth tones with neon intrusion",
    "deep ocean teal with bioluminescent highlights"
  ]);

  return `Create a vertical 9:16 PNG cover image for an original Chinese AI drama script titled "${title}".

Genre/category: ${category}.
Core story: ${core}.

Story-specific visual brief:
- Central subject: ${centralSubject}.
- Environment: ${environment}.
- Key prop or plot anchor: ${keyProp}.
- Camera/composition: ${camera}.
- Color and mood: ${palette}.

Make it look like a premium sellable vertical drama poster with high production value, rich depth of field, dramatic cinematic lighting, detailed background, and a clear narrative hook. Do not default to a young woman portrait. Vary the protagonist, age, gender, scale, species, occupation, setting, camera angle, and color palette according to this specific story. If the title calls for a non-human, object, institution, vehicle, landscape, or machine as the main subject, make that the hero of the cover. No text, no logo, no watermark, no existing IP characters, no readable typography.`;
}

async function main() {
  ensureDirectory(path.dirname(outputPath));
  const scripts = await prisma.script.findMany({
    where: { status: "published" },
    select: {
      slug: true,
      title: true,
      logline: true,
      synopsis: true,
      category: true,
      coverImage: true
    },
    orderBy: { slug: "asc" }
  });

  const jobs = [];
  for (const script of scripts) {
    const coverImage = expectedCoverImage(script);
    if (/\.png$/i.test(coverImage) && coverPathExists(coverImage)) continue;

    const out = path.join(projectRoot, "public", "site", coverImage).replace(/\\/g, "/");
    jobs.push({
      slug: script.slug,
      title: script.title,
      prompt: buildPrompt(script),
      out,
      size: "1152x2048",
      quality: "medium",
      output_format: "png",
      fields: {
        use_case: "script cover poster",
        style: "premium cinematic Chinese vertical drama / AI manhua cover art with varied story-specific subjects",
        composition: "vertical 9:16 poster, story-specific central subject, detailed environment, clear key prop, varied camera angle",
        lighting: "dramatic cinematic lighting, strong depth of field",
        constraints: "no text, no logo, no watermark, no existing IP, no readable typography, do not repeat the same generic young female portrait"
      }
    });
  }

  fs.writeFileSync(outputPath, jobs.map((job) => JSON.stringify(job)).join("\n") + "\n", "utf8");
  console.log(
    JSON.stringify(
      {
        publishedScripts: scripts.length,
        jobs: jobs.length,
        jsonl: path.relative(projectRoot, outputPath).replace(/\\/g, "/"),
        slugs: jobs.map((job) => job.slug)
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
