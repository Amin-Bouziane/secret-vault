const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const cors = require('cors');

// توكن البوت الخاص بك والشغال تماماً
const bot = new Telegraf('8988688585:AAErmP5HYQynJ4qGmrgzlR4rJKm__m5Vzk8'); 

// رابط الواجهة الجديدة النظيفة الخاصة بك على Vercel
const MINI_APP_URL = "https://secret-vault-8hxu.vercel.app"; 

bot.start((ctx) => {
    ctx.reply(
        `مرحباً بك في الخزنة السرية المشتركة 🔒\nأرسل أي صورة هنا لحفظها، وافتح المعرض السري بكلمة السر الخاصة بنا: alpha`,
        Markup.inlineKeyboard([
            [Markup.button.webApp('🖼️ فتح معرض الصور', MINI_APP_URL)]
        ])
    );
});

// تهيئة مصفوفة التخزين في الذاكرة العشوائية
global.photoGallery = global.photoGallery || [];

bot.on('photo', async (ctx) => {
    try {
        const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        const fileLink = await ctx.telegram.getFileLink(fileId);
        
        global.photoGallery.push({
            url: fileLink.href,
            date: new Date()
        });

        ctx.reply('✅ رائع! تم حفظ الصورة في الألبوم المشترك بنجاح.');
    } catch (error) {
        console.error(error);
        ctx.reply('❌ حدث خطأ أثناء معالجة وحفظ الصورة.');
    }
});

const app = express();

// إعدادات CORS المتقدمة لإنهاء الرسالة الحمراء للأبد
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// إتاحة الوصول المباشر لجلب الصور
app.get('/api/photos', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json(global.photoGallery);
});

// رسالة فحص عمل السيرفر عند فتحه من المتصفح
app.get('/', (req, res) => {
    res.send('<h1>السيرفر مستقر ويعمل بنجاح باهر! 🚀</h1>');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`السيرفر يعمل بكفاءة على بورت ${PORT}`);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
