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
        filterInner(que);
        return filterText(que.innerHTML);
    }

    function filterAnswer(el) {
        filterInner(el);
        var anb = el.querySelector('span.answernumber');
        if (anb) anb.remove();
        var a=el.querySelector('label').innerHTML;
        return filterText(a.replace(/^([a-z])\. /, ''));
    }

    function filterInner(el){

        el.querySelectorAll('[id]').forEach(function(v, i, a) {
            v.removeAttribute('id');
        });

        el.querySelectorAll('a[name]').forEach(function(v, i, a) {
            v.removeAttribute('name');
        });
        el.querySelectorAll('p[class]').forEach(function(v, i, a) {
            v.removeAttribute('class');
        });
        el.querySelectorAll('span[style],p[style]').forEach(function(v, i, a) {
            v.removeAttribute('style');
        });
        el.querySelectorAll('[lang]').forEach(function(v, i, a) {
            v.removeAttribute('lang');
        });
    }
    function filterText(a){
        return a.trim().replace(/\.$/, '');
    }
    function filterBlocks(arr) {
        arr.forEach(function(v, i, a) {
            v[1] = unique(v[1]);
            v[2] = unique(v[2]);
            v[3] = unique(v[3]);
        });
        return arr;
    }

    function mergeBlocks(a, b) {
        var result = Array();
        var i, j;
        if (b == null) b = Array();
        for (i = 0; i < a.length; i++) {
            var addThis = true;
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
            if (addThis) result.push(a[i]);
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
        var e = document.createElement('a');
        e.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        e.setAttribute('download', filename);
        e.style.display = 'none';
        document.body.appendChild(e);
        e.click();
        document.body.removeChild(e);
    }

    var MD5 = function(d) {
        d = unescape(encodeURIComponent(d));
        var result = M(V(Y(X(d), 8 * d.length)));
        return result.toLowerCase();
    };

    function M(d) {
        for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++) {
            _ = d.charCodeAt(r);
            f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _);
        }
        return f;
    }

    function X(d) {
        for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++) _[m] = 0;
        for (m = 0; m < 8 * d.length; m += 8) _[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32;
        return _;
    }

    function V(d) {
        for (var _ = "", m = 0; m < 32 * d.length; m += 8) _ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255);
        return _;
    }

    function Y(d, _) {
        d[_ >> 5] |= 128 << _ % 32;
        d[14 + (_ + 64 >>> 9 << 4)] = _;
        for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) {
            var h = m,
                t = f,
                g = r,
                e = i;
            f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551); m = safe_add(m, h); f = safe_add(f, t); r = safe_add(r, g); i = safe_add(i, e)
        }
        return Array(m, f, r, i);
    }

    function md5_cmn(d, _, m, f, r, i) {
        return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m);
    }

    function md5_ff(d, _, m, f, r, i, n) {
        return md5_cmn(_ & m | ~_ & f, d, _, r, i, n);
    }

    function md5_gg(d, _, m, f, r, i, n) {
        return md5_cmn(_ & f | m & ~f, d, _, r, i, n);
    }

    function md5_hh(d, _, m, f, r, i, n) {
        return md5_cmn(_ ^ m ^ f, d, _, r, i, n);
    }

    function md5_ii(d, _, m, f, r, i, n) {
        return md5_cmn(m ^ (_ | ~f), d, _, r, i, n);
    }

    function safe_add(d, _) {
        var m = (65535 & d) + (65535 & _);
        return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m;
    }

    function bit_rol(d, _) {
        return d << _ | d >>> 32 - _;
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
                im.outerHTML = '[[' + MD5(getImg(createView(), im)) + ']]';
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
        filterInner(text);
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
        var q = document.querySelector(".moodle-dialogue input");
        if(q!==null) q.click();
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

            }else if(autoview && /http:\/\/(nip|op)\.tsatu\.edu\.ua\/mod\/quiz\/attempt.php/.test(w.location.href)) highlightRightAnswers(false);

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
                    highlightRightAnswers(true);
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
