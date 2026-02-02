from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from datetime import datetime, timedelta
import json
import os

app = Flask(__name__)
CORS(app)

# ========== 天干地支和五行数据 ==========
HEAVEN_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
EARTH_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

BRANCH_ELEMENTS = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木',
    '辰': '土', '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土', '亥': '水'
}

STEM_ELEMENTS = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火',
    '戊': '土', '己': '土', '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
}

STEM_YIN_YANG = {
    '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴',
    '戊': '阳', '己': '阴', '庚': '阳', '辛': '阴',
    '壬': '阳', '癸': '阴'
}

BRANCH_YIN_YANG = {
    '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴',
    '辰': '阳', '巳': '阴', '午': '阳', '未': '阴',
    '申': '阳', '酉': '阴', '戌': '阳', '亥': '阴'
}

# ========== 数据存储 ==========
HISTORY_FILE = 'fortune_history.json'

def load_history():
    """加载历史查询记录"""
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    return []

def save_history(history):
    """保存历史查询记录"""
    with open(HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

# ========== 农历转换函数 ==========
def solar_to_lunar(year, month, day):
    """
    简化的公历转农历函数
    """
    lunar_data = [
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0,
        0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558,
        0x0b540, 0x0b6a0, 0x195a6, 0x095b0, 0x049b0, 0x0a4b8, 0x0a4b0, 0x0b27a
    ]
    
    base_date = datetime(1900, 1, 31)
    solar_date = datetime(year, month, day)
    days = (solar_date - base_date).days
    
    lunar_year = 1900
    lunar_month = 1
    lunar_day = 1
    
    for i in range(1900, 2100):
        year_days = 0
        leap_month = (lunar_data[i - 1900] & 0xf0000000) >> 20
        
        for j in range(1, 13):
            if j == leap_month:
                month_days = 29 if ((lunar_data[i - 1900] & (0x10000 >> j)) == 0) else 30
            else:
                month_days = 29 if ((lunar_data[i - 1900] & (0x20000 >> j)) == 0) else 30
            year_days += month_days
        
        if days <= year_days:
            lunar_year = i
            break
        days -= year_days
    
    leap_month = (lunar_data[lunar_year - 1900] & 0xf0000000) >> 20
    for j in range(1, 13):
        if j == leap_month:
            month_days = 29 if ((lunar_data[lunar_year - 1900] & (0x10000 >> j)) == 0) else 30
        else:
            month_days = 29 if ((lunar_data[lunar_year - 1900] & (0x20000 >> j)) == 0) else 30
        
        if days <= month_days:
            lunar_month = j
            lunar_day = days
            break
        days -= month_days
    
    return {'year': lunar_year, 'month': lunar_month, 'day': lunar_day}

# ========== 八字计算函数 ==========
def calculate_bazi(year, month, day, hour):
    """计算八字"""
    lunar = solar_to_lunar(year, month, day)
    
    # 年柱
    year_stem = HEAVEN_STEMS[(lunar['year'] - 1900 + 1) % 10]
    year_branch = EARTH_BRANCHES[(lunar['year'] - 1900) % 12]
    
    # 月柱
    month_idx = lunar['month']
    if month_idx > (lunar['year'] % 12):
        month_idx -= 1
    month_stem = HEAVEN_STEMS[(HEAVEN_STEMS.index(year_stem) + (month_idx - 1) * 2) % 10]
    month_branch = EARTH_BRANCHES[(month_idx + 1) % 12]
    
    # 日柱
    base_date = datetime(1900, 1, 1)
    current_date = datetime(lunar['year'], lunar['month'], lunar['day'])
    day_diff = (current_date - base_date).days
    
    day_stem = HEAVEN_STEMS[day_diff % 10]
    day_branch = EARTH_BRANCHES[day_diff % 12]
    
    # 时柱
    hour_stem = HEAVEN_STEMS[(HEAVEN_STEMS.index(day_stem) + hour * 2) % 10]
    hour_branch = EARTH_BRANCHES[hour % 12]
    
    return {
        'year': {'stem': year_stem, 'branch': year_branch},
        'month': {'stem': month_stem, 'branch': month_branch},
        'day': {'stem': day_stem, 'branch': day_branch},
        'hour': {'stem': hour_stem, 'branch': hour_branch}
    }

def calculate_elements(bazi):
    """计算五行统计"""
    elements = {'木': 0, '火': 0, '土': 0, '金': 0, '水': 0}
    
    for pillar in [bazi['year'], bazi['month'], bazi['day'], bazi['hour']]:
        stem_elem = STEM_ELEMENTS[pillar['stem']]
        branch_elem = BRANCH_ELEMENTS[pillar['branch']]
        elements[stem_elem] += 1
        elements[branch_elem] += 1
    
    return elements

# ========== 运势计算函数 ==========
def calculate_fortune(bazi, gender):
    """计算今日运势分数"""
    elements = calculate_elements(bazi)
    
    score = 50
    
    # 五行平衡度
    balance_score = 100 - (sum([abs(c - 1.6) for c in elements.values()]) * 8)
    score += (balance_score - 50) * 0.2
    
    # 日期因素
    today = datetime.now()
    lunar_factor = ((today.month * 3 + today.day) % 10 - 5) * 2
    score += lunar_factor
    
    # 性别因素
    if gender == 'male':
        score += (elements['火'] - elements['水']) * 2
    else:
        score += (elements['水'] - elements['火']) * 2
    
    return max(0, min(100, int(score)))

def calculate_wealth_fortune(bazi):
    """计算财运指数"""
    elements = calculate_elements(bazi)
    
    fortune = 50
    fortune += elements['金'] * 6
    fortune += elements['土'] * 4
    fortune -= elements['水'] * 2
    
    year_stem = bazi['year']['stem']
    if year_stem in ['庚', '辛']:
        fortune += 8
    
    return max(0, min(100, int(fortune)))

# ========== API 端点 ==========
@app.route('/', methods=['GET'])
def index():
    """返回主页"""
    return render_template('index.html')

@app.route('/api/calculate', methods=['POST'])
def calculate():
    """计算运势"""
    try:
        data = request.json
        
        # 解析输入
        birth_date = datetime.strptime(data['birthDate'], '%Y-%m-%d')
        hour = int(data['birthHour'])
        gender = data['gender']
        
        # 计算八字
        bazi = calculate_bazi(birth_date.year, birth_date.month, birth_date.day, hour)
        elements = calculate_elements(bazi)
        
        # 计算运势
        fortune_score = calculate_fortune(bazi, gender)
        wealth_fortune = calculate_wealth_fortune(bazi)
        
        # 生成建议
        advice = []
        if elements['火'] > 4:
            advice.append('火元素偏强，建议保持冷静')
        if elements['水'] > 4:
            advice.append('水元素偏强，适合灵活变通')
        if elements['金'] > 4:
            advice.append('金元素偏强，有利于财富积累')
        if elements['木'] > 4:
            advice.append('木元素偏强，适合创新发展')
        
        if not advice:
            advice = ['五行平衡，顺势而为']
        
        # 保存查询记录
        history = load_history()
        query_record = {
            'timestamp': datetime.now().isoformat(),
            'birth_date': data['birthDate'],
            'fortune': fortune_score,
            'wealth': wealth_fortune
        }
        history.append(query_record)
        if len(history) > 100:  # 仅保存最近100条
            history = history[-100:]
        save_history(history)
        
        return jsonify({
            'success': True,
            'bazi': bazi,
            'elements': elements,
            'fortune': fortune_score,
            'wealth': wealth_fortune,
            'advice': advice
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/history', methods=['GET'])
def get_history():
    """获取查询历史"""
    history = load_history()
    return jsonify(history[-20:])  # 返回最近20条

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """获取统计数据"""
    history = load_history()
    
    if not history:
        return jsonify({
            'total': 0,
            'avg_fortune': 0,
            'avg_wealth': 0
        })
    
    total = len(history)
    avg_fortune = sum([h['fortune'] for h in history]) / total
    avg_wealth = sum([h['wealth'] for h in history]) / total
    
    return jsonify({
        'total': total,
        'avg_fortune': round(avg_fortune, 1),
        'avg_wealth': round(avg_wealth, 1)
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)