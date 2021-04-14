# Tsatu-answer-collector (Tampermonkey script) (for moodle v3.2 - 3.8.5)
 Скрипт помощи с ответами на портале ТГАТУ (ТДАТУ)
- для освітнього порталу - op.tsatu.edu.ua 

Required [Tampermonkey](https://tampermonkey.net/) or [Greasemonkey](https://www.greasespot.net/) or [Violentmonkey](https://violentmonkey.github.io/get-it/) or another browser extension for userscript support.
Tampermonkey: 
- [Mozilla Firefox](https://addons.mozilla.org/firefox/addon/tampermonkey/)
- [Google Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [Opera](https://addons.opera.com/extensions/details/tampermonkey-beta/)
- [Apple Safari](https://tampermonkey.net/?ext=dhdg&browser=safari).
- [Dolphin](https://tampermonkey.net/?ext=dhdg&browser=dolphin).
- [UC Browser](https://tampermonkey.net/?ext=dhdg&browser=ucweb)

## Установка / Installing
[Install script / Установить скрипт](https://raw.githubusercontent.com/vladgba/Tsatu-answer-collector/master/script.user.js)

## Настройки / Settings
var haymaking = false;
- enable automatic collection of answers from "mod/quiz/view.php" page
- включить автоматический сбор ответов из "mod/quiz/view.php" страницы

var haymlist = false;
- automatic collection from course (works if haymaking is enabled)
- автоматический сбор с курса (работает, если включен haymaking)

var autonext = false;
- automatically selects the answer and presses the "next" button
- автоматически выбирает ответ и нажимает кнопку "Далее"
