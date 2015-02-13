var globalNamespace = newNamespace({tree: true, global: true});
var rootNamespace = newNamespace({tree: true});
var rootScope = newScope(null, rootNamespace, rootNamespace, globalNamespace);

var Public = {
		
	attach: Scoped.attach,
	detach: Scoped.detach,
	exports: Scoped.exports,
	
	nextScope: Helper.method(rootScope, rootScope.nextScope),
	subScope: Helper.method(rootScope, rootScope.nextScope),
	binding: Helper.method(rootScope, rootScope.binding),
	condition: Helper.method(rootScope, rootScope.condition),
	define: Helper.method(rootScope, rootScope.define),
	extend: Helper.method(rootScope, rootScope.extend),
	require: Helper.method(rootScope, rootScope.require),
	digest: Helper.method(rootScope, rootScope.digest),
	
	getGlobal: Helper.method(Globals, Globals.getPath),
	setGlobal: Helper.method(Globals, Globals.setPath)
	
};