import React, { useState, useRef, useCallback } from 'react';
import { ComposeFormData, PublishStatus, TagConfig } from './types';

/**
 * 预设标签配置
 */
const PRESET_TAGS: TagConfig[] = [
  { id: 'loneliness', label: '孤独', emoji: '🌙' },
  { id: 'migration', label: '迁徙', emoji: '🌊' },
  { id: 'work', label: '工作', emoji: '💼' },
  { id: 'love', label: '爱', emoji: '💫' },
  { id: 'insomnia', label: '失眠', emoji: '🌌' },
  { id: 'poetry', label: '诗歌', emoji: '✒️' },
  { id: 'growth', label: '成长', emoji: '🌱' },
  { id: 'memory', label: '记忆', emoji: '📷' }
];

interface ComposeFormProps {
  /** 提交状态 */
  publishStatus: PublishStatus;
  /** 错误信息 */
  error: string | null;
  /** 提交处理函数 */
  onSubmit: (data: ComposeFormData) => Promise<void>;
}

/**
 * 信号弹创建表单组件
 * 包含公开部分（引子、问题）、私密部分（正文）、标签选择和发布按钮
 */
export const ComposeForm: React.FC<ComposeFormProps> = ({
  publishStatus,
  error,
  onSubmit
}) => {
  // 表单状态
  const [hook, setHook] = useState('');
  const [question, setQuestion] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 正文内容区引用（用于富文本编辑）
  const contentRef = useRef<HTMLDivElement>(null);

  /**
   * 处理标签选择
   * 限制最多选择3个标签
   */
  const handleTagToggle = useCallback((tagId: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else if (prev.length < 3) {
        return [...prev, tagId];
      }
      // 超过3个时，移除最早选择的标签
      return [...prev.slice(1), tagId];
    });
  }, []);

  /**
   * 执行富文本编辑器命令
   */
  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  /**
   * 处理正文输入（支持富文本）
   */
  const handleContentInput = () => {
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };

  /**
   * 表单验证
   */
  const validateForm = (): string | null => {
    if (!hook.trim()) {
      return '请写下能吸引同频者的引子...';
    }
    if (hook.trim().length < 10) {
      return '引子太短了，再多写一点吧';
    }
    if (hook.trim().length > 200) {
      return '引子太长了，控制在200字以内';
    }
    if (!question.trim()) {
      return '请提出一个只有懂的人才能回答的问题';
    }
    if (question.trim().length < 5) {
      return '问题太短了';
    }
    if (question.trim().length > 100) {
      return '问题太长了，控制在100字以内';
    }
    if (!content.trim() || content === '<br>') {
      return '请写下你要分享的内容...';
    }
    if (selectedTags.length === 0) {
      return '请选择至少一个标签';
    }
    return null;
  };

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 如果正在发布，禁止重复提交
    if (publishStatus !== PublishStatus.IDLE) {
      return;
    }

    // 表单验证
    const validationError = validateForm();
    if (validationError) {
      alert(validationError); // 在实际项目中应使用更优雅的错误提示
      return;
    }

    // 提交数据
    const formData: ComposeFormData = {
      hook: hook.trim(),
      question: question.trim(),
      content: content.trim(),
      tags: selectedTags
    };

    await onSubmit(formData);
  };

  /**
   * 获取按钮文字
   */
  const getButtonText = () => {
    switch (publishStatus) {
      case PublishStatus.ENCRYPTING:
        return '加密中...';
      case PublishStatus.UPLOADING:
        return '上传中...';
      case PublishStatus.CONTRACT_CALL:
        return '发射中...';
      default:
        return '发出信号弹';
    }
  };

  const isPublishing = publishStatus !== PublishStatus.IDLE;
  const canSubmit = !isPublishing;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 公开部分 - 引子 */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#9B7FD4]">
          🌟 公开引子
        </label>
        <textarea
          value={hook}
          onChange={(e) => setHook(e.target.value)}
          placeholder="写下能吸引同频者的第一束光..."
          className="
            w-full
            px-5 py-4
            bg-[#1A1A2E] border border-[#2A2A4A]
            rounded-xl
            text-[#E8E4F0] placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-[#C4A85A] focus:border-transparent
            transition-all duration-300
            resize-none
          "
          rows={3}
          maxLength={200}
          disabled={isPublishing}
        />
        <div className="text-right text-xs text-gray-500">
          {hook.length} / 200
        </div>
      </div>

      {/* 公开部分 - 问题 */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#9B7FD4]">
          ❓ 秘密问题
        </label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="提出一个只有懂的人才能回答的问题..."
          className="
            w-full
            px-5 py-4
            bg-[#1A1A2E] border border-[#2A2A4A]
            rounded-xl
            text-[#E8E4F0] placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-[#C4A85A] focus:border-transparent
            transition-all duration-300
          "
          maxLength={100}
          disabled={isPublishing}
        />
        <div className="text-right text-xs text-gray-500">
          {question.length} / 100
        </div>
      </div>

      {/* 私密部分 - 正文（富文本编辑器） */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#9B7FD4]">
          🔒 私密正文
        </label>

        {/* 富文本工具栏 */}
        <div className="flex flex-wrap gap-2 px-2">
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', 'h2')}
            className="
              px-3 py-1.5
              text-xs
              bg-[#1A1A2E] border border-[#2A2A4A]
              rounded-lg
              text-gray-400 hover:text-[#C4A85A]
              hover:border-[#C4A85A]
              transition-all duration-200
              disabled:opacity-50
            "
            disabled={isPublishing}
            title="标题"
          >
            H
          </button>
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            className="
              px-3 py-1.5
              text-xs font-bold
              bg-[#1A1A2E] border border-[#2A2A4A]
              rounded-lg
              text-gray-400 hover:text-[#C4A85A]
              hover:border-[#C4A85A]
              transition-all duration-200
              disabled:opacity-50
            "
            disabled={isPublishing}
            title="加粗"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            className="
              px-3 py-1.5
              text-xs italic
              bg-[#1A1A2E] border border-[#2A2A4A]
              rounded-lg
              text-gray-400 hover:text-[#C4A85A]
              hover:border-[#C4A85A]
              transition-all duration-200
              disabled:opacity-50
            "
            disabled={isPublishing}
            title="斜体"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            className="
              px-3 py-1.5
              text-xs
              bg-[#1A1A2E] border border-[#2A2A4A]
              rounded-lg
              text-gray-400 hover:text-[#C4A85A]
              hover:border-[#C4A85A]
              transition-all duration-200
              disabled:opacity-50
            "
            disabled={isPublishing}
            title="无序列表"
          >
            • 列表
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            className="
              px-3 py-1.5
              text-xs
              bg-[#1A1A2E] border border-[#2A2A4A]
              rounded-lg
              text-gray-400 hover:text-[#C4A85A]
              hover:border-[#C4A85A]
              transition-all duration-200
              disabled:opacity-50
            "
            disabled={isPublishing}
            title="有序列表"
          >
            1. 列表
          </button>
        </div>

        {/* 富文本编辑区 */}
        <div
          ref={contentRef}
          contentEditable={!isPublishing}
          onInput={handleContentInput}
          className="
            w-full
            min-h-[300px]
            px-5 py-4
            bg-[#1A1A2E] border border-[#2A2A4A]
            rounded-xl
            text-[#E8E4F0]
            focus:outline-none focus:ring-2 focus:ring-[#C4A85A] focus:border-transparent
            transition-all duration-300
            empty:before:content-[attr(placeholder)]
            empty:before:text-gray-500
          "
          placeholder="写下你要分享的内容...将被加密后发送"
          style={{ wordBreak: 'break-word' }}
        />
      </div>

      {/* 标签选择 */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#9B7FD4]">
          🏷️ 选择标签（1-3个）
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagToggle(tag.id)}
                className={`
                  px-4 py-2
                  rounded-full
                  text-sm
                  transition-all duration-300
                  disabled:opacity-50
                  ${
                    isSelected
                      ? 'bg-[#C4A85A] text-[#0F0F1A] font-medium shadow-lg'
                      : 'bg-[#1A1A2E] text-gray-400 hover:text-[#C4A85A] border border-[#2A2A4A] hover:border-[#C4A85A]'
                  }
                `}
                disabled={isPublishing}
              >
                {tag.emoji} {tag.label}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-gray-500">
          已选择: {selectedTags.length} / 3
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="
          p-4
          bg-red-900/20 border border-red-800/50
          rounded-xl
          text-red-300 text-sm
        ">
          ⚠️ {error}
        </div>
      )}

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={!canSubmit}
        className={`
          w-full
          py-4
          rounded-xl
          text-lg font-medium
          transition-all duration-300
          ${
            canSubmit
              ? 'bg-[#C4A85A] hover:bg-[#D4B86A] text-[#0F0F1A] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {getButtonText()}
      </button>

      {/* 提示信息 */}
      <div className="text-center text-xs text-gray-600">
        💡 公开部分所有人可见，私密部分将被加密，只有回答正确问题的读者才能解锁阅读
      </div>
    </form>
  );
};
