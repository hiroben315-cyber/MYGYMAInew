# MyGymAI — iPhone 版

根據 hiroben315-cyber/MyGymAI 的 main（cdf5180）建立，沿用 React、Express 與 Gemini 功能，新增 Capacitor 8 iOS 專案。

## 現在可以做什麼

- 訓練組數、重量、次數、歷史紀錄與趨勢圖。
- 蛋白質與身體數據記錄、休息計時器。
- 無 AI 連線時使用既有本機訓練分析和文字解析。
- 記錄存在裝置的 WebView localStorage；移除 App 可能遺失資料，尚無雲端同步。
- 移除原始專案自動加入的示範歷史紀錄、勳章及蛋白質數量。個人資料欄位仍有原專案預設值，請先修改為自己的數據。

## 電腦預覽

安裝 Node.js 22+ 後，在此目錄執行：

```sh
npm install
npm run dev
```

開啟 http://localhost:3000 。不設定 Gemini 金鑰也能啟動；部分原始後端路由會提供規則式備援結果，不能視為真實 AI 分析。

### 目前這台電腦上的 iPhone 試用

電腦與 iPhone 連到同一 Wi-Fi，在 Safari 開啟 `http://192.168.1.116:3000`。服務啟動期間必須保持電腦開機；IP 可能隨網路改變。Safari 分享選單可選「加入主畫面」。這是區域網路試用，尚無離線網頁快取；部分相機／剪貼簿功能在 HTTP 下可能受 Safari 限制。若無法開啟，檢查 Windows 私人網路防火牆是否允許 Node.js 與路由器是否隔離裝置。

## 在 Mac 安裝到 iPhone

需要 Xcode 26+，支援 iOS 15+。本資料夾含已產生的 `ios/App/App.xcodeproj`，使用 Swift Package Manager。

```sh
npm install
npm run lint
npm run ios:sync
npm run ios:open
```

在 Xcode 選擇 App target → Signing & Capabilities，選擇自己的 Team，將預設 Bundle Identifier 改為你擁有的唯一識別碼。接上 iPhone、依 Xcode 提示信任裝置並選取裝置後按 Run。TestFlight/App Store 發布仍需要 Apple Developer 帳號、簽署及商店資料。

## 連接 AI 後端

iPhone 內不會執行 Express。請將 `server.ts` 部署到你管理的 HTTPS Node.js 服務，設定伺服器環境變數 `GEMINI_API_KEY`、`NODE_ENV=production`，先執行 `npm run build`，再執行 `npm start`。`GET /api/health` 可查看啟動狀態。

App 編譯前，在本機 `.env` 填寫：

```dotenv
VITE_API_BASE_URL=https://your-backend.example.com
```

再次執行 `npm run ios:sync`。網址只填 origin，不加 `/api`。Gemini 金鑰只放伺服器，絕不可使用 VITE_ 前綴或放入 iOS 檔案。跨來源預設允許 `capacitor://localhost`；其他網頁來源可透過伺服器 `ALLOWED_ORIGINS` 逗號分隔設定。

尚未替使用者部署後端或設定 Gemini 金鑰，AI 真實回應未驗證。沿用原始模型清單，需依 Gemini 帳號可用模型調整。原始後端尚無登入與用量限制，公開服務前需補上；CORS 並不是身分驗證。

## 驗證與限制

Windows 可驗證 TypeScript、網頁正式編譯與 Capacitor 資源同步，無法驗證 Xcode 編譯、簽署、真機相機、鍵盤或背景行為。休息計時器沿用前景計時，不提供鎖屏通知。App 圖示沿用 Capacitor 預設，尚未準備商店素材及隱私政策。

官方 iOS 建置說明：https://capacitorjs.com/docs/ios
