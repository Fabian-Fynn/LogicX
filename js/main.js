var board = [[]];
var result = [[]];
var hintsHor = []
var hintsVer = [[]]
$('body').append('<div id="winMessage"><div id="message"> <h1>You did it!</h1><button id="newGame">Restart</button> </div></div>');
$('#winMessage').hide();
startGame();


function slotClick () {
  var id = $(this).attr('id');
  var rows = board.length;
  var col = id % rows;
  var row = Math.floor(id / rows);
  var state = result[row][col];

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

  board[3][5] = 0
  board[3][1] = 0

  result = board.map(
    function(){
      var arr = [];
      for (var i = 0; i < this.length; i++) {
        arr.push(0);
      };
      return arr;
    }, board);

  calcHints(board);
  console.log(hintsHor)
  console.log(hintsVer)


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
  var blockHor = 0
  var blocksHor = []
  var blockVer = []
  for (var col = 0; col < rowAmount - 1; col++) {
    hintsVer.push([])
  }

  for (var row = 0; row < rowAmount; row++) {
    for (var col = 0; col < rowAmount; col++) {
      if(board[row][col] == 1){
        blockHor++
        if(blockVer[col] != null)
        {
          blockVer[col]++
        }
        else {
          blockVer[col] = 1
        }

      }
      else if(blockVer[col] == undefined)
      {
        blockVer[col] = 0
      }
      if((blockHor != 0) && (board[row][col] != 1 || col == rowAmount - 1 )) {
        blocksHor.push(blockHor)
        blockHor = 0
      }
      if((blockVer[col] != 0) && (board[row][col] != 1 || row == rowAmount - 1 )) {
        hintsVer[col].push(blockVer[col])
        blockVer[col] = 0
      }

    };

    hintsHor.push(blocksHor)
    blocksHor = []
    blockHor = 0

  };
  // console.log(hintsVer)
  // this.hintsHor = hintsHor
  // this.hintsVer = hintsVer
}

$(function () {

});