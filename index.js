var ejs = require('ejs'), fs = require('fs'), q = require('q');
var async = require('async');

const dir = "src";
const builddir = "build";

var files = fs.readdirSync(dir);
async.each(files, function(file, callback){
	if (fs.lstatSync(dir + "/" +file).isFile()){
			createHEMLfile(dir, file)
				.then(function(value){
					return createHTMLfile(file);
				}).then(function(res){callback()}).catch(function(err){
						callback(err);
					});
	} else {
		callback();
	}
}, function(err){
 if(err){
 	console.log(err);
 }
 console.log("processing all elements completed");
});

function createHEMLfile(dir, file) {
	var defer = q.defer();
	ejs.renderFile(dir + "/" + file, "", "", function(err, str){
		if (err) {
			console.log(err);
		}
		var outputFileName = "build/" + file.replace(".ejs", "");
		fs.writeFileSync(outputFileName, str);
		defer.resolve(str);
	});
	return defer.promise;
}

function createHTMLfile(file) {
	var defer = q.defer();
	var inputFileName = "build/" + file.replace(".heml.ejs", ".heml");
	var outputFileName = "dist/" + file.replace(".heml.ejs", ".html");
	var exec = require('child_process').exec;
	var cmd = 'node_modules/.bin/heml build '+ inputFileName +' -o '+ outputFileName;

	exec(cmd, function(error, stdout, stderr) {
		if (error) {
			console.log(error);
			defer.reject(str);
		}
		if (stdout) {
			console.log(stdout);
			defer.resolve(stdout);
		}
		if (stderr) {
			console.log(stderr);
			defer.reject(stderr);
		}
	});
	return defer.promise;
}