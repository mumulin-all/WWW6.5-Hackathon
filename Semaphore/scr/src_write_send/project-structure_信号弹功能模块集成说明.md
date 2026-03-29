# Semaphore - 信号弹功能模块集成说明

## 📦 完整文件结构

```
src/
├── App.tsx                                      # 主应用入口 + 路由配置
└── features/
    └── compose/                                # 信号弹创建功能模块
        ├── types.ts                            # TypeScript 类型定义
        ├── ComposePage.tsx                     # 创建页面主组件
        ├── ComposeForm.tsx                     # 表单组件（核心编辑器）
        ├── FloatingActionButton.tsx            # + 浮动按钮组件
        └── utils/
            ├── mockIPFS.ts                      # IPFS 上传模拟
            └── mockContract.ts                  # 智能合约调用模拟
```

---

## 🚀 快速集成步骤

### 1. 安装依赖

确保项目已安装以下依赖：

```bash
npm install react react-dom react-router-dom
npm install -D typescript @types/react @types/react-dom
```

如需 Tailwind CSS，按官方文档配置即可。

### 2. 将文件复制到项目

将 `src/features/compose/` 目录完整复制到你的项目中。

### 3. 配置路由

在 `App.tsx` 中（或你的主路由文件），引入并配置路由：

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ComposePage } from './features/compose/ComposePage';
import { FloatingActionButton } from './features/compose/FloatingActionButton';
import { useLocation } from 'react-router-dom';

// 创建布局包裹组件
const AppLayout = ({ children }) => {
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

// 配置路由
const App = () => {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/compose" element={<ComposePage />} />
          {/* 其他路由... */}
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};
```

### 4. 在主布局中添加浮动按钮

在应用的**主布局组件**（如 `Layout.tsx` 或直接在 `App.tsx`）的右下角位置添加 `FloatingActionButton` 组件：

```tsx
import { FloatingActionButton } from './features/compose/FloatingActionButton';

// 在你的布局组件中
const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      {children}
      <FloatingActionButton />
    </div>
  );
};
```

---

## 🎨 设计规范说明

### 色彩系统
- **背景色**: `bg-[#0F0F1A]` (深紫蓝)
- **文字色**: `text-[#E8E4F0]` (暖白)
- **主按钮**: `bg-[#C4A85A]` (琥珀金) → hover `bg-[#D4B86A]`
- **次要高亮**: `text-[#9B7FD4]` (淡紫色)
- **输入框背景**: `bg-[#1A1A2E]`
- **边框色**: `border-[#2A2A4A]`

### 交互特点
- 浮动按钮悬停时显示提示文字并旋转 + 号
- 表单输入时平滑过渡的 focus 状态
- 提交过程中按钮文字动态变化（加密中→上传中→发射中）
- 成功后"安静地消失"（淡出动画 + 自动跳转）

---

## 🔌 Web3 真实集成替换

当准备接入真实 Web3 环境时，替换以下模拟函数：

### 1. 钱包连接（替换 `mockGetAccount`）
```tsx
// 使用 wagmi
import { useAccount } from 'wagmi';

const { address, isConnected, chainId } = useAccount();
```

### 2. IPFS 上传（替换 `mockUploadToIPFS`）
```tsx
// 使用 Web3.Storage 或 NFT.Storage
import { Web3Storage } from 'web3.storage';

const client = new Web3Storage({ token: 'YOUR_TOKEN' });
const cid = await client.put([file]);
```

### 3. 内容加密（替换 `mockEncryptAndUploadContent`）
```tsx
// 使用 Lit Protocol
import { LitNodeClient } from '@lit-protocol/lit-node-client';

const litNodeClient = new LitNodeClient();
await litNodeClient.connect();
const encryptedString = await litNodeClient.encryptString(content);
```

### 4. 合约调用（替换 `mockCreateVault`）
```tsx
// 使用 wagmi + viem
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { semaphoreABI } from './abis/semaphore';

const { writeContract, data: hash } = useWriteContract();
const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

writeContract({
  address: '0x...',
  abi: semaphoreABI,
  functionName: 'createVault',
  args: [hintCID, encryptedContentCID, tags]
});
```

---

## 📊 数据流程

```
用户填写表单
    ↓
表单验证（前端）
    ↓
Lit Protocol 加密正文
    ↓
上传至 IPFS（公开内容 + 加密内容）
    ↓
获取 CID（hintCID + encryptedContentCID）
    ↓
调用智能合约 createVault()
    ↓
交易确认 → 成功提示 → 自动跳转
```

---

## 🎯 关键功能点

### 富文本编辑器
- 使用原生 `contentEditable` + `document.execCommand`
- 支持标题、加粗、斜体、有序/无序列表
- 可轻松替换为 Quill、TinyMCE 等专业编辑器

### 标签系统
- 预设 8 个标签（孤独、迁徙、工作、爱、失眠、诗歌、成长、记忆）
- 限制最多选择 3 个
- 支持扩展更多标签

### 表单验证
- 引子：10-200 字符
- 问题：5-100 字符
- 正文：必填
- 标签：至少选择 1 个

### 发布状态管理
- `IDLE` → `ENCRYPTING` → `UPLOADING` → `CONTRACT_CALL` → `SUCCESS`/`ERROR`
- 每个阶段都有对应的 UI 状态和按钮文字

---

## 🔧 测试与调试

### 查看模拟输出
打开浏览器控制台，你会看到完整的模拟日志：

```
[模拟 IPFS] 开始上传公开内容...
[模拟 IPFS] 公开内容上传成功！CID: QmPub...
[模拟 Lit Protocol] 开始加密正文...
[模拟 IPFS] 加密内容上传成功！CID: QmEnc...
[合约] 调用 createVault 方法...
[合约] ✅ 交易成功！交易哈希: 0x...
```

### 模拟不同场景
1. **未连接钱包**: 在 `mockGetAccount` 中返回 `isConnected: false`
2. **上传失败**: 在 `mockUploadToIPFS` 中 `throw new Error()`
3. **合约失败**: 在 `mockCreateVault` 中返回 `status: 'reverted'`

---

## 📝 后续优化建议

1. **真实 Web3 集成**: 按上述说明替换所有模拟函数
2. **更强大的编辑器**: 集成 Quill 或 TipTap
3. **标签扩展**: 支持自定义标签、热门标签云
4. **草稿功能**: 本地存储草稿，防止意外丢失
5. **预览功能**: 发布前预览信号弹效果
6. **多语言支持**: i18n 国际化
7. **SEO 优化**: 添加 meta 标签、Open Graph
8. **性能优化**: 代码分割、懒加载、图片优化

---

## 🤝 与后端协作

将以下接口文档交给后端同事：

### 1. 创建信号弹
```
POST /api/signals/create
Body: {
  hook: string,
  question: string,
  content: string,
  tags: string[]
}
Response: {
  signalId: string,
  hintCID: string,
  encryptedContentCID: string,
  txHash: string
}
```

### 2. 获取信号弹列表
```
GET /api/signals?offset=0&limit=20
Response: {
  signals: SignalPost[],
  total: number
}
```

### 3. 申请解锁信号弹
```
POST /api/signals/:id/unlock
Body: {
  answer: string
}
Response: {
  decryptedContent: string
}
```

---

## ✅ 集成检查清单

- [ ] 文件结构正确复制
- [ ] 路由配置完成（`/compose` 路径）
- [ ] 浮动按钮已添加到主布局
- [ ] Tailwind CSS 已配置（或使用自定义样式）
- [ ] React Router DOM 已安装
- [ ] TypeScript 编译无错误
- [ ] 控制台模拟日志正常输出
- [ ] UI 样式符合设计规范
- [ ] 表单验证正常工作
- [ ] 发布流程完整运行

---

## 📧 技术支持

如有问题，请检查：
1. 浏览器控制台是否有错误
2. TypeScript 类型是否正确
3. 路由配置是否正确
4. 组件引用路径是否正确

---

**祝你集成顺利！信号弹功能模块已就绪，随时可以发射。🚀**
