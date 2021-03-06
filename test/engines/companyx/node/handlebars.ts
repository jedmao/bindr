﻿///<reference path='../../../common.ts'/>
import chai = require('chai');
var expect = chai.expect;
import Handlebars = require('../../../../engines/companyx/node/handlebars');
import Hbs = require('../../../../engines/companyx/node/hbs');


describe('companyx/node/handlebars template engine', () => {

	var hb;
	before(() => {
		hb = new Handlebars();
	});

	it('supports hbs alias', () => {
		expect(new Hbs()).to.be.an.instanceOf(Handlebars);
	});

	it('supports link_to helper', done => {
		var context = { url: '#foo', body: 'bar' };
		var source = '{{{link_to}}}';
		var expectedResult = '<a href="#foo">bar</a>';

		hb.compile(source).done(template => {
			template.render(context).done(html => {
				expect(html).to.equal(expectedResult);
			});
			done();
		});
	});
});
