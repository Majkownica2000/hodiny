import os

from flask import Flask, render_template, jsonify
import time
from datetime import datetime

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/time")
def server_time():
    now = datetime.now().astimezone()
    return jsonify(
        {
            "timestamp": time.time(),
            "iso": now.isoformat(),
            "timezone": str(now.tzinfo),
        }
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)
