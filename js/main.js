var board = [];
var result = [];

$('body').append('<div id="winMessage"><div id="message"> <h1>You did it!</h1><button id="newGame">Restart</button> </div></div>');
$('#winMessage').hide();

for (var i = 4 ; i > 0; i--) {
  board.push( i % 2 );
  result.push(0);
};
for (var i = 0; i < board.length; i++) {
    // if(board[i] ==
    $('#game').append('<button id="' + i + '" class="slot empty">');

};
$('.slot').on("click", slotClick);

function slotClick () {
  var id = $(this).attr('id');

  var state = result[id];

  if(state == 0) {
    result[id] = 1;
  }
  else {
    result[id] = 0;
  }
  drawGame();
  check();

  };

$('#newGame').on("click", startGame);

function startGame() {
  $('#winMessage').hide();
  for (var i = result.length - 1; i >= 0; i--) {
    result[i] = 0;
  };
  console.log(result);
  drawGame();
}

function drawGame () {
  for (var i = result.length - 1; i >= 0; i--) {
    if(result[i] == 1) {
      $('#' + i).addClass('filled');
    }
    else {
      $('#' + i).removeClass('filled');
    }
  };
}

function check () {
  var won = true;
  for (var i = board.length - 1; i >= 0; i--) {
    if(board[i] != result[i]) {
      won = false;
    }
  };

  if(won) {
    $('#winMessage').show();
  }
}

$(function () {
  console.log(board);



});