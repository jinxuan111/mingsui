/**
 * 运势详细分析报告生成器
 * 生成专业的八字分析报告
 */

class DetailedAnalysisGenerator {
  constructor() {
    this.wuXingDescriptions = {
      '木': {
        名称: '木',
        颜色: '绿色',
        方向: '东方',
        季节: '春季',
        器官: '肝胆',
        情绪: '怒',
        味道: '酸'
      },
      '火': {
        名称: '火',
        颜色: '红色',
        方向: '南方',
        季节: '夏季',
        器官: '心脑',
        情绪: '喜',
        味道: '苦'
      },
      '土': {
        名称: '土',
        颜色: '黄色',
        方向: '中央',
        季节: '四季末',
        器官: '脾胃',
        情绪: '思',
        味道: '甘'
      },
      '金': {
        名称: '金',
        颜色: '白色',
        方向: '西方',
        季节: '秋季',
        器官: '肺肠',
        情绪: '悲',
        味道: '辛'
      },
      '水': {
        名称: '水',
        颜色: '黑色',
        方向: '北方',
        季节: '冬季',
        器官: '肾膀胱',
        情绪: '恐',
        味道: '咸'
      }
    };

    this.fortuneTemplate = {
      极好: { 范围: [85, 100], 描述: '运气极佳，吉星高照，诸事顺利', 建议: '把握机遇，大展拳脚' },
      很好: { 范围: [70, 84], 描述: '运气很好，贵人扶助，前路光明', 建议: '主动出击，乘势而上' },
      不错: { 范围: [55, 69], 描述: '运气不错，稳中有进，平稳发展', 建议: '稳健前进，不可急躁' },
      一般: { 范围: [40, 54], 描述: '运气一般，需要调整，需要努力', 建议: '调整策略，沉着应对' },
      较差: { 范围: [25, 39], 描述: '运气较差，挑战多，需要谨慎', 建议: '保守理财，避免冒险' },
      很差: { 范围: [0, 24], 描述: '运气很差，困难重重，需要静观其变', 建议: '蓄势待发，等待转机' }
    };
  }

  /**
   * 生成综合分析报告
   */
  generateFullReport(fortune) {
    return {
      基础信息: this.generateBasicInfo(fortune),
      八字分析: this.generateBaZiAnalysis(fortune),
      五行分析: this.generateWuXingAnalysis(fortune),
      运势分析: this.generateFortuneAnalysis(fortune),
      财运分析: this.generateWealthAnalysis(fortune),
      事业分析: this.generateCareerAnalysis(fortune),
      感情分析: this.generateLoveAnalysis(fortune),
      健康建议: this.generateHealthAdvice(fortune),
      逐月运势: this.generateMonthlyFortune(fortune),
      改运建议: this.generateImproveAdvice(fortune),
      币圈建议: this.generateCryptoAdvice(fortune)
    };
  }
  
  generateCryptoAdvice(fortune) {
    const wealth = fortune.fortuneIndices.wealth;
    const overall = fortune.fortuneIndices.overall;
    const wx = fortune.dayMasterWuXing;
    const strength = fortune.dayMasterStrength;

    let advice = '🔥 币圈·土狗运势分析 🔥\n\n';

    // 五行对应币圈风格
    const wxStyle = {
        '木': '成长型项目，适合长线埋伏新叙事',
        '火': '热点爆炒，今天容易短线吃肉',
        '土': '宜持蓝筹稳定币，土狗风险高',
        '金': '高风险高收益，适合重仓梭哈',
        '水': '流动性强，适合快进快出波段'
    };
    advice += `你的日主五行【${wx}】：${wxStyle[wx] || '灵活应变，随机应变'}\n\n`;

    if (wealth > 85 && overall > 75) {
        advice += '⚡⚡ 今日土狗运极佳！财星高照，贵人运爆棚！\n';
        advice += '非常适合打土狗、上新、上所项目，容易吃到大肉！\n';
        advice += '建议：重仓潜力 meme / 新叙事，敢梭哈敢暴富！\n';
        advice += '⚠️ 记得见好就收，落袋为安！';
    } else if (wealth > 70) {
        advice += '🔥 土狗运很不错，有小惊喜！\n';
        advice += '今天适合打土狗，轻仓试水热点项目很容易吃肉。\n';
        advice += '推荐关注 Solana/Base/BSC 新 meme，跟KOL走大概率盈利。\n';
        advice += '策略：设置止盈止损，玩得开心。';
    } else if (wealth > 50) {
        advice += '📊 土狗运中等，市场震荡。\n';
        advice += '可以小玩怡情，但不建议重仓打土狗。\n';
        advice += '更适合埋伏蓝筹或老 meme，避免追高。\n';
        advice += '耐心等回调再出手。';
    } else if (wealth > 30) {
        advice += '⚠️ 土狗运偏弱，容易被割。\n';
        advice += '今天不建议打新土狗，容易站岗。\n';
        advice += '推荐观望或只用娱乐资金玩老项目。\n';
        advice += '多学习，等待更好时机。';
    } else {
        advice += '❄️ 今日土狗运很差，强烈不建议打土狗！\n';
        advice += '容易接盘、被套，FOMO 必亏。\n';
        advice += '建议持币休息，或只持 BTC/ETH 大币。\n';
        advice += '耐心等大运到来，币圈最忌急躁。';
    }

    advice += `\n\n今日财运指数：${wealth}/100（越高越适合投机）`;

    if (strength > 70) {
        advice += '\n日主强势：你天生适合高风险操作，把握节奏易大成！';
    } else if (strength < 40) {
        advice += '\n日主偏弱：建议保守策略，避免过度投机。';
    }

    return advice;
}
  generateBasicInfo(fortune) {
    return {
      年龄: fortune.age,
      性别: fortune.gender === 'male' ? '男' : '女',
      八字: fortune.baZi.full,
      日主: fortune.baZi.day,
      日主五行: fortune.dayMasterWuXing,
      日主强弱: `${fortune.dayMasterStrength}分`
    };
  }

  generateBaZiAnalysis(fortune) {
    const { baZi, dayMasterStrength, dayMasterWuXing } = fortune;
    
    let analysis = `你的八字为：${baZi.full}\n\n`;
    analysis += `日主（日干）为${baZi.day[0]}，属${dayMasterWuXing}性。\n`;
    
    if (dayMasterStrength > 70) {
      analysis += `日主非常旺盛（强度${dayMasterStrength}分），说明你天生自信、行动力强、主见坚定。\n`;
      analysis += `你是天生的领导者，具有很强的自我管理能力和执行力。\n`;
    } else if (dayMasterStrength > 55) {
      analysis += `日主相对旺盛（强度${dayMasterStrength}分），说明你具有良好的自我管理能力。\n`;
      analysis += `你能够平衡工作和生活，具有健全的人格和稳定的心态。\n`;
    } else if (dayMasterStrength > 40) {
      analysis += `日主中等强度（强度${dayMasterStrength}分），说明你性格温和，容易适应环境。\n`;
      analysis += `你需要依靠他人的帮助和支持，但同时具有良好的合作精神。\n`;
    } else {
      analysis += `日主相对偏弱（强度${dayMasterStrength}分），说明你需要借助他人的力量来实现目标。\n`;
      analysis += `你应该更多地寻求贵人相助，建立良好的人际关系网络。\n`;
    }

    return analysis;
  }

  generateWuXingAnalysis(fortune) {
    const { wuXingCount } = fortune;
    const total = Object.values(wuXingCount).reduce((a, b) => a + b, 0);
    
    let analysis = '五行分析:\n\n';
    
    for (const [wuXing, count] of Object.entries(wuXingCount)) {
      const percentage = Math.round((count / total) * 100);
      const desc = this.wuXingDescriptions[wuXing];
      analysis += `${desc.名称}：${count}个（${percentage}%）- `;
      analysis += `代表${desc.方向}、${desc.季节}、${desc.器官}系统。\n`;
    }

    analysis += '\n五行平衡分析:\n';
    const maxCount = Math.max(...Object.values(wuXingCount));
    const minCount = Math.min(...Object.values(wuXingCount));
    
    if (maxCount - minCount <= 2) {
      analysis += '五行分布均衡，说明你的性格平和，各方面能力均衡发展。这是最好的先天条件。\n';
    } else if (maxCount - minCount <= 4) {
      analysis += '五行分布基本均衡，需要加强某些方面的能力，以实现全面发展。\n';
    } else {
      analysis += '五行分布失衡，说明你在某些方面的能力较强，但在其他方面可能需要补强。\n';
    }

    return analysis;
  }

  generateFortuneAnalysis(fortune) {
    const { fortuneIndices } = fortune;
    const overall = fortuneIndices.overall;
    
    let levelKey = null;
    for (const [key, value] of Object.entries(this.fortuneTemplate)) {
      if (overall >= value.范围[0] && overall <= value.范围[1]) {
        levelKey = key;
        break;
      }
    }
    
    const template = this.fortuneTemplate[levelKey];
    
    let analysis = `综合运势评价：${template.描述}\n\n`;
    analysis += `总体运势指数：${overall}/100\n`;
    analysis += `建议：${template.建议}\n\n`;
    analysis += `详细运势指数:\n`;
    analysis += `- 财运指数：${fortuneIndices.wealth}/100\n`;
    analysis += `- 事业运：${fortuneIndices.career}/100\n`;
    analysis += `- 爱情运：${fortuneIndices.love}/100\n`;
    analysis += `- 健康运：${fortuneIndices.health}/100\n`;
    analysis += `- 五行平衡：${fortuneIndices.balance}/100\n`;

    return analysis;
  }

  generateWealthAnalysis(fortune) {
    const { wuXingCount, dayMasterStrength } = fortune;
    const fireWood = (wuXingCount['火'] + wuXingCount['木']) || 0;
    const waterMetal = (wuXingCount['水'] + wuXingCount['金']) || 0;
    
    let analysis = '财运分析：\n\n';
    
    if (dayMasterStrength > 70) {
      analysis += '日主强势，适合主动创业和投资。\n';
      analysis += '你具有很强的赚钱能力和财务敏感度，能够抓住商机。\n';
    } else if (dayMasterStrength < 35) {
      analysis += '日主偏弱，应以稳定收入为主。\n';
      analysis += '建议不要盲目投资和创业，坚守主业为佳。\n';
    } else {
      analysis += '日主中等，兼具创业和稳定两种选择。\n';
      analysis += '可以在稳定工作的基础上适度投资理财。\n';
    }

    analysis += '\n财运指数分析：\n';
    if (fortune.fortuneIndices.wealth > 80) {
      analysis += '今年财运极佳，投资和创业机会多。\n';
      analysis += '但需要谨慎，避免过度冒险。\n';
    } else if (fortune.fortuneIndices.wealth > 60) {
      analysis += '今年财运不错，有稳定的收入来源。\n';
      analysis += '可以适度进行一些投资和理财。\n';
    } else if (fortune.fortuneIndices.wealth > 40) {
      analysis += '今年财运一般，收支基本平衡。\n';
      analysis += '应该保守理财，避免大额支出。\n';
    } else {
      analysis += '今年财运较弱，需要谨慎理财。\n';
      analysis += '建议减少不必要的开支，储备流动资金。\n';
    }

    return analysis;
  }

  generateCareerAnalysis(fortune) {
    const { dayMasterWuXing, dayMasterStrength } = fortune;
    
    let analysis = '事业分析：\n\n';
    
    const careerPaths = {
      '木': ['企业管理', '教育培训', '林业农业', '医疗医药'],
      '火': ['能源电力', '通信传媒', '法律顾问', '市场营销'],
      '土': ['房地产', '建筑工程', '农业种植', '公务员'],
      '金': ['金融银行', '机械制造', '汽车行业', '军警系统'],
      '水': ['水运贸易', '旅游酒店', '传播媒体', '信息技术']
    };

    const paths = careerPaths[dayMasterWuXing] || [];
    analysis += `根据你的五行属性（${dayMasterWuXing}），适合从事：\n`;
    paths.forEach((path, index) => {
      analysis += `${index + 1}. ${path}\n`;
    });

    analysis += '\n事业发展建议：\n';
    if (dayMasterStrength > 70) {
      analysis += '你是天生的领导者，应该争取管理职位或创业。\n';
      analysis += '不要害怕承担责任，你有能力驾驭复杂的局面。\n';
    } else if (dayMasterStrength < 35) {
      analysis += '建议在稳定的公司工作，寻找有贵人扶持的环境。\n';
      analysis += '不适合独自创业，但可以成为优秀的专业人士。\n';
    } else {
      analysis += '既有创业的能力，也有稳定的基础。\n';
      analysis += '可以根据机遇选择创业或进入高成长企业。\n';
    }

    return analysis;
  }

  generateLoveAnalysis(fortune) {
    const { dayMasterWuXing, gender, age } = fortune;
    
    let analysis = '感情分析：\n\n';
    
    analysis += `根据你的五行属性（${dayMasterWuXing}），你的感情特点：\n\n`;
    
    const loveTraits = {
      '木': '性格直爽，热情主动，但有时过于固执导致沟通不足。\n建议学会倾听和妥协，增进与伴侣的理解。',
      '火': '热情奔放，充满激情，但容易情绪化。\n建议培养耐心，用理性来平衡情感。',
      '土': '忠诚可靠，重视长期关系，但有时缺乏浪漫。\n建议增加生活情趣，表达内心的情感。',
      '金': '理性现实，看重价值观契合，但有时显得冷漠。\n建议学会表达温情，增进情感交流。',
      '水': '温柔体贴，善于理解，但容易过度敏感。\n建议增强自信，减少无谓的担忧。'
    };
    
    analysis += loveTraits[dayMasterWuXing] || '感情运需要用心经营。\n';
    
    analysis += '\n今年感情运势：\n';
    if (fortune.fortuneIndices.love > 70) {
      analysis += '爱情运极佳，单身者有望遇见心仪的人。\n已婚者感情和谐，夫妻恩爱。\n';
    } else if (fortune.fortuneIndices.love > 50) {
      analysis += '爱情运不错，感情生活稳定。\n有机会发展新的感情关系。\n';
    } else {
      analysis += '爱情运一般，需要主动出击。\n已婚者需要多关心和沟通。\n';
    }

    return analysis;
  }

  generateHealthAdvice(fortune) {
    const { dayMasterWuXing, wuXingCount } = fortune;
    
    let analysis = '健康建议：\n\n';
    
    const healthTips = {
      '木': {
        器官: '肝胆系统',
        注意: '避免过度疲劳，定期检查肝功能。',
        调理: '春季多做户外运动，泡脚时可加入艾草。',
        忌: '避免过度生气和情绪波动。'
      },
      '火': {
        器官: '心脑血液系统',
        注意: '避免过度兴奋和精神压力。',
        调理: '夏季清热降火，适当冥想和瑜伽。',
        忌: '避免过度疲劳和熬夜。'
      },
      '土': {
        器官: '脾胃消化系统',
        注意: '饮食规律，避免过饱过饥。',
        调理: '定时进补，多吃黄色食物。',
        忌: '避免过度思虑和担忧。'
      },
      '金': {
        器官: '肺部呼吸系统',
        注意: '防范呼吸道疾病，避免吸烟。',
        调理: '秋季滋阴润肺，多吃白色食物。',
        忌: '避免悲伤情绪，保持乐观心态。'
      },
      '水': {
        器官: '肾脏泌尿系统',
        注意: '避免过度疲劳，防止受冷。',
        调理: '冬季温阳补肾，充足睡眠。',
        忌: '避免过度恐惧，防止肾虚。'
      }
    };
    
    const tips = healthTips[dayMasterWuXing];
    analysis += `主要器官：${tips.器官}\n`;
    analysis += `注意事项：${tips.注意}\n`;
    analysis += `调理建议：${tips.调理}\n`;
    analysis += `禁忌：${tips.忌}\n`;

    analysis += '\n今年健康指数：' + fortune.fortuneIndices.health + '/100\n';
    
    if (fortune.fortuneIndices.health > 70) {
      analysis += '健康状况很好，可以正常工作和生活。\n建议保持规律的作息和适度的运动。';
    } else if (fortune.fortuneIndices.health > 50) {
      analysis += '健康状况可以，但需要注意调理。\n建议加强锻炼，定期体检。';
    } else {
      analysis += '健康运势一般，需要谨慎保养。\n建议增加医疗检查频率，及时治疗。';
    }

    return analysis;
  }

  generateMonthlyFortune(fortune) {
    const { age } = fortune;
    const months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
    let analysis = '逐月运势预测：\n\n';

    months.forEach((month, index) => {
      const monthScore = (50 + (age + index) * 3 + Math.sin(index) * 20) % 100;
      const level = monthScore > 70 ? '良好' : monthScore > 50 ? '一般' : '需要调整';
      analysis += `${month}月：${Math.round(monthScore)} 分 - ${level}\n`;
    });

    return analysis;
  }

  generateImproveAdvice(fortune) {
    const { dayMasterWuXing, dayMasterStrength } = fortune;
    
    let analysis = '改运建议：\n\n';
    
    analysis += '1. 五行调理：\n';
    const wuXingColors = {
      '木': '绿色',
      '火': '红色',
      '土': '黄色',
      '金': '白色',
      '水': '黑色'
    };
    
    analysis += `   穿着多选择${wuXingColors[dayMasterWuXing]}系列衣物，有助于增强运势。\n`;
    analysis += '   在办公桌和卧室摆放相应五行元素的装饰品。\n\n';
    
    analysis += '2. 方位调理：\n';
    analysis += '   根据五行属性选择合适的居住和工作方位。\n';
    analysis += `   ${dayMasterWuXing}性宜向东方发展。\n\n`;
    
    analysis += '3. 数字调理：\n';
    analysis += '   使用幸运数字进行投资和决策。\n';
    analysis += '   电话号码、车牌等宜选择吉利数字。\n\n';
    
    analysis += '4. 习惯调理：\n';
    analysis += '   早起和规律作息能增强运势。\n';
    analysis += '   定期运动和冥想能平衡五行。\n';
    analysis += '   施舍和行善能积累福报。\n\n';
    
    analysis += '5. 人际调理：\n';
    analysis += '   结交志同道合的朋友。\n';
    analysis += '   多参加社交活动，扩展人脉。\n';
    analysis += '   寻找贵人相助来提升运势。\n';

    return analysis;
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DetailedAnalysisGenerator;
}