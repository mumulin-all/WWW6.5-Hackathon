import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposeForm } from './ComposeForm';
import { ComposeFormData, PublishStatus } from './types';
import { mockUploadToIPFS } from './utils/mockIPFS';
import { mockCreateVault, mockGetAccount, AccountState } from './utils/mockContract';

/**
 * 信号弹创建页面
 * 整合表单组件，处理页面布局、路由、钱包连接状态和完整的发布流程
 */
export const ComposePage: React.FC = () => {
  const navigate = useNavigate();

  // 钱包连接状态
  const [account, setAccount] = useState<AccountState | null>(null);
  const [isCheckingWallet, setIsCheckingWallet] = useState(true);

  // 发布状态
  const [publishStatus, setPublishStatus] = useState<PublishStatus>(PublishStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // 初始化：检查钱包连接状态
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        setIsCheckingWallet(true);
        const accountState = await mockGetAccount();
        setAccount(accountState);
      } catch (err) {
        console.error('检查钱包连接失败:', err);
        setError('无法连接钱包，请刷新页面重试');
      } finally {
        setIsCheckingWallet(false);
      }
    };

    checkWalletConnection();
  }, []);

  /**
   * 处理表单提交和完整的发布流程
   */
  const handleSubmit = useCallback(async (formData: ComposeFormData) => {
    // 重置状态
    setError(null);
    setPublishStatus(PublishStatus.ENCRYPTING);

    try {
      // 第一步：检查钱包连接
      if (!account?.address) {
        throw new Error('请先连接钱包');
      }

      console.log('🚀 开始发布信号弹流程...');
      console.log('表单数据:', {
        hook: formData.hook.substring(0, 50) + '...',
        question: formData.question,
        contentLength: formData.content.length,
        tags: formData.tags
      });

      // 第二步：加密正文并上传到 IPFS
      setPublishStatus(PublishStatus.ENCRYPTING);
      const { hintCID, encryptedContentCID } = await mockUploadToIPFS(formData);

      // 第三步：调用智能合约创建 Vault
      setPublishStatus(PublishStatus.CONTRACT_CALL);
      const txReceipt = await mockCreateVault(
        hintCID,
        encryptedContentCID,
        formData.tags,
        account.address
      );

      console.log('✅ 信号弹发布成功！');
      console.log('交易收据:', txReceipt);

      // 显示成功状态
      setPublishStatus(PublishStatus.SUCCESS);
      setShowSuccess(true);

      // 1.5秒后自动跳转回首页（"安静地消失"）
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      console.error('发布失败:', err);
      setPublishStatus(PublishStatus.ERROR);
      setError(err instanceof Error ? err.message : '发布失败，请重试');
    }
  }, [account, navigate]);

  // 检查钱包状态中
  if (isCheckingWallet) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="
            w-12 h-12
            border-3 border-[#C4A85A] border-t-transparent
            rounded-full
            animate-spin
            mx-auto
          " />
          <p className="text-gray-400">正在检查钱包连接...</p>
        </div>
      </div>
    );
  }

  // 未连接钱包
  if (!account?.isConnected) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center p-6">
        <div className="
          max-w-md
          bg-[#1A1A2E] border border-[#2A2A4A]
          rounded-2xl p-8
          text-center
          space-y-6
        ">
          <div className="w-20 h-20 mx-auto bg-[#2A2A4A] rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-[#C4A85A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-[#E8E4F0]">需要连接钱包</h2>
            <p className="text-gray-400">请连接你的 Web3 钱包以发布信号弹</p>
          </div>
          <button
            onClick={() => {
              // 模拟连接钱包
              setAccount({
                address: '0x' + '7'.repeat(40),
                isConnected: true,
                chainId: 1
              });
            }}
            className="
              w-full
              py-3
              bg-[#C4A85A] hover:bg-[#D4B86A]
              text-[#0F0F1A] font-medium
              rounded-xl
              transition-all duration-300
            "
          >
            连接钱包
          </button>
        </div>
      </div>
    );
  }

  // 成功状态显示（"信号弹已升空！"）
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
        <div className="
          text-center
          animate-fade-in
          transition-opacity duration-1000
        ">
          <div className="
            w-24 h-24
            bg-[#C4A85A]/20
            rounded-full
            flex items-center justify-center
            mx-auto
            mb-6
          ">
            <svg className="w-12 h-12 text-[#C4A85A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-[#C4A85A] mb-2">
            信号弹已升空！
          </h2>
          <p className="text-gray-400">
            正在返回首页...
          </p>
        </div>
      </div>
    );
  }

  // 主编辑界面
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
          <button
            onClick={() => navigate(-1)}
            className="
              flex items-center gap-2
              text-gray-400 hover:text-[#C4A85A]
              transition-colors duration-300
            "
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="
              px-3 py-1.5
              bg-[#1A1A2E]
              rounded-lg
              flex items-center gap-2
            ">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">
                {account.address?.substring(0, 6)}...{account.address?.substring(-4)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* 页面标题 */}
        <div className="mb-10 text-center space-y-3">
          <h1 className="text-3xl font-bold text-[#E8E4F0]">
            发出你的信号弹
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            在人群中寻找同频者。公开部分吸引目光，私密部分等待知音。
          </p>
        </div>

        {/* 表单组件 */}
        <ComposeForm
          publishStatus={publishStatus}
          error={error}
          onSubmit={handleSubmit}
        />
      </main>

      {/* 自定义样式 - 淡入动画 */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};
