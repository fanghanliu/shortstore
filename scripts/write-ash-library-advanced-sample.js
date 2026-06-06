const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.join(__dirname, "..");
const outputPath = path.join(projectRoot, "automation-briefs", "generated-ash-library-contract.json");
const slug = "ash-library-contract";
const titleZh = "灰烬图书馆：我用借书证改写寿命";
const negativePrompt =
  "避免脸部漂移、手指畸形、文字乱码、主体被遮挡、眼神空洞、背景无意义堆叠、风格突然写实化、表演僵硬、画面过曝、镜头不服务剧情";

function paragraph(lines) {
  return lines.filter(Boolean).join("\n\n");
}

function timecode(startSecond, duration) {
  const start = String(Math.floor(startSecond / 60)).padStart(2, "0") + ":" + String(startSecond % 60).padStart(2, "0");
  const endSecond = startSecond + duration;
  const end = String(Math.floor(endSecond / 60)).padStart(2, "0") + ":" + String(endSecond % 60).padStart(2, "0");
  return `${start}-${end}`;
}

function promptZh(episode, beat, index) {
  return [
    "竖屏AI漫剧高级分镜",
    `剧名《${titleZh}》第${episode.episodeNumber}集《${episode.title}》第${index + 1}格`,
    beat.function,
    beat.visualDesign,
    beat.cameraLanguage,
    "灰金色灰烬粒子、旧书纸纹、城市午夜冷光、低饱和青灰阴影、人物眼神细腻、前景遮挡、空间压迫、电影级光影、短剧强钩子、可直接用于图生视频"
  ].join("，");
}

function promptEn(episode, beat, index) {
  return [
    "vertical cinematic AI manhua storyboard",
    `Ash Library Contract episode ${episode.episodeNumber}, panel ${index + 1}`,
    "urban fantasy suspense, ash-gold particles, old paper texture, midnight city light, low saturation cyan gray shadows",
    "consistent character design, restrained acting, expressive eyes, foreground obstruction, layered depth of field, motivated camera movement",
    "clear dramatic objective, strong cliffhanger, production-ready for image-to-video"
  ].join(", ");
}

function buildUnits(episode, beats, kind) {
  let cursor = 0;
  return beats.map((beat, index) => {
    const duration = beat.durationSeconds || (kind === "panel" ? 6 : 7);
    const unit = {
      [kind === "panel" ? "panelNumber" : "shot"]: index + 1,
      sceneHeading: `${kind === "panel" ? "镜头/场次" : "短剧镜头"} ${index + 1}｜${timecode(cursor, duration)}｜${beat.function}`,
      timecode: timecode(cursor, duration),
      durationSeconds: duration,
      function: beat.function,
      visualDesign: beat.visualDesign,
      cameraLanguage: beat.cameraLanguage,
      characterAction: beat.characterAction,
      dramaticPurpose: beat.dramaticPurpose,
      dialogue: beat.dialogue,
      soundDesign: beat.soundDesign,
      endingHook: beat.endingHook,
      aiPromptZh: promptZh(episode, beat, index),
      aiPromptEn: promptEn(episode, beat, index),
      negativePrompt,
      composition: beat.visualDesign,
      foregroundBlur: "前景使用书页、玻璃反光、灰尘、门框或人群肩线形成窥视感，但不遮挡眼神和关键道具。",
      focusSubject: "焦点优先锁定人物眼神、手部微动作、借书证、灰烬书页或证据物。",
      backgroundDepth: "背景保留书架纵深、城市霓虹、监控屏、玻璃反射和人群剪影，让空间持续压迫主体。",
      cameraMovement: beat.cameraLanguage,
      action: beat.characterAction,
      soundEffect: beat.soundDesign,
      weirdMotion: "灰烬逆风漂浮、旧书页无风翻动、灯光短暂熄灭后恢复，用异常运动制造规则感。"
    };
    if (kind === "shot") {
      unit.visual = beat.visualDesign;
      unit.dialogueOrSubtitle = beat.dialogue;
      unit.audioCue = beat.soundDesign;
      unit.actorDirection = beat.characterAction;
      unit.editingRhythm = "每 6-8 秒释放一个新信息点，证据出现时保留半秒阅读停顿，结尾直接断在新危机上。";
    } else {
      unit.dialogueBubble = beat.dialogue;
    }
    cursor += duration;
    return unit;
  });
}

function episodeOne() {
  const episode = {
    episodeNumber: 1,
    title: "午夜借书证",
    hook: "温梨撕碎借书证的瞬间，灰烬没有落地，而是在空中拼出弟弟温祈死亡的倒计时。",
    summary:
      "画展开幕前七天，失业插画师温梨从前世被网暴致死的噩梦里惊醒。手机仍停在凌晨三点十七分，热搜却提前出现了她前世才见过的标题：新锐画展坍塌，策展助理疑似偷换材料。温梨以为自己只是被旧创伤困住，直到废弃市立图书馆门口，一张写着她名字的借书证从投递口滑出。她想把卡撕掉，纸屑却悬在半空，拼成弟弟温祈的死亡倒计时。午夜十二点，城市噪声像被整座按下静音键，废弃图书馆从灰尘里亮起。管理员沈照夜站在书架阴影中告诉她：这里不借故事，只借命运；每改写一次死亡，都必须归还一段记忆。温梨找到《温祈，剩余七日》，书页上画着画展钢架断裂、消防门被锁、温祈回头找她的瞬间。她想直接撕掉死亡页，却看见童年里弟弟第一次叫她姐姐的画面从指尖烧成灰。她没有退，而是把书抱进怀里。第一集结束时，借书证背面浮出归还条款：救下温祈后，你会忘记他第一次叫你姐姐。",
    endingHook: "沈照夜合上登记簿，低声提醒：别急着救他，第一本书通常只写死法，不写凶手。"
  };

  const scriptText = paragraph([
    "冷开场从温梨的噩梦切入。画展坍塌的金属声先于画面出现，观众只听见钢架折断、人群奔跑和温祈喊“姐”的半个音节。镜头睁开时，温梨坐在狭小出租屋地板上，背后是被退稿邮件铺满的墙。她没有立刻哭，也没有解释前世，只是把手伸向手机，指尖停在热搜截图上方半秒。这个停顿让观众知道，她不是第一次见到这条新闻。",
    "她赶到废弃图书馆时，城市还在下细雨。门口的退书箱已经锈住，偏偏有一张借书证从缝里滑出来，卡面像刚从火里取出，边缘仍有灰金色微光。温梨第一反应是后退，她的目标不是冒险，而是确认自己是否真的重生。她把借书证撕开，动作很用力，像在否认一切。纸屑却停在空气里，拼出温祈的名字和倒计时：6日23时59分。",
    "午夜十二点，图书馆亮灯。镜头不把图书馆拍成奇观，而是拍成一个压低人的审判空间：高耸书架像法庭席位，灰烬像雪一样逆向升起，沈照夜站在借阅台后，半张脸被台灯切暗。他没有热情介绍规则，只说：“你已经读过结局了，还要装作没看见吗？”温梨的恐惧被这句话刺中，但她真正害怕的不是死亡，而是这一世仍然救不了温祈。",
    "她在书架间找到《温祈，剩余七日》。书页不是文字，而是动态分镜：画展钢架、被换掉的螺栓、消防通道上不该出现的封条。温梨翻页的手越来越慢，因为每翻一页，童年记忆就被烧掉一点。她看见小温祈拽着她衣角叫姐姐，却听不见完整声音。她终于把书合上，低声说：“借。”这一句不是热血宣言，而是她决定用自己最珍贵的东西换一条命。",
    "结尾镜头停在借书证背面。归还条款一行一行浮出，温梨的瞳孔被灰光照亮。沈照夜在背景里第一次移开视线，像是不忍，也像是在隐瞒。观众获得信息：可以改命；观众被隐藏的信息：谁写下温祈的死法，以及沈照夜为什么知道第一本书的陷阱。"
  ]);

  const beats = [
    {
      function: "冷开场噩梦钩子",
      visualDesign: "画面从全黑开始，只见灰尘中一截展馆钢梁缓慢下坠，冷白应急灯一闪一灭。温梨的视角被碎玻璃割裂，远处温祈的白衬衫在混乱人群里一闪而过。",
      cameraLanguage: "主观镜头低角度摇晃，焦点无法稳定，利用碎玻璃前景形成断裂感；声音先行，画面后到，让观众先被坍塌声压住。",
      characterAction: "温梨在梦里伸手抓温祈，手指却抓到满掌灰。她醒来时没有尖叫，只是喉咙短促抽动，肩颈僵硬，像把一声喊压回身体里。",
      dramaticPurpose: "用死亡结果建立强钩子，不解释重生，只让观众先感到温梨已经知道一个无法承受的结局。",
      dialogue: "温祈的声音断在半个“姐”字上。",
      soundDesign: "钢梁断裂、玻璃碎裂、人群远喊、心跳低频，醒来瞬间所有声音被出租屋电流声替代。",
      endingHook: "手机屏幕亮起，热搜标题提前出现。"
    },
    {
      function: "热搜预言",
      visualDesign: "狭窄出租屋里只有手机冷光照亮温梨半张脸，墙上退稿邮件、旧画稿和被撕掉的画展海报形成压迫背景。",
      cameraLanguage: "极近特写从手机标题推到温梨眼睛，焦点在标题和眼神之间反复切换，长焦压缩房间纵深。",
      characterAction: "她的拇指悬在删除键上，停了两秒，没有按下；另一只手下意识摸向手腕旧疤，指腹轻轻发白。",
      dramaticPurpose: "把重生信息变成证据而不是说明文，观众知道温梨正在判断现实是否重演。",
      dialogue: "“还差七天。”",
      soundDesign: "冰箱低鸣、手机震动、远处雨声，热搜弹窗出现时背景声短暂抽空。",
      endingHook: "退稿邮件下方压着一张她从未见过的借书证。"
    },
    {
      function: "借书证现身",
      visualDesign: "废弃图书馆门口，雨水沿石阶流下，退书箱锈迹斑驳。借书证从缝隙滑出，卡面写着温梨姓名，边缘像燃尽的纸。",
      cameraLanguage: "低机位固定镜头，借书证先进入画面，温梨的鞋尖停在半步之外；前景雨丝虚化，背景图书馆保持巨大黑影。",
      characterAction: "温梨没有弯腰，而是先环顾四周。确认无人后，她用两根手指夹起卡，像拿起一件可能咬人的东西。",
      dramaticPurpose: "将奇幻设定压进真实空间，让角色行为符合警惕心理，避免工具化接受设定。",
      dialogue: "“谁把我的名字写上去的？”",
      soundDesign: "雨声、路灯电流、纸面轻微燃烧声，远处车辆经过却像隔着很厚的墙。",
      endingHook: "借书证背面突然渗出温祈的名字。"
    },
    {
      function: "撕卡反噬",
      visualDesign: "温梨站在路灯下撕碎借书证，纸屑没有落地，灰烬粒子悬在她眼前，慢慢拼成倒计时数字。",
      cameraLanguage: "手部特写切到中近景，镜头缓慢环绕半圈，保持纸屑在前景、温梨眼睛在焦点后方，形成命运逼近感。",
      characterAction: "她的呼吸明显乱了一拍，身体重心往后退，左手却本能地向纸屑伸去。她想逃，又不敢让名字消失。",
      dramaticPurpose: "让温梨被迫承认规则存在，冲突从怀疑变成选择。",
      dialogue: "“别写他的名字。”",
      soundDesign: "纸张撕裂声被拉长，雨声突然变远，倒计时每跳一次都有低频敲击。",
      endingHook: "倒计时停在 6日23时59分。"
    },
    {
      function: "午夜图书馆开门",
      visualDesign: "午夜十二点，废弃图书馆内部从黑暗里逐层亮起，书架高得像审判席，灰烬逆着重力上升。",
      cameraLanguage: "大远景建立空间，随后沿地面灰烬轨迹推入门内；高角度压低温梨，表现她被规则吞没。",
      characterAction: "温梨进门前停了一下，把借书证攥进掌心。她不是好奇，而是被温祈的名字逼进来。",
      dramaticPurpose: "建立灰烬图书馆的仪式感和压迫感，同时明确主角行动动机。",
      dialogue: "沈照夜：“迟到的人，通常都想改最后一页。”",
      soundDesign: "城市噪声静音，门轴低响，书页自行翻动声像很多人在低语。",
      endingHook: "沈照夜从书架阴影里抬眼，像早就认识她。"
    },
    {
      function: "管理员对峙",
      visualDesign: "借阅台两侧形成法庭式构图，沈照夜坐在暖光内，温梨站在冷光边缘，二人之间隔着一本未登记的黑封书。",
      cameraLanguage: "正反打镜头强化权力关系，沈照夜用低角度，温梨用略高角度，直到她说出温祈名字后镜头高度才持平。",
      characterAction: "沈照夜翻登记簿时手指很稳，温梨的手却越攥越紧。她看见登记簿上自己的名字时，眼神短暂闪避。",
      dramaticPurpose: "通过沉默和站位让观众感到双方都掌握信息，但都没有说全。",
      dialogue: "温梨：“我要借温祈的命。” 沈照夜：“命不外借。只能借结局。”",
      soundDesign: "钢笔划纸、台灯轻响、远处书架像有人走过，二人台词之间留空白。",
      endingHook: "登记簿上温梨名字后面，已经盖了“逾期未还”。"
    },
    {
      function: "死亡书页",
      visualDesign: "《温祈，剩余七日》打开，书页像动态漫画，画展钢架断裂、螺栓被替换、消防门封条三个画面叠在一起。",
      cameraLanguage: "俯拍书页，随后进入书页内部做主观推镜；焦点从钢架裂纹移到温祈回头的眼睛。",
      characterAction: "温梨翻页越来越慢，手指在温祈回头那格停住。她没有摸他的脸，而是按住钢架断裂处。",
      dramaticPurpose: "把死亡从抽象命运变成可调查证据，引出后续按证据改命的玩法。",
      dialogue: "“不是意外。”",
      soundDesign: "书页翻动声、金属疲劳声、展馆远处掌声错位叠加，形成声画错位。",
      endingHook: "书页角落出现一个被涂黑的签名。"
    },
    {
      function: "记忆代价",
      visualDesign: "温梨童年记忆以暖黄色画面浮现，小温祈拽着她衣角叫姐姐；下一秒画面边缘被灰烬烧穿。",
      cameraLanguage: "暖色回忆用浅景深柔焦，现实用冷色硬光；两种画面交替闪切，最后定格在温梨眼睛里熄灭的暖光。",
      characterAction: "她想伸手抓住回忆，却在指尖碰到画面前停住。她的嘴唇动了动，没有喊出弟弟名字。",
      dramaticPurpose: "让代价不是规则说明，而是可感知的情感损失。",
      dialogue: "沈照夜：“归还从现在开始。”",
      soundDesign: "童年笑声被烧纸声吞掉，随后只剩温梨压低的呼吸。",
      endingHook: "温梨第一次想不起温祈小时候叫她什么。"
    },
    {
      function: "借书确认",
      visualDesign: "借阅台上，温梨把手按在黑封书上，灰烬沿她手腕爬出一圈类似烧痕的纹路。",
      cameraLanguage: "极近特写手腕烧痕，缓慢上移到她恢复冷静的眼神；背景沈照夜虚化，只保留他收紧的手指。",
      characterAction: "她没有哭，反而把书往自己怀里拉近。这个动作很轻，却像签下不可撤销的合同。",
      dramaticPurpose: "完成角色主动选择，结尾释放新规则和新悬念。",
      dialogue: "温梨：“借。” 沈照夜：“那就别后悔。”",
      soundDesign: "印章落下、灰烬爆开、登记簿自动翻页，最后所有声音断在一声合书。",
      endingHook: episode.endingHook
    }
  ];

  return buildEpisode(episode, scriptText, beats);
}

function episodeTwo() {
  const episode = {
    episodeNumber: 2,
    title: "第一段记忆燃烧",
    hook: "温梨提前潜入画展仓库，却发现本该断裂的钢架已经被人重新焊好，像有人知道她会来。",
    summary:
      "温梨按照死亡书页的提示来到画展仓库。她原以为只要拍下钢架裂纹，就能阻止事故，现场却干净得过分：断裂点被重新焊接，地面灰尘被擦掉，监控角度也被人提前偏移。她意识到这不是单一事故，而是一套会根据她行动调整的陷阱。沈照夜没有阻止她，只在阴影里提醒：书只能告诉你死法，看不见人心。温梨没有报警，因为前世报警记录正是她被定为嫌疑人的证据。她改用插画师的观察能力，记录焊点颜色、螺丝纹路和地面粉尘方向，逼布展经理说出温祈当天“不该出现在现场”。这句话与公开日程矛盾，成为第一枚证据。她成功把温祈从原定路线调走，钢架却在空仓库里提前坍塌，像有人宁愿没有死者，也要毁掉证据。代价随即到来：她脑海中温祈第一次送她画笔的记忆被烧掉。温祈赶到门口，看见姐姐看他的眼神陌生，轻声问：你是不是忘了什么？",
    endingHook: "温梨回头看见仓库灰尘里多出一串脚印，脚印尽头停着沈照夜遗失的银色书签。"
  };

  const scriptText = paragraph([
    "第二集不从解释第一集规则开始，而是直接进入行动。温梨戴着展馆临时工证，从仓库侧门进入。她的目标很明确：找到钢架断裂证据，提前改掉温祈死亡路线。画面要让观众立刻感觉到“不对劲”：仓库太干净，焊点太新，地面扫痕方向不自然，监控红点偏离原本能拍到钢架的位置。",
    "她的第一反应不是慌，而是压住情绪取证。这里的戏剧张力来自她不能报警、不能喊人、不能相信现场任何工作人员。沈照夜在高处观察她，像规则的见证人，也像另一个嫌疑人。两人的对话保持克制：他提醒她书看不见人心，她反问他为什么每次都站在事情发生之前。这个反问让他们关系从“管理员与借书人”变成“互相怀疑的合作者”。",
    "中段温梨利用绘画经验反向推理：焊点颜色太亮，说明补焊时间不超过十二小时；地上粉尘断层说明有人搬走了原始碎片；布展经理说温祈“不该来”，暴露他知道温祈的隐秘行程。温梨没有大声质问，而是把手机录音放在桌面上，沉默等对方意识到自己说错话。这个沉默比争吵更有压迫。",
    "她通过假装更改展品收货时间，把温祈调离仓库。观众以为第一轮改命成功，钢架却在无人处提前坍塌，所有证据被毁。温梨救下了人，却输掉了证据，也支付了第一段清晰记忆。结尾温祈出现，她已经想不起他小时候送过她第一支画笔。温祈感受到陌生，关系被改变；观众获得信息：幕后人能读懂温梨行动；观众被隐藏的信息：沈照夜的银色书签为什么会出现在脚印尽头。"
  ]);

  const beats = [
    {
      function: "仓库异常",
      visualDesign: "凌晨仓库只有一排冷白灯亮着，钢架被塑料布遮住，地面干净得像刚被擦洗。温梨站在门口，身体被门缝切成明暗两半。",
      cameraLanguage: "长焦压缩仓库纵深，让钢架像堵在她面前的墙；镜头从她肩后推进，前景门框制造窥视感。",
      characterAction: "她没有立刻进去，而是蹲下看地面粉尘。手指沾起一点灰，在指腹间轻轻搓开。",
      dramaticPurpose: "建立第二集主任务：证据已经被处理，温梨面对的不是事故，而是会反应的敌人。",
      dialogue: "“有人比我早到。”",
      soundDesign: "冷灯嗡鸣、远处电梯运行、塑料布轻响，仓库空旷回声放大每一步。",
      endingHook: "监控红点缓慢转向墙角，避开了钢架。"
    },
    {
      function: "焊点取证",
      visualDesign: "钢架连接处有新焊痕，银色边缘还未完全氧化，旁边旧灰尘被擦出一圈不自然空白。",
      cameraLanguage: "微距特写焊点，再切温梨眼睛，利用焦点转换表现她在脑中拼接时间线。",
      characterAction: "温梨拿出素描本，不拍全景，只画焊点纹路和灰尘边界。她的手很稳，呼吸却压得很低。",
      dramaticPurpose: "用专业能力替代主角光环，让她的推理来自身份和经验。",
      dialogue: "“补得太急了。”",
      soundDesign: "铅笔划纸声、金属轻微热胀冷缩声、手机录音开启的细小提示音。",
      endingHook: "她画到一半，铅笔尖突然断裂，露出芯里夹着的灰。"
    },
    {
      function: "沈照夜现身",
      visualDesign: "沈照夜站在二层平台阴影中，银灰长发被冷光切出边缘，像从书页夹缝里出现。",
      cameraLanguage: "低角度拍沈照夜形成压迫，再反打温梨保持平视，让她不被完全压低。",
      characterAction: "温梨抬头时没有后退，反而把素描本合上，挡住已经画下的证据。",
      dramaticPurpose: "让沈照夜既像帮手又像威胁，关系进入互相试探。",
      dialogue: "沈照夜：“书写的是死法，不写人心。” 温梨：“那你为什么总在人心前面等着？”",
      soundDesign: "二层铁栏轻响、远处风从通风口灌入，二人台词之间留出空白。",
      endingHook: "沈照夜视线落在焊点上，却没有表现出意外。"
    },
    {
      function: "经理露馅",
      visualDesign: "布展经理推门进来，手里咖啡杯轻微发抖，胸牌反光遮住姓名。温梨站在钢架旁，像只是临时记录员。",
      cameraLanguage: "前景用钢架斜线切割画面，经理被困在斜线之间；反打温梨保持稳定中近景。",
      characterAction: "温梨没有质问，只把手机放在桌上，录音界面朝下。她看着经理，不催促。",
      dramaticPurpose: "冲突不靠喊叫，而靠对方在沉默里犯错。",
      dialogue: "经理：“温祈今天不会来。” 温梨：“我还没问他。”",
      soundDesign: "咖啡杯碰桌、经理吞咽声、录音计时的轻微震动声。",
      endingHook: "经理意识到说漏嘴，第一反应不是解释，而是看向监控。"
    },
    {
      function: "改命调度",
      visualDesign: "温梨用手机给温祈发出假收货通知，屏幕冷光映在她脸上；背景钢架像巨大的阴影压下来。",
      cameraLanguage: "屏幕文字特写后快速切到温梨眼神，再切远处钢架全景，制造倒计时感。",
      characterAction: "她打字时删掉三次“别来”，最后只发一句工作通知。她知道直说危险只会改变敌人的行动。",
      dramaticPurpose: "体现人物策略：她不是单纯阻止，而是在和幕后人抢时间。",
      dialogue: "短信内容：“展品改到西门验收，别走仓库。”",
      soundDesign: "发送提示音、钢架轻微应力声、远处脚步突然停住。",
      endingHook: "消息显示已读，回信却不是温祈的语气。"
    },
    {
      function: "无人坍塌",
      visualDesign: "仓库灯光连续闪烁，钢架在无人区域突然倾斜。塑料布被撕开，灰尘像雾一样扑向镜头。",
      cameraLanguage: "固定远景不跟随人物，冷静拍下坍塌全过程，形成“有人让证据自毁”的恐惧感。",
      characterAction: "温梨本能想冲过去抢证据，被沈照夜一把拉住手腕。她甩开他，却晚了一步。",
      dramaticPurpose: "让第一轮胜利立刻反噬：人救下了，证据没了。",
      dialogue: "温梨：“他宁愿没有死者，也要没有证据。”",
      soundDesign: "钢架砸地、灯管爆裂、灰尘吞没环境声，随后只剩耳鸣。",
      endingHook: "灰尘落下后，地上只剩一颗被压扁的黑色螺栓。"
    },
    {
      function: "记忆燃烧",
      visualDesign: "黑色螺栓在温梨掌心发烫，画面切入暖色回忆：小温祈把第一支画笔塞给她，画笔尾端刻着姐姐两个字。",
      cameraLanguage: "暖色回忆用慢推，现实用硬切；画笔特写被灰烬从尾端烧掉，转回温梨失焦的眼睛。",
      characterAction: "温梨想念出那支画笔的品牌，却突然卡住。她的嘴角微微动了一下，像被人从记忆里抽走一句话。",
      dramaticPurpose: "支付代价，让改命成本落在情感细节上。",
      dialogue: "沈照夜：“第一段，归还完成。”",
      soundDesign: "童年笑声、铅笔滚落、烧纸声，最后被现实耳鸣覆盖。",
      endingHook: "温梨看着掌心螺栓，想不起它为什么让自己难过。"
    },
    {
      function: "姐弟裂缝",
      visualDesign: "温祈站在仓库门口，白衬衫上沾着雨水。他身后的冷光把他轮廓照得像书页里逃出来的人。",
      cameraLanguage: "长焦压缩姐弟距离，温梨在前景失焦，温祈在背景清晰，暗示记忆距离被拉远。",
      characterAction: "温祈向前半步又停下。他本想抱她，却被她陌生的眼神拦住，只能把手慢慢放下。",
      dramaticPurpose: "让救人带来的关系代价具体化，温梨救下温祈却正在失去与他的连接。",
      dialogue: "温祈：“姐，你是不是忘了什么？”",
      soundDesign: "雨水从门檐落下，仓库警报远远响起，二人之间没有配乐。",
      endingHook: "温梨下意识回答：“我们很熟吗？”"
    },
    {
      function: "银色书签",
      visualDesign: "仓库灰尘里出现一串新脚印，脚印尽头压着一枚银色书签，书签上有灰烬图书馆的馆徽。",
      cameraLanguage: "从脚印低机位追踪到书签，最后反打沈照夜的空位置，他已经不见了。",
      characterAction: "温梨捡起书签，指尖被边缘划破。她没有叫沈照夜，只把书签夹进素描本。",
      dramaticPurpose: "把嫌疑指向沈照夜，同时保留他可能被栽赃的空间。",
      dialogue: "温梨：“你最好给我一个能活下去的解释。”",
      soundDesign: "书签刮纸、警报被远处门声切断，灰烬轻轻落在书签上。",
      endingHook: episode.endingHook
    }
  ];

  return buildEpisode(episode, scriptText, beats);
}

function episodeThree() {
  const episode = {
    episodeNumber: 3,
    title: "藏书人名单",
    hook: "灰烬书自动翻到下一页，第二个将死之人不是温祈，而是前世第一个公开指控温梨的女策展人乔曼。",
    summary:
      "温梨救下温祈后，图书馆并未关闭。死亡只是换了人：女策展人乔曼将在二十四小时内从美术馆天台坠落。前世乔曼第一个指控温梨偷换材料，直接引爆网暴，温梨本能不想救她。沈照夜却提醒她，图书馆不审判，只记录；如果乔曼死去，藏书人的线索也会断掉。温梨跟踪乔曼，发现她私下与匿名账号交易画展保险资料。乔曼并非主谋，她被人用家人债务逼迫，只负责把错误材料送进仓库。温梨在天台利用玻璃反光拍下交易画面，逼乔曼承认钢架事故背后还有真正写死法的人。乔曼准备说出名字时，美术馆整栋断电，灰烬书页上浮出第三种死法：不是坠楼，而是“说出藏书人姓名者，失声而死”。沈照夜第一次失控，阻止温梨继续逼问。结尾，温梨在黑暗中听见乔曼用指甲敲出三个字：借书人。",
    endingHook: "温梨翻开银色书签，背面刻着一行小字：沈照夜，最后一次借阅，尚未归还。"
  };

  const scriptText = paragraph([
    "第三集的戏剧核心是道德选择。温梨并不想救乔曼，因为乔曼是前世把她推向网暴中心的人。开场让观众先站在温梨这边：乔曼在采访里笑着说一切按流程进行，而温梨手里的灰烬书已经写下她二十四小时内坠楼。温梨的目标从救人变成拿线索，她真正害怕的是，救下仇人会让温祈的证据链变得更复杂，也会让自己再次被利用。",
    "沈照夜在这一集不能只是解释规则。他要表现出第一次动摇：当乔曼名字出现时，他比温梨更快合上书，像知道这个名字背后牵连图书馆。温梨注意到他的微反应，两人的关系进一步改变，她开始把管理员也纳入调查对象。",
    "中段使用跟踪和交易场面提升商业短剧节奏。乔曼不是扁平恶人，她害怕家人债务曝光，也害怕藏书人收回承诺。她对温梨说的每句话都带潜台词：表面劝温梨认命，实际在提醒她别靠近。温梨用玻璃反光拍到交易证据，利用乔曼对名声的恐惧逼她开口。",
    "结尾不让乔曼直接喊出幕后名字，而是让死亡规则临时改写：说出藏书人姓名者，失声而死。这样既保留悬念，也证明幕后人能干涉书页。沈照夜第一次失控，暴露他不是单纯管理员。乔曼在黑暗里用指甲敲出“借书人”，把嫌疑从外部敌人推回图书馆内部。最后银色书签揭示沈照夜也曾是借书人，前三集形成完整付费钩子。"
  ]);

  const beats = [
    {
      function: "死亡目标更换",
      visualDesign: "灰烬书在无人触碰时自动翻页，乔曼的照片从书页里浮出，照片下方出现二十四小时倒计时。",
      cameraLanguage: "俯拍书页，镜头缓慢旋转，直到乔曼照片与温梨倒影重合，暗示仇人和线索绑定。",
      characterAction: "温梨第一反应是合上书，动作很快。她的指尖停在封面上，没有再打开。",
      dramaticPurpose: "把救人任务变成道德困境，观众理解她不想救乔曼。",
      dialogue: "温梨：“她死不死，和我有什么关系？”",
      soundDesign: "书页自动翻动、倒计时滴答、远处采访声从现实里错位传来。",
      endingHook: "沈照夜比她更快按住书角。"
    },
    {
      function: "管理员失态",
      visualDesign: "沈照夜的手压在乔曼照片上，指节发白。台灯闪了一下，他的影子被拉长到书架尽头。",
      cameraLanguage: "极近特写手指，再反打温梨观察他的眼神；用反打镜头强化双方信息差。",
      characterAction: "沈照夜意识到失态后慢慢松手，恢复平静，但视线避开温梨半秒。",
      dramaticPurpose: "让沈照夜暴露隐藏关系，温梨开始怀疑图书馆本身。",
      dialogue: "沈照夜：“她活着，线索才活着。” 温梨：“你不是说图书馆不审判吗？”",
      soundDesign: "台灯电流、书架深处轻微坍塌声、二人停顿处完全静默。",
      endingHook: "温梨看见他袖口有和银色书签同样的馆徽。"
    },
    {
      function: "采访伪装",
      visualDesign: "美术馆发布会现场，乔曼站在媒体灯下微笑，背后巨幅海报写着艺术与新生；温梨在人群边缘被灯光切到半张脸。",
      cameraLanguage: "用记者肩膀做前景遮挡，长焦压缩媒体和乔曼距离，制造公众审判感。",
      characterAction: "乔曼讲话时手指一直摩挲戒指，笑容维持得太久。温梨没有上前，只在她停顿时拍下手部细节。",
      dramaticPurpose: "呈现乔曼表层体面与隐藏恐惧，为后续反转铺垫。",
      dialogue: "乔曼：“一切都会按流程公开。”",
      soundDesign: "快门声、媒体提问、闪光灯充电声，乔曼停顿时闪光灯声被放大。",
      endingHook: "乔曼收到一条匿名消息，笑容第一次断裂。"
    },
    {
      function: "匿名交易",
      visualDesign: "地下停车场，乔曼把文件袋塞进灰色车窗，车内人不露脸，只露出戴黑手套的手和一张旧借阅条。",
      cameraLanguage: "低机位从车轮旁拍交易，利用车窗反光遮住对方脸，焦点停在旧借阅条编号上。",
      characterAction: "温梨躲在柱后，手机贴在玻璃反光上取景。她不敢靠近，呼吸放轻，手指按住录制键不松。",
      dramaticPurpose: "提供商业悬疑证据点，把藏书人从概念变成可追踪对象。",
      dialogue: "车内人：“你只负责把材料放进去。” 乔曼：“我已经照做了。”",
      soundDesign: "地下停车场回声、车窗下降、电梯叮声、远处轮胎碾水声。",
      endingHook: "旧借阅条编号开头正是沈照夜书签上的编号。"
    },
    {
      function: "天台逼问",
      visualDesign: "美术馆天台风很大，城市霓虹在玻璃幕墙上碎成多层反光。乔曼站在护栏附近，温梨堵住通往楼梯的门。",
      cameraLanguage: "长焦压缩护栏和乔曼的距离，让坠楼危险始终贴着她后背；反打温梨时保留楼梯门作为退路。",
      characterAction: "温梨没有冲过去，只把录下的交易画面举起。乔曼看见后肩膀轻微垮下，戒指停止摩挲。",
      dramaticPurpose: "让温梨用证据获得主动权，冲突来自乔曼是否愿意说出真正幕后。",
      dialogue: "温梨：“你欠我的不是道歉，是名字。”",
      soundDesign: "风声压住城市声，玻璃幕墙轻震，手机视频里的交易音频断续传出。",
      endingHook: "乔曼听见“名字”两个字，第一反应是看向天台监控。"
    },
    {
      function: "乔曼反转",
      visualDesign: "乔曼的妆被风吹乱，媒体灯下的精致感消失，眼底是长期失眠的红。她从包里拿出债务催收照片。",
      cameraLanguage: "中近景固定不动，让乔曼自己走进光里；焦点从她脸移到照片，再回到温梨。",
      characterAction: "她递照片时手在抖，却没有哭。她害怕的是被温梨看轻，也害怕说出名字后失去最后保护。",
      dramaticPurpose: "把前世加害者复杂化，她不是主谋，但她的选择仍造成伤害。",
      dialogue: "乔曼：“我没想让他死。我只是……不敢停。”",
      soundDesign: "风声突然降低，照片边角拍打声清晰，远处警笛像从另一个街区传来。",
      endingHook: "灰烬书在温梨包里开始发热。"
    },
    {
      function: "死法改写",
      visualDesign: "灰烬书页自动浮在空中，原本的坠楼死法被黑色灰烬覆盖，改成一行新字：说出藏书人姓名者，失声而死。",
      cameraLanguage: "书页特写占满画面，文字出现时切乔曼喉咙微微收紧，再切温梨瞳孔震动。",
      characterAction: "温梨本能上前一步想逼问，沈照夜从暗处冲出，第一次失去平稳步伐。",
      dramaticPurpose: "证明幕后人能实时干预规则，把外部悬疑升级为图书馆内部危机。",
      dialogue: "沈照夜：“别让她说。”",
      soundDesign: "文字燃烧声、喉咙被掐住般的气音、城市电流突然下降。",
      endingHook: "整栋美术馆断电。"
    },
    {
      function: "黑暗敲字",
      visualDesign: "断电后只剩应急灯红光。乔曼跪在地上捂着喉咙，温梨蹲在她面前，二人被红光压成近乎剪影。",
      cameraLanguage: "低角度贴地拍乔曼手指，她用指甲在地面敲击；画面不拍嘴，只拍手和温梨的眼神。",
      characterAction: "乔曼说不出话，手指敲三下停一下。温梨从愤怒转为安静，开始按节奏听。",
      dramaticPurpose: "用非台词传递关键信息，增强高级感和悬念。",
      dialogue: "乔曼无声。温梨低声：“再敲一遍。”",
      soundDesign: "指甲敲地、应急灯电流、乔曼破碎呼吸，远处有人拍门却像隔着水。",
      endingHook: "敲击节奏对应三个字：借书人。"
    },
    {
      function: "书签真相",
      visualDesign: "温梨在红光里翻开银色书签，背面小字浮现：沈照夜，最后一次借阅，尚未归还。沈照夜站在背景暗处，脸色第一次失去血色。",
      cameraLanguage: "极近特写书签文字，随后慢慢拉焦到沈照夜；前景温梨手指压住书签边缘，像压住一份审判。",
      characterAction: "温梨没有质问，只把书签举到沈照夜眼前。沈照夜想开口，却先看向乔曼，像害怕她继续敲。",
      dramaticPurpose: "完成前三集总钩子：管理员也是借书人，图书馆规则可能被人利用。",
      dialogue: "温梨：“你欠的那本书，写的是谁的命？”",
      soundDesign: "应急灯闪烁、灰烬落在金属书签上的细响、远处电梯重新启动。",
      endingHook: episode.endingHook
    }
  ];

  return buildEpisode(episode, scriptText, beats);
}

function buildEpisode(episode, scriptText, beats) {
  const manhuaPanels = buildUnits(episode, beats, "panel");
  const shortShots = buildUnits(episode, beats.slice(0, 8), "shot");
  return {
    ...episode,
    scriptText,
    productionValue:
      "本集按高级生产模式交付：包含完整影视化正文、逐格高级分镜、人物动作微反应、戏剧目的、声画设计、结尾钩子、中英文AI提示词和反向提示词，可直接支持AI漫剧图生视频制作，并可转化为AI短剧拍摄提示。",
    aiShortDrama: {
      runtimeSeconds: 75,
      scriptText,
      shots: shortShots,
      editingNotes: [
        "前 3 秒必须释放强信息钩子，不用旁白解释设定。",
        "每个镜头都必须有明确戏剧任务：取证、试探、反转、代价或新危机。",
        "台词短、克制、有潜台词，沉默和动作承担至少一半表达。",
        "结尾断在新问题上，不给完整答案。"
      ]
    },
    aiManhuaDrama: {
      directive: "docs/advanced-script-enrichment-directive.md",
      panelCount: manhuaPanels.length,
      scriptText,
      panels: manhuaPanels,
      layoutNotes: [
        "竖屏构图优先保留人物眼神和关键道具，前景遮挡只制造窥视感。",
        "每一格都要同时写清画面设计、镜头语言、人物动作、戏剧目的、台词、音效和结尾钩子。",
        "画面高级但不空洞，镜头运动必须服务情绪递进。",
        "第 9 格必须形成视觉钩子或信息钩子，推动观众继续看第 4 集。"
      ]
    }
  };
}

const episodes = [episodeOne(), episodeTwo(), episodeThree()];

const master = {
  slug,
  title: {
    zh: titleZh,
    en: "Ash Library Contract"
  },
  primaryMode: "ai_manhua_drama",
  supportedModes: ["ai_manhua_drama", "ai_short_drama"],
  logline:
    "失业插画师温梨得到一张会燃烧的借书证，每借走一本灰烬书就能改写一个人的死法，但归还代价会从她最珍贵的记忆里扣除。",
  synopsis:
    "温梨在弟弟温祈死于画展坍塌、自己被全网指控后重生。她收到灰烬图书馆的借书证，发现图书馆记录着每个人剩余寿命和死亡方式。为了救下温祈，她必须借走写着弟弟结局的书，并用证据、选择和记忆代价改写死亡。前三集完成图书馆现身、第一本死亡书、第一次换命、第一段记忆燃烧和藏书人线索揭露：温梨发现幕后人不只是制造事故，还能实时改写死法，而管理员沈照夜也曾是借书人。故事以都市奇幻契约为壳，核心卖点是寿命改写、记忆代价、证据反转、仇人救赎和图书馆内部背叛。",
  category: "AI都市奇幻契约漫剧",
  recommendedPlatforms: ["抖音", "快手", "视频号", "TikTok", "YouTube Shorts"],
  audienceTags: ["寿命契约", "灰烬图书馆", "重生改命", "都市奇幻", "姐弟情感", "证据反转"],
  productionDifficulty: "medium",
  episodeCount: 3,
  freeEpisodeCount: 3,
  commercialPolicy: {
    buyout: "一次性买断完整剧本包，适合已经验证题材数据、准备连续更新和矩阵分发的账号团队。",
    payPerEpisode: "按集购买后续内容，适合边制作边观察播放、完播、转粉和转化数据的账号。",
    revenueShare: "无需预付剧本费，审核通过后可继续制作，并按视频收益约定比例分成。"
  },
  characters: [
    {
      name: "温梨",
      role: "失业插画师，灰烬借书证持有人",
      motivation: "救下弟弟温祈，夺回前世被夺走的作品版权和真相。",
      fear: "她害怕自己付出记忆后，救下了温祈，却再也无法爱他。",
      secret: "每次换命都会丢失一段与温祈有关的记忆，她最怕忘记自己为什么要坚持。",
      visualDesign: "黑色短发、灰色风衣、手腕有烧痕，眼神疲惫但锋利，行动克制。"
    },
    {
      name: "温祈",
      role: "温梨弟弟，画展事故第一名原定死者",
      motivation: "证明姐姐没有毁掉画展，也想保护姐姐不再被网暴吞没。",
      fear: "他害怕姐姐为了救他变成一个不认识他的人。",
      secret: "他曾提前收到过一张空白借阅卡，却以为只是展览邀请函。",
      visualDesign: "白衬衫、学生感外套、背包上有旧徽章，笑容干净但开始带戒备。"
    },
    {
      name: "沈照夜",
      role: "灰烬图书馆管理员，规则守门人",
      motivation: "维持图书馆借命规则不被彻底撕开，同时隐藏自己未归还的最后一本书。",
      fear: "他害怕温梨查到自己曾经也是借书人，并发现他欠下的书与藏书人有关。",
      secret: "他最后一次借阅尚未归还，因此无法真正离开图书馆。",
      visualDesign: "银灰长发、黑色高领、金丝眼镜，常站在书架阴影里，情绪极少外露。"
    },
    {
      name: "乔曼",
      role: "美术馆女策展人，前世第一个公开指控温梨的人",
      motivation: "保住家人债务不被曝光，也想从藏书人的控制中脱身。",
      fear: "她害怕自己一旦说出名字，家人会立刻被拖入更大的代价。",
      secret: "她不是主谋，但她亲手把错误材料送进了仓库。",
      visualDesign: "精致套装、戒指、媒体灯下从容，私下眼底长期失眠。"
    }
  ],
  worldview:
    "灰烬图书馆只在午夜向被死亡结局选中的人开放。书籍不记录道德，只记录死法；借书人可以改写死亡路径，但必须归还等价记忆。死亡一旦被改写，会转移到同一事件链上的其他人。藏书人是能够给死法署名的人，他们可能不是凶手，却掌握让命运成书的方法。",
  visualStyle:
    "竖屏AI漫剧，都市午夜、废弃图书馆、灰金色灰烬、旧书纸纹、低饱和青灰阴影、冷暖光对峙、玻璃反射、长焦压缩空间、前景遮挡、微表情表演和强结尾钩子。",
  tone: "情绪克制但压迫，奇幻规则明确，人物行为有动机，证据推进强，反转密集但不狗血。",
  episodeOutline: episodes.map(({ episodeNumber, title, hook, summary, endingHook }) => ({
    episodeNumber,
    title,
    hook,
    summary,
    endingHook
  }))
};

const payload = {
  slug,
  status: "published",
  featured: true,
  trendEvidence: [
    {
      source: "codex_advanced_sample",
      keyword: "寿命契约 / 灰烬图书馆 / 重生改命 / 都市奇幻 / 记忆代价",
      heatScore: 94,
      observedAt: new Date().toISOString()
    }
  ],
  master,
  episodes
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      ok: true,
      output: path.relative(projectRoot, outputPath).replace(/\\/g, "/"),
      slug,
      episodes: episodes.length,
      panelsPerEpisode: episodes.map((episode) => episode.aiManhuaDrama.panels.length),
      shotsPerEpisode: episodes.map((episode) => episode.aiShortDrama.shots.length)
    },
    null,
    2
  )
);
