document.addEventListener("DOMContentLoaded", () => {
  const timerDisplay = document.getElementById("timer");
  const wordDisplay = document.getElementById("word-display");
  const userInput = document.getElementById("user-input");
  const roundsLeftDisplay = document.getElementById("rounds-left");
  let words = [];
  let currentWordIndex = 0;
  let roundsLeft = getRoundsLeft();
  let countdown;

  // Fetch the words from your CSV file
  fetch("/words")
    .then((response) => response.text())
    .then((data) => {
      words = data
        .split("\n")
        .map((word) => word.trim())
        .filter((word) => word.length);
      startNewRound(); // Start the game with the first word
    });

  // Simulates submitting a word by pressing the submit button or pressing enter
  document
    .getElementById("user-input")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        submitWord();
      }
    });

  function startNewRound() {
    if (roundsLeft > 0) {
      wordDisplay.textContent = words[currentWordIndex]; // Display the current word
      resetTimer(); // Reset and start the timer for the new round
    } else {
      wordDisplay.textContent =
        "No more rounds left today. Come back tomorrow!";
    }
  }

  function submitWord() {
    if (
      userInput.value.trim().toLowerCase() ===
      wordDisplay.textContent.toLowerCase()
    ) {
      alert("Correct!"); // For demonstration, replace with a more suitable notification
      decrementRoundsLeft();
      currentWordIndex = (currentWordIndex + 1) % words.length; // Loop through words
      userInput.value = ""; // Clear input field
      startNewRound(); // Start next round
    } else {
      alert("Try again!");
    }
  }

  window.submitWord = submitWord; // Make the function accessible from HTML's onclick attribute

  function decrementRoundsLeft() {
    roundsLeft--;
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(today, roundsLeft.toString());
    updateRoundsLeftDisplay();
  }

  function getRoundsLeft() {
    const today = new Date().toISOString().split("T")[0];
    let storedRounds = localStorage.getItem(today);
    if (storedRounds === null) {
      localStorage.setItem(today, "10");
      storedRounds = "10";
    }
    return parseInt(storedRounds, 10);
  }

  function updateRoundsLeftDisplay() {
    roundsLeftDisplay.textContent = roundsLeft.toString();
  }

  function resetTimer() {
    clearInterval(countdown);
    let time = 60; // Timer set for 60 seconds
    timerDisplay.textContent = time;
    countdown = setInterval(() => {
      time--;
      timerDisplay.textContent = time;
      if (time <= 0) {
        clearInterval(countdown);
        alert("Time's up! Moving to next word."); // For demonstration, replace with a more suitable notification
        currentWordIndex = (currentWordIndex + 1) % words.length; // Move to next word
        startNewRound();
      }
    }, 1000);
  }

  updateRoundsLeftDisplay(); // Initial display update
});
