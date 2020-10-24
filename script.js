// ==UserScript==
// @name nip+op.Tsatu-v2
// @description Tsatu
// @author vladgba
// @license MIT
// @version 1.0
// @include http://nip.tsatu.edu.ua/*
// @include http://op.tsatu.edu.ua/*
// ==/UserScript==
(function() {
    'use strict';
    var userlogin = '',
        userpass = '';
    var autoview = true,//true
        autopressnext = true;//false
    var w;
    var Questions;
    if (typeof unsafeWindow != undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self != w.top) {
        return;
    }
    /*
    Block - q [a ra ba]
    */
    function unique(arr) {
        let result = [];
        for (let str of arr) {
            if (!result.includes(str)) {
                result.push(str);
            }
        }
        return result;
    }

    function filterQue(que) {
        var ids = que.querySelectorAll('[id]');
        ids.forEach(function(v, i, array) {
            if(v.hasAttribute('id')) {
                v.removeAttribute('id');
            }
        });
        return que.innerHTML.trim().replace(/\.$/, '');
    }

    function filterAnswer(el) {
        var anb = el.querySelector('span.answernumber');
        if (anb) {
            anb.remove();
        }
        anb=null;
        var a=el.querySelector('label').innerHTML;
        return a.replace(/^([a-z])\. /, '').trim().replace(/\.$/, '');
    }

    function filterBlocks(arr) {
        arr.forEach(function(cval, i, array) {
            cval[1] = unique(cval[1]);
            cval[2] = unique(cval[2]);
            cval[3] = unique(cval[3]);
        });
        return arr;
    }

    function mergeBlocks(a, b) {
        var result = Array();
        var i, j;
        var addThis = true;
        if (b == null) b = Array();
        for (i = 0; i < a.length; i++) {
            addThis = true;
            for (j = 0; j < b.length; j++) {
                if (addThis) {
                    if (b[j][0].includes(a[i][0])) {
                        b[j][1] = b[j][1].concat(a[i][1]);
                        b[j][2] = b[j][2].concat(a[i][2]);
                        b[j][3] = b[j][3].concat(a[i][3]);
                        addThis = false;
                    }
                }
            }
            if (addThis) {
                result.push(a[i]);
            }
        }
        return result.concat(b);
    }

    function createView() {
        var canvas = document.createElement("canvas");
        canvas.id = 'canv';
        canvas.style = "border:black solid;display:none;";
        document.body.appendChild(canvas);
        return canvas;
    }

    function getImg(c, im) {
        var context = c.getContext('2d');
        if (!im.complete) {
            im.addEventListener('load', function(e) {
                return done();
            });
        } else {
            return done();
        }

        function done() {
            c.width = im.width;
            c.height = im.height;
            context.drawImage(im, 0, 0);
            console.log(c.toDataURL());
            return c.toDataURL();
        }
    }

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    function levenshtein(s1, s2, costs) {
        var i, j, l1, l2, flip, ch, chl, ii, ii2, cost, cutHalf;
        l1 = s1.length;
        l2 = s2.length;
        costs = costs || {};
        var cr = costs.replace || 1;
        var cri = costs.replaceCase || costs.replace || 1;
        var ci = costs.insert || 1;
        var cd = costs.remove || 1;
        cutHalf = flip = Math.max(l1, l2);
        var minCost = Math.min(cd, ci, cr);
        var minD = Math.max(minCost, (l1 - l2) * cd);
        var minI = Math.max(minCost, (l2 - l1) * ci);
        var buf = new Array((cutHalf * 2) - 1);
        for (i = 0; i <= l2; ++i) {
            buf[i] = i * minD;
        }
        for (i = 0; i < l1; ++i, flip = cutHalf - flip) {
            ch = s1[i];
            chl = ch.toLowerCase();
            buf[flip] = (i + 1) * minI;
            ii = flip;
            ii2 = cutHalf - flip;
            for (j = 0; j < l2; ++j, ++ii, ++ii2) {
                cost = (ch === s2[j] ? 0 : (chl === s2[j].toLowerCase()) ? cri : cr);
                buf[ii + 1] = Math.min(buf[ii2 + 1] + cd, buf[ii] + ci, buf[ii2] + cost);
            }
        }
        return buf[l2 + cutHalf - flip];
    }

    function svcIconRemove(part) {
        var img = part.querySelectorAll('.questioncorrectnessicon, i .icon');
        if (img.length > 0) {
            img.forEach((im) => {
                im.remove();
            });
        }
    }

    function filterImgs(part) {
        var img = part.querySelectorAll('img');
        if (img.length > 0) {
            console.log(img);
            img.forEach((im) => {
                im.outerHTML = '[[' + getImg(createView(), im) + ']]';
            });
        }
        return part;
    }

    function takeAnswers(part) {
        return part.querySelectorAll('.formulation .r0, .formulation .r1');
    }

    function loadDB() {
        return JSON.parse(localStorage.getItem('testgb'));
    }

    function filterRightanswer(text) {
        var res = filterImgs(text).innerHTML;
        res = res.replace(new RegExp('Правильна відповідь: '), '').replace(new RegExp('Ваша відповідь (не )?правильна'), '');
        res = res.replace(new RegExp('Правильні відповіді: '), '');
        res = res.replace(new RegExp('The correct answer is: '), '');
        res = res.replace(new RegExp('The correct answers are: '), '');
        return res.replace(/^([a-z])\. /, '').trim().replace(/\.$/, '');
    }

    function detectMultiAnswer(answer) {
        if (answer.search(new RegExp('The correct answers are: ')) || answer.search(new RegExp('Правильні відповіді: '))) {
            return true;
        }
        return false;
    }
    /*          _ _           _
               | | |         | |
       ___ ___ | | | ___  ___| |_
      / __/ _ \| | |/ _ \/ __| __|
     | (_| (_) | | |  __/ (__| |_
      \___\___/|_|_|\___|\___|\__|
    */
    function parseFinish() {
        var content = [];
        Questions = document.querySelectorAll('.que');
        Questions.forEach((part) => {
            svcIconRemove(part);
            filterImgs(part);
            var ans = new Array();
            //Patch v1.2.2
            //.replace(/<[^>]+>/g,'')
            var Question = filterQue(part.querySelector('.formulation .qtext'));
            var Answers = part.querySelectorAll('.formulation .r0, .formulation .r1');
            var RightAnswered = new Array();
            var NonRightAnswered = new Array();
            Answers.forEach((el) => {
                filterImgs(el);
                var answ = filterAnswer(el);
                //incorrect
                if (el.classList.contains('incorrect')) {
                    NonRightAnswered.push(answ);
                }
                //correct
                if (el.classList.contains('correct')) {
                    RightAnswered.push(answ);
                }
                //check grade
                if (el.querySelector('input[checked="checked"]')) {
                    var grade = part.querySelector('.grade').innerHTML;
                    if ((grade.localeCompare('Балів 1,00 з 1,00')) == 0) {
                        RightAnswered.push(answ);
                    }
                    if ((grade.localeCompare('Балів 0,00 з 1,00')) == 0) {
                        NonRightAnswered.push(answ);
                    }
                    if ((grade.localeCompare('Mark 1.00 out of 1.00')) == 0) {
                        RightAnswered.push(answ);
                    }
                    if ((grade.localeCompare('Mark 0.00 out of 1.00')) == 0) {
                        NonRightAnswered.push(answ);
                    }
                }
                ans.push(answ);
            });
            var RightAnswer = part.querySelector('.rightanswer');
            if (RightAnswer == null) {
                //bad luck
            } else {
                RightAnswered.push(filterRightanswer(RightAnswer));
            }
            content.push([Question, ans, RightAnswered, NonRightAnswered]);
        });
        return content;
    }
    ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////
    /*_     _       _     _ _       _     _
     | |   (_)     | |   | (_)     | |   | |
     | |__  _  __ _| |__ | |_  __ _| |__ | |_
     | '_ \| |/ _` | '_ \| | |/ _` | '_ \| __|
     | | | | | (_| | | | | | | (_| | | | | |_
     |_| |_|_|\__, |_| |_|_|_|\__, |_| |_|\__|
               __/ |           __/ |
              |___/           |___/
    */
    function highlightRightAnswers(pressnx) {
        var parts = document.querySelectorAll('.que');
        var localAnswers = getDB();
        parts.forEach((part) => {
            svcIconRemove(part);
            filterImgs(part);
            //Selectors
            var Quest = part.querySelector('.formulation .qtext');
            console.log('Question check:');
            var Question = filterQue(Quest);
            console.log(Question);
            console.log('@@@@@@@@');

            var Answers = part.querySelectorAll('.formulation .r0, .formulation .r1');
            var answinpttext = part.querySelector('input[type="text"]');
            /*                        _
                                     | |
              ___  ___  __ _ _ __ ___| |__
             / __|/ _ \/ _` | '__/ __| '_ \
             \__ \  __/ (_| | | | (__| | | |
             |___/\___|\__,_|_|  \___|_| |_|
            */
            var queSelected = false;
            var answSelected = Array();
            if(localAnswers.length>0) {
                for (var i = 0; i < localAnswers.length; i++) {
                    if ((Question.localeCompare(xQue(localAnswers[i]))) == 0) {
                        console.log(xQue(localAnswers[i]));
                        Quest.style = "background:#00ff0c";
                        queSelected = true;
                        answSelected = localAnswers[i];
                        console.log("Answers:");
                        console.log(xpAnsw(answSelected));
                        if (answinpttext != null) {
                            answinpttext.value = xpAnsw(answSelected)[0];
                        }
                        break;
                    } else {
                        //No answer found
                        Quest.style = "background:#00fffb;";
                    }
                }
            }
            var clicked = false;
            if (queSelected) {
                Answers.forEach((el) => {
                    var answch = el.querySelector('input');
                    var answo = el.querySelector('label');
                    console.log('----------');
                    filterImgs(answo);
                    var answ = filterAnswer(el);
                    console.log(answ);
                    var i;
                    for (i = 0; i < xpAnsw(answSelected).length; i++) {
                        console.log(xpAnsw(answSelected)[i]);
                        if ((answ.localeCompare(xpAnsw(answSelected)[i])) == 0) {
                            if (answinpttext == null) {
                                answch.click();
                            }
                            //correct answer
                            console.log('Find+++');
                            part.classList.add('answerednow');
                            answo.style = "background:#00ff0c";
                            clicked = true;
                        } else {
                            var chance = checkChance(xpAnsw(answSelected)[i], answ);
                            var newDiv = document.createElement("span");
                            newDiv.style = "background: #ccc";
                            newDiv.class = 'questioncorrectnessicon';
                            newDiv.innerHTML = '[' + Math.round(chance) + ']';
                            el.insertBefore(newDiv, answo);
                        }
                    }
                    for (i = 0; i < xnAnsw(answSelected).length; i++) {
                        console.log(xnAnsw(answSelected)[i]);
                        if ((answ.localeCompare(xnAnsw(answSelected)[i])) == 0) {
                            //wrong answer
                            console.log('Find---');
                            answo.classList.add('badanswer');
                            answo.style = "background:#ff7a7a";
                        }
                    }
                });
            }
        });

        if(autopressnext && !pressnx){
            clkRand();
            pressNext();
        }
    }

    function checkChance(rightanswer, answer) {
        return 100 - (levenshtein(answer, rightanswer) * 100 / rightanswer.length);
    }

    function xQue(id) {
        return id[0];
    }

    function xAnsw(id) {
        return id[1];
    }

    function xpAnsw(id) { //correct answers
        return id[2];
    }

    function xnAnsw(id) { //wrong answers
        return id[3];
    }

    function getDB() {
        return JSON.parse(localStorage.getItem('testgb'));
    }

    function pressNext(){
        document.querySelector(".mod_quiz-next-nav").click();
    }

    function pressPrev(){
        document.querySelector(".mod_quiz-prev-nav").click();
    }

    function clkBackEnd(){
        var tmpa=document.querySelectorAll(".submitbtns.mdl-align");
        console.log(tmpa);
        tmpa.forEach((el) => {
            console.log("----");
            if(el.querySelector("input[name=finishattempt]")===null) {
                if(/http:\/\/nip/.test(w.location.href)){
                    el.querySelector("input[type=submit]").click();
                } else {
                    el.querySelector("button").click();
                }
            }
            else console.log("fff");
        });
    }

    function clkEnd(){
        var tmp=document.querySelectorAll(".submitbtns.mdl-align");
        console.log(tmp);
        tmp.forEach((el) => {
            console.log("----");
            if(el.querySelector("input[name=finishattempt]")!==null) {
                if(/http:\/\/nip/.test(w.location.href)){
                    el.querySelector("input[type=submit]").click();
                } else {
                    el.querySelector("button").click();
                }
            }
            else console.log("fff");


        });
    }
    function clkOvEnd(){
        document.querySelector(".moodle-dialogue input").click();
    }

    function clkRand(){
        var parts = document.querySelectorAll('.que:not(.answerednow)');
        parts.forEach((part) => {
            var selected = part.querySelectorAll(".content [type=radio]:not(.badanswer)");
            var selectedb = part.querySelectorAll(".content [type=checkbox]:not(.badanswer)");
            var rp;
            var rpw;
            if (selectedb.length > 0) {
                rp = Math.floor(Math.random() * selectedb.length);
                selectedb[rp].click();
                rpw = rp;
                while (rpw == rp) {
                    rpw = Math.floor(Math.random() * selectedb.length);
                }
                selectedb[rpw].click();
                console.log('%%'+selectedb[rpw]);
                pressNext();
            } else {
                if (selected.length > 0) {
                    rp = Math.floor(Math.random() * selected.length);
                    selected[rp].click();
                console.log('%%$');
                    console.log(selectedb);
                    //pressNext();
                } else {
                    alert("Error: can't determine type of question");
                }
            }
        });
    }
    /* font - big http://patorjk.com/software/taag/
      _____ _______       _____ _______
     / ____|__   __|/\   |  __ \__   __|
    | (___    | |  /  \  | |__) | | |
     \___ \   | | / L\ \ |  _  /  | |
     ____) |  | |/ ____ \| | \ \  | |
    |_____/   |_/_/    \_\_|  \_\ |_|
    */
    var newDiv = document.createElement("div");
    newDiv.style = "display:none;position:absolute;left:0;top:0;z-index: 99999;";
    newDiv.id = "hfileinp";
    newDiv.innerHTML = `<input type=\"file\" id=\"hackerfile\" onchange=\"var file = this.files[0];var reader = new FileReader();
reader.readAsText(file);reader.onload = function() {alert(reader.result);localStorage.setItem('testgb',reader.result); };reader.onerror = function() {console.log(reader.error);};\">
<div id=\"out\"></div>`;
    document.body.appendChild(newDiv);
    ///////////////////////////////////////////////////////////////////
    //    ROUTER
    ///////////////////////////////////////////////////////////////////
    if (/http:\/\/(nip|op)\.tsatu\.edu\.ua\/course\/view\.php/.test(w.location.href)) {
        var hg=document.querySelectorAll("li.quiz");
        hg.forEach((el) => {
            console.log(el.querySelectorAll(".isrestricted").length>0);
            if(el.querySelectorAll(".isrestricted").length>0){
                el.style="background:#FF0000;color:#fff";
            }else{
                el.style="background:#00FF00;color:#fff";
            }
            //http://op.tsatu.edu.ua/mod/quiz/view.php?id=
            //if (/http:\/\/op\.tsatu\.edu\.ua\/mod\/quiz\/view\.php/.test(el.href))
            //el.style="background:#FF0000;color:#fff";
        });
    }
    else
        if (/http:\/\/(nip|op)\.tsatu\.edu\.ua\/mod\/quiz\/summary.php/.test(w.location.href)) {
            if(autopressnext){
                clkEnd();
                clkOvEnd();
            }
            //Press keys in end of test
            document.addEventListener('keydown', function(event) {
                if (event.code == 'KeyA') {
                    clkBackEnd();
                }
                if (event.code == 'KeyS') {
                    clkEnd();
                }
                if (event.code == 'KeyD') {
                    clkOvEnd();
                }
            });
        } else if (/http:\/\/(nip|op)\.tsatu\.edu\.ua\/login\/index\.php/.test(w.location.href)) {
            document.addEventListener('keydown', function(event) {
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Login
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if (event.code == 'KeyL') {
                    document.getElementById("username").value = userlogin;
                    document.getElementById("password").value = userpass;
                    document.getElementById("loginbtn").click();
                }
            });
        } else if (/http:\/\/(nip|op)\.tsatu\.edu\.ua/.test(w.location.href)) {
            if (/http:\/\/(nip|op)\.tsatu\.edu\.ua\/mod\/quiz\/review.php/.test(w.location.href)) {

            }else if(autoview) highlightRightAnswers(0);
            document.addEventListener('keydown', function(event) {
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Show / hide upload form
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if (event.code == 'KeyG') {
                    if (document.querySelector('#hfileinp').style.display == "none") {
                        document.querySelector('#hfileinp').style.display = "block";
                    } else {
                        document.querySelector('#hfileinp').style.display = "none";
                    }
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Highlight the correct
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if (event.code == 'KeyW') {
                    highlightRightAnswers(1);
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Press random answer & Next
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if (event.code == 'KeyR') {
                    clkRand();
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Press "Next" key
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if (event.code == 'KeyE') {
                    pressNext();
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Press "Prev" key
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if (event.code == 'KeyQ') {
                    pressPrev();
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Save results to file
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if (event.code == 'KeyF') {
                    download("test.txt", localStorage.getItem('testgb'));
                }
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Merge results to LocalStorage
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if (event.code == 'KeyT') {
                    console.log(parseFinish());
                    var result = filterBlocks(mergeBlocks(parseFinish(), JSON.parse(localStorage.getItem('testgb'))));
                    console.log(JSON.stringify(result));
                    localStorage.setItem('testgb', JSON.stringify(result));
                }
            });
        }
})();
