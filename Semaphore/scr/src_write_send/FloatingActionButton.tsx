import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 浮动动作按钮组件
 * 位于应用右下角，点击后导航至信号弹创建页面
 */
export const FloatingActionButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    // 使用平滑的过渡效果跳转到创建页面
    navigate('/compose');
  };

  return (
    <button
      onClick={handleClick}
      className="
        fixed bottom-8 right-8
        w-16 h-16
        bg-[#C4A85A] hover:bg-[#D4B86A]
        rounded-full
        flex items-center justify-center
        shadow-lg hover:shadow-xl
        transform hover:scale-110
        transition-all duration-300 ease-out
        group
        z-50
        focus:outline-none focus:ring-2 focus:ring-[#C4A85A] focus:ring-offset-2 focus:ring-offset-[#0F0F1A]
      "
      aria-label="创建信号弹"
    >
      {/* + 号图标 */}
      <svg
        className="
          w-8 h-8
          text-[#0F0F1A]
          transform
          transition-transform duration-300
          group-hover:rotate-90
        "
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>

      {/* 悬停时的提示文字 */}
      <span className="
        absolute right-20
        px-4 py-2
        bg-[#0F0F1A] text-[#C4A85A]
        text-sm
        rounded-lg
        whitespace-nowrap
        opacity-0 group-hover:opacity-100
        transform translate-x-4 group-hover:translate-x-0
        transition-all duration-300
        pointer-events-none
      ">
        发出信号弹
      </span>
    </button>
  );
};
