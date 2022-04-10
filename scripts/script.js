//HTML Document constants
const _askedQuestion = document.getElementById("asked-question");
const _checkBtn = document.getElementById("check-answer");
const _gifHolder = document.getElementById("correct");
const _leaderboardBtn = document.getElementById("leaderboard");
const _listOptions = document.querySelector(".list-options");
const _playAgainBtn = document.getElementById("play-again");
const _question = document.getElementById("question");
const _result = document.getElementById("result");
const _score = document.getElementById("score");
const _timer = document.getElementById("timer");
const _totalQuestion = document.getElementById("total-question");
const _username = document.getElementById("username");
const _timeCount = document.querySelector(".timer .timer_sec");
const _timeText = document.querySelector(".timer .time_left_txt");

//effects constants
const _correctAnswerGifURL = "gifs/checkSign.gif";
const _wrongAnswerGifURL = "gifs/crossSign.gif";
const _endOfQuizGifURL = "gifs/endGame.gif";
const _correctAnswerAudioURL = "sounds/right.mp3";
const _wrongAnswerAudioURL = "sounds/wrong.mp3";
const _newHighScoreAudioURL = "sounds/NewHighScoreSound.mp3";
const _noNewHighScoreAudioURL = "sounds/NoNewHighScoreSound.mp3";

//ingame constants
let correctAnswer = "",
  numberOfQuestionsAsked = correctAnswersStreakCounter = playerScoreCounter = 0,
  totalNumberOfQuestion = 10,
  timeToAnswerEachQuestion = 15,
  correctAnswerPointsValue = 15,
  numberOfPlayersToshowInLeaderboard = 5,
  wrongAnswerPointValue = -10,
  leaderboardScores = [];

for (let i = 0; i < numberOfPlayersToshowInLeaderboard; i++) {
  leaderboardScores[i] = {name: "- - - -", score: 0};
}

//document event listeners
document.addEventListener("DOMContentLoaded", function () {
  loadQuestion();
  eventListeners();
  _totalQuestion.textContent = totalNumberOfQuestion;
  _askedQuestion.textContent = numberOfQuestionsAsked;
});

function eventListeners() {
  _checkBtn.addEventListener("click", checkAnswer);
  _playAgainBtn.addEventListener("click", restartQuiz);
  _leaderboardBtn.addEventListener("click", loadLeaderboard);
}

//loading quietions, timer and selecting option
async function loadQuestion() {
  const APIUrl = "https://opentdb.com/api.php?amount=100";
  const result = await fetch(`${APIUrl}`);
  const data = await result.json();
  _result.innerHTML = "";
  showQuestion(data.results[0]);
  startTimer(timeToAnswerEachQuestion);
}

function showQuestion(data) {
  _checkBtn.disabled = false;
  correctAnswer = data.correct_answer;
  let incorrectAnswer = data.incorrect_answers;
  let optionsList = incorrectAnswer;
  optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);

  _question.innerHTML = `${data.question} <br> <span class = "category"> ${data.category} </span>`;
  _listOptions.innerHTML = `${optionsList.map((option, index) => `<li> ${index + 1}. <span>${option}</span> </li>`).join("")}`;
  selectOption();
  _gifHolder.style.display = "none";
}

function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    _timeCount.textContent = time;
    time--;
    if (time < 0) {
      checkCount();
    }
  }
}

function selectOption() {
  _listOptions.querySelectorAll("li").forEach(function (option) {
    option.addEventListener("click", function () {
      if (_listOptions.querySelector(".selected")) {
        const activeOption = _listOptions.querySelector(".selected");
        activeOption.classList.remove("selected");
      }
      option.classList.add("selected");
    })
  })
}

//check answer
function checkAnswer() {
  selectedAnswer = _listOptions.querySelector(".selected span").textContent;
  _checkBtn.disabled = true;
  if (_listOptions.querySelector(".selected")) {
    
    if (selectedAnswer == HTMLDecode(correctAnswer)) {
      activateCorrectAnswerProtocol();
    } else {
      activateWrongAnswerProtocol();
    }
    setTimeout(checkCount, 700);
  } else {
    _result.innerHTML = `<p>Please select an option!</p>`;
    _checkBtn.disabled = false;
  }
  clearInterval(counter);
}

function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
}

function checkCount() {
  numberOfQuestionsAsked++;
  setCount();
  if (numberOfQuestionsAsked == totalNumberOfQuestion) {
    setTimeout(function () {console.log()}, 5000);
    activateEndOfQuizProtocol();
  } else {
    setTimeout(function () {loadQuestion()}, 700);
  }
  clearInterval(counter);
}

//score changings
function activateWrongAnswerProtocol() {
  _result.innerHTML = `<p>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
  correctAnswersStreakCounter = 0;
  activateWrongAnswerEffects();
  addWrongAnswerPoints();
}

function addWrongAnswerPoints() {
  correctAnswersStreakCounter = 0;
  if (playerScoreCounter > 0) {
    playerScoreCounter += wrongAnswerPointValue;
  }
}

function activateCorrectAnswerProtocol() {
  _result.innerHTML = `<p>Correct Answer!</p>`;
  correctAnswersStreakCounter++;
  activateCorrectAnswerEffects();
  checkStreakAndAddCorrectAnswerPoint();
}

function checkStreakAndAddCorrectAnswerPoint() {
  if (correctAnswersStreakCounter >= 3) {
    playerScoreCounter += correctAnswersStreakCounter * correctAnswerPointsValue;
  } else {
    playerScoreCounter += correctAnswerPointsValue;
  }
}

//Game settings & UI
function activateEndOfQuizProtocol() {
  activateEndOfQuizEffects();
  hideInGameUI();
  setEndOfGameUI();
}

function restartQuiz() {
  hideEndOfGameUI();
  setInGameSettings();
  setCount();
  loadQuestion();
}

function setCount() {
  _totalQuestion.textContent = totalNumberOfQuestion;
  _askedQuestion.textContent = numberOfQuestionsAsked;
}

function setEndOfGameUI() {
  _result.innerHTML += `<p>Your score is ${playerScoreCounter}.</p>`;
  _playAgainBtn.style.display = "block";
  _leaderboardBtn.style.display = "block";
  _username.style.display = "block";
}

function hideInGameUI() {
  _score.style.display = "none";
  _timer.style.display = "none";
  _checkBtn.style.display = "none";
  _result.innerHTML = "";
  _listOptions.innerHTML = "";
  _question.innerHTML = "";
}

function setInGameSettings() {
  playerScoreCounter = numberOfQuestionsAsked= correctAnswersStreakCounter = 0;
  timeValue = 15
  _gifHolder.style.display = "none";
  _checkBtn.style.display = "block";
  _score.style.display = "flex";
  _timer.style.display = "flex";
  _checkBtn.disabled = false;
}

function hideEndOfGameUI() {
  _username.style.display = "none";
  _playAgainBtn.style.display = "none";
  _leaderboardBtn.style.display = "none";
}


// leaderboard
function loadLeaderboard() {
  comparePlayerScoreToLeaderboardScoresAndInsertIfDeserved();
  leaderboardScores.sort(compareScores);
  InsertPlayersNamesToLeaderBoard();
  showLeaderboardUI();
}

function comparePlayerScoreToLeaderboardScoresAndInsertIfDeserved() {
  if (leaderboardScores[leaderboardScores.length -1 ].score < parseInt(playerScoreCounter)) {
    leaderboardScores[leaderboardScores.length - 1].name = _username.value;
    leaderboardScores[leaderboardScores.length - 1].score = playerScoreCounter;
  }
}

function compareScores(a, b) {
  if (a.score >= b.score) {
    return -1;
  }
  if (a.score < b.score) {
    return 1;
  }
  return 0;
}

function InsertPlayersNamesToLeaderBoard() {
  let x = " ";
  for (let i = 0; i < leaderboardScores.length; i++) {
    x += `<li> ${leaderboardScores[i].name} <span style='float:right;'>${leaderboardScores[i].score}</span> </li>`;
    _listOptions.innerHTML = x;
  }
}

function showLeaderboardUI() {
  _leaderboardBtn.style.display = "none";
  _question.innerHTML = "Leaderboard";
  _username.style.display = "none";
  _result.innerHTML = "";
  _gifHolder.style.display = "none";
  _playAgainBtn.style.display = "block";
  _checkBtn.style.display = "none";
  _timer.style.display = "none";
}


//effects
function playAudio(url) {
  new Audio(url).play();
}

function showGIF(gifURL) {
  _gifHolder.src = gifURL;
  _gifHolder.style.display = "block";
}

function activateEndOfQuizEffects() {
  checkIfNewHighScoreAndPlayProperAudio();
  showGIF(_endOfQuizGifURL);
}

function activateWrongAnswerEffects() {
  playAudio(_wrongAnswerAudioURL);
  showGIF(_wrongAnswerGifURL);
}

function activateCorrectAnswerEffects() {
  playAudio(_correctAnswerAudioURL);
  showGIF(_correctAnswerGifURL);
}

function checkIfNewHighScoreAndPlayProperAudio() {
  if (playerScoreCounter >= leaderboardScores[0].score) {
    playAudio(_newHighScoreAudioURL);
  } else {
      playAudio(_noNewHighScoreAudioURL);
  }
}