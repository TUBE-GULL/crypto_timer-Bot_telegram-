import { Markup, Telegraf } from 'telegraf';
import axios, { Axios } from 'axios';
import { getCoinURL } from './URL/getCoinURL.mjs';
import { getStartMenu, getStopTimer } from './funcshions/start.mjs';
import { writeFile, readFileSync, writeFileSync } from 'node:fs';
import { start } from 'node:repl';
// import { } from './funcshions/alarm.mjs'
// import { } from './funcshions/timer.mjs'


const bot = new Telegraf(process.env.TOKEN);
console.log(process.env.TOKEN)

let coin;
let timerId;

bot.start(ctx => {
   return ctx.replyWithHTML('I represent you in Crypto Timers !\n\n' +
      'to see the rate of your cryptocurrency, just write!', getStartMenu());
});

bot.on('edited_message', ctx => {
   ctx.reply('Вы успешно изменили сообщение');
});

//***************************************************************************************************

bot.hears('start crypto timer', ctx =>
   ctx.reply('для старта напиши "/timer" и напиши свою "coin"!\n пример ниже:',
      Markup.keyboard([
         '/timer btc'
      ]).resize()
   )
);

bot.command('/timer', async ctx => {
   if (ctx.message.text === '/timer') {
      ctx.reply('something is wrong ! try once more\n\n "для старта напиши "/timer" и напиши свою "coin"! "')
   } else {
      let array = ctx.message.text.split(' ');
      coin = array[1]
      coin = coin.toUpperCase()
      console.log(coin)
      if (await getCoinURL(coin) === undefined) {
         ctx.reply('something is wrong ! try once more\n\n "для старта напиши "/timer" и напиши свою "coin"! "')
      } else {
         ctx.reply(`timer ${coin}USD`, {
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
   let giveCoin = await getCoinURL(coin)
   timerId = setInterval(() => {
      console.log(coin)
      ctx.reply(`${coin}| USD ${giveCoin} $`, getStopTimer())
   }, 600 * 15)
})



bot.action('30min', ctx => {
   ctx.reply(`30 min ${coin} `);
   console.log(`30 min ${coin} `);
});

bot.action('1h', ctx => {
   ctx.reply(`1h ${coin} `)
   console.log(`1h ${coin} `)
});

bot.hears('TIMER STOP', ctx => {
   ctx.reply(`timer stopped!`, clearInterval(timerId))
})

// bot.command('timer stopped!!', ctx => {
//    ctx.reply('to see the rate of your cryptocurrency, just write!', getStartMenu())
// })
//***************************************************************************************************

bot.hears('start crypto alarm', ctx => {
   ctx.reply('для старта напиши  "/alarm"  и напиши свою "coin" и "Numbers" !');
});

bot.command('/alarm', ctx => {
   let array = ctx.message.text.split(' ')
   console.log(array)
   let summa = array[2]
   let coin = array[1]

   coin = coin.toUpperCase()
   console.log(coin)
   ctx.reply(`ждем ${summa}$ по ${coin} `)
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