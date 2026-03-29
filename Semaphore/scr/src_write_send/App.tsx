import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ComposePage } from './features/compose/ComposePage';
import { FloatingActionButton } from './features/compose/FloatingActionButton';

/**
 * 主布局组件
 * 包含全局 UI 元素（如浮动按钮）
 */
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // 在创建页面不显示浮动按钮
  const showFAB = location.pathname !== '/compose';

  return (
    <>
      {children}
      {showFAB && <FloatingActionButton />}
    </>
  );
};

/**
 * 首页组件（示例）
 */
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      {/* 顶部导航 */}
      <header className="
        sticky top-0 z-40
        bg-[#0F0F1A]/80
        backdrop-blur-md
        border-b border-[#1A1A2E]
      ">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#C4A85A]">
            Semaphore
          </h1>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-[#E8E4F0] transition-colors">
              发现
            </button>
            <button className="text-gray-400 hover:text-[#E8E4F0] transition-colors">
              我的
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* 欢迎/空状态 */}
        <div className="text-center space-y-6 py-20">
          <div className="
            w-32 h-32
            mx-auto
            bg-[#1A1A2E]
            rounded-full
            flex items-center justify-center
          ">
            <svg className="w-16 h-16 text-[#C4A85A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-[#E8E4F0]">
              还没有信号弹
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              点击右下角的 + 按钮，发出你的第一个信号弹<br/>
              在人群中寻找那些与你同频的人
            </p>
          </div>
        </div>

        {/* 示例：信号弹列表（空状态时隐藏） */}
        <div className="space-y-6 mt-12">
          <h3 className="text-lg font-medium text-[#9B7FD4]">
            热门信号弹
          </h3>
          {/* 这里会渲染信号弹卡片列表 */}
          <div className="text-center text-gray-600 py-8">
            加载中...
          </div>
        </div>
      </main>
    </div>
  );
};

/**
 * 主应用组件
 * 配置路由和全局布局
 */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {/* 首页路由 */}
          <Route path="/" element={<HomePage />} />
          
          {/* 信号弹创建页面路由 */}
          <Route path="/compose" element={<ComposePage />} />
          
          {/* 其他路由（示例） */}
          <Route path="/signal/:id" element={
            <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
              <p className="text-gray-500">信号弹详情页（待实现）</p>
            </div>
          } />
          
          <Route path="*" element={
            <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
              <p className="text-gray-500">404 - 页面未找到</p>
            </div>
          } />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

export default App;
