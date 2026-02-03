import React, { useState } from 'react';

/**
 * 八字算命网站 - 专业版
 * 完整的运势预测和分析系统
 */

// 简化版的FortuneEngine（因为无法在浏览器中导入Node模块，所以整合在这里）
class FortuneEngine {
  constructor() {
    this.heavenStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    this.earthBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    this.stemWuXing = {
      '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土',
      '庚': '金', '辛': '金', '壬': '水', '癸': '水'
    };
    
    this.branchWuXing = {
      '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
      '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
    };
  }

  yearToGanZhi(year) {
    const stemIndex = (year - 4) % 10;
    const branchIndex = (year - 4) % 12;
    return this.heavenStems[stemIndex] + this.earthBranches[branchIndex];
  }

  monthToGanZhi(year, month) {
    const yearGanZhi = this.yearToGanZhi(year);
    const yearStemIndex = this.heavenStems.indexOf(yearGanZhi[0]);
    const monthStemIndex = (yearStemIndex * 2 + month - 1) % 10;
    const monthBranchIndex = (month - 1) % 12;
    return this.heavenStems[monthStemIndex] + this.earthBranches[monthBranchIndex];
  }

  dayToGanZhi(year, month, day) {
    const baseDate = new Date(1900, 0, 1);
    const currentDate = new Date(year, month - 1, day);
    const days = Math.floor((currentDate - baseDate) / (24 * 60 * 60 * 1000));
    const stemIndex = days % 10;
    const branchIndex = days % 12;
    return this.heavenStems[stemIndex] + this.earthBranches[branchIndex];
  }

  hourToGanZhi(dayGanZhi, hour) {
    const dayHourIndex = this.heavenStems.indexOf(dayGanZhi[0]) * 2;
    let hourBranchIndex = 0;
    if (hour >= 23 || hour < 1) hourBranchIndex = 0;
    else if (hour >= 1 && hour < 3) hourBranchIndex = 1;
    else if (hour >= 3 && hour < 5) hourBranchIndex = 2;
    else if (hour >= 5 && hour < 7) hourBranchIndex = 3;
    else if (hour >= 7 && hour < 9) hourBranchIndex = 4;
    else if (hour >= 9 && hour < 11) hourBranchIndex = 5;
    else if (hour >= 11 && hour < 13) hourBranchIndex = 6;
    else if (hour >= 13 && hour < 15) hourBranchIndex = 7;
    else if (hour >= 15 && hour < 17) hourBranchIndex = 8;
    else if (hour >= 17 && hour < 19) hourBranchIndex = 9;
    else if (hour >= 19 && hour < 21) hourBranchIndex = 10;
    else hourBranchIndex = 11;
    const hourStemIndex = (dayHourIndex + hourBranchIndex) % 10;
    return this.heavenStems[hourStemIndex] + this.earthBranches[hourBranchIndex];
  }

  getBaZi(year, month, day, hour) {
    const yearGanZhi = this.yearToGanZhi(year);
    const monthGanZhi = this.monthToGanZhi(year, month);
    const dayGanZhi = this.dayToGanZhi(year, month, day);
    const hourGanZhi = this.hourToGanZhi(dayGanZhi, hour);
    return {
      year: yearGanZhi, month: monthGanZhi, day: dayGanZhi, hour: hourGanZhi,
      full: `${yearGanZhi} ${monthGanZhi} ${dayGanZhi} ${hourGanZhi}`
    };
  }

  getWuXingCount(baZi) {
    const allChars = (baZi.year + baZi.month + baZi.day + baZi.hour).split('');
    const wuXingCount = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
    allChars.forEach(char => {
      if (this.stemWuXing[char]) wuXingCount[this.stemWuXing[char]]++;
      if (this.branchWuXing[char]) wuXingCount[this.branchWuXing[char]]++;
    });
    return wuXingCount;
  }

  calculateDayMasterStrength(baZi) {
    const dayMaster = baZi.day[0];
    const wuXing = this.stemWuXing[dayMaster];
    const yearGan = baZi.year[0], monthGan = baZi.month[0], hourGan = baZi.hour[0];
    const yearZhi = baZi.year[1], monthZhi = baZi.month[1], dayZhi = baZi.day[1], hourZhi = baZi.hour[1];
    let strength = 50;
    if (this.stemWuXing[yearGan] === wuXing) strength += 15;
    if (this.stemWuXing[monthGan] === wuXing) strength += 20;
    if (this.stemWuXing[baZi.day[0]] === wuXing) strength += 30;
    if (this.stemWuXing[hourGan] === wuXing) strength += 15;
    if (this.branchWuXing[yearZhi] === wuXing) strength += 10;
    if (this.branchWuXing[monthZhi] === wuXing) strength += 15;
    if (this.branchWuXing[dayZhi] === wuXing) strength += 20;
    if (this.branchWuXing[hourZhi] === wuXing) strength += 10;
    return Math.min(Math.round(strength), 100);
  }

  generateFortune(year, month, day, hour, gender) {
    const baZi = this.getBaZi(year, month, day, hour);
    const wuXingCount = this.getWuXingCount(baZi);
    const dayMasterStrength = this.calculateDayMasterStrength(baZi);
    const dayMasterWuXing = this.stemWuXing[baZi.day[0]];
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    let age = currentYear - year;
    if (currentMonth < month || (currentMonth === month && currentDay < day)) age--;

    const fortuneIndices = this.calculateFortuneIndices(baZi, wuXingCount, dayMasterStrength, age);
    return { baZi, wuXingCount, dayMasterStrength, dayMasterWuXing, age, gender, fortuneIndices };
  }

  calculateFortuneIndices(baZi, wuXingCount, dayMasterStrength, age) {
    const baseScore = dayMasterStrength;
    const maxWuXing = Math.max(...Object.values(wuXingCount));
    const minWuXing = Math.min(...Object.values(wuXingCount));
    const balance = maxWuXing === 0 ? 50 : Math.round((1 - (maxWuXing - minWuXing) / 8) * 100);
    const daYunCycle = Math.floor(age / 10);
    const daYunFortune = (baseScore + (daYunCycle * 5)) % 100;
    const xiaYunFortune = (baseScore + (age % 12) * 8) % 100;

    return {
      overall: Math.round((dayMasterStrength + balance) / 2),
      wealth: Math.min(Math.round((wuXingCount['火'] + wuXingCount['木']) / 0.08), 100),
      career: Math.round(balance * 0.9),
      love: Math.round(balance * 0.8),
      health: dayMasterStrength,
      balance: balance,
      daYun: Math.round(daYunFortune * 0.7),
      xiaYun: Math.round(xiaYunFortune * 0.8)
    };
  }
}

export default function FortuneWebsite() {
  const [birthDate, setBirthDate] = useState({
    year: 2000,
    month: 1,
    day: 1,
    hour: 12,
    gender: 'male'
  });

  const [fortune, setFortune] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const engine = new FortuneEngine();

  const handleCalculate = () => {
    const result = engine.generateFortune(
      parseInt(birthDate.year),
      parseInt(birthDate.month),
      parseInt(birthDate.day),
      parseInt(birthDate.hour),
      birthDate.gender
    );
    setFortune(result);
    setShowResult(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBirthDate(prev => ({ ...prev, [name]: value }));
  };

  const getWuXingColor = (wuXing) => {
    const colors = { '木': '#4CAF50', '火': '#FF6B6B', '土': '#D4A574', '金': '#FFD700', '水': '#2196F3' };
    return colors[wuXing] || '#9C27B0';
  };

  const FortuneBar = ({ value, label }) => (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>{label}</span>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#FF6B6B' }}>{value}%</span>
      </div>
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: '#E0E0E0',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${value}%`,
          height: '100%',
          backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          borderRadius: '4px',
          transition: 'width 0.6s ease'
        }} />
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 头部 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 10px', fontWeight: '700' }}>
            ✨ 八字算命大师 ✨
          </h1>
          <p style={{ fontSize: '18px', margin: '10px 0 0', opacity: 0.9 }}>
            根据你的出生日期预测今天的运势、财运和前路
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
          {/* 左侧输入面板 */}
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '40px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            animation: 'slideInLeft 0.6s ease'
          }}>
            <h2 style={{ marginTop: 0, color: '#333', fontSize: '24px', marginBottom: '30px' }}>
              📝 输入你的信息
            </h2>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#555' }}>
                🎂 出生年份
              </label>
              <input
                type="number"
                name="year"
                min="1900"
                max={new Date().getFullYear()}
                value={birthDate.year}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #667eea',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s'
                }}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#555' }}>
                📅 出生月份
              </label>
              <select
                name="month"
                value={birthDate.month}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #667eea',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              >
                {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}月</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#555' }}>
                📆 出生日期
              </label>
              <select
                name="day"
                value={birthDate.day}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #667eea',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              >
                {[...Array(31)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}日</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#555' }}>
                🕐 出生时辰
              </label>
              <select
                name="hour"
                value={birthDate.hour}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #667eea',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              >
                {[...Array(24)].map((_, i) => <option key={i} value={i}>{i}:00</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#555' }}>
                👤 性别
              </label>
              <select
                name="gender"
                value={birthDate.gender}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  border: '2px solid #667eea',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>

            <button
              onClick={handleCalculate}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#764ba2'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#667eea'}
            >
              🔮 开始算命
            </button>
          </div>

          {/* 右侧结果面板 */}
          {showResult && fortune && (
            <div style={{
              animation: 'slideInRight 0.6s ease'
            }}>
              {/* 八字信息 */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '30px',
                marginBottom: '25px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
              }}>
                <h3 style={{ marginTop: 0, color: '#667eea', fontSize: '20px' }}>📊 你的八字</h3>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#333',
                  lineHeight: '1.8',
                  textAlign: 'center',
                  padding: '20px',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  borderRadius: '10px'
                }}>
                  <div>年: {fortune.baZi.year}</div>
                  <div>月: {fortune.baZi.month}</div>
                  <div>日: {fortune.baZi.day}</div>
                  <div>时: {fortune.baZi.hour}</div>
                </div>
              </div>

              {/* 五行信息 */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '30px',
                marginBottom: '25px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
              }}>
                <h3 style={{ marginTop: 0, color: '#667eea', fontSize: '20px' }}>🌊 五行分布</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                  {['木', '火', '土', '金', '水'].map(wuXing => (
                    <div key={wuXing} style={{
                      textAlign: 'center',
                      padding: '15px',
                      backgroundColor: getWuXingColor(wuXing),
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      <div style={{ fontSize: '18px' }}>{wuXing}</div>
                      <div style={{ fontSize: '24px', marginTop: '5px' }}>{fortune.wuXingCount[wuXing]}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 今日运势 */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '30px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
              }}>
                <h3 style={{ marginTop: 0, color: '#667eea', fontSize: '20px' }}>🎯 今日运势指数</h3>
                <FortuneBar value={fortune.fortuneIndices.overall} label="综合运势" />
                <FortuneBar value={fortune.fortuneIndices.wealth} label="财运" />
                <FortuneBar value={fortune.fortuneIndices.career} label="事业运" />
                <FortuneBar value={fortune.fortuneIndices.love} label="爱情运" />
                <FortuneBar value={fortune.fortuneIndices.health} label="健康运" />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        input:focus, select:focus {
          outline: none;
          border-color: #764ba2;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
      `}</style>
    </div>
  );
}