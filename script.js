document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);

  const name = params.get("name") || "Ailyn";

  let candleCount = parseInt(params.get("candles")) || 4;

  // Keep candle count between 1 and 30
  candleCount = Math.min(Math.max(candleCount, 1), 30);


  document.getElementById("birthdayText").innerHTML = `
    <div id="mainTitle">Happy Birthday ${name}!</div>
    <div id="subTitle">May your wishes come true!</div>
  `;


  // ============================================================
  // CAKE
  // ============================================================

  const cake = document.getElementById("cake");


  // ============================================================
  // CANDLE COLORS
  // ============================================================

  const colors = [
    "green-candle",
    "purple-candle",
    "blue-candle",
    "yellow-candle"
  ];


  
  const CAKE_VISUAL_WIDTH = 35;
  const CANDLE_VISUAL_WIDTH = 2;


 

  const BLOW_THRESHOLD = 75;


const audio = new Audio("hbd.mp3");
audio.loop = false;

document.addEventListener("click", () => {
    audio.play();
}, { once: true });

  let analyser = null;

  let confettiStarted = false;

  let candlesBlown = false;


  // ============================================================
  // CREATE CANDLES
  // ============================================================

  function createCandles(count) {

    // Remove existing generated candles
    cake.querySelectorAll(".candle").forEach((candle) => {
      candle.remove();
    });


    const candlesPerRow = 6;

    const shiftAmount = 4;


    for (let i = 0; i < count; i++) {

      // Create candle
      const candle = document.createElement("div");

      candle.classList.add("candle");


      // Pick random color
      const color =
        colors[Math.floor(Math.random() * colors.length)];

      candle.classList.add(color);


      // ========================================================
      // POSITION
      // ========================================================

      const row = Math.floor(i / candlesPerRow);

      const col = i % candlesPerRow;


      const totalCandlesInRow = Math.min(
        candlesPerRow,
        count - row * candlesPerRow
      );


      const rowSpacing =
        CAKE_VISUAL_WIDTH /
        (totalCandlesInRow + 1);


      const leftBase =
        rowSpacing * (col + 1)
        - CANDLE_VISUAL_WIDTH / 2
        + 5;


      const rowShift =
        row % 2 === 0
          ? 0
          : shiftAmount;


      candle.style.position = "absolute";

      candle.style.top =
        `${10 + row * 3}px`;

      candle.style.left =
        `${leftBase - rowShift + 4}px`;


      // Add candle to cake
      cake.appendChild(candle);
    }
  }


  // ============================================================
  // CHECK IF USER IS BLOWING
  // ============================================================

  function isBlowing() {

    if (!analyser) {
      return false;
    }


    const bufferLength =
      analyser.frequencyBinCount;


    const dataArray =
      new Uint8Array(bufferLength);


    analyser.getByteFrequencyData(dataArray);


    let sum = 0;


    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }


    const average =
      sum / bufferLength;


    return average > BLOW_THRESHOLD;
  }


  // ============================================================
  // BLOW OUT CANDLES
  // ============================================================

  function blowOutCandles() {

    // Don't run again after all candles are blown
    if (candlesBlown) {
      return;
    }


    // Check whether the user is blowing
    if (!isBlowing()) {
      return;
    }


    const candles =
      [...cake.querySelectorAll(".candle")];


    if (candles.length === 0) {
      return;
    }


    // ========================================================
    // BLOW OUT EACH CANDLE
    // ========================================================

candles.forEach((candle) => {

  const delay = Math.random() * 700;

  setTimeout(() => {
    candle.classList.add("blown");
  }, delay);

});

// Hide the cake after candles start disappearing
setTimeout(() => {
  cake.style.display = "none";
}, 1500);

// Show image after cake disappears, while confetti is still active
setTimeout(() => {
  const endingPhoto = document.getElementById("ending-photo");
  if (endingPhoto) {
    console.log("Showing image");
    endingPhoto.style.display = "block";
    endingPhoto.style.visibility = "visible";
    endingPhoto.style.opacity = "1";
    console.log("Image display set to:", endingPhoto.style.display);
  } else {
    console.log("Image element not found");
  }
}, 2000);

candlesBlown = true;

    // ========================================================
    // START CELEBRATION
    // ========================================================

    setTimeout(() => {

      celebrate();

    }, 1200);
  }


  // ============================================================
  // CELEBRATION
  // ============================================================

  function celebrate() {

    // Change subtitle
    const subTitle =
      document.getElementById("subTitle");


    if (subTitle) {

      subTitle.textContent =
        "Yayy! Wishing you the happiest birthday ever!! 🎉";
    }


    // Initial confetti burst
    triggerConfetti();


    // Start endless confetti
    endlessConfetti();


    // Play birthday song

    const playPromise =
      audio.play();


    // Prevent the script from breaking if
    // the browser blocks audio
    if (playPromise !== undefined) {

      playPromise.catch((error) => {

        console.log(
          "Audio playback was blocked:",
          error
        );

      });
    }
  }


  // ============================================================
  // MICROPHONE SETUP
  // ============================================================

  async function startMic() {

    // Check browser support
    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {

      console.log(
        "getUserMedia is not supported by this browser."
      );

      return;
    }


    try {

      // Request microphone permission
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true
        });


      // Create AudioContext
      const audioContext =
        new (
          window.AudioContext ||
          window.webkitAudioContext
        )();


      // Create analyser
      analyser =
        audioContext.createAnalyser();


      // Same fftSize as your original code
      analyser.fftSize = 256;


      // Connect microphone to analyser
      const microphone =
        audioContext.createMediaStreamSource(stream);


      microphone.connect(analyser);


      // Check microphone every 200ms
      setInterval(() => {

        blowOutCandles();

      }, 200);


    } catch (error) {

      console.log(
        "Unable to access microphone:",
        error
      );

    }
  }


  // ============================================================
  // CONFETTI
  // ============================================================

  function triggerConfetti() {

    confetti({
      particleCount: 100,

      spread: 70,

      origin: {
        y: 0.6
      }
    });
  }


  // ============================================================
  // ENDLESS CONFETTI
  // ============================================================

  function endlessConfetti() {

    // Prevent multiple endless-confetti intervals
    if (confettiStarted) {
      return;
    }


    confettiStarted = true;


    setInterval(() => {

      confetti({
        particleCount: 200,

        spread: 90,

        origin: {
          y: 0
        }
      });

    }, 1000);
  }


  // ============================================================
  // START EVERYTHING
  // ============================================================

  createCandles(candleCount);

  startMic();

});

