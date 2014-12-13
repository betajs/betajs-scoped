test("basic dependencies", function() {
	stop();
    Scoped.extend("scope:Second", ["scope:Second"], ["scope:Second.result"], function (second) {
    	return {
    		add: second.result + 2
    	};
    });
	Scoped.define("scope:Second", ["scope:First"], function (first) {
		return {
			result: first.a * 5
		};
	});
    Scoped.define("scope:First", function() {
        return {
            a : 3
        };
    });
    Scoped.require(["scope:Second"], ["scope:Second.add"], function (second) {
    	QUnit.equal(second.result, 3 * 5);
    	QUnit.equal(second.add, 3 * 5 + 2);
    	start();
    });
});
