// start slingin' some d3 here.

var allAsteroids = [];
// set how often the asteroids move
var interval = 1500;
var speed = 750;
var numAsteroids = 30;

var player = { cx: 350, cy: 225, r: 10 };

// create asteroids for board
var createAsteroids = function(n) {
  for (var i = 0; i < n; i++ ) {
    allAsteroids[i] = { r: 10 };
    randomize(allAsteroids[i]);
  }
};

// Board size: x="700" y="450"
// randomize position of current asteroid
var randomize = function(asteroid) {
  asteroid.cx = Math.random() * 700;
  asteroid.cy = Math.random() * 450;
  return asteroid;
};

createAsteroids(numAsteroids);
// console.log('allAsteroids', allAsteroids);

var svg = d3.select('svg');
var selectEnemy = svg.selectAll('enemy').data(allAsteroids);
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

// // Create Enemies
selectEnemy
.enter().append('circle')
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
