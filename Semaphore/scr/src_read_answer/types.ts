export interface Signal {
  id: string;
  author: string;
  hint: string;     // 影子：引子内容
  question: string; // 问题：作者提问
  timestamp: string;
  blockHeight: string;
  ipfsHash: string;
  type: 'mother' | 'focused' | 'derived';
}