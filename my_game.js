var buttonColors = ["red", "green", "yellow", "blue"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;
var clickEnabled = false; 
var userName = ""; 

$(document).ready(function() {
    $("#nameModal").show();
    loadLeaderboard();

    $("#toggle-leaderboard").click(function() {
        $(".leaderboard").toggle();
    });
});

$("#submit-name").click(function() {
    var nameInput = $("#username-input").val();
    if (nameInput && !isNameTaken(nameInput)) {
        userName = nameInput;
        $("#user-name").text("Игрок: " + userName);
        $("#nameModal").hide(); 
        $("#play-button").removeClass("d-none"); 
    } else {
        $("#error-message").text("Это имя уже занято. Пожалуйста, выберите другое имя.");
    }
});

function isNameTaken(name) {
    var leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    return leaderboard.some(function(entry) {
        return entry.name === name;
    });
}

$("#play-button").click(function() {
    startGame();
});

function startGame() {
    level = 0;
    gamePattern = [];
    userClickedPattern = [];
    started = false;
    clickEnabled = false;

    $("#level-title").text("Уровень " + level);
    $("#play-button").addClass("d-none");
    $("#game-buttons").removeClass("d-none");
    $("#toggle-leaderboard").removeClass("d-none");

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
        $("#level-title").text("Игра окончена, " + userName + ". Нажмите 'Играть', чтобы начать заново");

        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);

        saveToLeaderboard(userName, level);

        $("#play-button").removeClass("d-none");
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
        audio = new Audio("sounds/windows-error-sound-effect-35894.mp3");
    } else {
        audio = new Audio("sounds/item-pick-up-38258.mp3");
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

function saveToLeaderboard(name, score) {
    var leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    var existingPlayer = leaderboard.find(function(entry) {
        return entry.name === name;
    });

    if (existingPlayer) {
        if (score > existingPlayer.score) {
            existingPlayer.score = score;
        }
    } else {
        leaderboard.push({ name: name, score: score });
    }

    leaderboard.sort(function(a, b) { return b.score - a.score; });
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    loadLeaderboard();
}

function loadLeaderboard() {
    var leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    var leaderboardList = $("#leaderboard-list");
    leaderboardList.empty();
    leaderboard.forEach(function(entry) {
        leaderboardList.append("<li class='list-group-item'>" + entry.name + " - Уровень " + entry.score + "</li>");
    });
}
