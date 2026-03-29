// 定义信号弹相关的TypeScript接口和类型

/**
 * 信号弹发布表单数据结构
 */
export interface ComposeFormData {
  /** 公开引子 - 吸引读者的第一束光 */
  hook: string;
  /** 问题 - 只有懂的人才能回答的问题 */
  question: string;
  /** 私密正文 - 需要加密的文章内容 */
  content: string;
  /** 选中的标签（1-3个） */
  tags: string[];
}

/**
 * 信号弹完整数据结构
 */
export interface SignalPost {
  /** 公开内容CID */
  hintCID: string;
  /** 加密正文CID */
  encryptedContentCID: string;
  /** 作者钱包地址 */
  author: string;
  /** 标签数组 */
  tags: string[];
  /** 创建时间戳 */
  createdAt: number;
  /** 交易哈希 */
  txHash?: string;
}

/**
 * 发布状态枚举
 */
export enum PublishStatus {
  IDLE = 'idle',
  ENCRYPTING = 'encrypting',
  UPLOADING = 'uploading',
  CONTRACT_CALL = 'contract_call',
  SUCCESS = 'success',
  ERROR = 'error'
}

/**
 * 发布错误类型
 */
export interface PublishError {
  code: string;
  message: string;
}

/**
 * 预设标签配置
 */
export interface TagConfig {
  id: string;
  label: string;
  emoji?: string;
}
