async function sendMessage() {
  const input = document.getElementById("userInput");
  const chat = document.getElementById("chat");
  const text = input.value.trim();

  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  // ✅ SHOW typing indicator
  document.getElementById("typing").style.display = "block";

  const res = await fetch("http://127.0.0.1:5000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();

  // ✅ HIDE typing indicator
  document.getElementById("typing").style.display = "none";

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
}

/* ✅ ENTER KEY SENDS MESSAGE */
document.getElementById("userInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") sendMessage();
});
