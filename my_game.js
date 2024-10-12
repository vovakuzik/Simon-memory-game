var buttonColors = ["red", "green", "yellow", "blue"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;
var clickEnabled = false;

$(document).ready(function() {
    $("#play-button").removeClass("d-none"); // Показываем кнопку "Играть" при загрузке страницы
});

$("#play-button").click(function() {
    startGame();
});

function startGame() {
    level = 0;
    gamePattern = [];
    userClickedPattern = [];
    started = true;
    clickEnabled = false;

    $("#play-button").addClass("d-none"); // Скрываем кнопку "Играть" после начала игры
    nextSequence();
}

$(".simon-btn").click(function() {
    if (!clickEnabled) return;

    var userChosenColor = $(this).attr("id");
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
});

function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(function() {
                nextSequence();
            }, 1000);
        }
    } else {
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);
        $("#play-button").removeClass("d-none").text("Играть снова"); // Показать кнопку для перезапуска игры
        started = false;
    }
}

function nextSequence() {
    userClickedPattern = [];
    level++;
    $("#level-title").text("Уровень " + level);

    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);

    showSequence();
}

function showSequence() {
    clickEnabled = false;
    var i = 0;
    var intervalId = setInterval(function() {
        var currentColor = gamePattern[i];
        $("#" + currentColor).fadeIn(100).fadeOut(100).fadeIn(100);
        playSound(currentColor);
        i++;
        if (i >= gamePattern.length) {
            clearInterval(intervalId);
            clickEnabled = true;
        }
    }, 600);
}

function playSound(color) {
    var audio;
    if (color === "wrong") {
        audio = new Audio("sounds/windows-error-sound-effect-35894.mp3"); // Звук ошибки
    } else {
        audio = new Audio("sounds/item-pick-up-38258.mp3"); // Звук нажатия на цветную кнопку
    }
    audio.play().catch(function(error) {
        console.error("Ошибка воспроизведения звука:", error);
    });
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function() {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}
