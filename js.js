// ========== 天干地支数据 ==========
const heavenStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const earthBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 十二地支对应的五行
const branchElements = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木',
    '辰': '土', '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 十天干对应的五行
const stemElements = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火',
    '戊': '土', '己': '土', '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
};

// 十天干的阴阳
const stemYinYang = {
    '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴',
    '戊': '阳', '己': '阴', '庚': '阳', '辛': '阴',
    '壬': '阳', '癸': '阴'
};

// 十二地支的阴阳
const branchYinYang = {
    '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴',
    '辰': '阳', '巳': '阴', '午': '阳', '未': '阴',
    '申': '阳', '酉': '阴', '戌': '阳', '亥': '阴'
};

// 地支对应的纳音五行
const branchNayin = {
    '子': '金', '丑': '金', '寅': '火', '卯': '火',
    '辰': '木', '巳': '木', '午': '土', '未': '土',
    '申': '水', '酉': '水', '戌': '火', '亥': '水'
};

// 五行颜色对应
const elementColors = {
    '木': '#52c41a',
    '火': '#ff4d4f',
    '土': '#ad6800',
    '金': '#d4af37',
    '水': '#1890ff'
};

// ========== 农历计算函数 ==========
class LunarCalendar {
    constructor() {
        // 农历数据 (从1900年1月31日开始)
        this.lunarData = [
            0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0,
            0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558,
            0x0b540, 0x0b6a0, 0x195a6, 0x095b0, 0x049b0, 0x0a4b8, 0x0a4b0, 0x0b27a
        ];
    }

    isLeapYear(lunarYear) {
        return this.getLeapMonth(lunarYear) !== 0;
    }

    getLeapMonth(lunarYear) {
        const flag = this.lunarData[lunarYear - 1900] & 0xf;
        return flag === 0 ? 0 : flag;
    }

    getMonthDays(lunarYear, lunarMonth) {
        const leap = this.getLeapMonth(lunarYear);
        const isLeap = lunarMonth === leap;
        lunarMonth = isLeap ? leap : lunarMonth;

        const days = this.lunarData[lunarYear - 1900] >> (lunarMonth + 15);
        return (days & 1) + 29;
    }

    solar2lunar(solar) {
        const year = solar.year;
        const month = solar.month;
        const date = solar.date;

        let lunarYear = year;
        let lunarMonth = 1;
        let lunarDate = 1;

        const baseDate = new Date(1900, 0, 31);
        const solarDate = new Date(year, month - 1, date);
        const days = Math.floor((solarDate - baseDate) / 86400000);

        let sum = 0;
        let flag = true;

        for (let i = 1900; i < 2100; i++) {
            let daysInYear = 0;

            for (let j = 1; j <= 13; j++) {
                if (j === this.getLeapMonth(i) && flag) {
                    daysInYear += this.getMonthDays(i, j);
                    flag = false;
                } else if (j === this.getLeapMonth(i) + 1) {
                    flag = true;
                }
                daysInYear += this.getMonthDays(i, j);
            }

            if (sum + daysInYear > days) {
                lunarYear = i;
                flag = true;
                sum = 0;

                for (let k = 1; k <= 13; k++) {
                    if (k === this.getLeapMonth(i) && flag) {
                        sum += this.getMonthDays(i, k);
                        flag = false;
                    } else if (k === this.getLeapMonth(i) + 1) {
                        flag = true;
                    }

                    if (sum + this.getMonthDays(i, k) > days) {
                        lunarMonth = k;
                        lunarDate = days - sum + 1;
                        break;
                    }
                    sum += this.getMonthDays(i, k);
                }
                break;
            }
            sum += daysInYear;
        }

        return {
            year: lunarYear,
            month: lunarMonth,
            date: lunarDate
        };
    }
}

// ========== 八字计算类 ==========
class BaziCalculator {
    constructor() {
        this.calendar = new LunarCalendar();
    }

    /**
     * 根据农历日期和时辰计算八字
     */
    calculate(solarDate, hour) {
        const lunar = this.calendar.solar2lunar({
            year: solarDate.getFullYear(),
            month: solarDate.getMonth() + 1,
            date: solarDate.getDate()
        });

        // 处理闰月
        let monthIndex = lunar.month;
        if (monthIndex > this.calendar.getLeapMonth(lunar.year)) {
            monthIndex--;
        }

        // 计算年柱
        const yearStem = heavenStems[(lunar.year - 1900 + 1) % 10];
        const yearBranch = earthBranches[(lunar.year - 1900) % 12];

        // 计算月柱
        const baseMonthStem = (heavenStems.indexOf(yearStem) + (monthIndex - 1) * 2) % 10;
        const monthStem = heavenStems[baseMonthStem];
        const monthBranch = earthBranches[(monthIndex + 1) % 12];

        // 计算日柱
        const baseDate = new Date(1900, 0, 1);
        const currentDate = new Date(lunar.year, lunar.month - 1, lunar.date);
        const dayDiff = Math.floor((currentDate - baseDate) / 86400000);
        
        const dayStem = heavenStems[dayDiff % 10];
        const dayBranch = earthBranches[dayDiff % 12];

        // 计算时柱
        const baseHourStem = (heavenStems.indexOf(dayStem) + hour * 2) % 10;
        const hourStem = heavenStems[baseHourStem];
        const hourBranch = earthBranches[hour % 12];

        return {
            year: { stem: yearStem, branch: yearBranch },
            month: { stem: monthStem, branch: monthBranch },
            day: { stem: dayStem, branch: dayBranch },
            hour: { stem: hourStem, branch: hourBranch },
            lunar: lunar
        };
    }

    /**
     * 计算五行统计
     */
    calculateElements(bazi) {
        const elements = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
        
        // 统计天干和地支中的五行
        [bazi.year, bazi.month, bazi.day, bazi.hour].forEach(pillar => {
            const stemElement = stemElements[pillar.stem];
            const branchElement = branchElements[pillar.branch];
            elements[stemElement]++;
            elements[branchElement]++;
        });

        return elements;
    }

    /**
     * 分析五行平衡
     */
    analyzeBalance(elements) {
        const total = Object.values(elements).reduce((a, b) => a + b, 0);
        const balance = {};
        
        Object.entries(elements).forEach(([element, count]) => {
            balance[element] = {
                count: count,
                percentage: ((count / total) * 100).toFixed(1),
                rating: this.getElementRating(count, total)
            };
        });

        return balance;
    }

    /**
     * 获取元素等级
     */
    getElementRating(count, total) {
        const percentage = (count / total) * 100;
        if (percentage >= 30) return '强';
        if (percentage >= 20) return '中等';
        return '弱';
    }
}

// ========== 运势计算类 ==========
class FortuneCalculator {
    constructor() {
        this.baziCalc = new BaziCalculator();
    }

    /**
     * 计算今日运势总分
     */
    calculateDailyFortune(bazi, gender) {
        const today = new Date();
        const lunar = this.baziCalc.calendar.solar2lunar({
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            date: today.getDate()
        });

        let score = 50; // 基础分

        // 根据五行平衡调整
        const elements = this.baziCalc.calculateElements(bazi);
        const balance = this.baziCalc.analyzeBalance(elements);

        // 五行平衡度评分
        const balanceScore = this.calculateBalance(elements);
        score += (balanceScore - 50) * 0.3;

        // 日期因素（农历数字）
        const lunarFactor = ((lunar.month * 3 + lunar.date) % 10 - 5) * 3;
        score += lunarFactor;

        // 性别因素
        if (gender === 'male') {
            score += (balance['火'].percentage - balance['水'].percentage) * 0.1;
        } else {
            score += (balance['水'].percentage - balance['火'].percentage) * 0.1;
        }

        // 限制在0-100之间
        score = Math.max(0, Math.min(100, Math.round(score)));

        return score;
    }

    /**
     * 计算财运指数
     */
    calculateWealthFortune(bazi) {
        let fortune = 50;

        const elements = this.baziCalc.calculateElements(bazi);
        
        // 金元素强 = 财富
        fortune += elements['金'] * 5;
        
        // 土元素中等 = 财富积累
        fortune += elements['土'] * 3;
        
        // 水元素 = 流动
        fortune -= elements['水'] * 2;

        // 年干影响财运
        const yearStem = bazi.year.stem;
        if (['庚', '辛'].includes(yearStem)) {
            fortune += 5;
        }

        // 日干影响（日干为天干，代表自己）
        const dayStem = bazi.day.stem;
        if (['甲', '乙', '丙', '丁'].includes(dayStem)) {
            fortune += 8;
        }

        fortune = Math.max(0, Math.min(100, Math.round(fortune)));

        return fortune;
    }

    /**
     * 计算五行平衡分
     */
    calculateBalance(elements) {
        const values = Object.values(elements);
        const avg = values.reduce((a, b) => a + b, 0) / 5;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / 5;
        
        // 方差越小，平衡越好
        const score = 100 - (Math.sqrt(variance) * 5);
        return Math.max(0, Math.min(100, score));
    }

    /**
     * 生成财运建议
     */
    generateWealthAdvice(fortune) {
        if (fortune >= 80) {
            return [
                '✓ 今日财运上升，是开启新项目的好时机',
                '✓ 可考虑重要的财务决策或投资',
                '✓ 宜进行大额商业谈判'
            ];
        } else if (fortune >= 60) {
            return [
                '✓ 财运平稳，适合稳健的财务规划',
                '✓ 可考虑储蓄或定期投资',
                '✓ 谨慎处理大额支出'
            ];
        } else if (fortune >= 40) {
            return [
                '⚠ 财运一般，建议保持谨慎',
                '⚠ 避免冒险性投资',
                '⚠ 加强成本控制'
            ];
        } else {
            return [
                '⚠ 财运较弱，建议低调理财',
                '⚠ 避免大额支出或投资',
                '⚠ 专注于稳定收入来源'
            ];
        }
    }

    /**
     * 生成综合建议
     */
    generateAdvice(bazi, fortune, wealthFortune) {
        const advice = [];

        const elements = this.baziCalc.calculateElements(bazi);
        
        // 根据五行分析建议
        if (elements['火'] > 4) {
            advice.push('火元素偏强，建议保持冷静，避免冲动决策');
        }
        if (elements['水'] > 4) {
            advice.push('水元素偏强，适合灵活变通，把握流动机会');
        }
        if (elements['金'] > 4) {
            advice.push('金元素偏强，有利于财富积累和严谨执行');
        }
        if (elements['木'] > 4) {
            advice.push('木元素偏强，适合创新和向外发展');
        }

        // 根据运势分析建议
        if (fortune < 40) {
            advice.push('总体运势较弱，建议低调行动，避免高风险活动');
        } else if (fortune > 70) {
            advice.push('总体运势向好，适合主动出击，抓住机会');
        }

        return advice.length > 0 ? advice : ['保持平常心，顺势而为'];
    }

    /**
     * 生成详细分析文本
     */
    generateDetailedAnalysis(bazi, elements, balance) {
        let analysis = '';

        analysis += `<div class="analysis-paragraph">
            <strong>八字组合分析：</strong><br>
            您的八字为 ${bazi.year.stem}${bazi.year.branch} ${bazi.month.stem}${bazi.month.branch} 
            ${bazi.day.stem}${bazi.day.branch} ${bazi.hour.stem}${bazi.hour.branch}。
            这个八字组合体现了独特的五行结构和阴阳平衡。
        </div>`;

        analysis += `<div class="analysis-paragraph">
            <strong>五行分布：</strong><br>
            您的五行分布中，<strong>金元素</strong>${elements['金']}次，
            <strong>木元素</strong>${elements['木']}次，
            <strong>水元素</strong>${elements['水']}次，
            <strong>火元素</strong>${elements['火']}次，
            <strong>土元素</strong>${elements['土']}次。
            五行的均衡度直接影响人生运势的稳定性。
        </div>`;

        // 分析最强和最弱元素
        const sortedElements = Object.entries(elements).sort((a, b) => b[1] - a[1]);
        const strongest = sortedElements[0];
        const weakest = sortedElements[4];

        analysis += `<div class="analysis-paragraph">
            <strong>元素强弱分析：</strong><br>
            最强元素为${strongest[0]}（${strongest[1]}次），代表您最发达的领域。
            最弱元素为${weakest[0]}（${weakest[1]}次），可能需要加强关注。
            通过调理五行平衡，可以改善运势。
        </div>`;

        return analysis;
    }
}

// ========== 页面交互函数 ==========
const fortuneCalc = new FortuneCalculator();

document.getElementById('fortuneForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const birthDate = new Date(document.getElementById('birthDate').value);
    const birthHour = parseInt(document.getElementById('birthHour').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;

    // 计算八字
    const bazi = fortuneCalc.baziCalc.calculate(birthDate, birthHour);
    
    // 计算五行
    const elements = fortuneCalc.baziCalc.calculateElements(bazi);
    const balance = fortuneCalc.baziCalc.analyzeBalance(elements);

    // 计算运势和财运
    const fortuneScore = fortuneCalc.calculateDailyFortune(bazi, gender);
    const wealthFortune = fortuneCalc.calculateWealthFortune(bazi);

    // 显示结果
    displayResults(bazi, elements, balance, fortuneScore, wealthFortune, gender);
    
    // 滚动到结果部分
    document.getElementById('resultsSection').classList.remove('hidden');
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
});

function displayResults(bazi, elements, balance, fortuneScore, wealthFortune, gender) {
    // 基本信息
    const birthDate = document.getElementById('birthDate').value;
    document.getElementById('displayDate').textContent = birthDate;
    
    const hourOptions = {
        '0': '子时 (23:00-01:00)',
        '1': '丑时 (01:00-03:00)',
        '2': '寅时 (03:00-05:00)',
        '3': '卯时 (05:00-07:00)',
        '4': '辰时 (07:00-09:00)',
        '5': '巳时 (09:00-11:00)',
        '6': '午时 (11:00-13:00)',
        '7': '未时 (13:00-15:00)',
        '8': '申时 (15:00-17:00)',
        '9': '酉时 (17:00-19:00)',
        '10': '戌时 (19:00-21:00)',
        '11': '亥时 (21:00-23:00)'
    };
    const birthHour = document.getElementById('birthHour').value;
    document.getElementById('displayHour').textContent = hourOptions[birthHour];
    
    document.getElementById('displayGender').textContent = gender === 'male' ? '男' : '女';
    
    const today = new Date();
    document.getElementById('todayDate').textContent = today.toLocaleDateString('zh-CN');

    // 五行属性
    let elementHTML = '';
    Object.entries(elements).forEach(([element, count]) => {
        const percentage = balance[element].percentage;
        elementHTML += `
            <div class="element-item-row">
                <span class="element-name" style="color: ${elementColors[element]}">${element}：</span>
                <span class="element-value">${count}次 (${percentage}%)</span>
            </div>
        `;
    });
    document.getElementById('elementInfo').innerHTML = elementHTML;

    // 天干地支
    document.getElementById('yearStem').textContent = bazi.year.stem;
    document.getElementById('monthStem').textContent = bazi.month.stem;
    document.getElementById('dayStem').textContent = bazi.day.stem;
    document.getElementById('hourStem').textContent = bazi.hour.stem;
    
    document.getElementById('yearBranch').textContent = bazi.year.branch;
    document.getElementById('monthBranch').textContent = bazi.month.branch;
    document.getElementById('dayBranch').textContent = bazi.day.branch;
    document.getElementById('hourBranch').textContent = bazi.hour.branch;

    // 运势评分
    document.getElementById('overallScore').textContent = fortuneScore;
    const overallBar = document.getElementById('overallBar');
    overallBar.style.width = fortuneScore + '%';
    overallBar.style.setProperty('--width', fortuneScore + '%');

    // 财运分析
    const fortuneRating = wealthFortune >= 70 ? '优秀' : 
                         wealthFortune >= 50 ? '良好' : 
                         wealthFortune >= 30 ? '一般' : '欠佳';
    
    document.getElementById('fortuneScore').textContent = wealthFortune + ' / 100';
    document.getElementById('fortuneIndex').textContent = fortuneRating;
    
    const fortuneBar = document.getElementById('fortuneBar');
    fortuneBar.style.width = wealthFortune + '%';
    fortuneBar.style.setProperty('--width', wealthFortune + '%');

    // 财运建议
    const wealthAdvice = fortuneCalc.generateWealthAdvice(wealthFortune);
    document.getElementById('fortuneText').innerHTML = wealthAdvice.join('<br>');

    // 五行运势对比
    let elementFortuneHTML = '';
    const elementOrder = ['金', '木', '水', '火', '土'];
    elementOrder.forEach(element => {
        const count = elements[element];
        const color = elementColors[element];
        const percentage = (count / 10 * 100);
        elementFortuneHTML += `
            <div class="element-bar">
                <div class="element-name-bar">${element}</div>
                <div class="element-bar-bg">
                    <div class="element-bar-fill" style="background: ${color}; width: ${percentage}%; --width: ${percentage}%"></div>
                </div>
                <span style="min-width: 30px; text-align: right;">${count}次</span>
            </div>
        `;
    });
    document.getElementById('elementFortune').innerHTML = elementFortuneHTML;

    // 今日建议
    const advice = fortuneCalc.generateAdvice(bazi, fortuneScore, wealthFortune);
    const adviceHTML = advice.map(item => `<div class="advice-item">${item}</div>`).join('');
    document.getElementById('advice').innerHTML = adviceHTML;

    // 详细分析
    const detailedAnalysis = fortuneCalc.generateDetailedAnalysis(bazi, elements, balance);
    document.getElementById('detailedAnalysis').innerHTML = detailedAnalysis;
}

function resetForm() {
    document.getElementById('fortuneForm').reset();
    document.getElementById('resultsSection').classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}