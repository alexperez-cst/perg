const fs = require('fs/promises');

const [regex,...paths] = process.argv.slice(2);
const [,text,flags] = regex.match(/\/(.*)\/(.*)/);

async function checkPaths(regex,paths,dir = process.cwd()){
	try{
		if(paths.length === 0) return;
		const path = await fs.stat(dir+'/'+paths[0]);
		if(path.isDirectory()){
			checkPaths(regex,await fs.readdir(paths[0]),dir+'/'+paths[0]);
		}else{
			console.log(process.cwd());
			const fileData =await fs.readFile(dir+'/'+paths[0],'utf8');
			console.log(regex);
			if(regex.test(fileData)){
				console.log(paths[0]);
			}
		}
		paths.shift();
		checkPaths(regex, paths);
	}catch(error){
		console.log(error);
		return;
	}
}
checkPaths(new RegExp(text,flags), paths)
