const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const cors = require('cors'); 

// توكن البوت الخاص بك
const bot = new Telegraf('8988688585:AAGg7Zf78M19lF9b3A4F8HJKlmNpQrsTuVw'); 

// رابط الواجهة الخاصة بك على Vercel
const MINI_APP_URL = "https://secret-vault-ten.vercel.app"; 

bot.start((ctx) => {
    ctx.reply(
        `مرحباً بك في الخزنة السرية المشتركة 🔒\nأرسل أي صورة هنا لحفظها، وافتح المعرض السري بكلمة السر الجديدة الخاصة بنا: disco`,
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

// تفعيل ميزة فك الحجب الأمني لربط السيرفر بالواجهة
app.use(cors()); 

app.get('/', (req, res) => res.send('السيرفر السحابي يعمل بامتياز! 🚀'));
app.get('/api/photos', (req, res) => res.json(global.photoGallery));

app.listen(process.env.PORT || 3000, () => {
    console.log('السيرفر جاهز ومستعد!');
});

bot.launch();
