!(function (e, t) {
	for (var r in t) e[r] = t[r];
})(
	exports,
	(function (e) {
		var t = {};
		function r(o) {
			if (t[o]) return t[o].exports;
			var n = (t[o] = { i: o, l: !1, exports: {} });
			return e[o].call(n.exports, n, n.exports, r), (n.l = !0), n.exports;
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
					for (var n in e)
						r.d(
							o,
							n,
							function (t) {
								return e[t];
							}.bind(null, n)
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
			r((r.s = 110))
		);
	})([
		function (e, t, r) {
			"use strict";
			const o = r(16),
				n = r(1),
				{
					StripeConnectionError: s,
					StripeAuthenticationError: i,
					StripePermissionError: a,
					StripeRateLimitError: c,
					StripeError: p,
					StripeAPIError: u
				} = r(3),
				h = r(4);
			(d.extend = n.protoExtend),
				(d.method = r(10)),
				(d.BASIC_METHODS = r(25)),
				(d.MAX_BUFFERED_REQUEST_METRICS = 100);
			function d(e, t) {
				if (((this._stripe = e), t))
					throw new Error(
						"Support for curried url params was dropped in stripe-node v7.0.0. Instead, pass two ids."
					);
				(this.basePath = n.makeURLInterpolator(
					this.basePath || e.getApiField("basePath")
				)),
					(this.resourcePath = this.path),
					(this.path = n.makeURLInterpolator(this.path)),
					this.includeBasic &&
						this.includeBasic.forEach(function (e) {
							this[e] = d.BASIC_METHODS[e];
						}, this),
					this.initialize(...arguments);
			}
			(d.prototype = {
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
				wrapTimeout: n.callbackifyPromiseWithTimeout,
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
						s = o - e.request_start_time;
					return n.removeNullish({
						api_version: r["stripe-version"],
						account: r["stripe-account"],
						idempotency_key: r["idempotency-key"],
						method: e.method,
						path: e.path,
						status: t,
						request_id: this._getRequestId(r),
						elapsed: s,
						request_start_time: e.request_start_time,
						request_end_time: o
					});
				},
				_getRequestId: e => e["request-id"],
				_streamingResponseHandler(e, t) {
					return r => {
						const o = r.getHeaders(),
							n = r.toStream(() => {
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
							this._addHeadersDirectlyToObject(n, o), t(null, n)
						);
					};
				},
				_jsonResponseHandler(e, t) {
					return r => {
						const o = r.getHeaders(),
							n = this._getRequestId(o),
							s = r.getStatusCode(),
							h = this._makeResponseEvent(e, s, o);
						this._stripe._emitter.emit("response", h),
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
												(e.error.statusCode = s),
												(e.error.requestId = n),
												(t =
													401 === s
														? new i(e.error)
														: 403 === s
															? new a(e.error)
															: 429 === s
																? new c(e.error)
																: p.generate(
																		e.error
																	)),
												t)
											);
										}
										return e;
									},
									e => {
										throw new u({
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
											n,
											h.elapsed
										);
										const s = r.getRawResponse();
										this._addHeadersDirectlyToObject(s, o),
											Object.defineProperty(
												e,
												"lastResponse",
												{
													enumerable: !1,
													writable: !1,
													value: s
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
							new s({
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
					let n = Math.min(r * Math.pow(e - 1, 2), o);
					return (
						(n *= 0.5 * (1 + Math.random())),
						(n = Math.max(r, n)),
						Number.isInteger(t) && t <= 60 && (n = Math.max(n, t)),
						1e3 * n
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
						? "stripe-node-retry-" + n.uuid4()
						: null;
				},
				_makeHeaders(e, t, r, o, s, i, a) {
					const c = {
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
						"Idempotency-Key": this._defaultIdempotencyKey(s, a)
					};
					return Object.assign(
						n.removeNullish(c),
						n.normalizeHeaders(i)
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
						d.MAX_BUFFERED_REQUEST_METRICS
							? n.emitWarning(
									"Request metrics buffer is full, dropping telemetry message."
								)
							: this._stripe._prevRequestMetrics.push({
									request_id: e,
									request_duration_ms: t
								}));
				},
				_request(e, t, r, o, i, a = {}, c) {
					let p;
					const u = (e, t, r, o, n) =>
							setTimeout(
								e,
								this._getSleepTimeInMS(o, n),
								t,
								r,
								o + 1
							),
						d = (o, i, l) => {
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
										i,
										p,
										this._stripe.getApiField("protocol"),
										m
									),
								g = Date.now(),
								y = n.removeNullish({
									api_version: o,
									account: i["Stripe-Account"],
									idempotency_key: i["Idempotency-Key"],
									method: e,
									path: r,
									request_start_time: g
								}),
								T = l || 0,
								E = this._getMaxNetworkRetries(a.settings);
							this._stripe._emitter.emit("request", y),
								f
									.then(e =>
										this._shouldRetry(e, T, E)
											? u(
													d,
													o,
													i,
													T,
													e.getHeaders()[
														"retry-after"
													]
												)
											: a.streaming &&
												  e.getStatusCode() < 400
												? this._streamingResponseHandler(
														y,
														c
													)(e)
												: this._jsonResponseHandler(
														y,
														c
													)(e)
									)
									.catch(e => {
										if (this._shouldRetry(null, T, E))
											return u(d, o, i, T, null);
										{
											const t =
												e.code &&
												e.code === h.TIMEOUT_ERROR_CODE;
											return c.call(
												this,
												new s({
													message: t
														? `Request aborted due to timeout being reached (${m}ms)`
														: this._generateConnectionErrorMessage(
																T
															),
													detail: e
												})
											);
										}
									});
						},
						l = (t, r) => {
							if (t) return c(t);
							(p = r),
								this._stripe.getClientUserAgent(t => {
									const r =
											this._stripe.getApiField("version"),
										o = this._makeHeaders(
											i,
											p.length,
											r,
											t,
											e,
											a.headers,
											a.settings
										);
									d(r, o);
								});
						};
					this.requestDataProcessor
						? this.requestDataProcessor(e, o, a.headers, l)
						: l(null, n.stringifyRequestData(o || {}));
				}
			}),
				(e.exports = d);
		},
		function (e, t, r) {
			"use strict";
			const o = r(6).EventEmitter,
				n = r(20),
				s = r(9),
				i = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
			let a = null;
			try {
				a = r(23).exec;
			} catch (e) {
				if ("MODULE_NOT_FOUND" !== e.code) throw e;
			}
			const c = [
					"apiKey",
					"idempotencyKey",
					"stripeAccount",
					"apiVersion",
					"maxNetworkRetries",
					"timeout",
					"host"
				],
				p = {
					api_key: "apiKey",
					idempotency_key: "idempotencyKey",
					stripe_account: "stripeAccount",
					stripe_version: "apiVersion",
					stripeVersion: "apiVersion"
				},
				u = Object.keys(p),
				h = (e.exports = {
					isOptionsHash: e =>
						e &&
						"object" == typeof e &&
						(c.some(t => i(e, t)) || u.some(t => i(e, t))),
					stringifyRequestData: e =>
						n
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
						if (!h.isOptionsHash(e[0])) return e.shift();
						const t = Object.keys(e[0]),
							r = t.filter(e => c.includes(e));
						return (
							r.length > 0 &&
								r.length !== t.length &&
								d(
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
							else if (h.isOptionsHash(r)) {
								const r = { ...e.pop() },
									o = Object.keys(r).filter(
										e => !c.includes(e)
									);
								if (o.length) {
									o.filter(e => {
										if (!p[e]) return !0;
										const t = p[e];
										if (r[t])
											throw Error(
												`Both '${t}' and '${e}' were provided; please remove '${e}', which is deprecated.`
											);
										d(
											`'${e}' is deprecated; use '${t}' instead.`
										),
											(r[t] = r[e]);
									}).length &&
										d(
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
							r = i(e, "constructor")
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
						if (s.timingSafeEqual) return s.timingSafeEqual(e, t);
						const r = e.length;
						let o = 0;
						for (let n = 0; n < r; ++n) o |= e[n] ^ t[n];
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
										(t[h.normalizeHeader(r)] = e[r]), t
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
					emitWarning: d,
					safeExec: (e, t) => {
						if (null !== h._exec)
							try {
								h._exec(e, t);
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
								Object.keys(e).forEach(n => {
									const s = e[n],
										i = o ? `${o}[${n}]` : n;
									if (h.isObject(s)) {
										if (
											!Buffer.isBuffer(s) &&
											!s.hasOwnProperty("data")
										)
											return r(s, i);
										t[i] = s;
									} else t[i] = String(s);
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
			function d(e) {
				return "function" != typeof process.emitWarning
					? console.warn("Stripe: " + e)
					: process.emitWarning(e, "Stripe");
			}
		},
		function (e, t, r) {
			"use strict";
			var o = r(99),
				n = Object.prototype.toString;
			function s(e) {
				return "[object Array]" === n.call(e);
			}
			function i(e) {
				return void 0 === e;
			}
			function a(e) {
				return null !== e && "object" == typeof e;
			}
			function c(e) {
				if ("[object Object]" !== n.call(e)) return !1;
				var t = Object.getPrototypeOf(e);
				return null === t || t === Object.prototype;
			}
			function p(e) {
				return "[object Function]" === n.call(e);
			}
			function u(e, t) {
				if (null != e)
					if (("object" != typeof e && (e = [e]), s(e)))
						for (var r = 0, o = e.length; r < o; r++)
							t.call(null, e[r], r, e);
					else
						for (var n in e)
							Object.prototype.hasOwnProperty.call(e, n) &&
								t.call(null, e[n], n, e);
			}
			e.exports = {
				isArray: s,
				isArrayBuffer: function (e) {
					return "[object ArrayBuffer]" === n.call(e);
				},
				isBuffer: function (e) {
					return (
						null !== e &&
						!i(e) &&
						null !== e.constructor &&
						!i(e.constructor) &&
						"function" == typeof e.constructor.isBuffer &&
						e.constructor.isBuffer(e)
					);
				},
				isFormData: function (e) {
					return (
						"undefined" != typeof FormData && e instanceof FormData
					);
				},
				isArrayBufferView: function (e) {
					return "undefined" != typeof ArrayBuffer &&
						ArrayBuffer.isView
						? ArrayBuffer.isView(e)
						: e && e.buffer && e.buffer instanceof ArrayBuffer;
				},
				isString: function (e) {
					return "string" == typeof e;
				},
				isNumber: function (e) {
					return "number" == typeof e;
				},
				isObject: a,
				isPlainObject: c,
				isUndefined: i,
				isDate: function (e) {
					return "[object Date]" === n.call(e);
				},
				isFile: function (e) {
					return "[object File]" === n.call(e);
				},
				isBlob: function (e) {
					return "[object Blob]" === n.call(e);
				},
				isFunction: p,
				isStream: function (e) {
					return a(e) && p(e.pipe);
				},
				isURLSearchParams: function (e) {
					return (
						"undefined" != typeof URLSearchParams &&
						e instanceof URLSearchParams
					);
				},
				isStandardBrowserEnv: function () {
					return (
						("undefined" == typeof navigator ||
							("ReactNative" !== navigator.product &&
								"NativeScript" !== navigator.product &&
								"NS" !== navigator.product)) &&
						"undefined" != typeof window &&
						"undefined" != typeof document
					);
				},
				forEach: u,
				merge: function e() {
					var t = {};
					function r(r, o) {
						c(t[o]) && c(r)
							? (t[o] = e(t[o], r))
							: c(r)
								? (t[o] = e({}, r))
								: s(r)
									? (t[o] = r.slice())
									: (t[o] = r);
					}
					for (var o = 0, n = arguments.length; o < n; o++)
						u(arguments[o], r);
					return t;
				},
				extend: function (e, t, r) {
					return (
						u(t, function (t, n) {
							e[n] = r && "function" == typeof t ? o(t, r) : t;
						}),
						e
					);
				},
				trim: function (e) {
					return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
				},
				stripBOM: function (e) {
					return 65279 === e.charCodeAt(0) && (e = e.slice(1)), e;
				}
			};
		},
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
							return new n(e);
						case "invalid_request_error":
							return new s(e);
						case "api_error":
							return new i(e);
						case "authentication_error":
							return new a(e);
						case "rate_limit_error":
							return new c(e);
						case "idempotency_error":
							return new p(e);
						case "invalid_grant":
							return new u(e);
						default:
							return new GenericError("Generic", "Unknown Error");
					}
				}
			}
			class n extends o {}
			class s extends o {}
			class i extends o {}
			class a extends o {}
			class c extends o {}
			class p extends o {}
			class u extends o {}
			(e.exports.generate = o.generate),
				(e.exports.StripeError = o),
				(e.exports.StripeCardError = n),
				(e.exports.StripeInvalidRequestError = s),
				(e.exports.StripeAPIError = i),
				(e.exports.StripeAuthenticationError = a),
				(e.exports.StripePermissionError = class extends o {}),
				(e.exports.StripeRateLimitError = c),
				(e.exports.StripeConnectionError = class extends o {}),
				(e.exports.StripeSignatureVerificationError = class extends (
					o
				) {}),
				(e.exports.StripeIdempotencyError = p),
				(e.exports.StripeInvalidGrantError = u);
		},
		function (e, t, r) {
			"use strict";
			class o {
				getClientName() {
					throw new Error("getClientName not implemented.");
				}
				makeRequest(e, t, r, o, n, s, i, a) {
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
				n = o.method;
			e.exports = o.extend({
				path: "",
				create: n({ method: "POST", path: "accounts" }),
				retrieve(e) {
					return "string" == typeof e
						? n({ method: "GET", path: "accounts/{id}" }).apply(
								this,
								arguments
							)
						: (null == e && [].shift.apply(arguments),
							n({ method: "GET", path: "account" }).apply(
								this,
								arguments
							));
				},
				update: n({ method: "POST", path: "accounts/{account}" }),
				list: n({
					method: "GET",
					path: "accounts",
					methodType: "list"
				}),
				del: n({ method: "DELETE", path: "accounts/{account}" }),
				reject: n({
					method: "POST",
					path: "accounts/{account}/reject"
				}),
				retrieveCapability: n({
					method: "GET",
					path: "accounts/{account}/capabilities/{capability}"
				}),
				updateCapability: n({
					method: "POST",
					path: "accounts/{account}/capabilities/{capability}"
				}),
				listCapabilities: n({
					method: "GET",
					path: "accounts/{account}/capabilities",
					methodType: "list"
				}),
				createExternalAccount: n({
					method: "POST",
					path: "accounts/{account}/external_accounts"
				}),
				retrieveExternalAccount: n({
					method: "GET",
					path: "accounts/{account}/external_accounts/{id}"
				}),
				updateExternalAccount: n({
					method: "POST",
					path: "accounts/{account}/external_accounts/{id}"
				}),
				listExternalAccounts: n({
					method: "GET",
					path: "accounts/{account}/external_accounts",
					methodType: "list"
				}),
				deleteExternalAccount: n({
					method: "DELETE",
					path: "accounts/{account}/external_accounts/{id}"
				}),
				createLoginLink: n({
					method: "POST",
					path: "accounts/{account}/login_links"
				}),
				createPerson: n({
					method: "POST",
					path: "accounts/{account}/persons"
				}),
				retrievePerson: n({
					method: "GET",
					path: "accounts/{account}/persons/{person}"
				}),
				updatePerson: n({
					method: "POST",
					path: "accounts/{account}/persons/{person}"
				}),
				listPersons: n({
					method: "GET",
					path: "accounts/{account}/persons",
					methodType: "list"
				}),
				deletePerson: n({
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
				n = Array.isArray,
				s = (function () {
					for (var e = [], t = 0; t < 256; ++t)
						e.push(
							"%" +
								(
									(t < 16 ? "0" : "") + t.toString(16)
								).toUpperCase()
						);
					return e;
				})(),
				i = function (e, t) {
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
				arrayToObject: i,
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
							var s = t[o],
								i = s.obj[s.prop],
								a = Object.keys(i),
								c = 0;
							c < a.length;
							++c
						) {
							var p = a[c],
								u = i[p];
							"object" == typeof u &&
								null !== u &&
								-1 === r.indexOf(u) &&
								(t.push({ obj: i, prop: p }), r.push(u));
						}
					return (
						(function (e) {
							for (; e.length > 1; ) {
								var t = e.pop(),
									r = t.obj[t.prop];
								if (n(r)) {
									for (var o = [], s = 0; s < r.length; ++s)
										void 0 !== r[s] && o.push(r[s]);
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
					for (var n = "", i = 0; i < o.length; ++i) {
						var a = o.charCodeAt(i);
						45 === a ||
						46 === a ||
						95 === a ||
						126 === a ||
						(a >= 48 && a <= 57) ||
						(a >= 65 && a <= 90) ||
						(a >= 97 && a <= 122)
							? (n += o.charAt(i))
							: a < 128
								? (n += s[a])
								: a < 2048
									? (n +=
											s[192 | (a >> 6)] +
											s[128 | (63 & a)])
									: a < 55296 || a >= 57344
										? (n +=
												s[224 | (a >> 12)] +
												s[128 | ((a >> 6) & 63)] +
												s[128 | (63 & a)])
										: ((i += 1),
											(a =
												65536 +
												(((1023 & a) << 10) |
													(1023 & o.charCodeAt(i)))),
											(n +=
												s[240 | (a >> 18)] +
												s[128 | ((a >> 12) & 63)] +
												s[128 | ((a >> 6) & 63)] +
												s[128 | (63 & a)]));
					}
					return n;
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
				merge: function e(t, r, s) {
					if (!r) return t;
					if ("object" != typeof r) {
						if (n(t)) t.push(r);
						else {
							if (!t || "object" != typeof t) return [t, r];
							((s && (s.plainObjects || s.allowPrototypes)) ||
								!o.call(Object.prototype, r)) &&
								(t[r] = !0);
						}
						return t;
					}
					if (!t || "object" != typeof t) return [t].concat(r);
					var a = t;
					return (
						n(t) && !n(r) && (a = i(t, s)),
						n(t) && n(r)
							? (r.forEach(function (r, n) {
									if (o.call(t, n)) {
										var i = t[n];
										i &&
										"object" == typeof i &&
										r &&
										"object" == typeof r
											? (t[n] = e(i, r, s))
											: t.push(r);
									} else t[n] = r;
								}),
								t)
							: Object.keys(r).reduce(function (t, n) {
									var i = r[n];
									return (
										o.call(t, n)
											? (t[n] = e(t[n], i, s))
											: (t[n] = i),
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
				n = /%20/g;
			e.exports = {
				default: "RFC3986",
				formatters: {
					RFC1738: function (e) {
						return o.call(e, n, "+");
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
				n = r(11),
				s = r(24).makeAutoPaginationMethods;
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
					const i = o.callbackifyPromiseWithTimeout(
						n(this, t, e, {}),
						r
					);
					if ("list" === e.methodType || "search" === e.methodType) {
						const r = s(this, t, e, i);
						Object.assign(i, r);
					}
					return i;
				};
			};
		},
		function (e, t, r) {
			"use strict";
			const o = r(1);
			e.exports = function (e, t, r, n) {
				return new Promise((s, i) => {
					let a;
					try {
						a = (function (e, t, r, n) {
							const s = (r.method || "GET").toUpperCase(),
								i = r.urlParams || [],
								a = r.encode || (e => e),
								c = !!r.fullPath,
								p = o.makeURLInterpolator(
									c ? r.fullPath : r.path || ""
								),
								u = c
									? r.fullPath
									: e.createResourcePathWithSymbols(r.path),
								h = [].slice.call(t),
								d = i.reduce((e, t) => {
									const r = h.shift();
									if ("string" != typeof r)
										throw new Error(
											`Stripe: Argument "${t}" must be a string, but got: ${r} (on API request to \`${s} ${u}\`)`
										);
									return (e[t] = r), e;
								}, {}),
								l = o.getDataFromArgs(h),
								m = a(Object.assign({}, l, n)),
								f = o.getOptionsFromArgs(h),
								g = f.host || r.host,
								y = !!r.streaming;
							if (h.filter(e => null != e).length)
								throw new Error(
									`Stripe: Unknown arguments (${h}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options. (on API request to ${s} \`${u}\`)`
								);
							const T = c ? p(d) : e.createFullPath(p, d),
								E = Object.assign(f.headers, r.headers);
							r.validator && r.validator(m, { headers: E });
							const v =
								"GET" === r.method || "DELETE" === r.method;
							return {
								requestMethod: s,
								requestPath: T,
								bodyData: v ? {} : m,
								queryData: v ? m : {},
								auth: f.auth,
								headers: E,
								host: g,
								streaming: y,
								settings: f.settings
							};
						})(e, t, r, n);
					} catch (e) {
						return void i(e);
					}
					const c = 0 === Object.keys(a.queryData).length,
						p = [
							a.requestPath,
							c ? "" : "?",
							o.stringifyRequestData(a.queryData)
						].join(""),
						{ headers: u, settings: h } = a;
					e._request(
						a.requestMethod,
						a.host,
						p,
						a.bodyData,
						a.auth,
						{ headers: u, settings: h, streaming: a.streaming },
						function (e, t) {
							e
								? i(e)
								: s(
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
				{ StripeError: n, StripeSignatureVerificationError: s } = r(3),
				i = {
					DEFAULT_TOLERANCE: 300,
					constructEvent(e, t, r, o, n) {
						this.signature.verifyHeader(
							e,
							t,
							r,
							o || i.DEFAULT_TOLERANCE,
							n
						);
						return JSON.parse(e);
					},
					generateTestHeaderString: function (e) {
						if (!e)
							throw new n({ message: "Options are required" });
						(e.timestamp =
							Math.floor(e.timestamp) ||
							Math.floor(Date.now() / 1e3)),
							(e.scheme = e.scheme || a.EXPECTED_SCHEME),
							(e.cryptoProvider = e.cryptoProvider || p()),
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
					verifyHeader(e, t, r, n, i) {
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
							throw new s({
								message:
									"Unable to extract timestamp and signatures from header",
								detail: { header: t, payload: e }
							});
						if (!a.signatures.length)
							throw new s({
								message:
									"No signatures found with expected scheme",
								detail: { header: t, payload: e }
							});
						const c = (i = i || p()).computeHMACSignature(
							`${a.timestamp}.${e}`,
							r
						);
						if (
							!!!a.signatures.filter(o.secureCompare.bind(o, c))
								.length
						)
							throw new s({
								message:
									"No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? https://github.com/stripe/stripe-node#webhook-signing",
								detail: { header: t, payload: e }
							});
						const u = Math.floor(Date.now() / 1e3) - a.timestamp;
						if (n > 0 && u > n)
							throw new s({
								message: "Timestamp outside the tolerance zone",
								detail: { header: t, payload: e }
							});
						return !0;
					}
				};
			let c = null;
			function p() {
				if (!c) {
					const e = r(93);
					c = new e();
				}
				return c;
			}
			(i.signature = a), (e.exports = i);
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
			const n = r(1),
				{ determineProcessUserAgentProperties: s, emitWarning: i } = n;
			(l.USER_AGENT = {
				bindings_version: l.PACKAGE_VERSION,
				lang: "node",
				publisher: "stripe",
				uname: null,
				typescript: !1,
				...s()
			}),
				(l._UNAME_CACHE = null);
			const a = ["name", "version", "url", "partner_id"],
				c = [
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
				p = r(6).EventEmitter;
			(l.StripeResource = r(0)), (l.resources = o);
			const { HttpClient: u, HttpClientResponse: h } = r(4);
			(l.HttpClient = u), (l.HttpClientResponse = h);
			const d = r(12);
			function l(e, t = {}) {
				if (!(this instanceof l)) return new l(e, t);
				const o = this._getPropsFromConfig(t);
				if (
					(Object.defineProperty(this, "_emitter", {
						value: new p(),
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
				const s = o.httpAgent || null;
				this._api = {
					auth: null,
					host: o.host || "api.stripe.com",
					port: o.port || "443",
					protocol: o.protocol || "https",
					basePath: "/v1/",
					version: o.apiVersion || null,
					timeout: n.validateInteger("timeout", o.timeout, 8e4),
					maxNetworkRetries: n.validateInteger(
						"maxNetworkRetries",
						o.maxNetworkRetries,
						0
					),
					agent: s,
					httpClient: o.httpClient || l.createNodeHttpClient(s),
					dev: !1,
					stripeAccount: o.stripeAccount || null
				};
				const i = o.typescript || !1;
				i !== l.USER_AGENT.typescript && (l.USER_AGENT.typescript = i),
					o.appInfo && this._setAppInfo(o.appInfo),
					this._prepResources(),
					this._setApiKey(e),
					(this.errors = r(3)),
					(this.webhooks = r(13)),
					(this._prevRequestMetrics = []),
					(this._enableTelemetry = !1 !== o.telemetry),
					(this.StripeResource = l.StripeResource);
			}
			(l.CryptoProvider = d),
				(l.errors = r(3)),
				(l.webhooks = r(13)),
				(l.createNodeHttpClient = e => {
					const { NodeHttpClient: t } = r(94);
					return new t(e);
				}),
				(l.prototype = {
					setHost(e, t, r) {
						i(
							"`setHost` is deprecated. Use the `host` config option instead."
						),
							this._setApiField("host", e),
							t && this.setPort(t),
							r && this.setProtocol(r);
					},
					setProtocol(e) {
						i(
							"`setProtocol` is deprecated. Use the `protocol` config option instead."
						),
							this._setApiField("protocol", e.toLowerCase());
					},
					setPort(e) {
						i(
							"`setPort` is deprecated. Use the `port` config option instead."
						),
							this._setApiField("port", e);
					},
					setApiVersion(e) {
						i(
							"`setApiVersion` is deprecated. Use the `apiVersion` config or request option instead."
						),
							e && this._setApiField("version", e);
					},
					setApiKey(e) {
						i(
							"`setApiKey` is deprecated. Use the `apiKey` request option instead."
						),
							this._setApiKey(e);
					},
					_setApiKey(e) {
						e && this._setApiField("auth", "Bearer " + e);
					},
					setTimeout(e) {
						i(
							"`setTimeout` is deprecated. Use the `timeout` config or request option instead."
						),
							this._setApiField("timeout", null == e ? 8e4 : e);
					},
					setAppInfo(e) {
						i(
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
						i(
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
						const o = n.validateInteger(e, t, r);
						this._setApiField(e, o);
					},
					getMaxNetworkRetryDelay: () => 2,
					getInitialNetworkRetryDelay: () => 0.5,
					getUname(e) {
						l._UNAME_CACHE ||
							(l._UNAME_CACHE = new Promise(e => {
								n.safeExec("uname -a", (t, r) => {
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
							const n = this.getApiField("httpClient");
							n &&
								(o.httplib = encodeURIComponent(
									n.getClientName()
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
						i(
							"`setTelemetryEnabled` is deprecated. Use the `telemetry` config option instead."
						),
							(this._enableTelemetry = e);
					},
					getTelemetryEnabled() {
						return this._enableTelemetry;
					},
					_prepResources() {
						for (const e in o)
							this[n.pascalToCamelCase(e)] = new o[e](this);
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
							Object.keys(e).filter(e => !c.includes(e)).length >
							0
						)
							throw new Error(
								"Config object may only contain the following: " +
									c.join(", ")
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
						n = new t[r](e);
					this[o] = n;
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
				n = r(22),
				s = r(8);
			e.exports = { formats: s, parse: n, stringify: o };
		},
		function (e, t, r) {
			"use strict";
			var o = r(7),
				n = r(8),
				s = Object.prototype.hasOwnProperty,
				i = {
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
				c = Array.prototype.push,
				p = function (e, t) {
					c.apply(e, a(t) ? t : [t]);
				},
				u = Date.prototype.toISOString,
				h = {
					addQueryPrefix: !1,
					allowDots: !1,
					charset: "utf-8",
					charsetSentinel: !1,
					delimiter: "&",
					encode: !0,
					encoder: o.encode,
					encodeValuesOnly: !1,
					formatter: n.formatters[n.default],
					indices: !1,
					serializeDate: function (e) {
						return u.call(e);
					},
					skipNulls: !1,
					strictNullHandling: !1
				},
				d = function e(t, r, n, s, i, c, u, d, l, m, f, g, y) {
					var T = t;
					if (
						("function" == typeof u
							? (T = u(r, T))
							: T instanceof Date
								? (T = m(T))
								: "comma" === n && a(T) && (T = T.join(",")),
						null === T)
					) {
						if (s) return c && !g ? c(r, h.encoder, y) : r;
						T = "";
					}
					if (
						"string" == typeof T ||
						"number" == typeof T ||
						"boolean" == typeof T ||
						o.isBuffer(T)
					)
						return c
							? [
									f(g ? r : c(r, h.encoder, y)) +
										"=" +
										f(c(T, h.encoder, y))
								]
							: [f(r) + "=" + f(String(T))];
					var E,
						v = [];
					if (void 0 === T) return v;
					if (a(u)) E = u;
					else {
						var x = Object.keys(T);
						E = d ? x.sort(d) : x;
					}
					for (var _ = 0; _ < E.length; ++_) {
						var b = E[_];
						(i && null === T[b]) ||
							(a(T)
								? p(
										v,
										e(
											T[b],
											"function" == typeof n
												? n(r, b)
												: r,
											n,
											s,
											i,
											c,
											u,
											d,
											l,
											m,
											f,
											g,
											y
										)
									)
								: p(
										v,
										e(
											T[b],
											r + (l ? "." + b : "[" + b + "]"),
											n,
											s,
											i,
											c,
											u,
											d,
											l,
											m,
											f,
											g,
											y
										)
									));
					}
					return v;
				};
			e.exports = function (e, t) {
				var r,
					o = e,
					c = (function (e) {
						if (!e) return h;
						if (
							null !== e.encoder &&
							void 0 !== e.encoder &&
							"function" != typeof e.encoder
						)
							throw new TypeError(
								"Encoder has to be a function."
							);
						var t = e.charset || h.charset;
						if (
							void 0 !== e.charset &&
							"utf-8" !== e.charset &&
							"iso-8859-1" !== e.charset
						)
							throw new TypeError(
								"The charset option must be either utf-8, iso-8859-1, or undefined"
							);
						var r = n.default;
						if (void 0 !== e.format) {
							if (!s.call(n.formatters, e.format))
								throw new TypeError(
									"Unknown format option provided."
								);
							r = e.format;
						}
						var o = n.formatters[r],
							i = h.filter;
						return (
							("function" == typeof e.filter || a(e.filter)) &&
								(i = e.filter),
							{
								addQueryPrefix:
									"boolean" == typeof e.addQueryPrefix
										? e.addQueryPrefix
										: h.addQueryPrefix,
								allowDots:
									void 0 === e.allowDots
										? h.allowDots
										: !!e.allowDots,
								charset: t,
								charsetSentinel:
									"boolean" == typeof e.charsetSentinel
										? e.charsetSentinel
										: h.charsetSentinel,
								delimiter:
									void 0 === e.delimiter
										? h.delimiter
										: e.delimiter,
								encode:
									"boolean" == typeof e.encode
										? e.encode
										: h.encode,
								encoder:
									"function" == typeof e.encoder
										? e.encoder
										: h.encoder,
								encodeValuesOnly:
									"boolean" == typeof e.encodeValuesOnly
										? e.encodeValuesOnly
										: h.encodeValuesOnly,
								filter: i,
								formatter: o,
								serializeDate:
									"function" == typeof e.serializeDate
										? e.serializeDate
										: h.serializeDate,
								skipNulls:
									"boolean" == typeof e.skipNulls
										? e.skipNulls
										: h.skipNulls,
								sort:
									"function" == typeof e.sort ? e.sort : null,
								strictNullHandling:
									"boolean" == typeof e.strictNullHandling
										? e.strictNullHandling
										: h.strictNullHandling
							}
						);
					})(t);
				"function" == typeof c.filter
					? (o = (0, c.filter)("", o))
					: a(c.filter) && (r = c.filter);
				var u,
					l = [];
				if ("object" != typeof o || null === o) return "";
				u =
					t && t.arrayFormat in i
						? t.arrayFormat
						: t && "indices" in t
							? t.indices
								? "indices"
								: "repeat"
							: "indices";
				var m = i[u];
				r || (r = Object.keys(o)), c.sort && r.sort(c.sort);
				for (var f = 0; f < r.length; ++f) {
					var g = r[f];
					(c.skipNulls && null === o[g]) ||
						p(
							l,
							d(
								o[g],
								g,
								m,
								c.strictNullHandling,
								c.skipNulls,
								c.encode ? c.encoder : null,
								c.filter,
								c.sort,
								c.allowDots,
								c.serializeDate,
								c.formatter,
								c.encodeValuesOnly,
								c.charset
							)
						);
				}
				var y = l.join(c.delimiter),
					T = !0 === c.addQueryPrefix ? "?" : "";
				return (
					c.charsetSentinel &&
						("iso-8859-1" === c.charset
							? (T += "utf8=%26%2310003%3B&")
							: (T += "utf8=%E2%9C%93&")),
					y.length > 0 ? T + y : ""
				);
			};
		},
		function (e, t, r) {
			"use strict";
			var o = r(7),
				n = Object.prototype.hasOwnProperty,
				s = {
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
				i = function (e) {
					return e.replace(/&#(\d+);/g, function (e, t) {
						return String.fromCharCode(parseInt(t, 10));
					});
				},
				a = function (e, t, r) {
					if (e) {
						var o = r.allowDots
								? e.replace(/\.([^.[]+)/g, "[$1]")
								: e,
							s = /(\[[^[\]]*])/g,
							i = /(\[[^[\]]*])/.exec(o),
							a = i ? o.slice(0, i.index) : o,
							c = [];
						if (a) {
							if (
								!r.plainObjects &&
								n.call(Object.prototype, a) &&
								!r.allowPrototypes
							)
								return;
							c.push(a);
						}
						for (
							var p = 0;
							null !== (i = s.exec(o)) && p < r.depth;

						) {
							if (
								((p += 1),
								!r.plainObjects &&
									n.call(
										Object.prototype,
										i[1].slice(1, -1)
									) &&
									!r.allowPrototypes)
							)
								return;
							c.push(i[1]);
						}
						return (
							i && c.push("[" + o.slice(i.index) + "]"),
							(function (e, t, r) {
								for (var o = t, n = e.length - 1; n >= 0; --n) {
									var s,
										i = e[n];
									if ("[]" === i && r.parseArrays)
										s = [].concat(o);
									else {
										s = r.plainObjects
											? Object.create(null)
											: {};
										var a =
												"[" === i.charAt(0) &&
												"]" === i.charAt(i.length - 1)
													? i.slice(1, -1)
													: i,
											c = parseInt(a, 10);
										r.parseArrays || "" !== a
											? !isNaN(c) &&
												i !== a &&
												String(c) === a &&
												c >= 0 &&
												r.parseArrays &&
												c <= r.arrayLimit
												? ((s = [])[c] = o)
												: (s[a] = o)
											: (s = { 0: o });
									}
									o = s;
								}
								return o;
							})(c, t, r)
						);
					}
				};
			e.exports = function (e, t) {
				var r = (function (e) {
					if (!e) return s;
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
					var t = void 0 === e.charset ? s.charset : e.charset;
					return {
						allowDots:
							void 0 === e.allowDots
								? s.allowDots
								: !!e.allowDots,
						allowPrototypes:
							"boolean" == typeof e.allowPrototypes
								? e.allowPrototypes
								: s.allowPrototypes,
						arrayLimit:
							"number" == typeof e.arrayLimit
								? e.arrayLimit
								: s.arrayLimit,
						charset: t,
						charsetSentinel:
							"boolean" == typeof e.charsetSentinel
								? e.charsetSentinel
								: s.charsetSentinel,
						comma: "boolean" == typeof e.comma ? e.comma : s.comma,
						decoder:
							"function" == typeof e.decoder
								? e.decoder
								: s.decoder,
						delimiter:
							"string" == typeof e.delimiter ||
							o.isRegExp(e.delimiter)
								? e.delimiter
								: s.delimiter,
						depth: "number" == typeof e.depth ? e.depth : s.depth,
						ignoreQueryPrefix: !0 === e.ignoreQueryPrefix,
						interpretNumericEntities:
							"boolean" == typeof e.interpretNumericEntities
								? e.interpretNumericEntities
								: s.interpretNumericEntities,
						parameterLimit:
							"number" == typeof e.parameterLimit
								? e.parameterLimit
								: s.parameterLimit,
						parseArrays: !1 !== e.parseArrays,
						plainObjects:
							"boolean" == typeof e.plainObjects
								? e.plainObjects
								: s.plainObjects,
						strictNullHandling:
							"boolean" == typeof e.strictNullHandling
								? e.strictNullHandling
								: s.strictNullHandling
					};
				})(t);
				if ("" === e || null == e)
					return r.plainObjects ? Object.create(null) : {};
				for (
					var c =
							"string" == typeof e
								? (function (e, t) {
										var r,
											a = {},
											c = t.ignoreQueryPrefix
												? e.replace(/^\?/, "")
												: e,
											p =
												t.parameterLimit === 1 / 0
													? void 0
													: t.parameterLimit,
											u = c.split(t.delimiter, p),
											h = -1,
											d = t.charset;
										if (t.charsetSentinel)
											for (r = 0; r < u.length; ++r)
												0 === u[r].indexOf("utf8=") &&
													("utf8=%E2%9C%93" === u[r]
														? (d = "utf-8")
														: "utf8=%26%2310003%3B" ===
																u[r] &&
															(d = "iso-8859-1"),
													(h = r),
													(r = u.length));
										for (r = 0; r < u.length; ++r)
											if (r !== h) {
												var l,
													m,
													f = u[r],
													g = f.indexOf("]="),
													y =
														-1 === g
															? f.indexOf("=")
															: g + 1;
												-1 === y
													? ((l = t.decoder(
															f,
															s.decoder,
															d
														)),
														(m =
															t.strictNullHandling
																? null
																: ""))
													: ((l = t.decoder(
															f.slice(0, y),
															s.decoder,
															d
														)),
														(m = t.decoder(
															f.slice(y + 1),
															s.decoder,
															d
														))),
													m &&
														t.interpretNumericEntities &&
														"iso-8859-1" === d &&
														(m = i(m)),
													m &&
														t.comma &&
														m.indexOf(",") > -1 &&
														(m = m.split(",")),
													n.call(a, l)
														? (a[l] = o.combine(
																a[l],
																m
															))
														: (a[l] = m);
											}
										return a;
									})(e, r)
								: e,
						p = r.plainObjects ? Object.create(null) : {},
						u = Object.keys(c),
						h = 0;
					h < u.length;
					++h
				) {
					var d = u[h],
						l = a(d, c[d], r);
					p = o.merge(p, l, r);
				}
				return o.compact(p);
			};
		},
		function (e, t) {
			e.exports = require("child_process");
		},
		function (e, t, r) {
			"use strict";
			const o = r(11),
				n = r(1);
			function s() {
				return "undefined" != typeof Symbol && Symbol.asyncIterator
					? Symbol.asyncIterator
					: "@@asyncIterator";
			}
			function i(e) {
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
			function c(e, t) {
				return new Promise((r, o) => {
					e()
						.then(function o(n) {
							if (n.done) return void r();
							const s = n.value;
							return new Promise(e => {
								t(s, e);
							}).then(t =>
								!1 === t ? o({ done: !0 }) : e().then(o)
							);
						})
						.catch(o);
				});
			}
			e.exports.makeAutoPaginationMethods = function (e, t, r, p) {
				const u = { currentPromise: null },
					h = (function (e) {
						const t = [].slice.call(e);
						return !!n.getDataFromArgs(t).ending_before;
					})(t);
				let d,
					l = p,
					m = 0;
				function f(e) {
					if (!e || !e.data || "number" != typeof e.data.length)
						throw Error(
							"Unexpected: Stripe API response does not have a well-formed `data` array."
						);
					if (m < e.data.length) {
						const t = h ? e.data.length - 1 - m : m,
							r = e.data[t];
						return (m += 1), { value: r, done: !1 };
					}
					return e.has_more
						? ((m = 0), (l = d(e)), l.then(f))
						: { value: void 0, done: !0 };
				}
				function g() {
					return (function (e, t) {
						if (e.currentPromise) return e.currentPromise;
						return (
							(e.currentPromise = new Promise(t).then(
								t => ((e.currentPromise = void 0), t)
							)),
							e.currentPromise
						);
					})(u, (e, t) => l.then(f).then(e).catch(t));
				}
				d =
					"search" === r.methodType
						? n => {
								if (!n.next_page)
									throw Error(
										"Unexpected: Stripe API response does not have a well-formed `next_page` field, but `has_more` was true."
									);
								return o(e, t, r, { next_page: n.next_page });
							}
						: n => {
								const s = (function (e, t) {
									const r = t ? 0 : e.data.length - 1,
										o = e.data[r],
										n = o && o.id;
									if (!n)
										throw Error(
											"Unexpected: No `id` found on the last item while auto-paging a list."
										);
									return n;
								})(n, h);
								return o(e, t, r, {
									[h ? "ending_before" : "starting_after"]: s
								});
							};
				const y = (function (e) {
						return function () {
							const t = [].slice.call(arguments),
								r = a(t),
								o = i(t);
							if (t.length > 2)
								throw Error(
									"autoPagingEach takes up to two arguments; received " +
										t
								);
							const s = c(e, r);
							return n.callbackifyPromiseWithTimeout(s, o);
						};
					})(g),
					T = (function (e) {
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
							const s = new Promise((t, r) => {
								const n = [];
								e(e => {
									if ((n.push(e), n.length >= o)) return !1;
								})
									.then(() => {
										t(n);
									})
									.catch(r);
							});
							return n.callbackifyPromiseWithTimeout(s, r);
						};
					})(y),
					E = {
						autoPagingEach: y,
						autoPagingToArray: T,
						next: g,
						return: () => ({}),
						[s()]: () => E
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
				n = o.method;
			e.exports = o.extend({
				path: "account_links",
				create: n({ method: "POST", path: "" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "apple_pay/domains",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{domain}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				del: n({ method: "DELETE", path: "/{domain}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "application_fees",
				retrieve: n({ method: "GET", path: "/{id}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				createRefund: n({ method: "POST", path: "/{id}/refunds" }),
				retrieveRefund: n({
					method: "GET",
					path: "/{fee}/refunds/{id}"
				}),
				updateRefund: n({
					method: "POST",
					path: "/{fee}/refunds/{id}"
				}),
				listRefunds: n({
					method: "GET",
					path: "/{id}/refunds",
					methodType: "list"
				})
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "balance",
				retrieve: n({ method: "GET", path: "" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "balance_transactions",
				retrieve: n({ method: "GET", path: "/{id}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "charges",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{charge}" }),
				update: n({ method: "POST", path: "/{charge}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				capture: n({ method: "POST", path: "/{charge}/capture" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "country_specs",
				retrieve: n({ method: "GET", path: "/{country}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "coupons",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{coupon}" }),
				update: n({ method: "POST", path: "/{coupon}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				del: n({ method: "DELETE", path: "/{coupon}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "credit_notes",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{id}" }),
				update: n({ method: "POST", path: "/{id}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				preview: n({ method: "GET", path: "/preview" }),
				voidCreditNote: n({ method: "POST", path: "/{id}/void" }),
				listLineItems: n({
					method: "GET",
					path: "/{creditNote}/lines",
					methodType: "list"
				}),
				listPreviewLineItems: n({
					method: "GET",
					path: "/preview/lines",
					methodType: "list"
				})
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "customers",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{customer}" }),
				update: n({ method: "POST", path: "/{customer}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				del: n({ method: "DELETE", path: "/{customer}" }),
				deleteDiscount: n({
					method: "DELETE",
					path: "/{customer}/discount"
				}),
				listPaymentMethods: n({
					method: "GET",
					path: "/{customer}/payment_methods",
					methodType: "list"
				}),
				createBalanceTransaction: n({
					method: "POST",
					path: "/{customer}/balance_transactions"
				}),
				retrieveBalanceTransaction: n({
					method: "GET",
					path: "/{customer}/balance_transactions/{transaction}"
				}),
				updateBalanceTransaction: n({
					method: "POST",
					path: "/{customer}/balance_transactions/{transaction}"
				}),
				listBalanceTransactions: n({
					method: "GET",
					path: "/{customer}/balance_transactions",
					methodType: "list"
				}),
				createSource: n({
					method: "POST",
					path: "/{customer}/sources"
				}),
				retrieveSource: n({
					method: "GET",
					path: "/{customer}/sources/{id}"
				}),
				updateSource: n({
					method: "POST",
					path: "/{customer}/sources/{id}"
				}),
				listSources: n({
					method: "GET",
					path: "/{customer}/sources",
					methodType: "list"
				}),
				deleteSource: n({
					method: "DELETE",
					path: "/{customer}/sources/{id}"
				}),
				verifySource: n({
					method: "POST",
					path: "/{customer}/sources/{id}/verify"
				}),
				createTaxId: n({ method: "POST", path: "/{customer}/tax_ids" }),
				retrieveTaxId: n({
					method: "GET",
					path: "/{customer}/tax_ids/{id}"
				}),
				listTaxIds: n({
					method: "GET",
					path: "/{customer}/tax_ids",
					methodType: "list"
				}),
				deleteTaxId: n({
					method: "DELETE",
					path: "/{customer}/tax_ids/{id}"
				})
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "disputes",
				retrieve: n({ method: "GET", path: "/{dispute}" }),
				update: n({ method: "POST", path: "/{dispute}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				close: n({ method: "POST", path: "/{dispute}/close" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "ephemeral_keys",
				create: n({
					method: "POST",
					path: "",
					validator: (e, t) => {
						if (!t.headers || !t.headers["Stripe-Version"])
							throw new Error(
								"Passing apiVersion in a separate options hash is required to create an ephemeral key. See https://stripe.com/docs/api/versioning?lang=node"
							);
					}
				}),
				del: n({ method: "DELETE", path: "/{key}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "events",
				retrieve: n({ method: "GET", path: "/{id}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "exchange_rates",
				retrieve: n({ method: "GET", path: "/{rateId}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const { multipartRequestDataProcessor: o } = r(41),
				n = r(0),
				s = n.method;
			e.exports = n.extend({
				path: "files",
				create: s({
					method: "POST",
					headers: { "Content-Type": "multipart/form-data" },
					host: "files.stripe.com"
				}),
				retrieve: s({ method: "GET", path: "/{file}" }),
				list: s({ method: "GET", path: "", methodType: "list" }),
				requestDataProcessor: o
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(1),
				{ StripeError: n } = r(3);
			class s extends n {}
			const i = (e, t, r) => {
				const n = (
					Math.round(1e16 * Math.random()) +
					Math.round(1e16 * Math.random())
				).toString();
				r["Content-Type"] = "multipart/form-data; boundary=" + n;
				let s = Buffer.alloc(0);
				function i(e) {
					const t = s,
						r = e instanceof Buffer ? e : Buffer.from(e);
					(s = Buffer.alloc(t.length + r.length + 2)),
						t.copy(s),
						r.copy(s, t.length),
						s.write("\r\n", s.length - 2);
				}
				function a(e) {
					return `"${e.replace(/"|"/g, "%22").replace(/\r\n|\r|\n/g, " ")}"`;
				}
				const c = o.flattenAndStringify(t);
				for (const e in c) {
					const t = c[e];
					i("--" + n),
						t.hasOwnProperty("data")
							? (i(
									`Content-Disposition: form-data; name=${a(e)}; filename=${a(t.name || "blob")}`
								),
								i(
									"Content-Type: " +
										(t.type || "application/octet-stream")
								),
								i(""),
								i(t.data))
							: (i(
									"Content-Disposition: form-data; name=" +
										a(e)
								),
								i(""),
								i(t));
				}
				return i(`--${n}--`), s;
			};
			e.exports.multipartRequestDataProcessor = (e, t, r, n) => {
				if (((t = t || {}), "POST" !== e))
					return n(null, o.stringifyRequestData(t));
				if (o.checkForStream(t))
					return ((e, t, r, o) => {
						const n = [];
						t.file.data
							.on("data", e => {
								n.push(e);
							})
							.once("end", () => {
								const e = Object.assign({}, t);
								e.file.data = Buffer.concat(n);
								const s = i(0, e, r);
								o(null, s);
							})
							.on("error", e => {
								o(
									new s({
										message:
											"An error occurred while attempting to process the file for upload.",
										detail: e
									}),
									null
								);
							});
					})(0, t, r, n);
				return n(null, i(0, t, r));
			};
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "file_links",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{link}" }),
				update: n({ method: "POST", path: "/{link}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "invoices",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{invoice}" }),
				update: n({ method: "POST", path: "/{invoice}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				del: n({ method: "DELETE", path: "/{invoice}" }),
				finalizeInvoice: n({
					method: "POST",
					path: "/{invoice}/finalize"
				}),
				markUncollectible: n({
					method: "POST",
					path: "/{invoice}/mark_uncollectible"
				}),
				pay: n({ method: "POST", path: "/{invoice}/pay" }),
				retrieveUpcoming: n({ method: "GET", path: "/upcoming" }),
				sendInvoice: n({ method: "POST", path: "/{invoice}/send" }),
				voidInvoice: n({ method: "POST", path: "/{invoice}/void" }),
				listLineItems: n({
					method: "GET",
					path: "/{invoice}/lines",
					methodType: "list"
				}),
				listUpcomingLineItems: n({
					method: "GET",
					path: "/upcoming/lines",
					methodType: "list"
				})
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "invoiceitems",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{invoiceitem}" }),
				update: n({ method: "POST", path: "/{invoiceitem}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				del: n({ method: "DELETE", path: "/{invoiceitem}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "issuer_fraud_records",
				retrieve: n({ method: "GET", path: "/{issuerFraudRecord}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "mandates",
				retrieve: n({ method: "GET", path: "/{mandate}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method,
				s = r(1),
				i = "connect.stripe.com";
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
						`https://${i}/${r}?${s.stringifyRequestData(e)}`
					);
				},
				token: n({ method: "POST", path: "oauth/token", host: i }),
				deauthorize(e) {
					return (
						e.client_id ||
							(e.client_id = this._stripe.getClientId()),
						n({
							method: "POST",
							path: "oauth/deauthorize",
							host: i
						}).apply(this, arguments)
					);
				}
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "orders",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{id}" }),
				update: n({ method: "POST", path: "/{id}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				pay: n({ method: "POST", path: "/{id}/pay" }),
				returnOrder: n({ method: "POST", path: "/{id}/returns" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "order_returns",
				retrieve: n({ method: "GET", path: "/{id}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "payment_intents",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{intent}" }),
				update: n({ method: "POST", path: "/{intent}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				cancel: n({ method: "POST", path: "/{intent}/cancel" }),
				capture: n({ method: "POST", path: "/{intent}/capture" }),
				confirm: n({ method: "POST", path: "/{intent}/confirm" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "payment_methods",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{paymentMethod}" }),
				update: n({ method: "POST", path: "/{paymentMethod}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				attach: n({ method: "POST", path: "/{paymentMethod}/attach" }),
				detach: n({ method: "POST", path: "/{paymentMethod}/detach" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "payouts",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{payout}" }),
				update: n({ method: "POST", path: "/{payout}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				cancel: n({ method: "POST", path: "/{payout}/cancel" }),
				reverse: n({ method: "POST", path: "/{payout}/reverse" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "plans",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{plan}" }),
				update: n({ method: "POST", path: "/{plan}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				del: n({ method: "DELETE", path: "/{plan}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "prices",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{price}" }),
				update: n({ method: "POST", path: "/{price}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "products",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{id}" }),
				update: n({ method: "POST", path: "/{id}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				del: n({ method: "DELETE", path: "/{id}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "promotion_codes",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{promotionCode}" }),
				update: n({ method: "POST", path: "/{promotionCode}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "quotes",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{quote}" }),
				update: n({ method: "POST", path: "/{quote}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				accept: n({ method: "POST", path: "/{quote}/accept" }),
				cancel: n({ method: "POST", path: "/{quote}/cancel" }),
				finalizeQuote: n({ method: "POST", path: "/{quote}/finalize" }),
				listComputedUpfrontLineItems: n({
					method: "GET",
					path: "/{quote}/computed_upfront_line_items",
					methodType: "list"
				}),
				listLineItems: n({
					method: "GET",
					path: "/{quote}/line_items",
					methodType: "list"
				}),
				pdf: n({
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
				n = o.method;
			e.exports = o.extend({
				path: "refunds",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{refund}" }),
				update: n({ method: "POST", path: "/{refund}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "reviews",
				retrieve: n({ method: "GET", path: "/{review}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				approve: n({ method: "POST", path: "/{review}/approve" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "setup_attempts",
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "setup_intents",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{intent}" }),
				update: n({ method: "POST", path: "/{intent}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				cancel: n({ method: "POST", path: "/{intent}/cancel" }),
				confirm: n({ method: "POST", path: "/{intent}/confirm" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "skus",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{id}" }),
				update: n({ method: "POST", path: "/{id}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				del: n({ method: "DELETE", path: "/{id}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "sources",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{source}" }),
				update: n({ method: "POST", path: "/{source}" }),
				listSourceTransactions: n({
					method: "GET",
					path: "/{source}/source_transactions",
					methodType: "list"
				}),
				verify: n({ method: "POST", path: "/{source}/verify" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "subscriptions",
				create: n({ method: "POST", path: "" }),
				retrieve: n({
					method: "GET",
					path: "/{subscriptionExposedId}"
				}),
				update: n({ method: "POST", path: "/{subscriptionExposedId}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				del: n({ method: "DELETE", path: "/{subscriptionExposedId}" }),
				deleteDiscount: n({
					method: "DELETE",
					path: "/{subscriptionExposedId}/discount"
				})
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "subscription_items",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{item}" }),
				update: n({ method: "POST", path: "/{item}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				del: n({ method: "DELETE", path: "/{item}" }),
				createUsageRecord: n({
					method: "POST",
					path: "/{subscriptionItem}/usage_records"
				}),
				listUsageRecordSummaries: n({
					method: "GET",
					path: "/{subscriptionItem}/usage_record_summaries",
					methodType: "list"
				})
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "subscription_schedules",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{schedule}" }),
				update: n({ method: "POST", path: "/{schedule}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				cancel: n({ method: "POST", path: "/{schedule}/cancel" }),
				release: n({ method: "POST", path: "/{schedule}/release" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "tax_codes",
				retrieve: n({ method: "GET", path: "/{id}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "tax_rates",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{taxRate}" }),
				update: n({ method: "POST", path: "/{taxRate}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "tokens",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{token}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "topups",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{topup}" }),
				update: n({ method: "POST", path: "/{topup}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				cancel: n({ method: "POST", path: "/{topup}/cancel" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "transfers",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{transfer}" }),
				update: n({ method: "POST", path: "/{transfer}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				createReversal: n({ method: "POST", path: "/{id}/reversals" }),
				retrieveReversal: n({
					method: "GET",
					path: "/{transfer}/reversals/{id}"
				}),
				updateReversal: n({
					method: "POST",
					path: "/{transfer}/reversals/{id}"
				}),
				listReversals: n({
					method: "GET",
					path: "/{id}/reversals",
					methodType: "list"
				})
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "webhook_endpoints",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{webhookEndpoint}" }),
				update: n({ method: "POST", path: "/{webhookEndpoint}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				del: n({ method: "DELETE", path: "/{webhookEndpoint}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "billing_portal/configurations",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{configuration}" }),
				update: n({ method: "POST", path: "/{configuration}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "billing_portal/sessions",
				create: n({ method: "POST", path: "" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "checkout/sessions",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{session}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				listLineItems: n({
					method: "GET",
					path: "/{session}/line_items",
					methodType: "list"
				})
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "identity/verification_reports",
				retrieve: n({ method: "GET", path: "/{report}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "identity/verification_sessions",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{session}" }),
				update: n({ method: "POST", path: "/{session}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				cancel: n({ method: "POST", path: "/{session}/cancel" }),
				redact: n({ method: "POST", path: "/{session}/redact" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "issuing/authorizations",
				retrieve: n({ method: "GET", path: "/{authorization}" }),
				update: n({ method: "POST", path: "/{authorization}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				approve: n({
					method: "POST",
					path: "/{authorization}/approve"
				}),
				decline: n({ method: "POST", path: "/{authorization}/decline" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "issuing/cards",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{card}" }),
				update: n({ method: "POST", path: "/{card}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				retrieveDetails: n({ method: "GET", path: "/{card}/details" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "issuing/cardholders",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{cardholder}" }),
				update: n({ method: "POST", path: "/{cardholder}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "issuing/disputes",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{dispute}" }),
				update: n({ method: "POST", path: "/{dispute}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				submit: n({ method: "POST", path: "/{dispute}/submit" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "issuing/transactions",
				retrieve: n({ method: "GET", path: "/{transaction}" }),
				update: n({ method: "POST", path: "/{transaction}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "radar/early_fraud_warnings",
				retrieve: n({ method: "GET", path: "/{earlyFraudWarning}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "radar/value_lists",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{valueList}" }),
				update: n({ method: "POST", path: "/{valueList}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				del: n({ method: "DELETE", path: "/{valueList}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "radar/value_list_items",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{item}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				del: n({ method: "DELETE", path: "/{item}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "reporting/report_runs",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{reportRun}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "reporting/report_types",
				retrieve: n({ method: "GET", path: "/{reportType}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "sigma/scheduled_query_runs",
				retrieve: n({ method: "GET", path: "/{scheduledQueryRun}" }),
				list: n({ method: "GET", path: "", methodType: "list" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "terminal/connection_tokens",
				create: n({ method: "POST", path: "" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "terminal/locations",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{location}" }),
				update: n({ method: "POST", path: "/{location}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				del: n({ method: "DELETE", path: "/{location}" })
			});
		},
		function (e, t, r) {
			"use strict";
			const o = r(0),
				n = o.method;
			e.exports = o.extend({
				path: "terminal/readers",
				create: n({ method: "POST", path: "" }),
				retrieve: n({ method: "GET", path: "/{reader}" }),
				update: n({ method: "POST", path: "/{reader}" }),
				list: n({ method: "GET", path: "", methodType: "list" }),
				del: n({ method: "DELETE", path: "/{reader}" })
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
				n = r(12);
			e.exports = class extends n {
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
				n = r(15),
				{ HttpClient: s, HttpClientResponse: i } = r(4),
				a = new o.Agent({ keepAlive: !0 }),
				c = new n.Agent({ keepAlive: !0 });
			class p extends i {
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
				NodeHttpClient: class extends s {
					constructor(e) {
						super(), (this._agent = e);
					}
					getClientName() {
						return "node";
					}
					makeRequest(e, t, r, i, u, h, d, l) {
						const m = "http" === d;
						let f = this._agent;
						f || (f = m ? a : c);
						return new Promise((a, c) => {
							const d = (m ? o : n).request({
								host: e,
								port: t,
								path: r,
								method: i,
								agent: f,
								headers: u,
								ciphers:
									"DEFAULT:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!MD5"
							});
							d.setTimeout(l, () => {
								d.destroy(s.makeTimeoutError());
							}),
								d.on("response", e => {
									a(new p(e));
								}),
								d.on("error", e => {
									c(e);
								}),
								d.once("socket", e => {
									e.connecting
										? e.once(
												m ? "connect" : "secureConnect",
												() => {
													d.write(h), d.end();
												}
											)
										: (d.write(h), d.end());
								});
						});
					}
				},
				NodeHttpClientResponse: p
			};
		},
		function (e, t, r) {
			"use strict";
			var o = r(2);
			function n(e) {
				return encodeURIComponent(e)
					.replace(/%3A/gi, ":")
					.replace(/%24/g, "$")
					.replace(/%2C/gi, ",")
					.replace(/%20/g, "+")
					.replace(/%5B/gi, "[")
					.replace(/%5D/gi, "]");
			}
			e.exports = function (e, t, r) {
				if (!t) return e;
				var s;
				if (r) s = r(t);
				else if (o.isURLSearchParams(t)) s = t.toString();
				else {
					var i = [];
					o.forEach(t, function (e, t) {
						null != e &&
							(o.isArray(e) ? (t += "[]") : (e = [e]),
							o.forEach(e, function (e) {
								o.isDate(e)
									? (e = e.toISOString())
									: o.isObject(e) && (e = JSON.stringify(e)),
									i.push(n(t) + "=" + n(e));
							}));
					}),
						(s = i.join("&"));
				}
				if (s) {
					var a = e.indexOf("#");
					-1 !== a && (e = e.slice(0, a)),
						(e += (-1 === e.indexOf("?") ? "?" : "&") + s);
				}
				return e;
			};
		},
		function (e, t, r) {
			"use strict";
			var o = r(2),
				n = r(119),
				s = r(97),
				i = { "Content-Type": "application/x-www-form-urlencoded" };
			function a(e, t) {
				!o.isUndefined(e) &&
					o.isUndefined(e["Content-Type"]) &&
					(e["Content-Type"] = t);
			}
			var c,
				p = {
					transitional: {
						silentJSONParsing: !0,
						forcedJSONParsing: !0,
						clarifyTimeoutError: !1
					},
					adapter:
						("undefined" != typeof XMLHttpRequest
							? (c = r(120))
							: "undefined" != typeof process &&
								"[object process]" ===
									Object.prototype.toString.call(process) &&
								(c = r(126)),
						c),
					transformRequest: [
						function (e, t) {
							return (
								n(t, "Accept"),
								n(t, "Content-Type"),
								o.isFormData(e) ||
								o.isArrayBuffer(e) ||
								o.isBuffer(e) ||
								o.isStream(e) ||
								o.isFile(e) ||
								o.isBlob(e)
									? e
									: o.isArrayBufferView(e)
										? e.buffer
										: o.isURLSearchParams(e)
											? (a(
													t,
													"application/x-www-form-urlencoded;charset=utf-8"
												),
												e.toString())
											: o.isObject(e) ||
												  (t &&
														"application/json" ===
															t["Content-Type"])
												? (a(t, "application/json"),
													(function (e, t, r) {
														if (o.isString(e))
															try {
																return (
																	(
																		t ||
																		JSON.parse
																	)(e),
																	o.trim(e)
																);
															} catch (e) {
																if (
																	"SyntaxError" !==
																	e.name
																)
																	throw e;
															}
														return (
															r || JSON.stringify
														)(e);
													})(e))
												: e
							);
						}
					],
					transformResponse: [
						function (e) {
							var t = this.transitional,
								r = t && t.silentJSONParsing,
								n = t && t.forcedJSONParsing,
								i = !r && "json" === this.responseType;
							if (i || (n && o.isString(e) && e.length))
								try {
									return JSON.parse(e);
								} catch (e) {
									if (i) {
										if ("SyntaxError" === e.name)
											throw s(e, this, "E_JSON_PARSE");
										throw e;
									}
								}
							return e;
						}
					],
					timeout: 0,
					xsrfCookieName: "XSRF-TOKEN",
					xsrfHeaderName: "X-XSRF-TOKEN",
					maxContentLength: -1,
					maxBodyLength: -1,
					validateStatus: function (e) {
						return e >= 200 && e < 300;
					}
				};
			(p.headers = {
				common: { Accept: "application/json, text/plain, */*" }
			}),
				o.forEach(["delete", "get", "head"], function (e) {
					p.headers[e] = {};
				}),
				o.forEach(["post", "put", "patch"], function (e) {
					p.headers[e] = o.merge(i);
				}),
				(e.exports = p);
		},
		function (e, t, r) {
			"use strict";
			e.exports = function (e, t, r, o, n) {
				return (
					(e.config = t),
					r && (e.code = r),
					(e.request = o),
					(e.response = n),
					(e.isAxiosError = !0),
					(e.toJSON = function () {
						return {
							message: this.message,
							name: this.name,
							description: this.description,
							number: this.number,
							fileName: this.fileName,
							lineNumber: this.lineNumber,
							columnNumber: this.columnNumber,
							stack: this.stack,
							config: this.config,
							code: this.code
						};
					}),
					e
				);
			};
		},
		function (e, t, r) {
			"use strict";
			var o = r(97);
			e.exports = function (e, t, r, n, s) {
				var i = new Error(e);
				return o(i, t, r, n, s);
			};
		},
		function (e, t, r) {
			"use strict";
			e.exports = function (e, t) {
				return function () {
					for (
						var r = new Array(arguments.length), o = 0;
						o < r.length;
						o++
					)
						r[o] = arguments[o];
					return e.apply(t, r);
				};
			};
		},
		function (e, t, r) {
			"use strict";
			var o = r(98);
			e.exports = function (e, t, r) {
				var n = r.config.validateStatus;
				r.status && n && !n(r.status)
					? t(
							o(
								"Request failed with status code " + r.status,
								r.config,
								null,
								r.request,
								r
							)
						)
					: e(r);
			};
		},
		function (e, t, r) {
			"use strict";
			var o = r(122),
				n = r(123);
			e.exports = function (e, t) {
				return e && !o(t) ? n(e, t) : t;
			};
		},
		function (e, t, r) {
			var o = r(103),
				n = o.URL,
				s = r(14),
				i = r(15),
				a = r(127).Writable,
				c = r(128),
				p = r(129),
				u = [
					"abort",
					"aborted",
					"connect",
					"error",
					"socket",
					"timeout"
				],
				h = Object.create(null);
			u.forEach(function (e) {
				h[e] = function (t, r, o) {
					this._redirectable.emit(e, t, r, o);
				};
			});
			var d = x("ERR_FR_REDIRECTION_FAILURE", ""),
				l = x(
					"ERR_FR_TOO_MANY_REDIRECTS",
					"Maximum number of redirects exceeded"
				),
				m = x(
					"ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
					"Request body larger than maxBodyLength limit"
				),
				f = x("ERR_STREAM_WRITE_AFTER_END", "write after end");
			function g(e, t) {
				a.call(this),
					this._sanitizeOptions(e),
					(this._options = e),
					(this._ended = !1),
					(this._ending = !1),
					(this._redirectCount = 0),
					(this._redirects = []),
					(this._requestBodyLength = 0),
					(this._requestBodyBuffers = []),
					t && this.on("response", t);
				var r = this;
				(this._onNativeResponse = function (e) {
					r._processResponse(e);
				}),
					this._performRequest();
			}
			function y(e) {
				var t = { maxRedirects: 21, maxBodyLength: 10485760 },
					r = {};
				return (
					Object.keys(e).forEach(function (s) {
						var i = s + ":",
							a = (r[i] = e[s]),
							u = (t[s] = Object.create(a));
						Object.defineProperties(u, {
							request: {
								value: function (e, s, a) {
									if ("string" == typeof e) {
										var u = e;
										try {
											e = E(new n(u));
										} catch (t) {
											e = o.parse(u);
										}
									} else
										n && e instanceof n
											? (e = E(e))
											: ((a = s),
												(s = e),
												(e = { protocol: i }));
									return (
										"function" == typeof s &&
											((a = s), (s = null)),
										((s = Object.assign(
											{
												maxRedirects: t.maxRedirects,
												maxBodyLength: t.maxBodyLength
											},
											e,
											s
										)).nativeProtocols = r),
										c.equal(
											s.protocol,
											i,
											"protocol mismatch"
										),
										p("options", s),
										new g(s, a)
									);
								},
								configurable: !0,
								enumerable: !0,
								writable: !0
							},
							get: {
								value: function (e, t, r) {
									var o = u.request(e, t, r);
									return o.end(), o;
								},
								configurable: !0,
								enumerable: !0,
								writable: !0
							}
						});
					}),
					t
				);
			}
			function T() {}
			function E(e) {
				var t = {
					protocol: e.protocol,
					hostname: e.hostname.startsWith("[")
						? e.hostname.slice(1, -1)
						: e.hostname,
					hash: e.hash,
					search: e.search,
					pathname: e.pathname,
					path: e.pathname + e.search,
					href: e.href
				};
				return "" !== e.port && (t.port = Number(e.port)), t;
			}
			function v(e, t) {
				var r;
				for (var o in t) e.test(o) && ((r = t[o]), delete t[o]);
				return r;
			}
			function x(e, t) {
				function r(e) {
					Error.captureStackTrace(this, this.constructor),
						(this.message = e || t);
				}
				return (
					(r.prototype = new Error()),
					(r.prototype.constructor = r),
					(r.prototype.name = "Error [" + e + "]"),
					(r.prototype.code = e),
					r
				);
			}
			function _(e) {
				for (var t = 0; t < u.length; t++)
					e.removeListener(u[t], h[u[t]]);
				e.on("error", T), e.abort();
			}
			(g.prototype = Object.create(a.prototype)),
				(g.prototype.abort = function () {
					_(this._currentRequest), this.emit("abort");
				}),
				(g.prototype.write = function (e, t, r) {
					if (this._ending) throw new f();
					if (
						!(
							"string" == typeof e ||
							("object" == typeof e && "length" in e)
						)
					)
						throw new TypeError(
							"data should be a string, Buffer or Uint8Array"
						);
					"function" == typeof t && ((r = t), (t = null)),
						0 !== e.length
							? this._requestBodyLength + e.length <=
								this._options.maxBodyLength
								? ((this._requestBodyLength += e.length),
									this._requestBodyBuffers.push({
										data: e,
										encoding: t
									}),
									this._currentRequest.write(e, t, r))
								: (this.emit("error", new m()), this.abort())
							: r && r();
				}),
				(g.prototype.end = function (e, t, r) {
					if (
						("function" == typeof e
							? ((r = e), (e = t = null))
							: "function" == typeof t && ((r = t), (t = null)),
						e)
					) {
						var o = this,
							n = this._currentRequest;
						this.write(e, t, function () {
							(o._ended = !0), n.end(null, null, r);
						}),
							(this._ending = !0);
					} else
						(this._ended = this._ending = !0),
							this._currentRequest.end(null, null, r);
				}),
				(g.prototype.setHeader = function (e, t) {
					(this._options.headers[e] = t),
						this._currentRequest.setHeader(e, t);
				}),
				(g.prototype.removeHeader = function (e) {
					delete this._options.headers[e],
						this._currentRequest.removeHeader(e);
				}),
				(g.prototype.setTimeout = function (e, t) {
					var r = this;
					function o(t) {
						t.setTimeout(e),
							t.removeListener("timeout", t.destroy),
							t.addListener("timeout", t.destroy);
					}
					function n(t) {
						r._timeout && clearTimeout(r._timeout),
							(r._timeout = setTimeout(function () {
								r.emit("timeout"), s();
							}, e)),
							o(t);
					}
					function s() {
						r._timeout &&
							(clearTimeout(r._timeout), (r._timeout = null)),
							t && r.removeListener("timeout", t),
							r.socket ||
								r._currentRequest.removeListener("socket", n);
					}
					return (
						t && this.on("timeout", t),
						this.socket
							? n(this.socket)
							: this._currentRequest.once("socket", n),
						this.on("socket", o),
						this.once("response", s),
						this.once("error", s),
						this
					);
				}),
				[
					"flushHeaders",
					"getHeader",
					"setNoDelay",
					"setSocketKeepAlive"
				].forEach(function (e) {
					g.prototype[e] = function (t, r) {
						return this._currentRequest[e](t, r);
					};
				}),
				["aborted", "connection", "socket"].forEach(function (e) {
					Object.defineProperty(g.prototype, e, {
						get: function () {
							return this._currentRequest[e];
						}
					});
				}),
				(g.prototype._sanitizeOptions = function (e) {
					if (
						(e.headers || (e.headers = {}),
						e.host &&
							(e.hostname || (e.hostname = e.host),
							delete e.host),
						!e.pathname && e.path)
					) {
						var t = e.path.indexOf("?");
						t < 0
							? (e.pathname = e.path)
							: ((e.pathname = e.path.substring(0, t)),
								(e.search = e.path.substring(t)));
					}
				}),
				(g.prototype._performRequest = function () {
					var e = this._options.protocol,
						t = this._options.nativeProtocols[e];
					if (t) {
						if (this._options.agents) {
							var r = e.substr(0, e.length - 1);
							this._options.agent = this._options.agents[r];
						}
						var n = (this._currentRequest = t.request(
							this._options,
							this._onNativeResponse
						));
						(this._currentUrl = o.format(this._options)),
							(n._redirectable = this);
						for (var s = 0; s < u.length; s++) n.on(u[s], h[u[s]]);
						if (this._isRedirect) {
							var i = 0,
								a = this,
								c = this._requestBodyBuffers;
							!(function e(t) {
								if (n === a._currentRequest)
									if (t) a.emit("error", t);
									else if (i < c.length) {
										var r = c[i++];
										n.finished ||
											n.write(r.data, r.encoding, e);
									} else a._ended && n.end();
							})();
						}
					} else
						this.emit(
							"error",
							new TypeError("Unsupported protocol " + e)
						);
				}),
				(g.prototype._processResponse = function (e) {
					var t = e.statusCode;
					this._options.trackRedirects &&
						this._redirects.push({
							url: this._currentUrl,
							headers: e.headers,
							statusCode: t
						});
					var r = e.headers.location;
					if (
						r &&
						!1 !== this._options.followRedirects &&
						t >= 300 &&
						t < 400
					) {
						if (
							(_(this._currentRequest),
							e.destroy(),
							++this._redirectCount > this._options.maxRedirects)
						)
							return void this.emit("error", new l());
						(((301 === t || 302 === t) &&
							"POST" === this._options.method) ||
							(303 === t &&
								!/^(?:GET|HEAD)$/.test(
									this._options.method
								))) &&
							((this._options.method = "GET"),
							(this._requestBodyBuffers = []),
							v(/^content-/i, this._options.headers));
						var n =
								v(/^host$/i, this._options.headers) ||
								o.parse(this._currentUrl).hostname,
							s = o.resolve(this._currentUrl, r);
						p("redirecting to", s), (this._isRedirect = !0);
						var i = o.parse(s);
						if (
							(Object.assign(this._options, i),
							i.hostname !== n &&
								v(/^authorization$/i, this._options.headers),
							"function" == typeof this._options.beforeRedirect)
						) {
							var a = { headers: e.headers };
							try {
								this._options.beforeRedirect.call(
									null,
									this._options,
									a
								);
							} catch (e) {
								return void this.emit("error", e);
							}
							this._sanitizeOptions(this._options);
						}
						try {
							this._performRequest();
						} catch (e) {
							var c = new d(
								"Redirected request failed: " + e.message
							);
							(c.cause = e), this.emit("error", c);
						}
					} else
						(e.responseUrl = this._currentUrl),
							(e.redirects = this._redirects),
							this.emit("response", e),
							(this._requestBodyBuffers = []);
				}),
				(e.exports = y({ http: s, https: i })),
				(e.exports.wrap = y);
		},
		function (e, t) {
			e.exports = require("url");
		},
		function (e, t, r) {
			"use strict";
			e.exports = function (e) {
				function t(e) {
					for (var t = 0, r = 0; r < e.length; r++)
						(t = (t << 5) - t + e.charCodeAt(r)), (t |= 0);
					return o.colors[Math.abs(t) % o.colors.length];
				}
				function o(e) {
					var r;
					function i() {
						if (i.enabled) {
							for (
								var e = arguments.length,
									t = new Array(e),
									n = 0;
								n < e;
								n++
							)
								t[n] = arguments[n];
							var s = i,
								a = Number(new Date()),
								c = a - (r || a);
							(s.diff = c),
								(s.prev = r),
								(s.curr = a),
								(r = a),
								(t[0] = o.coerce(t[0])),
								"string" != typeof t[0] && t.unshift("%O");
							var p = 0;
							(t[0] = t[0].replace(
								/%([a-zA-Z%])/g,
								function (e, r) {
									if ("%%" === e) return e;
									p++;
									var n = o.formatters[r];
									if ("function" == typeof n) {
										var i = t[p];
										(e = n.call(s, i)), t.splice(p, 1), p--;
									}
									return e;
								}
							)),
								o.formatArgs.call(s, t);
							var u = s.log || o.log;
							u.apply(s, t);
						}
					}
					return (
						(i.namespace = e),
						(i.enabled = o.enabled(e)),
						(i.useColors = o.useColors()),
						(i.color = t(e)),
						(i.destroy = n),
						(i.extend = s),
						"function" == typeof o.init && o.init(i),
						o.instances.push(i),
						i
					);
				}
				function n() {
					var e = o.instances.indexOf(this);
					return -1 !== e && (o.instances.splice(e, 1), !0);
				}
				function s(e, t) {
					return o(this.namespace + (void 0 === t ? ":" : t) + e);
				}
				return (
					(o.debug = o),
					(o.default = o),
					(o.coerce = function (e) {
						if (e instanceof Error) return e.stack || e.message;
						return e;
					}),
					(o.disable = function () {
						o.enable("");
					}),
					(o.enable = function (e) {
						var t;
						o.save(e), (o.names = []), (o.skips = []);
						var r = ("string" == typeof e ? e : "").split(/[\s,]+/),
							n = r.length;
						for (t = 0; t < n; t++)
							r[t] &&
								("-" === (e = r[t].replace(/\*/g, ".*?"))[0]
									? o.skips.push(
											new RegExp("^" + e.substr(1) + "$")
										)
									: o.names.push(new RegExp("^" + e + "$")));
						for (t = 0; t < o.instances.length; t++) {
							var s = o.instances[t];
							s.enabled = o.enabled(s.namespace);
						}
					}),
					(o.enabled = function (e) {
						if ("*" === e[e.length - 1]) return !0;
						var t, r;
						for (t = 0, r = o.skips.length; t < r; t++)
							if (o.skips[t].test(e)) return !1;
						for (t = 0, r = o.names.length; t < r; t++)
							if (o.names[t].test(e)) return !0;
						return !1;
					}),
					(o.humanize = r(132)),
					Object.keys(e).forEach(function (t) {
						o[t] = e[t];
					}),
					(o.instances = []),
					(o.names = []),
					(o.skips = []),
					(o.formatters = {}),
					(o.selectColor = t),
					o.enable(o.load()),
					o
				);
			};
		},
		function (e) {
			e.exports = JSON.parse(
				'{"_from":"axios@^0.21.1","_id":"axios@0.21.4","_inBundle":false,"_integrity":"sha512-ut5vewkiu8jjGBdqpM44XxjuCjq9LAKeHVmoVfHVzy8eHgxxq8SbAVQNovDA8mVi05kP0Ea/n/UzcSHcTJQfNg==","_location":"/axios","_phantomChildren":{},"_requested":{"type":"range","registry":true,"raw":"axios@^0.21.1","name":"axios","escapedName":"axios","rawSpec":"^0.21.1","saveSpec":null,"fetchSpec":"^0.21.1"},"_requiredBy":["/contentful-management","/gatsby","/gatsby-source-wordpress"],"_resolved":"https://registry.npmjs.org/axios/-/axios-0.21.4.tgz","_shasum":"c67b90dc0568e5c1cf2b0b858c43ba28e2eda575","_spec":"axios@^0.21.1","_where":"C:\\\\Users\\\\jon\\\\next-2021\\\\node_modules\\\\gatsby","author":{"name":"Matt Zabriskie"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"bugs":{"url":"https://github.com/axios/axios/issues"},"bundleDependencies":false,"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}],"dependencies":{"follow-redirects":"^1.14.0"},"deprecated":false,"description":"Promise based HTTP client for the browser and node.js","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"homepage":"https://axios-http.com","jsdelivr":"dist/axios.min.js","keywords":["xhr","http","ajax","promise","node"],"license":"MIT","main":"index.js","name":"axios","repository":{"type":"git","url":"git+https://github.com/axios/axios.git"},"scripts":{"build":"NODE_ENV=production grunt build","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","examples":"node ./examples/server.js","fix":"eslint --fix lib/**/*.js","postversion":"git push && git push --tags","preversion":"npm test","start":"node ./sandbox/server.js","test":"grunt test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"},"typings":"./index.d.ts","unpkg":"dist/axios.min.js","version":"0.21.4"}'
			);
		},
		function (e, t, r) {
			"use strict";
			e.exports = function (e) {
				return !(!e || !e.__CANCEL__);
			};
		},
		function (e, t, r) {
			"use strict";
			var o = r(2);
			e.exports = function (e, t) {
				t = t || {};
				var r = {},
					n = ["url", "method", "data"],
					s = ["headers", "auth", "proxy", "params"],
					i = [
						"baseURL",
						"transformRequest",
						"transformResponse",
						"paramsSerializer",
						"timeout",
						"timeoutMessage",
						"withCredentials",
						"adapter",
						"responseType",
						"xsrfCookieName",
						"xsrfHeaderName",
						"onUploadProgress",
						"onDownloadProgress",
						"decompress",
						"maxContentLength",
						"maxBodyLength",
						"maxRedirects",
						"transport",
						"httpAgent",
						"httpsAgent",
						"cancelToken",
						"socketPath",
						"responseEncoding"
					],
					a = ["validateStatus"];
				function c(e, t) {
					return o.isPlainObject(e) && o.isPlainObject(t)
						? o.merge(e, t)
						: o.isPlainObject(t)
							? o.merge({}, t)
							: o.isArray(t)
								? t.slice()
								: t;
				}
				function p(n) {
					o.isUndefined(t[n])
						? o.isUndefined(e[n]) || (r[n] = c(void 0, e[n]))
						: (r[n] = c(e[n], t[n]));
				}
				o.forEach(n, function (e) {
					o.isUndefined(t[e]) || (r[e] = c(void 0, t[e]));
				}),
					o.forEach(s, p),
					o.forEach(i, function (n) {
						o.isUndefined(t[n])
							? o.isUndefined(e[n]) || (r[n] = c(void 0, e[n]))
							: (r[n] = c(void 0, t[n]));
					}),
					o.forEach(a, function (o) {
						o in t
							? (r[o] = c(e[o], t[o]))
							: o in e && (r[o] = c(void 0, e[o]));
					});
				var u = n.concat(s).concat(i).concat(a),
					h = Object.keys(e)
						.concat(Object.keys(t))
						.filter(function (e) {
							return -1 === u.indexOf(e);
						});
				return o.forEach(h, p), r;
			};
		},
		function (e, t, r) {
			"use strict";
			function o(e) {
				this.message = e;
			}
			(o.prototype.toString = function () {
				return "Cancel" + (this.message ? ": " + this.message : "");
			}),
				(o.prototype.__CANCEL__ = !0),
				(e.exports = o);
		},
		,
		function (e, t, r) {
			r(111).config();
			r(113);
			const o = r(17)(process.env.STRIPE_SECRET_KEY),
				n = {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Headers": "Content-Type"
				};
			t.handler = async (e, t) => {
				if ("OPTIONS" === e.httpMethod)
					return { statusCode: 200, headers: n };
				const r = JSON.parse(e.body);
				if ((console.log(r), !r.items))
					return (
						console.error("List of items to purchase is missing."),
						{
							statusCode: 400,
							headers: n,
							body: JSON.stringify({
								status: "missing information"
							})
						}
					);
				try {
					const e = await o.paymentIntents.create({
						currency: "eur",
						amount: amount,
						description: "Order from store"
					});
					return {
						statusCode: 200,
						headers: n,
						body: JSON.stringify({ clientSecret: e.client_secret })
					};
				} catch (e) {
					return (
						console.log(e),
						{
							statusCode: 400,
							headers: n,
							body: JSON.stringify({ status: e })
						}
					);
				}
			};
		},
		function (e, t, r) {
			const o = r(112),
				n = r(16);
			function s(e) {
				console.log("[dotenv][DEBUG] " + e);
			}
			const i = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/,
				a = /\\n/g,
				c = /\n|\r|\r\n/;
			function p(e, t) {
				const r = Boolean(t && t.debug),
					o = {};
				return (
					e
						.toString()
						.split(c)
						.forEach(function (e, t) {
							const n = e.match(i);
							if (null != n) {
								const e = n[1];
								let t = n[2] || "";
								const r = t.length - 1,
									s = '"' === t[0] && '"' === t[r];
								("'" === t[0] && "'" === t[r]) || s
									? ((t = t.substring(1, r)),
										s && (t = t.replace(a, "\n")))
									: (t = t.trim()),
									(o[e] = t);
							} else
								r &&
									s(
										`did not match key and value when parsing line ${t + 1}: ${e}`
									);
						}),
					o
				);
			}
			(e.exports.config = function (e) {
				let t = n.resolve(process.cwd(), ".env"),
					r = "utf8",
					i = !1;
				e &&
					(null != e.path && (t = e.path),
					null != e.encoding && (r = e.encoding),
					null != e.debug && (i = !0));
				try {
					const e = p(o.readFileSync(t, { encoding: r }), {
						debug: i
					});
					return (
						Object.keys(e).forEach(function (t) {
							Object.prototype.hasOwnProperty.call(process.env, t)
								? i &&
									s(
										`"${t}" is already defined in \`process.env\` and will not be overwritten`
									)
								: (process.env[t] = e[t]);
						}),
						{ parsed: e }
					);
				} catch (e) {
					return { error: e };
				}
			}),
				(e.exports.parse = p);
		},
		function (e, t) {
			e.exports = require("fs");
		},
		function (e, t, r) {
			e.exports = r(114);
		},
		function (e, t, r) {
			"use strict";
			var o = r(2),
				n = r(99),
				s = r(115),
				i = r(107);
			function a(e) {
				var t = new s(e),
					r = n(s.prototype.request, t);
				return o.extend(r, s.prototype, t), o.extend(r, t), r;
			}
			var c = a(r(96));
			(c.Axios = s),
				(c.create = function (e) {
					return a(i(c.defaults, e));
				}),
				(c.Cancel = r(108)),
				(c.CancelToken = r(141)),
				(c.isCancel = r(106)),
				(c.all = function (e) {
					return Promise.all(e);
				}),
				(c.spread = r(142)),
				(c.isAxiosError = r(143)),
				(e.exports = c),
				(e.exports.default = c);
		},
		function (e, t, r) {
			"use strict";
			var o = r(2),
				n = r(95),
				s = r(116),
				i = r(117),
				a = r(107),
				c = r(140),
				p = c.validators;
			function u(e) {
				(this.defaults = e),
					(this.interceptors = {
						request: new s(),
						response: new s()
					});
			}
			(u.prototype.request = function (e) {
				"string" == typeof e
					? ((e = arguments[1] || {}).url = arguments[0])
					: (e = e || {}),
					(e = a(this.defaults, e)).method
						? (e.method = e.method.toLowerCase())
						: this.defaults.method
							? (e.method = this.defaults.method.toLowerCase())
							: (e.method = "get");
				var t = e.transitional;
				void 0 !== t &&
					c.assertOptions(
						t,
						{
							silentJSONParsing: p.transitional(
								p.boolean,
								"1.0.0"
							),
							forcedJSONParsing: p.transitional(
								p.boolean,
								"1.0.0"
							),
							clarifyTimeoutError: p.transitional(
								p.boolean,
								"1.0.0"
							)
						},
						!1
					);
				var r = [],
					o = !0;
				this.interceptors.request.forEach(function (t) {
					("function" == typeof t.runWhen && !1 === t.runWhen(e)) ||
						((o = o && t.synchronous),
						r.unshift(t.fulfilled, t.rejected));
				});
				var n,
					s = [];
				if (
					(this.interceptors.response.forEach(function (e) {
						s.push(e.fulfilled, e.rejected);
					}),
					!o)
				) {
					var u = [i, void 0];
					for (
						Array.prototype.unshift.apply(u, r),
							u = u.concat(s),
							n = Promise.resolve(e);
						u.length;

					)
						n = n.then(u.shift(), u.shift());
					return n;
				}
				for (var h = e; r.length; ) {
					var d = r.shift(),
						l = r.shift();
					try {
						h = d(h);
					} catch (e) {
						l(e);
						break;
					}
				}
				try {
					n = i(h);
				} catch (e) {
					return Promise.reject(e);
				}
				for (; s.length; ) n = n.then(s.shift(), s.shift());
				return n;
			}),
				(u.prototype.getUri = function (e) {
					return (
						(e = a(this.defaults, e)),
						n(e.url, e.params, e.paramsSerializer).replace(
							/^\?/,
							""
						)
					);
				}),
				o.forEach(["delete", "get", "head", "options"], function (e) {
					u.prototype[e] = function (t, r) {
						return this.request(
							a(r || {}, {
								method: e,
								url: t,
								data: (r || {}).data
							})
						);
					};
				}),
				o.forEach(["post", "put", "patch"], function (e) {
					u.prototype[e] = function (t, r, o) {
						return this.request(
							a(o || {}, { method: e, url: t, data: r })
						);
					};
				}),
				(e.exports = u);
		},
		function (e, t, r) {
			"use strict";
			var o = r(2);
			function n() {
				this.handlers = [];
			}
			(n.prototype.use = function (e, t, r) {
				return (
					this.handlers.push({
						fulfilled: e,
						rejected: t,
						synchronous: !!r && r.synchronous,
						runWhen: r ? r.runWhen : null
					}),
					this.handlers.length - 1
				);
			}),
				(n.prototype.eject = function (e) {
					this.handlers[e] && (this.handlers[e] = null);
				}),
				(n.prototype.forEach = function (e) {
					o.forEach(this.handlers, function (t) {
						null !== t && e(t);
					});
				}),
				(e.exports = n);
		},
		function (e, t, r) {
			"use strict";
			var o = r(2),
				n = r(118),
				s = r(106),
				i = r(96);
			function a(e) {
				e.cancelToken && e.cancelToken.throwIfRequested();
			}
			e.exports = function (e) {
				return (
					a(e),
					(e.headers = e.headers || {}),
					(e.data = n.call(e, e.data, e.headers, e.transformRequest)),
					(e.headers = o.merge(
						e.headers.common || {},
						e.headers[e.method] || {},
						e.headers
					)),
					o.forEach(
						[
							"delete",
							"get",
							"head",
							"post",
							"put",
							"patch",
							"common"
						],
						function (t) {
							delete e.headers[t];
						}
					),
					(e.adapter || i.adapter)(e).then(
						function (t) {
							return (
								a(e),
								(t.data = n.call(
									e,
									t.data,
									t.headers,
									e.transformResponse
								)),
								t
							);
						},
						function (t) {
							return (
								s(t) ||
									(a(e),
									t &&
										t.response &&
										(t.response.data = n.call(
											e,
											t.response.data,
											t.response.headers,
											e.transformResponse
										))),
								Promise.reject(t)
							);
						}
					)
				);
			};
		},
		function (e, t, r) {
			"use strict";
			var o = r(2),
				n = r(96);
			e.exports = function (e, t, r) {
				var s = this || n;
				return (
					o.forEach(r, function (r) {
						e = r.call(s, e, t);
					}),
					e
				);
			};
		},
		function (e, t, r) {
			"use strict";
			var o = r(2);
			e.exports = function (e, t) {
				o.forEach(e, function (r, o) {
					o !== t &&
						o.toUpperCase() === t.toUpperCase() &&
						((e[t] = r), delete e[o]);
				});
			};
		},
		function (e, t, r) {
			"use strict";
			var o = r(2),
				n = r(100),
				s = r(121),
				i = r(95),
				a = r(101),
				c = r(124),
				p = r(125),
				u = r(98);
			e.exports = function (e) {
				return new Promise(function (t, r) {
					var h = e.data,
						d = e.headers,
						l = e.responseType;
					o.isFormData(h) && delete d["Content-Type"];
					var m = new XMLHttpRequest();
					if (e.auth) {
						var f = e.auth.username || "",
							g = e.auth.password
								? unescape(encodeURIComponent(e.auth.password))
								: "";
						d.Authorization = "Basic " + btoa(f + ":" + g);
					}
					var y = a(e.baseURL, e.url);
					function T() {
						if (m) {
							var o =
									"getAllResponseHeaders" in m
										? c(m.getAllResponseHeaders())
										: null,
								s = {
									data:
										l && "text" !== l && "json" !== l
											? m.response
											: m.responseText,
									status: m.status,
									statusText: m.statusText,
									headers: o,
									config: e,
									request: m
								};
							n(t, r, s), (m = null);
						}
					}
					if (
						(m.open(
							e.method.toUpperCase(),
							i(y, e.params, e.paramsSerializer),
							!0
						),
						(m.timeout = e.timeout),
						"onloadend" in m
							? (m.onloadend = T)
							: (m.onreadystatechange = function () {
									m &&
										4 === m.readyState &&
										(0 !== m.status ||
											(m.responseURL &&
												0 ===
													m.responseURL.indexOf(
														"file:"
													))) &&
										setTimeout(T);
								}),
						(m.onabort = function () {
							m &&
								(r(u("Request aborted", e, "ECONNABORTED", m)),
								(m = null));
						}),
						(m.onerror = function () {
							r(u("Network Error", e, null, m)), (m = null);
						}),
						(m.ontimeout = function () {
							var t = "timeout of " + e.timeout + "ms exceeded";
							e.timeoutErrorMessage &&
								(t = e.timeoutErrorMessage),
								r(
									u(
										t,
										e,
										e.transitional &&
											e.transitional.clarifyTimeoutError
											? "ETIMEDOUT"
											: "ECONNABORTED",
										m
									)
								),
								(m = null);
						}),
						o.isStandardBrowserEnv())
					) {
						var E =
							(e.withCredentials || p(y)) && e.xsrfCookieName
								? s.read(e.xsrfCookieName)
								: void 0;
						E && (d[e.xsrfHeaderName] = E);
					}
					"setRequestHeader" in m &&
						o.forEach(d, function (e, t) {
							void 0 === h && "content-type" === t.toLowerCase()
								? delete d[t]
								: m.setRequestHeader(t, e);
						}),
						o.isUndefined(e.withCredentials) ||
							(m.withCredentials = !!e.withCredentials),
						l && "json" !== l && (m.responseType = e.responseType),
						"function" == typeof e.onDownloadProgress &&
							m.addEventListener(
								"progress",
								e.onDownloadProgress
							),
						"function" == typeof e.onUploadProgress &&
							m.upload &&
							m.upload.addEventListener(
								"progress",
								e.onUploadProgress
							),
						e.cancelToken &&
							e.cancelToken.promise.then(function (e) {
								m && (m.abort(), r(e), (m = null));
							}),
						h || (h = null),
						m.send(h);
				});
			};
		},
		function (e, t, r) {
			"use strict";
			var o = r(2);
			e.exports = o.isStandardBrowserEnv()
				? {
						write: function (e, t, r, n, s, i) {
							var a = [];
							a.push(e + "=" + encodeURIComponent(t)),
								o.isNumber(r) &&
									a.push(
										"expires=" + new Date(r).toGMTString()
									),
								o.isString(n) && a.push("path=" + n),
								o.isString(s) && a.push("domain=" + s),
								!0 === i && a.push("secure"),
								(document.cookie = a.join("; "));
						},
						read: function (e) {
							var t = document.cookie.match(
								new RegExp("(^|;\\s*)(" + e + ")=([^;]*)")
							);
							return t ? decodeURIComponent(t[3]) : null;
						},
						remove: function (e) {
							this.write(e, "", Date.now() - 864e5);
						}
					}
				: {
						write: function () {},
						read: function () {
							return null;
						},
						remove: function () {}
					};
		},
		function (e, t, r) {
			"use strict";
			e.exports = function (e) {
				return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e);
			};
		},
		function (e, t, r) {
			"use strict";
			e.exports = function (e, t) {
				return t
					? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "")
					: e;
			};
		},
		function (e, t, r) {
			"use strict";
			var o = r(2),
				n = [
					"age",
					"authorization",
					"content-length",
					"content-type",
					"etag",
					"expires",
					"from",
					"host",
					"if-modified-since",
					"if-unmodified-since",
					"last-modified",
					"location",
					"max-forwards",
					"proxy-authorization",
					"referer",
					"retry-after",
					"user-agent"
				];
			e.exports = function (e) {
				var t,
					r,
					s,
					i = {};
				return e
					? (o.forEach(e.split("\n"), function (e) {
							if (
								((s = e.indexOf(":")),
								(t = o.trim(e.substr(0, s)).toLowerCase()),
								(r = o.trim(e.substr(s + 1))),
								t)
							) {
								if (i[t] && n.indexOf(t) >= 0) return;
								i[t] =
									"set-cookie" === t
										? (i[t] ? i[t] : []).concat([r])
										: i[t]
											? i[t] + ", " + r
											: r;
							}
						}),
						i)
					: i;
			};
		},
		function (e, t, r) {
			"use strict";
			var o = r(2);
			e.exports = o.isStandardBrowserEnv()
				? (function () {
						var e,
							t = /(msie|trident)/i.test(navigator.userAgent),
							r = document.createElement("a");
						function n(e) {
							var o = e;
							return (
								t && (r.setAttribute("href", o), (o = r.href)),
								r.setAttribute("href", o),
								{
									href: r.href,
									protocol: r.protocol
										? r.protocol.replace(/:$/, "")
										: "",
									host: r.host,
									search: r.search
										? r.search.replace(/^\?/, "")
										: "",
									hash: r.hash
										? r.hash.replace(/^#/, "")
										: "",
									hostname: r.hostname,
									port: r.port,
									pathname:
										"/" === r.pathname.charAt(0)
											? r.pathname
											: "/" + r.pathname
								}
							);
						}
						return (
							(e = n(window.location.href)),
							function (t) {
								var r = o.isString(t) ? n(t) : t;
								return (
									r.protocol === e.protocol &&
									r.host === e.host
								);
							}
						);
					})()
				: function () {
						return !0;
					};
		},
		function (e, t, r) {
			"use strict";
			var o = r(2),
				n = r(100),
				s = r(101),
				i = r(95),
				a = r(14),
				c = r(15),
				p = r(102).http,
				u = r(102).https,
				h = r(103),
				d = r(139),
				l = r(105),
				m = r(98),
				f = r(97),
				g = /https:?/;
			e.exports = function (e) {
				return new Promise(function (t, r) {
					var y = function (e) {
							t(e);
						},
						T = function (e) {
							r(e);
						},
						E = e.data,
						v = e.headers;
					if (
						("User-Agent" in v || "user-agent" in v
							? v["User-Agent"] ||
								v["user-agent"] ||
								(delete v["User-Agent"], delete v["user-agent"])
							: (v["User-Agent"] = "axios/" + l.version),
						E && !o.isStream(E))
					) {
						if (Buffer.isBuffer(E));
						else if (o.isArrayBuffer(E))
							E = Buffer.from(new Uint8Array(E));
						else {
							if (!o.isString(E))
								return T(
									m(
										"Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream",
										e
									)
								);
							E = Buffer.from(E, "utf-8");
						}
						v["Content-Length"] = E.length;
					}
					var x = void 0;
					e.auth &&
						(x =
							(e.auth.username || "") +
							":" +
							(e.auth.password || ""));
					var _ = s(e.baseURL, e.url),
						b = h.parse(_),
						S = b.protocol || "http:";
					if (!x && b.auth) {
						var O = b.auth.split(":");
						x = (O[0] || "") + ":" + (O[1] || "");
					}
					x && delete v.Authorization;
					var w = g.test(S),
						C = w ? e.httpsAgent : e.httpAgent,
						P = {
							path: i(
								b.path,
								e.params,
								e.paramsSerializer
							).replace(/^\?/, ""),
							method: e.method.toUpperCase(),
							headers: v,
							agent: C,
							agents: { http: e.httpAgent, https: e.httpsAgent },
							auth: x
						};
					e.socketPath
						? (P.socketPath = e.socketPath)
						: ((P.hostname = b.hostname), (P.port = b.port));
					var R,
						A = e.proxy;
					if (!A && !1 !== A) {
						var k = S.slice(0, -1) + "_proxy",
							j = process.env[k] || process.env[k.toUpperCase()];
						if (j) {
							var N = h.parse(j),
								I =
									process.env.no_proxy ||
									process.env.NO_PROXY,
								G = !0;
							if (I)
								G = !I.split(",")
									.map(function (e) {
										return e.trim();
									})
									.some(function (e) {
										return (
											!!e &&
											("*" === e ||
												("." === e[0] &&
													b.hostname.substr(
														b.hostname.length -
															e.length
													) === e) ||
												b.hostname === e)
										);
									});
							if (
								G &&
								((A = {
									host: N.hostname,
									port: N.port,
									protocol: N.protocol
								}),
								N.auth)
							) {
								var D = N.auth.split(":");
								A.auth = { username: D[0], password: D[1] };
							}
						}
					}
					A &&
						((P.headers.host =
							b.hostname + (b.port ? ":" + b.port : "")),
						(function e(t, r, o) {
							if (
								((t.hostname = r.host),
								(t.host = r.host),
								(t.port = r.port),
								(t.path = o),
								r.auth)
							) {
								var n = Buffer.from(
									r.auth.username + ":" + r.auth.password,
									"utf8"
								).toString("base64");
								t.headers["Proxy-Authorization"] = "Basic " + n;
							}
							t.beforeRedirect = function (t) {
								(t.headers.host = t.host), e(t, r, t.href);
							};
						})(
							P,
							A,
							S +
								"//" +
								b.hostname +
								(b.port ? ":" + b.port : "") +
								P.path
						));
					var q = w && (!A || g.test(A.protocol));
					e.transport
						? (R = e.transport)
						: 0 === e.maxRedirects
							? (R = q ? c : a)
							: (e.maxRedirects &&
									(P.maxRedirects = e.maxRedirects),
								(R = q ? u : p)),
						e.maxBodyLength > -1 &&
							(P.maxBodyLength = e.maxBodyLength);
					var F = R.request(P, function (t) {
						if (!F.aborted) {
							var r = t,
								s = t.req || F;
							if (
								204 !== t.statusCode &&
								"HEAD" !== s.method &&
								!1 !== e.decompress
							)
								switch (t.headers["content-encoding"]) {
									case "gzip":
									case "compress":
									case "deflate":
										(r = r.pipe(d.createUnzip())),
											delete t.headers[
												"content-encoding"
											];
								}
							var i = {
								status: t.statusCode,
								statusText: t.statusMessage,
								headers: t.headers,
								config: e,
								request: s
							};
							if ("stream" === e.responseType)
								(i.data = r), n(y, T, i);
							else {
								var a = [],
									c = 0;
								r.on("data", function (t) {
									a.push(t),
										(c += t.length),
										e.maxContentLength > -1 &&
											c > e.maxContentLength &&
											(r.destroy(),
											T(
												m(
													"maxContentLength size of " +
														e.maxContentLength +
														" exceeded",
													e,
													null,
													s
												)
											));
								}),
									r.on("error", function (t) {
										F.aborted || T(f(t, e, null, s));
									}),
									r.on("end", function () {
										var t = Buffer.concat(a);
										"arraybuffer" !== e.responseType &&
											((t = t.toString(
												e.responseEncoding
											)),
											(e.responseEncoding &&
												"utf8" !==
													e.responseEncoding) ||
												(t = o.stripBOM(t))),
											(i.data = t),
											n(y, T, i);
									});
							}
						}
					});
					if (
						(F.on("error", function (t) {
							(F.aborted &&
								"ERR_FR_TOO_MANY_REDIRECTS" !== t.code) ||
								T(f(t, e, null, F));
						}),
						e.timeout)
					) {
						var L = parseInt(e.timeout, 10);
						if (isNaN(L))
							return void T(
								m(
									"error trying to parse `config.timeout` to int",
									e,
									"ERR_PARSE_TIMEOUT",
									F
								)
							);
						F.setTimeout(L, function () {
							F.abort(),
								T(
									m(
										"timeout of " + L + "ms exceeded",
										e,
										e.transitional &&
											e.transitional.clarifyTimeoutError
											? "ETIMEDOUT"
											: "ECONNABORTED",
										F
									)
								);
						});
					}
					e.cancelToken &&
						e.cancelToken.promise.then(function (e) {
							F.aborted || (F.abort(), T(e));
						}),
						o.isStream(E)
							? E.on("error", function (t) {
									T(f(t, e, null, F));
								}).pipe(F)
							: F.end(E);
				});
			};
		},
		function (e, t) {
			e.exports = require("stream");
		},
		function (e, t) {
			e.exports = require("assert");
		},
		function (e, t, r) {
			var o;
			e.exports = function () {
				if (!o) {
					try {
						o = r(130)("follow-redirects");
					} catch (e) {}
					"function" != typeof o && (o = function () {});
				}
				o.apply(null, arguments);
			};
		},
		function (e, t, r) {
			"use strict";
			"undefined" == typeof process ||
			"renderer" === process.type ||
			!0 === process.browser ||
			process.__nwjs
				? (e.exports = r(131))
				: (e.exports = r(133));
		},
		function (e, t, r) {
			"use strict";
			function o(e) {
				return (o =
					"function" == typeof Symbol &&
					"symbol" == typeof Symbol.iterator
						? function (e) {
								return typeof e;
							}
						: function (e) {
								return e &&
									"function" == typeof Symbol &&
									e.constructor === Symbol &&
									e !== Symbol.prototype
									? "symbol"
									: typeof e;
							})(e);
			}
			(t.log = function () {
				var e;
				return (
					"object" ===
						("undefined" == typeof console
							? "undefined"
							: o(console)) &&
					console.log &&
					(e = console).log.apply(e, arguments)
				);
			}),
				(t.formatArgs = function (t) {
					if (
						((t[0] =
							(this.useColors ? "%c" : "") +
							this.namespace +
							(this.useColors ? " %c" : " ") +
							t[0] +
							(this.useColors ? "%c " : " ") +
							"+" +
							e.exports.humanize(this.diff)),
						!this.useColors)
					)
						return;
					var r = "color: " + this.color;
					t.splice(1, 0, r, "color: inherit");
					var o = 0,
						n = 0;
					t[0].replace(/%[a-zA-Z%]/g, function (e) {
						"%%" !== e && (o++, "%c" === e && (n = o));
					}),
						t.splice(n, 0, r);
				}),
				(t.save = function (e) {
					try {
						e
							? t.storage.setItem("debug", e)
							: t.storage.removeItem("debug");
					} catch (e) {}
				}),
				(t.load = function () {
					var e;
					try {
						e = t.storage.getItem("debug");
					} catch (e) {}
					!e &&
						"undefined" != typeof process &&
						"env" in process &&
						(e = process.env.DEBUG);
					return e;
				}),
				(t.useColors = function () {
					if (
						"undefined" != typeof window &&
						window.process &&
						("renderer" === window.process.type ||
							window.process.__nwjs)
					)
						return !0;
					if (
						"undefined" != typeof navigator &&
						navigator.userAgent &&
						navigator.userAgent
							.toLowerCase()
							.match(/(edge|trident)\/(\d+)/)
					)
						return !1;
					return (
						("undefined" != typeof document &&
							document.documentElement &&
							document.documentElement.style &&
							document.documentElement.style.WebkitAppearance) ||
						("undefined" != typeof window &&
							window.console &&
							(window.console.firebug ||
								(window.console.exception &&
									window.console.table))) ||
						("undefined" != typeof navigator &&
							navigator.userAgent &&
							navigator.userAgent
								.toLowerCase()
								.match(/firefox\/(\d+)/) &&
							parseInt(RegExp.$1, 10) >= 31) ||
						("undefined" != typeof navigator &&
							navigator.userAgent &&
							navigator.userAgent
								.toLowerCase()
								.match(/applewebkit\/(\d+)/))
					);
				}),
				(t.storage = (function () {
					try {
						return localStorage;
					} catch (e) {}
				})()),
				(t.colors = [
					"#0000CC",
					"#0000FF",
					"#0033CC",
					"#0033FF",
					"#0066CC",
					"#0066FF",
					"#0099CC",
					"#0099FF",
					"#00CC00",
					"#00CC33",
					"#00CC66",
					"#00CC99",
					"#00CCCC",
					"#00CCFF",
					"#3300CC",
					"#3300FF",
					"#3333CC",
					"#3333FF",
					"#3366CC",
					"#3366FF",
					"#3399CC",
					"#3399FF",
					"#33CC00",
					"#33CC33",
					"#33CC66",
					"#33CC99",
					"#33CCCC",
					"#33CCFF",
					"#6600CC",
					"#6600FF",
					"#6633CC",
					"#6633FF",
					"#66CC00",
					"#66CC33",
					"#9900CC",
					"#9900FF",
					"#9933CC",
					"#9933FF",
					"#99CC00",
					"#99CC33",
					"#CC0000",
					"#CC0033",
					"#CC0066",
					"#CC0099",
					"#CC00CC",
					"#CC00FF",
					"#CC3300",
					"#CC3333",
					"#CC3366",
					"#CC3399",
					"#CC33CC",
					"#CC33FF",
					"#CC6600",
					"#CC6633",
					"#CC9900",
					"#CC9933",
					"#CCCC00",
					"#CCCC33",
					"#FF0000",
					"#FF0033",
					"#FF0066",
					"#FF0099",
					"#FF00CC",
					"#FF00FF",
					"#FF3300",
					"#FF3333",
					"#FF3366",
					"#FF3399",
					"#FF33CC",
					"#FF33FF",
					"#FF6600",
					"#FF6633",
					"#FF9900",
					"#FF9933",
					"#FFCC00",
					"#FFCC33"
				]),
				(e.exports = r(104)(t)),
				(e.exports.formatters.j = function (e) {
					try {
						return JSON.stringify(e);
					} catch (e) {
						return "[UnexpectedJSONParseError]: " + e.message;
					}
				});
		},
		function (e, t) {
			var r = 1e3,
				o = 6e4,
				n = 60 * o,
				s = 24 * n;
			function i(e, t, r, o) {
				var n = t >= 1.5 * r;
				return Math.round(e / r) + " " + o + (n ? "s" : "");
			}
			e.exports = function (e, t) {
				t = t || {};
				var a = typeof e;
				if ("string" === a && e.length > 0)
					return (function (e) {
						if ((e = String(e)).length > 100) return;
						var t =
							/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
								e
							);
						if (!t) return;
						var i = parseFloat(t[1]);
						switch ((t[2] || "ms").toLowerCase()) {
							case "years":
							case "year":
							case "yrs":
							case "yr":
							case "y":
								return 315576e5 * i;
							case "weeks":
							case "week":
							case "w":
								return 6048e5 * i;
							case "days":
							case "day":
							case "d":
								return i * s;
							case "hours":
							case "hour":
							case "hrs":
							case "hr":
							case "h":
								return i * n;
							case "minutes":
							case "minute":
							case "mins":
							case "min":
							case "m":
								return i * o;
							case "seconds":
							case "second":
							case "secs":
							case "sec":
							case "s":
								return i * r;
							case "milliseconds":
							case "millisecond":
							case "msecs":
							case "msec":
							case "ms":
								return i;
							default:
								return;
						}
					})(e);
				if ("number" === a && isFinite(e))
					return t.long
						? (function (e) {
								var t = Math.abs(e);
								if (t >= s) return i(e, t, s, "day");
								if (t >= n) return i(e, t, n, "hour");
								if (t >= o) return i(e, t, o, "minute");
								if (t >= r) return i(e, t, r, "second");
								return e + " ms";
							})(e)
						: (function (e) {
								var t = Math.abs(e);
								if (t >= s) return Math.round(e / s) + "d";
								if (t >= n) return Math.round(e / n) + "h";
								if (t >= o) return Math.round(e / o) + "m";
								if (t >= r) return Math.round(e / r) + "s";
								return e + "ms";
							})(e);
				throw new Error(
					"val is not a non-empty string or a valid number. val=" +
						JSON.stringify(e)
				);
			};
		},
		function (e, t, r) {
			"use strict";
			var o = r(134),
				n = r(135);
			(t.init = function (e) {
				e.inspectOpts = {};
				for (
					var r = Object.keys(t.inspectOpts), o = 0;
					o < r.length;
					o++
				)
					e.inspectOpts[r[o]] = t.inspectOpts[r[o]];
			}),
				(t.log = function () {
					return process.stderr.write(
						n.format.apply(n, arguments) + "\n"
					);
				}),
				(t.formatArgs = function (r) {
					var o = this.namespace;
					if (this.useColors) {
						var n = this.color,
							s = "[3" + (n < 8 ? n : "8;5;" + n),
							i = "  ".concat(s, ";1m").concat(o, " [0m");
						(r[0] = i + r[0].split("\n").join("\n" + i)),
							r.push(
								s + "m+" + e.exports.humanize(this.diff) + "[0m"
							);
					} else
						r[0] =
							(function () {
								if (t.inspectOpts.hideDate) return "";
								return new Date().toISOString() + " ";
							})() +
							o +
							" " +
							r[0];
				}),
				(t.save = function (e) {
					e ? (process.env.DEBUG = e) : delete process.env.DEBUG;
				}),
				(t.load = function () {
					return process.env.DEBUG;
				}),
				(t.useColors = function () {
					return "colors" in t.inspectOpts
						? Boolean(t.inspectOpts.colors)
						: o.isatty(process.stderr.fd);
				}),
				(t.colors = [6, 2, 3, 4, 5, 1]);
			try {
				var s = r(136);
				s &&
					(s.stderr || s).level >= 2 &&
					(t.colors = [
						20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45,
						56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81,
						92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149,
						160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170,
						171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199,
						200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214,
						215, 220, 221
					]);
			} catch (e) {}
			(t.inspectOpts = Object.keys(process.env)
				.filter(function (e) {
					return /^debug_/i.test(e);
				})
				.reduce(function (e, t) {
					var r = t
							.substring(6)
							.toLowerCase()
							.replace(/_([a-z])/g, function (e, t) {
								return t.toUpperCase();
							}),
						o = process.env[t];
					return (
						(o =
							!!/^(yes|on|true|enabled)$/i.test(o) ||
							(!/^(no|off|false|disabled)$/i.test(o) &&
								("null" === o ? null : Number(o)))),
						(e[r] = o),
						e
					);
				}, {})),
				(e.exports = r(104)(t));
			var i = e.exports.formatters;
			(i.o = function (e) {
				return (
					(this.inspectOpts.colors = this.useColors),
					n
						.inspect(e, this.inspectOpts)
						.split("\n")
						.map(function (e) {
							return e.trim();
						})
						.join(" ")
				);
			}),
				(i.O = function (e) {
					return (
						(this.inspectOpts.colors = this.useColors),
						n.inspect(e, this.inspectOpts)
					);
				});
		},
		function (e, t) {
			e.exports = require("tty");
		},
		function (e, t) {
			e.exports = require("util");
		},
		function (e, t, r) {
			"use strict";
			const o = r(137),
				n = r(138),
				s = process.env;
			let i;
			function a(e) {
				return (function (e) {
					return (
						0 !== e && {
							level: e,
							hasBasic: !0,
							has256: e >= 2,
							has16m: e >= 3
						}
					);
				})(
					(function (e) {
						if (!1 === i) return 0;
						if (
							n("color=16m") ||
							n("color=full") ||
							n("color=truecolor")
						)
							return 3;
						if (n("color=256")) return 2;
						if (e && !e.isTTY && !0 !== i) return 0;
						const t = i ? 1 : 0;
						if ("win32" === process.platform) {
							const e = o.release().split(".");
							return Number(
								process.versions.node.split(".")[0]
							) >= 8 &&
								Number(e[0]) >= 10 &&
								Number(e[2]) >= 10586
								? Number(e[2]) >= 14931
									? 3
									: 2
								: 1;
						}
						if ("CI" in s)
							return [
								"TRAVIS",
								"CIRCLECI",
								"APPVEYOR",
								"GITLAB_CI"
							].some(e => e in s) || "codeship" === s.CI_NAME
								? 1
								: t;
						if ("TEAMCITY_VERSION" in s)
							return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(
								s.TEAMCITY_VERSION
							)
								? 1
								: 0;
						if ("truecolor" === s.COLORTERM) return 3;
						if ("TERM_PROGRAM" in s) {
							const e = parseInt(
								(s.TERM_PROGRAM_VERSION || "").split(".")[0],
								10
							);
							switch (s.TERM_PROGRAM) {
								case "iTerm.app":
									return e >= 3 ? 3 : 2;
								case "Apple_Terminal":
									return 2;
							}
						}
						return /-256(color)?$/i.test(s.TERM)
							? 2
							: /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(
										s.TERM
								  ) || "COLORTERM" in s
								? 1
								: (s.TERM, t);
					})(e)
				);
			}
			n("no-color") || n("no-colors") || n("color=false")
				? (i = !1)
				: (n("color") ||
						n("colors") ||
						n("color=true") ||
						n("color=always")) &&
					(i = !0),
				"FORCE_COLOR" in s &&
					(i =
						0 === s.FORCE_COLOR.length ||
						0 !== parseInt(s.FORCE_COLOR, 10)),
				(e.exports = {
					supportsColor: a,
					stdout: a(process.stdout),
					stderr: a(process.stderr)
				});
		},
		function (e, t) {
			e.exports = require("os");
		},
		function (e, t, r) {
			"use strict";
			e.exports = (e, t) => {
				t = t || process.argv;
				const r = e.startsWith("-") ? "" : 1 === e.length ? "-" : "--",
					o = t.indexOf(r + e),
					n = t.indexOf("--");
				return -1 !== o && (-1 === n || o < n);
			};
		},
		function (e, t) {
			e.exports = require("zlib");
		},
		function (e, t, r) {
			"use strict";
			var o = r(105),
				n = {};
			[
				"object",
				"boolean",
				"number",
				"function",
				"string",
				"symbol"
			].forEach(function (e, t) {
				n[e] = function (r) {
					return typeof r === e || "a" + (t < 1 ? "n " : " ") + e;
				};
			});
			var s = {},
				i = o.version.split(".");
			function a(e, t) {
				for (
					var r = t ? t.split(".") : i, o = e.split("."), n = 0;
					n < 3;
					n++
				) {
					if (r[n] > o[n]) return !0;
					if (r[n] < o[n]) return !1;
				}
				return !1;
			}
			(n.transitional = function (e, t, r) {
				var n = t && a(t);
				function i(e, t) {
					return (
						"[Axios v" +
						o.version +
						"] Transitional option '" +
						e +
						"'" +
						t +
						(r ? ". " + r : "")
					);
				}
				return function (r, o, a) {
					if (!1 === e)
						throw new Error(i(o, " has been removed in " + t));
					return (
						n &&
							!s[o] &&
							((s[o] = !0),
							console.warn(
								i(
									o,
									" has been deprecated since v" +
										t +
										" and will be removed in the near future"
								)
							)),
						!e || e(r, o, a)
					);
				};
			}),
				(e.exports = {
					isOlderVersion: a,
					assertOptions: function (e, t, r) {
						if ("object" != typeof e)
							throw new TypeError("options must be an object");
						for (var o = Object.keys(e), n = o.length; n-- > 0; ) {
							var s = o[n],
								i = t[s];
							if (i) {
								var a = e[s],
									c = void 0 === a || i(a, s, e);
								if (!0 !== c)
									throw new TypeError(
										"option " + s + " must be " + c
									);
							} else if (!0 !== r)
								throw Error("Unknown option " + s);
						}
					},
					validators: n
				});
		},
		function (e, t, r) {
			"use strict";
			var o = r(108);
			function n(e) {
				if ("function" != typeof e)
					throw new TypeError("executor must be a function.");
				var t;
				this.promise = new Promise(function (e) {
					t = e;
				});
				var r = this;
				e(function (e) {
					r.reason || ((r.reason = new o(e)), t(r.reason));
				});
			}
			(n.prototype.throwIfRequested = function () {
				if (this.reason) throw this.reason;
			}),
				(n.source = function () {
					var e;
					return {
						token: new n(function (t) {
							e = t;
						}),
						cancel: e
					};
				}),
				(e.exports = n);
		},
		function (e, t, r) {
			"use strict";
			e.exports = function (e) {
				return function (t) {
					return e.apply(null, t);
				};
			};
		},
		function (e, t, r) {
			"use strict";
			e.exports = function (e) {
				return "object" == typeof e && !0 === e.isAxiosError;
			};
		}
	])
);
