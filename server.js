const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const cors = require('cors');

// توكن بوتك الشغال الحالي
const bot = new Telegraf('8988688585:AAGg7Zf78M19lF9b3A4F8HJKlmNpQrsTuVw'); 

const MINI_APP_URL = "https://secret-vault-ten.vercel.app"; 

bot.start((ctx) => {
    ctx.reply(
        `مرحباً بك في الخزنة السرية المشتركة 🔒\nأرسل أي صورة هنا لحفظها، وافتح المعرض السري بكلمة السر الخاصة بنا: disco`,
        Markup.inlineKeyboard([
            [Markup.button.webApp('🖼️ فتح معرض الصور', MINI_APP_URL)]
        ])
    );
});

global.photoGallery = global.photoGallery || [];

bot.on('photo', async (ctx) => {
    try {
        ctx.reply('⏳ جاري معالجة الصورة وحفظها في الخزنة...');
        const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        const fileLink = await ctx.telegram.getFileLink(fileId);
        
        global.photoGallery.push({
            url: fileLink.href,
            sender: ctx.from.first_name || "صديق",
            date: new Date()
        });

        ctx.reply('✅ رائع! تم حفظ الصورة في الألبوم المشترك بنجاح.');
    } catch (error) {
        console.error(error);
        ctx.reply('❌ حدث خطأ أثناء معالجة الصورة.');
    }
});

const app = express();

// فك الحجب الأمني تماماً لربط الواجهة بالسيرفر
app.use(cors()); 

app.get('/', (req, res) => res.send('السيرفر يعمل بنجاح! 🚀'));
app.get('/api/photos', (req, res) => res.json(global.photoGallery));

// جعل السيرفر يستمع دائماً للـ Port المفرود من Render لمنع الانهيار
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`السيرفر مستقر ويعمل على بورت ${PORT}`);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
