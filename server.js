const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/ai', async (req, res) => {
  const { userText, systemPrompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: "المفتاح السري غير موجود في السيرفر!" });
  }

  // استخدمنا v1beta هون لأنها الوحيدة اللي بتفهم systemInstruction بدون ما تضرب خطأ
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userText }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "فشل الاتصال بسيرفرات جوجل." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ملاذ Backend شغال ومستعد على البورت ${PORT}`));
