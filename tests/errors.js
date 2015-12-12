test("double define", function() {
	var S = Scoped.subScope();
	S.define("scope:Foobar", function () {
		return {};
	});
	QUnit.throws(function () {
		S.define("scope:Foobar", function () {
			return {};
		});
	});
});

test("access undefined binding", function() {
	var S = Scoped.subScope();
	S.binding("test", "scope:Test");
	S.require(["test:Foobar"], function () {});
	QUnit.throws(function () {
		S.require(["testx:Foobar"], function () {});
	});
});

test("version requirement", function () {
	S = Scoped.subScope();
	S.define("scope:First", function () {
		return {
			version: "42.12345"
		};
	});
	S.define("scope:Second", function () {
		return {
			version: "3.1415"
		};
	});
	S.assumeVersion("scope:First.version", 42);
	QUnit.throws(function () {
		S.assumeVersion("scope:Second.version", 4);
	});
});