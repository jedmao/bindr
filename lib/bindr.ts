﻿///<reference path='../vendor/dt-node/node.d.ts'/>
///<reference path='../vendor/dt-express/express.d.ts'/>
import express = require('express');
var extend = require('extend');
import Engine = require('./Engine');
import Promises = require('./Promises');
var Deferred = Promises.Deferred;


export function bind(request: Request, response: Response): Promises.Promise {
	var bindr = new Bindr(response);
	return bindr.bind(request.body);
}

export interface Request {
	body: any;
}

export interface Response {
	send(statusOrBody: any, body?: any): Response;
	json(statusOrBody: any, body?: any): Response;
}

interface BindRequest {
	engine?: string;
	data?: any;
	id?: string;
	source?: string;
	templates?: BindRequest[];
}

class Bindr implements BindRequest {
	private engines: { [key: string]: typeof Engine } = {};
	private boundTemplates: { [key: string]: string } = {};
	private binding: Promises.Deferred;

	constructor(private response: Response) {
	}

	public bind(context: BindRequest): Promises.Promise {

		var binding = this.binding = new Deferred();
		if (!this.validate(context)) {
			return binding.promise;
		}

		var binders: Promises.Promise[];
		renderContext.call(this);
		walkTemplates.call(this);
		resolveBinding.call(this);
		return binding.promise;

		function renderContext() {
			binders = [];
			if (!context.engine || !context.source) {
				return;
			}
			var rendering = new Deferred();
			binders.push(rendering.promise);
			// ReSharper disable once InconsistentNaming
			this.tryLoadingEngine(context).then(Engine => {
				new Engine().compile(context.source).done(template => {
					template.render(context.data).done(html => {
						this.boundTemplates[context.id] = html;
						rendering.resolve();
					});
				});
			}, this.invalidate.bind(this));
		}

		function walkTemplates() {
			if (!context.templates) {
				return;
			}
			context.templates.forEach(template => {
				binders.push(this.bind(extend({
					engine: context.engine,
					data: context.data
				}, template)));
			});
		}

		function resolveBinding() {
			Promises.when.apply(this, binders).done(() => {
				binding.resolve(this.boundTemplates);
			});
		}
	}

	private validate(context: BindRequest): boolean {
		var requireMethods = [
			this.requireId,
			this.requireSource,
			this.requireEngine
		];
		var valid = true;
		for (var i = 0; i < requireMethods.length; i++) {
			valid = requireMethods[i].call(this, context);
			if (!valid) {
				break;
			}
		}
		return valid;
	}

	private requireId(context: BindRequest): boolean {
		if (!context.id) {
			this.invalidate('missing required template id');
			return false;
		}
		return true;
	}

	private invalidate(message: string) {
		this.response.send(400, message);
		this.binding.reject(message);
	}

	private requireSource(context: BindRequest): boolean {
		if (!context.source) {
			this.invalidate('missing required template source');
			return false;
		}
		return true;
	}

	private requireEngine(context: BindRequest): boolean {
		if (!context.engine) {
			this.invalidate('unspecified template engine');
			return false;
		}
		return true;
	}

	private tryLoadingEngine(context: BindRequest): Promises.Promise {
		var loading = new Deferred();
		var engineName = context.engine;
		setTimeout(() => {
			try {
				loading.resolve(this.engines[engineName] ||
				    require('../engines/' + engineName));
			} catch (e) {
				loading.reject('unsupported template engine');
			}
		});
		return loading.promise;
	}
}
