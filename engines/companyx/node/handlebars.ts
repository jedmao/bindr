import _Handlebars = require('../../node/handlebars');


class Handlebars extends _Handlebars {

	onHandlebars(hb: HandlebarsStatic) {
		hb.registerHelper('link_to', function () {
			return '<a href="' + this.url + '">' + this.body + '</a>';
		});
	}
}

export = Handlebars;
