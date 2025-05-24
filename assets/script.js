let currentQuestion = 0;
let score = 0;
let questions = [];
let timer;
let timeLimit = 10;
let username = "";

function startQuiz() {
    username = document.getElementById("username").value.trim();
    if (!username) {
        alert("Please enter your name to start.");
        return;
    }

    document.getElementById("start-screen").style.display = "none";
    document.getElementById("quiz-box").style.display = "block";
    document.getElementById("user-welcome").innerText = `Hello, ${username}! Best of luck!`;

    fetch('questions.json')
        .then(res => res.json())
        .then(data => {
            questions = data;
            loadQuestion();
        });
}

function loadQuestion() {
    if (currentQuestion < questions.length) {
        document.getElementById("question").innerText = questions[currentQuestion].Question;

        const optionsDiv = document.getElementById("options");
        optionsDiv.innerHTML = "";

        questions[currentQuestion].Options.forEach(option => {
            const btn = document.createElement("button");
            btn.innerText = option;
            btn.classList.add("option-btn");
            btn.onclick = () => {
                clearInterval(timer);
                disableOptions();
                highlightAnswer(btn, option);
                setTimeout(() => {
                    currentQuestion++;
                    loadQuestion();
                }, 1000);
            };
            optionsDiv.appendChild(btn);
        });

        startTimer(timeLimit);
    } else {
        showResult();
    }
}

function startTimer(seconds) {
    let timeLeft = seconds;
    const questionEl = document.getElementById("question");
    questionEl.innerText = questions[currentQuestion].Question + ` (Time Left: ${timeLeft}s)`;

    timer = setInterval(() => {
        timeLeft--;
        questionEl.innerText = questions[currentQuestion].Question + ` (Time Left: ${timeLeft}s)`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            disableOptions();
            highlightAnswer(null, null);  // skip
            setTimeout(() => {
                currentQuestion++;
                loadQuestion();
            }, 1000);
        }
    }, 1000);
}

function disableOptions() {
    document.querySelectorAll(".option-btn").forEach(btn => {
        btn.disabled = true;
    });
}

function highlightAnswer(clickedBtn, selectedOption) {
    const correctAnswer = questions[currentQuestion].Answer;

    document.querySelectorAll(".option-btn").forEach(btn => {
        if (btn.innerText === correctAnswer) {
            btn.style.backgroundColor = "#446600"; // green
        }
        if (selectedOption && btn.innerText === selectedOption && selectedOption !== correctAnswer) {
            btn.style.backgroundColor = "#990000"; // red
        }
    });

    if (selectedOption === correctAnswer) {
        score++;
    }
}

function showResult() {
    document.getElementById("quiz-box").style.display = "none";
    document.getElementById("result-box").style.display = "block";
    document.getElementById("score").innerText = `${score} / ${questions.length}`;
    document.getElementById("user-result").innerText = `Well done, ${username}!`;

    fetch('/save-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, score: score, total: questions.length })
    });
}
