// start slingin' some d3 here.

var allAsteroids = [];
// set how often the asteroids move
var interval = 1500;
var speed = 750;

// create asteroids for board
var createAsteroids = function(n) {
  for (var i = 0; i < n; i++ ) {
    allAsteroids[i] = { r: 10 };
    randomize(allAsteroids[i]);
  }
};

var svg = d3.select('svg');

// Board size: x="700" y="450"
// randomize position of current asteroid
var randomize = function(asteroid) {
  asteroid.cx = Math.random() * 700;
  asteroid.cy = Math.random() * 450;
  return asteroid;
};

var player = function () {
  svg.cx = 350;
  svg.cy = 225;
};

createAsteroids(30);
// console.log('allAsteroids', allAsteroids);

var selection = svg.selectAll('circle').data(allAsteroids);
// console.log('selection', selection);

// Updates coordinates for existing asteroids
var updateCoordinates = function() {

  selection
  .transition().duration(speed)
  .attr('cx', function(d) { return Math.random() * 700; })
  .attr('cy', function(d) { return Math.random() * 450; });

};

selection
.enter().append('circle')
.attr('class', 'enemy')
.attr('cx', function(d) { return d.cx; })
.attr('cy', function(d) { return d.cy; })
.attr('r', function(d) { return d.r; })
.attr('href', 'asteroid.png');

// selection
// .exit();

setInterval(updateCoordinates, interval);