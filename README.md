# 銓Dubu嘟布韓式豆腐煲｜行銷活動

銓Dubu嘟布韓式豆腐煲（義華店）的行銷活動網站。靜態頁面以 GitHub Pages 發布；業主頁面與兌換紀錄 API 以 Vercel 發布（同一個 repo）。

| 路徑 | 內容 | 狀態 |
| --- | --- | --- |
| `/` | 活動入口頁（Vercel 上會導向 `/owner/`） | 上線 |
| `/tofu-catch/` | 嫩豆腐接接樂 網頁遊戲 | 預覽版 |
| `/tofu-catch/social/` | 社群貼文圖片（輪播 5 張＋限動 1 張） | 完成 |
| `/owner/` | 業主專區：遊戲連結與 QR、貼文、圖片、活動規則、兌換紀錄 | 完成 |
| `/api/redeem` | 店員核銷時寫入兌換紀錄（Vercel Function） | 待部署 |
| `/api/records` | 業主讀取／清除測試紀錄，需 PIN（Vercel Function） | 待部署 |
| `/menu/` | 門市資訊與完整菜單 | 上線 |
| `/assets/brand/` | 品牌 logo 與共用素材 | — |

## 部署到 Vercel

1. 在 Vercel 匯入 GitHub repo `78vince/chuan-dubu`，專案名稱用 `chuan-dubu`（網址 `https://chuan-dubu.vercel.app`）。Framework 選 Other，不需要 build 指令。
2. 在專案的 Storage（Marketplace）加入 **Upstash for Redis**（免費方案即可），連到這個專案。會自動帶入 `KV_REST_API_URL`／`KV_REST_API_TOKEN`（或 `UPSTASH_REDIS_REST_URL`／`UPSTASH_REDIS_REST_TOKEN`）。
3. 在 Settings → Environment Variables 新增 `OWNER_PIN`（業主查看紀錄用的 PIN），然後重新部署。
4. 業主網址：`https://chuan-dubu.vercel.app/`（自動導向 `/owner/`）。

若專案網址不是 `chuan-dubu.vercel.app`，要同步修改 `tofu-catch/index.html` 的 `REDEEM_API` 與 `owner/index.html` 的 `API`（GitHub Pages 上的遊戲靠這個網址送紀錄）。

## 兌換紀錄怎麼運作

- 只記錄 1700 分以下的獎勵（小菜、拉麵）。九折券用固定折扣碼 `8FNSP`，不需核銷，使用次數到 findpos 後台查。
- 店員在客人手機上長按「店員核銷」3 秒 → 遊戲送出一筆紀錄（每張券一個編號，重送不會重複計算）。網路不通時先存在手機，下次開遊戲或恢復連線自動補送。
- 分數對應的獎項由伺服器重新判斷，不信任手機送來的獎項名稱。
- 預覽版（`PREVIEW = true`）或 `?test=1` 產生的紀錄會標成「測試」，業主頁面可一鍵清除。

## 新增活動

每個活動放在自己的資料夾（例如 `/new-campaign/index.html`），完成後在根目錄 `index.html` 加一張卡片連過去。

## 嫩豆腐接接樂 上線前待辦

- 活動期間 2026/11/16–11/29（`EVENT_START`／`EVENT_END`），期間外只能試玩、不發券。
- 目前是預覽版：`PREVIEW = true` 不限日期、每局依分數發券。上線前改回 `false`，並在業主頁面清除測試資料。
- 1700 分以上發 9 折固定折扣碼 `8FNSP`（findpos 店號 3818），券面附 QR code。9 折券不需店員核銷；其餘級距券面只顯示獎勵品項，由店員確認後核銷並自動記錄。
- 錄製的語音檔填進 `VOICE_CLIPS`。
