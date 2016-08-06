// start slingin' some d3 here.

var allEnemies = [];
// set how often the asteroids move
var interval = 2000;
var speed = 2000;
var numEnemies = 10;
var playerRadius = 10;
var enemyRadius = 10;
var collisions = 0;
var currentScore = 0;
var highScore = 0;

var player = { cx: 350, cy: 225, r: playerRadius };

// create asteroids for board
var createEnemies = function(n) {
  for (var i = 0; i < n; i++ ) {
    allEnemies[i] = { r: enemyRadius };
    randomize(allEnemies[i]);
  }
};

// Board size: x="700" y="450"
// randomize position of current asteroid
var randomize = function(asteroid) {
  asteroid.cx = Math.random() * 700;
  asteroid.cy = Math.random() * 450;
  return asteroid;
};

createEnemies(numEnemies);

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
  // console.log(xPlayer, yPlayer);
  for (var i = 0; i < numEnemies; i++) {
    var xEnemy = selectEnemy.attr('cx');
    var yEnemy = selectEnemy.attr('cy');
    // console.log(xEnemy, yEnemy);
    var distance = Math.sqrt( (Math.pow( (xPlayer - xEnemy), 2) + (Math.pow( (yPlayer - yEnemy), 2) )));
    // console.log(i, Math.floor(distance));
    if (distance < playerRadius) {
      collisions++;
      currentScore = 0;
      // console.log('collision!', collisions);
      d3.select('.collisions').select('span').data([collisions]).text(function(d) { return d; });
    }
  }
  currentScore++;
  d3.select('.current').select('span').data([currentScore]).text(function(d) { return d; });

  if (currentScore > highScore) {
    highScore = currentScore;
    d3.select('.highscore').select('span').data([highScore]).text(function(d) { return d; });
  }

};
setInterval(checkCollisions, 10);

// // Create Enemies
selectEnemy
.enter()
.append('circle')
.attr('class', 'enemy')
.attr('cx', function(d) { return d.cx; })
.attr('cy', function(d) { return d.cy; })
.attr('r', function(d) { return d.r; })
.attr('href', 'asteroid.png');

// Randomize locations of enemies
setInterval(updateCoordinates, interval);

// Create Player
selectPlayer
.enter()
.append('circle')
.attr('class', 'player')
.attr('cx', function(d) { return d.cx; })
.attr('cy', function(d) { return d.cy; })
.attr('r', function(d) { return d.r; })
.call(drag)
.style('fill', 'orange');

// Check collisions interval


