import { useState } from "react";

// 合约返回的数据结构（根据你们的合约调整）
interface CheckInRecord {
  timestamp: number;      // 打卡时间戳（秒或毫秒）
  cid: string;            // IPFS CID
  // 可能还有其他字段...
}

// 最终合并的数据
interface ExportRecord {
  date: string;           // 格式化时间 2024-03-30 14:30
  timestamp: number;      // 原始时间戳
  cid: string;            // IPFS CID
  content: string;        // 从 IPFS 取回的心情内容
  mood?: string;          // 如果有心情标签（开心/难过等）
}

interface UseExportReturn {
  exportData: () => Promise<void>;
  loading: boolean;
  progress: number;       // 导出进度 0-100
  error: string | null;
}

export function useExportData(
  contract: any,           // 合约实例（ethers/web3）
  userAddress: string
): UseExportReturn {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // 从 IPFS 网关获取内容
  const fetchIPFSContent = async (cid: string): Promise<string> => {
    const gateway = process.env.NEXT_PUBLIC_GATEWAY_URL || "gateway.pinata.cloud";
    const url = `https://${gateway}/ipfs/${cid}`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error(`获取 ${cid} 失败`);
    return await res.text();
  };

  const exportData = async () => {
    try {
      setLoading(true);
      setProgress(0);
      setError(null);

      // Step 1: 从合约读取用户的所有打卡记录
      // 根据你们的合约调整这个调用
      const records: CheckInRecord[] = await contract.getUserCheckIns(userAddress);
      // 或者：await contract.checkIns(userAddress, index) 循环读取
      
      if (!records || records.length === 0) {
        alert("暂无打卡记录");
        return;
      }

      // Step 2: 并行获取所有 IPFS 内容（带进度）
      const total = records.length;
      const exportData: ExportRecord[] = [];

      // 分批并行，避免同时请求太多
      const batchSize = 5;
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        
        const batchResults = await Promise.all(
          batch.map(async (record) => {
            try {
              const content = await fetchIPFSContent(record.cid);
              return {
                date: new Date(record.timestamp * 1000).toLocaleString("zh-CN"),
                timestamp: record.timestamp,
                cid: record.cid,
                content: content,
              };
            } catch (err) {
              return {
                date: new Date(record.timestamp * 1000).toLocaleString("zh-CN"),
                timestamp: record.timestamp,
                cid: record.cid,
                content: `[获取失败: ${(err as Error).message}]`,
              };
            }
          })
        );

        exportData.push(...batchResults);
        setProgress(Math.min(((i + batch.length) / total) * 100, 100));
      }

      // Step 3: 生成下载文件
      const exportJson = {
        userAddress,
        exportTime: new Date().toISOString(),
        totalRecords: exportData.length,
        data: exportData,
      };

      // 创建 Blob 并下载
      const blob = new Blob([JSON.stringify(exportJson, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `打卡记录_${userAddress.slice(0, 6)}_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`成功导出 ${exportData.length} 条记录`);

    } catch (err) {
      setError((err as Error).message);
      alert("导出失败: " + (err as Error).message);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return { exportData, loading, progress, error };
}