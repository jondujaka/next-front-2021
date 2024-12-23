!(function (e, t) {
	for (var r in t) e[r] = t[r];
})(
	exports,
	(function (e) {
		var t = {};
		function r(o) {
			if (t[o]) return t[o].exports;
			var s = (t[o] = { i: o, l: !1, exports: {} });
			return e[o].call(s.exports, s, s.exports, r), (s.l = !0), s.exports;
		}
		return (
			(r.m = e),
			(r.c = t),
			(r.d = function (e, t, o) {
				r.o(e, t) ||
					Object.defineProperty(e, t, { enumerable: !0, get: o });
			}),
			(r.r = function (e) {
				"undefined" != typeof Symbol &&
					Symbol.toStringTag &&
					Object.defineProperty(e, Symbol.toStringTag, {
						value: "Module"
					}),
					Object.defineProperty(e, "__esModule", { value: !0 });
			}),
			(r.t = function (e, t) {
				if ((1 & t && (e = r(e)), 8 & t)) return e;
				if (4 & t && "object" == typeof e && e && e.__esModule)
					return e;
				var o = Object.create(null);
				if (
					(r.r(o),
					Object.defineProperty(o, "default", {
						enumerable: !0,
						value: e
					}),
					2 & t && "string" != typeof e)
				)
					for (var s in e)
						r.d(
							o,
							s,
							function (t) {
								return e[t];
							}.bind(null, s)
						);
				return o;
			}),
			(r.n = function (e) {
				var t =
					e && e.__esModule
						? function () {
								return e.default;
							}
						: function () {
								return e;
							};
				return r.d(t, "a", t), t;
			}),
			(r.o = function (e, t) {
				return Object.prototype.hasOwnProperty.call(e, t);
			}),
			(r.p = ""),
			r((r.s = 109))
		);
	})([
		function (e, t, r) {
			"use strict";
			const o = r(16),
				s = r(1),
				{
					StripeConnectionError: i,
					StripeAuthenticationError: n,
					StripePermissionError: a,
					StripeRateLimitError: p,
					StripeError: c,
					StripeAPIError: h
				} = r(3),
				d = r(4);
			(u.extend = s.protoExtend),
				(u.method = r(10)),
				(u.BASIC_METHODS = r(25)),
				(u.MAX_BUFFERED_REQUEST_METRICS = 100);
			function u(e, t) {
				if (((this._stripe = e), t))
					throw new Error(
						"Support for curried url params was dropped in stripe-node v7.0.0. Instead, pass two ids."
					);
				(this.basePath = s.makeURLInterpolator(
					this.basePath || e.getApiField("basePath")
				)),
					(this.resourcePath = this.path),
					(this.path = s.makeURLInterpolator(this.path)),
					this.includeBasic &&
						this.includeBasic.forEach(function (e) {
							this[e] = u.BASIC_METHODS[e];
						}, this),
					this.initialize(...arguments);
			}
			(u.prototype = {
				path: "",
				basePath: null,
				initialize() {},
				requestDataProcessor: null,
				validateRequest: null,
				createFullPath(e, t) {
					return o
						.join(
							this.basePath(t),
							this.path(t),
							"function" == typeof e ? e(t) : e
						)
						.replace(/\\/g, "/");
				},
				createResourcePathWithSymbols(e) {
					return (
						"/" +
						o.join(this.resourcePath, e || "").replace(/\\/g, "/")
					);
				},
				wrapTimeout: s.callbackifyPromiseWithTimeout,
				_timeoutHandler: (e, t, r) => () => {
					const e = new TypeError("ETIMEDOUT");
					(e.code = "ETIMEDOUT"), t.destroy(e);
				},
				_addHeadersDirectlyToObject(e, t) {
					(e.requestId = t["request-id"]),
						(e.stripeAccount =
							e.stripeAccount || t["stripe-account"]),
						(e.apiVersion = e.apiVersion || t["stripe-version"]),
						(e.idempotencyKey =
							e.idempotencyKey || t["idempotency-key"]);
				},
				_makeResponseEvent(e, t, r) {
					const o = Date.now(),
						i = o - e.request_start_time;
					return s.removeNullish({
						api_version: r["stripe-version"],
						account: r["stripe-account"],
						idempotency_key: r["idempotency-key"],
						method: e.method,
						path: e.path,
						status: t,
						request_id: this._getRequestId(r),
						elapsed: i,
						request_start_time: e.request_start_time,
						request_end_time: o
					});
				},
				_getRequestId: e => e["request-id"],
				_streamingResponseHandler(e, t) {
					return r => {
						const o = r.getHeaders(),
							s = r.toStream(() => {
								const t = this._makeResponseEvent(
									e,
									r.getStatusCode(),
									o
								);
								this._stripe._emitter.emit("response", t),
									this._recordRequestMetrics(
										this._getRequestId(o),
										t.elapsed
									);
							});
						return (
							this._addHeadersDirectlyToObject(s, o), t(null, s)
						);
					};
				},
				_jsonResponseHandler(e, t) {
					return r => {
						const o = r.getHeaders(),
							s = this._getRequestId(o),
							i = r.getStatusCode(),
							d = this._makeResponseEvent(e, i, o);
						this._stripe._emitter.emit("response", d),
							r
								.toJSON()
								.then(
									e => {
										if (e.error) {
											let t;
											throw (
												("string" == typeof e.error &&
													(e.error = {
														type: e.error,
														message:
															e.error_description
													}),
												(e.error.headers = o),
												(e.error.statusCode = i),
												(e.error.requestId = s),
												(t =
													401 === i
														? new n(e.error)
														: 403 === i
															? new a(e.error)
															: 429 === i
																? new p(e.error)
																: c.generate(
																		e.error
																	)),
												t)
											);
										}
										return e;
									},
									e => {
										throw new h({
											message:
												"Invalid JSON received from the Stripe API",
											exception: e,
											requestId: o["request-id"]
										});
									}
								)
								.then(
									e => {
										this._recordRequestMetrics(
											s,
											d.elapsed
										);
										const i = r.getRawResponse();
										this._addHeadersDirectlyToObject(i, o),
											Object.defineProperty(
												e,
												"lastResponse",
												{
													enumerable: !1,
													writable: !1,
													value: i
												}
											),
											t.call(this, null, e);
									},
									e => t.call(this, e, null)
								);
					};
				},
				_generateConnectionErrorMessage: e =>
					"An error occurred with our connection to Stripe." +
					(e > 0 ? ` Request was retried ${e} times.` : ""),
				_errorHandler(e, t, r) {
					return (e, o) => {
						r.call(
							this,
							new i({
								message:
									this._generateConnectionErrorMessage(t),
								detail: error
							}),
							null
						);
					};
				},
				_shouldRetry: (e, t, r) =>
					!(t >= r) &&
					(!e ||
						("false" !== e.getHeaders()["stripe-should-retry"] &&
							("true" === e.getHeaders()["stripe-should-retry"] ||
								409 === e.getStatusCode() ||
								e.getStatusCode() >= 500))),
				_getSleepTimeInMS(e, t = null) {
					const r = this._stripe.getInitialNetworkRetryDelay(),
						o = this._stripe.getMaxNetworkRetryDelay();
					let s = Math.min(r * Math.pow(e - 1, 2), o);
					return (
						(s *= 0.5 * (1 + Math.random())),
						(s = Math.max(r, s)),
						Number.isInteger(t) && t <= 60 && (s = Math.max(s, t)),
						1e3 * s
					);
				},
				_getMaxNetworkRetries(e = {}) {
					return e.maxNetworkRetries &&
						Number.isInteger(e.maxNetworkRetries)
						? e.maxNetworkRetries
						: this._stripe.getMaxNetworkRetries();
				},
				_defaultIdempotencyKey(e, t) {
					const r = this._getMaxNetworkRetries(t);
					return "POST" === e && r > 0
						? "stripe-node-retry-" + s.uuid4()
						: null;
				},
				_makeHeaders(e, t, r, o, i, n, a) {
					const p = {
						Authorization: e
							? "Bearer " + e
							: this._stripe.getApiField("auth"),
						Accept: "application/json",
						"Content-Type": "application/x-www-form-urlencoded",
						"Content-Length": t,
						"User-Agent": this._getUserAgentString(),
						"X-Stripe-Client-User-Agent": o,
						"X-Stripe-Client-Telemetry": this._getTelemetryHeader(),
						"Stripe-Version": r,
						"Stripe-Account":
							this._stripe.getApiField("stripeAccount"),
						"Idempotency-Key": this._defaultIdempotencyKey(i, a)
					};
					return Object.assign(
						s.removeNullish(p),
						s.normalizeHeaders(n)
					);
				},
				_getUserAgentString() {
					return `Stripe/v1 NodeBindings/${this._stripe.getConstant("PACKAGE_VERSION")} ${this._stripe._appInfo ? this._stripe.getAppInfoAsString() : ""}`.trim();
				},
				_getTelemetryHeader() {
					if (
						this._stripe.getTelemetryEnabled() &&
						this._stripe._prevRequestMetrics.length > 0
					) {
						const e = this._stripe._prevRequestMetrics.shift();
						return JSON.stringify({ last_request_metrics: e });
					}
				},
				_recordRequestMetrics(e, t) {
					this._stripe.getTelemetryEnabled() &&
						e &&
						(this._stripe._prevRequestMetrics.length >
						u.MAX_BUFFERED_REQUEST_METRICS
							? s.emitWarning(
									"Request metrics buffer is full, dropping telemetry message."
								)
							: this._stripe._prevRequestMetrics.push({
									request_id: e,
									request_duration_ms: t
								}));
				},
				_request(e, t, r, o, n, a = {}, p) {
					let c;
					const h = (e, t, r, o, s) =>
							setTimeout(
								e,
								this._getSleepTimeInMS(o, s),
								t,
								r,
								o + 1
							),
						u = (o, n, l) => {
							const m =
									a.settings &&
									Number.isInteger(a.settings.timeout) &&
									a.settings.timeout >= 0
										? a.settings.timeout
										: this._stripe.getApiField("timeout"),
								f = this._stripe
									.getApiField("httpClient")
									.makeRequest(
										t || this._stripe.getApiField("host"),
										this._stripe.getApiField("port"),
										r,
										e,
										n,
										c,
										this._stripe.getApiField("protocol"),
										m
									),
								T = Date.now(),
								y = s.removeNullish({
									api_version: o,
									account: n["Stripe-Account"],
									idempotency_key: n["Idempotency-Key"],
									method: e,
									path: r,
									request_start_time: T
								}),
								g = l || 0,
								E = this._getMaxNetworkRetries(a.settings);
							this._stripe._emitter.emit("request", y),
								f
									.then(e =>
										this._shouldRetry(e, g, E)
											? h(
													u,
													o,
													n,
													g,
													e.getHeaders()[
														"retry-after"
													]
												)
											: a.streaming &&
												  e.getStatusCode() < 400
												? this._streamingResponseHandler(
														y,
														p
													)(e)
												: this._jsonResponseHandler(
														y,
														p
													)(e)
									)
									.catch(e => {
										if (this._shouldRetry(null, g, E))
											return h(u, o, n, g, null);
										{
											const t =
												e.code &&
												e.code === d.TIMEOUT_ERROR_CODE;
											return p.call(
												this,
												new i({
													message: t
														? `Request aborted due to timeout being reached (${m}ms)`
														: this._generateConnectionErrorMessage(
																g
															),
													detail: e
												})
											);
										}
									});
						},
						l = (t, r) => {
							if (t) return p(t);
							(c = r),
								this._stripe.getClientUserAgent(t => {
									const r =
											this._stripe.getApiField("version"),
										o = this._makeHeaders(
											n,
											c.length,
											r,
											t,
											e,
											a.headers,
											a.settings
										);
									u(r, o);
								});
						};
					this.requestDataProcessor
						? this.requestDataProcessor(e, o, a.headers, l)
						: l(null, s.stringifyRequestData(o || {}));
				}
			}),
				(e.exports = u);
		},
		function (e, t, r) {
			"use strict";
			const o = r(6).EventEmitter,
				s = r(20),
				i = r(9),
				n = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
			let a = null;
			try {
				a = r(23).exec;
			} catch (e) {
				if ("MODULE_NOT_FOUND" !== e.code) throw e;
			}
			const p = [
					"apiKey",
					"idempotencyKey",
					"stripeAccount",
					"apiVersion",
					"maxNetworkRetries",
					"timeout",
					"host"
				],
				c = {
					api_key: "apiKey",
					idempotency_key: "idempotencyKey",
					stripe_account: "stripeAccount",
					stripe_version: "apiVersion",
					stripeVersion: "apiVersion"
				},
				h = Object.keys(c),
				d = (e.exports = {
					isOptionsHash: e =>
						e &&
						"object" == typeof e &&
						(p.some(t => n(e, t)) || h.some(t => n(e, t))),
					stringifyRequestData: e =>
						s
							.stringify(e, {
								serializeDate: e =>
									Math.floor(e.getTime() / 1e3)
							})
							.replace(/%5B/g, "[")
							.replace(/%5D/g, "]"),
					makeURLInterpolator: (() => {
						const e = {
							"\n": "\\n",
							'"': '\\"',
							"\u2028": "\\u2028",
							"\u2029": "\\u2029"
						};
						return t => {
							const r = t.replace(
								/["\n\r\u2028\u2029]/g,
								t => e[t]
							);
							return e =>
								r.replace(/\{([\s\S]+?)\}/g, (t, r) =>
									encodeURIComponent(e[r] || "")
								);
						};
					})(),
					extractUrlParams: e => {
						const t = e.match(/\{\w+\}/g);
						return t ? t.map(e => e.replace(/[{}]/g, "")) : [];
					},
					getDataFromArgs(e) {
						if (
							!Array.isArray(e) ||
							!e[0] ||
							"object" != typeof e[0]
						)
							return {};
						if (!d.isOptionsHash(e[0])) return e.shift();
						const t = Object.keys(e[0]),
							r = t.filter(e => p.includes(e));
						return (
							r.length > 0 &&
								r.length !== t.length &&
								u(
									`Options found in arguments (${r.join(", ")}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options.`
								),
							{}
						);
					},
					getOptionsFromArgs: e => {
						const t = { auth: null, headers: {}, settings: {} };
						if (e.length > 0) {
							const r = e[e.length - 1];
							if ("string" == typeof r) t.auth = e.pop();
							else if (d.isOptionsHash(r)) {
								const r = { ...e.pop() },
									o = Object.keys(r).filter(
										e => !p.includes(e)
									);
								if (o.length) {
									o.filter(e => {
										if (!c[e]) return !0;
										const t = c[e];
										if (r[t])
											throw Error(
												`Both '${t}' and '${e}' were provided; please remove '${e}', which is deprecated.`
											);
										u(
											`'${e}' is deprecated; use '${t}' instead.`
										),
											(r[t] = r[e]);
									}).length &&
										u(
											`Invalid options found (${o.join(", ")}); ignoring.`
										);
								}
								r.apiKey && (t.auth = r.apiKey),
									r.idempotencyKey &&
										(t.headers["Idempotency-Key"] =
											r.idempotencyKey),
									r.stripeAccount &&
										(t.headers["Stripe-Account"] =
											r.stripeAccount),
									r.apiVersion &&
										(t.headers["Stripe-Version"] =
											r.apiVersion),
									Number.isInteger(r.maxNetworkRetries) &&
										(t.settings.maxNetworkRetries =
											r.maxNetworkRetries),
									Number.isInteger(r.timeout) &&
										(t.settings.timeout = r.timeout),
									r.host && (t.host = r.host);
							}
						}
						return t;
					},
					protoExtend(e) {
						const t = this,
							r = n(e, "constructor")
								? e.constructor
								: function (...e) {
										t.apply(this, e);
									};
						return (
							Object.assign(r, t),
							(r.prototype = Object.create(t.prototype)),
							Object.assign(r.prototype, e),
							r
						);
					},
					secureCompare: (e, t) => {
						if (
							((e = Buffer.from(e)),
							(t = Buffer.from(t)),
							e.length !== t.length)
						)
							return !1;
						if (i.timingSafeEqual) return i.timingSafeEqual(e, t);
						const r = e.length;
						let o = 0;
						for (let s = 0; s < r; ++s) o |= e[s] ^ t[s];
						return 0 === o;
					},
					removeNullish: e => {
						if ("object" != typeof e)
							throw new Error("Argument must be an object");
						return Object.keys(e).reduce(
							(t, r) => (null != e[r] && (t[r] = e[r]), t),
							{}
						);
					},
					normalizeHeaders: e =>
						e && "object" == typeof e
							? Object.keys(e).reduce(
									(t, r) => (
										(t[d.normalizeHeader(r)] = e[r]), t
									),
									{}
								)
							: e,
					normalizeHeader: e =>
						e
							.split("-")
							.map(
								e =>
									e.charAt(0).toUpperCase() +
									e.substr(1).toLowerCase()
							)
							.join("-"),
					checkForStream: e =>
						!(!e.file || !e.file.data) && e.file.data instanceof o,
					callbackifyPromiseWithTimeout: (e, t) =>
						t
							? e.then(
									e => {
										setTimeout(() => {
											t(null, e);
										}, 0);
									},
									e => {
										setTimeout(() => {
											t(e, null);
										}, 0);
									}
								)
							: e,
					pascalToCamelCase: e =>
						"OAuth" === e
							? "oauth"
							: e[0].toLowerCase() + e.substring(1),
					emitWarning: u,
					safeExec: (e, t) => {
						if (null !== d._exec)
							try {
								d._exec(e, t);
							} catch (e) {
								t(e, null);
							}
						else t(new Error("exec not available"), null);
					},
					_exec: a,
					isObject: e => {
						const t = typeof e;
						return ("function" === t || "object" === t) && !!e;
					},
					flattenAndStringify: e => {
						const t = {},
							r = (e, o) => {
								Object.keys(e).forEach(s => {
									const i = e[s],
										n = o ? `${o}[${s}]` : s;
									if (d.isObject(i)) {
										if (
											!Buffer.isBuffer(i) &&
											!i.hasOwnProperty("data")
										)
											return r(i, n);
										t[n] = i;
									} else t[n] = String(i);
								});
							};
						return r(e), t;
					},
					uuid4: () =>
						"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
							/[xy]/g,
							e => {
								const t = (16 * Math.random()) | 0;
								return ("x" === e ? t : (3 & t) | 8).toString(
									16
								);
							}
						),
					validateInteger: (e, t, r) => {
						if (!Number.isInteger(t)) {
							if (void 0 !== r) return r;
							throw new Error(e + " must be an integer");
						}
						return t;
					},
					determineProcessUserAgentProperties: () =>
						"undefined" == typeof process
							? {}
							: {
									lang_version: process.version,
									platform: process.platform
								}
				});
			function u(e) {
				return "function" != typeof process.emitWarning
					? console.warn("Stripe: " + e)
					: process.emitWarning(e, "Stripe");
			}
		},
		,
		function (e, t, r) {
			"use strict";
			class o extends Error {
				constructor(e = {}) {
					super(e.message),
						(this.type = this.constructor.name),
						(this.raw = e),
						(this.rawType = e.type),
						(this.code = e.code),
						(this.doc_url = e.doc_url),
						(this.param = e.param),
						(this.detail = e.detail),
						(this.headers = e.headers),
						(this.requestId = e.requestId),
						(this.statusCode = e.statusCode),
						(this.message = e.message),
						(this.charge = e.charge),
						(this.decline_code = e.decline_code),
						(this.payment_intent = e.payment_intent),
						(this.payment_method = e.payment_method),
						(this.payment_method_type = e.payment_method_type),
						(this.setup_intent = e.setup_intent),
						(this.source = e.source);
				}
				static generate(e) {
					switch (e.type) {
						case "card_error":
							return new s(e);
						case "invalid_request_error":
							return new i(e);
						case "api_error":
							return new n(e);
						case "authentication_error":
							return new a(e);
						case "rate_limit_error":
							return new p(e);
						case "idempotency_error":
							return new c(e);
						case "invalid_grant":
							return new h(e);
						default:
							return new GenericError("Generic", "Unknown Error");
					}
				}
			}
			class s extends o {}
			class i extends o {}
			class n extends o {}
			class a extends o {}
			class p extends o {}
			class c extends o {}
			class h extends o {}
			(e.exports.generate = o.generate),
				(e.exports.StripeError = o),
				(e.exports.StripeCardError = s),
				(e.exports.StripeInvalidRequestError = i),
				(e.exports.StripeAPIError = n),
				(e.exports.StripeAuthenticationError = a),
				(e.exports.StripePermissionError = class extends o {}),
				(e.exports.StripeRateLimitError = p),
				(e.exports.StripeConnectionError = class extends o {}),
				(e.exports.StripeSignatureVerificationError = class extends (
					o
				) {}),
				(e.exports.StripeIdempotencyError = c),
				(e.exports.StripeInvalidGrantError = h);
		},
		function (e, t, r) {
			"use strict";
			class o {
				getClientName() {
					throw new Error("getClientName not implemented.");
				}
				makeRequest(e, t, r, o, s, i, n, a) {
					throw new Error("makeRequest not implemented.");
				}
				static makeTimeoutError() {
					const e = new TypeError(o.TIMEOUT_ERROR_CODE);
					return (e.code = o.TIMEOUT_ERROR_CODE), e;
				}
			}
			o.TIMEOUT_ERROR_CODE = "ETIMEDOUT";
			e.exports = {
				HttpClient: o,
				HttpClientResponse: class {
					constructor(e, t) {
						(this._statusCode = e), (this._headers = t);
					}
					getStatusCode() {
						return this._statusCode;
					}
					getHeaders() {
						return this._headers;
					}
					getRawResponse() {
						throw new Error("getRawResponse not implemented.");
					}
					toStream(e) {
						throw new Error("toStream not implemented.");
					}
					toJSON() {
						throw new Error("toJSON not implemented.");
					}
				}
			};
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "",
				create: s({ method: "POST", path: "accounts" }),
				retrieve(e) {
					return "string" == typeof e
						? s({ method: "GET", path: "accounts/{id}" }).apply(
								this,
								arguments
							)
						: (null == e && [].shift.apply(arguments),
							s({ method: "GET", path: "account" }).apply(
								this,
								arguments
							));
				},
				update: s({ method: "POST", path: "accounts/{account}" }),
				list: s({
					method: "GET",
					path: "accounts",
					methodType: "list"
				}),
				del: s({ method: "DELETE", path: "accounts/{account}" }),
				reject: s({
					method: "POST",
					path: "accounts/{account}/reject"
				}),
				retrieveCapability: s({
					method: "GET",
					path: "accounts/{account}/capabilities/{capability}"
				}),
				updateCapability: s({
					method: "POST",
					path: "accounts/{account}/capabilities/{capability}"
				}),
				listCapabilities: s({
					method: "GET",
					path: "accounts/{account}/capabilities",
					methodType: "list"
				}),
				createExternalAccount: s({
					method: "POST",
					path: "accounts/{account}/external_accounts"
				}),
				retrieveExternalAccount: s({
					method: "GET",
					path: "accounts/{account}/external_accounts/{id}"
				}),
				updateExternalAccount: s({
					method: "POST",
					path: "accounts/{account}/external_accounts/{id}"
				}),
				listExternalAccounts: s({
					method: "GET",
					path: "accounts/{account}/external_accounts",
					methodType: "list"
				}),
				deleteExternalAccount: s({
					method: "DELETE",
					path: "accounts/{account}/external_accounts/{id}"
				}),
				createLoginLink: s({
					method: "POST",
					path: "accounts/{account}/login_links"
				}),
				createPerson: s({
					method: "POST",
					path: "accounts/{account}/persons"
				}),
				retrievePerson: s({
					method: "GET",
					path: "accounts/{account}/persons/{person}"
				}),
				updatePerson: s({
					method: "POST",
					path: "accounts/{account}/persons/{person}"
				}),
				listPersons: s({
					method: "GET",
					path: "accounts/{account}/persons",
					methodType: "list"
				}),
				deletePerson: s({
					method: "DELETE",
					path: "accounts/{account}/persons/{person}"
				})
			});
		},
		function (e, t) {
			e.exports = require("events");
		},
		function (e, t, r) {
			"use strict";
			var o = Object.prototype.hasOwnProperty,
				s = Array.isArray,
				i = (function () {
					for (var e = [], t = 0; t < 256; ++t)
						e.push(
							"%" +
								(
									(t < 16 ? "0" : "") + t.toString(16)
								).toUpperCase()
						);
					return e;
				})(),
				n = function (e, t) {
					for (
						var r = t && t.plainObjects ? Object.create(null) : {},
							o = 0;
						o < e.length;
						++o
					)
						void 0 !== e[o] && (r[o] = e[o]);
					return r;
				};
			e.exports = {
				arrayToObject: n,
				assign: function (e, t) {
					return Object.keys(t).reduce(function (e, r) {
						return (e[r] = t[r]), e;
					}, e);
				},
				combine: function (e, t) {
					return [].concat(e, t);
				},
				compact: function (e) {
					for (
						var t = [{ obj: { o: e }, prop: "o" }], r = [], o = 0;
						o < t.length;
						++o
					)
						for (
							var i = t[o],
								n = i.obj[i.prop],
								a = Object.keys(n),
								p = 0;
							p < a.length;
							++p
						) {
							var c = a[p],
								h = n[c];
							"object" == typeof h &&
								null !== h &&
								-1 === r.indexOf(h) &&
								(t.push({ obj: n, prop: c }), r.push(h));
						}
					return (
						(function (e) {
							for (; e.length > 1; ) {
								var t = e.pop(),
									r = t.obj[t.prop];
								if (s(r)) {
									for (var o = [], i = 0; i < r.length; ++i)
										void 0 !== r[i] && o.push(r[i]);
									t.obj[t.prop] = o;
								}
							}
						})(t),
						e
					);
				},
				decode: function (e, t, r) {
					var o = e.replace(/\+/g, " ");
					if ("iso-8859-1" === r)
						return o.replace(/%[0-9a-f]{2}/gi, unescape);
					try {
						return decodeURIComponent(o);
					} catch (e) {
						return o;
					}
				},
				encode: function (e, t, r) {
					if (0 === e.length) return e;
					var o = "string" == typeof e ? e : String(e);
					if ("iso-8859-1" === r)
						return escape(o).replace(
							/%u[0-9a-f]{4}/gi,
							function (e) {
								return (
									"%26%23" + parseInt(e.slice(2), 16) + "%3B"
								);
							}
						);
					for (var s = "", n = 0; n < o.length; ++n) {
						var a = o.charCodeAt(n);
						45 === a ||
						46 === a ||
						95 === a ||
						126 === a ||
						(a >= 48 && a <= 57) ||
						(a >= 65 && a <= 90) ||
						(a >= 97 && a <= 122)
							? (s += o.charAt(n))
							: a < 128
								? (s += i[a])
								: a < 2048
									? (s +=
											i[192 | (a >> 6)] +
											i[128 | (63 & a)])
									: a < 55296 || a >= 57344
										? (s +=
												i[224 | (a >> 12)] +
												i[128 | ((a >> 6) & 63)] +
												i[128 | (63 & a)])
										: ((n += 1),
											(a =
												65536 +
												(((1023 & a) << 10) |
													(1023 & o.charCodeAt(n)))),
											(s +=
												i[240 | (a >> 18)] +
												i[128 | ((a >> 12) & 63)] +
												i[128 | ((a >> 6) & 63)] +
												i[128 | (63 & a)]));
					}
					return s;
				},
				isBuffer: function (e) {
					return (
						!(!e || "object" != typeof e) &&
						!!(
							e.constructor &&
							e.constructor.isBuffer &&
							e.constructor.isBuffer(e)
						)
					);
				},
				isRegExp: function (e) {
					return (
						"[object RegExp]" === Object.prototype.toString.call(e)
					);
				},
				merge: function e(t, r, i) {
					if (!r) return t;
					if ("object" != typeof r) {
						if (s(t)) t.push(r);
						else {
							if (!t || "object" != typeof t) return [t, r];
							((i && (i.plainObjects || i.allowPrototypes)) ||
								!o.call(Object.prototype, r)) &&
								(t[r] = !0);
						}
						return t;
					}
					if (!t || "object" != typeof t) return [t].concat(r);
					var a = t;
					return (
						s(t) && !s(r) && (a = n(t, i)),
						s(t) && s(r)
							? (r.forEach(function (r, s) {
									if (o.call(t, s)) {
										var n = t[s];
										n &&
										"object" == typeof n &&
										r &&
										"object" == typeof r
											? (t[s] = e(n, r, i))
											: t.push(r);
									} else t[s] = r;
								}),
								t)
							: Object.keys(r).reduce(function (t, s) {
									var n = r[s];
									return (
										o.call(t, s)
											? (t[s] = e(t[s], n, i))
											: (t[s] = n),
										t
									);
								}, a)
					);
				}
			};
		},
		function (e, t, r) {
			"use strict";
			var o = String.prototype.replace,
				s = /%20/g;
			e.exports = {
				default: "RFC3986",
				formatters: {
					RFC1738: function (e) {
						return o.call(e, s, "+");
					},
					RFC3986: function (e) {
						return e;
					}
				},
				RFC1738: "RFC1738",
				RFC3986: "RFC3986"
			};
		},
		function (e, t) {
			e.exports = require("crypto");
		},
		function (e, t, r) {
			"use strict";
			const o = r(1),
				s = r(11),
				i = r(24).makeAutoPaginationMethods;
			e.exports = function (e) {
				if (void 0 !== e.path && void 0 !== e.fullPath)
					throw new Error(
						`Method spec specified both a 'path' (${e.path}) and a 'fullPath' (${e.fullPath}).`
					);
				return function (...t) {
					const r = "function" == typeof t[t.length - 1] && t.pop();
					e.urlParams = o.extractUrlParams(
						e.fullPath ||
							this.createResourcePathWithSymbols(e.path || "")
					);
					const n = o.callbackifyPromiseWithTimeout(
						s(this, t, e, {}),
						r
					);
					if ("list" === e.methodType || "search" === e.methodType) {
						const r = i(this, t, e, n);
						Object.assign(n, r);
					}
					return n;
				};
			};
		},
		function (e, t, r) {
			"use strict";
			const o = r(1);
			e.exports = function (e, t, r, s) {
				return new Promise((i, n) => {
					let a;
					try {
						a = (function (e, t, r, s) {
							const i = (r.method || "GET").toUpperCase(),
								n = r.urlParams || [],
								a = r.encode || (e => e),
								p = !!r.fullPath,
								c = o.makeURLInterpolator(
									p ? r.fullPath : r.path || ""
								),
								h = p
									? r.fullPath
									: e.createResourcePathWithSymbols(r.path),
								d = [].slice.call(t),
								u = n.reduce((e, t) => {
									const r = d.shift();
									if ("string" != typeof r)
										throw new Error(
											`Stripe: Argument "${t}" must be a string, but got: ${r} (on API request to \`${i} ${h}\`)`
										);
									return (e[t] = r), e;
								}, {}),
								l = o.getDataFromArgs(d),
								m = a(Object.assign({}, l, s)),
								f = o.getOptionsFromArgs(d),
								T = f.host || r.host,
								y = !!r.streaming;
							if (d.filter(e => null != e).length)
								throw new Error(
									`Stripe: Unknown arguments (${d}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options. (on API request to ${i} \`${h}\`)`
								);
							const g = p ? c(u) : e.createFullPath(c, u),
								E = Object.assign(f.headers, r.headers);
							r.validator && r.validator(m, { headers: E });
							const _ =
								"GET" === r.method || "DELETE" === r.method;
							return {
								requestMethod: i,
								requestPath: g,
								bodyData: _ ? {} : m,
								queryData: _ ? m : {},
								auth: f.auth,
								headers: E,
								host: T,
								streaming: y,
								settings: f.settings
							};
						})(e, t, r, s);
					} catch (e) {
						return void n(e);
					}
					const p = 0 === Object.keys(a.queryData).length,
						c = [
							a.requestPath,
							p ? "" : "?",
							o.stringifyRequestData(a.queryData)
						].join(""),
						{ headers: h, settings: d } = a;
					e._request(
						a.requestMethod,
						a.host,
						c,
						a.bodyData,
						a.auth,
						{ headers: h, settings: d, streaming: a.streaming },
						function (e, t) {
							e
								? n(e)
								: i(
										r.transformResponseData
											? r.transformResponseData(t)
											: t
									);
						}
					);
				});
			};
		},
		function (e, t, r) {
			"use strict";
			e.exports = class {
				computeHMACSignature(e, t) {
					throw new Error("computeHMACSignature not implemented.");
				}
			};
		},
		function (e, t, r) {
			"use strict";
			const o = r(1),
				{ StripeError: s, StripeSignatureVerificationError: i } = r(3),
				n = {
					DEFAULT_TOLERANCE: 300,
					constructEvent(e, t, r, o, s) {
						this.signature.verifyHeader(
							e,
							t,
							r,
							o || n.DEFAULT_TOLERANCE,
							s
						);
						return JSON.parse(e);
					},
					generateTestHeaderString: function (e) {
						if (!e)
							throw new s({ message: "Options are required" });
						(e.timestamp =
							Math.floor(e.timestamp) ||
							Math.floor(Date.now() / 1e3)),
							(e.scheme = e.scheme || a.EXPECTED_SCHEME),
							(e.cryptoProvider = e.cryptoProvider || c()),
							(e.signature =
								e.signature ||
								e.cryptoProvider.computeHMACSignature(
									e.timestamp + "." + e.payload,
									e.secret
								));
						return [
							"t=" + e.timestamp,
							e.scheme + "=" + e.signature
						].join(",");
					}
				},
				a = {
					EXPECTED_SCHEME: "v1",
					verifyHeader(e, t, r, s, n) {
						if (
							((e = Buffer.isBuffer(e) ? e.toString("utf8") : e),
							Array.isArray(t))
						)
							throw new Error(
								"Unexpected: An array was passed as a header, which should not be possible for the stripe-signature header."
							);
						const a = (function (e, t) {
							if ("string" != typeof e) return null;
							return e.split(",").reduce(
								(e, r) => {
									const o = r.split("=");
									return (
										"t" === o[0] && (e.timestamp = o[1]),
										o[0] === t && e.signatures.push(o[1]),
										e
									);
								},
								{ timestamp: -1, signatures: [] }
							);
						})(
							(t = Buffer.isBuffer(t) ? t.toString("utf8") : t),
							this.EXPECTED_SCHEME
						);
						if (!a || -1 === a.timestamp)
							throw new i({
								message:
									"Unable to extract timestamp and signatures from header",
								detail: { header: t, payload: e }
							});
						if (!a.signatures.length)
							throw new i({
								message:
									"No signatures found with expected scheme",
								detail: { header: t, payload: e }
							});
						const p = (n = n || c()).computeHMACSignature(
							`${a.timestamp}.${e}`,
							r
						);
						if (
							!!!a.signatures.filter(o.secureCompare.bind(o, p))
								.length
						)
							throw new i({
								message:
									"No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? https://github.com/stripe/stripe-node#webhook-signing",
								detail: { header: t, payload: e }
							});
						const h = Math.floor(Date.now() / 1e3) - a.timestamp;
						if (s > 0 && h > s)
							throw new i({
								message: "Timestamp outside the tolerance zone",
								detail: { header: t, payload: e }
							});
						return !0;
					}
				};
			let p = null;
			function c() {
				if (!p) {
					const e = r(93);
					p = new e();
				}
				return p;
			}
			(n.signature = a), (e.exports = n);
		},
		function (e, t) {
			e.exports = require("http");
		},
		function (e, t) {
			e.exports = require("https");
		},
		function (e, t) {
			e.exports = require("path");
		},
		function (e, t, r) {
			"use strict";
			const o = r(18);
			l.PACKAGE_VERSION = r(92).version;
			const s = r(1),
				{ determineProcessUserAgentProperties: i, emitWarning: n } = s;
			(l.USER_AGENT = {
				bindings_version: l.PACKAGE_VERSION,
				lang: "node",
				publisher: "stripe",
				uname: null,
				typescript: !1,
				...i()
			}),
				(l._UNAME_CACHE = null);
			const a = ["name", "version", "url", "partner_id"],
				p = [
					"apiVersion",
					"typescript",
					"maxNetworkRetries",
					"httpAgent",
					"httpClient",
					"timeout",
					"host",
					"port",
					"protocol",
					"telemetry",
					"appInfo",
					"stripeAccount"
				],
				c = r(6).EventEmitter;
			(l.StripeResource = r(0)), (l.resources = o);
			const { HttpClient: h, HttpClientResponse: d } = r(4);
			(l.HttpClient = h), (l.HttpClientResponse = d);
			const u = r(12);
			function l(e, t = {}) {
				if (!(this instanceof l)) return new l(e, t);
				const o = this._getPropsFromConfig(t);
				if (
					(Object.defineProperty(this, "_emitter", {
						value: new c(),
						enumerable: !1,
						configurable: !1,
						writable: !1
					}),
					(this.VERSION = l.PACKAGE_VERSION),
					(this.on = this._emitter.on.bind(this._emitter)),
					(this.once = this._emitter.once.bind(this._emitter)),
					(this.off = this._emitter.removeListener.bind(
						this._emitter
					)),
					o.protocol &&
						"https" !== o.protocol &&
						(!o.host || /\.stripe\.com$/.test(o.host)))
				)
					throw new Error(
						"The `https` protocol must be used when sending requests to `*.stripe.com`"
					);
				const i = o.httpAgent || null;
				this._api = {
					auth: null,
					host: o.host || "api.stripe.com",
					port: o.port || "443",
					protocol: o.protocol || "https",
					basePath: "/v1/",
					version: o.apiVersion || null,
					timeout: s.validateInteger("timeout", o.timeout, 8e4),
					maxNetworkRetries: s.validateInteger(
						"maxNetworkRetries",
						o.maxNetworkRetries,
						0
					),
					agent: i,
					httpClient: o.httpClient || l.createNodeHttpClient(i),
					dev: !1,
					stripeAccount: o.stripeAccount || null
				};
				const n = o.typescript || !1;
				n !== l.USER_AGENT.typescript && (l.USER_AGENT.typescript = n),
					o.appInfo && this._setAppInfo(o.appInfo),
					this._prepResources(),
					this._setApiKey(e),
					(this.errors = r(3)),
					(this.webhooks = r(13)),
					(this._prevRequestMetrics = []),
					(this._enableTelemetry = !1 !== o.telemetry),
					(this.StripeResource = l.StripeResource);
			}
			(l.CryptoProvider = u),
				(l.errors = r(3)),
				(l.webhooks = r(13)),
				(l.createNodeHttpClient = e => {
					const { NodeHttpClient: t } = r(94);
					return new t(e);
				}),
				(l.prototype = {
					setHost(e, t, r) {
						n(
							"`setHost` is deprecated. Use the `host` config option instead."
						),
							this._setApiField("host", e),
							t && this.setPort(t),
							r && this.setProtocol(r);
					},
					setProtocol(e) {
						n(
							"`setProtocol` is deprecated. Use the `protocol` config option instead."
						),
							this._setApiField("protocol", e.toLowerCase());
					},
					setPort(e) {
						n(
							"`setPort` is deprecated. Use the `port` config option instead."
						),
							this._setApiField("port", e);
					},
					setApiVersion(e) {
						n(
							"`setApiVersion` is deprecated. Use the `apiVersion` config or request option instead."
						),
							e && this._setApiField("version", e);
					},
					setApiKey(e) {
						n(
							"`setApiKey` is deprecated. Use the `apiKey` request option instead."
						),
							this._setApiKey(e);
					},
					_setApiKey(e) {
						e && this._setApiField("auth", "Bearer " + e);
					},
					setTimeout(e) {
						n(
							"`setTimeout` is deprecated. Use the `timeout` config or request option instead."
						),
							this._setApiField("timeout", null == e ? 8e4 : e);
					},
					setAppInfo(e) {
						n(
							"`setAppInfo` is deprecated. Use the `appInfo` config option instead."
						),
							this._setAppInfo(e);
					},
					_setAppInfo(e) {
						if (e && "object" != typeof e)
							throw new Error("AppInfo must be an object.");
						if (e && !e.name)
							throw new Error("AppInfo.name is required");
						e = e || {};
						const t = a.reduce(
							(t, r) => (
								"string" == typeof e[r] &&
									((t = t || {})[r] = e[r]),
								t
							),
							void 0
						);
						this._appInfo = t;
					},
					setHttpAgent(e) {
						n(
							"`setHttpAgent` is deprecated. Use the `httpAgent` config option instead."
						),
							this._setApiField("agent", e);
					},
					_setApiField(e, t) {
						this._api[e] = t;
					},
					getApiField(e) {
						return this._api[e];
					},
					setClientId(e) {
						this._clientId = e;
					},
					getClientId() {
						return this._clientId;
					},
					getConstant: e => {
						switch (e) {
							case "DEFAULT_HOST":
								return "api.stripe.com";
							case "DEFAULT_PORT":
								return "443";
							case "DEFAULT_BASE_PATH":
								return "/v1/";
							case "DEFAULT_API_VERSION":
								return null;
							case "DEFAULT_TIMEOUT":
								return 8e4;
							case "MAX_NETWORK_RETRY_DELAY_SEC":
								return 2;
							case "INITIAL_NETWORK_RETRY_DELAY_SEC":
								return 0.5;
						}
						return l[e];
					},
					getMaxNetworkRetries() {
						return this.getApiField("maxNetworkRetries");
					},
					setMaxNetworkRetries(e) {
						this._setApiNumberField("maxNetworkRetries", e);
					},
					_setApiNumberField(e, t, r) {
						const o = s.validateInteger(e, t, r);
						this._setApiField(e, o);
					},
					getMaxNetworkRetryDelay: () => 2,
					getInitialNetworkRetryDelay: () => 0.5,
					getUname(e) {
						l._UNAME_CACHE ||
							(l._UNAME_CACHE = new Promise(e => {
								s.safeExec("uname -a", (t, r) => {
									e(r);
								});
							})),
							l._UNAME_CACHE.then(t => e(t));
					},
					getClientUserAgent(e) {
						return this.getClientUserAgentSeeded(l.USER_AGENT, e);
					},
					getClientUserAgentSeeded(e, t) {
						this.getUname(r => {
							const o = {};
							for (const t in e) o[t] = encodeURIComponent(e[t]);
							o.uname = encodeURIComponent(r || "UNKNOWN");
							const s = this.getApiField("httpClient");
							s &&
								(o.httplib = encodeURIComponent(
									s.getClientName()
								)),
								this._appInfo &&
									(o.application = this._appInfo),
								t(JSON.stringify(o));
						});
					},
					getAppInfoAsString() {
						if (!this._appInfo) return "";
						let e = this._appInfo.name;
						return (
							this._appInfo.version &&
								(e += "/" + this._appInfo.version),
							this._appInfo.url &&
								(e += ` (${this._appInfo.url})`),
							e
						);
					},
					setTelemetryEnabled(e) {
						n(
							"`setTelemetryEnabled` is deprecated. Use the `telemetry` config option instead."
						),
							(this._enableTelemetry = e);
					},
					getTelemetryEnabled() {
						return this._enableTelemetry;
					},
					_prepResources() {
						for (const e in o)
							this[s.pascalToCamelCase(e)] = new o[e](this);
					},
					_getPropsFromConfig(e) {
						if (!e) return {};
						const t = "string" == typeof e;
						if (!(e === Object(e) && !Array.isArray(e)) && !t)
							throw new Error(
								"Config must either be an object or a string"
							);
						if (t) return { apiVersion: e };
						if (
							Object.keys(e).filter(e => !p.includes(e)).length >
							0
						)
							throw new Error(
								"Config object may only contain the following: " +
									p.join(", ")
							);
						return e;
					}
				}),
				(e.exports = l),
				(e.exports.Stripe = l),
				(e.exports.default = l);
		},
		function (e, t, r) {
			"use strict";
			const o = r(19);
			e.exports = {
				Accounts: r(5),
				Account: r(5),
				AccountLinks: r(26),
				ApplePayDomains: r(27),
				ApplicationFees: r(28),
				Balance: r(29),
				BalanceTransactions: r(30),
				Charges: r(31),
				CountrySpecs: r(32),
				Coupons: r(33),
				CreditNotes: r(34),
				Customers: r(35),
				Disputes: r(36),
				EphemeralKeys: r(37),
				Events: r(38),
				ExchangeRates: r(39),
				Files: r(40),
				FileLinks: r(42),
				Invoices: r(43),
				InvoiceItems: r(44),
				IssuerFraudRecords: r(45),
				Mandates: r(46),
				OAuth: r(47),
				Orders: r(48),
				OrderReturns: r(49),
				PaymentIntents: r(50),
				PaymentMethods: r(51),
				Payouts: r(52),
				Plans: r(53),
				Prices: r(54),
				Products: r(55),
				PromotionCodes: r(56),
				Quotes: r(57),
				Refunds: r(58),
				Reviews: r(59),
				SetupAttempts: r(60),
				SetupIntents: r(61),
				Skus: r(62),
				Sources: r(63),
				Subscriptions: r(64),
				SubscriptionItems: r(65),
				SubscriptionSchedules: r(66),
				TaxCodes: r(67),
				TaxRates: r(68),
				Tokens: r(69),
				Topups: r(70),
				Transfers: r(71),
				WebhookEndpoints: r(72),
				BillingPortal: o("billingPortal", {
					Configurations: r(73),
					Sessions: r(74)
				}),
				Checkout: o("checkout", { Sessions: r(75) }),
				Identity: o("identity", {
					VerificationReports: r(76),
					VerificationSessions: r(77)
				}),
				Issuing: o("issuing", {
					Authorizations: r(78),
					Cards: r(79),
					Cardholders: r(80),
					Disputes: r(81),
					Transactions: r(82)
				}),
				Radar: o("radar", {
					EarlyFraudWarnings: r(83),
					ValueLists: r(84),
					ValueListItems: r(85)
				}),
				Reporting: o("reporting", {
					ReportRuns: r(86),
					ReportTypes: r(87)
				}),
				Sigma: o("sigma", { ScheduledQueryRuns: r(88) }),
				Terminal: o("terminal", {
					ConnectionTokens: r(89),
					Locations: r(90),
					Readers: r(91)
				})
			};
		},
		function (e, t, r) {
			"use strict";
			function o(e, t) {
				for (const r in t) {
					const o = r[0].toLowerCase() + r.substring(1),
						s = new t[r](e);
					this[o] = s;
				}
			}
			(e.exports = function (e, t) {
				return function (e) {
					return new o(e, t);
				};
			}),
				(e.exports.ResourceNamespace = o);
		},
		function (e, t, r) {
			"use strict";
			var o = r(21),
				s = r(22),
				i = r(8);
			e.exports = { formats: i, parse: s, stringify: o };
		},
		function (e, t, r) {
			"use strict";
			var o = r(7),
				s = r(8),
				i = Object.prototype.hasOwnProperty,
				n = {
					brackets: function (e) {
						return e + "[]";
					},
					comma: "comma",
					indices: function (e, t) {
						return e + "[" + t + "]";
					},
					repeat: function (e) {
						return e;
					}
				},
				a = Array.isArray,
				p = Array.prototype.push,
				c = function (e, t) {
					p.apply(e, a(t) ? t : [t]);
				},
				h = Date.prototype.toISOString,
				d = {
					addQueryPrefix: !1,
					allowDots: !1,
					charset: "utf-8",
					charsetSentinel: !1,
					delimiter: "&",
					encode: !0,
					encoder: o.encode,
					encodeValuesOnly: !1,
					formatter: s.formatters[s.default],
					indices: !1,
					serializeDate: function (e) {
						return h.call(e);
					},
					skipNulls: !1,
					strictNullHandling: !1
				},
				u = function e(t, r, s, i, n, p, h, u, l, m, f, T, y) {
					var g = t;
					if (
						("function" == typeof h
							? (g = h(r, g))
							: g instanceof Date
								? (g = m(g))
								: "comma" === s && a(g) && (g = g.join(",")),
						null === g)
					) {
						if (i) return p && !T ? p(r, d.encoder, y) : r;
						g = "";
					}
					if (
						"string" == typeof g ||
						"number" == typeof g ||
						"boolean" == typeof g ||
						o.isBuffer(g)
					)
						return p
							? [
									f(T ? r : p(r, d.encoder, y)) +
										"=" +
										f(p(g, d.encoder, y))
								]
							: [f(r) + "=" + f(String(g))];
					var E,
						_ = [];
					if (void 0 === g) return _;
					if (a(h)) E = h;
					else {
						var x = Object.keys(g);
						E = u ? x.sort(u) : x;
					}
					for (var S = 0; S < E.length; ++S) {
						var v = E[S];
						(n && null === g[v]) ||
							(a(g)
								? c(
										_,
										e(
											g[v],
											"function" == typeof s
												? s(r, v)
												: r,
											s,
											i,
											n,
											p,
											h,
											u,
											l,
											m,
											f,
											T,
											y
										)
									)
								: c(
										_,
										e(
											g[v],
											r + (l ? "." + v : "[" + v + "]"),
											s,
											i,
											n,
											p,
											h,
											u,
											l,
											m,
											f,
											T,
											y
										)
									));
					}
					return _;
				};
			e.exports = function (e, t) {
				var r,
					o = e,
					p = (function (e) {
						if (!e) return d;
						if (
							null !== e.encoder &&
							void 0 !== e.encoder &&
							"function" != typeof e.encoder
						)
							throw new TypeError(
								"Encoder has to be a function."
							);
						var t = e.charset || d.charset;
						if (
							void 0 !== e.charset &&
							"utf-8" !== e.charset &&
							"iso-8859-1" !== e.charset
						)
							throw new TypeError(
								"The charset option must be either utf-8, iso-8859-1, or undefined"
							);
						var r = s.default;
						if (void 0 !== e.format) {
							if (!i.call(s.formatters, e.format))
								throw new TypeError(
									"Unknown format option provided."
								);
							r = e.format;
						}
						var o = s.formatters[r],
							n = d.filter;
						return (
							("function" == typeof e.filter || a(e.filter)) &&
								(n = e.filter),
							{
								addQueryPrefix:
									"boolean" == typeof e.addQueryPrefix
										? e.addQueryPrefix
										: d.addQueryPrefix,
								allowDots:
									void 0 === e.allowDots
										? d.allowDots
										: !!e.allowDots,
								charset: t,
								charsetSentinel:
									"boolean" == typeof e.charsetSentinel
										? e.charsetSentinel
										: d.charsetSentinel,
								delimiter:
									void 0 === e.delimiter
										? d.delimiter
										: e.delimiter,
								encode:
									"boolean" == typeof e.encode
										? e.encode
										: d.encode,
								encoder:
									"function" == typeof e.encoder
										? e.encoder
										: d.encoder,
								encodeValuesOnly:
									"boolean" == typeof e.encodeValuesOnly
										? e.encodeValuesOnly
										: d.encodeValuesOnly,
								filter: n,
								formatter: o,
								serializeDate:
									"function" == typeof e.serializeDate
										? e.serializeDate
										: d.serializeDate,
								skipNulls:
									"boolean" == typeof e.skipNulls
										? e.skipNulls
										: d.skipNulls,
								sort:
									"function" == typeof e.sort ? e.sort : null,
								strictNullHandling:
									"boolean" == typeof e.strictNullHandling
										? e.strictNullHandling
										: d.strictNullHandling
							}
						);
					})(t);
				"function" == typeof p.filter
					? (o = (0, p.filter)("", o))
					: a(p.filter) && (r = p.filter);
				var h,
					l = [];
				if ("object" != typeof o || null === o) return "";
				h =
					t && t.arrayFormat in n
						? t.arrayFormat
						: t && "indices" in t
							? t.indices
								? "indices"
								: "repeat"
							: "indices";
				var m = n[h];
				r || (r = Object.keys(o)), p.sort && r.sort(p.sort);
				for (var f = 0; f < r.length; ++f) {
					var T = r[f];
					(p.skipNulls && null === o[T]) ||
						c(
							l,
							u(
								o[T],
								T,
								m,
								p.strictNullHandling,
								p.skipNulls,
								p.encode ? p.encoder : null,
								p.filter,
								p.sort,
								p.allowDots,
								p.serializeDate,
								p.formatter,
								p.encodeValuesOnly,
								p.charset
							)
						);
				}
				var y = l.join(p.delimiter),
					g = !0 === p.addQueryPrefix ? "?" : "";
				return (
					p.charsetSentinel &&
						("iso-8859-1" === p.charset
							? (g += "utf8=%26%2310003%3B&")
							: (g += "utf8=%E2%9C%93&")),
					y.length > 0 ? g + y : ""
				);
			};
		},
		function (e, t, r) {
			"use strict";
			var o = r(7),
				s = Object.prototype.hasOwnProperty,
				i = {
					allowDots: !1,
					allowPrototypes: !1,
					arrayLimit: 20,
					charset: "utf-8",
					charsetSentinel: !1,
					comma: !1,
					decoder: o.decode,
					delimiter: "&",
					depth: 5,
					ignoreQueryPrefix: !1,
					interpretNumericEntities: !1,
					parameterLimit: 1e3,
					parseArrays: !0,
					plainObjects: !1,
					strictNullHandling: !1
				},
				n = function (e) {
					return e.replace(/&#(\d+);/g, function (e, t) {
						return String.fromCharCode(parseInt(t, 10));
					});
				},
				a = function (e, t, r) {
					if (e) {
						var o = r.allowDots
								? e.replace(/\.([^.[]+)/g, "[$1]")
								: e,
							i = /(\[[^[\]]*])/g,
							n = /(\[[^[\]]*])/.exec(o),
							a = n ? o.slice(0, n.index) : o,
							p = [];
						if (a) {
							if (
								!r.plainObjects &&
								s.call(Object.prototype, a) &&
								!r.allowPrototypes
							)
								return;
							p.push(a);
						}
						for (
							var c = 0;
							null !== (n = i.exec(o)) && c < r.depth;

						) {
							if (
								((c += 1),
								!r.plainObjects &&
									s.call(
										Object.prototype,
										n[1].slice(1, -1)
									) &&
									!r.allowPrototypes)
							)
								return;
							p.push(n[1]);
						}
						return (
							n && p.push("[" + o.slice(n.index) + "]"),
							(function (e, t, r) {
								for (var o = t, s = e.length - 1; s >= 0; --s) {
									var i,
										n = e[s];
									if ("[]" === n && r.parseArrays)
										i = [].concat(o);
									else {
										i = r.plainObjects
											? Object.create(null)
											: {};
										var a =
												"[" === n.charAt(0) &&
												"]" === n.charAt(n.length - 1)
													? n.slice(1, -1)
													: n,
											p = parseInt(a, 10);
										r.parseArrays || "" !== a
											? !isNaN(p) &&
												n !== a &&
												String(p) === a &&
												p >= 0 &&
												r.parseArrays &&
												p <= r.arrayLimit
												? ((i = [])[p] = o)
												: (i[a] = o)
											: (i = { 0: o });
									}
									o = i;
								}
								return o;
							})(p, t, r)
						);
					}
				};
			e.exports = function (e, t) {
				var r = (function (e) {
					if (!e) return i;
					if (
						null !== e.decoder &&
						void 0 !== e.decoder &&
						"function" != typeof e.decoder
					)
						throw new TypeError("Decoder has to be a function.");
					if (
						void 0 !== e.charset &&
						"utf-8" !== e.charset &&
						"iso-8859-1" !== e.charset
					)
						throw new Error(
							"The charset option must be either utf-8, iso-8859-1, or undefined"
						);
					var t = void 0 === e.charset ? i.charset : e.charset;
					return {
						allowDots:
							void 0 === e.allowDots
								? i.allowDots
								: !!e.allowDots,
						allowPrototypes:
							"boolean" == typeof e.allowPrototypes
								? e.allowPrototypes
								: i.allowPrototypes,
						arrayLimit:
							"number" == typeof e.arrayLimit
								? e.arrayLimit
								: i.arrayLimit,
						charset: t,
						charsetSentinel:
							"boolean" == typeof e.charsetSentinel
								? e.charsetSentinel
								: i.charsetSentinel,
						comma: "boolean" == typeof e.comma ? e.comma : i.comma,
						decoder:
							"function" == typeof e.decoder
								? e.decoder
								: i.decoder,
						delimiter:
							"string" == typeof e.delimiter ||
							o.isRegExp(e.delimiter)
								? e.delimiter
								: i.delimiter,
						depth: "number" == typeof e.depth ? e.depth : i.depth,
						ignoreQueryPrefix: !0 === e.ignoreQueryPrefix,
						interpretNumericEntities:
							"boolean" == typeof e.interpretNumericEntities
								? e.interpretNumericEntities
								: i.interpretNumericEntities,
						parameterLimit:
							"number" == typeof e.parameterLimit
								? e.parameterLimit
								: i.parameterLimit,
						parseArrays: !1 !== e.parseArrays,
						plainObjects:
							"boolean" == typeof e.plainObjects
								? e.plainObjects
								: i.plainObjects,
						strictNullHandling:
							"boolean" == typeof e.strictNullHandling
								? e.strictNullHandling
								: i.strictNullHandling
					};
				})(t);
				if ("" === e || null == e)
					return r.plainObjects ? Object.create(null) : {};
				for (
					var p =
							"string" == typeof e
								? (function (e, t) {
										var r,
											a = {},
											p = t.ignoreQueryPrefix
												? e.replace(/^\?/, "")
												: e,
											c =
												t.parameterLimit === 1 / 0
													? void 0
													: t.parameterLimit,
											h = p.split(t.delimiter, c),
											d = -1,
											u = t.charset;
										if (t.charsetSentinel)
											for (r = 0; r < h.length; ++r)
												0 === h[r].indexOf("utf8=") &&
													("utf8=%E2%9C%93" === h[r]
														? (u = "utf-8")
														: "utf8=%26%2310003%3B" ===
																h[r] &&
															(u = "iso-8859-1"),
													(d = r),
													(r = h.length));
										for (r = 0; r < h.length; ++r)
											if (r !== d) {
												var l,
													m,
													f = h[r],
													T = f.indexOf("]="),
													y =
														-1 === T
															? f.indexOf("=")
															: T + 1;
												-1 === y
													? ((l = t.decoder(
															f,
															i.decoder,
															u
														)),
														(m =
															t.strictNullHandling
																? null
																: ""))
													: ((l = t.decoder(
															f.slice(0, y),
															i.decoder,
															u
														)),
														(m = t.decoder(
															f.slice(y + 1),
															i.decoder,
															u
														))),
													m &&
														t.interpretNumericEntities &&
														"iso-8859-1" === u &&
														(m = n(m)),
													m &&
														t.comma &&
														m.indexOf(",") > -1 &&
														(m = m.split(",")),
													s.call(a, l)
														? (a[l] = o.combine(
																a[l],
																m
															))
														: (a[l] = m);
											}
										return a;
									})(e, r)
								: e,
						c = r.plainObjects ? Object.create(null) : {},
						h = Object.keys(p),
						d = 0;
					d < h.length;
					++d
				) {
					var u = h[d],
						l = a(u, p[u], r);
					c = o.merge(c, l, r);
				}
				return o.compact(c);
			};
		},
		function (e, t) {
			e.exports = require("child_process");
		},
		function (e, t, r) {
			"use strict";
			const o = r(11),
				s = r(1);
			function i() {
				return "undefined" != typeof Symbol && Symbol.asyncIterator
					? Symbol.asyncIterator
					: "@@asyncIterator";
			}
			function n(e) {
				if (e.length < 2) return;
				const t = e[1];
				if ("function" != typeof t)
					throw Error(
						"The second argument to autoPagingEach, if present, must be a callback function; received " +
							typeof t
					);
				return t;
			}
			function a(e) {
				if (0 === e.length) return;
				const t = e[0];
				if ("function" != typeof t)
					throw Error(
						"The first argument to autoPagingEach, if present, must be a callback function; received " +
							typeof t
					);
				if (2 === t.length) return t;
				if (t.length > 2)
					throw Error(
						"The `onItem` callback function passed to autoPagingEach must accept at most two arguments; got " +
							t
					);
				return function (e, r) {
					r(t(e));
				};
			}
			function p(e, t) {
				return new Promise((r, o) => {
					e()
						.then(function o(s) {
							if (s.done) return void r();
							const i = s.value;
							return new Promise(e => {
								t(i, e);
							}).then(t =>
								!1 === t ? o({ done: !0 }) : e().then(o)
							);
						})
						.catch(o);
				});
			}
			e.exports.makeAutoPaginationMethods = function (e, t, r, c) {
				const h = { currentPromise: null },
					d = (function (e) {
						const t = [].slice.call(e);
						return !!s.getDataFromArgs(t).ending_before;
					})(t);
				let u,
					l = c,
					m = 0;
				function f(e) {
					if (!e || !e.data || "number" != typeof e.data.length)
						throw Error(
							"Unexpected: Stripe API response does not have a well-formed `data` array."
						);
					if (m < e.data.length) {
						const t = d ? e.data.length - 1 - m : m,
							r = e.data[t];
						return (m += 1), { value: r, done: !1 };
					}
					return e.has_more
						? ((m = 0), (l = u(e)), l.then(f))
						: { value: void 0, done: !0 };
				}
				function T() {
					return (function (e, t) {
						if (e.currentPromise) return e.currentPromise;
						return (
							(e.currentPromise = new Promise(t).then(
								t => ((e.currentPromise = void 0), t)
							)),
							e.currentPromise
						);
					})(h, (e, t) => l.then(f).then(e).catch(t));
				}
				u =
					"search" === r.methodType
						? s => {
								if (!s.next_page)
									throw Error(
										"Unexpected: Stripe API response does not have a well-formed `next_page` field, but `has_more` was true."
									);
								return o(e, t, r, { next_page: s.next_page });
							}
						: s => {
								const i = (function (e, t) {
									const r = t ? 0 : e.data.length - 1,
										o = e.data[r],
										s = o && o.id;
									if (!s)
										throw Error(
											"Unexpected: No `id` found on the last item while auto-paging a list."
										);
									return s;
								})(s, d);
								return o(e, t, r, {
									[d ? "ending_before" : "starting_after"]: i
								});
							};
				const y = (function (e) {
						return function () {
							const t = [].slice.call(arguments),
								r = a(t),
								o = n(t);
							if (t.length > 2)
								throw Error(
									"autoPagingEach takes up to two arguments; received " +
										t
								);
							const i = p(e, r);
							return s.callbackifyPromiseWithTimeout(i, o);
						};
					})(T),
					g = (function (e) {
						return function (t, r) {
							const o = t && t.limit;
							if (!o)
								throw Error(
									"You must pass a `limit` option to autoPagingToArray, e.g., `autoPagingToArray({limit: 1000});`."
								);
							if (o > 1e4)
								throw Error(
									"You cannot specify a limit of more than 10,000 items to fetch in `autoPagingToArray`; use `autoPagingEach` to iterate through longer lists."
								);
							const i = new Promise((t, r) => {
								const s = [];
								e(e => {
									if ((s.push(e), s.length >= o)) return !1;
								})
									.then(() => {
										t(s);
									})
									.catch(r);
							});
							return s.callbackifyPromiseWithTimeout(i, r);
						};
					})(y),
					E = {
						autoPagingEach: y,
						autoPagingToArray: g,
						next: T,
						return: () => ({}),
						[i()]: () => E
					};
				return E;
			};
		},
		function (e, t, r) {
			"use strict";
			const o = r(10);
			e.exports = {
				create: o({ method: "POST" }),
				list: o({ method: "GET", methodType: "list" }),
				retrieve: o({ method: "GET", path: "/{id}" }),
				update: o({ method: "POST", path: "{id}" }),
				del: o({ method: "DELETE", path: "{id}" })
			};
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "account_links",
				create: s({ method: "POST", path: "" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "apple_pay/domains",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{domain}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				del: s({ method: "DELETE", path: "/{domain}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "application_fees",
				retrieve: s({ method: "GET", path: "/{id}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				createRefund: s({ method: "POST", path: "/{id}/refunds" }),
				retrieveRefund: s({
					method: "GET",
					path: "/{fee}/refunds/{id}"
				}),
				updateRefund: s({
					method: "POST",
					path: "/{fee}/refunds/{id}"
				}),
				listRefunds: s({
					method: "GET",
					path: "/{id}/refunds",
					methodType: "list"
				})
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "balance",
				retrieve: s({ method: "GET", path: "" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "balance_transactions",
				retrieve: s({ method: "GET", path: "/{id}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "charges",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{charge}" }),
				update: s({ method: "POST", path: "/{charge}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				capture: s({ method: "POST", path: "/{charge}/capture" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "country_specs",
				retrieve: s({ method: "GET", path: "/{country}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "coupons",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{coupon}" }),
				update: s({ method: "POST", path: "/{coupon}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				del: s({ method: "DELETE", path: "/{coupon}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "credit_notes",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{id}" }),
				update: s({ method: "POST", path: "/{id}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				preview: s({ method: "GET", path: "/preview" }),
				voidCreditNote: s({ method: "POST", path: "/{id}/void" }),
				listLineItems: s({
					method: "GET",
					path: "/{creditNote}/lines",
					methodType: "list"
				}),
				listPreviewLineItems: s({
					method: "GET",
					path: "/preview/lines",
					methodType: "list"
				})
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "customers",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{customer}" }),
				update: s({ method: "POST", path: "/{customer}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				del: s({ method: "DELETE", path: "/{customer}" }),
				deleteDiscount: s({
					method: "DELETE",
					path: "/{customer}/discount"
				}),
				listPaymentMethods: s({
					method: "GET",
					path: "/{customer}/payment_methods",
					methodType: "list"
				}),
				createBalanceTransaction: s({
					method: "POST",
					path: "/{customer}/balance_transactions"
				}),
				retrieveBalanceTransaction: s({
					method: "GET",
					path: "/{customer}/balance_transactions/{transaction}"
				}),
				updateBalanceTransaction: s({
					method: "POST",
					path: "/{customer}/balance_transactions/{transaction}"
				}),
				listBalanceTransactions: s({
					method: "GET",
					path: "/{customer}/balance_transactions",
					methodType: "list"
				}),
				createSource: s({
					method: "POST",
					path: "/{customer}/sources"
				}),
				retrieveSource: s({
					method: "GET",
					path: "/{customer}/sources/{id}"
				}),
				updateSource: s({
					method: "POST",
					path: "/{customer}/sources/{id}"
				}),
				listSources: s({
					method: "GET",
					path: "/{customer}/sources",
					methodType: "list"
				}),
				deleteSource: s({
					method: "DELETE",
					path: "/{customer}/sources/{id}"
				}),
				verifySource: s({
					method: "POST",
					path: "/{customer}/sources/{id}/verify"
				}),
				createTaxId: s({ method: "POST", path: "/{customer}/tax_ids" }),
				retrieveTaxId: s({
					method: "GET",
					path: "/{customer}/tax_ids/{id}"
				}),
				listTaxIds: s({
					method: "GET",
					path: "/{customer}/tax_ids",
					methodType: "list"
				}),
				deleteTaxId: s({
					method: "DELETE",
					path: "/{customer}/tax_ids/{id}"
				})
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "disputes",
				retrieve: s({ method: "GET", path: "/{dispute}" }),
				update: s({ method: "POST", path: "/{dispute}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				close: s({ method: "POST", path: "/{dispute}/close" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "ephemeral_keys",
				create: s({
					method: "POST",
					path: "",
					validator: (e, t) => {
						if (!t.headers || !t.headers["Stripe-Version"])
							throw new Error(
								"Passing apiVersion in a separate options hash is required to create an ephemeral key. See https://stripe.com/docs/api/versioning?lang=node"
							);
					}
				}),
				del: s({ method: "DELETE", path: "/{key}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "events",
				retrieve: s({ method: "GET", path: "/{id}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "exchange_rates",
				retrieve: s({ method: "GET", path: "/{rateId}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const { multipartRequestDataProcessor: o } = r(41),
				s = r(0),
				i = s.method;
			e.exports = s.extend({
				path: "files",
				create: i({
					method: "POST",
					headers: { "Content-Type": "multipart/form-data" },
					host: "files.stripe.com"
				}),
				retrieve: i({ method: "GET", path: "/{file}" }),
				list: i({ method: "GET", path: "", methodType: "list" }),
				requestDataProcessor: o
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(1),
				{ StripeError: s } = r(3);
			class i extends s {}
			const n = (e, t, r) => {
				const s = (
					Math.round(1e16 * Math.random()) +
					Math.round(1e16 * Math.random())
				).toString();
				r["Content-Type"] = "multipart/form-data; boundary=" + s;
				let i = Buffer.alloc(0);
				function n(e) {
					const t = i,
						r = e instanceof Buffer ? e : Buffer.from(e);
					(i = Buffer.alloc(t.length + r.length + 2)),
						t.copy(i),
						r.copy(i, t.length),
						i.write("\r\n", i.length - 2);
				}
				function a(e) {
					return `"${e.replace(/"|"/g, "%22").replace(/\r\n|\r|\n/g, " ")}"`;
				}
				const p = o.flattenAndStringify(t);
				for (const e in p) {
					const t = p[e];
					n("--" + s),
						t.hasOwnProperty("data")
							? (n(
									`Content-Disposition: form-data; name=${a(e)}; filename=${a(t.name || "blob")}`
								),
								n(
									"Content-Type: " +
										(t.type || "application/octet-stream")
								),
								n(""),
								n(t.data))
							: (n(
									"Content-Disposition: form-data; name=" +
										a(e)
								),
								n(""),
								n(t));
				}
				return n(`--${s}--`), i;
			};
			e.exports.multipartRequestDataProcessor = (e, t, r, s) => {
				if (((t = t || {}), "POST" !== e))
					return s(null, o.stringifyRequestData(t));
				if (o.checkForStream(t))
					return ((e, t, r, o) => {
						const s = [];
						t.file.data
							.on("data", e => {
								s.push(e);
							})
							.once("end", () => {
								const e = Object.assign({}, t);
								e.file.data = Buffer.concat(s);
								const i = n(0, e, r);
								o(null, i);
							})
							.on("error", e => {
								o(
									new i({
										message:
											"An error occurred while attempting to process the file for upload.",
										detail: e
									}),
									null
								);
							});
					})(0, t, r, s);
				return s(null, n(0, t, r));
			};
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "file_links",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{link}" }),
				update: s({ method: "POST", path: "/{link}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "invoices",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{invoice}" }),
				update: s({ method: "POST", path: "/{invoice}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				del: s({ method: "DELETE", path: "/{invoice}" }),
				finalizeInvoice: s({
					method: "POST",
					path: "/{invoice}/finalize"
				}),
				markUncollectible: s({
					method: "POST",
					path: "/{invoice}/mark_uncollectible"
				}),
				pay: s({ method: "POST", path: "/{invoice}/pay" }),
				retrieveUpcoming: s({ method: "GET", path: "/upcoming" }),
				sendInvoice: s({ method: "POST", path: "/{invoice}/send" }),
				voidInvoice: s({ method: "POST", path: "/{invoice}/void" }),
				listLineItems: s({
					method: "GET",
					path: "/{invoice}/lines",
					methodType: "list"
				}),
				listUpcomingLineItems: s({
					method: "GET",
					path: "/upcoming/lines",
					methodType: "list"
				})
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "invoiceitems",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{invoiceitem}" }),
				update: s({ method: "POST", path: "/{invoiceitem}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				del: s({ method: "DELETE", path: "/{invoiceitem}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "issuer_fraud_records",
				retrieve: s({ method: "GET", path: "/{issuerFraudRecord}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "mandates",
				retrieve: s({ method: "GET", path: "/{mandate}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method,
				i = r(1),
				n = "connect.stripe.com";
			e.exports = o.extend({
				basePath: "/",
				authorizeUrl(e, t) {
					e = e || {};
					let r = "oauth/authorize";
					return (
						(t = t || {}).express && (r = "express/" + r),
						e.response_type || (e.response_type = "code"),
						e.client_id ||
							(e.client_id = this._stripe.getClientId()),
						e.scope || (e.scope = "read_write"),
						`https://${n}/${r}?${i.stringifyRequestData(e)}`
					);
				},
				token: s({ method: "POST", path: "oauth/token", host: n }),
				deauthorize(e) {
					return (
						e.client_id ||
							(e.client_id = this._stripe.getClientId()),
						s({
							method: "POST",
							path: "oauth/deauthorize",
							host: n
						}).apply(this, arguments)
					);
				}
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "orders",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{id}" }),
				update: s({ method: "POST", path: "/{id}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				pay: s({ method: "POST", path: "/{id}/pay" }),
				returnOrder: s({ method: "POST", path: "/{id}/returns" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "order_returns",
				retrieve: s({ method: "GET", path: "/{id}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "payment_intents",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{intent}" }),
				update: s({ method: "POST", path: "/{intent}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				cancel: s({ method: "POST", path: "/{intent}/cancel" }),
				capture: s({ method: "POST", path: "/{intent}/capture" }),
				confirm: s({ method: "POST", path: "/{intent}/confirm" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "payment_methods",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{paymentMethod}" }),
				update: s({ method: "POST", path: "/{paymentMethod}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				attach: s({ method: "POST", path: "/{paymentMethod}/attach" }),
				detach: s({ method: "POST", path: "/{paymentMethod}/detach" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "payouts",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{payout}" }),
				update: s({ method: "POST", path: "/{payout}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				cancel: s({ method: "POST", path: "/{payout}/cancel" }),
				reverse: s({ method: "POST", path: "/{payout}/reverse" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "plans",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{plan}" }),
				update: s({ method: "POST", path: "/{plan}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				del: s({ method: "DELETE", path: "/{plan}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "prices",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{price}" }),
				update: s({ method: "POST", path: "/{price}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "products",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{id}" }),
				update: s({ method: "POST", path: "/{id}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				del: s({ method: "DELETE", path: "/{id}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "promotion_codes",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{promotionCode}" }),
				update: s({ method: "POST", path: "/{promotionCode}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "quotes",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{quote}" }),
				update: s({ method: "POST", path: "/{quote}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				accept: s({ method: "POST", path: "/{quote}/accept" }),
				cancel: s({ method: "POST", path: "/{quote}/cancel" }),
				finalizeQuote: s({ method: "POST", path: "/{quote}/finalize" }),
				listComputedUpfrontLineItems: s({
					method: "GET",
					path: "/{quote}/computed_upfront_line_items",
					methodType: "list"
				}),
				listLineItems: s({
					method: "GET",
					path: "/{quote}/line_items",
					methodType: "list"
				}),
				pdf: s({
					host: "files.stripe.com",
					method: "GET",
					path: "/{quote}/pdf",
					streaming: !0
				})
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "refunds",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{refund}" }),
				update: s({ method: "POST", path: "/{refund}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "reviews",
				retrieve: s({ method: "GET", path: "/{review}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				approve: s({ method: "POST", path: "/{review}/approve" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "setup_attempts",
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "setup_intents",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{intent}" }),
				update: s({ method: "POST", path: "/{intent}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				cancel: s({ method: "POST", path: "/{intent}/cancel" }),
				confirm: s({ method: "POST", path: "/{intent}/confirm" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "skus",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{id}" }),
				update: s({ method: "POST", path: "/{id}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				del: s({ method: "DELETE", path: "/{id}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "sources",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{source}" }),
				update: s({ method: "POST", path: "/{source}" }),
				listSourceTransactions: s({
					method: "GET",
					path: "/{source}/source_transactions",
					methodType: "list"
				}),
				verify: s({ method: "POST", path: "/{source}/verify" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "subscriptions",
				create: s({ method: "POST", path: "" }),
				retrieve: s({
					method: "GET",
					path: "/{subscriptionExposedId}"
				}),
				update: s({ method: "POST", path: "/{subscriptionExposedId}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				del: s({ method: "DELETE", path: "/{subscriptionExposedId}" }),
				deleteDiscount: s({
					method: "DELETE",
					path: "/{subscriptionExposedId}/discount"
				})
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "subscription_items",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{item}" }),
				update: s({ method: "POST", path: "/{item}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				del: s({ method: "DELETE", path: "/{item}" }),
				createUsageRecord: s({
					method: "POST",
					path: "/{subscriptionItem}/usage_records"
				}),
				listUsageRecordSummaries: s({
					method: "GET",
					path: "/{subscriptionItem}/usage_record_summaries",
					methodType: "list"
				})
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "subscription_schedules",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{schedule}" }),
				update: s({ method: "POST", path: "/{schedule}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				cancel: s({ method: "POST", path: "/{schedule}/cancel" }),
				release: s({ method: "POST", path: "/{schedule}/release" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "tax_codes",
				retrieve: s({ method: "GET", path: "/{id}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "tax_rates",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{taxRate}" }),
				update: s({ method: "POST", path: "/{taxRate}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "tokens",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{token}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "topups",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{topup}" }),
				update: s({ method: "POST", path: "/{topup}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				cancel: s({ method: "POST", path: "/{topup}/cancel" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "transfers",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{transfer}" }),
				update: s({ method: "POST", path: "/{transfer}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				createReversal: s({ method: "POST", path: "/{id}/reversals" }),
				retrieveReversal: s({
					method: "GET",
					path: "/{transfer}/reversals/{id}"
				}),
				updateReversal: s({
					method: "POST",
					path: "/{transfer}/reversals/{id}"
				}),
				listReversals: s({
					method: "GET",
					path: "/{id}/reversals",
					methodType: "list"
				})
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "webhook_endpoints",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{webhookEndpoint}" }),
				update: s({ method: "POST", path: "/{webhookEndpoint}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				del: s({ method: "DELETE", path: "/{webhookEndpoint}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "billing_portal/configurations",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{configuration}" }),
				update: s({ method: "POST", path: "/{configuration}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "billing_portal/sessions",
				create: s({ method: "POST", path: "" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "checkout/sessions",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{session}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				listLineItems: s({
					method: "GET",
					path: "/{session}/line_items",
					methodType: "list"
				})
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "identity/verification_reports",
				retrieve: s({ method: "GET", path: "/{report}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "identity/verification_sessions",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{session}" }),
				update: s({ method: "POST", path: "/{session}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				cancel: s({ method: "POST", path: "/{session}/cancel" }),
				redact: s({ method: "POST", path: "/{session}/redact" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "issuing/authorizations",
				retrieve: s({ method: "GET", path: "/{authorization}" }),
				update: s({ method: "POST", path: "/{authorization}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				approve: s({
					method: "POST",
					path: "/{authorization}/approve"
				}),
				decline: s({ method: "POST", path: "/{authorization}/decline" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "issuing/cards",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{card}" }),
				update: s({ method: "POST", path: "/{card}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				retrieveDetails: s({ method: "GET", path: "/{card}/details" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "issuing/cardholders",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{cardholder}" }),
				update: s({ method: "POST", path: "/{cardholder}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "issuing/disputes",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{dispute}" }),
				update: s({ method: "POST", path: "/{dispute}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				submit: s({ method: "POST", path: "/{dispute}/submit" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "issuing/transactions",
				retrieve: s({ method: "GET", path: "/{transaction}" }),
				update: s({ method: "POST", path: "/{transaction}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "radar/early_fraud_warnings",
				retrieve: s({ method: "GET", path: "/{earlyFraudWarning}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "radar/value_lists",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{valueList}" }),
				update: s({ method: "POST", path: "/{valueList}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				del: s({ method: "DELETE", path: "/{valueList}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "radar/value_list_items",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{item}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				del: s({ method: "DELETE", path: "/{item}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "reporting/report_runs",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{reportRun}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "reporting/report_types",
				retrieve: s({ method: "GET", path: "/{reportType}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "sigma/scheduled_query_runs",
				retrieve: s({ method: "GET", path: "/{scheduledQueryRun}" }),
				list: s({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "terminal/connection_tokens",
				create: s({ method: "POST", path: "" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "terminal/locations",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{location}" }),
				update: s({ method: "POST", path: "/{location}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				del: s({ method: "DELETE", path: "/{location}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				s = o.method;
			e.exports = o.extend({
				path: "terminal/readers",
				create: s({ method: "POST", path: "" }),
				retrieve: s({ method: "GET", path: "/{reader}" }),
				update: s({ method: "POST", path: "/{reader}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				del: s({ method: "DELETE", path: "/{reader}" })
			});
		},
		function (e) {
			e.exports = JSON.parse(
				'{"_from":"stripe@^8.180.0","_id":"stripe@8.180.0","_inBundle":false,"_integrity":"sha512-iqqlEQZDmKZ7FX/05JXRTD3Z5X+Oq+ggDpyvaXtDZI4oxI4xjEoVJIwm1y8C0d9FMhfkxGJqGPpQsieChC2/rg==","_location":"/stripe","_phantomChildren":{},"_requested":{"type":"range","registry":true,"raw":"stripe@^8.180.0","name":"stripe","escapedName":"stripe","rawSpec":"^8.180.0","saveSpec":null,"fetchSpec":"^8.180.0"},"_requiredBy":["#USER","/"],"_resolved":"https://registry.npmjs.org/stripe/-/stripe-8.180.0.tgz","_shasum":"2787aebd31d9879da5b5eae389daa29db77fea92","_spec":"stripe@^8.180.0","_where":"C:\\\\Users\\\\jon\\\\next-2021","author":{"name":"Stripe","email":"support@stripe.com","url":"https://stripe.com/"},"bugs":{"url":"https://github.com/stripe/stripe-node/issues"},"bundleDependencies":false,"contributors":[{"name":"Ask Bjørn Hansen","email":"ask@develooper.com","url":"http://www.askask.com/"},{"name":"Michelle Bu","email":"michelle@stripe.com"},{"name":"Alex Sexton","email":"alex@stripe.com"},{"name":"James Padolsey"}],"dependencies":{"@types/node":">=8.1.0","qs":"^6.6.0"},"deprecated":false,"description":"Stripe API wrapper","devDependencies":{"@typescript-eslint/eslint-plugin":"^2.13.0","@typescript-eslint/parser":"^2.13.0","chai":"~4.2.0","chai-as-promised":"~7.1.1","coveralls":"^3.0.0","eslint":"^6.8.0","eslint-config-prettier":"^4.1.0","eslint-plugin-chai-friendly":"^0.4.0","eslint-plugin-prettier":"^3.0.1","mocha":"^8.3.2","mocha-junit-reporter":"^1.23.1","nock":"^13.1.1","node-fetch":"^2.6.2","nyc":"^15.1.0","prettier":"^1.16.4","typescript":"^3.7.2"},"engines":{"node":"^8.1 || >=10.*"},"homepage":"https://github.com/stripe/stripe-node","keywords":["stripe","payment processing","credit cards","api"],"license":"MIT","main":"lib/stripe.js","name":"stripe","repository":{"type":"git","url":"git://github.com/stripe/stripe-node.git"},"resolutions":{"ansi-regex":"5.0.1"},"scripts":{"clean":"rm -rf ./.nyc_output ./node_modules/.cache ./coverage","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"yarn lint --fix && ./scripts/updateAPIVersion.js","lint":"eslint --ext .js,.jsx,.ts .","mocha":"nyc mocha","mocha-only":"mocha","report":"nyc -r text -r lcov report","test":"yarn lint && yarn test-typescript && yarn mocha","test-typescript":"tsc --build types/test"},"types":"types/2020-08-27/index.d.ts","version":"8.180.0"}'
			);
		},
		function (e, t, r) {
			"use strict";
			const o = r(9),
				s = r(12);
			e.exports = class extends s {
				computeHMACSignature(e, t) {
					return o
						.createHmac("sha256", t)
						.update(e, "utf8")
						.digest("hex");
				}
			};
		},
		function (e, t, r) {
			"use strict";
			const o = r(14),
				s = r(15),
				{ HttpClient: i, HttpClientResponse: n } = r(4),
				a = new o.Agent({ keepAlive: !0 }),
				p = new s.Agent({ keepAlive: !0 });
			class c extends n {
				constructor(e) {
					super(e.statusCode, e.headers || {}), (this._res = e);
				}
				getRawResponse() {
					return this._res;
				}
				toStream(e) {
					return this._res.once("end", () => e()), this._res;
				}
				toJSON() {
					return new Promise((e, t) => {
						let r = "";
						this._res.setEncoding("utf8"),
							this._res.on("data", e => {
								r += e;
							}),
							this._res.once("end", () => {
								try {
									e(JSON.parse(r));
								} catch (e) {
									t(e);
								}
							});
					});
				}
			}
			e.exports = {
				NodeHttpClient: class extends i {
					constructor(e) {
						super(), (this._agent = e);
					}
					getClientName() {
						return "node";
					}
					makeRequest(e, t, r, n, h, d, u, l) {
						const m = "http" === u;
						let f = this._agent;
						f || (f = m ? a : p);
						return new Promise((a, p) => {
							const u = (m ? o : s).request({
								host: e,
								port: t,
								path: r,
								method: n,
								agent: f,
								headers: h,
								ciphers:
									"DEFAULT:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!MD5"
							});
							u.setTimeout(l, () => {
								u.destroy(i.makeTimeoutError());
							}),
								u.on("response", e => {
									a(new c(e));
								}),
								u.on("error", e => {
									p(e);
								}),
								u.once("socket", e => {
									e.connecting
										? e.once(
												m ? "connect" : "secureConnect",
												() => {
													u.write(d), u.end();
												}
											)
										: (u.write(d), u.end());
								});
						});
					}
				},
				NodeHttpClientResponse: c
			};
		},
		,
		,
		,
		,
		,
		,
		,
		,
		,
		,
		,
		,
		,
		,
		function (e, t, r) {
			const o = r(17)(
				"sk_test_51Jc3tgBsU5VsdqsSVVwTGzG5aVdTWzvro1azBZhUdkrKxdpi6HtY9B9ZalEYvnr0BvqJ8L2g0arVjS2PI9I51Cqf00Ei9jX6A6"
			);
			t.handler = async e => {
				const t = JSON.parse(e.body).items.map(e => {
						var t;
						const r =
							null !== (t = e.variation) && void 0 !== t && t
								? e.variation.node.price
								: e.product.node.price;
						return {
							price_data: {
								currency: "eur",
								product_data: {
									name: e.product.node.name,
									id: e.product.node.databseId,
									images: [
										e.product.node.featuredImage.node
											.sourceUrl
									]
								},
								unit_amount: 100 * Number(r.substring(1))
							},
							quantity: e.quantity
						};
					}),
					r = await o.checkout.sessions.create({
						payment_method_types: ["card"],
						line_items: t,
						mode: "payment",
						success_url:
							process.env.URL + "/order-received?clearCart=true",
						cancel_url: process.env.URL + "/cart"
					});
				return (
					console.log(r),
					{
						statusCode: 200,
						body: JSON.stringify({
							sessionId: r.id,
							url: r.url,
							publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
						})
					}
				);
			};
		}
	])
);
