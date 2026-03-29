import React, { useState, useEffect } from 'react';
import CorridorView from './components/CorridorView';
import ResponseView from './components/ResponseView';
import { Signal } from './types';

// 模拟数据
const MOCK_SIGNALS: Signal[] = [
  { id: '1', author: '0x7D2...E81A', hint: '世界是一场巨大的共振，我们只是在寻找那个相同的频率。', question: '你上次感到‘被听见’是什么时候？', timestamp: '2026.03.20', blockHeight: '842001', ipfsHash: 'QmXy...1a', type: 'mother' },
  { id: '2', author: '0x3F1...92BC', hint: '我也曾有过这种感觉，像是被调到了另一个频率，能看到所有人，却没人能听见我。', question: '如果你的声音能穿越时空，你最想对那个孤独的自己说什么？', timestamp: '2026.03.27', blockHeight: '842091', ipfsHash: 'QmXy...7z2P', type: 'focused' },
  { id: '3', author: '0x9A2...C412', hint: '或许孤独不是缺失，而是一种未被察觉的饱满。', question: '你如何定义你的‘完整’？', timestamp: '2026.03.28', blockHeight: '842115', ipfsHash: 'QmXy...c4', type: 'derived' },
];

const App: React.FC = () => {
  const [view, setView] = useState<'corridor' | 'response'>('corridor');
  const [activeSignal, setActiveSignal] = useState<Signal | null>(null);

  const handleEnterResponse = (signal: Signal) => {
    setActiveSignal(signal);
    setView('response');
  };

  return (
    <div className="min-h-screen bg-[#07070C] text-[#E8E4F0] selection:bg-[#C4A85A]/30 transition-colors duration-1000">
      {view === 'corridor' ? (
        <CorridorView signals={MOCK_SIGNALS} onResponse={handleEnterResponse} />
      ) : (
        activeSignal && <ResponseView signal={activeSignal} onBack={() => setView('corridor')} />
      )}
    </div>
  );
};

export default App;