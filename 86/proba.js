var fs = require('fs');
var tasks = [];
var pathDir = './text';
var allText = {};
var completedTasks = 0;

function checkIfComplete() {
	completedTasks++;
	if (completedTasks == tasks.length) {
		for (var index in allText) {
			console.log(index + ': ' + allText[index]);
		}
	}
}


function countWordsInText(text) {
	var words = text.toString().toLowerCase().split(/\W+/).sort();
	for(var index in words){
		var word = words[index];
		if(word){
			allText[word] = (allText[word]) ? allText[word] +1 : 1;
		}

	}
}


fs.readdir(pathDir, function (err, files) {
	if(err) throw err;
	for(var index in files){

		var task = (function (file) {

			return function () {

				fs.readFile(file, function (err, text) {
					if(err) throw err;
					countWordsInText(text);
					checkIfComplete();
				})
			}

		})(pathDir+'/'+files[index]);

		tasks.push(task);

	}

	for (var task in tasks){
		tasks[task]();
	}

});