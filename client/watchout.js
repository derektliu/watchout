// start slingin' some d3 here.

var allEnemies = [];
// set how often the asteroids move
var interval = 3000;
var speed = 3000;
var numEnemies = 10;
var playerRadius = 10;
var enemyRadius = 40;
var collisions = 0;
var currentScore = 0;
var highScore = 0;
var boardWidth = 800;
var boardHeight = 600;

var player = { cx: boardWidth / 2, cy: boardHeight / 2, r: playerRadius };

// create asteroids for board
var createEnemies = function(n) {
  for (var i = 0; i < n; i++ ) {
    allEnemies[i] = { r: enemyRadius };
    randomize(allEnemies[i]);
  }
};

// randomize position of current asteroid
var randomize = function(asteroid) {
  asteroid.cx = Math.random() * boardWidth;
  asteroid.cy = Math.random() * boardHeight;
  return asteroid;
};

createEnemies(numEnemies);

// Create SVG inside Board
d3.select('.board')
.append('svg')
.attr('baseProfile', 'full')
.attr('width', boardWidth)
.attr('height', boardHeight)
.append('rect')
.attr('width', '100%')
.attr('height', '100%')
.attr('fill', 'black');

var svg = d3.select('svg');
var selectEnemy = svg.selectAll('enemy').data(allEnemies);
var selectPlayer = svg.selectAll('player').data([player]);

// Create drag behavior
var drag = d3.behavior.drag()
.on('dragstart', function() { selectPlayer.style('fill', 'red'); })
.on('drag', function() { selectPlayer.attr('cx', d3.event.x).attr('cy', d3.event.y); })
.on('dragend', function() { selectPlayer.style('fill', 'orange'); });

// Updates coordinates for existing asteroids
var updateCoordinates = function() {
  selectEnemy
  .transition().duration(speed)
  .attr('cx', function(d) { return Math.random() * 700; })
  .attr('cy', function(d) { return Math.random() * 450; });
};

var checkCollisions = function() {
  var xPlayer = selectPlayer.attr('cx');
  var yPlayer = selectPlayer.attr('cy');

  for (var i = 0; i < numEnemies; i++) {
    
    var xEnemy = selectEnemy[0][i].attributes.cx.value;
    var yEnemy = selectEnemy[0][i].attributes.cy.value;
    var distance = Math.sqrt( (Math.pow( (xPlayer - xEnemy), 2) + (Math.pow( (yPlayer - yEnemy), 2) )));
    
    if (distance < playerRadius + enemyRadius) {
      collisions++;
      currentScore = 0;
      d3.select('.collisions').select('span').data([collisions]).text(function(d) { return d; });
    }

  }
  // add to score every tick
  currentScore++;
  d3.select('.current').select('span').data([currentScore]).text(function(d) { return d; });

  if (currentScore > highScore) {
    highScore = currentScore;
    d3.select('.highscore').select('span').data([highScore]).text(function(d) { return d; });
  }

};

// Create Player inside SVG
selectPlayer
.enter()
.append('circle')
.attr('class', 'player')
.attr('cx', function(d) { return d.cx; })
.attr('cy', function(d) { return d.cy; })
.attr('r', function(d) { return d.r; })
.call(drag)
.style('fill', 'orange');

// Create pattern in SVG for asteroids
svg.append('defs').append('pattern')
.attr('id', 'image')
.attr('height', '100%')
.attr('width', '100%')
.attr('viewBox', '0 0 100 100')
.append('image')
.attr('xlink:href', 'asteroid.png')
.attr('width', 100)
.attr('height', 100);

// // Create Enemies inside SVG
selectEnemy
.enter()
.append('circle')
.attr('class', 'enemy spin')
.attr('cx', function(d) { return d.cx; })
.attr('cy', function(d) { return d.cy; })
.attr('r', function(d) { return d.r; })
.attr('fill', 'url(#image)');

updateCoordinates();
// Randomize locations of enemies
setInterval(updateCoordinates, interval);


// Check collisions interval
setInterval(checkCollisions, 10);


