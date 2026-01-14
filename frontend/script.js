const sendSound = new Audio("send.mp3");
const receiveSound = new Audio("receive.mp3");
const heartPop = new Audio("pop.mp3");
const dhinchak = new Audio("dhinchak.mp3");
const balle = new Audio("balle.mp3");
const totoro = new Audio("totoro sound.mp3")


async function sendMessage() {
  const input = document.getElementById("userInput");
  const chat = document.getElementById("chat");
  const text = input.value.trim();

  if (!text) return;

  sendSound.currentTime = 0;
  sendSound.play();
  addMessage(text, "user");
  input.value = "";

  // ✅ SHOW typing indicator
  document.getElementById("typing").style.display = "block";

  const res = await fetch("https://artybot-backend.onrender.com/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();

  // ✅ HIDE typing indicator
  document.getElementById("typing").style.display = "none";

  receiveSound.currentTime = 0;
  receiveSound.play();
  addMessage(data.reply, "bot");
}

function addMessage(text, type) {
  const chat = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function enterChat() {
  document.getElementById("landing").style.display = "none";
  document.getElementById("chatPage").style.display = "flex";
  addMessage("Hi Boo! Wanna talk? 🐰", "bot");
}

/* ✅ ENTER KEY SENDS MESSAGE */
document.getElementById("userInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") sendMessage();
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".hearts span").forEach(heart => {
    heart.addEventListener("click", () => {

      heartPop.currentTime = 0;
      heartPop.play();

      heart.style.setProperty("--pulse", "1.8");
      heart.style.filter = "drop-shadow(0 0 14px hotpink)";

      setTimeout(() => {
        heart.style.setProperty("--pulse", "1");
        heart.style.filter = "";
      }, 300);
    });
  });
});

document.getElementById("leftShin").addEventListener("click", () => {
  dhinchak.currentTime = 0;
  dhinchak.play();
});

document.getElementById("rightShin").addEventListener("click", () => {
  balle.currentTime = 0;
  balle.play();
});

function showTotoro() {
  const box = document.getElementById("totoroBox");
  box.style.display = "flex";
  box.style.height = "min(580px, 92vh)";
  box.classList.add("show");

  document.getElementById("landing").classList.add("show-scroll");

}

document.addEventListener("DOMContentLoaded", () => {
  const totoroImg = document.querySelector("#totoroBox img");

  totoroImg.addEventListener("click", () => {
    totoro.currentTime = 0;
    totoro.play();

    const paw = document.getElementById("bigPaw");
    paw.style.display = "flex";

    setTimeout(() => {
      paw.style.display = "none";
    }, 1200);
  });
});
