const WebSocket = require('ws');
const express = require('express');

// 初始化 Express 應用
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json()); // 確保解析 JSON 請求體

// 啟動 HTTP 伺服器
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// 創建 WebSocket 伺服器並綁定到 HTTP 伺服器
const wss = new WebSocket.Server({ server });

// 定義向所有客戶端發送 WebSocket 訊息的函數
const sendUpdate = (number) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'update', number }));
    }
  });
};

// 設定根路由
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// 定義 /update 路由
app.post('/update', (req, res) => {
  console.log('Received POST request at /update');
  console.log(req.body); // 確認請求體內容
  const { number } = req.body;
  if (!number) {
    return res.status(400).send('Number is required');
  }
  sendUpdate(number); // 發送更新給所有 WebSocket 客戶端
  res.status(200).send('Update sent');
});

// 定義 /test 路由
app.post('/test', (req, res) => {
  res.status(200).send('Test successful');
});

// 處理 WebSocket 連接
wss.on('connection', ws => {
  console.log('Client connected');

  // 處理接收到的消息
  ws.on('message', message => {
    console.log(`Received message: ${message}`);
  });
});
