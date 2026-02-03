// ========== 农历转换算法 ==========
class LunarCalendar {
    static lunarData = [
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
        0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
        0x04970, 0x0a4b0, 0x0b4b5, 0x0ad50, 0x0955f, 0x0aba0, 0x135a7, 0x06ca0, 0x0b550, 0x15355,
        0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60,
        0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0,
        0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, 0x095b0, 0x049b0, 0x0a6d0
    ];

    static toSolarDate(lunarYear, lunarMonth, lunarDay) {
        // 简化实现，返回农历对应的公历日期
        const startYear = 1900;
        const startMonth = 1;
        const startDay = 31;
        const baseDate = new Date(1900, 0, 31);
        
        let days = 0;
        for (let year = startYear; year < lunarYear; year++) {
            days += this.yearDays(year);
        }
        
        for (let month = 1; month < lunarMonth; month++) {
            days += this.monthDays(lunarYear, month);
        }
        
        days += lunarDay - 1;
        
        const resultDate = new Date(baseDate.getTime() + days * 86400000);
        return resultDate;
    }

    static yearDays(year) {
        let sum = 348;
        for (let i = 0x8000; i > 0x8; i >>= 1) {
            sum += (this.lunarData[year - 1900] & i) ? 1 : 0;
        }
        return sum + this.leapMonthDays(year);
    }

    static monthDays(year, month) {
        return (this.lunarData[year - 1900] & (0x10000 >> month)) ? 30 : 29;
    }

    static leapMonthDays(year) {
        return (this.lunarData[year - 1900] & 0x10000) ? 30 : 29;
    }
}

// ========== 八字核心算法 ==========
class BaziCalculator {
    static heavenStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    static earthBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    static elements = ['木', '火', '土', '金', '水'];
    static elementStems = {
        '甲': '木', '乙': '木', '丙': '火', '丁': '火',
        '戊': '土', '己': '土', '庚': '金', '辛': '金',
        '壬': '水', '癸': '水'
    };
    static elementBranches = {
        '子': '水', '丑': '土', '寅': '木', '卯': '木',
        '辰': '土', '巳': '火', '午': '火', '未': '土',
        '申': '金', '酉': '金', '戌': '土', '亥': '水'
    };

    static getStemIndex(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        // 简化计算：基于日期的干支
        const totalDays = Math.floor((date.getTime() - new Date(1900, 0, 1).getTime()) / 86400000);
        return (totalDays + 4) % 10;
    }

    static getBranchIndex(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        const totalDays = Math.floor((date.getTime() - new Date(1900, 0, 1).getTime()) / 86400000);
        return (totalDays + 4) % 12;
    }

    static getYearStemBranch(year) {
        return {
            stem: this.heavenStems[(year - 1900 + 6) % 10],
            branch: this.earthBranches[(year - 1900 + 8) % 12]
        };
    }

    static getMonthStemBranch(date) {
        const yearStem = this.getYearStemBranch(date.getFullYear()).stem;
        const yearStemIndex = this.heavenStems.indexOf(yearStem);
        const month = date.getMonth() + 1;
        
        const monthStemOffset = ((yearStemIndex % 5) * 2 + (month - 1)) % 10;
        const monthBranchIndex = (month + 1) % 12;
        
        return {
            stem: this.heavenStems[monthStemOffset],
            branch: this.earthBranches[monthBranchIndex]
        };
    }

    static getDayStemBranch(date) {
        return {
            stem: this.heavenStems[this.getStemIndex(date)],
            branch: this.earthBranches[this.getBranchIndex(date)]
        };
    }

    static getHourStemBranch(date, hour) {
        const dayBranch = this.getDayStemBranch(date).stem;
        const dayBranchIndex = this.heavenStems.indexOf(dayBranch);
        
        const hourBranchIndex = Math.floor(hour / 2) % 12;
        const hourStemOffset = (dayBranchIndex % 5) * 2 + hourBranchIndex;
        
        return {
            stem: this.heavenStems[hourStemOffset % 10],
            branch: this.earthBranches[hourBranchIndex]
        };
    }

    static getFullBazi(date, hour) {
        const year = this.getYearStemBranch(date.getFullYear());
        const month = this.getMonthStemBranch(date);
        const day = this.getDayStemBranch(date);
        const time = this.getHourStemBranch(date, hour);
        
        return { year, month, day, time };
    }

    static calculateElementBalance(bazi) {
        const elements = {
            '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
        };
        
        for (const pillar of [bazi.year, bazi.month, bazi.day, bazi.time]) {
            elements[this.elementStems[pillar.stem]]++;
            elements[this.elementBranches[pillar.branch]]++;
        }
        
        const total = Object.values(elements).reduce((a, b) => a + b);
        const balanced = {};
        for (const [elem, count] of Object.entries(elements)) {
            balanced[elem] = Math.round((count / total) * 100);
        }
        
        return { count: elements, percentage: balanced, total };
    }
}

// ========== 土狗品质算法 ==========
class DogeQualityCalculator {
    static dogeTraits = [
        '纯正', '忠诚', '聪慧', '勇敢', '坚韧',
        '活泼', '热情', '友善', '警觉', '灵敏'
    ];

    static calculateDogeLevel(bazi, date) {
        const elementBalance = BaziCalculator.calculateElementBalance(bazi);
        
        // 金属性（土狗本质）权重最高
        const metalScore = elementBalance.percentage['金'] || 0;
        const waterScore = elementBalance.percentage['水'] || 0; // 水生金
        const earthScore = elementBalance.percentage['土'] || 0; // 土生金
        
        // 计算总分
        const dogeScore = (metalScore * 0.4 + waterScore * 0.25 + earthScore * 0.2 + 
                          (elementBalance.percentage['木'] || 0) * 0.1 +
                          (elementBalance.percentage['火'] || 0) * 0.05);
        
        // 根据分数确定等级
        let level = 'F级 [弱犬]';
        let grade = 'F';
        if (dogeScore >= 85) level = 'SSS级 [传奇秘犬]', grade = 'SSS';
        else if (dogeScore >= 75) level = 'SS级 [顶级秘犬]', grade = 'SS';
        else if (dogeScore >= 65) level = 'S级 [超级秘犬]', grade = 'S';
        else if (dogeScore >= 55) level = 'A级 [优秀秘犬]', grade = 'A';
        else if (dogeScore >= 45) level = 'B级 [良好秘犬]', grade = 'B';
        else if (dogeScore >= 35) level = 'C级 [普通秘犬]', grade = 'C';
        else if (dogeScore >= 25) level = 'D级 [初级秘犬]', grade = 'D';
        else if (dogeScore >= 15) level = 'E级 [幼小秘犬]', grade = 'E';
        
        // 随机选择土狗特质
        const traitIndices = [];
        const seed = date.getTime();
        const random1 = ((seed * 73856093) ^ (987654321)) % this.dogeTraits.length;
        const random2 = ((seed * 19349663) ^ (456789012)) % this.dogeTraits.length;
        const traits = [
            this.dogeTraits[Math.abs(random1)],
            this.dogeTraits[Math.abs(random2)]
        ];
        
        return {
            level,
            grade,
            score: Math.round(dogeScore),
            traits,
            description: this.getDogeDescription(dogeScore),
            goldRatio: Math.round(metalScore)
        };
    }

    static getDogeDescription(score) {
        if (score >= 85) return '你是传奇中的秘犬，具有极其罕见的赛博朋克气质，注定要在加密世界闪闪发光';
        if (score >= 75) return '你是顶级秘犬，拥有超强的品质和运势，适合在关键时刻把握机遇';
        if (score >= 65) return '你是超级秘犬，品质优异，具有很强的正向能量和财运';
        if (score >= 55) return '你是优秀秘犬，基础品质不错，需要把握关键的行动时机';
        if (score >= 45) return '你是良好秘犬，平衡发展是你的优势';
        if (score >= 35) return '你是普通秘犬，需要更多修为来提升运势';
        if (score >= 25) return '你是初级秘犬，潜力待发，坚持修行才能成功';
        return '你是幼小秘犬，需要时间的打磨，未来充满可能';
    }
}

// ========== 运势财运预测算法 ==========
class FortuneCalculator {
    static calculateDailyFortune(bazi, date) {
        const seed = date.getTime();
        
        // 基础分数（基于八字五行）
        const elementBalance = BaziCalculator.calculateElementBalance(bazi);
        
        // 生成各项运势分数
        const health = 40 + (elementBalance.percentage['火'] || 0) * 0.3 + 
                      Math.sin(seed / 100000) * 20;
        const love = 35 + (elementBalance.percentage['水'] || 0) * 0.25 + 
                    Math.sin(seed / 150000) * 25;
        const career = 50 + (elementBalance.percentage['木'] || 0) * 0.4 + 
                      Math.sin(seed / 200000) * 15;
        const social = 45 + (elementBalance.percentage['金'] || 0) * 0.35 + 
                      Math.sin(seed / 180000) * 18;
        
        const overallFortune = (health + love + career + social) / 4;
        
        return {
            overall: Math.round(overallFortune),
            health: Math.round(Math.max(0, Math.min(100, health))),
            love: Math.round(Math.max(0, Math.min(100, love))),
            career: Math.round(Math.max(0, Math.min(100, career))),
            social: Math.round(Math.max(0, Math.min(100, social)))
        };
    }

    static calculateWealth(bazi, date) {
        const seed = date.getTime();
        const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
        
        // 财富指数计算
        const elementBalance = BaziCalculator.calculateElementBalance(bazi);
        const goldRatio = elementBalance.percentage['金'] || 0;
        const waterRatio = elementBalance.percentage['水'] || 0;
        const earthRatio = elementBalance.percentage['土'] || 0;
        
        const wealthScore = (goldRatio * 0.5 + waterRatio * 0.3 + earthRatio * 0.2 +
                            (Math.sin(seed / 100000) * 10)) + 20;
        
        // 横财指数（基于日期）
        const luckyMoneyBase = (dayOfYear % 10) * 8 + (date.getDate() % 7) * 5;
        const luckyMoney = Math.round(luckyMoneyBase + (Math.sin(seed / 50000) * 15));
        
        // 投资信号
        let investSignal = '观望';
        const investScore = (Math.cos(seed / 100000) + 1) * 50;
        if (investScore > 70) investSignal = '🔥 激进买入';
        else if (investScore > 55) investSignal = '✅ 建议买入';
        else if (investScore < 30) investSignal = '⚠️ 谨慎减仓';
        else if (investScore < 45) investSignal = '🔻 建议卖出';
        
        // 财源方向
        const directions = [
            '东方（树木）', '西方（金属）', '北方（水源）',
            '南方（火焰）', '中央（土地）', '东北方', '西南方',
            '东南方', '西北方', '随处可得'
        ];
        const directionIndex = (dayOfYear + seed) % directions.length;
        
        return {
            wealth: Math.round(Math.max(0, Math.min(100, wealthScore))),
            luckyMoney: Math.max(0, luckyMoney),
            investSignal,
            investScore: Math.round(investScore),
            direction: directions[directionIndex],
            wealthText: this.getWealthDescription(wealthScore)
        };
    }

    static getWealthDescription(score) {
        if (score >= 75) return '极佳';
        if (score >= 60) return '良好';
        if (score >= 45) return '中等';
        if (score >= 30) return '一般';
        return '较差';
    }

    static calculateTimeSlotFortune(date, slotHours) {
        const seed = date.getTime();
        const ratingMap = ['☆☆☆☆☆', '★☆☆☆☆', '★★☆☆☆', '★★★☆☆', '★★★★☆', '★★★★★'];
        
        // 根据时间段和日期计算评分
        const baseScore = (slotHours[0] + date.getDate() * 13 + seed / 100000) % 6;
        return ratingMap[Math.floor(Math.max(0, Math.min(5, baseScore)))];
    }

    static calculateCryptoFortune(bazi, date) {
        const seed = date.getTime();
        const elementBalance = BaziCalculator.calculateElementBalance(bazi);
        
        // BTC走势基于水元素（流动性）
        const waterScore = elementBalance.percentage['水'] || 0;
        let btcSignal = '📊 盘整';
        if (waterScore > 60) btcSignal = '📈 看涨';
        else if (waterScore < 30) btcSignal = '📉 看跌';
        
        // 狗币特殊运势（基于金+水）
        const dogeScore = (elementBalance.percentage['金'] || 0) * 0.6 + 
                         (elementBalance.percentage['水'] || 0) * 0.4;
        let dogeSignal = '😐 保持';
        if (dogeScore > 70) dogeSignal = '🚀 爆发';
        else if (dogeScore > 55) dogeSignal = '📈 上行';
        else if (dogeScore < 35) dogeSignal = '📉 下行';
        
        // 稳定币推荐
        const stableIndex = (date.getDate() + Math.floor(seed / 100000)) % 3;
        const stableCoins = ['USDT 稳定', 'USDC 安心', 'DAI 平衡'];
        
        // 出入建议
        let cryptoAction = '⏸ 持仓';
        const actionScore = (Math.sin(seed / 50000) + 1) * 50;
        if (actionScore > 70) cryptoAction = '📥 建议买入';
        else if (actionScore > 55) cryptoAction = '📈 轻仓建仓';
        else if (actionScore < 30) cryptoAction = '📤 建议卖出';
        else if (actionScore < 45) cryptoAction = '📉 止损减仓';
        
        return {
            btcSignal,
            dogeSignal,
            stableCoin: stableCoins[stableIndex],
            cryptoAction
        };
    }
}

// ========== 能量计算 ==========
class EnergyCalculator {
    static calculateDailyEnergy(date) {
        const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
        const energyLevels = ['低', '中低', '中等', '中高', '高', '极高'];
        const index = dayOfYear % 6;
        return energyLevels[index];
    }
}

// 导出模块
window.BaziCalculator = BaziCalculator;
window.DogeQualityCalculator = DogeQualityCalculator;
window.FortuneCalculator = FortuneCalculator;
window.EnergyCalculator = EnergyCalculator;
window.LunarCalendar = LunarCalendar;