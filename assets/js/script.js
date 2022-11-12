//Hard coded questions, choices, and correct answer from sample
var questions = [
    {
        question: "Commonly used data types DO NOT include:",
        choices: ["strings", "booleans", "alerts", "numbers"],
        answer: "alerts"
    },
    {
        question: "The condition in an if / else statement is enclosed within ____.",
        choices: ["quotes", "curly brackets", "parenthesis", "square brackets"],
        answer: "parenthesis"
    },
    {
        question: "Arrays in JavaScript can be used to store ____.",
        choices: ["numbers and strings", "other arrays", "booleans", "all of the above"],
        answer: "all of the above"
    },
    {
        question: "String values must be enclosed within ____ when being assigned to variables.",
        choices: ["commas", "curly brackets", "quotes", "parenthesis"],
        answer: "quotes"
    },
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        choices: ["JavaScript", "terminal/bash", "for loops", "console log"],
        answer: "console log"
    },

];

var highScores;
var questionIndex = 0;

var wrapper = document.querySelector("#wrapper");
var topDiv = createDiv("", "topDiv", "");// document.querySelector("#topDiv");

var countdown = createDiv("Countdown: 0", "countdown");// document.querySelector("#countdown");
var viewHighScoresLink = createNav("viewHighScoresLink");// document.querySelector("#viewHighScoresLink");

var questionsDiv = createDiv("", "questionsDiv"); // document.querySelector("#questionsDiv");
var answerDiv = createDiv("", "answerDiv", ""); // document.querySelector("#answerDiv");
var highScoresDiv = createDiv("", "highScoresDiv", ""); // document.querySelector("#highScoresDiv");

var secondsLeft = 75;
var penalty = 10;
var olElement = document.createElement("ol");

//Function to set the countdown value to the Time: secondsLeft
function setCountdown(){
    countdown.textContent = "Time: " + secondsLeft;
}

//Helper function to create an h1 element
function createh1(text){
    var localh1 = document.createElement("h1");
    localh1.textContent = text;

    return localh1;
}

//Helper function to create p and set style attribute
function createp(text){
    var localp = document.createElement("p");
    localp.textContent = text;
    localp.setAttribute("style", "font-size: 24px");

    return localp;
}

//Helper function to createNav and set id attribute
function createNav(id){
    localNav = document.createElement("nav");
    localNav.setAttribute("id", id);
    return localNav;
}

//Helper function to create div with optional text, id and optional style
function createDiv(text, id, style){
    var localDiv = document.createElement("div");
    if(text != ""){
        localDiv.textContent = text;
    }
    
    localDiv.setAttribute("id", id);

    if(style != ""){
        localDiv.setAttribute("style", style);
    }

    return localDiv;
}

//Helper function to create label
function createLabel(text){
    var localLabel = document.createElement("label");
    localLabel.textContent = text;

    return localLabel;
}

//Helper function to create input
function createInput(){
    var localInput = document.createElement("input");
    localInput.setAttribute("type", "text");
    localInput.setAttribute("id", "initials");
    localInput.textContent = "";

    return localInput;
}

//Helper function to create button with text and id
function createButton(text, id){
    var localButton = document.createElement("button");
    localButton.textContent = text;
    localButton.setAttribute("id", id);

    return localButton;
}

var countdownInterval;

//When the view High Scores "link" is clicked, calls Displays High Scores
viewHighScoresLink.addEventListener("click", function () {
    DisplayHighScores();
})

var clearResultsTimeout;

//Clears the entire wrapper innerHTML
function clearExistingInformation(){
    wrapper.innerHTML = "";
}

//Just clears the questions and ol element, and in 2 seconds, clears the results (whether Correct or Wrong) as indicated from the sample gif
function clearPreviousQuestion(){
    questionsDiv.innerHTML = "";
    olElement.innerHTML = "";

    clearResultsTimeout = setTimeout(function(){ answerDiv.innerHTML = "" }, 2000);
}

//This function displays the start screen with instructions.  If the button is clicked, then the quiz and timer start. You can also view the High Scores from this page.
function displayStartScreen(){
    highScores = JSON.parse(localStorage.getItem("highScores"));
    clearExistingInformation();
    countdown.textContent = "Time: 0";
    viewHighScoresLink.textContent = "View high scores";
    topDiv.appendChild(viewHighScoresLink);
    topDiv.appendChild(countdown);
    wrapper.appendChild(topDiv);
    
    questionIndex = 0;

    questionsDiv.innerHTML = "";

    questionsDiv.appendChild(createh1("Coding Quiz Challenge"));

    questionsDiv.appendChild(createp("Try to answer the following code-related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds!"));

    var startQuizButton = createButton("Start Quiz", "buttons")
    questionsDiv.appendChild(startQuizButton);

    wrapper.appendChild(questionsDiv);

    startQuizButton.addEventListener("click", function () {
        secondsLeft = 75;
        displayQuestion(questionIndex);
    
        countdownInterval = setInterval(function () {
            setCountdown();
            if (secondsLeft <= 0) {
                clearInterval(countdownInterval);
                AllDone();
            }
            else
            {
                secondsLeft--;
            }
        }, 1000);
    });
}

//This function displays the question with multiple choice buttons to click on to answer.
function displayQuestion(questionIndex) {
    clearPreviousQuestion();
    setCountdown();

    viewHighScoresLink.innerHTML = "";

    questionsDiv.textContent = questions[questionIndex].question;
    questionsDiv.setAttribute("style", "font-size: 24px; text-align: left; font-weight: bold;")
    
    var userChoices = questions[questionIndex].choices;
    let index = 1;
    userChoices.forEach(function (newItem) {
        var listItem = document.createElement("li");

        listItem.appendChild(createButton(index + ". " + newItem, "listItemButton"));
        
        questionsDiv.appendChild(olElement);
        olElement.appendChild(listItem);
        listItem.addEventListener("click", (includes));
        index++;
    })

    wrapper.appendChild(questionsDiv);
}

//This checks that a button has been clicked, and if clicked, checks if the answer is correct or wrong.
function includes(event) {
    var element = event.target;

    if (element.matches("button")) {

        if (element.textContent.includes(questions[questionIndex].answer)) {
            clearTimeout(clearResultsTimeout);
            answerDiv.innerHTML = "";
            answerDiv.appendChild(createDiv("Correct!", "answerResultsDiv", "font-style:italic; font:gray;"));
        } else {
            secondsLeft -= penalty;
            clearTimeout(clearResultsTimeout);
            answerDiv.innerHTML = "";
            answerDiv.appendChild(createDiv("Wrong!", "answerResultsDiv", "font-style:italic; font:gray;"));
        }
        
    }

    questionIndex++;

    setCountdown();
    if (questionIndex >= questions.length || secondsLeft <= 0) {
        AllDone();
    } else {
        displayQuestion(questionIndex);
    }
    wrapper.appendChild(answerDiv);
}

var GoBackButton = createButton("Go Back", "buttons");

var ClearHighScoresButton = createButton("Clear high scores", "buttons");

//This sorts the high score objects based on the score.
function compare( a, b ) {
    if ( a.score > b.score ){
        return -1;
    }
    if ( a.score < b.score ){
        return 1;
    }
    return 0;
}

//This function displays the high scores. It gets the high scores from local storage.
function DisplayHighScores(){
    clearExistingInformation();
    highScoresDiv.innerHTML = "";

    countdown.textContent = "";
    viewHighScoresLink.textContent = "";
    highScoresDiv.appendChild(createh1("High scores"));

    if(highScores == undefined || highScores == "")
    {
        highScores = [];
    }

    if(highScores.length > 0){
        highScores.sort(compare);
    }

    olElement.innerHTML = "";
    for(var i = 0; i < highScores.length; i++){
        var listItem = document.createElement("li");
        listItem.textContent = (i+1) + ". " + highScores[i].initials + " - " + highScores[i].score;

        olElement.appendChild(listItem);
    }
    highScoresDiv.appendChild(olElement);

    var highScoresButtonDiv = createDiv("", "highScoresButtonDiv", "display: flex; flex-direction: row;");

    highScoresButtonDiv.appendChild(GoBackButton);
    highScoresButtonDiv.appendChild(ClearHighScoresButton);

    highScoresDiv.appendChild(highScoresButtonDiv);

    wrapper.appendChild(highScoresDiv);
}

//This is the final page displayed at the end of the quiz.  If the initials are not entered, then we alert the user.  Once the initials are entered and submitted,
//then we save this information in local storage.
function AllDone() {
    clearPreviousQuestion();

    questionsDiv.appendChild(createh1("All done!"));

    clearInterval(countdownInterval);

    questionsDiv.appendChild(createp("Your final score is: " + secondsLeft));

    var submissionDiv = document.createElement("div");

    submissionDiv.appendChild(createLabel("Enter your initials:"));
    submissionDiv.setAttribute("style", "display: flex; flex-direction: row;");

    var inputElement = createInput();
    submissionDiv.appendChild(inputElement);

    var submitButton = createButton("Submit", "buttons");

    submissionDiv.appendChild(submitButton);

    questionsDiv.appendChild(submissionDiv);

    submitButton.addEventListener("click", function () {
        var initials = inputElement.value;

        if (initials === null || initials === "") {
            console.log("No initials entered!");
            alert("No initials entered!")
        } else {
            var finalScore = {
                initials: initials,
                score: secondsLeft
            }

            if(highScores == undefined)
            {
                highScores = [];
            }
            highScores.push(finalScore);
            localStorage.setItem("highScores", JSON.stringify(highScores));
            DisplayHighScores();
        }
    });    
}

//If the go back button is clicked from the high scores page, then we display the start screen.
GoBackButton.addEventListener("click", function(){
    displayStartScreen();
});

//If the clear high scores button is clicked from the high scores page, then we clear the local storage,
//and redisplay the high scores.
ClearHighScoresButton.addEventListener("click", function(){
    highScores = [];
    localStorage.setItem("highScores", JSON.stringify(highScores));
    DisplayHighScores();
});

//This is called when loaded, displaying the start screen of the quiz.
displayStartScreen();