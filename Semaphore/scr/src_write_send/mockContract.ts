/**
 * 模拟智能合约交互功能
 * 在真实环境中，这里会使用 wagmi/viem 调用 Semaphore 智能合约
 */

import { SignalPost } from '../types';

/**
 * 模拟交易收据
 */
export interface TransactionReceipt {
  /** 交易哈希 */
  hash: string;
  /** 区块号 */
  blockNumber: number;
  /** Gas 使用量 */
  gasUsed: bigint;
  /** 交易状态 */
  status: 'success' | 'reverted';
  /** 时间戳 */
  timestamp: number;
}

/**
 * 生成模拟的交易哈希
 */
function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

/**
 * 模拟调用智能合约的 createVault 方法
 * 
 * @param hintCID 公开内容 CID
 * @param encryptedContentCID 加密内容 CID
 * @param tags 标签数组
 * @param author 作者钱包地址
 * @returns Promise<TransactionReceipt>
 */
export async function mockCreateVault(
  hintCID: string,
  encryptedContentCID: string,
  tags: string[],
  author: string
): Promise<TransactionReceipt> {
  console.log('=== 开始合约调用 ===');
  console.log(`[合约] 调用 createVault 方法`);
  console.log(`[合约] hintCID: ${hintCID}`);
  console.log(`[合约] encryptedContentCID: ${encryptedContentCID}`);
  console.log(`[合约] tags: [${tags.join(', ')}]`);
  console.log(`[合约] 发送者地址: ${author}`);

  // 模拟合约调用延迟（1.5-2.5秒）
  const delay = 1500 + Math.random() * 1000;
  await new Promise(resolve => setTimeout(resolve, delay));

  // 模拟交易确认
  console.log('[合约] 交易已提交，等待确认...');
  await new Promise(resolve => setTimeout(resolve, 500));

  const receipt: TransactionReceipt = {
    hash: generateTxHash(),
    blockNumber: Date.now(),
    gasUsed: BigInt(150000 + Math.floor(Math.random() * 50000)),
    status: 'success',
    timestamp: Date.now()
  };

  console.log('[合约] ✅ 交易成功！');
  console.log(`[合约] 交易哈希: ${receipt.hash}`);
  console.log(`[合约] Gas 使用: ${receipt.gasUsed.toString()}`);
  console.log('=== 合约调用完成 ===');

  return receipt;
}

/**
 * 模拟从合约读取信号弹信息
 * @param vaultId 信号弹 ID
 * @returns Promise<SignalPost | null>
 */
export async function mockGetVault(vaultId: number): Promise<SignalPost | null> {
  console.log(`[合约] 读取信号弹 vaultId: ${vaultId}`);
  
  const delay = 300 + Math.random() * 500;
  await new Promise(resolve => setTimeout(resolve, delay));

  // 模拟返回数据
  if (vaultId > 0) {
    return {
      hintCID: 'QmPub' + 'x'.repeat(42),
      encryptedContentCID: 'QmEnc' + 'y'.repeat(42),
      author: '0x' + 'a'.repeat(40),
      tags: ['孤独', '诗歌'],
      createdAt: Date.now() - 86400000,
      txHash: generateTxHash()
    };
  }

  return null;
}

/**
 * 模拟获取用户的信号弹列表
 * @param address 用户钱包地址
 * @returns Promise<SignalPost[]>
 */
export async function mockGetUserVaults(address: string): Promise<SignalPost[]> {
  console.log(`[合约] 获取用户 ${address} 的信号弹列表`);
  
  const delay = 500 + Math.random() * 500;
  await new Promise(resolve => setTimeout(resolve, delay));

  // 模拟返回数据
  return [
    {
      hintCID: 'QmPub111',
      encryptedContentCID: 'QmEnc111',
      author: address,
      tags: ['孤独', '迁徙'],
      createdAt: Date.now() - 172800000,
      txHash: generateTxHash()
    },
    {
      hintCID: 'QmPub222',
      encryptedContentCID: 'QmEnc222',
      author: address,
      tags: ['诗歌'],
      createdAt: Date.now() - 86400000,
      txHash: generateTxHash()
    }
  ];
}

/**
 * 模拟钱包连接状态
 * 在真实环境中，这会使用 wagmi 的 useAccount Hook
 */
export interface AccountState {
  address: string | null;
  isConnected: boolean;
  chainId?: number;
}

/**
 * 模拟获取当前连接的钱包账户
 * @returns Promise<AccountState>
 */
export async function mockGetAccount(): Promise<AccountState> {
  console.log('[Wallet] 检查钱包连接状态...');
  
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 200));

  // 返回模拟的连接状态
  // 在实际应用中，这里会检查真实钱包连接
  return {
    address: '0x' + '7'.repeat(40),
    isConnected: true,
    chainId: 1 // Ethereum Mainnet
  };
}
