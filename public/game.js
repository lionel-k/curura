document.addEventListener("DOMContentLoaded", () => {
  const timerDisplay = document.getElementById("timer");
  const wordDisplay = document.getElementById("word-display");
  const userInput = document.getElementById("user-input");
  let words = [];
  let currentWordIndex = 0;
  let correctWordsCount = 0;
  let countdown;

  function hasGameStartedToday() {
    const today = new Date().toISOString().split("T")[0];
    const startTime = localStorage.getItem(`gameStartTime_${today}`);
    if (startTime) {
      return new Date(startTime);
    }
    return null;
  }

  function saveGameStartTime(startTime) {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(`gameStartTime_${today}`, startTime.toISOString());
  }

  function calculateRemainingTime(startTime) {
    const now = new Date();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    return Math.max(60 - elapsedSeconds, 0);
  }

  function shuffleWord(word) {
    const letters = word.split("");
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]]; // Swap letters
    }
    return letters.join("");
  }

  function displayNextWord() {
    const currentWord = words[currentWordIndex];
    const shuffledWord = shuffleWord(currentWord);
    wordDisplay.textContent = shuffledWord;
  }

  function submitWord() {
    const currentWord = words[currentWordIndex];
    if (userInput.value.trim().toLowerCase() === currentWord.toLowerCase()) {
      correctWordsCount++;
      alert("Correct!");
      moveToNextWord();
    } else {
      alert("Try again!");
    }
    userInput.value = ""; // Clear input field after each submission
  }

  function moveToNextWord() {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    displayNextWord();
  }

  function startTimer(remainingTime) {
    timerDisplay.textContent = remainingTime;
    countdown = setInterval(() => {
      remainingTime--;
      timerDisplay.textContent = remainingTime;
      if (remainingTime <= 0) {
        clearInterval(countdown);
        endGame();
      }
    }, 1000);
  }

  function endGame() {
    alert(`Time's up! You found ${correctWordsCount} correct words.`);
    userInput.disabled = true; // Disable further input
    storeResultsInLocalStorage(correctWordsCount);
  }

  function storeResultsInLocalStorage(correctCount) {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(`correctWordsCount_${today}`, correctCount.toString());
  }

  // Set up the game
  const startTime = hasGameStartedToday();
  if (!startTime) {
    const now = new Date();
    saveGameStartTime(now);
    startTimer(60);
  } else {
    const remainingTime = calculateRemainingTime(startTime);
    if (remainingTime > 0) {
      startTimer(remainingTime);
    } else {
      endGame();
    }
  }

  // Fetch and display words
  fetch("/words")
    .then((response) => response.text())
    .then((data) => {
      words = data
        .split("\n")
        .map((word) => word.trim())
        .filter((word) => word.length);
      displayNextWord(); // Immediately display the first word
    });

  // Listen for the Enter key to submit a word
  userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      submitWord();
    }
  });
});
