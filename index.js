import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const TOKEN = process.env.TELEGRAM_TOKEN;
const OPENAI_KEY = process.env.OPENAI_KEY;
const TELEGRAM_API = 'https://api.telegram.org/bot${TOKEN}';

// دریافت پیام از تلگرام
app.post("/webhook", async (req, res) => {
  const message = req.body.message;

  if (!message || !message.text) {
    return res.sendStatus(200);
  }

  const chatId = message.chat.id;
  const userText = message.text;

  try {
    const aiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userText }],
      },
      {
        headers: {
          Authorization: 'Bearer ${OPENAI_KEY}',
        },
      }
    );

    const botReply = aiResponse.data.choices[0].message.content;

    await axios.post('${TELEGRAM_API}/sendMessage', {
      chat_id: chatId,
      text: botReply,
    });
  } catch (err) {
    console.error(err);
  }

  res.sendStatus(200);
});

// پورت Render
app.listen(10000, () => {
  console.log("Bot is running...");
});
