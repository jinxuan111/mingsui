/**
 * 八字算命引擎 - 专业版
 * 包含干支转换、五行属性、纳音属性、大运小运计算等
 */

class FortuneEngine {
  constructor() {
    // 天干数组
    this.heavenStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    // 地支数组
    this.earthBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    // 五行属性 (天干)
    this.stemWuXing = {
      '甲': '木', '乙': '木',
      '丙': '火', '丁': '火',
      '戊': '土', '己': '土',
      '庚': '金', '辛': '金',
      '壬': '水', '癸': '水'
    };
    
    // 五行属性 (地支)
    this.branchWuXing = {
      '子': '水', '丑': '土',
      '寅': '木', '卯': '木',
      '辰': '土', '巳': '火',
      '午': '火', '未': '土',
      '申': '金', '酉': '金',
      '戌': '土', '亥': '水'
    };

    // 纳音五行
    this.naYin = {
      '甲子': '金', '乙丑': '金',
      '丙寅': '火', '丁卯': '火',
      '戊辰': '木', '己巳': '木',
      '庚午': '土', '辛未': '土',
      '壬申': '金', '癸酉': '金',
      '甲戌': '火', '乙亥': '火',
      '丙子': '水', '丁丑': '水',
      '戊寅': '土', '己卯': '土',
      '庚辰': '金', '辛巳': '金',
      '壬午': '木', '癸未': '木',
      '甲申': '水', '乙酉': '水',
      '丙戌': '土', '丁亥': '土',
      '戊子': '火', '己丑': '火',
      '庚寅': '松柏木', '辛卯': '松柏木',
      '壬辰': '长流水', '癸巳': '长流水',
      '甲午': '砂石金', '乙未': '砂石金',
      '丙申': '山下火', '丁酉': '山下火',
      '戊戌': '平地木', '己亥': '平地木'
    };

    // 五行相生相克关系
    this.wuXingRelation = {
      '相生': {
        '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
      },
      '相克': {
        '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
      }
    };

    // 十二地支对应的时辰
    this.hourMap = {
      '子': '23:00-01:00',
      '丑': '01:00-03:00',
      '寅': '03:00-05:00',
      '卯': '05:00-07:00',
      '辰': '07:00-09:00',
      '巳': '09:00-11:00',
      '午': '11:00-13:00',
      '未': '13:00-15:00',
      '申': '15:00-17:00',
      '酉': '17:00-19:00',
      '戌': '19:00-21:00',
      '亥': '21:00-23:00'
    };

    // 月份对应地支
    this.monthBranches = ['', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
  }

  /**
   * 计算某年的干支
   */
  yearToGanZhi(year) {
    const stemIndex = (year - 4) % 10;
    const branchIndex = (year - 4) % 12;
    return this.heavenStems[stemIndex] + this.earthBranches[branchIndex];
  }

  /**
   * 计算某月的干支（农历）
   */
  monthToGanZhi(year, month) {
    const yearGanZhi = this.yearToGanZhi(year);
    const yearStemIndex = this.heavenStems.indexOf(yearGanZhi[0]);
    
    // 根据年干推算月干
    const monthStemIndex = (yearStemIndex * 2 + month - 1) % 10;
    const monthBranchIndex = (month - 1) % 12;
    
    return this.heavenStems[monthStemIndex] + this.earthBranches[monthBranchIndex];
  }

  /**
   * 计算某日的干支
   */
  dayToGanZhi(year, month, day) {
    // 计算从1900年1月1日到当前日期的天数
    const baseDate = new Date(1900, 0, 1); // 1900-01-01 是鼠年甲子日
    const currentDate = new Date(year, month - 1, day);
    const days = Math.floor((currentDate - baseDate) / (24 * 60 * 60 * 1000));
    
    const stemIndex = days % 10;
    const branchIndex = days % 12;
    
    return this.heavenStems[stemIndex] + this.earthBranches[branchIndex];
  }

  /**
   * 计算某时的干支
   */
  hourToGanZhi(dayGanZhi, hour) {
    const dayHourIndex = this.heavenStems.indexOf(dayGanZhi[0]) * 2;
    
    let hourBranchIndex;
    if (hour >= 23 || hour < 1) hourBranchIndex = 0; // 子
    else if (hour >= 1 && hour < 3) hourBranchIndex = 1; // 丑
    else if (hour >= 3 && hour < 5) hourBranchIndex = 2; // 寅
    else if (hour >= 5 && hour < 7) hourBranchIndex = 3; // 卯
    else if (hour >= 7 && hour < 9) hourBranchIndex = 4; // 辰
    else if (hour >= 9 && hour < 11) hourBranchIndex = 5; // 巳
    else if (hour >= 11 && hour < 13) hourBranchIndex = 6; // 午
    else if (hour >= 13 && hour < 15) hourBranchIndex = 7; // 未
    else if (hour >= 15 && hour < 17) hourBranchIndex = 8; // 申
    else if (hour >= 17 && hour < 19) hourBranchIndex = 9; // 酉
    else if (hour >= 19 && hour < 21) hourBranchIndex = 10; // 戌
    else hourBranchIndex = 11; // 亥
    
    const hourStemIndex = (dayHourIndex + hourBranchIndex) % 10;
    
    return this.heavenStems[hourStemIndex] + this.earthBranches[hourBranchIndex];
  }

  /**
   * 获取八字信息
   */
  getBaZi(year, month, day, hour) {
    const yearGanZhi = this.yearToGanZhi(year);
    const monthGanZhi = this.monthToGanZhi(year, month);
    const dayGanZhi = this.dayToGanZhi(year, month, day);
    const hourGanZhi = this.hourToGanZhi(dayGanZhi, hour);

    return {
      year: yearGanZhi,
      month: monthGanZhi,
      day: dayGanZhi,
      hour: hourGanZhi,
      full: `${yearGanZhi} ${monthGanZhi} ${dayGanZhi} ${hourGanZhi}`
    };
  }

  /**
   * 获取五行统计
   */
  getWuXingCount(baZi) {
    const allChars = (baZi.year + baZi.month + baZi.day + baZi.hour).split('');
    const wuXingCount = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
    
    allChars.forEach(char => {
      if (this.stemWuXing[char]) {
        wuXingCount[this.stemWuXing[char]]++;
      }
      if (this.branchWuXing[char]) {
        wuXingCount[this.branchWuXing[char]]++;
      }
    });

    return wuXingCount;
  }

  /**
   * 计算日主强弱
   */
  calculateDayMasterStrength(baZi) {
    const dayMaster = baZi.day[0];
    const wuXing = this.stemWuXing[dayMaster];
    const yearGan = baZi.year[0];
    const monthGan = baZi.month[0];
    const dayGan = baZi.day[0];
    const hourGan = baZi.hour[0];
    const yearZhi = baZi.year[1];
    const monthZhi = baZi.month[1];
    const dayZhi = baZi.day[1];
    const hourZhi = baZi.hour[1];

    let strength = 50; // 基础值

    // 天干支持
    if (this.stemWuXing[yearGan] === wuXing) strength += 15;
    if (this.stemWuXing[monthGan] === wuXing) strength += 20;
    if (this.stemWuXing[dayGan] === wuXing) strength += 30;
    if (this.stemWuXing[hourGan] === wuXing) strength += 15;

    // 地支支持
    if (this.branchWuXing[yearZhi] === wuXing) strength += 10;
    if (this.branchWuXing[monthZhi] === wuXing) strength += 15;
    if (this.branchWuXing[dayZhi] === wuXing) strength += 20;
    if (this.branchWuXing[hourZhi] === wuXing) strength += 10;

    // 限制上限
    strength = Math.min(strength, 100);

    return Math.round(strength);
  }

  /**
   * 生成运势详细分析
   */
  generateFortune(year, month, day, hour, gender) {
    const baZi = this.getBaZi(year, month, day, hour);
    const wuXingCount = this.getWuXingCount(baZi);
    const dayMasterStrength = this.calculateDayMasterStrength(baZi);
    
    const dayMaster = baZi.day[0];
    const dayMasterWuXing = this.stemWuXing[dayMaster];

    // 计算今年运势指数 (基于农历年份)
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    const currentHour = today.getHours();

    // 计算年龄
    let age = currentYear - year;
    if (currentMonth < month || (currentMonth === month && currentDay < day)) {
      age--;
    }

    // 生成各项指数
    const fortuneIndices = this.calculateFortuneIndices(baZi, wuXingCount, dayMasterStrength, age);

    return {
      baZi,
      wuXingCount,
      dayMasterStrength,
      dayMasterWuXing,
      age,
      gender,
      fortuneIndices,
      analysis: this.generateAnalysis(baZi, wuXingCount, dayMasterStrength, dayMasterWuXing)
    };
  }

  /**
   * 计算各项运势指数
   */
  calculateFortuneIndices(baZi, wuXingCount, dayMasterStrength, age) {
    const baseScore = dayMasterStrength;
    
    // 根据五行平衡计算
    const maxWuXing = Math.max(...Object.values(wuXingCount));
    const minWuXing = Math.min(...Object.values(wuXingCount));
    const balance = maxWuXing === 0 ? 50 : Math.round((1 - (maxWuXing - minWuXing) / 8) * 100);

    // 大运周期运势 (每10年为一个大运)
    const daYunCycle = Math.floor(age / 10);
    const daYunFortune = (baseScore + (daYunCycle * 5)) % 100;

    // 小运运势 (每年变化)
    const xiaYunFortune = (baseScore + (age % 12) * 8) % 100;

    // 财运指数
    const wealthWuXing = this.wuXingRelation['相克'][baZi.day[1]];
    const wealthCount = wuXingCount[wealthWuXing] || 0;
    const wealthFortune = Math.round((wealthCount / 4) * 100);

    // 官运指数
    const officialWuXing = this.wuXingRelation['相克'][baZi.day[1]];
    const officialFortune = Math.round(((4 - wealthCount) / 4) * 100);

    // 爱情指数
    const loveFortune = Math.round(balance * 0.9);

    // 健康指数
    const healthFortune = dayMasterStrength;

    return {
      overall: Math.round((dayMasterStrength + balance) / 2),
      wealth: Math.min(Math.round(wealthFortune * 1.2), 100),
      career: Math.round(officialFortune * 0.8),
      love: loveFortune,
      health: healthFortune,
      balance: balance,
      daYun: Math.round(daYunFortune * 0.7),
      xiaYun: Math.round(xiaYunFortune * 0.8)
    };
  }

  /**
   * 生成文字分析
   */
  generateAnalysis(baZi, wuXingCount, dayMasterStrength, dayMasterWuXing) {
    const analyses = {
      character: this.analyzeCharacter(dayMasterWuXing),
      career: this.analyzeCareer(dayMasterWuXing, wuXingCount),
      wealth: this.analyzeWealth(wuXingCount, dayMasterStrength),
      relationship: this.analyzeRelationship(dayMasterWuXing),
      health: this.analyzeHealth(dayMasterWuXing, wuXingCount)
    };

    return analyses;
  }

  analyzeCharacter(wuXing) {
    const characterTraits = {
      '木': '性格直爽，善于领导，具有开创精神。木性人富有同情心，但有时过于固执。',
      '火': '热情奔放，聪慧机灵，具有感染力。火性人易于冲动，需要理性引导。',
      '土': '稳重踏实，诚实可信，具有包容心。土性人行动偏慢，但基础扎实。',
      '金': '性格坚强，意志力强，具有正义感。金性人有时过于严肃，缺乏柔性。',
      '水': '聪慧灵动，机变善谋，具有适应能力。水性人有时优柔寡断，缺乏坚持。'
    };
    return characterTraits[wuXing] || '性格复杂多变，具有深层魅力。';
  }

  analyzeCareer(wuXing, wuXingCount) {
    const careerAdvice = {
      '木': '适合从事文艺、教育、林业、医药等行业。也可考虑管理、领导类工作。',
      '火': '适合从事能源、电力、通信、文化、传媒等行业。也可从事律师、法官等职业。',
      '土': '适合从事房地产、建筑、农业、陶艺等行业。也可从事公务员等稳定工作。',
      '金': '适合从事金属、机械、汽车、金融、军警等行业。也适合经营金属性商品。',
      '水': '适合从事航运、贸易、旅游、传播、流动性工作。也可从事信息产业。'
    };
    return careerAdvice[wuXing] || '可根据兴趣选择多元化的职业方向。';
  }

  analyzeWealth(wuXingCount, dayMasterStrength) {
    const totalWuXing = Object.values(wuXingCount).reduce((a, b) => a + b, 0);
    const balance = Math.max(...Object.values(wuXingCount)) - Math.min(...Object.values(wuXingCount));
    
    if (balance > 4) {
      return '五行失衡，财运起伏较大。建议保守理财，避免过度投资。';
    } else if (dayMasterStrength > 75) {
      return '日主旺盛，具有聚财能力。适合主动创业，收益潜力大。';
    } else if (dayMasterStrength < 35) {
      return '日主偏弱，需要借力发展。适合稳定工作，量入为出。';
    } else {
      return '财运相对平稳，有机遇但需把握。建议多方面布局理财。';
    }
  }

  analyzeRelationship(wuXing) {
    const relationshipAnalysis = {
      '木': '感情专一，但有时过于固执导致沟通困难。需要学会妥协和理解。',
      '火': '热情似火，容易陷入热恋。但情绪化可能伤害感情，需要冷静思考。',
      '土': '忠诚可靠，是良好的伴侣。但有时缺乏浪漫，需要增加情趣。',
      '金': '理性对待感情，有时显得冷漠。需要学会表达感情和关怀。',
      '水': '温柔体贴，善于理解他人。但有时过于敏感，容易多想。'
    };
    return relationshipAnalysis[wuXing] || '感情运势需要用心经营。';
  }

  analyzeHealth(wuXing, wuXingCount) {
    const healthAdvice = {
      '木': '注意肝胆健康，避免过度疲劳。春季需要特别关注，多做户外运动。',
      '火': '注意心脏血液循环，避免过度兴奋。夏季易感不适，需要充分休息。',
      '土': '注意脾胃消化，饮食需要规律。湿气较重，应少食油腻食物。',
      '金': '注意肺部呼吸，避免呼吸道疾病。秋季体质偏弱，需要加强锻炼。',
      '水': '注意肾脏功能，避免过度疲劳。冬季防寒，补充温阳能量。'
    };
    return healthAdvice[wuXing] || '建议定期体检，注重健康管理。';
  }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FortuneEngine;
}