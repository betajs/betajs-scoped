var globalNamespace = newNamespace({tree: true, global: true});
var rootNamespace = newNamespace({tree: true});
var rootScope = newScope(null, rootNamespace, rootNamespace, globalNamespace);

var Public = {
		
	guid: "4b6878ee-cb6a-46b3-94ac-27d91f58d666",
	version: '/* @echo MAJOR_VERSION */./* @echo MINOR_VERSION */',
		
	upgrade: Attach.upgrade,
	attach: Attach.attach,
	detach: Attach.detach,
	exports: Attach.exports,
	
	nextScope: Helper.method(rootScope, rootScope.nextScope),
	subScope: Helper.method(rootScope, rootScope.subScope),
	
	binding: Helper.method(rootScope, rootScope.binding),
	condition: Helper.method(rootScope, rootScope.condition),
	define: Helper.method(rootScope, rootScope.define),
	extend: Helper.method(rootScope, rootScope.extend),
	require: Helper.method(rootScope, rootScope.require),
	digest: Helper.method(rootScope, rootScope.digest),
	
	getGlobal: Helper.method(rootScope, rootScope.getPath),
	setGlobal: Helper.method(rootScope, rootScope.setPath)
	
};