const WebSocket = require('ws');
const express = require('express');

// 初始化 Express 應用
const app = express();
const port = process.env.PORT || 8080;

// 啟動 HTTP 伺服器
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// 創建 WebSocket 伺服器並綁定到 HTTP 伺服器
const wss = new WebSocket.Server({ server });

// 處理 WebSocket 連接
wss.on('connection', ws => {
  console.log('Client connected');

  // 處理接收到的消息
  ws.on('message', message => {
    console.log(`Received message: ${message}`);
  });

  // 向所有連接的客戶端發送訊息
  const sendUpdate = (number) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'update', number }));
      }
    });
  };

  // 監聽來自工作人員頁面的更新，並傳遞給所有前端頁面
  app.use(express.json()); // 確保解析 JSON 請求體

  app.post('/update', (req, res) => {
    const { number } = req.body;
    if (number) {
      sendUpdate(number);
      res.status(200).send('Update sent');
    } else {
      res.status(400).send('No number provided');
    }
  });
});
