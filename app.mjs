import { Markup, Telegraf, session } from 'telegraf';
import axios, { Axios } from 'axios';
import { getCoinURL } from './URL/getCoinURL.mjs';
import { getStartMenu, getStopTimer, selectTimercoin, selectAlarmcoin, getStopAlarm } from './funcshions/function.mjs';
import { writeFile, readFileSync, writeFileSync } from 'node:fs';
import dotenv from 'dotenv'
dotenv.config();

const bot = new Telegraf(process.env.TOKEN);
const TIMERS = ['15min', '30min', '1h']



bot.use(session())
bot.use((ctx, next) => {

   if (ctx.session == undefined) {
      ctx.session = { data: [] };
   }

   ctx.replayStartMenu = () => {
      ctx.reply('to see the rate of your cryptocurrency, just write!', getStartMenu())
   }

   ctx.startTimer = async (coin, interval) => {

      if (coin === undefined) {
         ctx.reply('something is wrong !');
      }
      if (coin !== undefined) {
         let receiveCoin = await getCoinURL(coin);
         ctx.session.data.timerId = setInterval(() => {
            console.log(coin)
            ctx.reply(`${coin}| USD ${receiveCoin} $`, getStopTimer());
         }, interval)
      } else {
         ctx.reply('для старта напиши "/timer" и напиши свою "coin"!\n пример ниже: ↓', selectTimercoin());

      }
   }


   return next()
})



bot.start(ctx => {

   const chat_id = ctx.message.chat.id;
   const foundUser = ctx.session.data.find(i => i.id == chat_id);

   if (foundUser == undefined) {
      ctx.session.data.push({
         id: chat_id,
      });
   }

   return ctx.replyWithHTML('I represent you in Crypto Timers !\n\n' +
      'to see the rate of your cryptocurrency, just write!', getStartMenu());
});

bot.on('edited_message', ctx => {
   ctx.reply('Вы успешно изменили сообщение');
});

//*************************************************************************************************** 

bot.hears('start crypto timer', ctx =>
   ctx.reply('для старта напиши "/timer" и напиши свою "coin"!\n пример ниже:', selectTimercoin())
);

bot.command('/timer', async ctx => {
   if (ctx.message.text === '/timer') {
      ctx.reply('something is wrong ! try once more\n\n "для старта напиши "/timer" и напиши свою "coin"! "')
   } else {
      let array = ctx.message.text.split(' ');
      ctx.session.data.timecoin = array[1]
      ctx.session.data.timecoin = ctx.session.data.timecoin.toUpperCase()
      console.log(ctx.session.data.timecoin)
      if (await getCoinURL(ctx.session.data.timecoin) === undefined) {
         ctx.reply('something is wrong ! try once more\n\n "для старта напиши "/timer" и напиши свою "coin"! "')
      } else {
         ctx.reply(`timer ${ctx.session.data.timecoin}USD`, {
            reply_markup: {
               inline_keyboard: [[
                  { text: "15min", callback_data: '15min' },
                  { text: "30min", callback_data: '30min' },
                  { text: "1h", callback_data: '1h' }
               ]]
            }
         })
      }
   }
});

bot.action(TIMERS, async ctx => {
   const intervalString = ctx.callbackQuery.data;
   let intervalNumber = Number(intervalString.match(/\d+/));

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

bot.hears('start crypto alarm', ctx => {
   ctx.reply('для старта напиши  "/alarm"  и напиши свою "coin" и "Numbers" !', selectAlarmcoin());
});

bot.command('/alarm', ctx => {
   if (ctx.message.text === '/alarm') {
      ctx.reply('что то не так попробуй снова \n\n для старта напиши  "/alarm"  и напиши свою "coin" и "Numbers"! \n\n ', selectAlarmcoin());
   } else {
      let array = ctx.message.text.split(' ')
      console.log(array)
      ctx.session.data.alarminterval = array[2]
      ctx.session.data.alarmcoin = array[1]

      ctx.session.data.alarmcoin = ctx.session.data.alarmcoin.toUpperCase()
      console.log(ctx.session.data.alarmcoin)
      if (ctx.session.data.alarminterval === undefined) {
         ctx.reply('ты зыбыл "Numbers" \n\n для старта напиши  "/alarm"  и напиши свою "coin" и "Numbers" !', selectAlarmcoin());
      } else {
         ctx.reply(`запустить  ${ctx.session.data.alarminterval}$ ${ctx.session.data.alarmcoin} `, {
            reply_markup: {
               inline_keyboard: [[
                  { text: 'START', callback_data: '/start_ALER' },
               ]]
            }
         })
      }
   }
});

bot.action('/start_ALER', async ctx => {
   let receiveCoin = await getCoinURL(ctx.session.data.alarmcoin)
   let interval = ctx.session.data.alarminterval

   if (interval === undefined) {
      ctx.reply('что то не так попробуй снова \n\n для старта напиши  "/alarm"  и напиши свою "coin" и "Numbers" !');
   }
   if (interval !== undefined) {
      ctx.session.data.alarmId = setInterval(() => {
         if (receiveCoin <= interval) {
            console.log('start')
            ctx.reply(` USD ${receiveCoin} $`, getStopAlarm());
         }
      }, 60000)
   }

});


bot.hears('ALARM STOP', ctx => {
   clearInterval(ctx.session.data.timerId)
   ctx.reply('alarm stopped! \n\n to see the rate of your cryptocurrency, just write!', getStartMenu());
});


bot.on('text', async ctx => {
   let text = ctx.message.text
   text = text.toUpperCase()
   let coin = await getCoinURL(text);
   if (coin !== undefined) {
      return ctx.reply(`${text}| USD ${coin} $`)
   }
});

bot.command('text', ctx => {
   ctx.reply(String(new Date()))
});

bot.launch()
   .then((res) => console.log('bot start !'))
   .catch((error) => console.log(error));
console.log('bot start !')