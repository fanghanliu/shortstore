const fs = require("fs");
const path = require("path");

const DEFAULT_SOURCE = "她闻到谎言.storyboard.json";

const productProfiles = {
  "她闻到谎言": {
    productId: "storypack-lie-scent-001",
    title: { zh: "她闻到谎言", en: "She Smells Lies" },
    logline: {
      zh: "能闻到谎言气味的危机公关女王，被一桩豪门前妻死亡案拖入旧案迷雾；她越接近真相，越发现自己才是这场骗局最早的猎物。",
      en: "A crisis PR strategist who can smell lies is pulled into the death case of a tycoon's ex-wife, only to realize she may have been the first target of the conspiracy."
    },
    coverImage: "assets/cover-lie-scent.png",
    synopsis: "苏清妤是业内最冷静的危机公关顾问，也拥有一个秘密能力：她能闻到谎言的气味。雨夜，她接下一桩天价委托，为顾氏集团继承人顾宴臣洗清前妻死亡疑云，却发现顾宴臣身上的消毒水味与母亲失踪旧案现场完全一致。她表面接案，暗中调查，在豪门权斗、疗养院旧案和被篡改的记忆之间不断逼近真相。",
    coreHook: "女主能闻到谎言，每一次气味变化都代表一层真相反转。",
    genreTags: ["现代悬疑", "都市商战", "情感拉扯", "豪门旧案", "女性向反转"],
    emotionalEngine: "查案复仇与危险互信同步推进，每一次亲近都伴随新的嫌疑。",
    conflictEngine: "表面是前妻死亡案危机公关，深层是疗养院旧案、集团权斗和女主身世真相。",
    endingDirection: "女主公开疗养院黑幕，男主交出继承权换取证据链曝光，两人在新的危机现场重新并肩。",
    characters: [
      {
        name: "苏清妤",
        role: "女主 / 危机公关顾问",
        age: 28,
        archetype: "冷静理性、感官异常、带伤复仇的女性调查者",
        visual_anchor: "清冷精致，黑色微卷短发，象牙白真丝衬衫，细框眼镜，左锁骨旧银色小项链。",
        ability_or_secret: "能通过气味分辨谎言、恐惧和被掩盖的记忆触发物。",
        desire: "查清母亲失踪真相，同时证明自己不是任何人的棋子。",
        fear: "自己的记忆和判断被人长期操控。",
        production_note: "表演重点是克制、停顿、轻微吸气和眼神骤冷，适合做短视频强特写。"
      },
      {
        name: "顾宴臣",
        role: "男主 / 顾氏集团继承人",
        age: 31,
        archetype: "高压冷感、背负嫌疑、以危险方式保护女主的权力玩家",
        visual_anchor: "深炭灰定制西装，黑衬衫无领带，银色机械腕表，身形挺拔，轮廓冷峻。",
        ability_or_secret: "暗中调查顾氏疗养院项目多年，前妻死亡前曾向他求救。",
        desire: "摧毁顾氏内部黑幕，同时保护女主不重蹈前妻覆辙。",
        fear: "自己越靠近女主，越会把她拖进致命权斗。",
        production_note: "表演重点是低声压迫、沉默停顿、突然靠近和视线审讯感。"
      }
    ],
    episodeOutline: [
      { arc: "开局钩子", episodes: "1-6", summary: "女主接下男主前妻死亡公关案，并闻到与母亲旧案相同的气味。" },
      { arc: "危险互信", episodes: "7-14", summary: "女主追查香水样本和疗养院旧档，男主阻止她也救她，嫌疑与保护同步加深。" },
      { arc: "旧案回潮", episodes: "15-24", summary: "前妻死因、女主童年病历和顾氏董事会被同一条证据链牵住。" },
      { arc: "身份反转", episodes: "25-36", summary: "女主能力来源曝光，可靠盟友的身份开始崩塌。" },
      { arc: "终局曝光", episodes: "37-48", summary: "女主用危机发布会反向设局，让真正反派在镜头前露出破绽。" }
    ]
  },
  last_cloud_city: {
    productId: "storypack-last-cloud-city-001",
    title: { zh: "最后一座云端城", en: "The Last Cloud City" },
    logline: {
      zh: "废土少女黎烬为救被选中“升城”的弟弟，闯入酸雨世界上空最后一座云端乌托邦，却发现升城不是救赎，而是一场以底层生命供养永生系统的阶级骗局。",
      en: "A wasteland girl infiltrates the last cloudborne utopia to save her brother, only to uncover an immortality system fed by the lives of the lower class."
    },
    coverImage: "assets/cover-last-cloud-city.png",
    synopsis: "酸雨吞没大地后，幸存者被困在废土集市与地下管网中，仰望云端城的干净天空。19岁的黎烬在升城名单上看见弟弟黎星的名字，本以为那是通往新生活的资格，却在断续求救信号中听见真相。她潜入升城流程，结识神秘引路人祁昼，逐步发现云端城用“升城者”的意识和身体维持永生系统。越靠近核心，她越发现母亲的失踪、弟弟的资格、祁昼的背叛嫌疑，都指向同一个被称作诺亚的云端意志。",
    coreHook: "升城看似阶级跃迁，实则是献祭；女主每向上一步，都离亲人和真相更近，也离死亡更近。",
    genreTags: ["科幻废土", "阶级悬疑", "姐弟羁绊", "云端乌托邦", "高燃反转"],
    emotionalEngine: "姐姐救弟弟的强情感目标贯穿全剧，祁昼的敌友难辨制造持续拉扯。",
    conflictEngine: "废土底层求生、云端贵族永生系统、诺亚意识控制和母亲旧案四条线交织。",
    endingDirection: "黎烬撕开升城真相，将云端城的能源选择权交还所有幸存者；她救回弟弟，也让废土第一次拥有真正的天空。",
    characters: [
      {
        name: "黎烬",
        role: "女主 / 废土拾荒者",
        age: 19,
        archetype: "野性、敏锐、为亲人不惜闯入权力核心的底层少女",
        visual_anchor: "短黑发，灰尘和细小伤痕覆盖面颊，旧防辐射披风，磨损金属护腕，眼神警觉锋利。",
        ability_or_secret: "擅长废旧机械改造和信号破解，身体里藏着母亲留下的云端权限碎片。",
        desire: "救回弟弟黎星，并弄清母亲失踪和升城制度的真相。",
        fear: "自己拼命守护的人最终也会成为云端系统的燃料。",
        production_note: "动作要利落，眼神要像长期缺乏安全感的人；废土场景适合大量手持跟拍和近景呼吸感。"
      },
      {
        name: "祁昼",
        role: "男主 / 云端城叛逃引路人",
        age: 24,
        archetype: "冷静、破碎、熟悉云端规则却背负背叛嫌疑的危险盟友",
        visual_anchor: "苍白肤色，银灰短发，云端制服外披黑色旧斗篷，颈侧有细密接口疤痕。",
        ability_or_secret: "曾是云端系统维护者，知道诺亚核心入口，也知道黎烬母亲留下的权限真相。",
        desire: "摧毁诺亚系统，赎回自己曾参与升城筛选的罪。",
        fear: "黎烬发现他曾经亲手把黎星列入升城名单。",
        production_note: "前期保持疏离和信息不透明，后期用沉默保护和关键牺牲完成信任反转。"
      },
      {
        name: "黎星",
        role: "女主弟弟 / 被选中的升城者",
        age: 13,
        archetype: "天真、聪明、承载姐姐软肋和云端阴谋关键权限的少年",
        visual_anchor: "瘦弱少年，旧护目镜，手腕绑着姐姐做的红色信号绳。",
        ability_or_secret: "他的神经适配度极高，是诺亚系统寻找的新核心容器。",
        desire: "不再拖累姐姐，真正看一次没有酸雨的天空。",
        fear: "自己被救出后会让更多人死去。",
        production_note: "尽量通过通讯残影、监控画面和冷冻舱特写出现，保持牵引力。"
      },
      {
        name: "诺亚",
        role: "反派核心 / 云端城永生系统",
        archetype: "以救赎之名运行剥削的机械神明",
        visual_anchor: "白色穹顶、悬浮字幕、圣洁机械声、云端屏幕中无性别的光影人形。",
        ability_or_secret: "通过筛选升城者的身体和意识延续云端贵族寿命。",
        production_note: "声音要温柔、画面要圣洁，反差越强越有压迫感。"
      }
    ],
    episodeOutline: [
      { arc: "名单钩子", episodes: "1-6", summary: "黎烬发现弟弟入选升城名单，收到求救信号后潜入升城检测和货舱。" },
      { arc: "云端骗局", episodes: "7-14", summary: "黎烬进入云端城边缘，见到贵族乌托邦与失败升城者残骸的强烈反差。" },
      { arc: "敌友反转", episodes: "15-24", summary: "祁昼身份曝光，黎烬发现母亲旧案与诺亚系统直接相关。" },
      { arc: "核心献祭", episodes: "25-36", summary: "黎星被确认是新核心容器，云端贵族准备重启永生仪式。" },
      { arc: "天空重启", episodes: "37-48", summary: "黎烬用母亲留下的权限反向接管诺亚，把真相广播给废土与云端所有人。" }
    ]
  }
  ,
  live_revenge: {
    productId: "storypack-live-revenge-001",
    title: { zh: "第99次直播复仇", en: "The 99th Livestream Revenge" },
    logline: {
      zh: "被全网封杀的过气女主播，用第99个小号重开直播，靠一场场公开审判，把昔日毁掉她的人送上热搜。",
      en: "A disgraced livestream queen returns with her 99th account, turning each broadcast into a public trial against those who destroyed her."
    },
    coverImage: "assets/storyboards/live-revenge/frame-01.png",
    synopsis: "三年前，千万级带货女主播温栀被假货、逼死助理、偷税漏税三重黑料毁掉。她被平台封号，被品牌索赔，被全网网暴，母亲也因此病倒。三年后，她用第99个小号重开直播，不卖货，不求打赏，只公开验货、查账、撕合同。每一场直播，她只放出一点证据，逼乔蔓、周启明、许嘉年、平台内鬼和资本老板程砚主动露馅。账号从7人在线一路冲到5000万人围观，直播间从网暴现场变成全民陪审团。",
    coreHook: "女主不哭惨洗白，而是用直播规则反杀直播行业黑幕；每一集都是一场公开审判。",
    genreTags: ["现代都市", "直播逆袭", "账号复仇", "爽文反转", "舆论战"],
    emotionalEngine: "女主被全网误解后的冷静反击、母亲病房线和男主封号保护真相形成情绪拉扯。",
    conflictEngine: "温栀的证据直播不断逼迫乔蔓、周启明、平台内鬼和资本方下场回应，每次回应都成为下一场反杀证据。",
    endingDirection: "最终直播公开完整证据链，温栀恢复账号并成为年度第一主播；已故助理林晚账号发来私信，开启第100场直播悬念。",
    characters: [
      {
        name: "温栀",
        role: "女主 / 被封杀的过气主播",
        age: 29,
        archetype: "冷艳清醒、极懂直播节奏和舆论反杀的复仇型女主",
        visual_anchor: "冷艳、疲惫、清醒，直播时永远穿黑色西装外套，低马尾，冷调妆容，眼神克制锋利。",
        ability_or_secret: "掌握三年前所有局中人的原始证据，但每集只放一点，让敌人主动露馅。",
        desire: "洗清自己、保护母亲、替林晚讨回真相，并把行业黑幕公之于众。",
        fear: "再次开播会让母亲和证人被敌人定位伤害。",
        production_note: "表演重点是冷静压场、直播镜头感、证据反杀时的短暂停顿和眼神压迫。"
      },
      {
        name: "陆沉舟",
        role: "男主 / 独立数据取证师",
        age: 31,
        archetype: "冷静克制、背负误解、用技术弥补旧案遗憾的守护者",
        visual_anchor: "黑框眼镜，深灰衬衫，冷静技术感，常被多屏蓝光映亮半张脸。",
        ability_or_secret: "曾封掉温栀98个账号，其实是为了阻止敌人定位她母亲。",
        desire: "还温栀一个真相，并追出三年前被上层压下的数据证据。",
        fear: "温栀永远不会相信自己当年的保护。",
        production_note: "表演重点是少说话、快速判断、技术屏幕前的压抑情绪。"
      },
      {
        name: "乔蔓",
        role: "女二 / 新晋顶流主播",
        age: 27,
        archetype: "甜美小白花外壳下的背叛者和可替换棋子",
        visual_anchor: "甜美亲和，浅色针织衫，直播间暖粉色滤镜，哭戏精准但眼神慌乱。",
        ability_or_secret: "当年伪造控诉并签收被调包货物，踩着温栀上位。",
        production_note: "前期要让观众相信她无辜，后期哭戏逐渐失控。"
      },
      {
        name: "周启明",
        role: "反派 / 星途MCN老板",
        age: 38,
        archetype: "行业伯乐外衣下的供应链和封杀操盘手",
        visual_anchor: "深色商务西装，温和笑容，昂贵腕表，会议室和豪华直播间中的压迫感。",
        ability_or_secret: "操控假货供应链、合同陷阱、账号封杀，是资本链条的中层操盘者。",
        production_note: "永远体面，越体面越危险。"
      }
    ],
    episodeOutline: [
      { arc: "第99个账号开播", episodes: "1-5", summary: "温栀重新开播验货、反杀黑粉、拆解乔蔓假哭，证明三年前假货案疑点重重。" },
      { arc: "账号爆火与封杀路径", episodes: "6-10", summary: "陆沉舟出现，揭开封号权限来自星途MCN和外部资本，林晚旧账号上线。" },
      { arc: "全民陪审团", episodes: "11-16", summary: "温栀修复林晚视频，逼许嘉年和乔蔓下场，直播复仇变成全网连载。" },
      { arc: "保护真相反转", episodes: "17-20", summary: "母亲病房遇险，陆沉舟封她98次的真相曝光，许嘉年交出关键录音。" },
      { arc: "终极公开处刑", episodes: "21-24", summary: "平台内鬼、洗钱链条和榜一大哥程砚现身，温栀用最终直播公开完整证据链。" }
    ]
  },
  love_algorithm: {
    productId: "storypack-love-algorithm-001",
    title: { zh: "恋爱算法失控中", en: "Love Algorithm Out of Control" },
    logline: {
      zh: "专门拆穿恋爱骗局的女程序员，被自家AI恋爱算法错配给最大投资人兼前任死对头，被迫开启30天全球直播合约恋爱。",
      en: "A romance-scam debunking coder is matched by her own AI dating algorithm with her biggest investor and former enemy, forcing a 30-day global fake-dating livestream."
    },
    coverImage: "assets/storyboards/love-algorithm/frame-01.png",
    synopsis: "近未来都市，LovePilot海外版上线前夜，首席算法工程师姜梨被自家AI系统Cupid推成全球最高匹配对象，另一半却是她三年前创业失败后互相拉黑的投资人顾屿白。为了挽救发布会和海外热度，两人签下30天恋爱直播合约，每天完成AI恋爱任务，从同居、一美元心动罚款、情侣挑战到发布会告白事故。姜梨以为算法失控，后来才发现Cupid调用的是被删除、未发送、未表达的情感残留；真正失控的不是算法，而是他们从未停止的心动。",
    coreHook: "AI把前任死对头推成全球第一匹配，假情侣直播每集一个甜宠任务，把商业危机变成全网嗑CP连续剧。",
    genreTags: ["AI甜宠", "合约恋爱", "都市轻喜剧", "海外平台短剧", "先婚后爱式误配"],
    emotionalEngine: "嘴硬理工女和腹黑投资人从互怼营业到旧误会解开，甜点、误会和数据真相交替推进。",
    conflictEngine: "海外上线危机、AI匹配Bug、三年前创业债务误会、黑客攻击和直播舆论共同把两人逼向真心。",
    endingDirection: "姜梨在发布会上承认喜欢顾屿白，Cupid宣布真实爱情超出算法预测；季终把Nina和陆今安推成下一组最高匹配。",
    characters: [
      {
        name: "姜梨",
        role: "女主 / LovePilot首席算法工程师",
        age: 27,
        archetype: "理性嘴硬、擅长拆穿暧昧套路却看不懂自己真心的AI恋爱专家",
        visual_anchor: "清爽漂亮，白衬衫或浅色针织衫，牛仔裤，细框眼镜，工作时冷感克制，动心时耳尖先红。",
        ability_or_secret: "精通恋爱匹配模型和用户行为分析，却保留着三年前与顾屿白的旧数据残留。",
        desire: "证明算法没有错，守住LovePilot海外发布，同时弄清三年前顾屿白是否真的背叛自己。",
        fear: "自己引以为傲的理性和判断，从一开始就输给了不肯承认的爱。",
        production_note: "表演重点是快速逻辑反击、嘴硬停顿、被甜点击中后的短暂失控，适合特写和弹幕反应。"
      },
      {
        name: "顾屿白",
        role: "男主 / 科技投资人",
        age: 30,
        archetype: "斯文矜贵、克制腹黑、替女主背债却不解释的深情前任",
        visual_anchor: "深色西装、浅灰大衣、白衬衫，笑起来温柔，谈判时冷静，面对姜梨时容易破防。",
        ability_or_secret: "三年前并未撤资背叛，而是替姜梨扛下创业债务并主动退出。",
        desire: "保护姜梨和LovePilot，也让她知道自己从未放下。",
        fear: "姜梨知道真相后会自责，或永远只把他的靠近当成商业算计。",
        production_note: "表演重点是温柔盯视、半开玩笑的撩拨、旧伤被触及时的克制沉默。"
      },
      {
        name: "Nina",
        role: "海外运营总监",
        age: 32,
        archetype: "嘴毒高效、把感情危机包装成营销爆点的流量操盘手",
        visual_anchor: "利落短发，极简职业套装，平板不离手，走路带风。",
        ability_or_secret: "安排Serena做压力测试，擅长把分手、吃醋和误会剪成爆款素材。",
        production_note: "喜剧节奏要快，吐槽像商务汇报，越冷静越好笑。"
      },
      {
        name: "陆今安",
        role: "男二 / AI心理学顾问",
        age: 28,
        archetype: "温柔可靠、最早知道算法真相却选择成全的旁观者",
        visual_anchor: "浅色衬衫，细框眼镜，安静温和，常站在实验室冷白光里。",
        ability_or_secret: "知道Cupid不是误配，而是证明姜梨和顾屿白从未真正停止相爱。",
        production_note: "前期像温柔男二，后期承担真相解释和第二季钩子。"
      }
    ],
    episodeOutline: [
      { arc: "算法误配开局", episodes: "1-6", summary: "LovePilot把姜梨和顾屿白推成全球第一匹配，两人被迫签下30天恋爱直播合约。" },
      { arc: "假戏真甜爆火", episodes: "7-12", summary: "一美元罚款、旧汉堡店、Serena压力测试和旧账单让两人的营业逐渐露出真心。" },
      { arc: "误会与分手", episodes: "13-18", summary: "见家长、雨夜递伞和黑客攻击把旧误会推到顶点，分手后姜梨发现顾屿白一直在保护她。" },
      { arc: "算法真相", episodes: "19-20", summary: "陆今安揭开Cupid没有失控，旧手机恢复出顾屿白三年前99条未送达消息。" },
      { arc: "合约变真爱", episodes: "21-24", summary: "发布会告白、一美元定金和新实验室合约完成复合，Cupid抛出Nina与陆今安的下一季匹配。" }
    ]
  }
};

function normalizeBaseName(filePath) {
  return path.basename(filePath, path.extname(filePath)).replace(/\.storyboard$/i, "");
}

function outputNameFor(sourcePath, profile) {
  if (profile.title.zh === "她闻到谎言") return "她闻到谎言.product-template.json";
  return `${normalizeBaseName(sourcePath).replace(/_storyboard$/i, "")}.product-template.json`;
}

function pickProfile(sourcePath) {
  const base = normalizeBaseName(sourcePath);
  if (base.includes("last_cloud_city")) return productProfiles.last_cloud_city;
  if (base.includes("live_revenge")) return productProfiles.live_revenge;
  if (base.includes("love_algorithm")) return productProfiles.love_algorithm;
  if (base.includes("她闻到谎言")) return productProfiles["她闻到谎言"];

  return {
    productId: `storypack-${base.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-001`,
    title: { zh: base, en: base },
    logline: {
      zh: "一套可直接进入 AI 短剧生产流程的完整故事板商品包。",
      en: "A complete storyboard product pack ready for AI short-drama production."
    },
    coverImage: "assets/cover-placeholder.png",
    synopsis: "此模板由分镜 JSON 自动生成，适合继续补充人物设定、商业卖点、提示词和交付说明。",
    coreHook: "以强钩子分镜作为短剧生产起点。",
    genreTags: ["AI短剧", "故事板", "提示词包"],
    emotionalEngine: "围绕主线人物目标推进情绪和反转。",
    conflictEngine: "通过外部危机与人物秘密制造连续追看动力。",
    endingDirection: "保留可扩展结局，便于后续做 24 集、48 集或 60 集版本。",
    characters: [],
    episodeOutline: []
  };
}

function scenePrompt(scene) {
  const location = scene.environment?.location?.zh || scene.environment?.location?.en || "";
  const lighting = scene.environment?.lighting?.zh || scene.environment?.lighting?.en || "";
  const action = (scene.characters || [])
    .map((character) => `${character.name}: ${character.action?.zh || character.action?.en || ""}`)
    .join("；");
  const camera = scene.camera_movement?.zh || scene.camera_movement?.en || "";

  return [location, lighting, action, camera].filter(Boolean).join("。");
}

function buildProduct(storyboard, sourcePath) {
  const profile = pickProfile(sourcePath);
  const metadata = storyboard.global_metadata || {};
  const scenes = storyboard.scenes || [];
  const firstScenes = scenes.slice(0, 5);

  return {
    schema_version: "1.0.0",
    product_type: "AI短剧故事板生产包",
    product_metadata: {
      product_id: profile.productId,
      title: profile.title,
      logline: profile.logline,
      category: metadata.video_type,
      target_buyers: [
        "AI短剧创作者",
        "短视频矩阵账号团队",
        "Runway / Sora / 可灵 / 即梦视频生产者",
        "ReelShort / TikTok 剧情号操盘手"
      ],
      recommended_platforms: metadata.target_platforms || [],
      recommended_aspect_ratio: metadata.recommended_aspect_ratio,
      estimated_total_duration: metadata.estimated_total_duration,
      language_versions: ["中文", "English prompt-ready"],
      commercial_positioning: `${profile.title.zh} 是一套面向竖屏 AI 短剧生产的标准版商品模板，适合用于选题测试、分镜生成、样片制作和商业化短剧项目启动。`
    },
    sales_page: {
      hero_headline: `买下《${profile.title.zh}》，直接进入 AI 短剧生产。`,
      hero_subtitle: "完整剧情、人设关系、核心分镜、中英双语视频提示词和视觉样片方向已打包完成，创作者只需要继续扩集、生成和剪辑。",
      key_selling_points: [
        `题材清晰：${(metadata.video_type && metadata.video_type.zh) || profile.genreTags.join(" / ")}，适合做竖屏强钩子内容。`,
        `主线强：${profile.coreHook}`,
        "生产资料完整：每个场景包含环境、角色动作、镜头运动、音效和中英双语描述。",
        "平台适配清晰：可用于抖音、快手、小红书、TikTok、ReelShort、Runway、Midjourney 等内容测试。",
        "适合标准版交付：买家拿到后可继续扩写台词、生成关键帧、制作样片并快速验证流量。"
      ],
      buyer_outcome: "购买后获得一套可继续扩写、可生成分镜图、可投喂视频生成工具的短剧前期生产资产。",
      preview_policy: "公开页只展示剧情梗概、人物设定节选、3-5 条分镜样例和水印视觉样片；完整 JSON、全量提示词和商用授权购买后交付。"
    },
    story_package: {
      synopsis: profile.synopsis,
      core_hook: profile.coreHook,
      genre_tags: profile.genreTags,
      visual_style_tags: metadata.visual_style_tags || [],
      emotional_engine: profile.emotionalEngine,
      conflict_engine: profile.conflictEngine,
      episode_count_recommendation: {
        miniseries: "24集核心版",
        commercial_short_drama: "36-48集扩展版",
        overseas_vertical: "60集以内，每集45-75秒"
      },
      first_five_scene_hooks: firstScenes.map((scene) => ({
        scene_id: scene.scene_id,
        hook: scenePrompt(scene)
      })),
      ending_direction: profile.endingDirection
    },
    characters: profile.characters,
    episode_outline: profile.episodeOutline,
    production_package: {
      included_assets: [
        "完整商品版 JSON",
        `${scenes.length} 条核心分镜故事板`,
        "人物设定与视觉锚点",
        "分集大纲与反转节奏",
        "中英双语 AI 视频提示词",
        "封面与样片方向说明",
        "平台适配与投流钩子",
        "商用授权说明"
      ],
      suggested_workflow: [
        "先用人物视觉锚点生成角色定妆图。",
        "再按分镜 JSON 逐条生成关键镜头图。",
        "将关键镜头图作为参考输入视频生成工具。",
        "用每集钩子扩写成 45-75 秒竖屏短剧脚本。",
        "剪辑时保留核心道具、强特写和反转节点。"
      ],
      buyer_work_remaining: [
        "根据账号风格扩写完整台词。",
        "选择具体 AI 视频工具并调整提示词长度。",
        "生成、剪辑、配音、字幕和平台发布。",
        "如用于商业投放，需要自行确认平台素材合规。"
      ]
    },
    prompt_library: {
      global_style_prompt_zh: `${profile.genreTags.join("，")}，${(metadata.visual_style_tags || []).join("，")}，竖屏9:16，电影级光影，高质量短剧画面，强情绪张力，清晰人物动作，连续剧叙事感。`,
      global_style_prompt_en: `${profile.genreTags.join(", ")}, vertical 9:16 cinematic short drama, premium lighting, clear character actions, strong emotional tension, serialized storytelling, production-ready AI video frame.`,
      character_consistency_prompts: profile.characters.map((character) => ({
        character: character.name,
        zh: character.visual_anchor,
        en: character.visual_anchor
      })),
      scene_prompt_samples: firstScenes.map((scene) => ({
        scene_id: scene.scene_id,
        zh: scenePrompt(scene),
        en: [
          scene.environment?.location?.en,
          scene.environment?.lighting?.en,
          (scene.characters || []).map((character) => `${character.name}: ${character.action?.en || ""}`).join("; "),
          scene.camera_movement?.en
        ].filter(Boolean).join(". ")
      })),
      negative_prompt: "不要卡通风，不要低清晰度，不要夸张表情，不要多余文字，不要水印，不要畸形手指，不要脸部崩坏，不要无关角色。",
      platform_prompt_notes: {
        "Sora / Runway": "使用英文场景提示词，保留 camera_movement 和 lighting 字段，减少抽象剧情解释。",
        "可灵 / 即梦": "优先使用中文环境、角色动作、镜头运动字段，强调人物一致性和竖屏构图。",
        "Midjourney": "用角色视觉锚点 + 场景环境 + 电影光影生成封面和关键帧。",
        "剪映 / CapCut": "用于后期字幕、配乐、转场和短剧节奏包装。"
      }
    },
    visual_samples: {
      cover_image: profile.coverImage,
      suggested_sample_shots: firstScenes.map((scene) => scenePrompt(scene)),
      public_preview_count: Math.min(5, scenes.length),
      watermark_recommendation: "公开展示图建议加半透明站点水印，完整高清图仅购买后交付。"
    },
    pricing_and_license: {
      suggested_price_tiers: [
        {
          tier: "体验版",
          price_cny: 199,
          includes: ["剧情简介", "人物设定节选", "5条分镜样例", "部分提示词"],
          license: "仅供学习与内部测试，不含商用发布授权。"
        },
        {
          tier: "标准版",
          price_cny: 599,
          includes: ["完整商品 JSON", `${scenes.length} 条核心分镜`, "提示词库", "平台适配建议", "单项目商用授权"],
          license: "允许用于一个短剧项目的制作、发布和商业化，不允许原样转售素材包。"
        },
        {
          tier: "定制版",
          price_cny: 1999,
          includes: ["标准版全部内容", "定制人设/题材", "新增10条分镜", "一次结构修改", "投流钩子优化"],
          license: "按定制合同约定，可选买断或单项目授权。"
        }
      ],
      refund_note: "数字内容交付后不支持无理由退款；如文件损坏或缺项，可补发修正版。"
    },
    delivery: {
      file_manifest: [
        "product-template.json",
        "storyboard.json",
        "characters.md",
        "episode-outline.md",
        "prompts-zh-en.md",
        "sample-cover.png",
        "license.txt"
      ],
      delivery_method: "站内下载、网盘链接或人工邮件交付均可。",
      versioning_note: "建议每次修改递增 schema_version 或 release_version，方便客户拿到更新版。"
    },
    source_storyboard_summary: {
      source_file: sourcePath,
      scene_count: scenes.length,
      original_metadata: metadata
    },
    scenes
  };
}

const sourcePath = process.argv[2] || DEFAULT_SOURCE;
const storyboard = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const product = buildProduct(storyboard, sourcePath);
const outputPath = process.argv[3] || outputNameFor(sourcePath, pickProfile(sourcePath));

fs.writeFileSync(outputPath, `${JSON.stringify(product, null, 2)}\n`, "utf8");
console.log(`Wrote ${outputPath}`);
