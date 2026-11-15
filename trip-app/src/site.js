// APP_BASE:行程程式所在目錄(…/trip/);SITE_BASE:整個網站根目錄(…/macau.familytravel/)
// 分享連結 = SITE_BASE + 't/<slug>/'(靜態預覽頁,有 WhatsApp 預覽卡,開啟後跳返 APP_BASE#/t/<slug>)
export const APP_BASE = window.location.origin + window.location.pathname.replace(/[^/]*$/, '')
export const SITE_BASE = APP_BASE.replace(/trip\/$/, '')
