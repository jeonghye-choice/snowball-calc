import React, { useState, useEffect } from 'react';
import { Trash2, Plus, TrendingDown, DollarSign, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [subs, setSubs] = useState([
    { id: 1, name: '넷플릭스', cost: 17000 },
    { id: 2, name: '스포티파이', cost: 10900 }
  ]);
  const [returnRate, setReturnRate] = useState(8); // S&P 500 average

  const addSub = () => {
    setSubs([...subs, { id: Date.now(), name: '', cost: 0 }]);
  };

  const removeSub = (id) => {
    setSubs(subs.filter(s => s.id !== id));
  };

  const updateSub = (id, field, value) => {
    setSubs(subs.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const monthlyTotal = subs.reduce((acc, curr) => acc + (parseFloat(curr.cost) || 0), 0);
  
  const getMBTI = () => {
    if (monthlyTotal === 0) return { title: "절약의 신", desc: "구독료가 0원?! 혹시 산속에서 도를 닦으시나요? 대단한 자제력입니다.", icon: "💎" };
    if (monthlyTotal > 100000) return { title: "구독료 하이에나", desc: "돈이 새어나가는 소리가 들려요! 숨만 쉬어도 나가는 돈이 너무 많습니다.", icon: "🐺" };
    if (subs.length >= 5) return { title: "넷플릭스 기부천사", desc: "다 보지도 못하는 OTT들이 울고 있어요. 구독 다이어트가 시급합니다.", icon: "👼" };
    if (monthlyTotal < 30000) return { title: "알뜰살뜰 자산가", desc: "꼭 필요한 것만 구독하시는군요. 미래의 부자가 될 자질이 충분합니다.", icon: "💰" };
    return { title: "평범한 현대인", desc: "남들 하는 만큼은 구독 중! 하지만 조금만 줄여도 눈덩이는 더 커질 거예요.", icon: "🏠" };
  };

  const mbti = getMBTI();

  // Future Value Calculation (Compound Interest)
  const calculateFV = (monthly, years, rate) => {
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return monthly * n;
    return monthly * ((Math.pow(1 + r, n) - 1) / r);
  };

  const tenYearValue = calculateFV(monthlyTotal, 10, returnRate);
  const thirtyYearValue = calculateFV(monthlyTotal, 30, returnRate);

  return (
    <div className="container">
      <header>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-text"
        >
          Subscription Snowball
        </motion.h1>
        <p>현명한 지출이 부의 지름길입니다.</p>
      </header>

      <div className="main-grid">
        <section className="input-section glass">
          <h2 style={{ marginBottom: '1.5rem' }}>구독 항목 관리</h2>
          <AnimatePresence>
            {subs.map((sub) => (
              <motion.div 
                key={sub.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="subscription-item"
              >
                <input 
                  type="text" 
                  placeholder="플랫폼 이름"
                  value={sub.name}
                  onChange={(e) => updateSub(sub.id, 'name', e.target.value)}
                  style={{ flex: 2 }}
                />
                <input 
                  type="number" 
                  placeholder="금액"
                  value={sub.cost}
                  onChange={(e) => updateSub(sub.id, 'cost', e.target.value)}
                  style={{ flex: 1 }}
                />
                <button 
                  onClick={() => removeSub(sub.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <button className="btn-add" onClick={addSub}>
            <Plus size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            항목 추가
          </button>

          <div style={{ marginTop: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              예상 연 수익률 (%) - (S&P 500 평균: 8%)
            </label>
            <input 
              type="number"
              value={returnRate}
              onChange={(e) => setReturnRate(e.target.value)}
              style={{ width: '100px' }}
            />
          </div>
        </section>

        <section className="output-section glass">
          <div className="result-card">
            <h3 style={{ color: '#ef4444' }}>🔥 매달 버려지는 돈</h3>
            <div className="result-value danger-text shiver">
              {monthlyTotal.toLocaleString()}원
            </div>
            <p style={{ fontWeight: 'bold' }}>1년이면 무려 { (monthlyTotal * 12).toLocaleString() }원입니다.</p>
          </div>

          <motion.div 
            className="result-card"
            style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(99, 102, 241, 0.05)' }}
            key={monthlyTotal}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <TrendingDown size={32} style={{ color: '#6366f1', marginBottom: '1rem' }} />
            <h3 style={{ color: '#94a3b8' }}>😱 10년 뒤 잃게 될 기회비용</h3>
            <div className="result-value gradient-text" style={{ fontSize: '3.2rem' }}>
              {Math.round(tenYearValue).toLocaleString()}원
            </div>
            <p>이 돈이면 <strong>테슬라 주식</strong>을 몇 주 살 수 있었을까요?</p>
          </motion.div>

          <div className="result-card" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ color: '#94a3b8' }}>💀 30년 뒤 '은퇴 파쇄기'</h3>
            <div className="result-value" style={{ color: '#a855f7', opacity: 0.8 }}>
              {Math.round(thirtyYearValue).toLocaleString()}원
            </div>
            <p>당신의 노후 자금이 살살 녹고 있습니다.</p>
          </div>
        </section>
      </div>

      <motion.section 
        className="result-card glass" 
        style={{ marginTop: '2rem', textAlign: 'center', padding: '3rem' }}
        key={mbti.title}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{mbti.icon}</div>
        <h2 style={{ marginBottom: '0.5rem' }}>나의 지출 MBTI: <span className="gradient-text">{mbti.title}</span></h2>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>{mbti.desc}</p>
        <button 
          onClick={() => alert('결과를 복사했습니다! SNS에 공유해보세요.')}
          style={{ marginTop: '1.5rem', padding: '0.5rem 1.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50px', color: 'white', cursor: 'pointer' }}
        >
          결과 공유하기 🔗
        </button>
      </motion.section>

      <section className="monetization-banner glass">
        <DollarSign size={40} style={{ color: '#22c55e', marginBottom: '1rem' }} />
        <h3>아낀 돈, 더 똑똑하게 굴리는 법</h3>
        <p>구독료 지불 시 캐시백 혜택이 가장 큰 체크카드들을 확인해 보세요.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
          <a 
            href="https://www.card-gorilla.com/chart/top100?cate=CHECK" 
            className="buy-button" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ background: '#6366f1', color: 'white' }}
          >
            인기 체크카드 TOP 10 <ExternalLink size={16} />
          </a>
          <a 
            href="https://qr.kakaopay.com/FO8AavTcU" 
            className="buy-button" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ background: '#FEE500', color: '#000', fontWeight: '800' }}
          >
            대기업 구독할 바엔 나한테 후원하기 💸
          </a>
        </div>
      </section>
      
      <footer style={{ marginTop: '4rem', textAlign: 'center', color: '#4b5563', fontSize: '0.8rem' }}>
        © 2026 Subscription Snowball Calculator. Built for your financial freedom.
      </footer>
    </div>
  );
}

export default App;
