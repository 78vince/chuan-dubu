# 銓Dubu嘟布韓式豆腐煲｜行銷活動

銓Dubu嘟布韓式豆腐煲（義華店）的行銷活動網站，以 GitHub Pages 發布。

| 路徑 | 內容 | 狀態 |
| --- | --- | --- |
| `/` | 活動入口頁 | 上線 |
| `/tofu-catch/` | 嫩豆腐接接樂 網頁遊戲 | 測試版 |
| `/tofu-catch/social/` | 社群貼文圖片（輪播 5 張＋限動 1 張） | 待補活動期間 |
| `/menu/` | 門市資訊與完整菜單 | 上線 |
| `/assets/brand/` | 品牌 logo 與共用素材 | — |

## 新增活動

每個活動放在自己的資料夾（例如 `/new-campaign/index.html`），完成後在根目錄 `index.html` 加一張卡片連過去。

## 嫩豆腐接接樂 上線前待辦

- 在 `tofu-catch/index.html` 最上方的 `EVENT_PERIOD` 填入活動期間。
- 錄製的語音檔填進 `VOICE_CLIPS`。
- 目前優惠券紀錄只存在玩家手機，正式上線建議接後端資料庫記錄發券與核銷。
