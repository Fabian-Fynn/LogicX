var board = [[]]
var result = [[]]
var hintsHor = []
var hintsVer = [[]]
var mode = 1
var currentFilling = 0
var dragging = false
var startSlot
$('body').append('<div id="winMessage"><div id="message"> <h1>You did it!</h1><button id="newGame">Restart</button> </div></div>')
$('#winMessage').hide()

function getSlot($element) {
  var id = $element.attr('id')
  var rows = board.length
  var c = id % rows
  var r = Math.floor(id / rows)
  var status = result[r][c]

  return {state: status, row: r, col: c, id: id}
}

function click() {
  startSlot = getSlot($(this))
  if (startSlot.state == 0) {
    currentFilling = mode
  }
  else {
    currentFilling = 0
  }
  dragging = true
}

function drag() {
  var slot = getSlot($(this))
  if(dragging){
    dragSlot(slot, false)
  }
}

function endDrag() {
  var slot = getSlot($(this))
  if(dragging){
    dragging = false
    dragSlot(slot, true)
  }
}

function dragLeftSlot(){
  $(this).removeClass('filled-drag')
  $(this).removeClass('note-drag')
}

function dragSlot(slot, ended){
  var targets = []

  if(slot.row == startSlot.row){
    //left
    if(slot.col < startSlot.col) {
      for (var i = startSlot.col; i >= slot.col; i--) {
        targets.push({row: slot.row, col: i, id: i + (board.length * slot.row), state: result[slot.row][i]})
      }
    }
    //right
    else{
      for (var i = startSlot.col; i <= slot.col; i++) {
        targets.push({row: slot.row, col: i, id: i + (board.length * slot.row), state: result[slot.row][i]})
      }
    }
  }
  else if(slot.col == startSlot.col)
  {

    //up
    if(slot.row < startSlot.row) {

      for (var i = startSlot.row; i >= slot.row; i--) {
        targets.push({row: i, col: slot.col, id: (i * board.length) + slot.col, state: result[i][slot.col]})
      }
    }
    //down
    else{
      for (var i = startSlot.row; i <= slot.row; i++) {
        targets.push({row: i, col: slot.col, id: (i * board.length) + slot.col, state: result[i][slot.col]})
      }
    }
  }
  $.each(targets, function(i, element){
    if((startSlot.state != 0 && element.state == startSlot.state)){
      if(ended){
        result[element.row][element.col] = 0
        drawGame()
      }
      else{
        $('button#' + element.id).removeClass('filled')
        $('button#' + element.id).removeClass('note')
      }
    }
    if(startSlot.state == 0 && element.state == 0){
      if(mode == 1) {
        if(ended){
          result[element.row][element.col] = 1
          $('button#' + element.id).removeClass('filled-drag')
          drawGame()
        }
        else{
          $('button#' + element.id).addClass('filled-drag')
        }
      }
      else{
        if(ended){
          result[element.row][element.col] = 2
          $('button#' + element.id).removeClass('note-drag')
          drawGame()
        }
        else{
          $('button#' + element.id).addClass('note-drag')
        }
      }
    }
  })
}

$('#mode').click(changeMode)
$('#newGame').click(startGame)

function startGame() {
  $('#winMessage').hide()
  var rows = 8
  board = []
  result = []
  hintsHor = []
  hintsVer = [[]]
  $('#board').css('width', rows * 50)

  $('#board').empty()

  var row = []
  var currentCol
  var slotCount = 0
  for (var i = 0 ; i < rows; i++) { //rows
    for (var j = 0; j < rows; j++) { //cols
      row[j] = (i+j) % 2
      $('#board').append('<button id="' + slotCount + '" class="slot">')
      slotCount++
      if(j == 1 || j == 5)
      {
        row[j] = 1
      }
    }
    board.push(row)
    row = []
  }

  board[3][0] = 0
  board[3][1] = 0
  board[3][2] = 0
  board[3][3] = 0
  board[3][4] = 0
  board[3][5] = 0
  board[3][6] = 0
  board[3][7] = 0

  result = board.map(
    function(){
      var arr = []
      for (var i = 0; i < this.length; i++) {
        arr.push(0)
      }
      return arr
    }, board)

  calcHints(board)

  $('#hintsVertical').css('width', rows * 50 )
  $('#hintsHorizontal').css('margin-top', $('#hintsVertical').outerHeight())
  $('#hintsHorizontal').css('height', rows * 50 )
  $('#hintsVertical .hint ').css('height', $('#hintsVertical').outerHeight())

  $('#game').css('width', $('#board').outerWidth() + $('#hintsHorizontal').outerWidth() + 1)
  $('#game').css('height', $('#board').outerHeight() + $('#hintsVertical').outerHeight() + 1)
  $('.slot').mousedown(click)
  $('.slot').mouseup(endDrag)
  $('.slot').mouseleave(dragLeftSlot)
  $('#game').mouseleave(function() { dragging = false})

  $('.slot').mouseenter(drag)
  drawGame()
  var slotCount = 0

}

function solve() {
  var slotCount = 0
  for (var row = 0; row < result.length; row++) {
    for (var col = 0; col < result.length; col++) {
      if(board[row][col] == 1) {
        // $('#' + slotCount).addClass('filled')
        result[row][col] = 1
      }
      slotCount++
    }
  }
  drawGame()
  check()
}

function drawGame () {
  var slotCount = 0
  for (var row = 0; row < result.length; row++) {
    for (var col = 0; col < result.length; col++) {
      if(result[row][col] == 1) {
        $('#' + slotCount).addClass('filled')
      }
      else if(result[row][col] == 2){
        $('#' + slotCount).removeClass('filled')
        $('#' + slotCount).addClass('note')
      }
      else {
        $('#' + slotCount).removeClass('filled')
        $('#' + slotCount).removeClass('note')
      }
      $('#' + slotCount).removeClass('filled-drag')
      $('#' + slotCount).removeClass('note-drag')
      slotCount++
    }
  }
  if(mode == 1){
    $('#mode button').css('background-image', 'url("img/pen.png")')
  }
  else{
    $('#mode button').css('background-image', 'url("img/pencil.png")')
  }
  check()
}

function check () {
  var won = true
  for (var row = 0; row < result.length; row++) {
    for (var col = 0; col < result.length; col++) {
      if(board[row][col] != result[row][col] && result[row][col] != 2) {
        won = false
      }
    }
  }

  if(won) {
    $('#winMessage').show()
  }
}

function calcHints(board) {
  var rowAmount = board.length
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
        if(blockVer[col] != null){
          blockVer[col]++
        }
        else {
          blockVer[col] = 1
        }
      }
      else if(blockVer[col] == undefined){
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

    }
    hintsHor.push(blocksHor)
    blocksHor = []
    blockHor = 0
  }
  //append Hints
  var hor
  var ver
  $('#hintsHorizontal').empty()
  $('#hintsVertical').empty()
  for (var i = 0; i < rowAmount; i++) {
    $('#hintsVertical').append('<div id="ver' + i + '" class="hint vertical"></div>')
    $('#hintsHorizontal').append('<div id="hor' + i + '" class="hint horizontal"></div>')
    for (var j = 0; j < hintsVer[i].length; j++) {
      ver = hintsVer[i][j]
       if(j < hintsVer[i].length - 1){
        ver += '<br>'
      }
      $('#hintsVertical #ver' + i).append(ver)
    }

    if(hintsHor[i].length == 0) {
      $('#hintsHorizontal #hor' + i).append(0)
    }
    for (var j = 0; j < hintsHor[i].length; j++) {
      hor = hintsHor[i][j]
      if(j < hintsHor[i].length - 1){
        hor += ', '
      }
      $('#hintsHorizontal #hor' + i).append(hor)
    }
  }
}

function changeMode ()
{
  if(mode == 1){
    mode = 2
  }
  else{
    mode = 1
  }
  drawGame()
}


startGame()
