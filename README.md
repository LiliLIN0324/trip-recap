# Trip Recap · 旅行回忆录

把一次旅行变成可以回放的记忆：地球仪上标出到过的地方，按时间线走一遍，配上照片和统计，最后生成一段摘要播放。

Cyberpunk 风格的 PWA，数据存在本地；AI 只用来补地理坐标和读照片。

> **状态：开发中。** 当前 `main` 分支存在未解决的合并冲突（`package.json`、`index.html`、`sw.js`、`components/App.tsx`、`services/gemini.ts` 中有冲突标记），clone 后需要先解决冲突才能安装和构建。

---

## 功能

- **地球仪**：d3 + topojson 绘制，旅行点按时间连线
- **时间线**：按日期浏览每一站，打开卡片看照片与笔记
- **统计**：里程、城市数、照片分布
- **摘要播放**：自动逐站播放，长卡片停留更久
- **相册**：按旅程分组浏览
- **PWA**：可安装、离线缓存外壳
- **AI 辅助**：地名转坐标、照片内容识别

## 运行（解决冲突后）

```bash
npm install
npm run dev
```

`.env` 中需要 Gemini API Key（代码读取 `process.env.API_KEY`）。

## 结构

```
components/App.tsx        主状态、时间线、播放控制
GlobeView.tsx             地球仪
components/MemoryModal.tsx   记忆卡片
components/StatsView.tsx     统计
services/gemini.ts        地理编码与视觉
sw.js / manifest.json     PWA
```

## 数据

全部保存在 localStorage，键名 `CHRONOS_ARCHIVE_V1`。换设备不会同步，清缓存前请先导出。

## 待修

- 合并冲突（见上）
- `SummaryScreen.tsx` 与 `summaryScreen.tsx` 仅大小写不同，在 macOS / Windows 上会互相覆盖
- 图片没有裁剪，大图会拖慢地球仪

## 部署

Vercel 静态部署；PWA 需要 HTTPS。
