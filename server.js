const { Telegraf, Markup } = require('telegraf');
const express = require('express');

// ⚠️ ضع هنا توكن بوتك الجديد بدقة بين العلامتين
const bot = new Telegraf('YOUR_NEW_TOKEN'); 

const MINI_APP_URL = "https://secret-vault-ten.vercel.app"; 

bot.start((ctx) => {
    ctx.reply(
        `مرحباً بك في الخزنة السرية المشتركة 🔒\nأرسل أي صورة هنا لحفظها، وافتح المعرض السري بكلمة السر الخاصة بنا.`,
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
app.get('/', (req, res) => res.send('البوت يعمل بامتياز على سيرفر Render! 🚀'));
app.get('/api/photos', (req, res) => res.json(global.photoGallery));

app.listen(process.env.PORT || 3000, () => {
    console.log('السيرفر السحابي جاهز الآن!');
});

bot.launch();
