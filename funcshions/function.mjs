import { Markup } from "telegraf";
import { writeFile, readFileSync, writeFileSync } from 'node:fs';

export function getStartMenu() {
   return Markup.keyboard([
      '⏰ start crypto alarm ', '⏱ start crypto timer ',
   ]).resize()
};


export function getStopTimer() {
   return Markup.keyboard([
      'TIMER STOP'
   ]).resize()
}

export function selectTimercoin() {
   return Markup.keyboard(
      ['/timer btc',
         '/timer eth',
         '/timer bit'
      ]
   ).resize()
}

export function selectAlarmcoin() {
   return Markup.keyboard(
      ['/alarm btc 10000',
         '/alarm btc 50000',
         '/alarm btc 100000'
      ]
   ).resize()
}

export function getStopAlarm() {
   return Markup.keyboard([
      'ALARM STOP'
   ]).resize()
}


export function readDataObject() {
   const fileData = readFileSync('./data/data.json', 'utf-8');
   const array = JSON.parse(fileData);

   return array;
}

