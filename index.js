#!/usr/bin/env node
const fs = require('fs/promises');
const normalFs = require('fs');
const readline = require('readline');

const args = process.argv;
if(args.length <= 3){
	console.error('Sorry but the strucure must be:\nperg regex files/directories');
	return;
}
const [regex,...paths] = args.slice(2);
const [,text,flags] = regex.match(/\/(.*)\/(.*)/);
async function checkPaths(regex,paths,dir = process.cwd()){
	if(paths.length === 0) return;
	try{
		const path = await fs.stat(dir+'/'+paths[0]);
		if(path.isDirectory()){
			checkPaths(regex,await fs.readdir(paths[0]),dir+'/'+paths[0]);
		}else{
			const readInterface = readline.createInterface({
				input: normalFs.createReadStream(dir+'/'+paths[0]),
				output: process.stdout,
				console:false,
			});
			let counter = 1;
			readInterface.on('line', (line) => {
				if(regex.test(line)){
					console.log('Line '+counter+':'+line);
				}
				counter++;
			});
		}
		paths.shift();
		checkPaths(regex, paths);
	}catch(error){
		console.log(error);
		return;
	}
}
checkPaths(new RegExp(text,flags), paths)
