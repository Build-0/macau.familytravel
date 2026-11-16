# 我們這一家(Build-0/macau.familytravel)

全家玩樂唯一入口:https://build-0.github.io/macau.familytravel/

| 路徑 | 內容 | 技術 |
|---|---|---|
| `/` | 首頁(四個入口 + 公開行程列表) | 靜態 `index.html` |
| `/macau/` | 澳門周邊親子遊 | 靜態 |
| `/tw/` | 台灣景點庫(版面:左分區 + 地圖 + 卡片) | 靜態 |
| `/kids/` | 仁仁德德去哪裡 | 靜態 + `kids/data.json` |
| `/trip/#/t/<slug>` | 旅遊行程頁(公開) | `trip-app/`(Vite + React,讀 Supabase `trips`) |
| `/trip/#/manage` | 行程管理(要登入:貼 JSON、發布、複製分享連結) | 同上 |
| `/t/<slug>/` | 行程分享預覽頁(WhatsApp 預覽卡,開啟後跳去行程頁) | 建置時由 `trip-app/scripts/gen-share.mjs` 生成 |

資料庫:Supabase 專案「教育與玩樂網站」(ref `nikijysochwdfcqscgby`)。交接細節見 `CLAUDE.md`。

部署:`.github/workflows/deploy.yml`(push / 手動 / 每 15 分鐘檢查行程有冇改)。Supabase Edge Function `trip-sync`(見 `supabase/functions/`、`docs/trip-sync-setup.md`)喺行程改動時即時觸發部署。

備份還原標記:`backup-before-merge-20261115`(搬遷前狀態)。
