var Scoped = {
		
	__namespace: "Scoped",

	attach : function(namespace) {
		if (namespace)
			Scoped.__namespace = namespace;
		var current = Globals.get(Scoped.__namespace);
		if (current == this)
			return this;
		Scoped.__revert = current;
		Globals.set(namespace, this);
		return this;
	},
	
	detach: function (forceDetach) {
		if (forceDetach)
			Globals.set(Scoped.__namespace, null);
		if (typeof Scoped.__revert != "undefined")
			Globals.set(Scoped.__namespace, Scoped.__revert);
		delete Scoped.__revert;
		return this;
	},
	
	exports: function (object) {
		if (typeof module != "undefined" && "exports" in module)
			module.exports = object;
		return this;
	}	

};