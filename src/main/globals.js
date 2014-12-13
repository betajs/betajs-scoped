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
	}

};