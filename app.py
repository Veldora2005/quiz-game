from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

with open('questions.json', 'r') as f:
    questions = json.load(f)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get-questions')
def get_questions():
    return jsonify(questions)

@app.route('/save-score', methods=['POST'])
def save_score():
    data = request.get_json()
    with open('scores.txt', 'a') as f:
        f.write(f"{datetime.datetime.now()} - {data['name']}: {data['score']} / {data['total']}\n")
    return jsonify({"message": "Score saved!"})

if __name__ == '__main__':
    app.run(debug=True)
