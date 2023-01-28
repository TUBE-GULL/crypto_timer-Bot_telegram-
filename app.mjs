import { Markup, Telegraf, session } from 'telegraf';
import axios, { Axios } from 'axios';
import { getCoinURL } from './URL/getCoinURL.mjs';
import { getStartMenu, getStopTimer, selectTimercoin, selectAlarmcoin, getStopAlarm } from './funcshions/function.mjs';
import { writeFile, readFileSync, writeFileSync } from 'node:fs';
import dotenv from 'dotenv'
dotenv.config();

const bot = new Telegraf(process.env.TOKEN);
const TIMERS = ['15min', '30min', '1h']
const ALARM = ['up', 'down'];




bot.use(session())
bot.use((ctx, next) => {

   if (ctx.session == undefined) {
      ctx.session = { data: [] };
   }

   ctx.replayStartMenu = () => {
      ctx.reply('to see  the rate of your cryptocurrency, just write!', getStartMenu())
   }

   ctx.startTimer = async (coin, interval) => {

      if (coin === undefined) {
         ctx.reply('something is wrong !');
      }
      if (coin !== undefined) {
         ctx.session.data.timerId = setInterval(async () => {
            let receiveCoin = await getCoinURL(coin);
            ctx.reply(`${coin}| USD ${receiveCoin} $`, getStopTimer());
         }, interval)
      } else {
         ctx.reply(`first write "/timer"⏱ and write your "coin" !\n\n example below: 👇`, selectTimercoin())
      }
   }

   return next()
})

bot.telegram.setMyCommands([
   { command: 'alarm', description: 'first write "/alarm"⏰ and write your "coin"🪙 and "Numbers" !' },
   { command: 'timer', description: 'first write "/timer"⏱ and write your "coin" !' },
   { command: 'help', description: 'описание команды ' }
])

bot.start(async ctx => {

   const chat_id = ctx.message.chat.id;
   const foundUser = ctx.session.data.find(i => i.id == chat_id);

   if (foundUser == undefined) {
      ctx.session.data.push({
         id: chat_id,
      });
   }

   await ctx.replyWithHTML('Hello my friend ! 😏\n\n' +
      'to see 👁 the rate of your cryptocurrency 🪙, just write!', getStartMenu());

   return ctx.reply('💻')
});

bot.on('edited_message', async ctx => {
   await ctx.reply('You have successfully modified the message 👍');

   return ctx.replyWithSticker()
});

//*************************************************************************************************** 

bot.hears('⏱ start crypto timer', async ctx => {
   await Promise.all([
      ctx.reply('first write "/timer"⏱ and write your "coin" !', selectTimercoin()),
      ctx.replyWithSticker("CAACAgIAAxkBAAEcc3Zj051QFBnH2JYGW5Z2uTE3csBHXAACJgMAApzW5wpVzm400GJTXi0E"),
   ])
   return ctx.reply('example below: 👇')
});

bot.command('/timer', async ctx => {
   if (ctx.message.text === '/timer') {
      ctx.reply('something is wrong ! try once more\n\n "first write "/timer"⏱ and write your "coin" !"')
   } else {
      let array = ctx.message.text.split(' ');
      ctx.session.data.timecoin = array[1]
      ctx.session.data.timecoin = ctx.session.data.timecoin.toUpperCase()
      console.log(ctx.session.data.timecoin)

      if (await getCoinURL(ctx.session.data.timecoin) === undefined) {
         ctx.reply('something is wrong ! try once more\n\n "first write "/timer"⏱ and write your "coin" ! "')
      } else {
         ctx.reply(`select a timer⏱ ${ctx.session.data.timecoin}USD $ 🪙`, {
            reply_markup: {
               inline_keyboard: [[
                  { text: "15min⏳", callback_data: '15min' },
                  { text: "30min⏳", callback_data: '30min' },
                  { text: "1h⏳", callback_data: '1h' }
               ]]
            }
         })
      }
   }
});

bot.action(TIMERS, async ctx => {
   const intervalString = ctx.callbackQuery.data;
   let intervalNumber = Number(intervalString.match(/\d+/));
   if (intervalNumber !== undefined) {
      ctx.replyWithSticker("CAACAgIAAxkBAAEcc5Zj06Dgl73TJhnSKLGX-HGVt1ZSbgAC4QADVp29ClvBlItA-NOgLQQ")
      // ctx.reply('🚀 start timer ⏱')
   }
   if (intervalString.endsWith('min')) {
      intervalNumber = intervalNumber * 60 * 1000;
   } else if (intervalString.endsWith('h')) {
      intervalNumber = intervalNumber * 60 * 60 * 1000;
   }
   ctx.startTimer(ctx.session.data.timecoin, intervalNumber)
   await ctx.answerCbQuery();
});

bot.hears('TIMER STOP', ctx => {
   clearInterval(ctx.session.data.timerId)
   ctx.reply('timer stopped! \n\n to see the rate of your cryptocurrency, just write!', getStartMenu());
});

//*************************************************************************************************** 

bot.hears('⏰ start crypto alarm', async ctx => {
   await Promise.all([
      ctx.reply('first write "/alarm"⏰ and write your "coin"🪙 and "Numbers" !', selectAlarmcoin()),
      ctx.replyWithSticker("CAACAgIAAxkBAAEcc3Zj051QFBnH2JYGW5Z2uTE3csBHXAACJgMAApzW5wpVzm400GJTXi0E"),
   ])
   return ctx.reply('example below: 👇')
});

bot.command('/alarm', async ctx => {
   const message = ctx.message.text.replace('\/alarm', '');
   const regex = message.match(/([a-zA-Z]+) (\d+)/);

   if (regex) {
      ctx.session.data.alarmcoin = regex[1].toUpperCase()

      ctx.session.data.alarminterval = regex[2]

      if (await getCoinURL(ctx.session.data.alarmcoin) !== undefined) {
         ctx.reply(`launch  ${ctx.session.data.alarminterval}$ ${ctx.session.data.alarmcoin} \n\n select: \n\n in up ↑ ( ${ctx.session.data.alarminterval}$) \n\n in down ↓( ${ctx.session.data.alarminterval}$)`, {
            reply_markup: {
               inline_keyboard: [[
                  { text: 'in up ↑', callback_data: 'up' },
                  { text: 'in down ↓', callback_data: 'down' },
               ]]
            }
         })
      }
   } else {
      return ctx.reply('oops ! \n\n first write "/alarm"⏰ and write your "coin"🪙 and "Numbers" !', selectAlarmcoin());
   }
});

bot.action(ALARM, async ctx => {

   try {
      let downUp = ctx.callbackQuery.data;
      let interval = ctx.session.data.alarminterval

      if (downUp !== undefined) {
         ctx.replyWithSticker("CAACAgIAAxkBAAEcc5Zj06Dgl73TJhnSKLGX-HGVt1ZSbgAC4QADVp29ClvBlItA-NOgLQQ")
         // ctx.reply('start alarm')
      }
      ctx.session.data.alarmId = setInterval(async () => {
         let receiveCoin = await getCoinURL(ctx.session.data.alarmcoin)
         let choice;
         console.log('start alarm')
         if (downUp === 'up') {
            choice = receiveCoin >= interval
         } else if (downUp === 'down') {
            choice = receiveCoin <= interval

         }
         if (choice) {
            ctx.reply(` USD ${receiveCoin} $`, getStopAlarm());
         }
      }, 60000 * 5)

      await ctx.answerCbQuery();
   }
   catch { (error) => console.log(error) };
});

bot.hears('ALARM STOP', ctx => {
   clearInterval(ctx.session.data.alarmId)
   ctx.reply('alarm stopped! \n\n to see the rate of your cryptocurrency, just write!', getStartMenu());
});

bot.on('text', async ctx => {
   let text = ctx.message.text
   text = text.toUpperCase()
   let coin = await getCoinURL(text);
   if (coin === undefined) {
      ctx.reply(`I do not understand you  ${text} \n\n to see  the rate of your cryptocurrency, just write!`, getStartMenu())
   }
   if (coin !== undefined) {
      return ctx.reply(`${text}| USD ${coin} $`)
   }
});

bot.on('sticker', async ctx => {
   return ctx.replyWithSticker("CAACAgEAAxkBAAEcc1pj05vXCMZsS-g1bI3tVOZBtckkbAACCAADmAABGU_EmbBI082LWy0E")
})

bot.command('/help', async ctx => {
   ctx.reply('to see  the rate of your cryptocurrency, just write!', getStartMenu())
})

bot.launch()
   .then((res) => console.log('bot start !'))
   .catch((error) => console.log(error));
console.log('bot start !')