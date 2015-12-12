test("basic dependencies", function() {
	stop();
	var counter = 0;
	var S = Scoped.subScope();
	var o = "";
	S.define("scope:B", ["scope:A"], function (A) {
		o += "B";
		counter++;
		return {
			b: A.a + 2
		};
	});
	S.define("scope:A", function () {
		o += "A";
		counter++;
		return {
			a: 5
		};
	});
	S.define("scope:C", function () {
		o += "C";
		counter++;
		return {
			c: 3
		};
	});
	var ptr = null;
	S.define("scope:D", ["scope:B", "scope:C"], function (B, C) {
		o += "D";
		counter++;
		ptr = {
			d: B.b + C.c + 1
		};
		return ptr;
	});
	S.define("scope:E", function () {
		o += "E";
		counter++;
		return {
			a: 5
		};
	});	
    S.require(["scope:D"], function (D) {
    	QUnit.equal(o, "ABCDE");
    	QUnit.equal(D.d, 5 + 2 + 3 + 1);
    	QUnit.equal(counter, 5);
    	QUnit.equal(ptr, D);
    	start();
    });
});


test("lazy dependencies", function() {
	stop();
	var counter = 0;
	var S = Scoped.subScope();
	S.options.lazy = true;
	//S.options.compile = true;
	var o = "";
	S.define("scope:B", ["scope:A"], function (A) {
		o += "B";
		counter++;
		return {
			b: A.a + 2
		};
	});
	S.define("scope:A", function () {
		o += "A";
		counter++;
		return {
			a: 5
		};
	});
	S.define("scope:C", function () {
		o += "C";
		counter++;
		return {
			c: 3
		};
	});
	var ptr = null;
	S.define("scope:D", ["scope:B", "scope:C"], function (B, C) {
		o += "D";
		counter++;
		ptr = {
			d: B.b + C.c + 1
		};
		return ptr; 
	});
	S.define("scope:E", function () {
		o += "E";
		counter++;
		return {
			a: 5
		};
	});
    S.require(["scope:D"], function (D) {
		QUnit.equal(o, "ABCD");
    	QUnit.equal(D.d, 5 + 2 + 3 + 1);
    	QUnit.equal(counter, 4);
    	//console.log(S.compiled);
    	QUnit.equal(ptr, D);
    	start();
    });
});
