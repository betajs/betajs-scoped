var Globals = {

	get : function(key) {
		try {
			if (window)
				return window[key];
		} catch (e) {
		}
		try {
			if (global)
				return global[key];
		} catch (e) {
		}
		return null;
	},

	set : function(key, value) {
		try {
			if (window)
				window[key] = value;
		} catch (e) {
		}
		try {
			if (global)
				global[key] = value;
		} catch (e) {
		}
		return value;
	},
	
	setPath: function (path, value) {
		var args = path.split(".");
		if (args.length == 1)
			return this.set(path, value);		
		var current = this.get(args[0]) || this.set(args[0], {});
		for (var i = 1; i < args.length - 1; ++i) {
			if (!(args[i] in current))
				current[args[i]] = {};
			current = current[args[i]];
		}
		current[args[args.length - 1]] = value;
		return value;
	},
	
	getPath: function (path) {
		var args = path.split(".");
		if (args.length == 1)
			return this.get(path);		
		var current = this.get(args[0]);
		for (var i = 1; i < args.length; ++i) {
			if (!current)
				return current;
			current = current[args[i]];
		}
		return current;
	}

};