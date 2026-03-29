import React, { useState } from 'react';
import { Signal } from '../types';

interface Props {
  signal: Signal;
  onBack: () => void;
}

const ResponseView: React.FC<Props> = ({ signal, onBack }) => {
  const [content, setContent] = useState('');
  const [isSealing, setIsSealing] = useState(false);

  const handleSeal = () => {
    setIsSealing(true);
    // 模拟 Web3 签名与上传 IPFS 的延迟
    setTimeout(() => {
      alert("回响已铭刻在链上。\nIPFS: Qm...Success");
      onBack();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#050508] animate-in fade-in duration-1000">
      {/* 顶部：母信号指引 */}
      <header className="p-12 text-center space-y-4">
        <p className="text-[#4A4560] text-[10px] tracking-[0.5em] uppercase">Responding to</p>
        <div className="max-w-2xl mx-auto opacity-60 italic text-sm text-[#C4B8E8]">{signal.hint}</div>
        <h2 className="text-xl font-serif text-[#C4A85A] italic">“{signal.question}”</h2>
      </header>

      {/* 写作区 */}
      <main className="flex-1 flex flex-col items-center px-6">
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="在这里写下你的回响..."
          className="w-full max-w-3xl flex-1 bg-transparent border-none focus:ring-0 text-lg leading-[2] text-[#E8E4F0] placeholder-[#4A4560] resize-none py-10"
        />
      </main>

      {/* 底部动作：封缄 */}
      <footer className="p-12 flex flex-col items-center gap-6 bg-gradient-to-t from-[#07070C] to-transparent">
        <button 
          onClick={handleSeal}
          disabled={!content || isSealing}
          className={`px-16 py-4 rounded-full border border-[#C4A85A]/30 tracking-[0.4em] uppercase text-[11px] transition-all duration-1000
            ${isSealing ? 'bg-[#C4A85A]/10 text-[#4A4560] animate-pulse' : 'text-[#C4A85A] hover:bg-[#C4A85A]/10 hover:shadow-[0_0_30px_rgba(196,168,90,0.2)]'}`}
        >
          {isSealing ? '铭刻中...' : '封缄 (Seal & Send)'}
        </button>
        <button onClick={onBack} className="text-[9px] uppercase tracking-[0.3em] text-[#4A4560] hover:text-[#C4B8E8] transition-colors">
          放弃并返回
        </button>
      </footer>
    </div>
  );
};

export default ResponseView;