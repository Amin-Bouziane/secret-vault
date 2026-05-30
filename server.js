const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const cors = require('cors');

// توكن البوت الخاص بك
const bot = new Telegraf('8988688585:AAErmP5HYQynJ4qGmrgzlR4rJKm__m5Vzk8'); 

// سنقوم بتحديث هذا الرابط لاحقاً بعد رفع الواجهة الجديدة على Vercel
let MINI_APP_URL = "https://secret-vault-ten.vercel.app"; 

bot.start((ctx) => {
    ctx.reply(
        `مرحباً بك في الخزنة السرية المشتركة 🔒\nأرسل أي صورة هنا لحفظها، وافتح المعرض السري بكلمة السر الخاصة بنا: alpha`,
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
            date: new Date()
        });

        ctx.reply('✅ رائع! تم حفظ الصورة في الألبوم المشترك بنجاح.');
    } catch (error) {
        console.error(error);
        ctx.reply('❌ حدث خطأ أثناء معالجة الصورة.');
    }
});

const app = express();

// تفعيل الاتصال من أي مكان بشكل صريح لحل المشكلة الحمراء
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
})); 

app.get('/', (req, res) => res.send('السيرفر يعمل بنجاح ومستقر! 🚀'));
app.get('/api/photos', (req, res) => res.json(global.photoGallery));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`السيرفر مستقر ويعمل على بورت ${PORT}`);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
