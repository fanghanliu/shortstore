const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.join(__dirname, "..");

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeJson(filePath, data) {
  ensureDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function writeText(filePath, content) {
  ensureDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function safeSvgText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function coverSvg({ title, subtitle, palette, outputPath }) {
  const [bg, accent, text, muted] = palette;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1440" viewBox="0 0 1080 1440">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg}"/>
      <stop offset="1" stop-color="#111827"/>
    </linearGradient>
    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="1080" height="1440" fill="url(#bg)"/>
  <rect x="72" y="96" width="936" height="1248" rx="36" fill="none" stroke="${accent}" stroke-width="4" opacity="0.72"/>
  <path d="M120 1010 C260 870 380 950 520 800 C690 620 805 690 960 520" fill="none" stroke="${accent}" stroke-width="8" opacity="0.62" filter="url(#softGlow)"/>
  <circle cx="238" cy="345" r="112" fill="${accent}" opacity="0.18"/>
  <circle cx="840" cy="910" r="168" fill="${muted}" opacity="0.2"/>
  <text x="120" y="184" fill="${accent}" font-family="Microsoft YaHei, Arial, sans-serif" font-size="34" letter-spacing="4">AI SCRIPT PACK</text>
  <text x="120" y="645" fill="${text}" font-family="Microsoft YaHei, Arial, sans-serif" font-size="86" font-weight="700">
    ${safeSvgText(title)}
  </text>
  <text x="120" y="720" fill="${text}" font-family="Microsoft YaHei, Arial, sans-serif" font-size="86" font-weight="700">
    制作包
  </text>
  <text x="120" y="820" fill="${muted}" font-family="Microsoft YaHei, Arial, sans-serif" font-size="38">
    ${safeSvgText(subtitle)}
  </text>
  <text x="120" y="1210" fill="${text}" font-family="Microsoft YaHei, Arial, sans-serif" font-size="32" opacity="0.78">
    免费前三集验证 · 买断 · 按集 · 分成
  </text>
</svg>
`;
  writeText(path.join(projectRoot, outputPath), svg);
}

function manhuaEpisodeData() {
  const rows = [
    ["冷库重生", "宁晚在寒潮降临前 72 小时重生，第一反应不是报警，而是买下濒临倒闭的便利店。", "她用全部积蓄买下便利店，激活前世临死前见过的仓储系统。", "便利店地板下出现一张移动堡垒蓝图。"],
    ["三天囤货", "全城都在嘲笑宁晚囤泡面，她却知道三天后城市会被冰封。", "宁晚清空临期仓、药店和五金店，前夫带人直播嘲讽她疯了。", "她收到系统提示：堡垒燃料不足。"],
    ["白雾封城", "第一场寒雾提前 6 小时降临，嘲笑她的人困在高架上。", "便利店自动升起防寒卷帘，店外温度跌破零下 60 度。", "前夫敲门求救，身后还跟着上一世害死她的队伍。"],
    ["不开门", "宁晚第一次拒绝救人，弹幕式系统却提示门外有人携带钥匙碎片。", "她隔着防爆玻璃辨认每个人，发现一个沉默少年怀里抱着堡垒核心零件。", "少年说：你上一世不是死在雪里，是死在店里。"],
    ["移动核心", "便利店第一次移动，整条街的人以为自己看见了怪物。", "宁晚启动底盘履带，带走物资和少年，却被社区联盟标记为公共资源叛逃者。", "联盟广播悬赏她的便利店。"],
    ["雪夜交换", "有人愿意用一箱黄金换一包退烧药，宁晚只要一张旧地图。", "她用药换来地下物流线索，发现城市下方还有未冻结的能源管道。", "地图背面写着父亲的名字。"],
    ["仓库陷阱", "宁晚带队进入地下仓库，却发现物资箱全是空的。", "前夫提前埋伏，想抢走便利店控制权，少年暴露机械改造能力。", "宁晚发现前夫也有重生记忆。"],
    ["双重重生", "前夫说他重生后第一件事就是等宁晚上钩。", "两人在地下仓库对峙，宁晚意识到上一世的背叛并非偶然。", "系统判定：前夫拥有盗版堡垒权限。"],
    ["冰河医院", "宁晚必须在零下 70 度穿过冰河医院取回抗冻血清。", "医院里全是被冻住的患者和仍在运行的手术机器人。", "机器人识别宁晚为失踪研究员家属。"],
    ["父亲遗产", "父亲不是普通便利店老板，而是移动避难所项目设计师。", "宁晚得到父亲留下的权限芯片，堡垒空间扩容三倍。", "芯片影像里，父亲警告她不要相信少年。"],
    ["少年身份", "少年承认自己是堡垒项目的失败实验体。", "宁晚没有赶他走，而是让他选择是否留下。", "少年启动隐藏频道，听见父亲还活着。"],
    ["北区求援", "北区幸存者发来求救，但路线必须穿过变异寒潮区。", "宁晚决定开堡垒去救人，社区联盟趁机偷袭她的原补给点。", "救援信号其实来自联盟内部。"],
    ["白塔广播", "城市最高白塔广播宣布便利店堡垒为非法私产。", "宁晚公开直播物资账本，反向揭穿联盟囤粮。", "白塔屏幕突然切出父亲被囚画面。"],
    ["破冰列车", "宁晚发现父亲被关在旧地铁破冰列车上。", "堡垒追着列车穿过冰封隧道，少年身体开始失控结晶。", "列车里的人称宁晚父亲为叛徒。"],
    ["叛徒真相", "父亲当年不是叛徒，而是拒绝把移动堡垒交给财团。", "宁晚救出父亲，却得知真正寒潮不是天灾，而是能源实验失控。", "财团准备启动第二次降温。"],
    ["第二寒潮", "第二寒潮会把所有普通避难所冻裂，只有移动堡垒能活。", "宁晚必须决定救自己队伍，还是公开堡垒图纸。", "系统提示公开图纸将失去独占控制权。"],
    ["公开蓝图", "宁晚把堡垒蓝图播向全城，第一次放弃独占优势。", "幸存者开始改造公交、货车和船屋，移动避难所群出现。", "前夫趁乱夺走主核心。"],
    ["核心被夺", "便利店堡垒失去主核心，停在即将断裂的冰桥上。", "宁晚用手动系统撑住堡垒，少年回到实验体形态接管能源。", "少年会因此彻底失去人类记忆。"],
    ["记忆备份", "宁晚进入少年记忆，发现他曾在上一世救过自己。", "她用父亲芯片为少年备份意识，堡垒重新点火。", "备份里出现上一世宁晚死亡的完整画面。"],
    ["死亡真相", "上一世杀死宁晚的不是寒潮，而是她救过的联盟首领。", "宁晚公开死亡证据，联盟内部崩盘。", "联盟首领带着财团军队围住便利店。"],
    ["移动城市", "所有改造避难所汇合，便利店成为移动城市核心。", "宁晚组织车队突破财团封锁，父亲修复天气控制塔。", "塔内需要有人手动留守。"],
    ["最后留守", "父亲决定留下，宁晚第一次不再被抛下，而是被托付未来。", "天气塔启动，寒潮开始回退，堡垒群穿过第一缕阳光。", "前夫带着盗版核心冲向塔底。"],
    ["冰下爆炸", "盗版核心爆炸会让城市再次降温，少年选择独自下潜。", "宁晚驾驶堡垒撞开冰层救他，所有幸存者点亮移动城市。", "少年记忆备份开始恢复。"],
    ["开店到春天", "寒潮结束后，宁晚把便利店停在解冻的广场中央。", "她不再囤货求生，而是开出第一家移动城市补给站。", "新顾客递来一张来自南方灾区的求救单。"]
  ];
  return rows.map(([title, hook, summary, endingHook], index) => ({
    episodeNumber: index + 1,
    title,
    hook,
    summary,
    endingHook
  }));
}

function shortDramaEpisodeData() {
  const rows = [
    ["她看见弹幕", "公关经理夏知微在发布会前看见一行未来弹幕：三分钟后，新娘会死。", "她冲上台阻止豪门婚礼，却被所有人当成疯子。", "新娘倒下前抓住她，说：弹幕是真的。"],
    ["热搜杀人", "夏知微发现每条未来弹幕都会变成热搜事故。", "她用公关手段压下婚礼死亡舆论，却看见下一条弹幕指向自己。", "弹幕写着：今晚，夏知微会自首。"],
    ["不在场证明", "她明明没有杀人，所有监控却都证明她在现场。", "夏知微找出监控被提前合成的痕迹，遇见数据取证师陆既白。", "陆既白说：弹幕不是预言，是排期。"],
    ["排期表", "所有死亡都像被提前安排的内容日历。", "夏知微潜入热搜代运营公司，发现一份死亡排期表。", "排期表第七行是她母亲。"],
    ["母亲旧案", "母亲三年前车祸也曾上过同一家公司的热搜。", "夏知微重查旧案，发现母亲死前删除了一段客户录音。", "录音里出现陆既白父亲的声音。"],
    ["合作条件", "陆既白愿意帮她，但条件是夏知微公开承认婚礼事件失误。", "两人用假内讧引出幕后账号，夏知微被全网骂上热搜。", "骂她最狠的账号来自警方内网。"],
    ["内网账号", "警方内网账号参与操盘热搜，案件不再只是商业黑幕。", "夏知微追踪账号，发现它绑定母亲旧案调查员。", "调查员早在两年前已经死亡。"],
    ["死人发帖", "一个死人账号正在持续发布未来弹幕。", "陆既白恢复账号日志，发现登录地点是废弃电视台。", "电视台地下室仍在直播。"],
    ["地下直播", "废弃电视台里有一间无人直播间，循环播放所有受害者倒计时。", "夏知微关掉直播，却触发新的城市级推送。", "全城手机收到她的通缉令。"],
    ["全民审判", "夏知微被塑造成连环案主谋，舆论开始替凶手办案。", "她反向开直播，把自己变成诱饵。", "直播间弹幕第一次出现人工打字错误。"],
    ["错字线索", "一个错字暴露幕后人不是算法，而是熟人。", "夏知微根据输入习惯锁定母亲生前学生顾曼。", "顾曼见到她第一句话：你妈妈没有死透。"],
    ["没有死透", "顾曼说母亲临死前把一半证据上传到夏知微的账号。", "夏知微回到旧家，发现童年电脑仍在自动同步。", "电脑开机后弹出母亲自拍视频。"],
    ["母亲视频", "母亲在视频里承认自己参与过热搜审判系统。", "她说系统本为保护受害者，却被资本改成舆论杀人工具。", "视频最后点名陆既白父亲。"],
    ["父辈同谋", "陆既白父亲是系统第一任算法负责人。", "陆既白崩溃离开，夏知微独自面对下一场死亡推送。", "下一名受害者是顾曼。"],
    ["救下证人", "夏知微必须在全网仇恨中救下唯一证人。", "她用假爆料转移流量，带顾曼逃出医院。", "顾曼交出名单，第一名是夏知微老板。"],
    ["老板上桌", "夏知微老板一直在替幕后资本清理受害者。", "她回公司设局，让老板在内部会议承认排期表。", "老板说真正下单的人是陆既白。"],
    ["背叛热搜", "全网都相信陆既白是幕后买手。", "夏知微不信，查到陆既白账号被父亲旧权限劫持。", "陆既白主动自首，只为保护她。"],
    ["自首直播", "陆既白在直播中承认所有罪名，弹幕却开始倒计时夏知微死亡。", "夏知微冲进直播间，当众拆穿权限伪造。", "直播屏幕后出现幕后人的真实剪影。"],
    ["真实剪影", "幕后人竟是早已退休的城市传媒集团董事长。", "他把热搜审判系统当成城市情绪清洗工具。", "他宣布夏知微是最后一次公测。"],
    ["最后公测", "全城用户被迫投票决定夏知微是否有罪。", "夏知微拒绝辩解，公开所有受害者真实故事。", "投票系统开始崩溃。"],
    ["系统反噬", "被操控的弹幕第一次变成真实用户声音。", "受害者家属接力发声，董事长试图切断全网直播。", "夏知微母亲的账号重新上线。"],
    ["母亲账号", "母亲账号发布最后证据，证明董事长买下所有死亡排期。", "陆既白恢复底层日志，锁死证据链。", "董事长启动销毁程序。"],
    ["热搜归零", "夏知微用自己的账号承接销毁程序，让系统把全部罪证推上热搜。", "她短暂失去所有账号权限，却保住证据。", "全网热搜只剩一个词：真相。"],
    ["弹幕未完", "案件结束后，夏知微不再害怕弹幕。", "她和陆既白建立公开舆情取证平台，帮助普通人保存被压下的证据。", "新弹幕出现：下一次，不是热搜，是城市断电。"]
  ];
  return rows.map(([title, hook, summary, endingHook], index) => ({
    episodeNumber: index + 1,
    title,
    hook,
    summary,
    endingHook
  }));
}

function manhuaEpisode(episode) {
  const isFree = episode.episodeNumber <= 3;
  const promptBaseZh = `竖屏国漫分镜，末日寒潮，移动便利店堡垒，女主宁晚，冰雪城市，${episode.title}，强爽文反转，干净线稿，预留对白气泡空间`;
  const promptBaseEn = `vertical manhua storyboard, frozen apocalypse, mobile convenience-store fortress, heroine Ning Wan, icy city, ${episode.title}, power fantasy twist, clean line art, speech bubble space`;
  return {
    ...episode,
    characters: ["宁晚", "祁野", "周既明"],
    locations: ["冰封城市", "移动便利店堡垒"],
    reversalPoint: episode.endingHook,
    paidScope: !isFree,
    status: "published",
    aiManhuaDrama: {
      panelCount: 12,
      scriptText: `本集围绕“${episode.hook}”展开。画面从冰封城市的压迫感切入，突出宁晚的冷静和便利店堡垒的稀缺价值，中段用物资、系统或人性选择制造冲突，结尾落在“${episode.endingHook}”，推动用户继续追下一集。`,
      panels: [1, 2, 3, 4].map((panelNumber) => ({
        panelNumber,
        composition:
          panelNumber === 1
            ? "竖屏大远景，冰封城市和便利店堡垒形成强烈对比。"
            : panelNumber === 4
              ? "黑底特写格，关键反转信息占据画面中央。"
              : "中近景，宁晚在堡垒内部处理冲突。",
        characterPose:
          panelNumber === 1
            ? "宁晚站在便利店门口，雪风吹起外套。"
            : panelNumber === 4
              ? "宁晚盯着系统提示，眼神冷硬。"
              : "宁晚一手按住控制台，一手护住核心物资。",
        expression: panelNumber === 4 ? "震惊后迅速冷静" : "清醒、克制、带压迫感",
        dialogueBubble:
          panelNumber === 1
            ? episode.hook
            : panelNumber === 4
              ? episode.endingHook
              : "这一次，物资和命都在我手里。",
        narrationBox: panelNumber === 2 ? episode.summary : "",
        sfx: panelNumber === 1 ? "呼--" : panelNumber === 4 ? "滴" : "",
        aiPromptZh: `${promptBaseZh}，第${panelNumber}格，${panelNumber === 4 ? "强悬念结尾特写" : "冰雪压迫和堡垒内部细节"}`,
        aiPromptEn: `${promptBaseEn}, panel ${panelNumber}, ${panelNumber === 4 ? "strong cliffhanger close-up" : "icy pressure and fortress interior detail"}`
      })),
      layoutNotes: ["第1格必须建立冰封末世压迫感", "第4格用大字或系统提示承接下一集"]
    }
  };
}

function shortEpisode(episode) {
  const isFree = episode.episodeNumber <= 3;
  const promptBaseZh = `9:16竖屏，现代都市舆论悬疑短剧，热搜屏幕，未来弹幕，女主夏知微，${episode.title}，高反差电影光影，强反转`;
  const promptBaseEn = `vertical 9:16, modern urban public-opinion suspense short drama, trending screen, future bullet comments, heroine Xia Zhiwei, ${episode.title}, high-contrast cinematic lighting, strong twist`;
  return {
    ...episode,
    characters: ["夏知微", "陆既白", "顾曼"],
    locations: ["发布会后台", "热搜代运营公司", "废弃电视台"],
    reversalPoint: episode.endingHook,
    paidScope: !isFree,
    status: "published",
    aiShortDrama: {
      runtimeSeconds: 60,
      scriptText: `本集用“${episode.hook}”做开场强钩子。夏知微在舆论危机中快速判断局势，用公关、取证和直播反击推进真相；中段将${episode.summary}具体化为一场可拍摄的对峙或调查；结尾用“${episode.endingHook}”形成下一集追更。`,
      shots: [1, 2, 3, 4].map((shotNumber) => ({
        shotNumber,
        durationSeconds: shotNumber === 1 ? 6 : shotNumber === 4 ? 8 : 10,
        visual:
          shotNumber === 1
            ? "手机屏幕弹出未来弹幕，热搜红色数字跳动。"
            : shotNumber === 4
              ? "大屏幕定格关键证据，所有人安静。"
              : "夏知微在冷光空间里追查线索。",
        characterAction:
          shotNumber === 1
            ? "夏知微猛地抬头，压住慌乱。"
            : shotNumber === 4
              ? "她看向镜头，意识到更大的局。"
              : "她快速切换证据页面，与陆既白交换眼神。",
        cameraMovement:
          shotNumber === 1
            ? "从弹幕特写急推到女主眼睛。"
            : shotNumber === 4
              ? "缓慢推近证据大屏，再硬切黑屏。"
              : "手持跟拍穿过人群和屏幕光。",
        lighting: "冷蓝屏幕光和红色热搜提示形成对比。",
        dialogueOrSubtitle: shotNumber === 4 ? episode.endingHook : episode.hook,
        audioCue: shotNumber === 4 ? "低频鼓点后突然静音" : "密集消息提示音和心跳声",
        aiPromptZh: `${promptBaseZh}，镜头${shotNumber}，${shotNumber === 4 ? "证据大屏悬念结尾" : "屏幕光映脸，紧张调查"}`,
        aiPromptEn: `${promptBaseEn}, shot ${shotNumber}, ${shotNumber === 4 ? "evidence screen cliffhanger ending" : "screen glow on face, tense investigation"}`
      })),
      editingNotes: ["前3秒必须出现未来弹幕或热搜倒计时", "每集结尾保留证据反转"]
    }
  };
}

function masterMarkdown(master) {
  const title = master.title.zh;
  const episodes = master.episodeOutline
    .map(
      (episode) =>
        `| ${episode.episodeNumber} | ${episode.title} | ${episode.hook} | ${episode.summary} | ${episode.endingHook} | ${episode.isFreePreview ? "是" : "否"} |`
    )
    .join("\n");

  return `# 《${title}》剧本母版

## 0. 内部信息

| 字段 | 内容 |
| --- | --- |
| slug | ${master.slug} |
| 中文名 | ${master.title.zh} |
| 英文名 | ${master.title.en} |
| 主模式 | ${master.primaryMode} |
| 预计总集数 | ${master.episodeCount} |
| 免费集数 | ${master.freeEpisodeCount} |
| 目标平台 | ${master.recommendedPlatforms.join(" / ")} |
| 目标受众 | ${master.audienceTags.join(" / ")} |

## 1. 一句话爆点

${master.logline}

## 2. 剧情简介

${master.synopsis}

## 3. 主要角色

${master.characters
  .map((character) => `### ${character.name}\n\n${character.role}。${character.visualAnchor} 核心欲望：${character.desire} 核心秘密：${character.secret}`)
  .join("\n\n")}

## 4. 全集结构

${master.arcOutline.map((arc) => `- ${arc.episodes}：${arc.event} 反转：${arc.reversal}`).join("\n")}

## 5. 单集概要表

| 集数 | 标题 | 开场钩子 | 本集概要 | 结尾悬念 | 是否免费 |
| --- | --- | --- | --- | --- | --- |
${episodes}
`;
}

function buildManhuaProject() {
  const episodes = manhuaEpisodeData();
  const slug = "frozen-store-fortress";
  const master = {
    schemaVersion: "1.0.0",
    slug,
    title: {
      zh: "冰封末世：我把便利店开成移动堡垒",
      en: "Frozen Apocalypse: My Convenience Store Becomes a Moving Fortress"
    },
    primaryMode: "ai_manhua_drama",
    supportedModes: ["ai_manhua_drama"],
    freeEpisodeCount: 3,
    episodeCount: 24,
    logline: "寒潮灭世前三天，重生女主买下倒闭便利店，把它升级成会移动、会种菜、会打脸的末日堡垒。",
    synopsis:
      "宁晚上一世在寒潮末世中被前夫和社区联盟害死，重生回灾难前三天。她不再解释，也不再求救，而是买下倒闭便利店，囤货、改装、激活父亲留下的移动堡垒系统。暴雪封城后，便利店成为全城唯一还能移动的温暖空间。宁晚一边救下真正值得救的人，一边揭穿前夫、联盟和财团围绕堡垒项目设下的阴谋。最终她从只想独活的囤货者，变成带领幸存者建立移动城市的人。",
    category: "AI末世囤货移动堡垒漫剧",
    coverImage: "assets/covers/cover-frozen-store-fortress.png",
    recommendedPlatforms: ["抖音", "快手", "小红书", "TikTok", "YouTube Shorts"],
    audienceTags: ["末世生存", "系统逆袭", "囤货爽文", "移动堡垒", "AI漫剧"],
    productionDifficulty: "medium",
    characters: [
      {
        name: "宁晚",
        role: "女主 / 重生便利店老板",
        age: 27,
        visualAnchor: "亚洲女性，黑色高马尾，白色防寒冲锋衣，黑色战术裤，腰间挂着便利店钥匙和温度计。",
        desire: "活过寒潮并查清父亲留下移动堡垒的真相。",
        fear: "再次因为心软被背叛。",
        secret: "她拥有上一世完整死亡记忆。",
        arc: "从只想独活到公开蓝图建立移动城市。"
      },
      {
        name: "祁野",
        role: "男主 / 堡垒项目失败实验体",
        age: 22,
        visualAnchor: "亚洲青年，银灰短发，旧黑色防寒斗篷，颈侧有淡蓝色机械纹路。",
        desire: "找回自己作为人的记忆。",
        fear: "自己只是堡垒能源核心的替代品。",
        secret: "他上一世救过宁晚。",
        arc: "从危险实验体变成移动城市的守护者。"
      },
      {
        name: "周既明",
        role: "反派 / 前夫和盗版堡垒权限持有者",
        age: 31,
        visualAnchor: "亚洲男性，昂贵羊绒大衣，金丝眼镜，永远带着体面微笑。",
        desire: "夺走便利店堡垒控制权。",
        fear: "宁晚不再爱他也不再怕他。",
        secret: "他也带着重生记忆。",
        arc: "从体面前夫暴露为末世投机者。"
      }
    ],
    storyWorld: {
      setting: "近未来城市遭遇极端寒潮，普通建筑无法长期保温。",
      coreSystem: "便利店地下藏有移动堡垒系统，可扩容、种植、移动和防御。",
      hiddenRule: "堡垒技术原本属于公共避难所项目，被财团私有化。"
    },
    conflictDesign: {
      surfaceConflict: "宁晚用便利店堡垒对抗寒潮和抢夺物资的人群。",
      deepConflict: "父亲遗产、财团能源实验和上一世死亡真相互相勾连。",
      antagonistPressure: "前夫、社区联盟和财团轮流夺取堡垒。",
      emotionalTension: "宁晚必须在独活和救人之间不断选择。"
    },
    arcOutline: [
      { arc: "开局钩子", episodes: "1-3", purpose: "免费验证", event: "重生、囤货、寒潮封城。", reversal: "便利店拥有移动堡垒蓝图。" },
      { arc: "堡垒启动", episodes: "4-10", purpose: "付费承接", event: "堡垒移动、地下仓库、父亲遗产曝光。", reversal: "前夫也重生且有盗版权限。" },
      { arc: "城市救援", episodes: "11-16", purpose: "扩大格局", event: "北区求援、白塔广播、父亲被囚。", reversal: "寒潮不是天灾。" },
      { arc: "蓝图公开", episodes: "17-21", purpose: "价值升级", event: "公开堡垒蓝图，移动避难所群出现。", reversal: "独占优势换来全城生机。" },
      { arc: "春天结局", episodes: "22-24", purpose: "终局兑现", event: "天气塔、核心爆炸、移动城市诞生。", reversal: "便利店从囤货点变成文明火种。" }
    ],
    episodeOutline: episodes.map((episode) => ({
      ...episode,
      arc: episode.episodeNumber <= 3 ? "开局钩子" : episode.episodeNumber <= 10 ? "堡垒启动" : episode.episodeNumber <= 16 ? "城市救援" : episode.episodeNumber <= 21 ? "蓝图公开" : "春天结局",
      isFreePreview: episode.episodeNumber <= 3,
      paidValue: episode.episodeNumber <= 3 ? "" : "持续解锁移动堡垒、父亲遗产和寒潮真相。",
      reversalPoint: episode.endingHook,
      productionPriority: "high"
    })),
    modeAdaptation: {
      aiManhuaDrama: {
        aspectRatio: "9:16",
        panelCount: { min: 10, max: 14 },
        visualStyle: "冰雪末世国漫，移动便利店堡垒，冷白雪雾和暖黄店灯对比。",
        globalPromptZh: "竖屏国漫分镜，末日寒潮，移动便利店堡垒，冰封城市，女主宁晚，系统逆袭，囤货爽文，干净线稿，强情绪特写，预留对白气泡空间。",
        globalPromptEn: "vertical manhua storyboard, frozen apocalypse, mobile convenience-store fortress, icy city, heroine Ning Wan, system comeback, stockpiling power fantasy, clean line art, emotional close-up, speech bubble space."
      }
    },
    commercialPolicy: {
      freeScope: "第 1-3 集验证包。",
      buyout: "一次性开放第 4-24 集完整漫剧制作包。",
      payPerEpisode: "优先开放第 4-6 集作为末世堡垒付费承接。",
      revenueShare: "开放第 4-10 集作为第一批分成合作内容。",
      forbidden: ["不得套用现有小说或动漫 IP", "不得转售原始制作包", "不得绕开授权续写后续付费集"]
    }
  };
  return { master, episodes: episodes.map(manhuaEpisode) };
}

function buildShortDramaProject() {
  const episodes = shortDramaEpisodeData();
  const slug = "bullet-screen-prophecy";
  const master = {
    schemaVersion: "1.0.0",
    slug,
    title: {
      zh: "她的弹幕预言成真",
      en: "Her Bullet Comments Come True"
    },
    primaryMode: "ai_short_drama",
    supportedModes: ["ai_short_drama"],
    freeEpisodeCount: 3,
    episodeCount: 24,
    logline: "危机公关女王突然看见未来弹幕，发现每一条热搜都不是舆论，而是一张提前排好的杀人日历。",
    synopsis:
      "夏知微是最擅长压热搜的危机公关经理。一次豪门婚礼发布会前，她突然看见未来弹幕预告新娘死亡。事故成真后，夏知微被卷入一连串由热搜操控的死亡事件。她与数据取证师陆既白联手，追查废弃电视台、死人账号、城市传媒集团和母亲旧案。最终她发现所谓未来弹幕不是超能力，而是一套用舆论制造审判、用热搜掩盖谋杀的城市级系统。",
    category: "现代都市舆论悬疑女性成长短剧",
    coverImage: "assets/covers/cover-bullet-screen-prophecy.png",
    recommendedPlatforms: ["抖音", "快手", "小红书", "TikTok", "YouTube Shorts", "ReelShort"],
    audienceTags: ["女性成长", "现实悬疑", "热搜舆论", "公关反杀", "强反转"],
    productionDifficulty: "medium",
    characters: [
      {
        name: "夏知微",
        role: "女主 / 危机公关经理",
        age: 30,
        visualAnchor: "亚洲女性，利落黑色短发，白衬衫和深色西装，冷静眼神，手机不离手。",
        desire: "查清母亲旧案并终止热搜审判系统。",
        fear: "自己最擅长的舆论工具正在杀人。",
        secret: "母亲曾参与系统早期设计。",
        arc: "从压热搜的人变成公开真相的人。"
      },
      {
        name: "陆既白",
        role: "男主 / 数据取证师",
        age: 32,
        visualAnchor: "亚洲男性，黑框眼镜，深灰衬衫，多屏数据光映脸。",
        desire: "证明父亲不是系统罪魁祸首。",
        fear: "自己的技术再次被用于伪造真相。",
        secret: "父亲是系统第一任算法负责人。",
        arc: "从旁观取证到主动承担。"
      },
      {
        name: "顾曼",
        role: "证人 / 女主母亲旧案学生",
        age: 28,
        visualAnchor: "亚洲女性，浅色风衣，疲惫眼神，手里总攥着旧 U 盘。",
        desire: "把老师留下的证据交出去。",
        fear: "自己也被写进死亡排期。",
        secret: "她保留了母亲旧案一半证据。",
        arc: "从躲藏者变成证人。"
      }
    ],
    storyWorld: {
      setting: "现实都市中，热搜、公关、直播和数据取证深度绑定。",
      coreSystem: "热搜审判系统可以提前排期事故、伪造舆论和引导全民投票。",
      hiddenRule: "所谓未来弹幕来自系统内测泄漏，不是超自然预言。"
    },
    conflictDesign: {
      surfaceConflict: "夏知微必须阻止未来弹幕预告的死亡事件。",
      deepConflict: "每个热搜事故都指向母亲旧案和城市传媒集团。",
      antagonistPressure: "幕后资本用全民舆论伪装审判。",
      emotionalTension: "女主必须摧毁自己赖以成名的公关体系。"
    },
    arcOutline: [
      { arc: "开局钩子", episodes: "1-3", purpose: "免费验证", event: "未来弹幕、新娘死亡、排期表曝光。", reversal: "弹幕不是预言而是排期。" },
      { arc: "旧案牵出", episodes: "4-10", purpose: "付费承接", event: "死亡排期表、母亲旧案、地下直播。", reversal: "死人账号还在发帖。" },
      { arc: "证人升级", episodes: "11-16", purpose: "拉高追更", event: "顾曼、母亲视频、老板上桌。", reversal: "女主公司也参与清理。" },
      { arc: "男主背叛", episodes: "17-20", purpose: "情绪爆点", event: "陆既白背锅自首，全城投票。", reversal: "父亲旧权限劫持男主账号。" },
      { arc: "系统反噬", episodes: "21-24", purpose: "终局兑现", event: "母亲账号上线，热搜归零。", reversal: "真相成为唯一热搜。" }
    ],
    episodeOutline: episodes.map((episode) => ({
      ...episode,
      arc: episode.episodeNumber <= 3 ? "开局钩子" : episode.episodeNumber <= 10 ? "旧案牵出" : episode.episodeNumber <= 16 ? "证人升级" : episode.episodeNumber <= 20 ? "男主背叛" : "系统反噬",
      isFreePreview: episode.episodeNumber <= 3,
      paidValue: episode.episodeNumber <= 3 ? "" : "持续解锁热搜排期、母亲旧案和幕后系统。",
      reversalPoint: episode.endingHook,
      productionPriority: "high"
    })),
    modeAdaptation: {
      aiShortDrama: {
        aspectRatio: "9:16",
        episodeDurationSeconds: { min: 45, max: 75 },
        visualStyle: "现代都市冷光舆论战，热搜红色数据、手机弹幕和直播大屏。",
        globalPromptZh: "9:16竖屏，现代都市舆论悬疑短剧，热搜红色数据，未来弹幕，危机公关女性，数据取证师，冷蓝屏幕光，高反差电影光影，强反转。",
        globalPromptEn: "vertical 9:16, modern urban public-opinion suspense short drama, red trending-topic data, future bullet comments, female crisis PR strategist, digital forensic analyst, cold blue screen glow, high-contrast cinematic lighting, strong twist."
      }
    },
    commercialPolicy: {
      freeScope: "第 1-3 集验证包。",
      buyout: "一次性开放第 4-24 集完整短剧制作包。",
      payPerEpisode: "优先开放第 4-6 集作为热搜悬疑付费承接。",
      revenueShare: "开放第 4-10 集作为第一批分成合作内容。",
      forbidden: ["不得伪造成真实案件", "不得转售原始制作包", "不得绕开授权续写后续付费集"]
    }
  };
  return { master, episodes: episodes.map(shortEpisode) };
}

function productionMode(master) {
  const short = master.modeAdaptation.aiShortDrama;
  const manhua = master.modeAdaptation.aiManhuaDrama;
  return {
    slug: master.slug,
    primaryMode: master.primaryMode,
    supportedModes: master.supportedModes,
    defaultAspectRatio: "9:16",
    episodeDurationSeconds: short?.episodeDurationSeconds || { min: 45, max: 75 },
    panelCount: manhua?.panelCount || { min: 10, max: 14 },
    visualStyle: {
      ai_short_drama: short?.visualStyle || "",
      ai_manhua_drama: manhua?.visualStyle || ""
    }
  };
}

function imageTasks(master) {
  return {
    slug: master.slug,
    mode: master.primaryMode,
    tasks: [
      {
        id: `${master.slug}-cover`,
        episodeNumber: null,
        assetType: "cover",
        mode: master.primaryMode,
        promptZh: master.modeAdaptation.aiShortDrama?.globalPromptZh || master.modeAdaptation.aiManhuaDrama?.globalPromptZh,
        promptEn: master.modeAdaptation.aiShortDrama?.globalPromptEn || master.modeAdaptation.aiManhuaDrama?.globalPromptEn,
        outputPath: `public/site/${master.coverImage}`,
        status: "planned"
      }
    ]
  };
}

function writeProject(project) {
  const { master, episodes } = project;
  const baseDir = path.join(projectRoot, "content-source", master.slug);
  writeJson(path.join(baseDir, "master.json"), master);
  writeText(path.join(baseDir, "master.md"), masterMarkdown(master));
  writeJson(path.join(baseDir, "production-mode.json"), productionMode(master));
  episodes.forEach((episode) => {
    writeJson(path.join(baseDir, "episodes", `episode-${String(episode.episodeNumber).padStart(3, "0")}.json`), episode);
  });
  writeText(
    path.join(baseDir, "visual-references", "characters.md"),
    `# 《${master.title.zh}》角色视觉参考\n\n${master.characters
      .map((character) => `## ${character.name}\n\n${character.visualAnchor}\n\n- 角色：${character.role}\n- 欲望：${character.desire}\n- 秘密：${character.secret}\n`)
      .join("\n")}`
  );
  writeJson(path.join(baseDir, "image-tasks", "storyboard-reference-tasks.json"), imageTasks(master));
}

function main() {
  ensureDirectory(path.join(projectRoot, "public", "site", "assets", "covers"));
  coverSvg({
    title: "冰封末世",
    subtitle: "AI漫剧 · 囤货逆袭 · 移动堡垒",
    palette: ["#102A43", "#7DD3FC", "#E0F2FE", "#BAE6FD"],
    outputPath: "public/site/assets/covers/cover-frozen-store-fortress-fallback.svg"
  });
  coverSvg({
    title: "弹幕预言",
    subtitle: "AI短剧 · 热搜悬疑 · 女性反杀",
    palette: ["#2A132E", "#F97316", "#FFF7ED", "#FDBA74"],
    outputPath: "public/site/assets/covers/cover-bullet-screen-prophecy-fallback.svg"
  });

  const projects = [buildManhuaProject(), buildShortDramaProject()];
  projects.forEach(writeProject);
  console.log(
    JSON.stringify(
      {
        generated: projects.map(({ master, episodes }) => ({
          slug: master.slug,
          title: master.title.zh,
          mode: master.primaryMode,
          episodes: episodes.length,
          coverImage: master.coverImage
        }))
      },
      null,
      2
    )
  );
}

if (require.main === module) {
  main();
}
