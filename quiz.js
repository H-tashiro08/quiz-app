"use strict";

/* ==========================
 基本データ
============================*/

//地理のクイズデータ
const data = [
    {
        question: "日本で一番面積の大きい都道府県は？",
        answers: ["北海道", "東京都", "沖縄県", "福岡県"],
        correct: "北海道"
    },
    {
        question: "日本で一番人口の多い都道府県は？",
        answers: ["北海道", "東京都", "沖縄県", "福岡県"],
        correct: "東京都"
    },
    {
        question: "日本で一番人口密度の高い都道府県は？",
        answers: ["北海道", "東京都", "沖縄県", "福岡県"],
        correct: "東京都"
    },
];

//出題する問題数
const QUESTION_LENGTH = 2;
//解答時間(ms)
const ANSWER_TIME_MS = 10000;
//インターバル時間(ms)
const INTERVAL_TIME_MS = 10;
//出題する問題データ

//解答時間
let startTime = null;

let questions = getRandomQuestions();
// const questions = [data[0]];
//出題する問題のインデックス
let questionIndex = 0;
//正解数
let correctCount = 0;
let IntervalId = null;

/* 
 要素一覧
============================*/

const startPage = document.getElementById("startPage");
const questionPage = document.getElementById("questionPage");
const resultPage = document.getElementById("resultPage");

const startButton = document.getElementById("startButton");

const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const optionButtons = document.querySelectorAll("#questionPage button");
const questionProgress = document.getElementById("questionProgress");

const resultMassage = document.getElementById("resultMessage");

const backButton = document.getElementById("backButton");

const dialog = document.getElementById("dialog");
const questionResult = document.getElementById("questionResult");
const nextButton = document.getElementById("nextButton");
console.log(dialog, questionResult, nextButton);

/* ==========================
 処理
============================*/

startButton.addEventListener("click", clickStartButton);

optionButtons.forEach((button) => {
    button.addEventListener("click", clickOptionButton);
});

nextButton.addEventListener("click", clickNextButton);

backButton.addEventListener("click", clickBackButton);

/* ==========================
 関数一覧
============================*/
function questionTimeOver(){
    //時間切れの場合不正解とする
    questionResult.innerText="✖";
    //ダイアログのボタンのテキストを設定する
    if(isQuestionEnd()){
        nextButton.innerText = 結果を見る;
    }else{
        nextButton.innerText = 次の問題へ;
    }
}

function startProgress(){}
startTime = Date.now;
IntervalId = setInterval(()=> {
    const correntTime = Date.now;
    const progress = ((currentTime - startTime) / ANSWER_TIME_MS) * 10;
    questionProgress.value = progress;
    if(startTime + ANSWER_TIME_MS <= currentTime){
        stopProgress();
        questionTimeOver();
        return;
    }
    //経過時間を加算する
    elapsedTime += INTERVAL_TIME_MS;
},INTERVAL_TIME_MS);

function stopProgress(){
    //インターバルを停止する
    if(IntervalId !== null) {
        clearInterval(IntervalId);
        IntervalId = null;
    }
}

function reset(){
    questions = getRandomQuestions();
    questionIndex = 0;
    correctCount = 0;
    IntervalId = null;
    
    for(let i = 0; i < optionButtons.length; i++) {
        optionButtons[i].removeAttribute("disabled");
    }
}

function isQuestionEnd() {
    //問題が最後かどうかを判定する
    return questionIndex + 1 === QUESTION_LENGTH;
}

function getRandomQuestions() {
    //出題する問題のインデックスリスト
    const questionIndexList = [];
    while (questionIndexList.length !== QUESTION_LENGTH) {
        //出題する問題のインデックスをランダムに生成する
        const index = Math.floor(Math.random() * data.length);
        //インデックスリストに含まれていない場合、インデックスリストに追加する
        if (!questionIndexList.includes(index)) {
            questionIndexList.push(index);
        }
    }
    //出題する問題リストを取得する
    const questionList = questionIndexList.map((index) => data[index]);
    return questionList;
}

function setResult() {
    //正解率を計算する
    const accuracy = Math.floor((correctCount / QUESTION_LENGTH) * 100);
    //正解率を表示する
    resultMassage.innerText = `正解率: ${accuracy}%`;
}

function setQuestion() {
    //問題を取得する
    const question = questions[questionIndex];
    //問題番号を表示する
    questionNumber.innerText = `第 ${questionIndex + 1} 問`;
    //問題文を表示する
    questionText.innerText = question.question;
    //選択肢を表示する
    for (let i = 0; i < optionButtons.length; i++) {
        optionButtons[i].innerText = question.answers[i];
    }
}

/* ==========================
 イベント関連の関数一覧
============================*/

function clickOptionButton(event) {
    //解答中の経過時間を停止する
    // stopProgress();
    // //インターバルIDを初期化する
    // IntervalId = null;
    // //解答途中の経過時間を初期化する
    // elapsedTime = 0;
    // optionButtons.forEach((button) => {
    //     button.disabled = true;
    // });

    console.log("a");
    //選択した選択肢のテキストを取得する
    const optionText = event.target.innerText;
    //正解のテキストを取得する
    const correctText = questions[questionIndex].correct;

    console.log("b");
    if (optionText === correctText) {
        correctCount += 1;
        questionResult.innerText = "⭕";
        // alert("正解");
    } else {
        questionResult.innerText = "❌";
        // alert("不正解");
    }

    if(isQuestionEnd()) {
        nextButton.innerText = "結果を見る";
    }else{
        nextButton.inputMode = "次の問題へ";
    }

    //ダイアログを表示する
    dialog.showModal();
}
    function clickStartButton() {
        //クイズをリセットする
        reset();
        //問題画面に問題を設定する
        setQuestion();
        //解答の計測を開始する
        startProgress();
        //スタート画面を非表示にする
        startPage.classList.add("hidden");
        //問題画面を表示する
        questionPage.classList.remove("hidden");
        //結果画面を非表示にする
        resultPage.classList.add("hidden");
    }

    function clickNextButton() {

        if (isQuestionEnd()) {
            //正解率を設定する
            setResult();
            //次の問題に進む
            //ダイアログを閉じる
            dialog.close();
            //スタート画面を非表示にする
            startPage.classList.add("hidden");
            //問題画面を非表示にする
            questionPage.classList.add("hidden");
            //結果画面を表示にする
            resultPage.classList.remove("hidden");
        } else {
            questionIndex++;
            //問題画面に問題を設定する
            setQuestion();
            //すべての選択肢を有効化する
            for (let i = 0; i < optionButtons.length; i++) {
                optionButtons[i].removeAttribute("disabled");
            }
            //ダイアログを閉じる
            dialog.close()
        }
    }

    function clickBackButton() {
        //スタート画面を非表示にする
        startPage.classList.remove("hidden");
        //問題画面を非表示にする
        questionPage.classList.add("hidden");
        //結果画面を表示にする
        resultPage.classList.add("hidden");
    }