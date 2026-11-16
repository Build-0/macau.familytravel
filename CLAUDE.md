# family 玩樂網站 — 交接說明

回覆用廣東話。呢個 repo 係 Benny 嘅**玩樂網站唯一入口**。

- Repo:`Build-0/macau.familytravel`(repo 名唔好改,改名會令 Pages 舊網址失效)
- 網址:https://build-0.github.io/macau.familytravel/
- 本機:`C:\Users\user\Desktop\family-work\family`

## 頁面

| 路徑 | 內容 | 來源 |
|---|---|---|
| `/` | 首頁入口 | `index.html` |
| `/macau/` | 澳門 | `macau/` |
| `/tw/` | 台灣(桌面版:左邊分區+右邊大地圖+卡片,版面唔好改) | `tw/` |
| `/kids/` | 仁仁德德去哪裡 | `kids/`(空殼,版面+資料喺 Supabase `kids_events`) |
| `/trip/#/t/<slug>` | 旅遊行程頁(公開) | `trip-app/`(Vite+React) |
| `/trip/#/manage` | 行程管理(要登入) | `trip-app/src/TripsAdmin.jsx` |
| `/t/<slug>/` | WhatsApp 分享預覽頁 | 自動生成 |

## Supabase(只用一個專案)

- 專案「教育與玩樂網站」,ref `nikijysochwdfcqscgby`(同功課網 `renren_progress` 共用;功課網唔係本 repo 範圍,唔好郁)。
- 表:`trips`(RLS:published 公開讀、擁有者全權)、`deploy_log`、`kids_events`。
- Edge Function `trip-sync`(verify_jwt false,備份 `supabase/functions/trip-sync/index.ts`)。
- `GH_TOKEN` 已存喺 Supabase Edge Function Secrets(Actions: Read and write,只限本 repo)。**唔好叫 Benny 喺聊天貼 token。**
- 新專案唔會自動 GRANT 俾 anon/authenticated,新表要自己 GRANT + RLS。

## 部署流程

1. 行程資料有改 → DB 觸發器 `trips_sync_after` → `trips_notify_sync()` → pg_net → `trip-sync` → 比較 hash → 派發 `deploy.yml` → 等線上 `share-manifest.json` 一致。每次改動只派發 1 次(約 60-70 秒)。
2. 改 `trip-app/**` 並 push → `.github/workflows/deploy.yml` 建置。
3. 另有每 15 分鐘 cron 檢查作後備。
4. Pages 係分支發佈:**`trip/`、`t/`、`share-manifest.json`、`share-report.json` 由 github-actions[bot] 提交,唔好手改。** push 前先 `git pull --rebase`。

## 邊界(重要)

- **yijia**(一家app,Supabase `urwiswvlfmrnjldnvqfq`、本機 `照行APP`)係 Benny 屋企人用嘅 App,**絕對唔好郁**。
- **Benka**(`benka-web`、Supabase `fdnflasdjcnqldtyqkha`「照行app」)係 Benny 個人網頁,同本 repo 無關;佢嘅行程模組已移除。
- 唔好刪 repo/網站(Benny 自己刪舊站)。

## 設計與偏好

- 驗收標準:美觀、實用、準確、操作簡單。唔好 over-engineering,冇要求就唔加功能。
- 旅遊頁(手機):資訊為主、圖片點綴,**唔係大圖雜誌**。次序:標題+中等封面 → 三格摘要(住宿/景點/交通) → 每日時間表(時間+名稱,短說明直接顯示,長說明收入「詳細」) → 交通 → 酒店 → 預算 → 出發前確認。圖片只做細縮圖。
- 桌面版沿用 TW 嗰種:左邊分區+右邊大地圖+卡片。
- 要重大授權或不可逆操作先問。

## 未完成(Benny 話最後先搞)

1. **管理員帳戶(仲未做,要 Benny 親手):**Supabase → Authentication → Users → Add user(Benny 自己設密碼),並關閉 "Allow new users to sign up";然後將 `trips.user_id`(行程 `sz-dino-7k3q` 現時係 NULL)綁新用戶 uid,測試 `/trip/#/manage` 登入/匯入/發佈。**item 2 嘅發布開關要呢步做完先用得到。**

## 已完成(2026-11-17)

2. **逐項(逐個行程)公開/私人開關:UI + 邏輯已存在**(`TripsAdmin.jsx` 每行有「發布/取消發布」掣 → `update published`)。暫時用唔到,因為寫入受 RLS `trips_owner_all`(`user_id = auth.uid()`)限制,而行程 `user_id` 仲係 NULL —— 等 item 1 綁咗 uid 就通。**唔使再起新嘢。**
3. **子頁「‹ 首頁」返回連結:已加。** macau（`.top-bar` 左）、tw（header 左)、trip 行程頁(`TripPage.jsx` header，跟分享按鈕風格)—— 以上已 commit+push;kids 喺 Supabase `kids_events` id='layout' 版面頂加咗(即時 live,原版備份去 row `layout_backup_20261117`)。
   - **kids `current` 資料點更新:唔係本 repo。** 本 repo 冇任何檔寫 `kids_events`;`current`(活動資料)係外部直接寫 Supabase(手動,或功課網 `renren-homework` 嗰邊工具)。

## 備份

- `backup/kids/`:`kids_events` 備份。
- git tag `backup-before-merge-20261115`。
