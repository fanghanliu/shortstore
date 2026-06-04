const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.join(__dirname, "..");
const directivePath = path.join(projectRoot, "docs", "advanced-script-enrichment-directive.md");
const defaultSlugs = ["frozen-store-fortress", "bullet-screen-prophecy"];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function assertDirectiveExists() {
  if (!fs.existsSync(directivePath)) {
    throw new Error(`Advanced enrichment directive not found: ${directivePath}`);
  }
}

function cleanSentence(value) {
  return String(value || "").trim().replace(/[。！？!?]*$/, "");
}

function sentence(value) {
  const normalized = cleanSentence(value);
  return normalized ? `${normalized}。` : "";
}

function joinSentences(lines) {
  return lines.map(sentence).filter(Boolean).join("");
}

function promptPart(value) {
  return String(value || "")
    .trim()
    .replace(/[。！？!?；;，,、\s]+$/u, "");
}

function promptZh(...parts) {
  return parts.map(promptPart).filter(Boolean).join("，");
}

function timecode(startSecond, duration) {
  const start = String(startSecond).padStart(2, "0");
  const end = String(startSecond + duration).padStart(2, "0");
  return `00:${start}-00:${end}`;
}

function baseEpisode(episode) {
  return {
    ...episode,
    hook: episode.baseHook || episode.hook,
    summary: episode.baseSummary || episode.summary,
    endingHook: episode.baseEndingHook || episode.endingHook
  };
}

function englishPromptBase(mode, episodeNumber) {
  if (mode === "ai_manhua_drama") {
    return `vertical manhua storyboard, cinematic frozen-apocalypse drama, mobile convenience-store fortress, heroine Ning Wan, episode ${episodeNumber}, expressive eye acting, layered foreground blur, dramatic depth of field, controlled camera language, strong cliffhanger`;
  }

  return `vertical 9:16 cinematic short drama, modern urban public-opinion suspense, future bullet comments, heroine Xia Zhiwei, episode ${episodeNumber}, readable screen text, restrained acting, shallow foreground blur, high-contrast screen light, fast thriller pacing`;
}

function negativePrompt(mode) {
  if (mode === "ai_manhua_drama") {
    return "避免脸部漂移、手指畸形、文字乱码、主体被遮挡、气泡压住眼神、背景无意义堆叠、风格突然写实化、情绪表演僵硬。";
  }

  return "避免过曝、脸部变形、口型错位、路人抢主体、字幕遮挡眼神、镜头无目的晃动、现代场景混入古装元素、人物表演像摆拍。";
}

function buildAdvancedScriptText(episode, mode) {
  const isManhua = mode === "ai_manhua_drama";
  const protagonist = isManhua ? "宁晚" : "夏知微";
  const worldSignal = isManhua ? "冰封街区、堡垒暖光和系统警告" : "热搜红光、未来弹幕和城市玻璃反射";

  return joinSentences([
    `本集开场不解释设定，直接落在“${episode.hook}”这个瞬间，让观众先感到人物被逼到选择边缘`,
    `${protagonist}的当下目标不是赢得争吵，而是在有限时间内判断谁可信、什么信息被隐藏、自己是否要承担更大的代价`,
    `场面调度围绕${worldSignal}展开，主体始终被压在空间边缘，前景遮挡和背景景深共同制造窥视感与窒息感`,
    `中段通过沉默、视线闪避、手指收紧和短促呼吸替代直白解释，让冲突从外部压力转为人物内心的权衡`,
    `转折处必须提前埋下一个可被观众回想起来的细节，再让主角用反常选择改变权力关系`,
    `结尾停在“${episode.endingHook}”，只释放一个新的危险或真相，不解释答案，让观众带着问题进入下一集`
  ]);
}

function advancedSummary(episode, mode) {
  const isManhua = mode === "ai_manhua_drama";
  return joinSentences([
    episode.summary,
    `本集按“铺垫、压迫、转折、爆发、余韵”推进：铺垫人物当下目标，压迫来自${isManhua ? "极寒环境和道德勒索" : "舆论倒计时和证据失真"}，转折来自一个被忽略的细节，爆发不是喊叫而是主角做出反常选择，余韵落在新的危机`,
    `人物关系上，表层冲突是立场对抗，隐藏关系是双方都掌握对方不知道的信息，因此台词必须克制、短促、有潜台词`
  ]);
}

function manhuaBeatTemplates(episode) {
  return [
    {
      function: "铺垫钩子",
      duration: 5,
      visualDesign: "竖屏大远景，冰封街区被雪雾压低，移动便利店堡垒停在道路中央，暖黄店灯像唯一的安全区。宁晚站在门内偏右位置，门外人群被结霜玻璃切成模糊剪影。",
      cameraLanguage: "低机位远景缓慢推进到中景，前景用结霜玻璃遮挡，焦点从雪雾切到宁晚眼睛，利用长焦压缩门内外距离，制造窒息感。",
      characterAction: "宁晚没有立刻靠近门，肩颈僵住半秒，右手停在门锁上方又收回。她先看系统温度，再看人群里最安静的那个人。",
      dramaticPurpose: `核心情绪是克制的警觉。人物目标是判断“${episode.hook}”背后的真实风险，隐藏冲突是她想救人但害怕重蹈上一世被利用的覆辙。`,
      dialogue: episode.hook,
      soundDesign: "低频风声压住人声，门框轻微震动，远处有玻璃被冻裂的细响，宁晚的呼吸被刻意放大。",
      endingHook: "系统界面短暂闪红，却没有说明原因。"
    },
    {
      function: "压迫升级",
      duration: 6,
      visualDesign: "中近景，宁晚半边脸被蓝色系统光照亮，身后货架整齐到近乎冷酷。门外有人把孩子推到最前面，玻璃上的掌印一层叠一层。",
      cameraLanguage: "正反打建立权力关系，门内稳定构图，门外手持晃动；前景掌印虚化成压迫纹理，背景只保留货架轮廓。",
      characterAction: "宁晚的手指轻轻收紧，指节发白，但表情没有软下来。她眨眼变慢，像是在把同情压回去。",
      dramaticPurpose: "这一镜的任务是把冲突从求救变成道德审判。观众应感觉她不开门不是冷血，而是在对抗被操控的善意。",
      dialogue: "先别喊。把手从孩子肩上拿开。",
      soundDesign: "拍门声、人群喘息声、孩子压抑的抽泣声和系统提示音错位叠加。",
      endingHook: "孩子身后那只手缩回去时，袖口露出一枚熟悉标记。"
    },
    {
      function: "信息转折",
      duration: 7,
      visualDesign: "画面切到系统识别框，门外某个物件被高亮：钥匙碎片、旧地图角或芯片编号。宁晚的倒影与标记重合在玻璃上。",
      cameraLanguage: "主观镜头进入识别界面，再用微距特写锁住物件；焦点变化从道具移到宁晚瞳孔，完成心理转场。",
      characterAction: "她向前半步又停住，眼神短暂闪避，像是已经认出答案却不愿承认。左手按住胸口的旧伤位置。",
      dramaticPurpose: "这一镜埋下反转前置线索。人物当下目标从防御变成验证，隐藏冲突是这件物品可能连接她父亲或上一世死亡真相。",
      dialogue: "你从哪儿拿到它的？",
      soundDesign: "外界声音突然降下去，只剩扫描锁定声和衣料摩擦声。",
      endingHook: "识别结果停在 99%，迟迟不跳到 100%。"
    },
    {
      function: "选择爆发",
      duration: 7,
      visualDesign: "宁晚背对人群站在控制台前，红色警戒光从她肩侧切过。门外人群在背景里变成一片不稳定的影子。",
      cameraLanguage: "从手部特写上摇到背影，构图留出大量空白，让沉默承担情绪。镜头不切，等她完成选择。",
      characterAction: "她没有按正门按钮，而是把手移到侧门通道。动作很轻，但停顿很长，像是在和上一世的自己告别。",
      dramaticPurpose: "爆发不是情绪失控，而是规则重写。人物关系发生变化：她不再被别人定义善恶，而是开始掌控救援条件。",
      dialogue: "我会救人。但门，按我的规矩开。",
      soundDesign: "所有人声抽空，只剩分段解锁声。最后一个锁扣响起时，低频鼓点进入。",
      endingHook: "侧门只开一道缝，风雪里先递进来的不是人，而是一张带血的蓝图。"
    },
    {
      function: "余韵悬念",
      duration: 8,
      visualDesign: "黑底特写，蓝图被暖灯照亮，边缘有烧焦痕迹。宁晚抬眼，玻璃那头的人终于露出半张脸。",
      cameraLanguage: "长焦凝视压缩两人距离，前景用蓝图边缘遮挡人物嘴部，只让眼神对峙。最后硬切到系统档案标题。",
      characterAction: "宁晚没有追问，先把蓝图压在桌面上。她的指尖停在父亲签名处，呼吸乱了一拍。",
      dramaticPurpose: "余韵制造新的问题：对方为什么知道蓝图，父亲到底隐瞒了什么，宁晚上一世的死是否并非偶然。",
      dialogue: episode.endingHook,
      soundDesign: "远处人群声重新涌入，但被门关上的一声闷响切断。系统档案解锁音像从水下传来。",
      endingHook: episode.endingHook
    }
  ];
}

function buildManhuaPanels(episode) {
  const baseEn = englishPromptBase("ai_manhua_drama", episode.episodeNumber);
  const beats = manhuaBeatTemplates(episode);
  const expanded = [
    ...beats.slice(0, 2),
    {
      ...beats[1],
      function: "视线误导",
      visualDesign: "镜头不拍喊得最大声的人，而拍人群边缘那个始终沉默的影子。雪雾在他脚边反向流动，暗示他与普通求救者不同。",
      cameraLanguage: "以前景人群肩膀遮挡主体，形成窥视感；焦点在沉默者和宁晚眼睛之间来回拉扯。",
      characterAction: "宁晚的目光越过喧闹人群，停在沉默者手腕的旧伤上。她没有说话，只把监控画面放大。",
      dramaticPurpose: "利用视线引导制造信息钩子，让观众意识到真正重要的人并不在画面中心。",
      dialogue: "别看门口。看最后一排。",
      endingHook: "沉默者像是知道自己被看见，缓慢抬头。"
    },
    beats[2],
    {
      ...beats[2],
      function: "关系反打",
      visualDesign: "宁晚与沉默者隔着玻璃正反打，两人眼睛处在同一水平线。门外风雪很大，但他站得异常稳定。",
      cameraLanguage: "反打镜头强化双方权力关系；宁晚在门内占据光源，沉默者在门外被雪雾吞没。",
      characterAction: "他没有乞求，只把物件贴到玻璃上。宁晚的下颌轻微绷紧，像在忍住一句旧问题。",
      dramaticPurpose: "表层关系是求救者和守门人，隐藏关系是两人都知道上一世的某个碎片。",
      dialogue: "你不是第一次见我。",
      endingHook: "宁晚身后的系统自动弹出‘上一世接触记录’。"
    },
    beats[3],
    {
      ...beats[3],
      function: "环境叙事",
      visualDesign: "侧门通道亮起一排应急灯，灯光一盏一盏点亮，像把人群切成可被筛选的片段。",
      cameraLanguage: "运动镜头跟随灯光推进，背景人群逐渐失焦，主体落在宁晚设下的通行线。",
      characterAction: "宁晚抬手示意所有人后退半步，她的声音不高，但每个人都停住了。",
      dramaticPurpose: "用空间调度体现主角重新掌控局面，让救援从情绪勒索变成规则谈判。",
      dialogue: "想活，就先学会排队。",
      endingHook: "队伍里有人悄悄摸向腰间的金属物。"
    },
    beats[4],
    {
      ...beats[4],
      function: "强钩子定格",
      visualDesign: "最后一格只保留宁晚的眼睛、蓝图父亲签名和系统红色倒计时，其他画面全部压暗。",
      cameraLanguage: "极近特写，留白构图，信息集中在三点视觉线上：眼睛、签名、倒计时。",
      characterAction: "她的眼神从震动恢复冷静，手指按住倒计时旁的确认键，却没有立刻按下。",
      dramaticPurpose: "把情绪从震惊压回行动，让观众知道下一集不是解释，而是更大的选择。",
      dialogue: "我只问一遍。他在哪？",
      endingHook: "倒计时归零前一秒，画面切黑。"
    }
  ];

  return expanded.map((beat, index) => ({
    panelNumber: index + 1,
    sceneHeading: `格 ${index + 1}｜${timecode(index * 6, beat.duration)}｜${beat.function}`,
    timecode: timecode(index * 6, beat.duration),
    durationSeconds: beat.duration,
    function: beat.function,
    visualDesign: beat.visualDesign,
    cameraLanguage: beat.cameraLanguage,
    characterAction: beat.characterAction,
    dramaticPurpose: beat.dramaticPurpose,
    dialogue: beat.dialogue,
    soundDesign: beat.soundDesign,
    endingHook: beat.endingHook,
    aiPromptZh: promptZh(
      `竖屏国漫分镜，第${episode.episodeNumber}集《${episode.title}》`,
      beat.function,
      beat.visualDesign,
      beat.cameraLanguage,
      "人物表演克制真实，强悬念，预留对白气泡空间"
    ),
    aiPromptEn: `${baseEn}, panel ${index + 1}, cinematic composition, restrained performance, expressive eyes, foreground obstruction, depth layers, motivated camera movement, strong suspense`,
    negativePrompt: negativePrompt("ai_manhua_drama"),
    composition: beat.visualDesign,
    dialogueBubble: beat.dialogue,
    soundEffect: beat.soundDesign,
    foregroundBlur: "以前景雪雾、结霜玻璃或货架边缘形成窥视感，但不遮挡眼神。",
    focusSubject: "焦点优先落在说话者眼睛和关键道具上。",
    backgroundDepth: "背景保留堡垒、雪雾、系统界面和人群层次，形成空间压迫。",
    cameraMovement: beat.cameraLanguage,
    action: beat.characterAction,
    weirdMotion: "风雪、灯光和衣料摆动参与叙事，推动情绪递进。"
  }));
}

function shortDramaBeatTemplates(episode) {
  return [
    {
      function: "铺垫钩子",
      duration: 5,
      visualDesign: "发布会后台或冷光会议室内，手机屏幕突然弹出未来弹幕，红色倒计时压在夏知微脸侧。她站在画面边缘，不在中心，像已经被舆论推出安全区。",
      cameraLanguage: "从屏幕文字极近特写急推到眼睛，焦点先锁弹幕，再切到她瞳孔里的红光。前景用手机边框做遮挡，形成窥视感。",
      characterAction: "夏知微没有惊叫，只是眨眼慢了一拍。她的拇指悬在删除键上，最后没有按下。",
      dramaticPurpose: `核心任务是让观众立即相信“${episode.hook}”会改变现场权力关系。她的目标是判断这是不是陷害，隐藏恐惧是自己最熟悉的舆论工具正在失控。`,
      dialogue: episode.hook,
      soundDesign: "消息提示音连续叠加，外场主持声被门板隔成闷响，最后只剩一声低频心跳。",
      endingHook: "弹幕消失后，屏幕反光里出现一个不该在场的人。"
    },
    {
      function: "压迫升级",
      duration: 7,
      visualDesign: "人群、媒体灯和热搜榜同时进入背景，夏知微被挤在玻璃门和灯架之间，空间被压得很窄。",
      cameraLanguage: "手持跟拍穿过人群，利用长焦压缩距离，背景闪光灯虚化成刺眼光斑。",
      characterAction: "她侧身避开一个记者，肩膀撞到门框，但没有停。她低头快速确认时间，呼吸变短。",
      dramaticPurpose: "这一镜把倒计时变成身体压力。她要救人，但不能让别人知道自己知道未来。",
      dialogue: "让开。现在不是提问时间。",
      soundDesign: "脚步声、衣料摩擦、快门声和远处倒数声混在一起。",
      endingHook: "倒计时少了十秒，但现场流程没有任何人发现异常。"
    },
    {
      function: "阻碍与误解",
      duration: 8,
      visualDesign: "对手或上级挡在她前方，人物站位形成一条窄通道。夏知微在低位，对方占据灯下高位。",
      cameraLanguage: "低角度反打对方，高角度压夏知微，建立权力不平衡；前景灯架遮住两人一部分脸。",
      characterAction: "她停在半步外，眼神先落到对方手里的流程表，再抬眼。她没有解释，只把手机屏幕扣在掌心。",
      dramaticPurpose: "冲突不靠争吵，而靠信息差：她知道危险，对方只以为她又要压热搜。",
      dialogue: "你要的是体面，我要的是别出事。",
      soundDesign: "对方说话时背景声突然清晰，像整个现场都在围观她。",
      endingHook: "流程表上被圈出的时间，正好对应弹幕倒计时。"
    },
    {
      function: "取证推进",
      duration: 8,
      visualDesign: "夏知微切到后台数据页面，屏幕冷蓝光照亮半张脸，另一半脸藏在阴影里。热搜词条像审判名单一样向上滚动。",
      cameraLanguage: "手部特写、屏幕特写和眼神反打快速交叉剪辑；用焦点拉移让观众先看到错位时间戳。",
      characterAction: "她的食指停在一个异常账号上，指腹轻轻敲两下桌面，这是她强迫自己冷静的习惯。",
      dramaticPurpose: "人物目标从阻止事故升级为寻找幕后操作者。观众获得新信息：弹幕不是预言，而可能是排期。",
      dialogue: "这不是预警。是有人提前排好了。",
      soundDesign: "键盘声被放大，外场掌声与屏幕刷新声错位。",
      endingHook: "异常账号的头像，短暂闪成她母亲旧案里的标记。"
    },
    {
      function: "关系对峙",
      duration: 8,
      visualDesign: "夏知微与关键人物隔着一张桌子或一道玻璃门对峙，桌面上只有手机、录音笔和一杯未动的水。",
      cameraLanguage: "正反打保持眼神高度一致，利用玻璃反射让两张脸短暂重叠，暗示隐藏关系。",
      characterAction: "她没有坐下，只把录音笔推过去。对方伸手时，她先一步按住录音笔边缘。",
      dramaticPurpose: "这一镜暴露表层合作和隐藏防备。她需要对方帮忙，但不愿交出主动权。",
      dialogue: "你可以不信我。别耽误我。",
      soundDesign: "空调低频、玻璃外的远处人声、录音笔开启的轻响。",
      endingHook: "录音波形里出现了第三个人的呼吸声。"
    },
    {
      function: "反转线索",
      duration: 7,
      visualDesign: "一个小错误被放大：错字、后台账号、时间戳、镜像反射或弹幕输入习惯。画面只给观众半秒阅读时间。",
      cameraLanguage: "微距特写进入细节，再快速拉回夏知微表情。焦点变化代替解释，让观众自己完成推理。",
      characterAction: "她突然停住，眼神没有看屏幕，而是看向玻璃反射中的某个人。手指从鼠标上慢慢移开。",
      dramaticPurpose: "反转有前置铺垫：真正暴露幕后人的不是大证据，而是一个人的习惯。",
      dialogue: "这个字，算法不会打错。",
      soundDesign: "所有环境声短暂消失，只剩一声极轻的电流声。",
      endingHook: "镜面反射里，那个人也正看着她。"
    },
    {
      function: "爆发选择",
      duration: 8,
      visualDesign: "全场屏幕同时刷新，夏知微被舆论推到画面边缘。红色热搜覆盖她的名字，像一张正在收紧的网。",
      cameraLanguage: "环绕半圈制造围困感，随后突然稳定成正面中近景，让她的选择像一次反击。",
      characterAction: "她没有辩解，反而打开直播。说话前，她先把袖口拉平，压住发抖的手腕。",
      dramaticPurpose: "爆发不是情绪宣泄，而是主动把自己变成诱饵，改变敌我关系。",
      dialogue: "想审我，可以。把镜头打开。",
      soundDesign: "弹幕刷屏声、低频鼓点和突然进入的直播提示音叠加。",
      endingHook: "直播间第一条弹幕不是骂她，而是一个死亡倒计时。"
    },
    {
      function: "余韵钩子",
      duration: 9,
      visualDesign: "证据大屏定格，夏知微看向镜头，身后所有人都在动，只有她静止。屏幕角落出现新名字或新时间。",
      cameraLanguage: "缓慢推近证据大屏，再反打她的眼睛，最后硬切黑屏。留白构图让信息停在观众脑中。",
      characterAction: "她读到最后一行时没有立刻说话，只轻轻吸了一口气，像终于确认最坏的答案。",
      dramaticPurpose: "余韵制造新问题：她救下这一场，却发现下一场已经开始。观众必须追下一集才能知道名单背后的人是谁。",
      dialogue: episode.endingHook,
      soundDesign: "低频鼓点停止，只剩单次系统提示音和她压低的呼吸。",
      endingHook: episode.endingHook
    }
  ];
}

function buildShortDramaShots(episode) {
  const baseEn = englishPromptBase("ai_short_drama", episode.episodeNumber);
  let cursor = 0;

  return shortDramaBeatTemplates(episode).map((beat, index) => {
    const shot = {
      shotNumber: index + 1,
      sceneHeading: `镜头 ${index + 1}｜${timecode(cursor, beat.duration)}｜${beat.function}`,
      timecode: timecode(cursor, beat.duration),
      durationSeconds: beat.duration,
      function: beat.function,
      visualDesign: beat.visualDesign,
      cameraLanguage: beat.cameraLanguage,
      characterAction: beat.characterAction,
      dramaticPurpose: beat.dramaticPurpose,
      dialogue: beat.dialogue,
      soundDesign: beat.soundDesign,
      endingHook: beat.endingHook,
      aiPromptZh: promptZh(
        `9:16竖屏现代都市悬疑短剧，第${episode.episodeNumber}集《${episode.title}》`,
        beat.function,
        beat.visualDesign,
        beat.cameraLanguage,
        "真实表演，克制台词，强信息钩子"
      ),
      aiPromptEn: `${baseEn}, shot ${index + 1}, cinematic blocking, readable screen evidence, restrained performance, subtle breathing, eye avoidance, foreground obstruction, layered depth of field, motivated camera movement, strong hook`,
      negativePrompt: negativePrompt("ai_short_drama"),
      visual: beat.visualDesign,
      dialogueOrSubtitle: beat.dialogue,
      audioCue: beat.soundDesign,
      foregroundBlur: "以前景手机边框、路人肩膀、玻璃反光形成遮挡，保留窥视感。",
      focusSubject: "焦点锁定夏知微眼睛、关键屏幕文字和异常证据。",
      backgroundDepth: "背景保留媒体灯、热搜榜、会议室玻璃和城市夜景，形成舆论压迫。",
      cameraMovement: beat.cameraLanguage,
      actorDirection: beat.characterAction,
      editingRhythm: "每 5-8 秒必须有新信息；证据出现时给 0.5 秒阅读停顿。"
    };
    cursor += beat.duration;
    return shot;
  });
}

function enrichEpisode(master, rawEpisode) {
  const episode = baseEpisode(rawEpisode);
  const isManhua = master.primaryMode === "ai_manhua_drama";
  const mode = isManhua ? "ai_manhua_drama" : "ai_short_drama";
  const scriptText = buildAdvancedScriptText(episode, mode);

  const enriched = {
    ...rawEpisode,
    baseHook: episode.hook,
    baseSummary: episode.summary,
    baseEndingHook: episode.endingHook,
    summary: advancedSummary(episode, mode),
    productionValue: `本集交付价值不只是剧情摘要，而是按高级深化指令提供可直接制作的影视化执行稿：完整正文、${isManhua ? "逐格漫剧分镜" : "逐镜头短剧执行表"}、戏剧目的、台词潜台词、视听调度、音效环境、结尾钩子、中英文提示词和反向提示词。`,
    scriptText
  };

  if (isManhua) {
    enriched.aiManhuaDrama = {
      ...(rawEpisode.aiManhuaDrama || {}),
      directive: "docs/advanced-script-enrichment-directive.md",
      panelCount: 9,
      scriptText,
      panels: buildManhuaPanels(episode),
      layoutNotes: [
        "第一格必须建立强钩子和空间压迫，不用说明文解释设定。",
        "中段通过前景遮挡、反打镜头、长焦压缩和沉默动作体现人物动机。",
        "反转必须有前置细节，不能突然揭露。",
        "最后一格只释放一个新问题或危机，保留追更理由。"
      ]
    };
  } else {
    enriched.aiShortDrama = {
      ...(rawEpisode.aiShortDrama || {}),
      directive: "docs/advanced-script-enrichment-directive.md",
      runtimeSeconds: 60,
      scriptText,
      shots: buildShortDramaShots(episode),
      editingNotes: [
        "前 3 秒必须出现视觉或信息钩子。",
        "每个镜头都要服务人物目标、隐藏冲突或新信息。",
        "台词短、克制、有潜台词，不写说明文。",
        "结尾停在新危机、新证据或关系反转。"
      ]
    };
  }

  return enriched;
}

function enrichProject(slug) {
  const baseDir = path.join(projectRoot, "content-source", slug);
  const masterPath = path.join(baseDir, "master.json");
  const episodesDir = path.join(baseDir, "episodes");
  const master = readJson(masterPath);

  const files = fs
    .readdirSync(episodesDir)
    .filter((fileName) => /^episode-\d+\.json$/i.test(fileName))
    .sort((a, b) => a.localeCompare(b, "en"));

  files.forEach((fileName) => {
    const episodePath = path.join(episodesDir, fileName);
    writeJson(episodePath, enrichEpisode(master, readJson(episodePath)));
  });

  return {
    slug,
    episodes: files.length,
    mode: master.primaryMode,
    directive: "docs/advanced-script-enrichment-directive.md"
  };
}

function main() {
  assertDirectiveExists();
  const slugs = process.argv.slice(2).length ? process.argv.slice(2) : defaultSlugs;
  console.log(JSON.stringify({ enriched: slugs.map(enrichProject) }, null, 2));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = {
  enrichEpisode,
  enrichProject,
  buildManhuaPanels,
  buildShortDramaShots
};
