inlets = 2;
var rnboPatchers = [];
var rnboRemote;
var targetName = "";

function setTargetName(tname){
	targetName = tname;
	post("target name set to", targetName, "\n");
}

function printPatchers(){
	getRnboPatchers();
	post("Found the following rnbo~ patchers:\n")
	for(i = 0; i < rnboPatchers.length; i++){
			post(rnboPatchers[i][0])
			post()
	}
	post("===========================\n")
}

function exportNamed(){
	getRnboPatchers();
	const userArguments = arrayfromargs(arguments);
	for(i = 0; i < userArguments.length; i++){
		var objName = userArguments[i];
		var result = rnboPatchers.find(obj => {
  			return obj[0] === objName
		})
		if(result !== undefined){
			sendExportMessage(result)
		}
	}
}

function bang() {
	if(inlet == 0){
    	printPatchers();
		post("\nStarting export\n");
		triggerExport();
	} else if(inlet == 1){
		triggerExport();
	}
}

function destroyAll(){
	getRnboPatchers();
	post("DESTROYING ALL");
	for(i = 0; i < rnboPatchers.length; i++){
			post(rnboPatchers[i][0]);
			rnboRemote.message("patcherdestroy", rnboPatchers[i][0]);
	}
	post();
}

function getRnboPatchers(){
	this.patcher.parentpatcher.apply(search);
	rnboPatchers = uniq(rnboPatchers);
}
getRnboPatchers.local = 1;

function triggerExport(){
	if(rnboPatchers.length == 0){
		post("\nno more patchers to export\n");
		return;
	}
	var obj = rnboPatchers.pop();
	sendExportMessage(obj)
}
triggerExport.local = 1;

function sendExportMessage(obj){
	post("exporting: "+obj[0]);
	obj[1].message("export", "oscquery-export", targetName);

}
sendExportMessage.local = 1;

function search(obj) {
    if (obj.maxclass == "rnbo~") {
		rnboPatchers.push([obj.getattr("title"), obj]);
    } else if(obj.maxclass == "rnbo.remote"){
		rnboRemote = obj;
		var tname = obj.getattr("name");
		if(tname !== "" && targetName == ""){
			setTargetName(obj.getattr("name"));
		}
	}
}
search.local = 1;

function uniq(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i][0];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = a[i];
         }
    }
    return out;
}
uniq.local = 1;
