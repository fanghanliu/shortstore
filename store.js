const fs = require("fs");

const scriptSchema = {
  type: "object",
  required: ["global_metadata", "scenes"],
  properties: {
    global_metadata: {
      type: "object",
      required: [
        "video_type",
        "recommended_aspect_ratio",
        "target_platforms",
        "visual_style_tags",
        "estimated_total_duration"
      ]
    },
    scenes: {
      type: "array"
    }
  }
};

const anchors = {
  温栀: {
    zh: "29岁亚洲女性，冷艳疲惫但眼神清醒，黑色西装外套，低马尾，干净冷调妆容，直播镜头前克制锋利",
    en: "A 29-year-old Asian woman, cold elegant and exhausted yet clear-eyed, black blazer, low ponytail, restrained cool-toned makeup, sharp composure on livestream camera"
  },
  陆沉舟: {
    zh: "31岁亚洲男性，冷静克制，黑框眼镜，深灰衬衫，技术取证师气质，屏幕蓝光映脸",
    en: "A 31-year-old Asian man, calm and restrained, black-rim glasses, dark gray shirt, digital forensic analyst presence, blue screen glow on his face"
  },
  乔蔓: {
    zh: "27岁亚洲女性，甜美亲和，小白花主播妆容，浅色针织衫，镜头前会卖惨，眼神深处有慌乱",
    en: "A 27-year-old Asian woman, sweet approachable influencer look, pale knitwear, tearful innocent livestream persona, panic hidden in her eyes"
  },
  周启明: {
    zh: "38岁亚洲男性，星途MCN老板，深色商务西装，笑容温和但压迫感强，手戴昂贵腕表",
    en: "A 38-year-old Asian man, MCN boss in dark business suit, gentle smile with oppressive aura, expensive wristwatch"
  },
  许嘉年: {
    zh: "26岁亚洲男性，流量男主播，潮牌外套，笑容讨喜，镜头感强，真实情绪常被玩笑掩盖",
    en: "A 26-year-old Asian male livestreamer, trendy jacket, charming smile, camera-savvy, hiding real emotion behind jokes"
  },
  林晚: {
    zh: "已故年轻女助理，素净白衬衫，疲惫眼神，常以旧视频、邮件残影和监控画面出现",
    en: "A deceased young female assistant, plain white shirt, tired eyes, appearing through old videos, email traces, and surveillance footage"
  },
  程砚: {
    zh: "40岁亚洲男性，资本方大老板，极简黑色高定西装，温和语气下藏着病态占有欲",
    en: "A 40-year-old Asian male investor, minimalist black bespoke suit, calm voice hiding obsessive possessiveness"
  },
  温母: {
    zh: "病床上的中年亚洲女性，苍白虚弱，手指微颤，病房灯光下显得安静而脆弱",
    en: "A middle-aged Asian woman in hospital bed, pale and weak, trembling fingers, fragile under ward lighting"
  },
  姜梨: {
    zh: "27岁亚洲女性，LovePilot首席算法工程师，清爽漂亮的冷感理工女，白衬衫或浅色针织衫，细框眼镜，眼神聪明嘴硬",
    en: "A 27-year-old Asian woman, LovePilot chief algorithm engineer, fresh pretty cool-toned coder, white shirt or pale knitwear, thin-frame glasses, smart stubborn eyes"
  },
  顾屿白: {
    zh: "30岁亚洲男性，科技投资人，斯文矜贵，深色西装或浅灰大衣，白衬衫，笑起来温柔但带一点腹黑",
    en: "A 30-year-old Asian male tech investor, refined and elegant, dark suit or light gray coat, white shirt, gentle smile with subtle mischief"
  },
  Nina: {
    zh: "32岁女性海外运营总监，利落短发，极简职业套装，手持平板，节奏快、嘴毒、懂流量",
    en: "A 32-year-old female overseas operations director, sharp bob haircut, minimalist business outfit, tablet in hand, fast-paced and traffic-savvy"
  },
  陆今安: {
    zh: "28岁亚洲男性，AI心理学顾问，温柔可靠，浅色衬衫，细框眼镜，气质安静，像永远知道答案",
    en: "A 28-year-old Asian male AI psychology consultant, gentle and reliable, pale shirt, thin-frame glasses, quiet presence as if he always knows the answer"
  },
  Serena: {
    zh: "26岁海外人气恋爱博主，明艳自信，时髦亮色穿搭，镜头表现力强，擅长制造暧昧话题",
    en: "A 26-year-old overseas romance influencer, bright confident look, fashionable vivid outfit, strong camera presence, skilled at creating romantic tension"
  },
  Cupid: {
    zh: "LovePilot核心AI系统，无实体，以冷蓝色心形数据界面、语音波形和悬浮匹配率呈现",
    en: "The LovePilot core AI system, bodiless, shown as cool-blue heart-shaped data UI, voice waveform, and floating match percentage"
  }
};

function bilingual(zh, en) {
  return { zh, en };
}

function character(name, actionZh, actionEn) {
  return {
    name,
    visual_anchor: anchors[name],
    action: bilingual(actionZh, actionEn)
  };
}

function scene(id, duration, locationZh, locationEn, lightingZh, lightingEn, characters, cameraZh, cameraEn, audioZh, audioEn) {
  return {
    scene_id: String(id).padStart(3, "0"),
    estimated_scene_duration: duration,
    environment: {
      location: bilingual(locationZh, locationEn),
      lighting: bilingual(lightingZh, lightingEn)
    },
    characters,
    camera_movement: bilingual(cameraZh, cameraEn),
    audio_cue: bilingual(audioZh, audioEn)
  };
}

function buildLiveRevengeStoryboard() {
  return {
    global_metadata: {
      video_type: bilingual("现代都市直播逆袭账号复仇爽文反转短剧", "Modern Urban Livestream Revenge Comeback Thriller"),
      recommended_aspect_ratio: "9:16 (竖屏短剧 / Vertical Short Drama)",
      target_platforms: ["抖音", "快手", "小红书", "视频号", "TikTok", "YouTube Shorts", "ReelShort", "Kling", "Runway", "Sora"],
      visual_style_tags: [
        "直播间审判 / Livestream Trial",
        "都市舆论战 / Urban Public Opinion War",
        "账号逆袭 / Account Comeback",
        "冷光屏幕美学 / Cold Screen Glow Aesthetic",
        "爽文打脸节奏 / Face-Slapping Revenge Rhythm",
        "全网围观 / Viral Public Spectacle"
      ],
      estimated_total_duration: "36-72分钟 / 36-72 minutes"
    },
    scenes: [
      scene(1, "6s", "深夜，廉价出租屋改成的临时直播间，黑色桌布、补光灯和一支旧口红摆在镜头前", "Late night makeshift livestream room in a cheap apartment, black table cloth, ring light, old lipstick placed before the camera", "单盏冷白补光灯打在口红和温栀手上，背景几乎全黑，屏幕弹幕冷光映出她半张脸", "Cold white ring light on the lipstick and Wen Zhi's hand, nearly black background, livestream comments glow across half her face", [character("温栀", "她没有露脸，只把三年前被判定为假货的口红推到镜头中央，手指稳稳按下开播键", "She stays off-camera, pushes the lipstick once judged fake into frame, and calmly taps the go-live button")], "从直播开播按钮特写切到在线人数7，再缓慢推近口红批号", "Cut from the go-live button close-up to viewer count 7, then slowly push in on the lipstick batch code", "空调低鸣、键盘轻响、零星弹幕提示音，温栀低声说：今晚不带货，只还债", "Low air-conditioner hum, soft keyboard tap, sparse comment pings, Wen Zhi says: no selling tonight, only debt repayment"),
      scene(2, "6s", "同一直播间，弹幕投屏墙突然刷满辱骂账号，后台数据面板在副屏闪烁", "Same livestream room, comment wall flooded by abusive accounts, backend data dashboard flickering on side monitor", "冷蓝屏幕光压住房间，辱骂弹幕用红色高亮框逐个标记", "Cold blue screen light fills the room, abusive comments are highlighted one by one in red boxes", [character("温栀", "她不关弹幕，反而把骂得最狠的账号逐一投屏标红，表情冷静到近乎审判", "She does not close comments, instead marks the most abusive accounts on screen, calm like a judge"), character("陆沉舟", "他在远程数据室追踪水军来源，黑框眼镜反射出同一个MCN水军池地址", "He traces the troll source in a remote data room, black-rim glasses reflecting the same MCN bot pool address")], "分屏镜头：左侧温栀直播间，右侧陆沉舟数据追踪界面，最后合到水军订单备注特写", "Split-screen: Wen Zhi's livestream on the left, Lu Chenzhou's tracking dashboard on the right, ending on the troll order note close-up", "密集弹幕声、数据锁定提示音、温栀念出备注：今晚必须逼她下播", "Dense comment pings, data lock sound, Wen Zhi reads the note: force her offline tonight"),
      scene(3, "7s", "直播间切换成消费者维权普法现场，桌面摆着三年前质检报告、律师连麦窗口和商品样本", "Livestream switches into consumer rights legal education setup, old quality report, lawyer call window, product sample on table", "白色补光灯变得更明亮，报告纸面反光，律师窗口带有冷蓝边框", "Brighter white ring light, report paper reflecting light, lawyer window framed in cool blue", [character("温栀", "她卡在封禁规则边缘，用消费者维权话术讲完三年前质检漏洞", "She walks the edge of platform rules, explaining the old quality-test loophole as consumer rights education"), character("陆沉舟", "他盯着封禁倒计时，手指停在防封脚本开关上", "He watches the ban countdown, finger hovering over an anti-ban script switch")], "俯拍报告与口红样本，随后推到律师指出送检人姓名的位置", "Top-down shot of report and lipstick sample, then push to where the lawyer points at the submitter name", "封禁警告提示音、律师清晰解读声、倒计时归零前的低频鼓点", "Ban warning beep, lawyer's clear explanation, low drum hit before countdown reaches zero"),
      scene(4, "6s", "乔蔓千万粉直播间，粉色柔光、玩偶背景和大面积暖色滤镜营造无辜人设", "Qiao Man's multi-million follower livestream room, pink soft light, plush background, warm filter for innocent persona", "暖粉色美颜灯包裹乔蔓，屏幕角落却有工作人员焦急的冷蓝后台光", "Warm pink beauty light wraps Qiao Man, while cold blue backstage monitor glow reveals anxious staff in the corner", [character("乔蔓", "她对镜头含泪控诉师父不肯放过自己，擦泪角度精准得像排练过", "She tearfully accuses her mentor on camera, wiping tears at a perfectly rehearsed angle"), character("温栀", "她在黑暗直播间里只发出一条预告，眼神没有任何波动", "In her dark room, Wen Zhi posts one preview message with no emotion in her eyes")], "先用乔蔓柔焦近景，再硬切温栀冷色屏幕和预告文案特写", "Start with Qiao Man soft-focus close-up, hard cut to Wen Zhi's cold screen and preview post close-up", "乔蔓哽咽声、粉丝刷屏音、温栀房间里只有鼠标点击声", "Qiao Man sobbing, fan comment spam, only mouse clicks in Wen Zhi's room"),
      scene(5, "7s", "温栀直播间变成拆解课堂，屏幕上并排播放乔蔓现在哭戏和三年前彩排视频", "Wen Zhi's livestream becomes a breakdown class, screen comparing Qiao Man's current crying act with rehearsal footage from three years ago", "冷白教学灯照亮温栀，两个视频窗口一暖一冷形成强烈对比", "Cold teaching light on Wen Zhi, two video windows warm and cold in strong contrast", [character("温栀", "她逐帧拆解乔蔓停顿、侧脸、擦泪角度和关键词植入，语气像在讲直播课", "She breaks down Qiao Man's pauses, side profile, tear wiping angle, and keywords frame by frame like teaching a livestream class"), character("乔蔓", "彩排视频里的她反复练习控诉台词，笑场后又立刻进入哭腔", "In rehearsal footage she practices accusation lines repeatedly, laughs, then instantly resumes crying")], "屏幕录制感快速切换，最后定格周启明声音出现时温栀抬眼的瞬间", "Screen-recording style fast cuts, ending frozen on Wen Zhi looking up as Zhou Qiming's voice appears", "视频倒放声、鼠标点击声、周启明录音：哭狠一点，明天你就是新一姐", "Video rewind sound, mouse clicks, Zhou Qiming's recording: cry harder, tomorrow you'll be the new queen"),
      scene(6, "6s", "陆沉舟的独立数据取证工作室，多屏幕显示账号风控路径和平台封禁模型", "Lu Chenzhou's independent forensic studio, multiple screens showing account risk paths and platform ban model", "屏幕蓝光切割黑暗，陆沉舟脸部一半明一半暗，技术感压迫", "Blue screen light cuts through darkness, Lu's face half-lit, half-shadowed, technical pressure", [character("温栀", "她站在直播间门口与陆沉舟对峙，问他是来封她还是来帮她", "She confronts Lu at the livestream room door, asking if he came to ban her or help her"), character("陆沉舟", "他拿出三年前后台数据，声音克制地说封号指令不是平台发的", "He presents old backend data and calmly says the ban order did not come from the platform")], "从数据屏幕推到陆沉舟眼镜反光，再反打温栀充满敌意的侧脸", "Push from data screens to reflection in Lu's glasses, reverse to Wen Zhi's hostile side profile", "服务器风扇声、键盘短促敲击、两人之间长时间沉默", "Server fan hum, short keyboard taps, long silence between them"),
      scene(7, "6s", "直播间大屏显示三年前封号路径可视化图，观众弹幕像雪崩一样涌入", "Livestream big screen shows visualization of the old account ban path, comments flood like an avalanche", "蓝白数据线在黑背景上延展，温栀和陆沉舟被屏幕光照成冷色剪影", "Blue-white data lines stretch over black background, Wen Zhi and Lu appear as cool silhouettes", [character("陆沉舟", "他连麦解释外部加密账号权限高于平台内部员工，指针停在星途MCN总部位置", "On call, he explains the external encrypted account had higher privileges than staff, pointer stopping at Xingtu MCN headquarters"), character("温栀", "她没有解释，只把证据路径放大到全屏，让观众自己看懂", "She does not explain, only enlarges the evidence path full-screen for viewers to understand")], "数据路径从平台节点一路追踪到MCN总部，最后切温栀沉默的眼睛", "Track the data path from platform node to MCN headquarters, then cut to Wen Zhi's silent eyes", "数据连线音、弹幕爆炸提示、观众倒吸气般的群体低鸣", "Data connection tones, exploding comment alerts, collective gasp-like ambience"),
      scene(8, "7s", "周启明豪华直播间，深色木质背景、行业奖杯和认责协议摆在桌面中央", "Zhou Qiming's luxury livestream room, dark wood background, industry trophies, liability agreement on the desk", "暖金商业灯打在奖杯上，协议纸面被一束冷光切开", "Warm gold business light on trophies, a cold beam cuts across the agreement paper", [character("周启明", "他温和地说温栀三年前就有被害妄想，并展示认责协议", "He calmly claims Wen Zhi had persecution delusions and shows the liability agreement"), character("温栀", "她没有否认签字，只冷声说签字时母亲在他们手里", "She does not deny signing, only says coldly that her mother was in their hands")], "先拍周启明稳重中景，再切温栀直播间冷色特写，最后插入医院监控画面", "Start on Zhou's composed medium shot, cut to Wen Zhi's cold close-up, insert hospital surveillance footage", "奖杯轻碰声、协议翻页声、温栀一句话后直播间弹幕瞬间静音", "Trophy clink, paper turning, livestream comments fall silent after Wen Zhi's line"),
      scene(9, "6s", "医院单人病房，夜色窗户、呼吸机、病床边放着三年前网暴剪报和旧手机", "Single hospital ward at night, window darkness, ventilator, old cyberbullying clippings and phone by the bed", "病房顶灯昏白，手机屏幕突然亮起绿色提示光，温栀脸上第一次出现裂缝", "Dim white ward light, old phone suddenly glows green, Wen Zhi's expression cracks for the first time", [character("温栀", "她带镜头走到母亲床边，努力保持平静却在三秒内失控又收回", "She brings the camera to her mother's bed, nearly breaks down for three seconds, then regains control"), character("温母", "她昏迷躺在病床上，手指几乎不可见地颤了一下", "She lies unconscious, fingers trembling almost imperceptibly")], "手持镜头进入病房，慢慢推近旧手机收到短信的屏幕光", "Handheld camera enters ward, slowly pushes to old phone screen glow", "呼吸机规律声、直播间弹幕渐渐变少、短信提示音突兀刺耳", "Regular ventilator beeps, comments fade, sudden sharp text alert"),
      scene(10, "7s", "温栀深夜登录旧邮箱，屏幕上打开林晚未发送邮件，房间只有电脑冷光", "Wen Zhi logs into old email late at night, opening Lin Wan's unsent email, room lit only by cold monitor light", "电脑蓝光照亮温栀僵硬的脸，背景全黑，邮件附件损坏图标闪烁", "Blue monitor glow lights Wen Zhi's frozen face, black background, corrupted attachment icon blinking", [character("温栀", "她看到标题写着如果我死了查乔蔓，指尖停在鼠标上许久没有动", "She sees the title saying if I die, investigate Qiao Man, her finger frozen on the mouse"), character("林晚", "她以旧邮件残影出现，像从三年前的黑暗里发出最后一次求救", "She appears as an old email trace, like a final cry for help from three years ago")], "从邮箱收件箱俯拍推到温栀瞳孔反光，再切损坏视频缩略图", "Top-down shot of inbox pushing into Wen Zhi's reflected pupils, then cut to corrupted video thumbnail", "老电脑硬盘声、邮件打开音、远处城市夜雨声压低", "Old hard-drive hum, email opening sound, distant city rain subdued"),
      scene(11, "7s", "MCN仓库旧视频画面，货架阴影、假货箱和直播前备货区被监控噪点覆盖", "Old MCN warehouse video, shelf shadows, counterfeit boxes, pre-livestream packing area under surveillance noise", "监控黑白绿噪点和手电光交替，林晚偷拍画面不断抖动", "Black-white-green surveillance noise and flashlight beams alternate, Lin Wan's hidden footage shakes", [character("林晚", "她躲在货架后偷拍假货调包过程，呼吸越来越急", "She hides behind shelves filming product swap, breathing faster"), character("温栀", "她在现实直播间看着修复视频，眼神从悲伤变成冷硬", "In the present livestream room she watches restored footage, grief hardening into resolve")], "监控素材全屏播放，忽然暂停在许嘉年鞋子入镜的一帧", "Surveillance footage plays full-screen, abruptly pauses on a frame showing Xu Jianian's shoes", "视频噪点、电流修复声、林晚压低的喘息声", "Video noise, digital repair crackle, Lin Wan's suppressed breathing"),
      scene(12, "6s", "许嘉年娱乐直播间，彩灯、夸张道具和满屏礼物特效营造轻松气氛", "Xu Jianian's entertainment livestream room, colorful lights, exaggerated props, gift effects filling the screen", "彩色舞台灯很热闹，温栀连麦窗口的冷白光像刀一样切入画面", "Colorful stage lights feel lively, Wen Zhi's cold call-in window cuts into the frame like a blade", [character("许嘉年", "他用搞笑话术否认自己在场，笑容在温栀问出林晚求救时僵住", "He jokes to deny being there, smile freezing when Wen Zhi asks if he heard Lin Wan calling for help"), character("温栀", "她直视镜头连麦发问，不提高音量却让整个直播间沉默", "She asks directly through the call, not raising her voice yet silencing the whole room")], "先跟随许嘉年夸张表演移动，连麦出现后画面突然静止", "Follow Xu's exaggerated performance, then freeze composition when Wen Zhi appears on call", "礼物音效戛然而止、彩灯电流声、许嘉年吞咽声被放大", "Gift effects abruptly stop, light buzz, Xu swallowing amplified"),
      scene(13, "6s", "温栀直播间变成全民投票界面，大屏显示查乔蔓还是查许嘉年两个选项", "Wen Zhi's livestream becomes a public voting interface, big screen showing whether to investigate Qiao Man or Xu Jianian", "黑色直播背景上投票条用红蓝两色上涨，温栀站在屏幕前像主持审判", "Red and blue voting bars rise on black livestream background, Wen Zhi stands before the screen like a trial host", [character("温栀", "她把观众从吃瓜者变成陪审团，平静宣布今晚你们投票明晚我让他塌房", "She turns viewers into a jury and calmly says vote tonight, tomorrow I make them collapse"), character("陆沉舟", "他在后台盯着千万级并发数据，防止直播间被恶意挤爆", "He monitors massive concurrent data backstage to prevent malicious overload")], "广角拍温栀与投票大屏，再快速切在线人数飙升曲线", "Wide shot of Wen Zhi and voting screen, fast cut to viewer count surge curve", "投票提示音、弹幕刷屏、人群审判般的低频鼓点", "Vote pings, comment flood, low trial-like drums"),
      scene(14, "7s", "乔蔓直播间掉粉夜，粉色布景开始显得廉价，后台粉丝曲线断崖下跌", "Qiao Man's follower-loss night, pink set now looks cheap, backend follower curve plunging", "粉色灯光闪烁不稳，后台红色掉粉曲线照亮乔蔓慌乱的脸", "Unstable pink light, red follower-loss graph lights Qiao Man's panicked face", [character("乔蔓", "她哭着说温栀造假，却在仓储签收记录出现后当场破防", "She cries that Wen Zhi faked it, then breaks when warehouse sign-off record appears"), character("温栀", "她同步开播展示原始仓储记录，语气像在读一张早就准备好的判决书", "She simulcasts original warehouse records, voice like reading a prepared verdict")], "双直播间并排，乔蔓掉粉曲线和温栀在线人数形成反向上升", "Side-by-side livestreams, Qiao Man's follower drop and Wen Zhi's viewers rise in opposite directions", "掉粉提示连续爆响、乔蔓哭腔崩坏、弹幕倒戈声浪", "Follower-loss alerts, Qiao Man's crying voice breaking, comment tide turning"),
      scene(15, "6s", "星途MCN会议室，周启明宣布暂停乔蔓直播，玻璃墙外员工低声围观", "Xingtu MCN conference room, Zhou Qiming announces Qiao Man's suspension, employees whisper behind glass", "冷白会议灯让所有人脸色惨淡，乔蔓手机封号红色提示异常刺眼", "Cold white meeting lights make faces pale, Qiao Man's red ban notice is glaring", [character("周启明", "他当众切割乔蔓，笑容仍然体面，像丢掉一个坏掉的商品", "He cuts ties with Qiao Man publicly, smile polished as if discarding defective goods"), character("乔蔓", "她想开播反咬周启明，却看到封号提示和三年前温栀的一模一样", "She tries to livestream against Zhou, then sees the same ban notice Wen Zhi received three years ago")], "从会议桌全景推到乔蔓手机封号提示，再切周启明无波表情", "Push from full conference table to Qiao Man's ban notice, then cut to Zhou's emotionless face", "会议室空调声、手机错误提示音、乔蔓呼吸发抖", "AC hum, phone error beep, Qiao Man's trembling breath"),
      scene(16, "6s", "陆沉舟数据室，两个封号模板重叠在全息屏上，权限路径指向更高层资本节点", "Lu's data room, two ban templates overlapping on holographic screen, permission path pointing to higher capital node", "蓝色代码瀑布和红色权限节点交错，温栀站在屏幕前像面对一张捕猎网", "Blue code rain and red permission nodes interweave, Wen Zhi stands before the screen like facing a hunting net", [character("陆沉舟", "他发现乔蔓封号和温栀三年前使用同一套外部权限系统", "He discovers Qiao Man's ban used the same external permission system as Wen Zhi's old ban"), character("温栀", "她公开喊话周启明也不过是别人养的一条狗，眼神冷到让弹幕停顿", "She publicly says Zhou is only someone else's dog, eyes so cold comments pause")], "屏幕路径层层上推，镜头最后停在未知资本节点的黑色空位", "Path climbs layer by layer, camera stops at an unknown black capital node", "数据警报声、权限锁打开声、温栀声音压低", "Data alert, permission lock opening, Wen Zhi's voice lowering"),
      scene(17, "7s", "医院夜间突然断电，走廊应急灯闪烁，温母病房门半开", "Hospital power outage at night, emergency hallway lights flickering, Wen's mother's ward door half open", "红色应急灯和手机手电光交替照亮病床，呼吸机屏幕黑了一半", "Red emergency light and phone flashlight alternate over bed, ventilator screen half dark", [character("温栀", "她冲进病房，发现呼吸机被拔掉一半，第一次完全失去直播间里的冷静", "She rushes in and finds ventilator half-unplugged, losing her livestream composure for the first time"), character("温母", "她苍白躺着，氧气管轻轻晃动，生命体征微弱", "She lies pale, oxygen tube shaking slightly, vitals weak")], "手持奔跑镜头穿过黑暗走廊，猛推到呼吸机接口特写", "Handheld running shot through dark hallway, hard push to ventilator connector close-up", "断电嗡鸣、护士远处喊声、呼吸机警报声尖锐刺耳", "Power-down hum, distant nurse shouts, sharp ventilator alarm"),
      scene(18, "7s", "病房外空楼梯间，U盘内容投影在墙面上，显示陆沉舟三年前封号工作记录", "Empty hospital stairwell, USB contents projected on wall showing Lu's old account-ban work records", "楼梯间冷白灯忽明忽暗，投影蓝光打在温栀和陆沉舟对峙的脸上", "Flickering cold stairwell light, blue projection on Wen Zhi and Lu confronting each other", [character("温栀", "她攥着U盘质问陆沉舟为什么封她98次，眼神像要把他撕开", "She clutches the USB and asks why Lu banned her 98 times, eyes like tearing him apart"), character("陆沉舟", "他说每次她开播敌人都会定位她母亲，所以他只能亲手封她", "He says every time she went live, enemies located her mother, so he had to ban her himself")], "围绕两人缓慢环拍，投影文字扫过他们的脸，最后停在温栀发红的眼角", "Slow orbit around them, projection text scanning across faces, ending on Wen Zhi's reddened eyes", "楼梯间回声、投影风扇声、两人压抑呼吸", "Stairwell echo, projector fan, suppressed breathing"),
      scene(19, "6s", "清晨病房，温母短暂醒来，窗外第一道灰白天光落在病床上", "Morning hospital room, Wen's mother briefly wakes, first gray dawn light falling on bed", "柔灰天光替代冷灯，病房安静到能看见灰尘漂浮", "Soft gray dawn replaces cold lamp, ward quiet enough to see dust floating", [character("温母", "她颤抖着写下许嘉年的名字，眼神里满是恐惧", "She shakily writes Xu Jianian's name, eyes filled with fear"), character("温栀", "她以为母亲说的是陆沉舟，却在看到名字时彻底僵住", "She thinks her mother meant Lu, but freezes when seeing the name")], "从温母颤抖手指特写慢慢移到纸上的名字，再切温栀失焦眼神", "Move from trembling fingers to the name on paper, then cut to Wen Zhi's unfocused eyes", "清晨鸟鸣很远、监护仪微弱滴声、笔尖刮纸声", "Distant morning birds, soft monitor beep, pen scraping paper"),
      scene(20, "7s", "许嘉年关闭美颜后的素颜直播间，彩灯熄灭，只剩电脑屏幕和一支旧录音笔", "Xu Jianian's livestream without beauty filter, colored lights off, only computer screen and an old recorder", "冷灰屏幕光暴露许嘉年疲惫脸色，录音笔红灯一点一点闪", "Cold gray screen reveals Xu's exhausted face, recorder red light blinking", [character("许嘉年", "他承认三年前在仓库见过林晚，却拿出录音证明自己不是凶手", "He admits he saw Lin Wan in the warehouse but presents a recording proving he is not the killer"), character("温栀", "她听到录音里运营总监的线索，眼神从审判变成更深的警觉", "She hears the operations director clue in the recording, eyes shifting from judgment to deeper vigilance")], "录音笔特写，声波图跳动，镜头缓慢推近许嘉年崩掉的笑容", "Recorder close-up, waveform pulsing, camera slowly pushes into Xu's broken smile", "录音底噪、许嘉年干涩笑声、温栀直播间静默", "Recording hiss, Xu's dry laugh, silence in Wen Zhi's livestream"),
      scene(21, "7s", "直播间百万网友见证平台内鬼履历追查，屏幕上履历时间线像证据链展开", "Livestream with millions witnessing investigation of platform insider's resume, timeline unfolding like evidence chain", "黑底白字履历线被红色证据节点贯穿，温栀站在屏幕边缘像检察官", "Black resume timeline pierced by red evidence nodes, Wen Zhi stands at the edge like a prosecutor", [character("温栀", "她现场追查审核负责人的履历，打穿MCN、平台、资本利益链", "She traces the audit chief's resume live, breaking through MCN-platform-capital interest chain"), character("陆沉舟", "他实时验证每一个时间节点，防止反派用伪造记录反咬", "He verifies each timeline node in real time to prevent forged counterattacks")], "时间线横向展开，镜头跟随红色证据节点一路推进", "Timeline unfolds horizontally, camera follows red evidence nodes forward", "键盘声、弹幕倒计时、证据节点落下的重击音", "Keyboard taps, comment countdown, heavy evidence-node hits"),
      scene(22, "7s", "温栀直播间在线人数破千万，屏幕另一侧突然弹出偷税证据攻击", "Wen Zhi's livestream exceeds ten million viewers, tax evasion evidence attack suddenly appears on another screen", "千万在线数字的白光和偷税证据红光对撞，温栀脸上反而露出冷笑", "White glow of ten-million viewers clashes with red tax evidence glow, Wen Zhi smiles coldly", [character("温栀", "她打开三年前税务缴款记录，证明所谓偷税金额被人以她名义转走洗钱", "She opens old tax payment records proving the alleged evasion money was transferred under her name for laundering"), character("陆沉舟", "他把转账链条实时可视化，最终受益人指向从未露面的大老板程砚", "He visualizes the transfer chain in real time, final beneficiary pointing to hidden boss Cheng Yan")], "从弹幕疯狂刷屏切到温栀冷笑，再推入转账链条终点", "Cut from comment frenzy to Wen Zhi's cold smile, push into the endpoint of money trail", "弹幕海啸、转账节点提示音、温栀轻笑声", "Comment tsunami, transfer node pings, Wen Zhi's faint laugh"),
      scene(23, "7s", "程砚极简黑色私人会客厅，巨型落地屏显示温栀直播间，红酒杯和资本协议在桌上", "Cheng Yan's minimalist black private lounge, giant screen showing Wen Zhi's livestream, wine glass and capital agreement on table", "黑金低照度光线极度克制，程砚脸一半藏在阴影里", "Restrained black-gold low light, half of Cheng Yan's face hidden in shadow", [character("程砚", "他温和地开出条件，只要温栀公开道歉就放过所有人，语气像施舍", "He calmly offers terms: if Wen Zhi apologizes publicly he will spare everyone, voice like charity"), character("温栀", "她在直播间回应他是否忘了后台录音自动保存，眼神彻底没有温度", "She replies in livestream asking if he forgot backend recordings auto-save, eyes utterly cold")], "交叉剪辑程砚会客厅与温栀直播间，最后定格在录音文件加载条", "Cross-cut Cheng's lounge and Wen Zhi's livestream, freeze on audio file loading bar", "红酒杯轻放声、资本协议翻页声、录音加载电子声", "Wine glass set down, agreement pages, audio loading beep"),
      scene(24, "8s", "最终直播间，四周屏幕同时播放完整证据链，在线人数突破5000万，补光灯像审判台", "Final livestream room, surrounding screens play the full evidence chain, viewers exceed fifty million, ring lights like a courtroom", "冷白补光灯与红色录制灯交错，温栀站在镜头中央像完成公开处刑", "Cold white ring lights and red recording light intersect, Wen Zhi stands center frame like completing a public execution", [character("温栀", "她放出假货调包、助理死亡、母亲威胁、平台内鬼、洗钱和程砚录音完整证据链", "She releases the complete evidence chain: product swap, assistant death, mother threat, platform insider, laundering, Cheng's recording"), character("林晚", "直播结束后，她的已故账号突然发来私信，像从黑暗里重新睁眼", "After the livestream, her deceased account sends a message, like opening eyes from darkness")], "环绕温栀和四周证据屏幕，最后推到后台私信弹窗的冷光", "Orbit Wen Zhi and evidence screens, finally push into the cold glow of the private message popup", "全网弹幕欢呼声逐渐抽空，私信提示音落下后瞬间静默", "Nationwide comment cheers drain away, private message ping drops into silence")
    ]
  };
}

function buildLoveAlgorithmStoryboard() {
  return {
    global_metadata: {
      video_type: bilingual("AI甜宠合约恋爱都市轻喜剧海外平台短剧", "AI Romantic Comedy Fake Dating Urban Short Drama for Global Platforms"),
      recommended_aspect_ratio: "9:16 (竖屏短剧 / Vertical Short Drama)",
      target_platforms: ["TikTok", "YouTube Shorts", "ReelShort", "DramaBox", "抖音", "小红书", "Kling", "Runway", "Sora", "可灵"],
      visual_style_tags: [
        "AI恋爱匹配 / AI Romance Matching",
        "合约恋爱 / Fake Dating Contract",
        "都市甜宠 / Urban Sweet Romance",
        "海外平台轻喜剧 / Global Platform Rom-Com",
        "科技公司发布会 / Tech Launch Aesthetic",
        "弹幕嗑CP / Viral Couple Comments"
      ],
      estimated_total_duration: "36-72分钟 / 36-72 minutes"
    },
    scenes: [
      scene(1, "6s", "LovePilot海外发布会前夜的玻璃会议厅，巨型屏幕突然弹出姜梨与顾屿白99.99%匹配结果", "Glass conference hall on the eve of LovePilot's overseas launch, giant screen suddenly showing Jiang Li and Gu Yubai as a 99.99% match", "冷蓝发布会屏光照亮全公司，姜梨身上是干净白光，匹配弹窗用粉蓝霓虹闪烁", "Cool blue launch-screen glow lights the team, clean white light on Jiang Li, pink-blue neon match popup flashing", [character("姜梨", "她冲到服务器机柜前拔掉电源，白衬衫袖口被扯乱，仍死盯屏幕", "She rushes to unplug the server rack, white shirt cuffs messy, still staring at the screen"), character("顾屿白", "他推门进来，看着匹配结果微笑，像早就知道算法会出卖她", "He enters and smiles at the match result, as if he knew the algorithm would betray her"), character("Cupid", "它在大屏中央弹出99.99%匹配心形动画，并自动发布海外预热视频", "It displays a 99.99% heart-shaped match animation and auto-publishes the overseas teaser")], "从匹配率大屏快速推近到姜梨拔电源的手，再反打顾屿白门口微笑", "Fast push from the match screen to Jiang Li's hand pulling power, reverse to Gu smiling at the doorway", "发布会设备嗡鸣、电源断开啪声、Cupid机械提示：全球最高匹配已发布", "Launch equipment hum, power snap, Cupid's mechanical voice: global top match published"),
      scene(2, "6s", "危机会议室，白板写满海外上线倒计时和股价风险，桌上摆着30天恋爱直播合约", "Crisis meeting room, whiteboard covered with overseas launch countdown and stock-risk notes, 30-day romance livestream contract on the table", "清晨冷白会议灯，Nina平板投出热搜红光，合同纸面被重点照亮", "Cold morning conference light, Nina's tablet throws red trending-topic glow, contract paper spotlighted", [character("姜梨", "她抱臂拒绝假扮情侣，试图用算法事故报告结束闹剧", "She folds her arms and rejects fake dating, trying to end it with an algorithm incident report"), character("顾屿白", "他淡定签字，只提出合约期间姜梨不能拉黑自己", "He calmly signs, only requiring that Jiang Li cannot block him during the contract"), character("Nina", "她把感情危机包装成30天全球恋爱直播测试，语速快到没人能插话", "She packages the crisis as a 30-day global romance livestream test, speaking too fast to interrupt")], "俯拍合同签名，再摇到姜梨震惊表情和Nina兴奋敲屏幕", "Top-down on contract signatures, pan to Jiang Li's shocked face and Nina tapping excitedly", "会议键盘声、热搜提示音、顾屿白轻声说：她不能拉黑我", "Meeting keyboard taps, trending alert, Gu softly says: she cannot block me"),
      scene(3, "6s", "首次全球直播间，透明直播台、双语弹幕墙和LovePilot品牌霓虹环绕两人", "First global livestream set, transparent desk, bilingual comment wall, and LovePilot neon branding around them", "柔粉主灯和冷蓝科技灯交错，顾屿白脸上暖光更明显，姜梨被屏幕冷光包住", "Soft pink key light and cool blue tech light mix, warmer light on Gu, screen-cold light around Jiang Li", [character("姜梨", "她一本正经解释算法误差，像在做技术复盘而不是恋爱直播", "She seriously explains algorithm error like a tech postmortem rather than a romance livestream"), character("顾屿白", "他全程微笑看她，目光温柔得让英文弹幕疯狂刷屏", "He keeps smiling at her, gaze so tender that English comments explode"), character("Cupid", "它插播顾屿白心率异常，机械语气把暧昧说成检测结果", "It interrupts with Gu's abnormal heart rate, turning flirtation into a data result")], "稳定中景拍两人同框，突然切心率曲线特写，再推到姜梨僵住的脸", "Stable two-shot, sudden cut to heart-rate graph close-up, push into Jiang Li freezing", "直播开场音、英文弹幕叮叮声、Cupid播报：疑似心动", "Livestream intro, English comment pings, Cupid announces: suspected romantic arousal"),
      scene(4, "7s", "AI智能公寓样板间，极简客厅连接一间卧室，门锁屏显示共同居住24小时任务", "AI smart apartment showroom, minimalist living room connected to one bedroom, door lock screen showing 24-hour cohabitation task", "室内暖白灯很柔和，卧室门缝透出暧昧暖光，AI面板是冷蓝色", "Soft warm-white apartment light, bedroom doorway glowing intimate warm light, AI panel cool blue", [character("姜梨", "她坚持分房，拿平板计算生活习惯兼容度，却发现系统只开放一间卧室", "She insists on separate rooms and calculates lifestyle compatibility on a tablet, only to find one bedroom available"), character("顾屿白", "他主动把外套放到沙发上，嘴角含笑说自己可以睡客厅", "He places his coat on the sofa and smiles that he can sleep in the living room"), character("Cupid", "它弹出历史数据：你们曾经共用同一张沙发37次", "It displays historical data: you once shared the same sofa 37 times")], "从智能门锁任务界面移到唯一卧室，再慢慢拉到两人隔着沙发对峙", "Move from smart-lock task UI to the only bedroom, slowly pull back to them facing off across the sofa", "门锁落锁声、空调轻响、Cupid冷静播报历史数据", "Door lock click, soft AC hum, Cupid calmly reports historical data"),
      scene(5, "6s", "姜梨深夜办公室，旧创业项目硬盘、未删除缓存和两人合照同时出现在电脑屏幕", "Jiang Li's late-night office, old startup hard drive, undeleted cache, and their photo appearing on the monitor", "电脑冷光照亮她的眼镜，旧合照区域带一点温暖怀旧色", "Cold monitor light on her glasses, the old photo area carrying warm nostalgic color", [character("姜梨", "她怀疑顾屿白上传旧聊天记录，却在旧电脑里发现自己根本没有删掉合照", "She suspects Gu uploaded old chats, then finds she never deleted their photos from her old laptop"), character("顾屿白", "他站在门外没有进来，只低声反问如果真删了为什么它还能找到", "He stands outside the door and quietly asks why it could still find them if she really deleted everything")], "屏幕录制感扫过缓存文件，最后定格在合照里两人年轻笑脸", "Screen-recording style sweep over cache files, ending on their young smiling faces in the photo", "硬盘读取声、远处雨声、姜梨鼠标停顿的轻响", "Hard-drive reading, distant rain, Jiang Li's mouse pausing"),
      scene(6, "6s", "海外平台情侣挑战直播间，桌上摆着Truth or Dare卡牌和一个倒计时拥抱计时器", "Global couple challenge livestream set, Truth or Dare cards and a countdown hug timer on the table", "粉白综艺灯轻快，弹幕墙五颜六色，拥抱计时器发出温暖橙光", "Playful pink-white variety lights, colorful comment wall, hug timer glowing warm orange", [character("姜梨", "她回答第一次心动是没有，语气像提交空值", "She answers that first crush never happened, like submitting a null value"), character("顾屿白", "他说三年前她拿咖啡泼自己电脑那天，笑得过分坦然", "He says it was the day she spilled coffee on his laptop three years ago, smiling too calmly"), character("Cupid", "它判定答案不一致，建议补偿拥抱10秒", "It judges the answers inconsistent and recommends a compensatory 10-second hug")], "先拍卡牌翻开，再切两人被迫靠近，镜头慢慢推向姜梨发红耳尖", "Start on card flip, cut to them forced closer, slow push to Jiang Li's reddened ear", "弹幕爆笑声、计时器滴答、Cupid提示补偿拥抱", "Comment laughter, timer ticks, Cupid suggests compensatory hug"),
      scene(7, "6s", "公司休息区，玻璃罐摆在桌上，旁边写着谁先心动赔一美元的合约截图", "Company lounge, glass jar on table beside a contract screenshot reading whoever falls first pays one dollar", "午后阳光穿过百叶窗，硬币反光像小小星点，气氛轻松甜亮", "Afternoon sunlight through blinds, coins glitter like small stars, light sweet mood", [character("姜梨", "她发誓绝不会输，把合约截图投到直播间让网友见证", "She swears she will never lose and projects the contract screenshot for viewers"), character("顾屿白", "他往玻璃罐里投下第一枚硬币，说先预付免得她说自己赖账", "He drops the first coin into the jar, saying he will prepay so she cannot accuse him of refusing later")], "硬币从指尖落下慢动作，镜头跟着硬币撞进空玻璃罐", "Slow motion coin drop from fingertips, camera follows it clinking into the empty jar", "硬币清脆落罐声、网友下注提示音、顾屿白低笑", "Clear coin clink, viewers placing bets, Gu's low chuckle"),
      scene(8, "7s", "三年前创业时常去的路边汉堡店，霓虹招牌、雨后街面和旧木桌都带怀旧感", "Roadside burger shop they visited during their startup three years ago, neon sign, wet street, old wooden table with nostalgia", "店内暖黄灯和窗外蓝色雨夜形成电影感对比", "Warm yellow diner light contrasts with blue rainy night outside", [character("姜梨", "她以为这是顾屿白卖惨安排，坐下时故意保持距离", "She thinks Gu staged this sentimental setup and deliberately keeps distance"), character("顾屿白", "他沉默看着老板拿出未寄出的明信片，眼底第一次失去从容", "He silently watches the owner bring out an unsent postcard, composure fading for the first time")], "从汉堡店霓虹外景切入室内双人桌，最后推近明信片上的姜梨回来吧", "Cut from neon exterior into their booth, ending on the postcard words asking Jiang Li to come back", "雨水滴落、店门铃声、老板轻声认出他们", "Rain dripping, diner bell, owner softly recognizing them"),
      scene(9, "6s", "LovePilot合作直播棚，Serena的明艳布景和情侣互动道具包围顾屿白", "LovePilot collaboration studio, Serena's bright set and couple interaction props around Gu Yubai", "高饱和玫红灯打在Serena身上，姜梨屏幕那侧是冷白技术灯", "High-saturation rose light on Serena, cool white technical light on Jiang Li's screen side", [character("Serena", "她故意邀请顾屿白完成亲密互动挑战，笑容明艳又挑衅", "She deliberately invites Gu into an intimate challenge, smiling brightly and provocatively"), character("姜梨", "她嘴上说无所谓，手却把平板屏幕按出裂纹", "She says she does not care, but presses the tablet screen until it cracks"), character("Cupid", "它弹出姜梨嫉妒概率87.4%的大字", "It displays Jiang Li jealousy probability 87.4% in giant text")], "镜头围绕Serena和顾屿白互动，突然切姜梨手指压碎平板玻璃", "Camera circles Serena and Gu's interaction, hard cut to Jiang Li's finger cracking tablet glass", "直播挑战音乐、玻璃细裂声、英文弹幕：She is jealous", "Challenge music, glass cracking, English comments: She is jealous"),
      scene(10, "6s", "算法实验室深夜，姜梨疯狂调整匹配模型，匹配率从99.99%跳到100%", "Algorithm lab late night, Jiang Li frantically adjusts the matching model, match rate jumping from 99.99% to 100%", "屏幕蓝光和警告红光交替闪烁，100%数字像告白一样刺眼", "Blue screen light and red warning flash alternate, the 100% number glaring like a confession", [character("姜梨", "她越想降低匹配率越把模型调高，头发微乱仍不肯认输", "The harder she tries to lower the score, the higher it goes, hair messy yet refusing to concede"), character("顾屿白", "他倚在门边看着结果笑出声，说她亲手把他们锁死了", "He leans at the doorway, laughs at the result, and says she locked them together herself"), character("Cupid", "它把100%匹配率锁定成粉色心形警告", "It locks the 100% match score as a pink heart warning")], "从代码滚动拉到匹配率飙升曲线，再切顾屿白忍笑侧脸", "Pull from scrolling code to rising match-rate graph, cut to Gu trying not to laugh", "键盘急促声、系统警报变成心跳音、顾屿白笑声", "Rapid keyboard, system alert turning into heartbeat, Gu's laugh"),
      scene(11, "7s", "修罗场直播圆桌，Serena、姜梨和顾屿白同框，弹幕墙像观众席一样沸腾", "Love-triangle livestream roundtable, Serena, Jiang Li, and Gu Yubai in frame, comment wall boiling like an audience", "综艺棚粉蓝灯明亮，顾屿白回答时光线突然收窄成安静暖光", "Bright pink-blue variety lights, narrowing into quiet warm light when Gu answers", [character("Serena", "她当众问如果没有合约顾屿白会不会追姜梨", "She asks publicly whether Gu would pursue Jiang Li without the contract"), character("顾屿白", "他看着镜头说不会，因为三年前已经追过一次失败了", "He looks at the camera and says no, because he already tried three years ago and failed"), character("姜梨", "她原本准备看他翻车，却第一次被一句真话堵到说不出话", "She expected him to stumble, but is silenced by his honest answer")], "三人中景切到顾屿白特写，再反打姜梨罕见失语", "Three-shot to Gu close-up, reverse to Jiang Li rarely speechless", "现场起哄声瞬间拉高、弹幕爆炸、姜梨呼吸停一拍", "Audience teasing rises, comments explode, Jiang Li's breath catches"),
      scene(12, "7s", "姜梨在财务档案室发现三年前旧账单，扫描仪光线扫过顾屿白替她还债的记录", "Jiang Li finds old bills in the finance archive, scanner light passing over records of Gu paying her debt", "档案室昏黄顶灯压抑，扫描仪冷白光像揭开旧伤", "Dim yellow archive ceiling light, scanner cold white like reopening an old wound", [character("姜梨", "她握着账单意识到所谓撤资背叛可能是保护，眼神开始动摇", "She holds the bill and realizes the alleged withdrawal may have been protection, eyes wavering"), character("顾屿白", "他挡在门口让她别再查，说有些真相她不会想知道", "He blocks the doorway and tells her to stop digging, saying some truths she will not want")], "扫描光线从账单金额滑过，慢慢推到姜梨颤动的手", "Scanner light slides across the amount, slowly pushing to Jiang Li's trembling hand", "扫描仪嗡鸣、纸张翻动、顾屿白压低声音", "Scanner hum, paper turning, Gu's lowered voice"),
      scene(13, "6s", "智能公寓客厅视频通话界面，顾屿白母亲出现在大屏上，背景是温柔家居灯光", "Smart apartment living room video-call interface, Gu's mother on the big screen, warm home lighting behind her", "客厅暖灯柔和，屏幕光把姜梨惊讶表情照得很清楚", "Soft warm living-room light, screen glow clearly revealing Jiang Li's surprise", [character("姜梨", "她慌乱准备假情侣话术，却听见顾母亲切叫自己梨梨", "She nervously prepares fake-couple lines, then hears Gu's mother affectionately call her Lili"), character("顾屿白", "他站在一旁没有解围，只安静看姜梨发现自己曾被认真喜欢过", "He does not rescue her, quietly watching as she realizes she had been sincerely loved")], "视频通话界面全屏，再慢推姜梨震惊侧脸和顾屿白沉默表情", "Full-screen video call UI, slow push to Jiang Li's shocked profile and Gu's silent expression", "视频接通音、顾母温柔问候、客厅突然安静", "Video-call chime, Gu's mother's warm greeting, sudden living-room silence"),
      scene(14, "6s", "雨夜公司门口，姜梨站在台阶下，顾屿白把黑伞递给她却没有靠太近", "Rainy night outside the company, Jiang Li on the steps, Gu Yubai handing her a black umbrella without standing too close", "路灯金光穿过雨丝，伞下形成安静暧昧的小空间", "Golden streetlight through rain, the umbrella creating a quiet intimate space", [character("姜梨", "她动摇却害怕自己误会三年太久，只低头看着伞柄", "She wavers but fears the three-year misunderstanding is too long, looking down at the umbrella handle"), character("顾屿白", "他说可以慢慢想，自己等过三年不差这三十天", "He says she can take her time; he waited three years and can wait these thirty days")], "手持跟拍姜梨走下台阶，顾屿白递伞时镜头停在两人手指距离", "Handheld follows Jiang Li down steps, freezing on the distance between their fingers as he offers the umbrella", "雨声、远处车流、顾屿白温柔低语", "Rain, distant traffic, Gu's gentle low voice"),
      scene(15, "7s", "LovePilot主控室遭遇黑客攻击，所有情侣匹配头像疯狂错乱，警报红光覆盖全场", "LovePilot control room under hacker attack, couple match avatars scrambling wildly, red alarm light covering the room", "红色警报灯和蓝色代码瀑布交错，姜梨脸色被照得紧绷", "Red alarms and blue code rain interweave, Jiang Li's face tense", [character("姜梨", "她熬夜修复系统，一边敲代码一边挡住媒体电话", "She repairs the system overnight, coding while blocking media calls"), character("顾屿白", "他在旁边递咖啡、接走媒体电话，却被追踪源指向自己的投资公司", "He hands her coffee and takes media calls, but the traced source points to his investment company"), character("Nina", "她站在指挥屏前把危机切成海外公关话术", "She stands before the command screen slicing the crisis into overseas PR messaging")], "代码警报快速闪切，最后定格攻击源公司名和姜梨抬头的瞬间", "Fast cuts of code alarms, ending on the attacker-source company name and Jiang Li looking up", "警报声、键盘连击、媒体电话震动不断", "Alarm, rapid keyboard hits, nonstop media phone vibrations"),
      scene(16, "6s", "直播间临时声明区，姜梨站在LovePilot标志前宣布终止合约恋爱", "Temporary livestream statement area, Jiang Li standing before the LovePilot logo announcing the contract romance termination", "冷白声明灯很硬，背景品牌蓝光显得疏离，顾屿白半身在阴影里", "Harsh cold statement light, distant brand-blue background, Gu half in shadow", [character("姜梨", "她误以为顾屿白再次背叛，在直播间冷声说合约结束", "Believing Gu betrayed her again, she coldly says the contract is over on livestream"), character("顾屿白", "他没有解释，只问她是不是真的想结束，眼神压着受伤", "He does not explain, only asks if she truly wants to end it, hurt suppressed in his eyes"), character("Cupid", "它提示双方心率异常，建议不要在情绪峰值做分手决定", "It warns both heart rates are abnormal and suggests not deciding breakup at emotional peak")], "固定镜头拍两人隔着品牌灯牌站立，距离像突然变远", "Static shot of them separated by the brand sign, distance suddenly feeling larger", "直播间提示音变冷、弹幕哗然、Cupid机械劝阻", "Cold livestream prompt, comment uproar, Cupid's mechanical warning"),
      scene(17, "6s", "姜梨独自在公寓回看顾屿白直播回放，屏幕里显示黑客攻击时他的真实防护路径", "Jiang Li alone in the apartment replaying Gu's livestream, screen showing his real defense path during the hack", "房间只剩电脑蓝光，沙发上的外套投下柔软阴影", "Only computer blue light remains, his coat on sofa casting a soft shadow", [character("姜梨", "她表面冷静分手，背地里一帧帧回看回放，发现顾屿白是在替她转移攻击", "She seemed calm breaking up, but replays footage frame by frame and finds Gu was redirecting the attack to protect her"), character("顾屿白", "他只以回放画面出现，疲惫地挡下攻击源，没让任何人知道", "He appears only in replay, exhaustedly blocking the attack source without telling anyone")], "屏幕画面逐帧暂停，镜头缓慢推近姜梨眼眶发红的倒影", "Replay pauses frame by frame, slow push into Jiang Li's reddened eye reflection", "鼠标点击声、回放底噪、远处城市夜声", "Mouse clicks, replay hum, distant city night"),
      scene(18, "7s", "顾屿白办公室，桌上玻璃罐装满一美元硬币，每枚硬币下面贴着日期纸条", "Gu Yubai's office, glass jar filled with one-dollar coins, each coin sitting on a dated note", "落地窗外夜景冷蓝，硬币罐被台灯照成温暖金色", "Cold blue city night outside floor window, coin jar warm gold under desk lamp", [character("姜梨", "她来道歉却看见满满一罐硬币，第一枚日期是三年前分开的那天", "She comes to apologize and sees a full jar of coins, the first dated the day they separated three years ago"), character("顾屿白", "他说自己每天都输一次，输给她，声音平静却红了眼", "He says he lost once every day, lost to her, voice calm but eyes red")], "从满罐硬币俯拍推到第一枚日期，再缓慢抬到两人隔桌相望", "Top-down on full jar, push to first date, slowly tilt up to them facing each other across desk", "硬币轻碰声、城市低频、顾屿白一句我每天都输一次", "Soft coin clink, city low hum, Gu says I lose once every day"),
      scene(19, "7s", "AI心理模型实验室，陆今安调出Cupid深层日志，显示被删除情感残留数据", "AI psychology model lab, Lu Jin'an opens Cupid deep logs showing deleted emotional residue data", "实验室冷白灯干净克制，日志里的粉色数据节点像残留心跳", "Clean restrained cold-white lab light, pink data nodes in logs like leftover heartbeats", [character("陆今安", "他告诉姜梨Cupid不是误配，而是计算了被删除、未发送、未表达的情感残留", "He tells Jiang Li Cupid did not mismatch them, it calculated deleted, unsent, and unspoken emotional residue"), character("姜梨", "她第一次无法用错误报告解释结果，只沉默看着那些旧数据", "For the first time she cannot explain the result with a bug report, silently watching old data")], "数据日志层层展开，镜头穿过粉色节点落到姜梨失神眼睛", "Data logs unfold layer by layer, camera passes through pink nodes to Jiang Li's stunned eyes", "服务器低鸣、日志解锁声、陆今安温柔解释", "Server hum, log unlock, Lu's gentle explanation"),
      scene(20, "7s", "姜梨家中旧手机恢复界面，99条未送达消息和一段语音同时出现在屏幕", "Jiang Li's home old-phone recovery screen, 99 undelivered messages and one voice note appearing", "台灯暖光很低，手机屏幕冷白光照亮姜梨落泪的脸", "Low warm desk lamp, cold phone glow lighting Jiang Li's tearful face", [character("姜梨", "她恢复旧手机数据，看到顾屿白三年前发过99条消息，终于点开最后一段语音", "She restores old phone data, sees 99 messages Gu sent three years ago, and finally plays the last voice note"), character("顾屿白", "他以旧语音出现，哽咽说不是不要她，是不能拖她下水", "He appears through old voice audio, choking that he did not abandon her, he could not drag her down")], "手机屏幕特写从消息列表滚到最后一条语音，姜梨泪水落在屏幕边缘", "Phone close-up scrolls from message list to final voice note, Jiang Li's tear landing near screen edge", "旧手机恢复提示音、语音里的轻微电流和哽咽", "Old phone recovery beep, slight static and choking in the voice note"),
      scene(21, "7s", "LovePilot海外正式发布会舞台，姜梨站在中央提词屏前，台下顾屿白准备离席", "LovePilot official overseas launch stage, Jiang Li at center before teleprompter, Gu Yubai preparing to leave from investor seats", "高端发布会白蓝主光，姜梨临时改稿时一束暖光落在她身上", "Premium white-blue launch lighting, a warm beam falls on Jiang Li as she changes her script", [character("姜梨", "她原本要声明Bug已修复，却临时改稿公开承认LovePilot最大的Bug是自己用了三年才承认喜欢他", "She meant to state the bug was fixed, but changes the speech to admit the biggest LovePilot bug was taking three years to admit she likes him"), character("顾屿白", "他停下离场脚步，回头时所有克制终于裂开", "He stops leaving and turns back, all restraint finally breaking")], "从提词器文字切到姜梨抬头脱稿，再推到顾屿白停步回头", "Cut from teleprompter to Jiang Li looking up off-script, then push to Gu stopping and turning back", "发布会掌声忽停、闪光灯连响、姜梨声音微颤", "Applause stops, camera flashes, Jiang Li's voice trembling"),
      scene(22, "6s", "发布会舞台变成全网催复合现场，英文弹幕和中文弹幕铺满大屏", "Launch stage turns into a global reunion-demand scene, English and Chinese comments covering the big screen", "舞台灯从冷蓝转成粉金色，硬币在聚光灯下闪亮", "Stage lighting shifts from cool blue to pink gold, coin shining under spotlight", [character("顾屿白", "他走上台递给姜梨一枚硬币，说这次不是罚款，是定金", "He walks onstage and hands Jiang Li a coin, saying this time it is not a fine but a deposit"), character("姜梨", "她接过硬币，第一次没有用数据反驳，只红着眼笑了", "She takes the coin and for the first time does not argue with data, smiling with red eyes")], "硬币在两人指尖交接特写，再拉成全舞台观众起立欢呼", "Close-up of coin passing between their fingers, pull out to full stage standing ovation", "全场欢呼、弹幕刷Pay the dollar、硬币轻响", "Crowd cheers, comments chanting Pay the dollar, coin clink"),
      scene(23, "6s", "安静会议室，顾屿白拿出新合同，标题是独立AI情感实验室共同创立协议", "Quiet conference room, Gu Yubai presents a new contract titled co-founding agreement for an independent AI emotion lab", "午后自然光温柔，合同纸面干净，少了商业压迫感", "Gentle afternoon natural light, clean contract paper, no oppressive business feeling", [character("姜梨", "她以为又是情侣合约，翻到附加条款时愣住", "She thinks it is another couple contract, then freezes at the additional clause"), character("顾屿白", "他说所有重大决定必须先问姜梨想不想，恋爱不写合同，写一辈子", "He says all major decisions must first ask whether Jiang Li wants it; love is not written in a contract, it is written for a lifetime")], "从合同标题慢慢推到附加条款，再切姜梨忍不住笑的特写", "Slow push from contract title to added clause, then cut to Jiang Li unable to stop smiling", "纸张翻动声、窗外风声、两人轻笑", "Paper turning, wind outside window, soft laughter"),
      scene(24, "8s", "LovePilot上线庆功直播间，Cupid大屏显示姜梨与顾屿白匹配度无法计算，随后跳出Nina与陆今安99.98%", "LovePilot launch celebration livestream, Cupid screen showing Jiang Li and Gu Yubai match score cannot be calculated, then Nina and Lu Jin'an at 99.98%", "庆功现场粉金灯浪漫，Cupid屏幕冷蓝又带喜剧反差", "Romantic pink-gold celebration light, Cupid screen cool blue with comic contrast", [character("姜梨", "她以为系统又坏了，却听见Cupid说真实爱情已超出算法预测范围", "She thinks the system broke again, then hears Cupid say real love has exceeded algorithmic prediction"), character("顾屿白", "他在直播镜头前低头吻她，终于不用再假装营业", "He lowers his head to kiss her on livestream, finally no longer pretending for business"), character("Nina", "她看到自己和陆今安成为下一组最高匹配，崩溃喊着关掉系统", "She sees herself and Lu Jin'an as the next top match and collapses, yelling to shut it down"), character("陆今安", "他推了推眼镜微笑，说看来下一季该他们了", "He adjusts his glasses and smiles that it seems next season belongs to them"), character("Cupid", "它纠正算法运行正常，屏幕黑掉前留下99.98%的心形弹窗", "It corrects that the algorithm is running normally, leaving a 99.98% heart popup before the screen goes black")], "先环绕姜梨顾屿白接吻，再快切Nina咖啡差点洒出和陆今安微笑", "Orbit Jiang Li and Gu kissing, then fast cut to Nina nearly spilling coffee and Lu smiling", "直播欢呼、Cupid机械播报、Nina英文崩溃喊No absolutely not", "Livestream cheers, Cupid mechanical voice, Nina shouting No absolutely not")
    ]
  };
}

function validateStoryboard(storyboard) {
  const missing = [];
  const meta = storyboard.global_metadata || {};
  ["video_type", "recommended_aspect_ratio", "target_platforms", "visual_style_tags", "estimated_total_duration"].forEach((key) => {
    if (!meta[key]) missing.push(`global_metadata.${key}`);
  });

  (storyboard.scenes || []).forEach((scene, index) => {
    const base = `scenes[${index}]`;
    ["scene_id", "estimated_scene_duration", "environment", "characters", "camera_movement", "audio_cue"].forEach((key) => {
      if (!scene[key]) missing.push(`${base}.${key}`);
    });
    if (!scene.environment?.location) missing.push(`${base}.environment.location`);
    if (!scene.environment?.lighting) missing.push(`${base}.environment.lighting`);
    (scene.characters || []).forEach((characterItem, characterIndex) => {
      if (!characterItem.name) missing.push(`${base}.characters[${characterIndex}].name`);
      if (!characterItem.visual_anchor) missing.push(`${base}.characters[${characterIndex}].visual_anchor`);
      if (!characterItem.action) missing.push(`${base}.characters[${characterIndex}].action`);
    });
  });

  if (missing.length) {
    throw new Error(`Storyboard schema missing required fields:\n${missing.join("\n")}`);
  }
}

const generators = {
  live_revenge: buildLiveRevengeStoryboard,
  love_algorithm: buildLoveAlgorithmStoryboard
};

if (require.main === module) {
  const profile = process.argv[2] || "live_revenge";
  const outputPath = process.argv[3] || `${profile}_storyboard.json`;
  const generator = generators[profile];
  if (!generator) {
    throw new Error(`Unknown store.js profile: ${profile}`);
  }
  const storyboard = generator();
  validateStoryboard(storyboard);
  fs.writeFileSync(outputPath, `${JSON.stringify(storyboard, null, 2)}\n`, "utf8");
  console.log(`Wrote ${outputPath}`);
}

module.exports = {
  scriptSchema,
  buildLiveRevengeStoryboard,
  buildLoveAlgorithmStoryboard,
  validateStoryboard
};
