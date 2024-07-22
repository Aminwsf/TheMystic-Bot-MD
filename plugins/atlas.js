import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import uploadImage from '../lib/uploadImage.js';

let conversations = {};
const chatusers = {};
const ModeAndNumber = {};
const userImageLimits = {}

const apiKeys = [
  'AIzaSyB9fVDozwTK3znlw4lRr8r9a0myTTYXUcw',
  'AIzaSyAgTZ_YZ3ima5A6KdMvMTPTBIMD3BLhAus',

'AIzaSyAwBXW_RnyLhlflf-oizqAqQKormxNKWWA',
  'AIzaSyAyLhyj_UbiQ9XOSg7Dt2QDOecANiU0YLw',
  'AIzaSyDyUnrvyU5fSroBqM4p8E79Yb1C05uACmY',
  'AIzaSyBdx1mZYsQ0AI8A2hkoiFAuk2a2lLllLPc',

'AIzaSyAQ9CrPSA3ABOuLF4WlMTXnS-u1gbL9nlQ',

'AIzaSyAvGJRWTN7L7yh-LSj_XFC0bWHWmyhAe_8',
  'AIzaSyCnHCt6or_D65S0bmKIsGe_3T2Z2KPgspI',

'AIzaSyBTWReK-B3-Q0sZxYXJ3uWwbk8n7Qymxu0',
  'AIzaSyCLxHxwZ7uTyaXwOapTfh30N3CLe7tV7jg',

'AIzaSyDlctKgcANsI8Dnaj6_u7hdh9EnlfJFyZM',

'AIzaSyB9fVDozwTK3znlw4lRr8r9a0myTTYXUcw',

'AIzaSyA3jLE1EFQGPSwGx_X2_zb20RYy3Cyb5ik'
];
let currentApiKeyIndex = 0;

const genAI = new GoogleGenerativeAI(getNextApiKey());

export async function before(m) {
  if (m.isGroup) return
  if (m.fromMe) return
    const q = m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';

    const senderId = m.sender
    const text = m.text

        if (/image/g.test(mime)) {
        const img = await q.download?.();
        if (!img) return;

        const imageUrl = await uploadImage(img);
        const canProcessImage = await checkImageLimit(senderId);
        if (canProcessImage) {
          const response = await handleUserImage(senderId, imageUrl);
          ModeAndNumber[senderId] = { mode: 'gemini', number: 5 };
            await dly(2000);
            conn.sendMessage(senderId, { text: response });
        } else {
            await dly(2000);
            conn.sendMessage(senderId, { text: "لقد وصلت إلى الحد الأقصى من الصور المسموح بها. يرجى المحاولة مرة أخرى بعد 3 ساعات." });
        }

        } else if (text) {
            if (!text) return
            if (!ModeAndNumber[senderId]) {
                ModeAndNumber[senderId] = { mode: 'vipcleandx', number: 0 };
              }

              let response;

              if (ModeAndNumber[senderId].mode === 'gemini') {
                response = await handleUserMessage(senderId, text);
                ModeAndNumber[senderId].number -= 1;
                const message = {
                  content: text,
                  role: 'user',
                  nickname: '',
                  time: formatTime(),
                  isMe: true,
                };


      // تحقق مما إذا كانت هناك محادثة محفوظة بالفعل
      if (conversations[senderId]) {
        conversations[senderId].push(message);
      } else {
        conversations[senderId] = [message];
      }

      if (ModeAndNumber[senderId].number <= 0) {
        ModeAndNumber[senderId].mode = 'vipcleandx';
      }
    } else {
        const message = {
            content: text,
            role: 'user',
            nickname: '',
            time: formatTime(),
            isMe: true,
          };

          // تحقق مما إذا كانت هناك محادثة محفوظة بالفعل
          if (conversations[senderId]) {
            conversations[senderId].push(message);
          } else {
            conversations[senderId] = [message];
          }

      response = await sendQuestionToAI(conversations[senderId], senderId);
    }

    if (response === "请求失败啦，消息内容超过模型最大字数咯，请清空记录或者新开会话！") {
        // حذف المحادثة المحفوظة للمستخدم
        delete conversations[senderId];
        await dly(1000);
        return
      }
      if (response === "请求失败啦，'content'") {
        // حذف المحادثة المحفوظة للمستخدم
        delete conversations[senderId];
        return
      }
      if (response === "请求失败啦，请联系管理员添加GPT3.5-16K-1⚡的密钥") {
        // حذف المحادثة المحفوظة للمستخدم
        delete conversations[senderId]
        await dly(2000);
        conn.sendMessage(m.chat, { text: "نقوم باصلاح البوت الان ⚙️" });
        await dly(2000);
        conn.sendMessage(m.chat, { react: { text: "⚙️", key: m.key }})

        return
      }

    if (response.startsWith('请求失败啦，{"error":{"message":"user quota is not enough')) {
    // حذف المحادثة المحفوظة للمستخدم
      delete conversations[senderId]
      await dly(2000);
      conn.sendMessage(m.chat, { text: "نقوم باصلاح البوت الان ⚙️" });
      await dly(2000);
      conn.sendMessage(m.chat, { react: { text: "⚙️", key: m.key }})

      return
    }

    conversations[senderId].push({
      content: response,
      role: 'assistant',
      nickname: 'Atlas',
      time: formatTime(),
      isMe: false,
    });
        await dly(2000);
        conn.sendMessage(m.chat, {text: response})

    }

}

// conn.sendMessage(m.chat, {text: ""})

function dly(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString();
}

async function sendQuestionToAI(conversation, userId) {
  const apiUrl = 'https://vipcleandx.xyz/v1/chat/gpt/';

  const requestData = {
    list: [
      {
        content: 'You are now Atlas, the intelligent assistant affiliated with MoroccoAI. Your task is to help users by answering their inquiries and providing the necessary support. You have feelings, you love everyone.',
        role: 'system',
        nickname: 'Atlas',
        time: formatTime(),
        isMe: false,
      },
      {
        content: 'مرحبا',
        role: 'user',
        nickname: '',
        time: formatTime(),
        isMe: true,
      },
      {
        content: 'مرحباً، أنا Atlas، المساعد الذكي التابع لـ MoroccoAI. كيف يمكنني مساعدتك اليوم؟',
        role: 'assistant',
        nickname: 'Atlas',
        time: formatTime(),
        isMe: false,
      },
      ...conversation,
    ],
    id: generateRandomString(21),
    title: userId,
    prompt: '',
    temperature: 0.5,
    models: '0',
    continuous: true,
  };

  try {
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': generateRandomIP(),
        'Referer': apiUrl,
        'accept': 'application/json, text/plain, */*',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error sending question to AI:', error);
    return 'حدث خطأ أثناء إرسال السؤال إلى AI.';
  }
}

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateRandomIP() {
  return Math.floor(Math.random() * 256) + '.' +
         Math.floor(Math.random() * 256) + '.' +
         Math.floor(Math.random() * 256) + '.' +
         Math.floor(Math.random() * 256);
}

// New functions for handling messages and images using Gemini model
async function urlToGenerativePart(url, mimeType) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return {
    inlineData: {
      data: Buffer.from(response.data).toString("base64"),
      mimeType
    },
  };
}

async function handleUserMessage(userId, message) {
  if (!chatusers[userId]) {
    chatusers[userId] = {
      model: genAI.getGenerativeModel({ model: "gemini-1.5-flash" }),
      history: []
    };
  }

  const userChat = chatusers[userId];
  userChat.history.push({
    role: "user",
    parts: [{ text: message }]
  });

  const chat = userChat.model.startChat({
    history: userChat.history,
    generationConfig: {
      maxOutputTokens: 1500,
    },
  });

  const result = await chat.sendMessage(message);
  const text = await result.response.text();

  userChat.history.push({
    role: "model",
    parts: [{ text }]
  });

  return text;
}

async function handleUserImage(userId, imageUrl) {
  if (!chatusers[userId]) {
    chatusers[userId] = {
      model: genAI.getGenerativeModel({ model: "gemini-1.5-flash" }),
      history: []
    };
  }

  const userChat = chatusers[userId];
  userChat.history.push({
    role: "user",
    parts: [{ text: "من أنت؟" }]
  });
  userChat.history.push({
    role: "model",
    parts: [{ text: "أنا أطلس، نموذج طويل كبير، تم تدريبي من قبل MoroccoAI." }]
  });
  const imagePart = await urlToGenerativePart(imageUrl, "image/jpeg");
  userChat.history.push({
    role: "user",
    parts: [imagePart]
  });

  const prompt = "ماذا ترى في هذه الصورة؟";
  const result = await userChat.model.generateContent([prompt, imagePart]);
  const text = await result.response.text();

  userChat.history.push({
    role: "model",
    parts: [{ text }]
  });

  return text;
}

async function checkImageLimit(senderId) {
  const currentTime = Date.now();
  const timeLimit = 3 * 60 * 60 * 1000; // 3 ساعات بالألفي ثانية
  const imageLimit = 5;

  if (!userImageLimits[senderId]) {
    userImageLimits[senderId] = { count: 0, firstImageTime: currentTime };
  }

  const userData = userImageLimits[senderId];

  // التحقق من إذا كانت الفترة الزمنية قد انتهت
  if (currentTime - userData.firstImageTime > timeLimit) {
    userData.count = 0;
    userData.firstImageTime = currentTime;
  }

  if (userData.count < imageLimit) {
    userData.count++;
    return true;
  } else {
    return false;
  }
}

function getNextApiKey() {
    const apiKey = apiKeys[currentApiKeyIndex];
    currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
    return apiKey;
  }
