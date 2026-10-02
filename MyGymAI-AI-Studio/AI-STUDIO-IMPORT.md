# 在 Google AI Studio 繼續開發 MyGymAI

這是本次修改後的完整原始碼，不是原 GitHub 儲存庫的舊版。包含 React 手機介面、Express / Gemini 後端、Capacitor iOS 專案，以及尚未部署的 Render 雲端設定。

## 官方支援的匯入方式

1. 將本專案解壓縮後的內容上傳到你控制的 GitHub 儲存庫根目錄。建議使用新的私人儲存庫保存本版，避免覆蓋舊版。
2. 在 Google AI Studio 的 Build 模式，開啟提示輸入框的「+ / Add files」，選擇「Import from GitHub」，連接並選取該儲存庫。
3. 在 AI Studio 的 Secrets 設定 `GEMINI_API_KEY`。可另外設定 `GEMINI_MODEL=gemini-3.5-flash-lite`。
4. 不要在 AI Studio 設定 `CLOUD_MODE=true` 或 `VITE_CLOUD_LOGIN=true`；它們僅供未來的獨立 Render 部署使用，以免影響 Studio 內嵌預覽。
5. 執行 `npm install`、`npm run dev`；應用程式預設監聽 0.0.0.0:3000，正式部署使用 `npm run build` 與 `NODE_ENV=production npm start`。

官方說明：https://ai.google.dev/gemini-api/docs/aistudio-build-mode

ZIP 是完整程式交付包，並不保證所有 AI Studio 帳號都提供直接 ZIP 匯入。若你的介面沒有 ZIP 上傳功能，使用上面的 GitHub 匯入方式。此包尚未上傳至 GitHub，也尚未在 AI Studio 實際匯入。

## 可以貼給 AI Studio 的提示

> 請接續這個 MyGymAI 專案，保留現有暖白手機介面、單動作訓練模式、器材 SVG 圖示、飲食與體態功能。使用現有 Express server.ts 與 @google/genai 後端，不要把 GEMINI_API_KEY 寫進前端。金鑰從 Secrets 的環境變數讀取。先執行型別檢查與編譯，修復匯入環境差異後啟動預覽。不要重新產生示範訓練紀錄，也不要自動發布。

## 個人資料與金鑰

- ZIP 不含 `.env`、金鑰、node_modules、編譯產物或瀏覽器個人資料。
- 在原本有紀錄的手機／瀏覽器開啟舊網址，找到頁面底部「資料備份與搬移」→「下載我的資料」。各裝置的資料需各自匯出。
- 備份是 JSON，包含訓練紀錄、個人設定、當日蛋白質與身體測量；請私人保存，不要放進公開 GitHub 儲存庫。
- 換網址不會自動帶入舊資料。本版只加入匯出功能，資料匯入／跨裝置同步尚未完成。
- 當前未儲存的畫面輸入不包含在備份內，請先儲存訓練。

## 雲端準備狀態

`render.yaml` 與 `cloud-security.ts` 是新增的部署準備：單一私人密碼登入、簽章 Cookie、每個伺服器程序每小時最多 30 次 API POST、15 分鐘最多 10 次登入嘗試。尚未部署驗證；記憶體限流在程序重啟後重設，不是持久化帳單預算。雲端登入不等於資料雲端同步。Gemini 金鑰及主機密碼需由你在目標服務設定。

已完成的本機功能包括 Gemini 連線及虛構文字解析測試。iOS 原生編譯、真機相機、AI Studio 匯入及雲端發布仍未驗證。
