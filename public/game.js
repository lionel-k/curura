document.addEventListener("DOMContentLoaded", () => {
  const wordInput = document.getElementById("word-input");
  const wordForm = document.getElementById("word-form");
  const roundsLeftDisplay = document.getElementById("rounds-left");
  const messageDisplay = document.getElementById("message");

  let words = [];
  let roundsLeft = getRoundsLeft();

  // Load words from the server
  fetch("/words")
    .then((response) => response.text())
    .then((data) => {
      words = data
        .split("\n")
        .map((word) => word.trim())
        .filter((word) => word.length);
      console.log(words); // Debugging: log words to console
    });

  wordForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const submittedWord = wordInput.value.trim().toLowerCase();
    if (words.includes(submittedWord)) {
      messageDisplay.textContent = "Correct!";
      decrementRoundsLeft();
    } else {
      messageDisplay.textContent = "Try again!";
    }

    wordInput.value = ""; // Clear input field
    updateRoundsLeftDisplay();
  });

  function getRoundsLeft() {
    const today = new Date().toISOString().split("T")[0];
    return parseInt(localStorage.getItem(today) || "10", 10);
  }

  function decrementRoundsLeft() {
    roundsLeft = Math.max(0, roundsLeft - 1);
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(today, roundsLeft.toString());
  }

  function updateRoundsLeftDisplay() {
    roundsLeftDisplay.textContent = roundsLeft.toString();
    if (roundsLeft === 0) {
      messageDisplay.textContent =
        "No more rounds left today. Come back tomorrow!";
      wordInput.disabled = true; // Disable input if no rounds left
    }
  }

  // Initialize display
  updateRoundsLeftDisplay();
});
