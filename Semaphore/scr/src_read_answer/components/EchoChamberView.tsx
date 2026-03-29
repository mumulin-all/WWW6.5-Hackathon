import React, { useState, useEffect, useRef } from 'react';
import { Signal } from '../types'; // 确保你有这个定义

interface Props {
  article: {
    id: string;
    title: string;
    content: string; // 真正的文章正文
  };
  onBack: () => void; // 用于关闭页面
  onFiredSignal: (motherSignal: Signal) => void; // 跳转到写引子和问题页
}

// 模拟的母信号，用于在发射信号弹时传递
const MOCK_MOTHER_SIGNAL: Signal = {
    id: 'art_001',
    author: '0xArticle...Author',
    hint: '这是文章的引子...',
    question: '文章衍生出的问题...',
    timestamp: '2026.04.01',
    type: 'mother'
};

// --- 动画阶段状态 ---
type Stage = 'floating' | 'exploding' | 'reading' | 'shaping' | 'sealing';

// --- 组件入口 ---
const EchoChamberView: React.FC<Props> = ({ article, onBack, onFiredSignal }) => {
  const [stage, setStage] = useState<Stage>('floating');
  const [isWriting, setIsWriting] = useState(false); // 读者是否在写阅后感
  const [sealType, setSealType] = useState<'悄悄送给作者' | '留在文章下' | '发射信号弹' | null>(null);

  // --- 1. 烟花炸开仪式 ---
  const handleBallClick = () => {
    setStage('exploding');
    // 烟花动画持续 1s 后，显示文章
    setTimeout(() => setStage('reading'), 1000);
  };

  // --- 2. 挽留机制与页面关闭逻辑 ---
  const [canClose, setCanClose] = useState(false); // 是否满足关闭条件
  const mainRef = useRef<HTMLElement>(null);

  // 读者正文读完跳到第六页，如果她不想写阅后感，自己关闭掉这个页面。
  const handleClosePage = () => {
      // 如果没有在写，或者读完了不想写，直接关闭
      if (!isWriting) {
          onBack();
      }
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#050508] overflow-hidden text-[#E8E4F0] animate-in fade-in duration-1000">
      
      {/* 顶部指示器：沙漏 (替代倒计时) */}
      {stage === 'reading' && (
          <div className="fixed top-12 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-60">
              <svg className="w-5 h-5 animate-spin-slow text-[#C4A85A]" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6l4 2"/>
              </svg>
              <span className="text-[10px] uppercase tracking-[0.3em] font-mono">Time as a Shimmer</span>
          </div>
      )}

      {/* 右上角关闭按钮 (不想写阅后感时自主关闭) */}
      {(stage === 'reading' || stage === 'shaping') && !isWriting && (
          <button onClick={handleClosePage} className="fixed top-12 right-12 z-50 text-[#4A4560] hover:text-[#C4B8E8] transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
          </button>
      )}

      {/* --- 第五页 & 第六页 状态渲染 --- */}
      {stage === 'floating' && (
        <FloatingBall onClick={handleBallClick} />
      )}

      {stage === 'exploding' && (
        <FireworkExplosion />
      )}

      {(stage === 'reading' || stage === 'shaping' || stage === 'sealing') && (
        <main ref={mainRef} className="relative w-full max-w-4xl h-screen flex flex-col p-12 overflow-y-auto space-y-20 animate-in fade-in duration-1000">
          
          {/* 文章正文 (陪着她，直到决定是否消失) */}
          <article className="prose prose-invert prose-lg leading-[2.2] text-[#E8E4F0]/90 italic font-light space-y-12">
            <h1 className="text-4xl font-serif text-center mb-16 not-italic font-bold tracking-wider">{article.title}</h1>
            {article.content.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
            ))}
          </article>

          {/* 底部：从第五页跳到第六页的视觉仪式 */}
          <div className="py-24 border-t border-white/5 space-y-10">
              <h3 className="text-xl font-serif italic text-[#C4A85A] text-center">阅后，你感到了什么回响？</h3>
              <p className="max-w-xl mx-auto text-sm text-[#4A4560] text-center font-light leading-relaxed">想到什么就写下来吧，不用完整，不用漂亮，她也想收到你的信号。</p>
          </div>

          {/* 第六页：写阅后感与流向选择 */}
          <ResponseArea 
            signal={MOCK_MOTHER_SIGNAL} 
            onWritingStatus={setIsWriting} 
            onSeal={(type) => {
                setSealType(type);
                setStage('sealing');
            }}
            onFiredSignal={() => onFiredSignal(MOCK_MOTHER_SIGNAL)}
          />

          {/* 封缄转场仪式 (纸鹤飞向远方 / 星星闪烁消失) */}
          {stage === 'sealing' && sealType && (
              <RitualSeal type={sealType} onComplete={onBack} />
          )}

        </main>
      )}
    </div>
  );
};


// --- 子组件 1: 漂浮的发光球 ---
const FloatingBall: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <div className="flex flex-col items-center gap-10 cursor-pointer group" onClick={onClick}>
        <div className="relative w-32 h-32 animate-bounce-slow">
            {/* 核心球体 */}
            <div className="absolute inset-0 rounded-full bg-[#07070C] border border-[#C4A85A]/40 transition-all group-hover:border-[#C4A85A]" />
            {/* 发光光晕 */}
            <div className="absolute inset-[-15px] rounded-full bg-[#C4A85A]/5 blur-xl group-hover:bg-[#C4A85A]/10 transition-all" />
        <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-[#C4A85A]/80 shadow-[0_0_20px_#C4A85A] animate-pulse" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.5em] text-[#C4A85A]/60 font-mono group-hover:text-[#C4A85A] transition-colors">You are Invited. Click to Unseal</p>
    </div>
);

// --- 子组件 2: 烟花爆炸 CSS 粒子特效 ---
const FireworkExplosion: React.FC = () => (
    <div className="relative w-2 h-2">
        {/* 爆炸中心 */}
        <div className="absolute inset-0 rounded-full bg-white animate-scale-out-fade opacity-0" />
        {/* 周围粒子 (模拟烟花，向四周炸开) */}
        {[...Array(12)].map((_, i) => (
            <div key={i} className={`absolute inset-0 w-1.5 h-1.5 rounded-full bg-[#C4A85A] animate-particles-${i}`} style={{ '--idx': i } as React.CSSProperties} />
        ))}
    </div>
);

// --- 子组件 3: 写阅后感与选择流向 ---
interface ResponseAreaProps {
    signal: Signal;
    onWritingStatus: (isWriting: boolean) => void;
    onSeal: (type: '悄悄送给作者' | '留在文章下' | '发射信号弹') => void;
    onFiredSignal: () => void;
}
const ResponseArea: React.FC<ResponseAreaProps> = ({ onWritingStatus, onSeal, onFiredSignal }) => {
    const [thought, setThought] = useState('');

    return (
        <div className="w-full max-w-3xl mx-auto space-y-16 pb-40">
            <textarea
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                onFocus={() => onWritingStatus(true)}
                onBlur={() => onWritingStatus(false)}
                placeholder="我的阅后感..."
                className="w-full min-h-[150px] bg-transparent border-none focus:ring-0 text-lg leading-[2] text-[#E8E4F0] placeholder-[#4A4560] resize-none p-0"
            />

            <div className="flex flex-col items-center gap-10">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#4A4560]">Where should this Echo float?</p>
                <div className="flex items-center gap-6">
                    <SealButton label="悄悄送给作者" onClick={() => onSeal('悄悄送给作者')} disabled={!thought} />
                    <SealButton label="留在文章下" onClick={() => onSeal('留在文章下')} disabled={!thought} />
                    {/* 发射信号弹的会跳转到写引子和问题的界面 */}
                    <SealButton label="发射出我的信号弹" onClick={onFiredSignal} disabled={!thought} />
                </div>
            </div>
        </div>
    );
};

// 通用封缄按钮
const SealButton: React.FC<{ label: string, onClick: () => void, disabled?: boolean }> = ({ label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}
        className="px-8 py-3.5 rounded-full border border-[#C4A85A]/30 text-[#C4A85A] text-[10px] uppercase tracking-[0.3em] transition-all duration-500
        disabled:border-[#4A4560]/20 disabled:text-[#4A4560] disabled:cursor-not-allowed
        hover:border-[#C4A85A] hover:bg-[#C4A85A]/10 hover:shadow-[0_0_20px_rgba(196,168,90,0.1)]">
        {label}
    </button>
);

// --- 子组件 4: 封缄转场仪式 (纸鹤与星星) ---
const RitualSeal: React.FC<{ type: '悄悄送给作者' | '留在文章下', onComplete: () => void }> = ({ type, onComplete }) => {
    useEffect(() => {
        // 仪式持续 2.5s 后，关闭页面
        const timer = setTimeout(onComplete, 2500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[250] flex flex-col items-center justify-center bg-[#050508]/90 backdrop-blur-sm animate-in fade-in duration-500">
            {type === '悄悄送给作者' && (
                <div className="animate-float-up-out flex flex-col items-center gap-6">
                    {/* SVG 纸鹤 (简单示意) */}
                    <svg className="w-20 h-20 text-[#C4A85A]/80" viewBox="0 0 100 100" fill="none">
                        <path d="M10 50L40 20L60 40L90 10L70 80L40 50L10 50Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M40 20L40 50" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
                    </svg>
                    <p className="text-[11px] uppercase tracking-[0.4em] text-[#C4A85A]/60">Floating to the Author</p>
                </div>
            )}
            {type === '留在文章下' && (
                <div className="animate-shimmer-fade-out flex flex-col items-center gap-6">
                    {/* 星星图标 */}
                    <svg className="w-16 h-16 animate-pulse text-[#C4A85A]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
                    </svg>
                    <p className="text-[11px] uppercase tracking-[0.4em] text-[#C4A85A]/60">Staying as a Star</p>
                </div>
            )}
        </div>
    );
};

// --- 动画 CSS 定义 (需要在 tailwind.config.js 扩展，或者直接放在 style 标签中) ---
// 为了保证单文件可用，我将其放在这里，建议最终移到 tailwind 配置中。
const styleTag = `
<style>
    /* 1. 缓慢漂浮 */
    @keyframes bounce-slow {
        0%, 100% { transform: translateY(-5px); }
        50% { transform: translateY(5px); }
    }
    .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }

    /* 2. 缓慢旋转 (沙漏) */
    @keyframes spin-slow {
        to { transform: rotate(360deg); }
    }
    .animate-spin-slow { animation: spin-slow 8s linear infinite; }

    /* 3. 烟花中心炸开淡出 */
    @keyframes scale-out-fade {
        0% { transform: scale(0.1); opacity: 1; }
        100% { transform: scale(5); opacity: 0; }
    }
    .animate-scale-out-fade { animation: scale-out-fade 0.8s ease-out; }

    /* 4. 粒子炸开动画 (通用核心) */
    @keyframes particle-fade {
        0% { transform: rotate(calc(var(--idx) * 30deg)) translateY(0px) scale(1); opacity: 1; }
        100% { transform: rotate(calc(var(--idx) * 30deg)) translateY(50px) scale(0); opacity: 0; }
    }
    [class^="animate-particles-"] { animation: particle-fade 1s ease-out forwards; }

    /* 5. 纸鹤向上飞出淡出 */
    @keyframes float-up-out {
        0% { transform: translateY(0px) scale(1); opacity: 1; }
        100% { transform: translateY(-100px) scale(0.8); opacity: 0; }
    }
    .animate-float-up-out { animation: float-up-out 2.5s ease-in forwards; }

    /* 6. 星星闪烁淡出 */
    @keyframes shimmer-fade-out {
        0% { transform: scale(1); opacity: 1; filter: brightness(1.2); }
        50% { transform: scale(1.1); opacity: 0.8; filter: brightness(1.5); }
        100% { transform: scale(0.9); opacity: 0; filter: brightness(1); }
    }
    .animate-shimmer-fade-out { animation: shimmer-fade-out 2.5s ease-out forwards; }
</style>
`;
if (typeof document !== 'undefined') {
    document.head.insertAdjacentHTML('beforeend', styleTag);
}

export default EchoChamberView;