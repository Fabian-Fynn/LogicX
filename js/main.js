var board = [[]];
var result = [[]];

$('body').append('<div id="winMessage"><div id="message"> <h1>You did it!</h1><button id="newGame">Restart</button> </div></div>');
$('#winMessage').hide();
startGame();


function slotClick () {
  var id = $(this).attr('id');
  var rows = board.length;
  var col = id % rows;
  var row = Math.floor(id / rows);
  // console.log(row + '|' + col);
  var state = result[row][col];
  console.log(board);
  console.log(state);
  if(state == 0) {
    result[row][col] = 1;
  }
  else {
    result[row][col] = 0;
  }
  drawGame();
  check();

  };

$('#newGame').click(startGame);

function startGame() {
  $('#winMessage').hide();
  var rows = 8;
  board = [];
  result = [];
  $('#game').css('width', rows * 50)
  // $('#game').css('width', rows * 50)


  $('#game').empty();
  var row = [];
  var currentCol;
  var slotCount = 0;
  for (var i = 0 ; i < rows; i++) { //rows
    for (var j = 0; j < rows; j++) { //cols
      row[j] = (i+j) % 2;
      // console.log('row ' + j)
      $('#game').append('<button id="' + slotCount + '" class="slot empty">');
      slotCount++;
      if(j == 1 || j == 5)
      {
        row[j] = 1
      }
    };
    board.push(row);
    row = [];

  };

  result = board.map(
    function(){
      var arr = [];
      for (var i = 0; i < this.length; i++) {
        arr.push(0);
      };
      return arr;
    }, board);

  var hints = calcHints(board);
  console.log(hints)


  $('.slot').click(slotClick);

  drawGame();
}

function drawGame () {
  var slotCount = 0;
  for (var row = 0; row < result.length; row++) {
    for (var col = 0; col < result.length; col++) {
      if(result[row][col] == 1) {
        $('#' + slotCount).addClass('filled');
      }
      else {
        $('#' + slotCount).removeClass('filled');
      }
      slotCount++;
    };
  };
}

function check () {
  var won = true;
  for (var row = 0; row < result.length; row++) {
    for (var col = 0; col < result.length; col++) {
      if(board[row][col] != result[row][col]) {
        won = false;
      }
    }
  }

  if(won) {
    $('#winMessage').show();
  }
}

function calcHints(board) {
  var rowAmount = board.length;
  var hintsVert = []
  var hintsHor = []
  var blockHor = 0
  var blocksHor = []
  for (var row = 0; row < rowAmount; row++) {
    for (var col = 0; col < rowAmount; col++) {
      if(board[row][col] == 1){
        blockHor++
      }
      if((blockHor != 0) && (board[row][col] != 1 || col == rowAmount - 1 )) {
        blocksHor.push(blockHor)
        blockHor = 0
      }

    };
    hintsHor.push(blocksHor)
    blocksHor = []
    blockHor = 0
  };
  return hintsHor
}

$(function () {

});