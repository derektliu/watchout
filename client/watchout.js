// start slingin' some d3 here.
var boardOptions = {
  boardWidth: 800,
  boardHeight: 600,
  enemyImage: 'downvote.png',
  enemyImageCollision: 'upvote.png',
  playerImage: 'snoo.png',
  backgroundColor: 'grey'
};

var allEnemies = [];
// set how often the enemies move
var interval = 3000;
var speed = 3000;
var numEnemies = 30;
var playerRadius = 20;
var enemyRadius = 30;
var collisions = 0;
var currentScore = 0;
var highScore = 0;

var player = { cx: boardOptions.boardWidth / 2, cy: boardOptions.boardHeight / 2, r: playerRadius };

// create enemies for board
var createEnemies = function(n) {
  for (var i = 0; i < n; i++ ) {
    allEnemies[i] = { r: enemyRadius };
    randomize(allEnemies[i]);
  }
};

// randomize position of current asteroid
var randomize = function(asteroid) {
  asteroid.cx = Math.random() * boardOptions.boardWidth;
  asteroid.cy = Math.random() * boardOptions.boardHeight;
  return asteroid;
};

createEnemies(numEnemies);

// Create SVG inside Board
d3.select('.board')
.append('svg')
.attr('baseProfile', 'full')
.attr('width', boardOptions.boardWidth)
.attr('height', boardOptions.boardHeight)
.append('rect')
.attr('width', '100%')
.attr('height', '100%')
.attr('fill', boardOptions.backgroundColor);

var svg = d3.select('svg');
var selectEnemy = svg.selectAll('enemy').data(allEnemies);
var selectPlayer = svg.selectAll('player').data([player]);

// // Create drag behavior
// var drag = d3.behavior.drag()
// .on('dragstart', function() { selectPlayer.style('fill', 'red'); })
// .on('drag', function() { selectPlayer.attr('cx', d3.event.x).attr('cy', d3.event.y); })
// .on('dragend', function() { selectPlayer.style('fill', 'orange'); });

// Create drag behavior
var drag = d3.behavior.drag()
.on('drag', function() { selectPlayer.attr('cx', d3.event.x).attr('cy', d3.event.y); });

// Updates coordinates for existing enemies
var updateCoordinates = function() {
  selectEnemy
  .transition().duration(speed)
  .attr('cx', function(d) { return Math.random() * boardOptions.boardWidth; })
  .attr('cy', function(d) { return Math.random() * boardOptions.boardHeight; });
};

var prevCollision = false;

var checkCollisions = function() {

  var collision = false;

  var xPlayer = selectPlayer.attr('cx');
  var yPlayer = selectPlayer.attr('cy');

  selectEnemy.each(function() {
    var xEnemy = d3.select(this).attr('cx');
    var yEnemy = d3.select(this).attr('cy');
    var distance = Math.sqrt( (Math.pow( (xPlayer - xEnemy), 2) + (Math.pow( (yPlayer - yEnemy), 2) ))); 
    if (distance < playerRadius + enemyRadius) {
      collision = true;
      d3.select(this).attr('fill', 'url(#enemyImageCollision)');
      d3.select('.collisions').select('span').data([collisions]).text(function(d) { return d; });
    } else {
      d3.select(this).attr('fill', 'url(#enemyImage)');
    }
  });

  if (collision) {
    currentScore = 0;    
    if (prevCollision !== collision) {
      collisions++;
    }
  }
  
  prevCollision = collision;
};

var keepScore = function() {
  // add to score every tick
  currentScore++;
  d3.select('.current').select('span').data([currentScore]).text(function(d) { return d; });

  if (currentScore > highScore) {
    highScore = currentScore;
    d3.select('.highscore').select('span').data([highScore]).text(function(d) { return d; });
  }
};

// Create image-pattern in SVG for enemies
svg.append('defs').append('pattern')
.attr('id', 'enemyImage')
.attr('height', '100%')
.attr('width', '100%')
.attr('viewBox', '0 0 100 100')
.append('image')
.attr('xlink:href', boardOptions.enemyImage)
.attr('width', 100)
.attr('height', 100);

// Create image-pattern in SVG for enemies on collision
svg.append('defs').append('pattern')
.attr('id', 'enemyImageCollision')
.attr('height', '100%')
.attr('width', '100%')
.attr('viewBox', '0 0 100 100')
.append('image')
.attr('xlink:href', boardOptions.enemyImageCollision)
.attr('width', 100)
.attr('height', 100);

// Create image-pattern in SVG for player
svg.select('defs').append('pattern')
.attr('id', 'playerImage')
.attr('height', '100%')
.attr('width', '100%')
.attr('viewBox', '0 0 100 100')
.append('image')
.attr('xlink:href', boardOptions.playerImage)
.attr('width', 100)
.attr('height', 100);

// Create Player inside SVG
selectPlayer
.enter()
.append('circle')
.attr('class', 'player')
.attr('cx', function(d) { return d.cx; })
.attr('cy', function(d) { return d.cy; })
.attr('r', function(d) { return d.r; })
.call(drag)
.style('fill', 'url(#playerImage');

// Create Enemies inside SVG
selectEnemy
.enter()
.append('circle')
.attr('class', 'enemy')
.attr('cx', function(d) { return d.cx; })
.attr('cy', function(d) { return d.cy; })
.attr('r', function(d) { return d.r; })
.attr('fill', 'url(#enemyImage)');

// Randomize locations of enemies
updateCoordinates();
setInterval(updateCoordinates, interval);

// Check collisions interval
// checkCollisions();
setInterval(checkCollisions, 10);

// Score increment timer
setInterval(keepScore, 100);


