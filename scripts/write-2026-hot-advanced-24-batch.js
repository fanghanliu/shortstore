const fs = require("node:fs");
const path = require("node:path");
const {
  paragraph,
  buildAdvancedEpisode,
  buildAdvancedPayload,
  writeAdvancedProductionInput
} = require("./lib/advanced-production-template");

const projectRoot = path.join(__dirname, "..");
const outputDir = path.join(projectRoot, "automation-briefs");
const observedAt = "2026-06-05T00:00:00.000+08:00";

const platformEvidence = [
  "2026 微短剧行业公开报告：精品化、AI 生产、IP 改编、出海与平台分账持续升温",
  "抖音/快手/红果：爽感反转、重生逆袭、女性向、下沉情感、悬疑强钩子仍是高转化题材",
  "B站/小红书/爱奇艺：AI 漫剧、国风幻想、赛博末世、知识型悬疑和文旅古文明更适合视觉讨论与二创",
  "TikTok/YouTube Shorts：末世生存、身份反转、家庭复仇、都市超能力、怪谈规则类更利于出海竖屏传播"
];

function sentenceFragment(value) {
  return String(value || "")
    .trim()
    .replace(/[。！？!?；;，,、]+$/u, "");
}

const specs = [
  {
    mode: "ai_manhua_drama",
    slug: "jade-bone-empress-system",
    titleZh: "玉骨女帝：我用系统重写宗门",
    titleEn: "Jade Bone Empress System",
    category: "AI国风玄幻重生漫剧",
    trope: "重生女帝、宗门背叛、系统改命、国风玄幻",
    protagonist: "沈归璇",
    ally: "陆照尘",
    rival: "云姝",
    antagonist: "太玄宗主",
    coreObject: "玉骨命盘",
    worldRule: "每改写一名弟子的命格，就会从她前世的神魂里剜走一段帝骨记忆。",
    visualStyle: "竖屏国风AI漫剧，玉色骨纹、宗门云海、青金法阵、长焦压迫、衣袂与符纸参与叙事",
    trend: "国风玄幻+重生逆袭+系统流",
    audience: ["国风玄幻", "重生女强", "系统爽剧", "宗门复仇", "AI漫剧"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "mechanical-buddha-apocalypse",
    titleZh: "机械佛国：末世里我听见神谕",
    titleEn: "Mechanical Buddha Apocalypse",
    category: "AI末世机甲宗教悬疑漫剧",
    trope: "机甲末世、佛国废土、神谕骗局、救世反转",
    protagonist: "迟曜",
    ally: "白弥",
    rival: "净土军少将",
    antagonist: "万相主机",
    coreObject: "机械佛眼",
    worldRule: "神谕只能预测灾变坐标，却会用被拯救者的一段信仰换取能源。",
    visualStyle: "竖屏赛博废土漫剧，金属佛像、红沙风暴、机械经轮、低机位压迫、冷暖光冲突",
    trend: "末世生存+机甲视觉+规则悬疑",
    audience: ["末世", "机甲", "赛博佛国", "强设定", "男频爽感"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "reborn-villainess-contract",
    titleZh: "恶女重开：全网都在等我黑化",
    titleEn: "Reborn Villainess Contract",
    category: "AI女性向逆袭漫剧",
    trope: "恶女重生、全网审判、黑化反杀、豪门契约",
    protagonist: "叶南枝",
    ally: "周聿白",
    rival: "白月光妹妹",
    antagonist: "叶氏董事会",
    coreObject: "黑化进度条",
    worldRule: "每当她拒绝黑化，系统就会把前世一个证人的死亡提前。",
    visualStyle: "竖屏都市豪门漫剧，冷白宴会灯、黑金礼服、手机弹幕、玻璃反射和媒体闪光灯",
    trend: "女性向复仇+恶女文学+弹幕审判",
    audience: ["女性向", "恶女重生", "豪门复仇", "全网审判", "短剧钩子"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "dragon-market-live",
    titleZh: "龙市直播间：我卖的不是古董是命",
    titleEn: "Dragon Market Live",
    category: "AI都市奇幻直播漫剧",
    trope: "直播鉴宝、都市奇幻、古董契约、命运交易",
    protagonist: "许问青",
    ally: "林逐月",
    rival: "榜一藏家",
    antagonist: "龙市掌柜",
    coreObject: "龙鳞拍卖锤",
    worldRule: "每件古董都绑定一段命债，卖出即转移，退货必须用寿命抵扣。",
    visualStyle: "竖屏直播漫剧，弹幕、古董微距、暗金龙纹、夜市雾气、镜头穿越手机屏幕",
    trend: "直播电商+鉴宝+规则怪谈",
    audience: ["直播鉴宝", "都市奇幻", "规则交易", "爽点反转", "AI漫剧"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "snow-country-divorce-queen",
    titleZh: "雪国离婚后：前夫跪求我救全城",
    titleEn: "Snow Country Divorce Queen",
    category: "AI女性成长灾难漫剧",
    trope: "离婚逆袭、极寒灾难、前夫追悔、女性成长",
    protagonist: "姜雪瓷",
    ally: "顾砚川",
    rival: "前夫陆珩",
    antagonist: "雪灾救援署内鬼",
    coreObject: "极寒预警手环",
    worldRule: "她能提前听见雪崩警报，但每次公开预警都会被系统扣除一段公众信任值。",
    visualStyle: "竖屏冰雪灾难漫剧，白蓝冷光、救援车灯、雪雾遮挡、人物呼吸白气和低频风声",
    trend: "女性成长+灾难救援+追妻火葬场",
    audience: ["女性成长", "灾难短剧", "离婚逆袭", "救援爽剧", "情绪钩子"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "paper-god-city-files",
    titleZh: "纸神档案：我给城市改户口",
    titleEn: "Paper God City Files",
    category: "AI都市异能档案漫剧",
    trope: "城市档案、身份改写、纸神契约、异能悬疑",
    protagonist: "唐栖",
    ally: "陈临川",
    rival: "户籍科新人",
    antagonist: "无名纸神",
    coreObject: "空白户口页",
    worldRule: "改写一个人的身份，就会在城市里抹掉另一个人的存在痕迹。",
    visualStyle: "竖屏都市档案漫剧，老档案室、纸灰、印章红光、雨夜街巷、前景文件遮挡",
    trend: "都市异能+身份反转+规则悬疑",
    audience: ["都市异能", "身份改写", "悬疑档案", "规则代价", "AI漫剧"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "beast-tamer-bullet-comments",
    titleZh: "御兽弹幕：全宗门都说我是废物",
    titleEn: "Beast Tamer Bullet Comments",
    category: "AI玄幻御兽弹幕漫剧",
    trope: "御兽升级、弹幕预言、废柴逆袭、宗门大比",
    protagonist: "洛星眠",
    ally: "小黑麟",
    rival: "天才师姐",
    antagonist: "灵兽塔长老",
    coreObject: "弹幕兽契",
    worldRule: "弹幕能提示灵兽弱点，但每采纳一次都会让一只灵兽提前进入狂化。",
    visualStyle: "竖屏玄幻御兽漫剧，灵兽粒子、弹幕光幕、山门斗兽场、低角度兽影压迫",
    trend: "御兽+弹幕+废柴逆袭",
    audience: ["御兽", "玄幻爽文", "弹幕预言", "升级流", "AI漫剧"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "ghost-delivery-courier",
    titleZh: "阴间外卖员：午夜订单全是死人",
    titleEn: "Ghost Delivery Courier",
    category: "AI规则怪谈外卖漫剧",
    trope: "外卖员、午夜怪谈、阴间订单、规则生存",
    protagonist: "秦小满",
    ally: "红衣客服",
    rival: "五星骑手",
    antagonist: "平台算法鬼",
    coreObject: "黑色配送箱",
    worldRule: "每送错一单，现实中就会有一名同名顾客失去明天。",
    visualStyle: "竖屏都市怪谈漫剧，雨夜小区、红色订单倒计时、楼道声控灯、箱内冷雾",
    trend: "规则怪谈+外卖职业+午夜惊悚",
    audience: ["规则怪谈", "外卖员", "都市惊悚", "悬疑反转", "AI漫剧"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "palace-ai-script-doctor",
    titleZh: "宫斗脚本师：我把娘娘写活了",
    titleEn: "Palace AI Script Doctor",
    category: "AI古风宫斗二创漫剧",
    trope: "古风宫斗、脚本穿书、角色觉醒、二创小说",
    protagonist: "宋晚棠",
    ally: "宁妃",
    rival: "贵妃",
    antagonist: "御前执笔人",
    coreObject: "朱砂改命笔",
    worldRule: "改写一场宫斗台词，就会让现实中的一位演员失去原本的人生选择。",
    visualStyle: "竖屏古风宫斗漫剧，宫灯、朱砂、雨夜长廊、屏风前景、低饱和红金色",
    trend: "古风宫斗+穿书+角色觉醒",
    audience: ["古风宫斗", "穿书", "角色觉醒", "女性向", "二创小说"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "mountain-sea-archive",
    titleZh: "山海备案局：妖怪都要持证上岗",
    titleEn: "Mountain Sea Archive",
    category: "AI国风都市妖怪漫剧",
    trope: "山海经、都市妖怪、备案局、单元悬疑",
    protagonist: "闻初夏",
    ally: "白泽实习生",
    rival: "无证狐妖",
    antagonist: "旧神审计官",
    coreObject: "山海备案册",
    worldRule: "每给一只妖怪合法身份，人类城市就会失去一条被遗忘的古老规则。",
    visualStyle: "竖屏国风都市漫剧，现代街巷与山海异兽叠影、霓虹、纸符、档案红章",
    trend: "山海经+都市妖怪+轻喜悬疑",
    audience: ["山海经", "都市妖怪", "国风轻喜", "单元悬疑", "AI漫剧"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "cyber-mother-in-law-trial",
    titleZh: "赛博婆婆审判庭：全家都在云端吵架",
    titleEn: "Cyber Family Trial",
    category: "AI家庭伦理赛博漫剧",
    trope: "家庭伦理、赛博审判、婆媳冲突、云端遗产",
    protagonist: "阮青禾",
    ally: "数字公证员",
    rival: "云端婆婆",
    antagonist: "家族信托AI",
    coreObject: "云遗嘱密钥",
    worldRule: "每上传一段家庭记忆作证，就会永久修改一个亲人的数字人格。",
    visualStyle: "竖屏赛博家庭漫剧，云端法庭、全息餐桌、冷蓝屏幕光、家庭旧照片叠影",
    trend: "家庭伦理+AI遗产+赛博法庭",
    audience: ["家庭伦理", "婆媳冲突", "AI遗产", "赛博审判", "下沉共鸣"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "wasteland-supermarket-queen",
    titleZh: "废土超市女王：我用会员卡换水源",
    titleEn: "Wasteland Supermarket Queen",
    category: "AI末世经营漫剧",
    trope: "末世经营、移动超市、水源争夺、女强生存",
    protagonist: "孟南栀",
    ally: "修车少年阿牧",
    rival: "避难所所长",
    antagonist: "黑水商会",
    coreObject: "末世会员卡",
    worldRule: "会员卡能兑换物资，但每次升级都会暴露一个避难所坐标。",
    visualStyle: "竖屏废土经营漫剧，移动超市、黄沙、霓虹货架、罐头微距、车灯逆光",
    trend: "末世经营+女强生存+资源爽感",
    audience: ["末世经营", "女强", "资源囤货", "废土爽剧", "AI漫剧"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "forensic-flower-demon",
    titleZh: "法医花妖：尸体会在春天说话",
    titleEn: "Forensic Flower Demon",
    category: "AI奇幻法医悬疑漫剧",
    trope: "法医悬疑、花妖异能、单元案件、女性侦探",
    protagonist: "苏见薇",
    ally: "刑警霍岚",
    rival: "冷面检察官",
    antagonist: "无香凶手",
    coreObject: "尸花标本册",
    worldRule: "尸体开花时能说出最后一句话，但花期结束会带走目击者的一段嗅觉记忆。",
    visualStyle: "竖屏奇幻法医漫剧，解剖室冷光、花瓣微距、雨夜现场、尸花绽放与长焦凝视",
    trend: "法医悬疑+女性侦探+奇幻异能",
    audience: ["法医", "悬疑", "女性侦探", "奇幻案件", "AI漫剧"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "returnee-princess-ai-army",
    titleZh: "归国公主：我带AI军团回朝复仇",
    titleEn: "Returnee Princess AI Army",
    category: "AI古风科技复仇漫剧",
    trope: "古风复仇、科技军团、女主归来、权谋爽剧",
    protagonist: "萧扶摇",
    ally: "墨机师",
    rival: "摄政王世子",
    antagonist: "太后密阁",
    coreObject: "机关AI兵符",
    worldRule: "AI机关军只能执行被写入史书的命令，改史会反噬皇城气运。",
    visualStyle: "竖屏古风科技漫剧，机关傀儡、宫墙冷月、墨色兵符、金属与绸缎冲突",
    trend: "古风权谋+科技反差+女频复仇",
    audience: ["古风权谋", "女主复仇", "AI机关", "宫廷爽剧", "AI漫剧"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "memory-pawnshop-1999",
    titleZh: "1999记忆当铺：我赎回妈妈的明天",
    titleEn: "Memory Pawnshop 1999",
    category: "AI年代奇幻亲情漫剧",
    trope: "年代怀旧、亲情救赎、记忆当铺、时间交易",
    protagonist: "赵小禾",
    ally: "旧唱片店老板",
    rival: "继父债主",
    antagonist: "当铺账房",
    coreObject: "红色当票",
    worldRule: "赎回一天未来，就要典当一段过去，且过去会被身边人共同遗忘。",
    visualStyle: "竖屏年代奇幻漫剧，1999街巷、录像厅、红色当票、暖黄灯和雨夜反光",
    trend: "年代情怀+亲情救赎+时间交易",
    audience: ["年代感", "亲情", "时间交易", "女性成长", "AI漫剧"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "interstellar-bride-return",
    titleZh: "星际新娘逃婚后：帝国舰队听我指挥",
    titleEn: "Interstellar Bride Return",
    category: "AI星际女性向漫剧",
    trope: "星际逃婚、女性权谋、舰队指挥、身份反转",
    protagonist: "黎星眠",
    ally: "叛逃舰长",
    rival: "帝国未婚夫",
    antagonist: "皇室智脑",
    coreObject: "舰队婚约芯片",
    worldRule: "婚约芯片能调动舰队，但每次指挥都会公开她一段被皇室篡改的记忆。",
    visualStyle: "竖屏星际漫剧，银蓝舰桥、星云、婚纱与军装对比、全息战术桌",
    trend: "星际女性向+逃婚+身份反转",
    audience: ["星际", "女性向", "逃婚", "舰队指挥", "AI漫剧"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "demon-school-top-student",
    titleZh: "妖校第一名：我靠补课镇压全班",
    titleEn: "Demon School Top Student",
    category: "AI校园妖怪轻喜漫剧",
    trope: "妖怪校园、学霸逆袭、轻喜悬疑、群像",
    protagonist: "季安安",
    ally: "猫妖班长",
    rival: "龙族转学生",
    antagonist: "教导主任魇兽",
    coreObject: "妖校错题本",
    worldRule: "每改对一道妖怪错题，就会暴露一名学生的本体秘密。",
    visualStyle: "竖屏校园妖怪漫剧，黑板符文、操场月光、校服与兽影、轻喜表情与悬疑光影",
    trend: "校园轻喜+妖怪设定+群像",
    audience: ["校园", "妖怪", "轻喜剧", "学霸逆袭", "AI漫剧"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "temple-tour-guide-ghost",
    titleZh: "古寺导游：游客都在前世死过",
    titleEn: "Temple Tour Guide Ghost",
    category: "AI文旅悬疑漫剧",
    trope: "文旅古寺、前世因果、导游职业、悬疑反转",
    protagonist: "许知遥",
    ally: "守寺僧人",
    rival: "网红探店博主",
    antagonist: "前世香客",
    coreObject: "旧香客名册",
    worldRule: "每带游客走完一条前世路线，就会唤醒他们曾经欠下的愿。",
    visualStyle: "竖屏文旅悬疑漫剧，古寺晨雾、香火、石阶、游客手机直播与前世幻影",
    trend: "文旅短剧+前世因果+古文明悬疑",
    audience: ["文旅", "古寺", "前世因果", "悬疑", "AI漫剧"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "ocean-eye-oracle",
    titleZh: "海眼预言：渔村少女看见龙王账本",
    titleEn: "Ocean Eye Oracle",
    category: "AI海洋民俗奇幻漫剧",
    trope: "海洋民俗、渔村少女、龙王账本、灾难预言",
    protagonist: "阿澜",
    ally: "失语潜水员",
    rival: "村长之子",
    antagonist: "海眼祭司",
    coreObject: "龙王账本",
    worldRule: "账本能预告海难，但每改一次账，海会向村里索取一件最珍贵的东西。",
    visualStyle: "竖屏海洋民俗漫剧，蓝绿色海雾、渔火、祭海红绸、潮汐低频和水下光影",
    trend: "民俗奇幻+灾难预言+地域特色",
    audience: ["民俗", "海洋", "灾难预言", "少女成长", "AI漫剧"]
  },
  {
    mode: "ai_manhua_drama",
    slug: "heavenly-app-cultivation",
    titleZh: "天庭APP：我在人间接神仙差评",
    titleEn: "Heavenly App Cultivation",
    category: "AI都市神话轻喜漫剧",
    trope: "天庭APP、神仙差评、人间打工、轻喜升级",
    protagonist: "程一粟",
    ally: "月老客服",
    rival: "雷部绩效官",
    antagonist: "天庭算法",
    coreObject: "神仙工单系统",
    worldRule: "每解决一条神仙差评，人间就会多出一个被误投的神迹。",
    visualStyle: "竖屏都市神话漫剧，手机工单、祥云弹窗、便利店夜班、神光与霓虹混合",
    trend: "神话现代化+打工人+轻喜爽点",
    audience: ["都市神话", "打工人", "轻喜", "神仙系统", "AI漫剧"]
  },
  {
    mode: "ai_short_drama",
    slug: "fake-heir-live-trial",
    titleZh: "假少爷直播审判：亲妈在弹幕里认我",
    titleEn: "Fake Heir Live Trial",
    category: "AI仿真人家庭逆袭短剧",
    trope: "真假少爷、直播审判、家庭认亲、身份反转",
    protagonist: "江望",
    ally: "弹幕里的母亲",
    rival: "真少爷",
    antagonist: "江家继承委员会",
    coreObject: "亲子鉴定直播间",
    worldRule: "直播间能放大真相，但每公开一条证据，就会让一个亲人被迫说出隐藏多年秘密。",
    visualStyle: "9:16 仿真人短剧，豪门客厅、直播灯、手机弹幕、家庭合照和近景微表情",
    trend: "真假少爷+直播审判+家庭伦理",
    audience: ["真假少爷", "家庭伦理", "直播审判", "下沉爽剧", "AI短剧"]
  },
  {
    mode: "ai_short_drama",
    slug: "divorced-ceo-medical-return",
    titleZh: "离婚当天，我成了前夫医院的救命医生",
    titleEn: "Divorced CEO Medical Return",
    category: "AI仿真人都市医疗短剧",
    trope: "离婚逆袭、医疗救援、前夫追悔、都市情感",
    protagonist: "林知夏",
    ally: "急诊主任",
    rival: "前夫新欢",
    antagonist: "医疗集团董事",
    coreObject: "手术风险档案",
    worldRule: "她能提前看见病历中的死亡风险，但每救一人都会暴露一段婚姻真相。",
    visualStyle: "9:16 仿真人医疗短剧，急诊冷光、手术室玻璃、白大褂、手机热搜和克制表演",
    trend: "离婚逆袭+医疗职场+女性成长",
    audience: ["都市情感", "医疗救援", "离婚逆袭", "追悔", "AI短剧"]
  },
  {
    mode: "ai_short_drama",
    slug: "village-boss-daughter",
    titleZh: "村口首富女儿：全村都以为我打工",
    titleEn: "Village Boss Daughter",
    category: "AI仿真人乡村逆袭短剧",
    trope: "乡村逆袭、隐藏身份、家族产业、下沉爽感",
    protagonist: "宋麦",
    ally: "老村医",
    rival: "堂姐",
    antagonist: "地产老板",
    coreObject: "村集体股权证",
    worldRule: "她每公开一层身份，就必须拿出一项真正能改变村子的证据。",
    visualStyle: "9:16 仿真人乡村短剧，村口集市、土路、旧厂房、股权文件和真实生活光线",
    trend: "乡村逆袭+隐藏身份+下沉市场",
    audience: ["乡村", "隐藏身份", "下沉爽剧", "家族产业", "AI短剧"]
  },
  {
    mode: "ai_short_drama",
    slug: "midnight-lawyer-evidence",
    titleZh: "午夜律师：证据会在12点重置",
    titleEn: "Midnight Lawyer Evidence",
    category: "AI仿真人律政悬疑短剧",
    trope: "律政悬疑、证据重置、职场逆袭、时间规则",
    protagonist: "顾清辞",
    ally: "实习律师",
    rival: "王牌检方",
    antagonist: "证据保管员",
    coreObject: "午夜证物袋",
    worldRule: "所有证据每天午夜都会重置，只有说谎者留下的手部动作不会改变。",
    visualStyle: "9:16 仿真人律政短剧，法院走廊、证物袋、监控画面、冷白灯和近景手部特写",
    trend: "律政+时间规则+悬疑反转",
    audience: ["律政", "悬疑", "证据反转", "职场逆袭", "AI短剧"]
  },
  {
    mode: "ai_short_drama",
    slug: "ai-boyfriend-contract",
    titleZh: "AI男友合同：他比真人更会撒谎",
    titleEn: "AI Boyfriend Contract",
    category: "AI仿真人情感悬疑短剧",
    trope: "AI恋人、情感契约、真假记忆、都市悬疑",
    protagonist: "乔茵",
    ally: "产品测试员",
    rival: "完美AI男友",
    antagonist: "恋爱算法公司",
    coreObject: "恋爱记忆合同",
    worldRule: "AI男友会满足所有愿望，但每次完美回应都会替换她一段真实恋爱记忆。",
    visualStyle: "9:16 仿真人情感短剧，智能公寓、手机聊天界面、冷暖双人光、微表情和反打",
    trend: "AI恋人+情感悬疑+都市女性",
    audience: ["AI恋人", "情感悬疑", "女性向", "真假记忆", "AI短剧"]
  },
  {
    mode: "ai_short_drama",
    slug: "takeout-millionaire-mother",
    titleZh: "外卖妈妈成首富：儿子在同学群骂我穷",
    titleEn: "Takeout Millionaire Mother",
    category: "AI仿真人家庭逆袭短剧",
    trope: "外卖妈妈、隐藏首富、亲情误解、家庭逆袭",
    protagonist: "周岚",
    ally: "旧同事司机",
    rival: "儿子班主任",
    antagonist: "前合伙人",
    coreObject: "旧公司股权协议",
    worldRule: "她每拿回一份股权，就必须面对一段被家人误解的过去。",
    visualStyle: "9:16 仿真人现实短剧，外卖雨衣、学校门口、旧办公室、合同特写和情绪近景",
    trend: "下沉亲情+隐藏身份+妈妈逆袭",
    audience: ["亲情", "妈妈逆袭", "隐藏首富", "现实题材", "AI短剧"]
  },
  {
    mode: "ai_short_drama",
    slug: "hotel-room-escape-24h",
    titleZh: "酒店24小时：我醒来成了凶案嫌疑人",
    titleEn: "Hotel Room Escape 24h",
    category: "AI仿真人封闭空间悬疑短剧",
    trope: "酒店密室、24小时倒计时、失忆嫌疑、反转逃生",
    protagonist: "韩舟",
    ally: "夜班前台",
    rival: "刑警队长",
    antagonist: "匿名入住人",
    coreObject: "房卡记录仪",
    worldRule: "房卡只能还原十二小时前的门锁记录，却会删除持卡人最近一次求救记忆。",
    visualStyle: "9:16 仿真人悬疑短剧，酒店走廊、门镜窥视、监控屏、冷黄灯和压缩空间",
    trend: "封闭空间+失忆嫌疑+悬疑逃生",
    audience: ["密室悬疑", "24小时倒计时", "失忆", "反转", "AI短剧"]
  },
  {
    mode: "ai_short_drama",
    slug: "pregnancy-test-boardroom",
    titleZh: "验孕棒董事会：我怀的是集团继承权",
    titleEn: "Pregnancy Test Boardroom",
    category: "AI仿真人豪门商战短剧",
    trope: "豪门商战、怀孕误会、董事会反杀、女性掌权",
    protagonist: "沈若宁",
    ally: "女律师",
    rival: "未婚夫姐姐",
    antagonist: "集团老董事",
    coreObject: "股权继承条款",
    worldRule: "继承权与孩子无关，只与谁能证明自己没有被婚约利用有关。",
    visualStyle: "9:16 仿真人商战短剧，董事会长桌、验孕棒特写、股权文件、黑白服装对峙",
    trend: "豪门商战+女性掌权+误会反转",
    audience: ["豪门", "商战", "女性掌权", "怀孕误会", "AI短剧"]
  },
  {
    mode: "ai_short_drama",
    slug: "subway-last-train-rules",
    titleZh: "末班地铁规则：别和第七节车厢的人说话",
    titleEn: "Subway Last Train Rules",
    category: "AI仿真人都市规则怪谈短剧",
    trope: "末班地铁、规则怪谈、都市惊悚、通勤生存",
    protagonist: "陆眠",
    ally: "盲人乘客",
    rival: "地铁安检员",
    antagonist: "第七节车厢广播",
    coreObject: "末班车票",
    worldRule: "车票会给出一条生存规则，但每遵守一条，就会有一名乘客忘记自己下车的站。",
    visualStyle: "9:16 仿真人规则怪谈短剧，地铁冷光、第七节车厢、车窗倒影、广播红灯",
    trend: "规则怪谈+地铁通勤+都市惊悚",
    audience: ["规则怪谈", "地铁", "都市惊悚", "生存规则", "AI短剧"]
  },
  {
    mode: "ai_short_drama",
    slug: "crossborder-wife-return",
    titleZh: "跨境妻子归来：我在海外替他还了十年债",
    titleEn: "Crossborder Wife Return",
    category: "AI仿真人出海情感短剧",
    trope: "出海情感、跨境婚姻、债务反转、女性归来",
    protagonist: "安若乔",
    ally: "海外律师",
    rival: "前夫新妻",
    antagonist: "跨境债务公司",
    coreObject: "海外债权文件",
    worldRule: "每追回一笔债务，她就能公开一个真相，但也会暴露一个孩子的身份线索。",
    visualStyle: "9:16 仿真人出海短剧，机场、海外街景、债权文件、双语手机界面和情绪反打",
    trend: "出海短剧+跨境情感+女性归来",
    audience: ["出海", "跨境情感", "债务反转", "女性成长", "AI短剧"]
  }
];

const arcNames = [
  "强钩子开局",
  "规则显影",
  "第一次反击",
  "代价出现",
  "盟友试探",
  "敌人换招",
  "证据断裂",
  "关系误伤",
  "身份裂缝",
  "中段爆点",
  "旧案翻面",
  "第一次惨胜",
  "反派设局",
  "公众审判",
  "核心背叛",
  "代价升级",
  "真相半露",
  "主角失控",
  "规则反噬",
  "盟友反转",
  "终局入场",
  "最后证据",
  "正面对决",
  "开放式胜利"
];

const beatFunctions = [
  "冷开场钩子",
  "主角目标建立",
  "规则或证据出现",
  "第一次压迫升级",
  "关键人物对峙",
  "信息反转",
  "代价显现",
  "关系变化",
  "结尾强钩子"
];

function stageLine(spec, episodeNumber, episodeCount = 24) {
  const arc = arcNames[episodeNumber - 1] || `第${episodeNumber}轮危机`;
  const finalSignal =
    episodeNumber === episodeCount
      ? `她赢下眼前终局，却发现${spec.coreObject}真正绑定的不是敌人，而是下一季更大的规则。`
      : `${spec.protagonist}没有立刻公布答案，而是把对手留下的破绽藏进下一集的局。`;

  return {
    arc,
    finalSignal
  };
}

function episodeTitle(spec, episodeNumber) {
  const key =
    [
    "第一条规则",
    "不该出现的证据",
    "假盟友",
    "代价开始",
    "旧身份",
    "敌人的善意",
    "证据被毁",
    "亲近的人撒谎",
    "第二份名单",
    "全网审判",
    "旧案回声",
    "第一次惨胜",
    "反派亲自下场",
    "公众倒戈",
    "核心背叛",
    "规则升级",
    "半个真相",
    "主角失控",
    "反噬之夜",
    "盟友的刀",
    "终局门票",
    "最后证据",
    "正面对决",
    "开放式胜利"
    ][episodeNumber - 1] || `第${episodeNumber}轮反转`;

  return `${key}：${spec.coreObject}`;
}

function buildEpisodeSeed(spec, episodeNumber, episodeCount = 24) {
  const { arc, finalSignal } = stageLine(spec, episodeNumber, episodeCount);
  const title = episodeTitle(spec, episodeNumber);
  const worldRule = sentenceFragment(spec.worldRule);
  const hook =
    episodeNumber === 1
      ? `${spec.protagonist}第一次触碰${spec.coreObject}，就看见${spec.ally}将在二十四小时内成为牺牲品。`
      : episodeNumber === episodeCount
        ? `${spec.antagonist}把最后一条规则公开，所有人都以为${spec.protagonist}已经没有翻盘余地。`
        : `${spec.protagonist}以为上一集留下的证据能赢，${spec.rival}却拿出一份更早准备好的反证。`;

  const summary = [
    `第${episodeNumber}集进入“${arc}”阶段，${spec.protagonist}的当下目标是围绕${spec.coreObject}拿到一条可被观众看懂、也能被角色执行的证据。`,
    `本集不靠解释推进，而是让${spec.visualStyle}里的光影、前景遮挡和空间压迫参与叙事；${spec.protagonist}先被${spec.rival}逼到公开场合，再发现${spec.antagonist}真正想掩盖的不是一件事，而是一整套能反复制造牺牲者的规则。`,
    `${spec.ally}在中段提供帮助，但这份帮助带有隐瞒，迫使主角判断盟友是想救她，还是想利用她接近${spec.coreObject}。`,
    `结尾落在“${finalSignal}”上，让观众带着新危机进入下一集。`
  ].join("");
  const endingHook =
    episodeNumber === episodeCount
      ? `${spec.protagonist}合上${spec.coreObject}，画面最后出现一行新字：第一季归档，第二份名单开启。`
      : `${spec.coreObject}在最后一秒自行翻面，露出第${episodeNumber + 1}集才会兑现的新代价。`;

  const scriptText = paragraph([
    `本集开场不解释世界观，直接把${spec.protagonist}推到${arc}的压力中心。镜头先给${spec.coreObject}的异常反应，再给${spec.protagonist}的停顿：她没有立刻冲上去，而是先观察${spec.rival}的手部动作、周围人的视线方向和环境里被刻意擦掉的痕迹。这个停顿说明她不是被剧情推着走，而是在判断这一局谁掌握了信息。`,
    `压迫段落里，${spec.antagonist}借${spec.trope}的表层矛盾把她逼进一个必须公开选择的场面。${spec.visualStyle}要在这里发挥作用：光线切在人物肩侧，前景遮挡制造窥视感，背景人群或系统界面持续施压。${spec.protagonist}说出口的话很短，但她真正想隐瞒的是“${worldRule}”这条规则。观众能感到她每一次呼吸、眼神闪避和手指收紧都在付代价。`,
    `转折发生在一件小证据上：${spec.coreObject}留下了与上一集不同的痕迹。${spec.ally}试图替她解释，反而暴露自己早就知道一部分规则。两人的关系从协作变成互相试探，${spec.protagonist}没有立刻拆穿，而是把证据换成一个更小、更安全的问题，让${spec.rival}先犯错。`,
    `爆发不是喊叫，而是行动。${spec.protagonist}在最不适合反击的位置做出反常选择，迫使${spec.antagonist}提前启用备用规则。她赢下一小步，却失去一个重要筹码。余韵里，${finalSignal} 这一集结束后，人物关系发生变化：盟友不再完全可信，敌人的目的更清楚，主角也更接近付费观众想追下去的核心谜底。`
  ]);

  return {
    episodeNumber,
    title,
    hook,
    summary,
    endingHook,
    scriptText
  };
}

function buildBeats(spec, episode) {
  const worldRule = sentenceFragment(spec.worldRule);

  return beatFunctions.map((functionName, index) => {
    const scene = [
      `${spec.coreObject}在画面前景出现异常反应，${spec.protagonist}被迫停在半步之外。`,
      `${spec.protagonist}把目标压低到一个可执行动作：先拿证据，再救人。`,
      `环境中出现与“${worldRule}”相关的第一处可视化规则痕迹。`,
      `${spec.rival}利用公开场合制造误解，让主角无法直接解释。`,
      `${spec.ally}与${spec.protagonist}隔着关键道具对峙，双方都有话没说全。`,
      `一处被忽略的细节证明${spec.antagonist}早已准备备用方案。`,
      `规则代价落到人物记忆、信任、名誉或身体反应上。`,
      `${spec.protagonist}和${spec.ally}的关系产生裂缝，沉默比争吵更有压力。`,
      `${spec.coreObject}释放下一集的钩子，观众只得到问题，不得到完整答案。`
    ][index];

    return {
      function: functionName,
      visualDesign: `${scene} 画面采用${spec.visualStyle}，主体、前景、背景保持三层关系，关键证据放在人物视线和手部动作之间。`,
      cameraLanguage:
        index % 3 === 0
          ? "低机位建立压迫感，随后缓慢推近人物眼神；前景遮挡形成窥视感，背景保持信息层次。"
          : index % 3 === 1
            ? "长焦压缩空间，正反打强化权力关系；焦点从关键道具转移到人物微表情。"
            : "主观镜头短暂进入角色视线，再切回稳定中近景，让观众先发现证据，再看见人物反应。",
      characterAction: `${spec.protagonist}没有立刻开口，先停顿半拍；她的手指轻轻收紧，视线从${spec.coreObject}移到${spec.rival}，又迅速避开。`,
      dramaticPurpose: `这一格服务于“${episode.title}”：人物目标是推进${episode.hook}背后的真相，隐藏冲突是${spec.protagonist}不敢公开“${worldRule}”这条规则。`,
      dialogue:
        index === 8
          ? episode.endingHook
          : index === 4
            ? `${spec.protagonist}：“你说得太顺了，像早就排练过。”`
            : `${spec.protagonist}：“先别急着让我认输。”`,
      soundDesign: "低频环境声、衣料摩擦、远处人群压低的议论声和关键道具的细微异响叠加；重要停顿处抽掉配乐。",
      endingHook:
        index === 8
          ? episode.endingHook
          : `${spec.coreObject}短暂闪烁，留下一个尚未解释的新痕迹。`
    };
  });
}

function buildScript(spec) {
  const episodeCount = spec.episodeCount || 24;
  const worldRule = sentenceFragment(spec.worldRule);
  const theme = {
    titleZh: spec.titleZh,
    titleEn: spec.titleEn,
    zhStyle: spec.visualStyle,
    enStyle:
      spec.mode === "ai_short_drama"
        ? "vertical 9:16 realistic AI short drama, restrained acting, close-up micro expressions, cinematic blocking, readable evidence, strong emotional hook"
        : "vertical cinematic AI manhua, consistent character design, layered lighting, expressive eyes, foreground obstruction, strong suspense"
  };

  const episodes = Array.from({ length: episodeCount }, (_, index) => {
    const seed = buildEpisodeSeed(spec, index + 1, episodeCount);
    return buildAdvancedEpisode({
      episode: {
        episodeNumber: seed.episodeNumber,
        title: seed.title,
        hook: seed.hook,
        summary: seed.summary,
        endingHook: seed.endingHook
      },
      scriptText: seed.scriptText,
      beats: buildBeats(spec, seed),
      theme,
      runtimeSeconds: spec.mode === "ai_short_drama" ? 80 : 75
    });
  });

  const master = {
    slug: spec.slug,
    title: {
      zh: spec.titleZh,
      en: spec.titleEn
    },
    primaryMode: spec.mode,
    supportedModes: spec.mode === "ai_short_drama" ? ["ai_short_drama", "ai_manhua_drama"] : ["ai_manhua_drama", "ai_short_drama"],
    logline: `${spec.protagonist}因${spec.coreObject}卷入${spec.trope}，必须在“${worldRule}”这条规则的代价中赢下${episodeCount}集连续反转。`,
    synopsis: `本剧根据 2026 年短剧与 AI 漫剧热题材信号设计，融合${spec.trend}。前 3 集快速完成强钩子、规则揭示和第一次反击；中段围绕${spec.coreObject}持续扩展证据链、关系误解和代价；后段进入公众审判、背叛和规则反噬；最后 4 集完成终局对决，并保留第二季钩子。全剧强调人物动机、短剧钩子、视觉生产可行性和付费交付厚度。`,
    category: spec.category,
    recommendedPlatforms:
      spec.mode === "ai_short_drama"
        ? ["抖音", "快手", "红果短剧", "视频号", "TikTok", "YouTube Shorts"]
        : ["抖音", "快手", "B站", "视频号", "小红书", "TikTok"],
    audienceTags: spec.audience,
    productionDifficulty: "medium",
    episodeCount,
    freeEpisodeCount: 3,
    commercialPolicy: {
      buyout: "一次性买断 24 集完整剧本、分镜、提示词和商业交付包，适合连续更新与矩阵投放。",
      payPerEpisode: "支持按集或按批购买第 4-24 集内容，适合边测试播放数据边继续制作。",
      revenueShare: "无需预付剧本费，审核通过后可按视频收益比例分成，适合账号方低成本持续更新。"
    },
    characters: [
      {
        name: spec.protagonist,
        role: "主角",
        motivation: `围绕${spec.coreObject}改变自己和身边人的命运。`,
        fear: `害怕赢下外部冲突，却被“${worldRule}”夺走真正重要的关系。`,
        secret: `她知道${spec.coreObject}的代价比所有人想象得更早开始。`,
        visualDesign: "造型稳定、眼神克制、手部动作细腻，适合 AI 视频连续生成。"
      },
      {
        name: spec.ally,
        role: "盟友",
        motivation: "帮助主角推进证据，但隐藏自己与核心规则的关系。",
        fear: "害怕主角发现自己曾经参与过第一轮伤害。",
        secret: "他掌握一份不能公开的旧证据。",
        visualDesign: "与主角形成冷暖色对照，常在背景或侧光中出现。"
      },
      {
        name: spec.rival,
        role: "表层对手",
        motivation: "阻止主角公开真相，以维持自己当前利益。",
        fear: "害怕被真正反派抛弃。",
        secret: "他不是终极主谋，只是被规则利用的人。",
        visualDesign: "表情管理强，近景要保留眼神闪避和手指紧张。"
      },
      {
        name: spec.antagonist,
        role: "终极反派",
        motivation: `利用${spec.coreObject}持续制造可控命运。`,
        fear: "害怕主角把规则公开到不可逆的程度。",
        secret: "他真正守护的是下一季更大的规则入口。",
        visualDesign: "尽量少正面露脸，以道具、影子、监控或声音建立压迫。"
      }
    ],
    worldview: spec.worldRule,
    visualStyle: spec.visualStyle,
    tone: "情绪克制但压迫，反转密集但不狗血，人物行为必须有动机，每集结尾都有继续看下去的理由。"
  };

  return buildAdvancedPayload({
    slug: spec.slug,
    status: "published",
    featured: true,
    trendEvidence: [
      {
        source: "codex_hot_topic_research_2026",
        keyword: spec.trend,
        heatScore: spec.mode === "ai_manhua_drama" ? 92 : 90,
        observedAt,
        platforms: platformEvidence
      }
    ],
    master,
    episodes
  });
}

function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const generated = specs.map((spec) => {
    const payload = buildScript(spec);
    const outputPath = path.join(outputDir, `generated-2026-hot-${spec.slug}.json`);
    writeAdvancedProductionInput(outputPath, payload);
    return {
      slug: spec.slug,
      mode: spec.mode,
      title: spec.titleZh,
      input: path.relative(projectRoot, outputPath).replace(/\\/g, "/"),
      episodes: payload.episodes.length,
      panelsPerEpisode: payload.episodes[0].aiManhuaDrama.panels.length,
      shotsPerEpisode: payload.episodes[0].aiShortDrama.shots.length
    };
  });

  const manifestPath = path.join(outputDir, "generated-2026-hot-24-batch-manifest.json");
  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify(
      {
        ok: true,
        observedAt,
        total: generated.length,
        aiManhuaDrama: generated.filter((item) => item.mode === "ai_manhua_drama").length,
        aiShortDrama: generated.filter((item) => item.mode === "ai_short_drama").length,
        generated
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        total: generated.length,
        aiManhuaDrama: generated.filter((item) => item.mode === "ai_manhua_drama").length,
        aiShortDrama: generated.filter((item) => item.mode === "ai_short_drama").length,
        manifest: path.relative(projectRoot, manifestPath).replace(/\\/g, "/")
      },
      null,
      2
    )
  );
}

if (require.main === module) {
  main();
}

module.exports = {
  buildScript,
  specs,
  platformEvidence,
  observedAt
};
