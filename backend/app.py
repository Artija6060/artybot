"""
app.py

This file is the main Flask application for ArtyBot.

What this file does:
- Creates and runs a Flask server
- Exposes an API endpoint for chat messages
- Receives user input from the frontend
- Delegates AI logic and conversation state handling to llm.py
- Returns AI responses back to the frontend as JSON
- Handles the final reveal (photo + handwritten note)

Important:
- This file does NOT talk directly to the LLM
- This file does NOT manage conversation logic
- Those responsibilities live in llm.py
"""

# -------------------------
# Import standard libraries
# -------------------------
from flask import Flask, request, jsonify
from flask_cors import CORS

# -------------------------
# Import our own LLM logic
# -------------------------
# This file will contain:
# - conversation stage tracking
# - Hugging Face API calls
from llm import process_user_message

# -------------------------
# Initialize Flask app
# -------------------------
app = Flask(__name__)

# Enable CORS so frontend (Netlify) can talk to backend (Render)
CORS(app)

# -------------------------
# Constants for final reveal
# -------------------------

# Path to your final photo (served via Flask static folder)
FINAL_PHOTO_URL = "/static/final_photo.jpg"

# Your handwritten / typed note
FINAL_NOTE_TEXT = """
My text

Love,
Arty
"""

# -------------------------
# Health check route
# -------------------------
@app.route("/", methods=["GET"])
def health_check():
    """
    Simple route to check if backend is running.
    Useful for debugging and Render health checks.
    """
    return jsonify({"status": "ArtyBot backend is alive 💖"})


# -------------------------
# Chat API route
# -------------------------
@app.route("/chat", methods=["POST"])
def chat():
    """
    Main chat endpoint.

    Expected request JSON:
    {
        "message": "user's message text"
    }

    Response JSON (normal chat):
    {
        "reply": "AI response text",
        "is_final": false
    }

    Response JSON (final reveal):
    {
        "reply": "final AI message",
        "is_final": true,
        "photo_url": "/static/final_photo.jpg",
        "note": "handwritten note text"
    }
    """

    # -------------------------
    # Parse incoming request
    # -------------------------
    data = request.get_json()

    # Safety check: ensure message exists
    if not data or "message" not in data:
        return jsonify({"error": "No message provided"}), 400

    user_message = data["message"]

    # -------------------------
    # Delegate logic to llm.py
    # -------------------------
    '''This function should:
    - decide conversation stage
    - generate AI reply
    - tell us whether it's time for final reveal
    # It returns TWO things:
    # 1. ai_reply → the text that ArtyBot should say next
    # 2. is_final_stage → True if it's time to show the photo + note
    '''
    ai_reply, is_final_stage = process_user_message(user_message)

    # -------------------------
    # Normal chat response
    # -------------------------
    '''
    # If we are NOT yet at the final stage,
    # this means the conversation is still ongoing.
    #
    # We send back:
    # - the AI's reply text
    # - a flag telling the frontend: "this is NOT the final screen"
    #
    # The frontend will:
    # - display the reply as a chat bubble
    # - keep the chat UI active
    '''
    if not is_final_stage:
        return jsonify({
            "reply": ai_reply,
            "is_final": False
        })

    # -------------------------
    # Final reveal response
    # -------------------------
    # If execution reaches here, it means:
    # - The conversation has reached its final stage
    # - It's time to reveal the special surprise
    #
    # We send back:
    # - the final AI message
    # - a flag telling frontend: "conversation is over"
    # - the URL of your photo
    # - your handwritten / typed note
    #
    # The frontend will:
    # - stop the chat input
    # - display the photo
    # - display the note beneath it
    return jsonify({
        "reply": ai_reply,              # Final message from ArtyBot
        "is_final": True,               # Triggers final reveal UI
        "photo_url": FINAL_PHOTO_URL,   # Your photo
        "note": FINAL_NOTE_TEXT         # Your signed note
    })



# -------------------------
# App entry point
# -------------------------
if __name__ == "__main__":
    """
    Run the Flask app locally.
    In production (Render), Gunicorn will run the app instead.
    """
    app.run(debug=True)
