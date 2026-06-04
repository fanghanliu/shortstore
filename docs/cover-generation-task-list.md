# 封面 PNG 批量生成任务清单

这份清单用于生成真正的 9:16 PNG 剧本封面，而不是 SVG 占位图。

## 使用规则

- 所有图片保存到：`D:\售卖AI短剧剧本\public\site\assets\covers\hot-catalog\`
- 文件名必须严格使用每条任务的 `outputFileName`。
- 图片比例：`9:16`。
- 图片格式：`PNG`。
- 封面不要文字、不要 logo、不要水印。
- 生成完成后运行：`node scripts/check-hot-catalog-png-covers.js`。
- 全部通过后再运行：`npm.cmd run generate:hot-catalog`，把 `content-source`、`scripts-data` 和数据库封面路径同步为 PNG。

## 当前进度

- 总数：50
- 已存在 PNG：4
- 待生成 PNG：46

## 任务表

| # | 状态 | slug | 剧名 | 保存文件名 | 核心场景 | 核心道具 |
|---:|---|---|---|---|---|---|
| 1 | exists | star-forge-apprentice | 星炉弃徒：我把废矿炼成天庭 | cover-star-forge-apprentice.png | 灵矿黑市 | 星炉残片 |
| 2 | exists | ghost-market-heir | 鬼市少主：我在阴阳铺收万界欠条 | cover-ghost-market-heir.png | 午夜鬼市 | 万界欠条 |
| 3 | exists | nine-tail-contract | 九尾契约：退婚后我成了妖都债主 | cover-nine-tail-contract.png | 妖都王庭 | 九尾债契 |
| 4 | exists | doomsday-herbalist | 末日药王：我用灵草养活安全区 | cover-doomsday-herbalist.png | 废土药田 | 变异灵草箱 |
| 5 | missing | bunker-school | 末世学院：我把废校改成避难城 | cover-bunker-school.png | 废弃中学 | 地下校规核心 |
| 6 | missing | sword-snow-courier | 雪剑驿站：我替死人送最后一封信 | cover-sword-snow-courier.png | 北境驿站 | 亡者信匣 |
| 7 | missing | forbidden-library | 禁书楼：我靠弹幕修复失传功法 | cover-forbidden-library.png | 浮空藏书楼 | 失传功法弹幕 |
| 8 | missing | palace-puppet-empress | 傀儡女帝：我把朝堂改成审判直播 | cover-palace-puppet-empress.png | 金殿朝堂 | 审判玉玺 |
| 9 | missing | salt-merchant-princess | 盐商郡主：我用账本掀翻王府 | cover-salt-merchant-princess.png | 江南盐仓 | 血账账本 |
| 10 | missing | celestial-railway | 仙轨列车：我在云端售卖渡劫票 | cover-celestial-railway.png | 云上海站 | 渡劫车票 |
| 11 | missing | city-god-intern | 城隍实习生：我给亡魂排队申诉 | cover-city-god-intern.png | 夜半城隍庙 | 申诉木牌 |
| 12 | missing | cyber-sutra | 赛博经卷：废柴程序员修成机械佛 | cover-cyber-sutra.png | 霓虹数据寺 | 机械经卷 |
| 13 | missing | monster-dorm | 怪谈宿舍：我把规则怪物收进班级群 | cover-monster-dorm.png | 封闭宿舍楼 | 规则班级群 |
| 14 | missing | beast-king-physician | 兽王医馆：被流放后我治好了万兽国 | cover-beast-king-physician.png | 兽王边城 | 万兽药箱 |
| 15 | missing | wasteland-teahouse | 荒原茶馆：我用一壶茶换末日情报 | cover-wasteland-teahouse.png | 沙暴公路 | 情报茶壶 |
| 16 | missing | mirror-palace | 镜宫逆徒：我偷走反派的命格剧本 | cover-mirror-palace.png | 万镜宫 | 命格镜页 |
| 17 | missing | dragon-kiln-girl | 龙窑少女：我烧出能说话的瓷军 | cover-dragon-kiln-girl.png | 古窑山城 | 龙窑火种 |
| 18 | missing | rain-god-repair | 雨神修理铺：我修坏的不是伞是天命 | cover-rain-god-repair.png | 雨巷神祠 | 断雨伞骨 |
| 19 | missing | academy-exam-god | 科举神榜：我把考场变成修罗副本 | cover-academy-exam-god.png | 贡院考场 | 神榜墨卷 |
| 20 | missing | spirit-farm-city | 灵田城主：我在天灾后种出浮空城 | cover-spirit-farm-city.png | 灾后荒城 | 浮空灵种 |
| 21 | missing | phoenix-bone-divorce | 凤骨和离：前夫求我救全宗 | cover-phoenix-bone-divorce.png | 雪山宗门 | 凤骨灵印 |
| 22 | missing | demon-lawyer | 魔门律所：我替反派打赢天道官司 | cover-demon-lawyer.png | 魔门律所 | 天道案卷 |
| 23 | missing | mountain-sea-delivery | 山海快递：我送错包裹救了三界 | cover-mountain-sea-delivery.png | 山海驿道 | 错投包裹 |
| 24 | missing | paper-army-girl | 纸甲少女：我折出一支阴兵军团 | cover-paper-army-girl.png | 白事街 | 纸甲兵符 |
| 25 | missing | black-card-cultivation | 黑卡修仙：我刷爆仙盟功德榜 | cover-black-card-cultivation.png | 仙盟交易所 | 功德黑卡 |
| 26 | missing | snow-village-medium | 雪村走阴人：我听见井底喊我名字 | cover-snow-village-medium.png | 封雪古村 | 井底铜铃 |
| 27 | missing | jade-shop-rebirth | 玉铺重生：我用碎玉看穿全家谎言 | cover-jade-shop-rebirth.png | 老宅玉铺 | 碎玉罗盘 |
| 28 | missing | whale-island-singer | 鲸岛歌姬：我的歌能唤醒沉海城 | cover-whale-island-singer.png | 沉海鲸岛 | 鲸骨琴 |
| 29 | missing | clocktower-alchemist | 钟楼炼金师：我偷走明天的三分钟 | cover-clocktower-alchemist.png | 旧城钟楼 | 三分钟怀表 |
| 30 | missing | lava-monastery | 熔岩寺：我在火山口养成废太子 | cover-lava-monastery.png | 火山古寺 | 火山莲灯 |
| 31 | missing | lunar-court | 月庭司命：我改错一个人的死期 | cover-lunar-court.png | 月下命殿 | 错死命牌 |
| 32 | missing | tomb-appraiser | 古墓估价师：我给千年女王开价 | cover-tomb-appraiser.png | 地下王陵 | 女王陪葬册 |
| 33 | missing | snowfield-caravan | 雪原商队：我把破车队养成北境王庭 | cover-snowfield-caravan.png | 暴雪商路 | 北境通行印 |
| 34 | missing | dream-eater-cafe | 食梦咖啡馆：我用噩梦还清债务 | cover-dream-eater-cafe.png | 深夜咖啡馆 | 噩梦账单 |
| 35 | missing | mech-princess | 铁甲郡主：我在古代造出第一台战甲 | cover-mech-princess.png | 王朝工坊 | 战甲蓝图 |
| 36 | missing | plague-ink-girl | 疫墨少女：我用毒画封住全城鬼门 | cover-plague-ink-girl.png | 瘟城画院 | 疫墨画轴 |
| 37 | missing | ocean-market | 海市赊刀人：我卖的刀只斩未来 | cover-ocean-market.png | 雾上海市 | 未来刀契 |
| 38 | missing | cloud-circus | 云端戏班：我演完一出戏改了王朝 | cover-cloud-circus.png | 云上戏台 | 改命戏谱 |
| 39 | missing | blood-moon-tailor | 血月裁缝：我给仇人缝上真相 | cover-blood-moon-tailor.png | 旧城裁缝铺 | 真相红线 |
| 40 | missing | wasteland-zoo | 末日动物园：我把变异兽养成护城军 | cover-wasteland-zoo.png | 废城动物园 | 异兽饲养册 |
| 41 | missing | wrong-heir-live | 真千金开播后，全家塌房 | cover-wrong-heir-live.png | 豪门发布会 | 直播证据链 |
| 42 | missing | divorce-countdown | 离婚倒计时：我的律师是前任 | cover-divorce-countdown.png | 律所会议室 | 倒计时协议 |
| 43 | missing | village-millionaire | 返乡后，我把烂村拍成顶流 | cover-village-millionaire.png | 破旧山村 | 短视频账本 |
| 44 | missing | mother-in-law-trial | 婆婆审判日：全家都在直播间认罪 | cover-mother-in-law-trial.png | 客厅直播间 | 家庭直播录音 |
| 45 | missing | blind-date-algorithm | 相亲算法把我推给仇人 | cover-blind-date-algorithm.png | 科技公司 | 相亲算法后台 |
| 46 | missing | midnight-hotline | 午夜热线：她接到十年前的自己 | cover-midnight-hotline.png | 深夜热线室 | 午夜来电录音 |
| 47 | missing | contract-bride-investigator | 合约新娘查到丈夫死亡证明 | cover-contract-bride-investigator.png | 婚礼后台 | 死亡证明复印件 |
| 48 | missing | inheritance-live-auction | 遗产直播拍卖：我竞价买回亲妈 | cover-inheritance-live-auction.png | 直播拍卖厅 | 遗产拍卖号牌 |
| 49 | missing | office-reversal-room | 反转办公室：每个工位都有秘密 | cover-office-reversal-room.png | 深夜办公室 | 匿名工位卡 |
| 50 | missing | rain-night-witness | 雨夜证人：她的行车记录仪说谎 | cover-rain-night-witness.png | 雨夜高架桥 | 行车记录仪 |

## 详细提示词

### 1. 星炉弃徒：我把废矿炼成天庭

- slug：`star-forge-apprentice`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-star-forge-apprentice.png`
- 核心场景：灵矿黑市
- 核心道具：星炉残片
- 主角身份：被逐出宗门的炼器少女
- 对手压力：仙盟执事

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《星炉弃徒：我把废矿炼成天庭》。核心内容：被逐出宗门的炼器少女在灵矿黑市里发现星炉残片，被仙盟执事逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、灵矿黑市的高细节环境、清晰可见的星炉残片、题材符号“废矿修仙”。风格：废矿修仙题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "星炉弃徒：我把废矿炼成天庭". Core story: a young Asian female lead, 被逐出宗门的炼器少女, discovers 星炉残片 in 灵矿黑市, pressured by 仙盟执事, then turns the rules against them. The image must show the lead character, the detailed setting of 灵矿黑市, the key prop 星炉残片 clearly visible, and strong 废矿修仙 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 2. 鬼市少主：我在阴阳铺收万界欠条

- slug：`ghost-market-heir`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-ghost-market-heir.png`
- 核心场景：午夜鬼市
- 核心道具：万界欠条
- 主角身份：继承阴阳铺的女掌柜
- 对手压力：白面账房

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《鬼市少主：我在阴阳铺收万界欠条》。核心内容：继承阴阳铺的女掌柜在午夜鬼市里发现万界欠条，被白面账房逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、午夜鬼市的高细节环境、清晰可见的万界欠条、题材符号“民俗鬼市”。风格：民俗鬼市题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "鬼市少主：我在阴阳铺收万界欠条". Core story: a young Asian female lead, 继承阴阳铺的女掌柜, discovers 万界欠条 in 午夜鬼市, pressured by 白面账房, then turns the rules against them. The image must show the lead character, the detailed setting of 午夜鬼市, the key prop 万界欠条 clearly visible, and strong 民俗鬼市 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 3. 九尾契约：退婚后我成了妖都债主

- slug：`nine-tail-contract`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-nine-tail-contract.png`
- 核心场景：妖都王庭
- 核心道具：九尾债契
- 主角身份：被退婚的人族少女
- 对手压力：狐族少主

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《九尾契约：退婚后我成了妖都债主》。核心内容：被退婚的人族少女在妖都王庭里发现九尾债契，被狐族少主逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、妖都王庭的高细节环境、清晰可见的九尾债契、题材符号“妖都退婚”。风格：妖都退婚题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "九尾契约：退婚后我成了妖都债主". Core story: a young Asian female lead, 被退婚的人族少女, discovers 九尾债契 in 妖都王庭, pressured by 狐族少主, then turns the rules against them. The image must show the lead character, the detailed setting of 妖都王庭, the key prop 九尾债契 clearly visible, and strong 妖都退婚 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 4. 末日药王：我用灵草养活安全区

- slug：`doomsday-herbalist`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-doomsday-herbalist.png`
- 核心场景：废土药田
- 核心道具：变异灵草箱
- 主角身份：末日药师
- 对手压力：安全区议长

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《末日药王：我用灵草养活安全区》。核心内容：末日药师在废土药田里发现变异灵草箱，被安全区议长逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、废土药田的高细节环境、清晰可见的变异灵草箱、题材符号“末日灵草”。风格：末日灵草题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "末日药王：我用灵草养活安全区". Core story: a young Asian female lead, 末日药师, discovers 变异灵草箱 in 废土药田, pressured by 安全区议长, then turns the rules against them. The image must show the lead character, the detailed setting of 废土药田, the key prop 变异灵草箱 clearly visible, and strong 末日灵草 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 5. 末世学院：我把废校改成避难城

- slug：`bunker-school`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-bunker-school.png`
- 核心场景：废弃中学
- 核心道具：地下校规核心
- 主角身份：天才转学生
- 对手压力：校董会

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《末世学院：我把废校改成避难城》。核心内容：天才转学生在废弃中学里发现地下校规核心，被校董会逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、废弃中学的高细节环境、清晰可见的地下校规核心、题材符号“废校避难”。风格：废校避难题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "末世学院：我把废校改成避难城". Core story: a young Asian female lead, 天才转学生, discovers 地下校规核心 in 废弃中学, pressured by 校董会, then turns the rules against them. The image must show the lead character, the detailed setting of 废弃中学, the key prop 地下校规核心 clearly visible, and strong 废校避难 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 6. 雪剑驿站：我替死人送最后一封信

- slug：`sword-snow-courier`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-sword-snow-courier.png`
- 核心场景：北境驿站
- 核心道具：亡者信匣
- 主角身份：雪原驿使
- 对手压力：边军统领

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《雪剑驿站：我替死人送最后一封信》。核心内容：雪原驿使在北境驿站里发现亡者信匣，被边军统领逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、北境驿站的高细节环境、清晰可见的亡者信匣、题材符号“雪国送信”。风格：雪国送信题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "雪剑驿站：我替死人送最后一封信". Core story: a young Asian female lead, 雪原驿使, discovers 亡者信匣 in 北境驿站, pressured by 边军统领, then turns the rules against them. The image must show the lead character, the detailed setting of 北境驿站, the key prop 亡者信匣 clearly visible, and strong 雪国送信 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 7. 禁书楼：我靠弹幕修复失传功法

- slug：`forbidden-library`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-forbidden-library.png`
- 核心场景：浮空藏书楼
- 核心道具：失传功法弹幕
- 主角身份：禁书楼管理员
- 对手压力：藏经长老

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《禁书楼：我靠弹幕修复失传功法》。核心内容：禁书楼管理员在浮空藏书楼里发现失传功法弹幕，被藏经长老逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、浮空藏书楼的高细节环境、清晰可见的失传功法弹幕、题材符号“弹幕修仙”。风格：弹幕修仙题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "禁书楼：我靠弹幕修复失传功法". Core story: a young Asian female lead, 禁书楼管理员, discovers 失传功法弹幕 in 浮空藏书楼, pressured by 藏经长老, then turns the rules against them. The image must show the lead character, the detailed setting of 浮空藏书楼, the key prop 失传功法弹幕 clearly visible, and strong 弹幕修仙 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 8. 傀儡女帝：我把朝堂改成审判直播

- slug：`palace-puppet-empress`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-palace-puppet-empress.png`
- 核心场景：金殿朝堂
- 核心道具：审判玉玺
- 主角身份：被架空的少年女帝
- 对手压力：摄政王

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《傀儡女帝：我把朝堂改成审判直播》。核心内容：被架空的少年女帝在金殿朝堂里发现审判玉玺，被摄政王逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、金殿朝堂的高细节环境、清晰可见的审判玉玺、题材符号“女帝权谋”。风格：女帝权谋题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "傀儡女帝：我把朝堂改成审判直播". Core story: a young Asian female lead, 被架空的少年女帝, discovers 审判玉玺 in 金殿朝堂, pressured by 摄政王, then turns the rules against them. The image must show the lead character, the detailed setting of 金殿朝堂, the key prop 审判玉玺 clearly visible, and strong 女帝权谋 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 9. 盐商郡主：我用账本掀翻王府

- slug：`salt-merchant-princess`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-salt-merchant-princess.png`
- 核心场景：江南盐仓
- 核心道具：血账账本
- 主角身份：盐商养女
- 对手压力：王府管事

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《盐商郡主：我用账本掀翻王府》。核心内容：盐商养女在江南盐仓里发现血账账本，被王府管事逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、江南盐仓的高细节环境、清晰可见的血账账本、题材符号“古风经商”。风格：古风经商题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "盐商郡主：我用账本掀翻王府". Core story: a young Asian female lead, 盐商养女, discovers 血账账本 in 江南盐仓, pressured by 王府管事, then turns the rules against them. The image must show the lead character, the detailed setting of 江南盐仓, the key prop 血账账本 clearly visible, and strong 古风经商 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 10. 仙轨列车：我在云端售卖渡劫票

- slug：`celestial-railway`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-celestial-railway.png`
- 核心场景：云上海站
- 核心道具：渡劫车票
- 主角身份：云端列车乘务长
- 对手压力：雷劫司官

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《仙轨列车：我在云端售卖渡劫票》。核心内容：云端列车乘务长在云上海站里发现渡劫车票，被雷劫司官逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、云上海站的高细节环境、清晰可见的渡劫车票、题材符号“仙侠列车”。风格：仙侠列车题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "仙轨列车：我在云端售卖渡劫票". Core story: a young Asian female lead, 云端列车乘务长, discovers 渡劫车票 in 云上海站, pressured by 雷劫司官, then turns the rules against them. The image must show the lead character, the detailed setting of 云上海站, the key prop 渡劫车票 clearly visible, and strong 仙侠列车 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 11. 城隍实习生：我给亡魂排队申诉

- slug：`city-god-intern`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-city-god-intern.png`
- 核心场景：夜半城隍庙
- 核心道具：申诉木牌
- 主角身份：新任城隍实习生
- 对手压力：判官

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《城隍实习生：我给亡魂排队申诉》。核心内容：新任城隍实习生在夜半城隍庙里发现申诉木牌，被判官逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、夜半城隍庙的高细节环境、清晰可见的申诉木牌、题材符号“城隍职场”。风格：城隍职场题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "城隍实习生：我给亡魂排队申诉". Core story: a young Asian female lead, 新任城隍实习生, discovers 申诉木牌 in 夜半城隍庙, pressured by 判官, then turns the rules against them. The image must show the lead character, the detailed setting of 夜半城隍庙, the key prop 申诉木牌 clearly visible, and strong 城隍职场 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 12. 赛博经卷：废柴程序员修成机械佛

- slug：`cyber-sutra`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-cyber-sutra.png`
- 核心场景：霓虹数据寺
- 核心道具：机械经卷
- 主角身份：失业程序员
- 对手压力：算法住持

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《赛博经卷：废柴程序员修成机械佛》。核心内容：失业程序员在霓虹数据寺里发现机械经卷，被算法住持逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、霓虹数据寺的高细节环境、清晰可见的机械经卷、题材符号“赛博修行”。风格：赛博修行题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "赛博经卷：废柴程序员修成机械佛". Core story: a young Asian female lead, 失业程序员, discovers 机械经卷 in 霓虹数据寺, pressured by 算法住持, then turns the rules against them. The image must show the lead character, the detailed setting of 霓虹数据寺, the key prop 机械经卷 clearly visible, and strong 赛博修行 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 13. 怪谈宿舍：我把规则怪物收进班级群

- slug：`monster-dorm`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-monster-dorm.png`
- 核心场景：封闭宿舍楼
- 核心道具：规则班级群
- 主角身份：宿舍楼长
- 对手压力：旧校长

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《怪谈宿舍：我把规则怪物收进班级群》。核心内容：宿舍楼长在封闭宿舍楼里发现规则班级群，被旧校长逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、封闭宿舍楼的高细节环境、清晰可见的规则班级群、题材符号“校园怪谈”。风格：校园怪谈题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "怪谈宿舍：我把规则怪物收进班级群". Core story: a young Asian female lead, 宿舍楼长, discovers 规则班级群 in 封闭宿舍楼, pressured by 旧校长, then turns the rules against them. The image must show the lead character, the detailed setting of 封闭宿舍楼, the key prop 规则班级群 clearly visible, and strong 校园怪谈 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 14. 兽王医馆：被流放后我治好了万兽国

- slug：`beast-king-physician`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-beast-king-physician.png`
- 核心场景：兽王边城
- 核心道具：万兽药箱
- 主角身份：流放女医
- 对手压力：祭司长

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《兽王医馆：被流放后我治好了万兽国》。核心内容：流放女医在兽王边城里发现万兽药箱，被祭司长逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、兽王边城的高细节环境、清晰可见的万兽药箱、题材符号“兽世医馆”。风格：兽世医馆题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "兽王医馆：被流放后我治好了万兽国". Core story: a young Asian female lead, 流放女医, discovers 万兽药箱 in 兽王边城, pressured by 祭司长, then turns the rules against them. The image must show the lead character, the detailed setting of 兽王边城, the key prop 万兽药箱 clearly visible, and strong 兽世医馆 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 15. 荒原茶馆：我用一壶茶换末日情报

- slug：`wasteland-teahouse`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-wasteland-teahouse.png`
- 核心场景：沙暴公路
- 核心道具：情报茶壶
- 主角身份：荒原茶馆老板
- 对手压力：雇佣兵首领

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《荒原茶馆：我用一壶茶换末日情报》。核心内容：荒原茶馆老板在沙暴公路里发现情报茶壶，被雇佣兵首领逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、沙暴公路的高细节环境、清晰可见的情报茶壶、题材符号“废土茶馆”。风格：废土茶馆题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "荒原茶馆：我用一壶茶换末日情报". Core story: a young Asian female lead, 荒原茶馆老板, discovers 情报茶壶 in 沙暴公路, pressured by 雇佣兵首领, then turns the rules against them. The image must show the lead character, the detailed setting of 沙暴公路, the key prop 情报茶壶 clearly visible, and strong 废土茶馆 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 16. 镜宫逆徒：我偷走反派的命格剧本

- slug：`mirror-palace`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-mirror-palace.png`
- 核心场景：万镜宫
- 核心道具：命格镜页
- 主角身份：镜宫叛徒
- 对手压力：命师

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《镜宫逆徒：我偷走反派的命格剧本》。核心内容：镜宫叛徒在万镜宫里发现命格镜页，被命师逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、万镜宫的高细节环境、清晰可见的命格镜页、题材符号“镜像命格”。风格：镜像命格题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "镜宫逆徒：我偷走反派的命格剧本". Core story: a young Asian female lead, 镜宫叛徒, discovers 命格镜页 in 万镜宫, pressured by 命师, then turns the rules against them. The image must show the lead character, the detailed setting of 万镜宫, the key prop 命格镜页 clearly visible, and strong 镜像命格 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 17. 龙窑少女：我烧出能说话的瓷军

- slug：`dragon-kiln-girl`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-dragon-kiln-girl.png`
- 核心场景：古窑山城
- 核心道具：龙窑火种
- 主角身份：窑场少女
- 对手压力：贡瓷太监

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《龙窑少女：我烧出能说话的瓷军》。核心内容：窑场少女在古窑山城里发现龙窑火种，被贡瓷太监逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、古窑山城的高细节环境、清晰可见的龙窑火种、题材符号“龙窑机关”。风格：龙窑机关题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "龙窑少女：我烧出能说话的瓷军". Core story: a young Asian female lead, 窑场少女, discovers 龙窑火种 in 古窑山城, pressured by 贡瓷太监, then turns the rules against them. The image must show the lead character, the detailed setting of 古窑山城, the key prop 龙窑火种 clearly visible, and strong 龙窑机关 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 18. 雨神修理铺：我修坏的不是伞是天命

- slug：`rain-god-repair`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-rain-god-repair.png`
- 核心场景：雨巷神祠
- 核心道具：断雨伞骨
- 主角身份：修伞铺少女
- 对手压力：失职雨神

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《雨神修理铺：我修坏的不是伞是天命》。核心内容：修伞铺少女在雨巷神祠里发现断雨伞骨，被失职雨神逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、雨巷神祠的高细节环境、清晰可见的断雨伞骨、题材符号“神明修理”。风格：神明修理题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "雨神修理铺：我修坏的不是伞是天命". Core story: a young Asian female lead, 修伞铺少女, discovers 断雨伞骨 in 雨巷神祠, pressured by 失职雨神, then turns the rules against them. The image must show the lead character, the detailed setting of 雨巷神祠, the key prop 断雨伞骨 clearly visible, and strong 神明修理 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 19. 科举神榜：我把考场变成修罗副本

- slug：`academy-exam-god`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-academy-exam-god.png`
- 核心场景：贡院考场
- 核心道具：神榜墨卷
- 主角身份：寒门女考生
- 对手压力：主考官

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《科举神榜：我把考场变成修罗副本》。核心内容：寒门女考生在贡院考场里发现神榜墨卷，被主考官逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、贡院考场的高细节环境、清晰可见的神榜墨卷、题材符号“科举副本”。风格：科举副本题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "科举神榜：我把考场变成修罗副本". Core story: a young Asian female lead, 寒门女考生, discovers 神榜墨卷 in 贡院考场, pressured by 主考官, then turns the rules against them. The image must show the lead character, the detailed setting of 贡院考场, the key prop 神榜墨卷 clearly visible, and strong 科举副本 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 20. 灵田城主：我在天灾后种出浮空城

- slug：`spirit-farm-city`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-spirit-farm-city.png`
- 核心场景：灾后荒城
- 核心道具：浮空灵种
- 主角身份：灵田守城人
- 对手压力：粮商盟主

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《灵田城主：我在天灾后种出浮空城》。核心内容：灵田守城人在灾后荒城里发现浮空灵种，被粮商盟主逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、灾后荒城的高细节环境、清晰可见的浮空灵种、题材符号“种田天灾”。风格：种田天灾题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "灵田城主：我在天灾后种出浮空城". Core story: a young Asian female lead, 灵田守城人, discovers 浮空灵种 in 灾后荒城, pressured by 粮商盟主, then turns the rules against them. The image must show the lead character, the detailed setting of 灾后荒城, the key prop 浮空灵种 clearly visible, and strong 种田天灾 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 21. 凤骨和离：前夫求我救全宗

- slug：`phoenix-bone-divorce`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-phoenix-bone-divorce.png`
- 核心场景：雪山宗门
- 核心道具：凤骨灵印
- 主角身份：被和离的凤骨女修
- 对手压力：前夫宗主

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《凤骨和离：前夫求我救全宗》。核心内容：被和离的凤骨女修在雪山宗门里发现凤骨灵印，被前夫宗主逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、雪山宗门的高细节环境、清晰可见的凤骨灵印、题材符号“和离修仙”。风格：和离修仙题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "凤骨和离：前夫求我救全宗". Core story: a young Asian female lead, 被和离的凤骨女修, discovers 凤骨灵印 in 雪山宗门, pressured by 前夫宗主, then turns the rules against them. The image must show the lead character, the detailed setting of 雪山宗门, the key prop 凤骨灵印 clearly visible, and strong 和离修仙 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 22. 魔门律所：我替反派打赢天道官司

- slug：`demon-lawyer`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-demon-lawyer.png`
- 核心场景：魔门律所
- 核心道具：天道案卷
- 主角身份：魔门讼师
- 对手压力：天庭监察

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《魔门律所：我替反派打赢天道官司》。核心内容：魔门讼师在魔门律所里发现天道案卷，被天庭监察逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、魔门律所的高细节环境、清晰可见的天道案卷、题材符号“魔门律政”。风格：魔门律政题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "魔门律所：我替反派打赢天道官司". Core story: a young Asian female lead, 魔门讼师, discovers 天道案卷 in 魔门律所, pressured by 天庭监察, then turns the rules against them. The image must show the lead character, the detailed setting of 魔门律所, the key prop 天道案卷 clearly visible, and strong 魔门律政 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 23. 山海快递：我送错包裹救了三界

- slug：`mountain-sea-delivery`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-mountain-sea-delivery.png`
- 核心场景：山海驿道
- 核心道具：错投包裹
- 主角身份：快递少女
- 对手压力：海神使者

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《山海快递：我送错包裹救了三界》。核心内容：快递少女在山海驿道里发现错投包裹，被海神使者逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、山海驿道的高细节环境、清晰可见的错投包裹、题材符号“山海快递”。风格：山海快递题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "山海快递：我送错包裹救了三界". Core story: a young Asian female lead, 快递少女, discovers 错投包裹 in 山海驿道, pressured by 海神使者, then turns the rules against them. The image must show the lead character, the detailed setting of 山海驿道, the key prop 错投包裹 clearly visible, and strong 山海快递 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 24. 纸甲少女：我折出一支阴兵军团

- slug：`paper-army-girl`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-paper-army-girl.png`
- 核心场景：白事街
- 核心道具：纸甲兵符
- 主角身份：纸扎铺少女
- 对手压力：阴司捕头

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《纸甲少女：我折出一支阴兵军团》。核心内容：纸扎铺少女在白事街里发现纸甲兵符，被阴司捕头逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、白事街的高细节环境、清晰可见的纸甲兵符、题材符号“纸术阴兵”。风格：纸术阴兵题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "纸甲少女：我折出一支阴兵军团". Core story: a young Asian female lead, 纸扎铺少女, discovers 纸甲兵符 in 白事街, pressured by 阴司捕头, then turns the rules against them. The image must show the lead character, the detailed setting of 白事街, the key prop 纸甲兵符 clearly visible, and strong 纸术阴兵 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 25. 黑卡修仙：我刷爆仙盟功德榜

- slug：`black-card-cultivation`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-black-card-cultivation.png`
- 核心场景：仙盟交易所
- 核心道具：功德黑卡
- 主角身份：负债散修
- 对手压力：功德榜主

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《黑卡修仙：我刷爆仙盟功德榜》。核心内容：负债散修在仙盟交易所里发现功德黑卡，被功德榜主逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、仙盟交易所的高细节环境、清晰可见的功德黑卡、题材符号“功德爽文”。风格：功德爽文题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "黑卡修仙：我刷爆仙盟功德榜". Core story: a young Asian female lead, 负债散修, discovers 功德黑卡 in 仙盟交易所, pressured by 功德榜主, then turns the rules against them. The image must show the lead character, the detailed setting of 仙盟交易所, the key prop 功德黑卡 clearly visible, and strong 功德爽文 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 26. 雪村走阴人：我听见井底喊我名字

- slug：`snow-village-medium`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-snow-village-medium.png`
- 核心场景：封雪古村
- 核心道具：井底铜铃
- 主角身份：雪村走阴人
- 对手压力：村祠老人

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《雪村走阴人：我听见井底喊我名字》。核心内容：雪村走阴人在封雪古村里发现井底铜铃，被村祠老人逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、封雪古村的高细节环境、清晰可见的井底铜铃、题材符号“东北民俗”。风格：东北民俗题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "雪村走阴人：我听见井底喊我名字". Core story: a young Asian female lead, 雪村走阴人, discovers 井底铜铃 in 封雪古村, pressured by 村祠老人, then turns the rules against them. The image must show the lead character, the detailed setting of 封雪古村, the key prop 井底铜铃 clearly visible, and strong 东北民俗 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 27. 玉铺重生：我用碎玉看穿全家谎言

- slug：`jade-shop-rebirth`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-jade-shop-rebirth.png`
- 核心场景：老宅玉铺
- 核心道具：碎玉罗盘
- 主角身份：玉铺少东家
- 对手压力：继母

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《玉铺重生：我用碎玉看穿全家谎言》。核心内容：玉铺少东家在老宅玉铺里发现碎玉罗盘，被继母逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、老宅玉铺的高细节环境、清晰可见的碎玉罗盘、题材符号“重生宅斗”。风格：重生宅斗题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "玉铺重生：我用碎玉看穿全家谎言". Core story: a young Asian female lead, 玉铺少东家, discovers 碎玉罗盘 in 老宅玉铺, pressured by 继母, then turns the rules against them. The image must show the lead character, the detailed setting of 老宅玉铺, the key prop 碎玉罗盘 clearly visible, and strong 重生宅斗 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 28. 鲸岛歌姬：我的歌能唤醒沉海城

- slug：`whale-island-singer`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-whale-island-singer.png`
- 核心场景：沉海鲸岛
- 核心道具：鲸骨琴
- 主角身份：失声歌姬
- 对手压力：海商会长

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《鲸岛歌姬：我的歌能唤醒沉海城》。核心内容：失声歌姬在沉海鲸岛里发现鲸骨琴，被海商会长逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、沉海鲸岛的高细节环境、清晰可见的鲸骨琴、题材符号“海岛奇幻”。风格：海岛奇幻题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "鲸岛歌姬：我的歌能唤醒沉海城". Core story: a young Asian female lead, 失声歌姬, discovers 鲸骨琴 in 沉海鲸岛, pressured by 海商会长, then turns the rules against them. The image must show the lead character, the detailed setting of 沉海鲸岛, the key prop 鲸骨琴 clearly visible, and strong 海岛奇幻 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 29. 钟楼炼金师：我偷走明天的三分钟

- slug：`clocktower-alchemist`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-clocktower-alchemist.png`
- 核心场景：旧城钟楼
- 核心道具：三分钟怀表
- 主角身份：钟楼炼金师
- 对手压力：时间商人

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《钟楼炼金师：我偷走明天的三分钟》。核心内容：钟楼炼金师在旧城钟楼里发现三分钟怀表，被时间商人逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、旧城钟楼的高细节环境、清晰可见的三分钟怀表、题材符号“时间炼金”。风格：时间炼金题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "钟楼炼金师：我偷走明天的三分钟". Core story: a young Asian female lead, 钟楼炼金师, discovers 三分钟怀表 in 旧城钟楼, pressured by 时间商人, then turns the rules against them. The image must show the lead character, the detailed setting of 旧城钟楼, the key prop 三分钟怀表 clearly visible, and strong 时间炼金 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 30. 熔岩寺：我在火山口养成废太子

- slug：`lava-monastery`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-lava-monastery.png`
- 核心场景：火山古寺
- 核心道具：火山莲灯
- 主角身份：熔岩寺女护法
- 对手压力：废太子的叔父

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《熔岩寺：我在火山口养成废太子》。核心内容：熔岩寺女护法在火山古寺里发现火山莲灯，被废太子的叔父逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、火山古寺的高细节环境、清晰可见的火山莲灯、题材符号“火山养成”。风格：火山养成题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "熔岩寺：我在火山口养成废太子". Core story: a young Asian female lead, 熔岩寺女护法, discovers 火山莲灯 in 火山古寺, pressured by 废太子的叔父, then turns the rules against them. The image must show the lead character, the detailed setting of 火山古寺, the key prop 火山莲灯 clearly visible, and strong 火山养成 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 31. 月庭司命：我改错一个人的死期

- slug：`lunar-court`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-lunar-court.png`
- 核心场景：月下命殿
- 核心道具：错死命牌
- 主角身份：月庭司命官
- 对手压力：天规审判者

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《月庭司命：我改错一个人的死期》。核心内容：月庭司命官在月下命殿里发现错死命牌，被天规审判者逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、月下命殿的高细节环境、清晰可见的错死命牌、题材符号“司命改命”。风格：司命改命题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "月庭司命：我改错一个人的死期". Core story: a young Asian female lead, 月庭司命官, discovers 错死命牌 in 月下命殿, pressured by 天规审判者, then turns the rules against them. The image must show the lead character, the detailed setting of 月下命殿, the key prop 错死命牌 clearly visible, and strong 司命改命 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 32. 古墓估价师：我给千年女王开价

- slug：`tomb-appraiser`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-tomb-appraiser.png`
- 核心场景：地下王陵
- 核心道具：女王陪葬册
- 主角身份：古董估价师
- 对手压力：盗墓财团

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《古墓估价师：我给千年女王开价》。核心内容：古董估价师在地下王陵里发现女王陪葬册，被盗墓财团逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、地下王陵的高细节环境、清晰可见的女王陪葬册、题材符号“古墓鉴宝”。风格：古墓鉴宝题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "古墓估价师：我给千年女王开价". Core story: a young Asian female lead, 古董估价师, discovers 女王陪葬册 in 地下王陵, pressured by 盗墓财团, then turns the rules against them. The image must show the lead character, the detailed setting of 地下王陵, the key prop 女王陪葬册 clearly visible, and strong 古墓鉴宝 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 33. 雪原商队：我把破车队养成北境王庭

- slug：`snowfield-caravan`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-snowfield-caravan.png`
- 核心场景：暴雪商路
- 核心道具：北境通行印
- 主角身份：商队女领队
- 对手压力：关隘军阀

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《雪原商队：我把破车队养成北境王庭》。核心内容：商队女领队在暴雪商路里发现北境通行印，被关隘军阀逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、暴雪商路的高细节环境、清晰可见的北境通行印、题材符号“雪原商战”。风格：雪原商战题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "雪原商队：我把破车队养成北境王庭". Core story: a young Asian female lead, 商队女领队, discovers 北境通行印 in 暴雪商路, pressured by 关隘军阀, then turns the rules against them. The image must show the lead character, the detailed setting of 暴雪商路, the key prop 北境通行印 clearly visible, and strong 雪原商战 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 34. 食梦咖啡馆：我用噩梦还清债务

- slug：`dream-eater-cafe`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-dream-eater-cafe.png`
- 核心场景：深夜咖啡馆
- 核心道具：噩梦账单
- 主角身份：咖啡馆债务人
- 对手压力：梦境债主

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《食梦咖啡馆：我用噩梦还清债务》。核心内容：咖啡馆债务人在深夜咖啡馆里发现噩梦账单，被梦境债主逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、深夜咖啡馆的高细节环境、清晰可见的噩梦账单、题材符号“都市奇幻”。风格：都市奇幻题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "食梦咖啡馆：我用噩梦还清债务". Core story: a young Asian female lead, 咖啡馆债务人, discovers 噩梦账单 in 深夜咖啡馆, pressured by 梦境债主, then turns the rules against them. The image must show the lead character, the detailed setting of 深夜咖啡馆, the key prop 噩梦账单 clearly visible, and strong 都市奇幻 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 35. 铁甲郡主：我在古代造出第一台战甲

- slug：`mech-princess`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-mech-princess.png`
- 核心场景：王朝工坊
- 核心道具：战甲蓝图
- 主角身份：工部郡主
- 对手压力：兵部尚书

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《铁甲郡主：我在古代造出第一台战甲》。核心内容：工部郡主在王朝工坊里发现战甲蓝图，被兵部尚书逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、王朝工坊的高细节环境、清晰可见的战甲蓝图、题材符号“古代机甲”。风格：古代机甲题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "铁甲郡主：我在古代造出第一台战甲". Core story: a young Asian female lead, 工部郡主, discovers 战甲蓝图 in 王朝工坊, pressured by 兵部尚书, then turns the rules against them. The image must show the lead character, the detailed setting of 王朝工坊, the key prop 战甲蓝图 clearly visible, and strong 古代机甲 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 36. 疫墨少女：我用毒画封住全城鬼门

- slug：`plague-ink-girl`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-plague-ink-girl.png`
- 核心场景：瘟城画院
- 核心道具：疫墨画轴
- 主角身份：药墨画师
- 对手压力：鬼门祭司

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《疫墨少女：我用毒画封住全城鬼门》。核心内容：药墨画师在瘟城画院里发现疫墨画轴，被鬼门祭司逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、瘟城画院的高细节环境、清晰可见的疫墨画轴、题材符号“毒画民俗”。风格：毒画民俗题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "疫墨少女：我用毒画封住全城鬼门". Core story: a young Asian female lead, 药墨画师, discovers 疫墨画轴 in 瘟城画院, pressured by 鬼门祭司, then turns the rules against them. The image must show the lead character, the detailed setting of 瘟城画院, the key prop 疫墨画轴 clearly visible, and strong 毒画民俗 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 37. 海市赊刀人：我卖的刀只斩未来

- slug：`ocean-market`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-ocean-market.png`
- 核心场景：雾上海市
- 核心道具：未来刀契
- 主角身份：赊刀少女
- 对手压力：船帮龙头

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《海市赊刀人：我卖的刀只斩未来》。核心内容：赊刀少女在雾上海市里发现未来刀契，被船帮龙头逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、雾上海市的高细节环境、清晰可见的未来刀契、题材符号“海市预言”。风格：海市预言题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "海市赊刀人：我卖的刀只斩未来". Core story: a young Asian female lead, 赊刀少女, discovers 未来刀契 in 雾上海市, pressured by 船帮龙头, then turns the rules against them. The image must show the lead character, the detailed setting of 雾上海市, the key prop 未来刀契 clearly visible, and strong 海市预言 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 38. 云端戏班：我演完一出戏改了王朝

- slug：`cloud-circus`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-cloud-circus.png`
- 核心场景：云上戏台
- 核心道具：改命戏谱
- 主角身份：云端戏班花旦
- 对手压力：太史令

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《云端戏班：我演完一出戏改了王朝》。核心内容：云端戏班花旦在云上戏台里发现改命戏谱，被太史令逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、云上戏台的高细节环境、清晰可见的改命戏谱、题材符号“戏班权谋”。风格：戏班权谋题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "云端戏班：我演完一出戏改了王朝". Core story: a young Asian female lead, 云端戏班花旦, discovers 改命戏谱 in 云上戏台, pressured by 太史令, then turns the rules against them. The image must show the lead character, the detailed setting of 云上戏台, the key prop 改命戏谱 clearly visible, and strong 戏班权谋 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 39. 血月裁缝：我给仇人缝上真相

- slug：`blood-moon-tailor`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-blood-moon-tailor.png`
- 核心场景：旧城裁缝铺
- 核心道具：真相红线
- 主角身份：血月裁缝
- 对手压力：豪门少爷

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《血月裁缝：我给仇人缝上真相》。核心内容：血月裁缝在旧城裁缝铺里发现真相红线，被豪门少爷逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、旧城裁缝铺的高细节环境、清晰可见的真相红线、题材符号“裁缝复仇”。风格：裁缝复仇题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "血月裁缝：我给仇人缝上真相". Core story: a young Asian female lead, 血月裁缝, discovers 真相红线 in 旧城裁缝铺, pressured by 豪门少爷, then turns the rules against them. The image must show the lead character, the detailed setting of 旧城裁缝铺, the key prop 真相红线 clearly visible, and strong 裁缝复仇 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 40. 末日动物园：我把变异兽养成护城军

- slug：`wasteland-zoo`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-wasteland-zoo.png`
- 核心场景：废城动物园
- 核心道具：异兽饲养册
- 主角身份：动物园管理员
- 对手压力：基地司令

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《末日动物园：我把变异兽养成护城军》。核心内容：动物园管理员在废城动物园里发现异兽饲养册，被基地司令逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、废城动物园的高细节环境、清晰可见的异兽饲养册、题材符号“末日异兽”。风格：末日异兽题材，竖屏国漫，强光影，符号化道具，人物眼神特写，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "末日动物园：我把变异兽养成护城军". Core story: a young Asian female lead, 动物园管理员, discovers 异兽饲养册 in 废城动物园, pressured by 基地司令, then turns the rules against them. The image must show the lead character, the detailed setting of 废城动物园, the key prop 异兽饲养册 clearly visible, and strong 末日异兽 genre signals. Style: premium cinematic Chinese manhua cover art, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 41. 真千金开播后，全家塌房

- slug：`wrong-heir-live`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-wrong-heir-live.png`
- 核心场景：豪门发布会
- 核心道具：直播证据链
- 主角身份：被抱错的真千金
- 对手压力：假千金

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《真千金开播后，全家塌房》。核心内容：被抱错的真千金在豪门发布会里发现直播证据链，被假千金逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、豪门发布会的高细节环境、清晰可见的直播证据链、题材符号“豪门直播”。风格：豪门直播题材，现代短剧电影感，冷暖对比，证据特写，强情绪表演，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "真千金开播后，全家塌房". Core story: a young Asian female lead, 被抱错的真千金, discovers 直播证据链 in 豪门发布会, pressured by 假千金, then turns the rules against them. The image must show the lead character, the detailed setting of 豪门发布会, the key prop 直播证据链 clearly visible, and strong 豪门直播 genre signals. Style: premium cinematic vertical short drama poster, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 42. 离婚倒计时：我的律师是前任

- slug：`divorce-countdown`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-divorce-countdown.png`
- 核心场景：律所会议室
- 核心道具：倒计时协议
- 主角身份：离婚谈判师
- 对手压力：前夫家族

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《离婚倒计时：我的律师是前任》。核心内容：离婚谈判师在律所会议室里发现倒计时协议，被前夫家族逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、律所会议室的高细节环境、清晰可见的倒计时协议、题材符号“离婚逆袭”。风格：离婚逆袭题材，现代短剧电影感，冷暖对比，证据特写，强情绪表演，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "离婚倒计时：我的律师是前任". Core story: a young Asian female lead, 离婚谈判师, discovers 倒计时协议 in 律所会议室, pressured by 前夫家族, then turns the rules against them. The image must show the lead character, the detailed setting of 律所会议室, the key prop 倒计时协议 clearly visible, and strong 离婚逆袭 genre signals. Style: premium cinematic vertical short drama poster, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 43. 返乡后，我把烂村拍成顶流

- slug：`village-millionaire`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-village-millionaire.png`
- 核心场景：破旧山村
- 核心道具：短视频账本
- 主角身份：返乡女导演
- 对手压力：村霸承包商

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《返乡后，我把烂村拍成顶流》。核心内容：返乡女导演在破旧山村里发现短视频账本，被村霸承包商逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、破旧山村的高细节环境、清晰可见的短视频账本、题材符号“乡村逆袭”。风格：乡村逆袭题材，现代短剧电影感，冷暖对比，证据特写，强情绪表演，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "返乡后，我把烂村拍成顶流". Core story: a young Asian female lead, 返乡女导演, discovers 短视频账本 in 破旧山村, pressured by 村霸承包商, then turns the rules against them. The image must show the lead character, the detailed setting of 破旧山村, the key prop 短视频账本 clearly visible, and strong 乡村逆袭 genre signals. Style: premium cinematic vertical short drama poster, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 44. 婆婆审判日：全家都在直播间认罪

- slug：`mother-in-law-trial`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-mother-in-law-trial.png`
- 核心场景：客厅直播间
- 核心道具：家庭直播录音
- 主角身份：全职妈妈
- 对手压力：控制欲婆婆

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《婆婆审判日：全家都在直播间认罪》。核心内容：全职妈妈在客厅直播间里发现家庭直播录音，被控制欲婆婆逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、客厅直播间的高细节环境、清晰可见的家庭直播录音、题材符号“家庭审判”。风格：家庭审判题材，现代短剧电影感，冷暖对比，证据特写，强情绪表演，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "婆婆审判日：全家都在直播间认罪". Core story: a young Asian female lead, 全职妈妈, discovers 家庭直播录音 in 客厅直播间, pressured by 控制欲婆婆, then turns the rules against them. The image must show the lead character, the detailed setting of 客厅直播间, the key prop 家庭直播录音 clearly visible, and strong 家庭审判 genre signals. Style: premium cinematic vertical short drama poster, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 45. 相亲算法把我推给仇人

- slug：`blind-date-algorithm`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-blind-date-algorithm.png`
- 核心场景：科技公司
- 核心道具：相亲算法后台
- 主角身份：数据产品经理
- 对手压力：旧案仇人

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《相亲算法把我推给仇人》。核心内容：数据产品经理在科技公司里发现相亲算法后台，被旧案仇人逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、科技公司的高细节环境、清晰可见的相亲算法后台、题材符号“都市甜悬”。风格：都市甜悬题材，现代短剧电影感，冷暖对比，证据特写，强情绪表演，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "相亲算法把我推给仇人". Core story: a young Asian female lead, 数据产品经理, discovers 相亲算法后台 in 科技公司, pressured by 旧案仇人, then turns the rules against them. The image must show the lead character, the detailed setting of 科技公司, the key prop 相亲算法后台 clearly visible, and strong 都市甜悬 genre signals. Style: premium cinematic vertical short drama poster, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 46. 午夜热线：她接到十年前的自己

- slug：`midnight-hotline`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-midnight-hotline.png`
- 核心场景：深夜热线室
- 核心道具：午夜来电录音
- 主角身份：心理热线接线员
- 对手压力：匿名来电人

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《午夜热线：她接到十年前的自己》。核心内容：心理热线接线员在深夜热线室里发现午夜来电录音，被匿名来电人逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、深夜热线室的高细节环境、清晰可见的午夜来电录音、题材符号“时间悬疑”。风格：时间悬疑题材，现代短剧电影感，冷暖对比，证据特写，强情绪表演，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "午夜热线：她接到十年前的自己". Core story: a young Asian female lead, 心理热线接线员, discovers 午夜来电录音 in 深夜热线室, pressured by 匿名来电人, then turns the rules against them. The image must show the lead character, the detailed setting of 深夜热线室, the key prop 午夜来电录音 clearly visible, and strong 时间悬疑 genre signals. Style: premium cinematic vertical short drama poster, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 47. 合约新娘查到丈夫死亡证明

- slug：`contract-bride-investigator`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-contract-bride-investigator.png`
- 核心场景：婚礼后台
- 核心道具：死亡证明复印件
- 主角身份：合约新娘
- 对手压力：豪门继承人

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《合约新娘查到丈夫死亡证明》。核心内容：合约新娘在婚礼后台里发现死亡证明复印件，被豪门继承人逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、婚礼后台的高细节环境、清晰可见的死亡证明复印件、题材符号“合约婚姻”。风格：合约婚姻题材，现代短剧电影感，冷暖对比，证据特写，强情绪表演，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "合约新娘查到丈夫死亡证明". Core story: a young Asian female lead, 合约新娘, discovers 死亡证明复印件 in 婚礼后台, pressured by 豪门继承人, then turns the rules against them. The image must show the lead character, the detailed setting of 婚礼后台, the key prop 死亡证明复印件 clearly visible, and strong 合约婚姻 genre signals. Style: premium cinematic vertical short drama poster, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 48. 遗产直播拍卖：我竞价买回亲妈

- slug：`inheritance-live-auction`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-inheritance-live-auction.png`
- 核心场景：直播拍卖厅
- 核心道具：遗产拍卖号牌
- 主角身份：债务主播
- 对手压力：遗产代理人

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《遗产直播拍卖：我竞价买回亲妈》。核心内容：债务主播在直播拍卖厅里发现遗产拍卖号牌，被遗产代理人逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、直播拍卖厅的高细节环境、清晰可见的遗产拍卖号牌、题材符号“遗产反转”。风格：遗产反转题材，现代短剧电影感，冷暖对比，证据特写，强情绪表演，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "遗产直播拍卖：我竞价买回亲妈". Core story: a young Asian female lead, 债务主播, discovers 遗产拍卖号牌 in 直播拍卖厅, pressured by 遗产代理人, then turns the rules against them. The image must show the lead character, the detailed setting of 直播拍卖厅, the key prop 遗产拍卖号牌 clearly visible, and strong 遗产反转 genre signals. Style: premium cinematic vertical short drama poster, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 49. 反转办公室：每个工位都有秘密

- slug：`office-reversal-room`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-office-reversal-room.png`
- 核心场景：深夜办公室
- 核心道具：匿名工位卡
- 主角身份：新人审计员
- 对手压力：部门总监

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《反转办公室：每个工位都有秘密》。核心内容：新人审计员在深夜办公室里发现匿名工位卡，被部门总监逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、深夜办公室的高细节环境、清晰可见的匿名工位卡、题材符号“职场悬疑”。风格：职场悬疑题材，现代短剧电影感，冷暖对比，证据特写，强情绪表演，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "反转办公室：每个工位都有秘密". Core story: a young Asian female lead, 新人审计员, discovers 匿名工位卡 in 深夜办公室, pressured by 部门总监, then turns the rules against them. The image must show the lead character, the detailed setting of 深夜办公室, the key prop 匿名工位卡 clearly visible, and strong 职场悬疑 genre signals. Style: premium cinematic vertical short drama poster, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

### 50. 雨夜证人：她的行车记录仪说谎

- slug：`rain-night-witness`
- 保存路径：`public/site/assets/covers/hot-catalog/cover-rain-night-witness.png`
- 核心场景：雨夜高架桥
- 核心道具：行车记录仪
- 主角身份：女代驾司机
- 对手压力：事故车主

**中文提示词**

```text
生成一张9:16竖屏PNG封面，不要文字、不要logo、不要水印。剧名《雨夜证人：她的行车记录仪说谎》。核心内容：女代驾司机在雨夜高架桥里发现行车记录仪，被事故车主逼入死局后反手改写规则。画面必须出现：亚洲年轻女性主角、雨夜高架桥的高细节环境、清晰可见的行车记录仪、题材符号“雨夜探案”。风格：雨夜探案题材，现代短剧电影感，冷暖对比，证据特写，强情绪表演，电影级光影，强景深，前景轻微虚化，人物眼神清晰，环境细节丰富，像高质量可商用短剧/漫剧海报。
```

**English Prompt**

```text
Create a vertical 9:16 PNG cover image, no text, no logo, no watermark. Original script title: "雨夜证人：她的行车记录仪说谎". Core story: a young Asian female lead, 女代驾司机, discovers 行车记录仪 in 雨夜高架桥, pressured by 事故车主, then turns the rules against them. The image must show the lead character, the detailed setting of 雨夜高架桥, the key prop 行车记录仪 clearly visible, and strong 雨夜探案 genre signals. Style: premium cinematic vertical short drama poster, dramatic lighting, rich depth of field, slight foreground blur, clear expressive eyes, detailed environment, high production value, no readable text, no existing IP.
```

**Negative Prompt**

```text
no text, no logo, no watermark, no existing IP character, no poster typography, avoid malformed hands, avoid duplicate faces, avoid low-detail background
```

