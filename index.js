const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const prompt = msg.text;

  try {
    if (prompt.startsWith("عکس")) {
      const cleanPrompt = prompt.replace("عکس", "").trim();

      const image = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          model: "gpt-image-1",
          prompt: cleanPrompt
        },
        {
          headers: {
           Authorization: "Bearer" + process.env.OPENAI_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      const url = image.data.data[0].url;
      bot.sendPhoto(chatId, url);
      return;
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: "Bearer" + process.env.OPENAI_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    const text = response.data.choices[0].message.content;
    bot.sendMessage(chatId, text);

  } catch (err) {
    console.log(err);
    bot.sendMessage(chatId, "یه مشکلی پیش اومد، دوباره امتحان کن.");
  }
});