# Tsatu-answer-collector (Tampermonkey script)
nip.js для навчально-інформаційного порталу
op.js для освітнього порталу

## Installing
1. Install the Chrome/Firefox plugin
[Mozilla Firefox](https://addons.mozilla.org/ru/firefox/addon/tampermonkey/)
[Google Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
[Opera](https://addons.opera.com/ru/extensions/details/tampermonkey-beta/)
[Apple Safari](https://tampermonkey.net/?ext=dhdg&browser=safari).
[Dolphin](https://tampermonkey.net/?ext=dhdg&browser=dolphin)
[UC Browser](https://tampermonkey.net/?ext=dhdg&browser=ucweb)
2. Click on the extension icon and select "New script ..."
3. Copy the contents of the file "script.js"
4. Save (Ctrl - S)

## Установка
1. Установите расширение "Tampermonkey"
[Mozilla Firefox](https://addons.mozilla.org/ru/firefox/addon/tampermonkey/)
[Google Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
[Opera](https://addons.opera.com/ru/extensions/details/tampermonkey-beta/)
[Apple Safari](https://tampermonkey.net/?ext=dhdg&browser=safari).
[Dolphin](https://tampermonkey.net/?ext=dhdg&browser=dolphin).
[UC Browser](https://tampermonkey.net/?ext=dhdg&browser=ucweb)
2. Нажмите на иконку расширения и выберите "Создать новый скрипт..."
3. Вставьте содержимое файла "script.js"
4. Сохраните (Ctrl - S)
----------
## Команды
	Q - клавиша «Предыдущая»
	W - выделить правильные / неправильные ответы (+ показать процент совпадения с ответами в базе)
	E - клавиша «Далее»
	R - случайная ответ и клавиша «Далее»
	T - Добавить ответы в базу (LocalStorage)

	A - Вернуться к тесту
	S - Нажать «Отправить все и завершить» (в /quiz/summary.php)
	D - Нажать «Подтвердить окончания теста» (в /quiz/summary.php)
 
	F - Сохранить ответы в файл
	G - Показать / скрыть форму загрузки файла с ответами
 
	L - автозаполнение логина и пароля (в / login /) // устанавливается в начале скрипта
------------

## Команди
	Q - клавіша «Попередня»
	W - виділити правильні / неправильні відповіді (+ показати відсоток збігу з відповідями в базі)
	E - клавіша «Далі»
	R - Випадкова відповідь і клавіша «Далі»
	T - Додати відповіді в базу (LocalStorage)
 
	A - Повернутися до тесту
	S - Натиснути «Відправити все та завершити» ( в /quiz/summary.php )
	D - Натиснути «Підтвердити закінчення тесту»  ( в /quiz/summary.php)
 
	F - Зберегти відповіді в файл
	G - Показати / сховати форму завантаження файлу з відповідями
 
	L - автозаповнення логіна і пароля ( в /login/ ) // встановлюється на початку файлу
------------
 
## Commands
	Q - "Previous" key
	W - highlight correct / incorrect answers (+show the percentage of matches with the answers in the database)
	E - Next key
	R - Random answer and "Next" key
	T - Add answers to db (LocalStorage)
 
	A - Back to test
	S - Click "Submit all and complete" (in /quiz/summary.php)
	D - Click "Confirm test completion" (in /quiz/summary.php)
	
	F - Save the answers to a file
	G - Show / hide the answer file download form

	L - autocomplete login and password (in / login /) // is set at the beginning of the file
  
  ## Настройка
  
    var userlogin = '',  -  Логин для быстрого входа
        userpass = '';  -  Пароль для быстрого входа
        
    var autoview = true,//true  -  Автоматически подсвечивать и выбирать ответы (true - да) (false - нет)
        autopressnext = true;//false  -  Автоматическое нажатие кнопки "Далее" (true - да) (false - нет)
