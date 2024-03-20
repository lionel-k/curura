document.addEventListener("DOMContentLoaded", () => {
  let words = []; // This will hold the words loaded from the CSV
  let currentWordIndex = 0;
  let timer = 60;
  let intervalId;

  function loadWords() {
    // Example loading words from a static file. Adapt as necessary for your setup.
    fetch("/words.csv")
      .then((response) => response.text())
      .then((text) => {
        words = text
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length);
        displayWord();
        startGame();
      });
  }

  function startGame() {
    document.getElementById("user-input").value = ""; // Reset input field
    document.getElementById("user-input").focus(); // Focus on input field

    intervalId = setInterval(() => {
      timer--;
      document.getElementById("timer").textContent = timer;
      if (timer <= 0) {
        clearInterval(intervalId);
        alert("Time is up! Game over.");
        // Here, you would also handle the end of the game, such as resetting for the next word or handling the daily limit.
      }
    }, 1000);
  }

  function displayWord() {
    if (currentWordIndex < words.length) {
      document.getElementById("word-display").textContent =
        words[currentWordIndex];
    } else {
      alert("No more words left for today!");
      // Reset or disable game here
    }
  }

  function submitWord() {
    const userInput = document.getElementById("user-input").value;
    if (userInput === words[currentWordIndex]) {
      alert("Correct! Onto the next word.");
      currentWordIndex++;
      timer = 60; // Reset timer for the next word
      displayWord();
      startGame();
    } else {
      alert("Try again!");
    }
  }

  window.submitWord = submitWord; // Make the submitWord function accessible from HTML

  loadWords();
});
