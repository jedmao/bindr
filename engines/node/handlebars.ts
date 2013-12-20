///<reference path='../../vendor/dt-handlebars/handlebars.d.ts'/>
import Engine = require('../../lib/Engine');
import hb = require('handlebars');
import Promises = require('../../lib/Promises');
var Deferred = Promises.Deferred;


class Handlebars extends Engine {

	hb = hb;
	private _render: Function;

	compile(source: string): Promises.Promise {
		this._render = this.hb.compile(source);
		var compiling = new Deferred();
		setTimeout(() => {
			compiling.resolve({
				render: this.onRender.bind(this)
			});
		});
		return compiling.promise;
	}

	private onRender(context: {}): Promises.Promise {
		var rendering = new Deferred();
		setTimeout(() => {
			rendering.resolve(this._render(context));
		});
		return rendering.promise;
	}
}

export = Handlebars;
