from flask import Flask, render_template, request, jsonify
import json

main = Flask(__name__)

with open('questions.json', 'r') as f:
    questions = json.load(f)

@main.route('/')
def home():
    return render_template('index.html')

@main.route('/get-questions')
def get_questions():
    return jsonify(questions)

@main.route('/save-score', methods=['POST'])
def save_score():
    data = request.get_json()
    with open('scores.txt', 'a') as f:
        f.write(f"{datetime.datetime.now()} - {data['name']}: {data['score']} / {data['total']}\n")
    return jsonify({"message": "Score saved!"})

if __name__ == '__main__':
    main.run(debug=True)
