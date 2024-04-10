document.addEventListener("DOMContentLoaded", () => {
  const timerDisplay = document.getElementById("timer");
  const wordDisplay = document.getElementById("word-display");
  const userInput = document.getElementById("user-input");
  const todayDisplay = document.getElementById("today");
  let words = [];
  let currentWordIndex = 0;
  let correctWordsCount = getTodayCorrectWordsCount(); // Get today's correct words count if available
  let countdown;
  let gameDuration = 257;
  const today = new Date();
  let gameHasEndedToday = false;

  function getLocalDateISOString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // getMonth is zero-indexed
    const day = now.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`; // YYYY-MM-DD format
  }

  const MONTHS = [
    "Nzero",
    "Ruhuhuma",
    "Ntwarante",
    "Ndamukiza",
    "Rusama",
    "Ruheshi",
    "Mukakaro",
    "Myandagaro",
    "Nyakanga",
    "Gitugutu",
    "Munyonyo",
    "Kigarama",
  ];

  const getKirundiDate = () => {
    const day = today.getDate();
    const month = MONTHS[today.getMonth()];
    const year = today.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const todayInKirundi = getKirundiDate();
  todayDisplay.textContent = todayInKirundi;

  function getTodayCorrectWordsCount() {
    const today = getLocalDateISOString();
    return parseInt(
      localStorage.getItem(`correctWordsCount_${today}`) || "0",
      10
    );
  }

  function hasGameStartedToday() {
    const today = getLocalDateISOString();
    const startTime = localStorage.getItem(`gameStartTime_${today}`);
    if (startTime) {
      return new Date(startTime);
    }
    return null;
  }

  function saveGameStartTime(startTime) {
    const today = getLocalDateISOString();
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
    // console.log(currentWord);
    const shuffledWord = shuffleWord(currentWord);
    if (gameHasEndedToday) {
      wordDisplay.textContent = "--------";
      return;
    }
    wordDisplay.textContent = shuffledWord.split("").join(" ");
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
      window.navigator.vibrate(1000);

      moveToNextWord();
    } else {
      window.navigator.vibrate(200);
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

  function startTimer(duration) {
    let remainingTime = duration;
    const totalDuration = duration; // Store the total duration for percentage calculation
    timerDisplay.textContent = remainingTime;
    timerDisplay.style.color = "green"; // Start with green color

    countdown = setInterval(() => {
      remainingTime--;
      const percentage = (remainingTime / totalDuration) * 100;

      if (percentage <= 25) {
        timerDisplay.style.color = "red";
        timerDisplay.classList.add("blink");
      } else if (percentage <= 50) {
        timerDisplay.style.color = "orange";
        timerDisplay.classList.remove("blink");
      } else {
        timerDisplay.style.color = "green";
        timerDisplay.classList.remove("blink");
      }

      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      timerDisplay.textContent = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;

      if (remainingTime <= 0) {
        clearInterval(countdown);
        endGame();
      }
    }, 1000);
  }

  const haveAGoodDay = () => {
    const greetings = [
      "Umunsi mwiza",
      "Umuhingamo mwiza",
      "Umugoroba mwiza",
      "Ijoro ryiza",
    ];

    const hour = new Date().getHours();
    let greeting = greetings[0];

    if (hour >= 12 && hour < 18) {
      greeting = greetings[1];
    }

    if (hour >= 18 && hour < 21) {
      greeting = greetings[2];
    }

    if (hour >= 21 || hour < 6) {
      greeting = greetings[3];
    }

    return greeting;
  };

  function updateCountdown() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Set to next midnight.

    const secondsUntilMidnight = (midnight - now) / 1000;
    const hours = String(Math.floor(secondsUntilMidnight / 3600)).padStart(
      2,
      "0"
    );
    const minutes = String(Math.floor(secondsUntilMidnight / 60) % 60).padStart(
      2,
      "0"
    );
    const seconds = String(Math.floor(secondsUntilMidnight) % 60).padStart(
      2,
      "0"
    );

    const countdownTimer = document.getElementById("time-remaining");
    countdownTimer.textContent = `${hours}:${minutes}:${seconds}`;
  }

  function endGame() {
    let correctWordsText =
      correctWordsCount === 1
        ? "Wacuruye ijambo rimwe ryinyegeje"
        : `Wacuruye amajambo ${correctWordsCount} yinyegeje`;

    userInput.disabled = true; // Disable further input
    gameHasEndedToday = true;

    const currentWord = words[currentWordIndex];
    // console.log("last word", currentWord);
    wordDisplay.textContent = currentWord;

    const resultsDisplay = document.getElementById("results");
    resultsDisplay.textContent = `${correctWordsText} uno musi. Uragaruka ejo gukina kandi. ${haveAGoodDay()}!`;

    let shareButton = document.getElementById("share-button");
    if (!shareButton) {
      shareButton = document.createElement("button");
      shareButton.id = "share-button";
      shareButton.innerHTML =
        '<i class="fas fa-share share-icon"></i> Sangiza abandi';
      document.getElementById("game-container").appendChild(shareButton);
    }

    let leaderboardButton = document.getElementById("leaderboard-button");
    if (!leaderboardButton) {
      leaderboardButton = document.createElement("button");
      leaderboardButton.id = "leaderboard-button";
      leaderboardButton.innerHTML =
        '<i class="fas fa-trophy leaderboard-icon"></i> Ihiganwa';
      // document.getElementById("game-container").appendChild(leaderboardButton);
    }

    shareButton.addEventListener("click", () => {
      const shareMessage = `Uno musi ${todayInKirundi},\n\nNacuruye amajambo ${correctWordsCount}. \n\nhttps://curura.bi`;

      if (navigator.share) {
        navigator
          .share({
            title: "Curura",
            text: shareMessage,
          })
          .then(() => console.log("Successful share"))
          .catch((error) => console.log("Error sharing", error));
      } else {
        navigator.clipboard.writeText(shareMessage).then(
          () => {
            alert("Urukino rwakoporowe!"); // "The game was copied!"
          },
          (err) => {
            console.error("Could not copy text: ", err);
          }
        );
      }
    });

    leaderboardButton.addEventListener("click", function () {
      window.location.href = "/leaderboard"; // Redirects to the leaderboard page
    });

    storeResultsInLocalStorage();
    const countdownTimer = document.getElementById("countdown-timer");
    countdownTimer.style.display = "block";

    // Start the countdown
    updateCountdown(); // Update immediately to avoid initial delay
    setInterval(updateCountdown, 1000);
  }

  function storeResultsInLocalStorage() {
    const today = getLocalDateISOString();
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
        .filter((word) => word.length > 4 && word.length < 7);
      shuffleArray(words);

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

  document.getElementById("skip-button").addEventListener("click", function () {
    moveToNextWord();
    window.navigator.vibrate(50);
    window.navigator.vibrate(50);
  });
});
