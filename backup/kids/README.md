# 仁仁德德去哪裡:資料備份

呢個頁(/kids/)只係空殼,真正版面同資料放喺 Supabase 專案「教育與玩樂網站」(原名 renren-homework,ref nikijysochwdfcqscgby)嘅 `kids_events` 表:

- `layout`:頁面 HTML(`layout.html` 係 2026-11-09 版本)
- `current`:活動資料(`current.json` 備份於 2026-11-16,資料更新日 2026-11-13)
- `layout_prev` / `layout_backup_20261109`:舊版面

如果日後搬 Supabase,將呢啲檔案寫返入新專案同名 row,再改 `kids/index.html` 嘅 URL / KEY 即可。`kids/data.json`(2026-11-05)只係讀唔到 Supabase 時嘅後備,比 current 舊。
