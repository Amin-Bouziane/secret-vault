const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const cors = require('cors');

const bot = new Telegraf('8988688585:AAErmP5HYQynJ4qGmrgzlR4rJKm__m5Vzk8'); 
const MINI_APP_URL = "https://secret-vault-ten.vercel.app"; 

bot.start((ctx) => {
    ctx.reply(
        `مرحباً! أرسل أي صورة لحفظها، وافتح المعرض بكلمة السر: alpha`,
        Markup.inlineKeyboard([
            [Markup.button.webApp('🖼️ فتح معرض الصور', MINI_APP_URL)]
        ])
    );
});

global.photoGallery = global.photoGallery || [];

bot.on('photo', async (ctx) => {
    try {
        const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        const fileLink = await ctx.telegram.getFileLink(fileId);
        
        global.photoGallery.push({
            url: fileLink.href,
            date: new Date()
        });
        ctx.reply('✅ تم حفظ الصورة بنجاح في الخزنة.');
    } catch (e) {
        ctx.reply('❌ خطأ في الحفظ.');
    }
});

const app = express();
app.use(cors()); // هذا السطر هو الأهم لحل مشكلة الاتصال

app.get('/api/photos', (req, res) => {
    res.json(global.photoGallery);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is live`));
bot.launch();
