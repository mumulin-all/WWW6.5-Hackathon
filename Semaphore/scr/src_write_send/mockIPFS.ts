/**
 * 模拟 IPFS 上传功能
 * 在真实环境中，这里会调用 IPFS SDK 或 Web3.Storage 等服务
 */

import { ComposeFormData } from '../types';

/**
 * 生成模拟的 CID（Content Identifier）
 * 格式：Qm + 随机字符串（模拟真实的 IPFS CID 格式）
 */
function generateMockCID(prefix: string = 'Qm'): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomStr = '';
  for (let i = 0; i < 44; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}${randomStr}`;
}

/**
 * 模拟上传公开内容到 IPFS
 * @param content 公开内容（引子+问题）
 * @returns Promise<CID>
 */
export async function mockUploadPublicContent(content: {
  hook: string;
  question: string;
}): Promise<string> {
  console.log('[模拟 IPFS] 开始上传公开内容...');
  console.log('[模拟 IPFS] 内容预览:', {
    hook: content.hook.substring(0, 50) + '...',
    question: content.question.substring(0, 50) + '...'
  });

  // 模拟网络延迟（0.5-1.5秒）
  const delay = 500 + Math.random() * 1000;
  await new Promise(resolve => setTimeout(resolve, delay));

  const cid = generateMockCID('QmPub');
  console.log(`[模拟 IPFS] 公开内容上传成功！CID: ${cid}`);
  return cid;
}

/**
 * 模拟使用 Lit Protocol 加密并上传私密内容到 IPFS
 * 在真实环境中，这里会：
 * 1. 调用 Lit Protocol SDK 加密内容
 * 2. 将加密后的密文和元数据上传到 IPFS
 * @param content 私密正文内容
 * @returns Promise<CID>
 */
export async function mockEncryptAndUploadContent(content: string): Promise<string> {
  console.log('[模拟 Lit Protocol] 开始加密正文...');
  console.log(`[模拟 Lit Protocol] 正文长度: ${content.length} 字符`);

  // 模拟加密过程（1-2秒）
  const encryptDelay = 1000 + Math.random() * 1000;
  await new Promise(resolve => setTimeout(resolve, encryptDelay));

  console.log('[模拟 Lit Protocol] 正文加密完成！');
  console.log('[模拟 IPFS] 开始上传加密内容...');

  // 模拟上传过程（0.5-1秒）
  const uploadDelay = 500 + Math.random() * 500;
  await new Promise(resolve => setTimeout(resolve, uploadDelay));

  const cid = generateMockCID('QmEnc');
  console.log(`[模拟 IPFS] 加密内容上传成功！CID: ${cid}`);
  return cid;
}

/**
 * 完整的上传流程 - 同时上传公开内容和加密内容
 * @param formData 表单数据
 * @returns Promise<{ hintCID: string; encryptedContentCID: string }>
 */
export async function mockUploadToIPFS(formData: ComposeFormData): Promise<{
  hintCID: string;
  encryptedContentCID: string;
}> {
  console.log('=== 开始 IPFS 上传流程 ===');

  // 并行上传公开内容和加密内容
  const [hintCID, encryptedContentCID] = await Promise.all([
    mockUploadPublicContent({
      hook: formData.hook,
      question: formData.question
    }),
    mockEncryptAndUploadContent(formData.content)
  ]);

  console.log('=== IPFS 上传流程完成 ===');
  console.log(`公开内容 CID: ${hintCID}`);
  console.log(`加密内容 CID: ${encryptedContentCID}`);

  return {
    hintCID,
    encryptedContentCID
  };
}

/**
 * 模拟 IPFS 网关访问（用于后续读取内容）
 * @param cid IPFS CID
 * @returns Promise<string>
 */
export async function mockFetchFromIPFS(cid: string): Promise<string> {
  console.log(`[模拟 IPFS] 正在从 IPFS 获取内容: ${cid}`);
  
  const delay = 300 + Math.random() * 700;
  await new Promise(resolve => setTimeout(resolve, delay));

  return `[模拟 IPFS 返回的内容 for CID: ${cid}]`;
}
