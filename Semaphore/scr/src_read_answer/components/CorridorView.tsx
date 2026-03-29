import React, { useState, useEffect, useRef } from 'react';
import { Signal } from '../types';

interface Props {
  signals: Signal[];
  onResponse: (s: Signal) => void;
}

const CorridorView: React.FC<Props> = ({ signals, onResponse }) => {
  const [hasMoved, setHasMoved] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [proximityId, setProximityId] = useState<string | null>(null);

  // 视线追踪逻辑
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hasMoved) setHasMoved(true);
    
    let closestId = null;
    let minDistance = 300;

    signals.forEach(s => {
      const el = document.getElementById(`card-${s.id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(e.clientY - (rect.top + rect.height / 2));
        if (distance < minDistance) {
          minDistance = distance;
          closestId = s.id;
        }
      }
    });
    setProximityId(closestId);
  };

  return (
    <div className="relative w-full py-32" onMouseMove={handleMouseMove}>
      {/* 琥珀色生命线 */}
      <div className="fixed left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#C4A85A]/30 to-transparent shadow-[0_0_15px_rgba(196,168,90,0.1)]" />

      <div className="relative mx-auto max-w-xl px-6 space-y-24">
        {signals.map((s) => {
          // 判断当前卡片是否亮起
          const isInitial = !hasMoved && s.type === 'focused';
          const isActive = isInitial || hoveredId === s.id || proximityId === s.id;

          return (
            <section 
              key={s.id} 
              id={`card-${s.id}`}
              className="group relative transition-all duration-700"
              onMouseEnter={() => setHoveredId(s.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* 外置连接点 */}
              <div className={`absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-[#07070C] z-10 transition-all duration-700 
                ${isActive ? 'border-[#C4A85A] shadow-[0_0_15px_#C4A85A]' : 'border-[#C4A85A]/20'}`}>
                <div className={`absolute inset-0 m-auto h-1 w-1 rounded-full transition-all duration-700 
                  ${isActive ? 'bg-[#C4A85A]' : 'bg-[#C4A85A]/30'}`} />
              </div>

              {/* 卡片内容 */}
              <div 
                onClick={() => onResponse(s)}
                className={`ml-auto w-[90%] cursor-pointer rounded-[2.5rem] border p-10 backdrop-blur-md transition-all duration-700
                ${isActive ? 'opacity-100 border-[#C4A85A]/30 bg-[#C4A85A]/5 -translate-y-1' : 'opacity-40 border-white/10 bg-white/[0.02]'}`}
              >
                <div className="mb-4 flex justify-between text-[10px] font-mono tracking-widest text-[#4A4560]">
                  <span className={isActive ? 'text-[#C4B8E8]' : ''}>{s.author} ({s.type === 'mother' ? '母' : s.type === 'focused' ? '焦点' : '衍生'})</span>
                  <span>{s.timestamp}</span>
                </div>
                <p className="mb-8 text-lg italic font-light leading-relaxed">{s.hint}</p>
                <div className="rounded-2xl border border-white/5 bg-black/40 p-6">
                  <p className={`text-sm font-serif italic transition-colors duration-700 ${isActive ? 'text-[#C4A85A]' : 'text-[#C4A85A]/40'}`}>
                    问：{s.question}
                  </p>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default CorridorView;