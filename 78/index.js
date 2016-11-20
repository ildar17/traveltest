/*
function asyncFunction(callback) {
	setTimeout(callback, 200);
}
var color = 'blue';

asyncFunction(function () {
// Эта инструкция выполняется последней (на 200 мс позже)
	console.log('The color is ' + color);
});
color = 'green';*/

function asyncFunction(callback) {
	setTimeout(callback, 200);
}
var color = 'blue';

(function (color) {
	asyncFunction(function () {
		console.log('The color is ' + color);
	})
})(color);
color = 'green';
