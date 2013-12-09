﻿///<reference path='../common.ts'/>
///<reference path='../../engines/knockout.ts'/>
import _chai = require('../chai');
var expect: chai.ExpectStatic = _chai.expect;
import _Knockout = require('../../engines/knockout');
var Knockout = _Knockout.Knockout;


var ko;
before(() => {
	ko = new Knockout();
});

// ReSharper disable WrongExpressionStatement
describe('Knockout Templating Engine', () => {

	it('handles basic template binding', done => {
		var source = '<p data-bind="text: name.first"></p>';
		var context = { name: { first: 'Jed' } };
		var expectedResult = '<p data-bind="text: name.first">Jed</p>';

		ko.compile(source, template => {
			expect(template(context)).to.equal(expectedResult);
			done();
		});
	});

});
