"use client";

import { useState, useRef } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{cid: string, url: string, name: string} | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setText("");
      if (selected.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(selected);
      } else {
        setPreview("");
      }
    }
  };

  const handleUpload = async () => {
    if (!file && !text.trim()) {
      alert("请选择文件或输入文字");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (text) formData.append("text", text);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult(data);
    } catch (err) {
      alert("上传失败: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("已复制到剪贴板");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">IPFS 上传测试</h1>
        <p className="text-gray-600 mb-8">上传文件或文字到 Pinata，返回 CID 供合约使用</p>

        {/* 文件上传区域 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <input
              type="file"
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,text/*,.pdf,.doc,.docx"
            />
            <div className="text-4xl mb-2">📁</div>
            <p className="text-gray-600 font-medium">点击选择文件</p>
            <p className="text-sm text-gray-400 mt-1">支持图片、文档等任意文件</p>
          </div>

          {file && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-gray-700">📎 {file.name}</span>
              <button 
                onClick={() => {setFile(null); setPreview("");}}
                className="text-red-500 text-sm hover:underline"
              >
                清除
              </button>
            </div>
          )}
        </div>

        {/* 图片预览 */}
        {preview && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">图片预览</h3>
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
              <img src={preview} alt="预览" className="w-full h-full object-contain" />
            </div>
          </div>
        )}

        {/* 文字输入 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">或输入文字内容</h3>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setFile(null);
              setPreview("");
            }}
            placeholder="输入文字会自动保存为 .txt 文件上传到 IPFS..."
            className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={!!file}
          />
          {text && (
            <div className="mt-2 text-right text-sm text-gray-400">
              {text.length} 字符
            </div>
          )}
        </div>

        {/* 上传按钮 */}
        <button
          onClick={handleUpload}
          disabled={uploading || (!file && !text.trim())}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
            uploading || (!file && !text.trim())
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl"
          }`}
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              上传中...
            </span>
          ) : (
            "🚀 上传到 IPFS"
          )}
        </button>

        {/* 结果展示 */}
        {result && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-bold text-green-600 mb-4 flex items-center gap-2">
              ✅ 上传成功
            </h3>
            
            <div className="space-y-4">
              {/* CID */}
              <div className="bg-gray-50 rounded-lg p-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">CID（给合约）</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 text-sm bg-white p-2 rounded border break-all font-mono text-gray-800">
                    {result.cid}
                  </code>
                  <button 
                    onClick={() => copyToClipboard(result.cid)}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                  >
                    复制
                  </button>
                </div>
              </div>

              {/* URL */}
              <div className="bg-gray-50 rounded-lg p-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">访问链接（前端展示）</label>
                <div className="flex items-center gap-2 mt-1">
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 text-sm text-blue-600 hover:underline break-all"
                  >
                    {result.url}
                  </a>
                  <button 
                    onClick={() => copyToClipboard(result.url)}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                  >
                    复制
                  </button>
                </div>
              </div>

              {/* 合约格式 */}
              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                <label className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">合约调用格式</label>
                <code className="block mt-1 text-sm font-mono text-indigo-800">
                  ipfs://{result.cid}
                </code>
                <button 
                  onClick={() => copyToClipboard(`ipfs://${result.cid}`)}
                  className="mt-2 text-xs px-2 py-1 bg-indigo-200 text-indigo-800 rounded hover:bg-indigo-300"
                >
                  复制 ipfs:// 格式
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}