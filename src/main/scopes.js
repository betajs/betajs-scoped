function newScope (parent, parentNamespace, rootNamespace, globalNamespace) {
	
	var self = this;
	var nextScope = null;
	var childScopes = [];
	var localNamespace = newNamespace({tree: true});
	var privateNamespace = newNamespace({tree: false});
	
	var bindings = {
		"global": {
			namespace: globalNamespace
		}, "root": {
			namespace: rootNamespace
		}, "local": {
			namespace: localNamespace
		}, "default": {
			namespace: privateNamespace
		}, "parent": {
			namespace: parentNamespace
		}, "scope": {
			namespace: localNamespace,
			readonly: false
		}
	};
	
	return {
		
		nextScope: function () {
			if (!nextScope)
				nextScope = newScope(this, localNamespace, rootNamespace, globalNamespace);
			return nextScope;
		},
		
		subScope: function () {
			var sub = this.nextScope();
			childScopes.push(sub);
			nextScope = null;
			return sub;
		},
		
		binding: function (alias, namespaceLocator, options) {
			if (!bindings[alias] || !bindings[alias].readonly)
				bindings[alias] = Helper.extend(options, this.resolve(namespaceLocator));
			return this;
		},
		
		resolve: function (namespaceLocator) {
			var parts = namespaceLocator.split(":");
			if (parts.length == 1) {
				return {
					namespace: privateNamespace,
					path: parts[0]
				};
			} else {
				var binding = bindings[parts[0]];
				return {
					namespace: binding.namespace,
					path : binding.path && parts[1] ? binding.path + "." + parts[1] : (binding.path || parts[1])
				};
			}
		},
		
		define: function () {
			var args = Helper.matchArgs(arguments, {
				namespaceLocator: true,
				dependencies: "array",
				hiddenDependencies: "array",
				callback: true,
				context: "object"
			});
			var ns = this.resolve(args.namespaceLocator);
			this.require(args.dependencies, args.hiddenDependencies, function () {
				ns.namespace.set(ns.path, args.callback.apply(args.context || this, arguments));
			}, this);
			return this;
		},
		
		extend: function () {
			var args = Helper.matchArgs(arguments, {
				namespaceLocator: true,
				dependencies: "array",
				hiddenDependencies: "array",
				callback: true,
				context: "object"
			});
			var ns = this.resolve(args.namespaceLocator);
			this.require(args.dependencies, args.hiddenDependencies, function () {
				ns.namespace.extend(ns.path, args.callback.apply(args.context || this, arguments));
			}, this);
			return this;
		},
		
		condition: function () {
			var args = Helper.matchArgs(arguments, {
				namespaceLocator: true,
				dependencies: "array",
				hiddenDependencies: "array",
				callback: true,
				context: "object"
			});
			var ns = this.resolve(args.namespaceLocator);
			this.require(args.dependencies, args.hiddenDependencies, function () {
				var result = args.callback.apply(args.context || this, arguments);
				if (result)
					ns.namespace.set(ns.path, result);
			}, this);
			return this;
		},
		
		require: function () {
			var args = Helper.matchArgs(arguments, {
				dependencies: "array",
				hiddenDependencies: "array",
				callback: true,
				context: "object"
			});
			var dependencies = args.dependencies || [];
			var allDependencies = dependencies.concat(args.hiddenDependencies || []);
			var count = allDependencies.length;
			var deps = [];
			if (count) {
				for (var i = 0; i < allDependencies.length; ++i) {
					var ns = this.resolve(allDependencies[i]);
					if (i < dependencies.length)
						deps.push(null);
					ns.namespace.obtain(ns.path, function (value) {
						if (this.i < deps.length)
							deps[this.i] = value;
						count--;
						if (count === 0)
							args.callback.apply(args.context || this.ctx, deps);
					}, {
						ctx: this,
						i: i
					});
				}
			} else
				args.callback.apply(args.context || this, deps);
			return this;
		},
		
		digest: function (namespaceLocator) {
			var ns = this.resolve(namespaceLocator);
			ns.namespace.digest(ns.path);
			return this;
		}		
		
	};
	
}