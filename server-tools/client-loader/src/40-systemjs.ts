declare const System: any;

function loadWithSystem(entryFile: string) {
	log('load /%s with systemjs', entryFile);
	bootstrapComplete();
	return System.import(entryFile);
}
