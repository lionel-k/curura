document.addEventListener("DOMContentLoaded", () => {
  const timerDisplay = document.getElementById("timer");
  const wordDisplay = document.getElementById("word-display");
  const userInput = document.getElementById("user-input");
  let words = [];
  let currentWordIndex = 0;
  let correctWordsCount = 0;
  let countdown;

  // Fetch the words from your CSV file
  fetch("/words")
    .then((response) => response.text())
    .then((data) => {
      words = data
        .split("\n")
        .map((word) => word.trim())
        .filter((word) => word.length);
      shuffleWordsArray(words); // Shuffle the words array to randomize the order
      displayNextWord(); // Display the first word immediately
      startTimer(60); // Start the timer automatically
    });

  function shuffleWordsArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function shuffleWord(word) {
    const letters = word.split("");
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]]; // Swap letters
    }
    return letters.join("");
  }

  // Listen for the Enter key to submit a word
  userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      submitWord();
    }
  });

  function submitWord() {
    const currentWord = words[currentWordIndex];
    if (userInput.value.trim().toLowerCase() === currentWord.toLowerCase()) {
      correctWordsCount++;
      alert("Correct!"); // For demonstration, replace with a more suitable notification
      moveToNextWord();
    } else {
      alert("Try again!");
    }
    userInput.value = ""; // Clear input field
  }

  function displayNextWord() {
    const shuffledWord = shuffleWord(words[currentWordIndex]);
    wordDisplay.textContent = shuffledWord; // Display the shuffled word
  }

  function moveToNextWord() {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    displayNextWord();
  }

  function startTimer(duration) {
    let time = duration;
    timerDisplay.textContent = time;
    clearInterval(countdown);
    countdown = setInterval(() => {
      time--;
      timerDisplay.textContent = time;
      if (time <= 0) {
        clearInterval(countdown);
        endGame();
      }
    }, 1000);
  }

  function endGame() {
    alert(`Time's up! You found ${correctWordsCount} correct words.`);
    storeResultsInLocalStorage(correctWordsCount);
    userInput.disabled = true; // Disable input at the end of the game
  }

  function storeResultsInLocalStorage(correctCount) {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(`correctWords_${today}`, correctCount);
  }
});
