'use client';
import { useState } from 'react';

export default function Mine() {
  const [text, setText] = useState('');
  const [ores, setOres] = useState([
    { id: 1, title: '学习 Solidity 3 天', dimension: '技术', score: 80 },
  ]);

  const handleSubmit = () => {
    const newOre = {
      id: ores.length + 1,
      title: text.slice(0, 20) + '...',
      dimension: '智慧',
      score: 75,
    };
    setOres([...ores, newOre]);
    setText('');
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold">🔨 灵光采集</h1>
      <div className="mt-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800"
          placeholder="记录今天的成长..."
          rows={4}
        />
        <button
          onClick={handleSubmit}
          className="mt-3 bg-purple-600 py-2 px-4 rounded-lg"
        >
          提炼矿石
        </button>
      </div>
      <div className="mt-8">
        <h2 className="text-lg">你的矿石</h2>
        <div className="mt-2 space-y-2">
          {ores.map((ore) => (
            <div key={ore.id} className="p-3 bg-gray-800 rounded-lg">
              {ore.title}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
