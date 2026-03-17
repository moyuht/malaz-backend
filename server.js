const express = require('express');
const cors = require('cors');

const app = express();

// السماح لتطبيقك الأساسي بالاتصال
app.use(cors());
app.use(express.json());

// النقطة اللي رح تستقبل رسائل تطبيقك
app.post('/api/ai', async (req, res) => {
  const { userText, systemPrompt } = req.body;
  
  // سحب المفتاح من خزنة Render حصراً لحمايته
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: "المفتاح السري غير موجود في السيرفر!" });
  }

  // استخدام الإصدار المستقر v1 مع الموديل السريع flash
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
    
    res.json(data); // إرجاع الرد لجهازك
  } catch (error) {
    res.status(500).json({ error: "فشل الاتصال بسيرفرات جوجل من قبل السيرفر الوسيط." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ملاذ Backend شغال ومستعد على البورت ${PORT}`));
