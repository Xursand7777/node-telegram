const { Telegraf } = require('telegraf');
const cron = require('node-cron');

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error('BOT_TOKEN не задан!');
const bot = new Telegraf(BOT_TOKEN);

// Храним ID групп, куда был добавлен бот
let groupIds = new Set();

// При добавлении в группу
bot.on('new_chat_members', (ctx) => {
    groupIds.add(ctx.chat.id);
    ctx.reply('Привет! Я буду отправлять напоминания каждые 2 часа 📢');
});

// При запуске вручную (можно использовать команду)
bot.command('start', (ctx) => {
    if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
        groupIds.add(ctx.chat.id);
        ctx.reply('Бот активирован в этой группе!');
    } else {
        ctx.reply('Добавь меня в группу, чтобы получать напоминания!');
    }
});

// Каждые 2 часа по UTC
cron.schedule('0 */2 * * *', () => {
    groupIds.forEach((chatId) => {
        bot.telegram.sendMessage(chatId, '⏰ Напоминание: Не забудьте сделать важное!');
    });
});

bot.launch();
console.log('Бот запущен...');
