document.addEventListener("DOMContentLoaded", () => {
  const timerDisplay = document.getElementById("timer");
  const wordDisplay = document.getElementById("word-display");
  const userInput = document.getElementById("user-input");
  let words = [];
  let currentWordIndex = 0;
  let correctWordsCount = getTodayCorrectWordsCount(); // Get today's correct words count if available
  let countdown;
  let gameDuration = 8000;
  const today = new Date().toISOString().split("T")[0];
  let gameHasEndedToday = false;

  function getTodayCorrectWordsCount() {
    const today = new Date().toISOString().split("T")[0];
    return parseInt(
      localStorage.getItem(`correctWordsCount_${today}`) || "0",
      10
    );
  }

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
    return Math.max(gameDuration - elapsedSeconds, 0);
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
    if (gameHasEndedToday) {
      wordDisplay.textContent = "--------";
      return;
    }
    wordDisplay.textContent = shuffledWord;
  }

  function submitWord() {
    const currentWord = words[currentWordIndex];
    if (userInput.value.trim().toLowerCase() === currentWord.toLowerCase()) {
      correctWordsCount++;

      // Append the correctly guessed word to the list
      const correctWordsList = document.getElementById("correct-words-list");
      const listItem = document.createElement("li");
      listItem.textContent = currentWord; // Or use userInput.value for the user's input
      correctWordsList.appendChild(listItem);

      moveToNextWord();
    }
    userInput.value = ""; // Clear input field after each submission
  }

  function moveToNextWord() {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    displayNextWord();
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
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
    gameHasEndedToday = true;
    wordDisplay.textContent = "--------"; // Clear the word display

    // Update the results display
    const resultsDisplay = document.getElementById("results");
    resultsDisplay.textContent = `Today ${today}, you have found ${correctWordsCount} correct words.`;

    storeResultsInLocalStorage();
  }

  function storeResultsInLocalStorage() {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(
      `correctWordsCount_${today}`,
      correctWordsCount.toString()
    );
  }

  const startTime = hasGameStartedToday();
  if (!startTime) {
    const now = new Date();
    saveGameStartTime(now);
    startTimer(gameDuration);
  } else {
    const remainingTime = calculateRemainingTime(startTime);
    if (remainingTime > 0) {
      startTimer(remainingTime);
    } else {
      endGame();
    }
  }

  fetch("/words")
    .then((response) => response.text())
    .then((data) => {
      words = data
        .split("\n")
        .map((word) => word.trim().toUpperCase())
        .filter((word) => word.length);
      shuffleArray(words); // Shuffle the words array to randomize the order

      currentWordIndex = Math.floor(Math.random() * words.length);

      displayNextWord();
    });

  userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      submitWord();
    }
  });

  document
    .getElementById("submit-button")
    .addEventListener("click", function () {
      submitWord();
    });
});
