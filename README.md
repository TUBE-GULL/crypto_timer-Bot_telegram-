решил выкладывать на git  свою разработку 

так как сильно интересуюсь криптой решил написать довольно простого бота.

Основной функционал бота  это вывод курса крипта валют по запросу с двумя функциями  
1)таймер вывод курса периодически с определённым интервалом времени 
2)это своего рода будильник пользователь задает крипту и водит ожидаемую сумму , как только цена достигнет ее бот начнет делать уведомлять user 

beta 0.0.1 выполнена работа 

была добавлена основная логика бота
1) функцию по запросу пользователя получать курс нужной coin  через url  
2)  набросок основных функций 

    2.1) это функция таймера 
    2.2) это функция будильника  


Beta 0.0.2 выполнялась работа 
1) добавил работа таймера + проверку перед стартом таймера  
2) добавил привязку таймера и coin к пользователю по id


Beta 0.0.3 выполнялась работа 

1) был сокращен код  до одной функции  которая использует массив с нужными значениями 
2) наброшена функционал будильника пока пробный 

Beta 0.0.4 выполнялась работа 

1)сделана функция будильника с тестами  
2) еще пару мелких поправок 