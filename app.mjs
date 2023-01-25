import { Markup, Telegraf, session } from 'telegraf';
import axios, { Axios } from 'axios';
import { getCoinURL } from './URL/getCoinURL.mjs';
import { getStartMenu, getStopTimer, selectTimercoin } from './funcshions/function.mjs';
import { writeFile, readFileSync, writeFileSync } from 'node:fs';
import dotenv from 'dotenv'
dotenv.config();

const bot = new Telegraf(process.env.TOKEN);

bot.use(session())
bot.use((ctx, next) => {

   if (ctx.session == undefined) {
      ctx.session = { data: [] };
   }

   ctx.replayStartMenu = () => {
      ctx.reply('to see the rate of your cryptocurrency, just write!', getStartMenu())
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

bot.action('15min', async ctx => {

   if (ctx.session.data.timecoin === undefined) {
      ctx.reply('something is wrong !');
   }
   if (ctx.session.data.timecoin !== undefined) {
      let receiveCoin = await getCoinURL(ctx.session.data.timecoin);
      ctx.session.data.timerId = setInterval(() => {
         console.log(ctx.session.data.timecoin)
         ctx.reply(`${ctx.session.data.timecoin}| USD ${receiveCoin} $`, getStopTimer());
      }, 60 * 15)
   } else {
      ctx.reply('для старта напиши "/timer" и напиши свою "coin"!\n пример ниже: ↓', selectTimercoin());

   }
});


bot.action('30min', async ctx => {

   if (ctx.session.data.timecoin === undefined) {
      ctx.reply('something is wrong !');
   }
   if (ctx.session.data.timecoin !== undefined) {
      let receiveCoin = await getCoinURL(ctx.session.data.timecoin);
      ctx.session.data.timerId = setInterval(() => {
         console.log(ctx.session.data.timecoin)
         ctx.reply(`${ctx.session.data.timecoin}| USD ${receiveCoin} $`, getStopTimer());
      }, 60000 * 30)
   } else {
      ctx.reply('для старта напиши "/timer" и напиши свою "coin"!\n пример ниже: ↓', selectTimercoin());

   }
});

bot.action('1h', async ctx => {

   if (ctx.session.data.timecoin === undefined) {
      ctx.reply('something is wrong !');
   }
   if (ctx.session.data.timecoin !== undefined) {
      let receiveCoin = await getCoinURL(ctx.session.data.timecoin);
      ctx.session.data.timerId = setInterval(() => {
         console.log(ctx.session.data.timecoin)
         ctx.reply(`${ctx.session.data.timecoin}| USD ${receiveCoin} $`, getStopTimer());
      }, 60000 * 60)
   } else {
      ctx.reply('для старта напиши "/timer" и напиши свою "coin"!\n пример ниже: ↓', selectTimercoin());

   }
});

bot.hears('TIMER STOP', ctx => {
   clearInterval(ctx.session.data.timerId)
   ctx.reply('timer stopped! \n\n to see the rate of your cryptocurrency, just write!', getStartMenu());
});

//*************************************************************************************************** 

bot.hears('start crypto alarm', ctx => {
   ctx.reply('для старта напиши  "/alarm"  и напиши свою "coin" и "Numbers" !');
});

bot.command('/alarm', ctx => {
   let array = ctx.message.text.split(' ')
   console.log(array)
   let summa = array[2]
   let coin = array[1]

   ctx.session.data.timecoin = ctx.session.data.timecoin.toUpperCase()
   console.log(coin)
   ctx.reply('/start alarm`' `ждем ${summa}$ по ${ctx.session.data.timecoin} `)
});




// const alarm = function (coin, summa) {
//    let number = await getCoinURL(coin);
//    let alarm = setInterval(() => {
//       if (number == summa) { }
//    }
//    )
// }


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