//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, g = h.trustedTypes, _ = g ? g.emptyScript : "", v = h.reactiveElementPolyfillSupport, y = (e, t) => e, b = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? _ : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, x = (e, t) => !l(e, t), S = {
	attribute: !0,
	type: String,
	converter: b,
	reflect: !1,
	useDefault: !1,
	hasChanged: x
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var C = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = S) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? S;
	}
	static _$Ei() {
		if (this.hasOwnProperty(y("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(y("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(y("properties"))) {
			let e = this.properties, t = [...f(e), ...p(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? b : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? b : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? x)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[y("elementProperties")] = /* @__PURE__ */ new Map(), C[y("finalized")] = /* @__PURE__ */ new Map(), v?.({ ReactiveElement: C }), (h.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var w = globalThis, ee = (e) => e, T = w.trustedTypes, te = T ? T.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ne = "$lit$", E = `lit$${Math.random().toFixed(9).slice(2)}$`, re = "?" + E, ie = `<${re}>`, D = document, O = () => D.createComment(""), k = (e) => e === null || typeof e != "object" && typeof e != "function", A = Array.isArray, ae = (e) => A(e) || typeof e?.[Symbol.iterator] == "function", j = "[ 	\n\f\r]", M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, oe = /-->/g, se = />/g, N = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ce = /'/g, P = /"/g, le = /^(?:script|style|textarea|title)$/i, F = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), I = Symbol.for("lit-noChange"), L = Symbol.for("lit-nothing"), ue = /* @__PURE__ */ new WeakMap(), R = D.createTreeWalker(D, 129);
function de(e, t) {
	if (!A(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return te === void 0 ? t : te.createHTML(t);
}
var fe = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = M;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === M ? c[1] === "!--" ? o = oe : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = N) : (le.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = N) : o = se : o === N ? c[0] === ">" ? (o = i ?? M, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? N : c[3] === "\"" ? P : ce) : o === P || o === ce ? o = N : o === oe || o === se ? o = M : (o = N, i = void 0);
		let d = o === N && e[t + 1].startsWith("/>") ? " " : "";
		a += o === M ? n + ie : l >= 0 ? (r.push(s), n.slice(0, l) + ne + n.slice(l) + E + d) : n + E + (l === -2 ? t : d);
	}
	return [de(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, z = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = fe(t, n);
		if (this.el = e.createElement(l, r), R.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = R.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ne)) {
					let t = u[o++], n = i.getAttribute(e).split(E), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? me : r[1] === "?" ? he : r[1] === "@" ? ge : H
					}), i.removeAttribute(e);
				} else e.startsWith(E) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (le.test(i.tagName)) {
					let e = i.textContent.split(E), t = e.length - 1;
					if (t > 0) {
						i.textContent = T ? T.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], O()), R.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], O());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === re) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(E, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += E.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = D.createElement("template");
		return n.innerHTML = e, n;
	}
};
function B(e, t, n = e, r) {
	if (t === I) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = k(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = B(e, i._$AS(e, t.values), i, r)), t;
}
var pe = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? D).importNode(t, !0);
		R.currentNode = r;
		let i = R.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new V(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new _e(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = R.nextNode(), a++);
		}
		return R.currentNode = D, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, V = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = L, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = B(this, e, t), k(e) ? e === L || e == null || e === "" ? (this._$AH !== L && this._$AR(), this._$AH = L) : e !== this._$AH && e !== I && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ae(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== L && k(this._$AH) ? this._$AA.nextSibling.data = e : this.T(D.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = z.createElement(de(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new pe(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = ue.get(e.strings);
		return t === void 0 && ue.set(e.strings, t = new z(e)), t;
	}
	k(t) {
		A(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(O()), this.O(O()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ee(e).nextSibling;
			ee(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, H = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = L, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = L;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = B(this, e, t, 0), a = !k(e) || e !== this._$AH && e !== I, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = B(this, r[n + o], t, o), s === I && (s = this._$AH[o]), a ||= !k(s) || s !== this._$AH[o], s === L ? e = L : e !== L && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === L ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, me = class extends H {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === L ? void 0 : e;
	}
}, he = class extends H {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== L);
	}
}, ge = class extends H {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = B(this, e, t, 0) ?? L) === I) return;
		let n = this._$AH, r = e === L && n !== L || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== L && (n === L || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, _e = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		B(this, e);
	}
}, ve = w.litHtmlPolyfillSupport;
ve?.(z, V), (w.litHtmlVersions ??= []).push("3.3.3");
var ye = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new V(t.insertBefore(O(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, U = globalThis, W = class extends C {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ye(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return I;
	}
};
W._$litElement$ = !0, W.finalized = !0, U.litElementHydrateSupport?.({ LitElement: W });
var be = U.litElementPolyfillSupport;
be?.({ LitElement: W }), (U.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region src/station.ts
var xe = [
	{
		key: "humidity_entity",
		label: "humidity",
		icon: "mdi:water-percent",
		minimum: 0,
		maximum: 100
	},
	{
		key: "dew_point_entity",
		label: "dewPoint",
		icon: "mdi:thermometer-water",
		minimum: -Infinity,
		maximum: Infinity
	},
	{
		key: "wind_speed_entity",
		label: "windSpeed",
		icon: "mdi:weather-windy",
		minimum: 0,
		maximum: Infinity
	},
	{
		key: "wind_gust_entity",
		label: "windGust",
		icon: "mdi:weather-windy",
		minimum: 0,
		maximum: Infinity
	},
	{
		key: "wind_direction_entity",
		label: "windDirection",
		icon: "mdi:compass-outline",
		minimum: -Infinity,
		maximum: Infinity
	},
	{
		key: "uv_index_entity",
		label: "uvIndex",
		icon: "mdi:weather-sunny-alert",
		minimum: 0,
		maximum: Infinity
	},
	{
		key: "illuminance_entity",
		label: "illuminance",
		icon: "mdi:brightness-6",
		minimum: 0,
		maximum: Infinity
	}
];
function G(e) {
	if (typeof e != "number" && typeof e != "string" || typeof e == "string" && !e.trim()) return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function K(e, t) {
	let n = t ? e?.states[t] : void 0;
	return {
		value: G(n?.state),
		unit: typeof n?.attributes.unit_of_measurement == "string" ? n.attributes.unit_of_measurement : ""
	};
}
function q(e, t) {
	return xe.flatMap((n) => {
		let r = t?.[n.key];
		if (!r) return [];
		let i = K(e, r), a = i.value !== void 0 && i.value >= n.minimum && i.value <= n.maximum ? i.value : void 0;
		return [{
			...n,
			...i,
			value: a,
			entityId: r
		}];
	});
}
//#endregion
//#region src/forecast.ts
function Se(e, t, n) {
	let r = t.getTime();
	if (!Number.isFinite(r) || n <= 0) return [];
	let i = /* @__PURE__ */ new Map();
	for (let t of e ?? []) {
		if (!t || typeof t.datetime != "string") continue;
		let e = Date.parse(t.datetime), n = G(t.temperature);
		if (!Number.isFinite(e) || e < r || e >= r + 864e5 || n === void 0) continue;
		let a = G(t.precipitation_probability);
		i.has(e) || i.set(e, {
			timestamp: e,
			temperature: n,
			condition: typeof t.condition == "string" ? t.condition : void 0,
			probability: a !== void 0 && a >= 0 && a <= 100 ? a : void 0
		});
	}
	return [...i.values()].sort((e, t) => e.timestamp - t.timestamp).slice(0, n);
}
function Ce(e, t) {
	try {
		let n = new Intl.DateTimeFormat("en-CA", {
			timeZone: t,
			year: "numeric",
			month: "2-digit",
			day: "2-digit"
		}).formatToParts(e), r = Object.fromEntries(n.map((e) => [e.type, e.value]));
		return `${r.year}-${r.month}-${r.day}`;
	} catch {
		return;
	}
}
function we(e, t) {
	try {
		let n = new Intl.DateTimeFormat("en", {
			timeZone: t,
			hour: "2-digit",
			hourCycle: "h23"
		}).format(e), r = Number(n);
		return Number.isInteger(r) ? r : void 0;
	} catch {
		return;
	}
}
function J(e) {
	if (typeof e != "number" && typeof e != "string" || typeof e == "string" && e.trim() === "") return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function Te(e, t, n = "UTC") {
	if (!e?.length || !Number.isFinite(t.getTime())) return;
	let r = Ce(t, n);
	if (!r) return;
	let i = e.flatMap((e) => {
		if (typeof e.datetime != "string") return [];
		let t = new Date(e.datetime);
		return !Number.isFinite(t.getTime()) || Ce(t, n) !== r ? [] : [{
			period: e,
			timestamp: t
		}];
	});
	if (!i.length) return;
	let a = i.find(({ period: e }) => e.is_daytime === !0), o = i.find(({ period: e }) => e.is_daytime === !1), s = o?.timestamp;
	if (s ? t.getTime() >= s.getTime() : (we(t, n) ?? 0) >= 17) {
		let e = J(o?.period.temperature) ?? J(a?.period.templow) ?? J(i[0].period.templow) ?? J(o?.period.templow);
		return e === void 0 ? void 0 : {
			kind: "low",
			temperature: e
		};
	}
	let c = J(a?.period.temperature) ?? J(i[0].period.temperature);
	return c === void 0 ? void 0 : {
		kind: "high",
		temperature: c
	};
}
//#endregion
//#region src/localization.ts
var Ee = { en: {
	temperature: "Outdoor temperature",
	cardHeader: "Card header (optional)",
	unavailable: "Unavailable",
	chooseTemperature: "Choose an outdoor weather-station temperature sensor in the card configuration.",
	temperatureEntity: "Outdoor / weather-station temperature sensor",
	humidity: "Humidity",
	dewPoint: "Dew point",
	windSpeed: "Wind speed",
	windGust: "Wind gust",
	windDirection: "Wind direction (from)",
	uvIndex: "UV index",
	illuminance: "Illuminance",
	rainfall: "Rainfall",
	rainfallRate: "Rain rate",
	rainfallToday: "Rain today",
	rainfallWeek: "Rain this week",
	rainStateEntity: "Rain-state binary sensor",
	wet: "Raining",
	dry: "Dry",
	unknown: "Rain status unavailable",
	heavyRain: "Heavy rain",
	rainfallHistory: "Rain rate: hourly peaks (24 h)",
	rainfallHistoryLoading: "Loading rain history",
	rainfallHistoryEmpty: "No usable rain history",
	rainfallHistoryError: "Rain history unavailable",
	rainfallHistoryStale: "History stale; last loaded",
	peakRate: "Peak rate",
	adaptiveMetrics: "Adaptive metric emphasis",
	showRainfallHistory: "Rain-rate history",
	strongWind: "Strong wind",
	highUv: "High UV",
	stationMetrics: "Optional station sensors",
	hourlyForecast: "Hourly forecast",
	hourlyLoading: "Loading hourly forecast",
	layout: "Layout",
	auto: "Automatic",
	compact: "Compact",
	standard: "Standard",
	wide: "Wide",
	precipitationProbability: "Precipitation probability",
	"clear-night": "Clear night",
	cloudy: "Cloudy",
	fog: "Fog",
	hail: "Hail",
	lightning: "Lightning",
	"lightning-rainy": "Lightning and rain",
	partlycloudy: "Partly cloudy",
	pouring: "Heavy rain",
	rainy: "Rain",
	snowy: "Snow",
	"snowy-rainy": "Snow and rain",
	sunny: "Sunny",
	windy: "Windy",
	"windy-variant": "Windy and cloudy",
	exceptional: "Exceptional weather",
	N: "N",
	NNE: "NNE",
	NE: "NE",
	ENE: "ENE",
	E: "E",
	ESE: "ESE",
	SE: "SE",
	SSE: "SSE",
	S: "S",
	SSW: "SSW",
	SW: "SW",
	WSW: "WSW",
	W: "W",
	WNW: "WNW",
	NW: "NW",
	NNW: "NNW",
	forecastHigh: "Today's forecast high",
	forecastLow: "Tonight's forecast low",
	forecastSummary: "Forecast summary",
	forecastUnavailable: "Forecast unavailable",
	weatherEntity: "Weather entity"
} };
function Y(e, t) {
	let n = e?.toLowerCase().split("-")[0];
	return Ee[n && n in Ee ? n : "en"][t];
}
//#endregion
//#region src/compass.ts
var De = [
	"N",
	"NNE",
	"NE",
	"ENE",
	"E",
	"ESE",
	"SE",
	"SSE",
	"S",
	"SSW",
	"SW",
	"WSW",
	"W",
	"WNW",
	"NW",
	"NNW"
];
function Oe(e) {
	return Number.isFinite(e) ? (e % 360 + 360) % 360 : void 0;
}
function ke(e, t = 16) {
	let n = Oe(e);
	if (n === void 0) return;
	let r = Math.round(n / (360 / t)) % t;
	return De[16 / t * r];
}
//#endregion
//#region src/station-metrics.ts
function Ae(e, t, n, r, i = {}) {
	if (!e.length) return "";
	let a = new Intl.NumberFormat(t || "en", { maximumFractionDigits: 1 });
	return F`
    <section class="station-metrics" aria-label=${Y(t, "stationMetrics")}>
      ${e.map((e) => {
		let o = e.key === "wind_direction_entity" && e.value !== void 0 ? ke(e.value, n === "compact" ? 8 : 16) : void 0, s = e.value === void 0 ? Y(t, "unavailable") : o ? `${Y(t, o)} (${a.format(Oe(e.value))}°)` : `${a.format(e.value)} ${e.unit}`, c = i[e.key], l = e.key.startsWith("wind_") || e.key === "uv_index_entity";
		return F`
          <button type="button" class="metric sensor-reading" data-metric=${e.key} data-emphasis=${c ?? "none"}
            @click=${() => r(e.entityId)}>
            <span class="label"><ha-icon .icon=${e.icon} aria-hidden="true"></ha-icon>${Y(t, e.label)}</span>
            <span class="metric-value">${s}</span>
            ${l ? F`<span class="metric-reason">${c ? Y(t, c) : ""}</span>` : ""}
          </button>
        `;
	})}
    </section>
  `;
}
//#endregion
//#region src/forecast-stream.ts
var je = class {
	constructor(e) {
		this.changed = e, this.status = "idle", this.generation = 0;
	}
	stop() {
		this.generation += 1, this.unsubscribe?.(), this.unsubscribe = void 0, this.key = void 0, this.connection = void 0, this.forecast = void 0, this.status = "idle";
	}
	async sync(e, t, n) {
		if (!e || !t || !n) {
			(this.key || this.status !== "idle") && (this.stop(), this.changed());
			return;
		}
		let r = `${t}:${n}`;
		if (r === this.key && e === this.connection) return;
		this.stop();
		let i = this.generation;
		this.key = r, this.connection = e, this.status = "loading", this.changed();
		try {
			let r = await e.subscribeMessage((e) => {
				i === this.generation && (this.forecast = Array.isArray(e.forecast) ? e.forecast : void 0, this.status = "ready", this.changed());
			}, {
				type: "weather/subscribe_forecast",
				entity_id: t,
				forecast_type: n
			});
			i === this.generation ? this.unsubscribe = r : r();
		} catch {
			if (i !== this.generation) return;
			this.key = void 0, this.connection = void 0, this.forecast = void 0, this.status = "error", this.changed();
		}
	}
}, Me = {
	compact: 4,
	standard: 8,
	wide: 12
}, X = {
	compact: 2,
	standard: 3,
	wide: 4
};
function Ne(e, t = "auto") {
	return t === "auto" ? !Number.isFinite(e) || e <= 0 ? "standard" : e < 360 ? "compact" : e < 600 ? "standard" : "wide" : t;
}
//#endregion
//#region src/hourly-forecast.ts
var Z = {
	"clear-night": "mdi:weather-night",
	cloudy: "mdi:weather-cloudy",
	fog: "mdi:weather-fog",
	hail: "mdi:weather-hail",
	lightning: "mdi:weather-lightning",
	"lightning-rainy": "mdi:weather-lightning-rainy",
	partlycloudy: "mdi:weather-partly-cloudy",
	pouring: "mdi:weather-pouring",
	rainy: "mdi:weather-rainy",
	snowy: "mdi:weather-snowy",
	"snowy-rainy": "mdi:weather-snowy-rainy",
	sunny: "mdi:weather-sunny",
	windy: "mdi:weather-windy",
	"windy-variant": "mdi:weather-windy-variant",
	exceptional: "mdi:alert-circle-outline"
};
function Pe(e, t, n, r) {
	let i;
	try {
		i = new Intl.DateTimeFormat(t || "en", {
			timeZone: n,
			hour: "numeric",
			minute: "2-digit"
		});
	} catch {
		i = new Intl.DateTimeFormat("en", {
			timeZone: "UTC",
			hour: "numeric",
			minute: "2-digit"
		});
	}
	let a = new Intl.NumberFormat(t || "en", { maximumFractionDigits: 1 });
	return F`
    <div class="hourly-strip" role="list" tabindex="0" aria-label=${Y(t, "hourlyForecast")}>
      ${e.map((e) => F`
        <div class="hourly-period" role="listitem">
          <time datetime=${new Date(e.timestamp).toISOString()}>${i.format(e.timestamp)}</time>
          ${e.condition && Object.hasOwn(Z, e.condition) ? F`<ha-icon .icon=${Z[e.condition]} role="img" aria-label=${Y(t, e.condition)}></ha-icon>` : ""}
          <div class="hourly-temperature">${a.format(e.temperature)} ${r}</div>
          ${e.probability === void 0 ? "" : F`
            <div class="hourly-probability" aria-label=${`${Y(t, "precipitationProbability")}: ${a.format(e.probability)}%`}>
              <ha-icon icon="mdi:water" aria-hidden="true"></ha-icon>${a.format(e.probability)}%
            </div>`}
        </div>
      `)}
    </div>
  `;
}
//#endregion
//#region src/rainfall.ts
var Fe = [
	{
		key: "rainfall_rate_entity",
		label: "rainfallRate",
		icon: "mdi:weather-pouring"
	},
	{
		key: "rainfall_today_entity",
		label: "rainfallToday",
		icon: "mdi:water"
	},
	{
		key: "rainfall_week_entity",
		label: "rainfallWeek",
		icon: "mdi:calendar-week"
	}
], Q = 36e5;
function Ie(e, t) {
	return Fe.flatMap((n) => {
		if (!t?.[n.key]) return [];
		let r = K(e, t[n.key]);
		return [{
			...n,
			...r,
			value: r.value !== void 0 && r.value >= 0 ? r.value : void 0
		}];
	});
}
function Le(e, t) {
	let n = t?.rain_state_entity ? e?.states[t.rain_state_entity]?.state : void 0;
	if (n === "on") return "wet";
	if (n === "off") return "dry";
	let r = K(e, t?.rainfall_rate_entity).value;
	return r !== void 0 && r >= 0 ? r > 0 ? "wet" : "dry" : "unknown";
}
function Re(e, t, n, r = t) {
	let i = t - 24 * Q, a = Array.from({ length: 24 }, (e, t) => ({
		start: i + t * Q,
		coverage: 0,
		peak: 0
	})), o = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = n.last_updated ?? n.last_changed, i = typeof e == "string" ? Date.parse(e) : NaN;
		Number.isFinite(i) && i < Math.min(t, r) && o.set(i, n);
	}
	let s = [...o.entries()].sort(([e], [t]) => e - t);
	for (let e = 0; e < s.length; e += 1) {
		let [o, c] = s[e], l = G(c.state);
		if (l === void 0 || l < 0 || !n || c.attributes?.unit_of_measurement !== n) continue;
		let u = Math.max(o, i), d = Math.min(s[e + 1]?.[0] ?? r, t, r);
		for (let e of a) {
			let t = Math.min(d, e.start + Q) - Math.max(u, e.start);
			t > 0 && (e.coverage += t, e.peak = Math.max(e.peak, l));
		}
	}
	return a.map((e) => ({
		start: e.start,
		peak: e.coverage === 36e5 ? e.peak : void 0
	}));
}
//#endregion
//#region src/rainfall-history.ts
var ze = class {
	constructor(e) {
		this.changed = e, this.records = [], this.status = "idle", this.generation = 0, this.pending = !1;
	}
	stop() {
		this.generation += 1, this.timer && clearInterval(this.timer), this.timer = void 0, this.hass = void 0, this.entityId = void 0, this.pending = !1, this.records = [], this.fetchedAt = void 0, this.status = "idle";
	}
	sync(e, t) {
		if (!e || !t) {
			this.entityId && (this.stop(), this.changed());
			return;
		}
		if (t === this.entityId && e.connection === this.hass?.connection && e.callApi === this.hass?.callApi) {
			this.hass = e;
			return;
		}
		this.stop(), this.hass = e, this.entityId = t, this.timer = setInterval(() => void this.fetch(), 3e5), this.fetch();
	}
	async fetch() {
		if (this.pending || !this.hass || !this.entityId) return;
		let e = this.generation, t = Date.now();
		this.pending = !0, this.fetchedAt === void 0 && (this.status = "loading"), this.changed();
		try {
			if (!this.hass.callApi) throw Error("History API unavailable");
			let n = new URLSearchParams({
				filter_entity_id: this.entityId,
				end_time: new Date(t).toISOString()
			}), r = `history/period/${encodeURIComponent((/* @__PURE__ */ new Date(t - 24 * Q)).toISOString())}?${n}`, i = await this.hass.callApi("GET", r);
			if (e !== this.generation) return;
			if (!Array.isArray(i) || i.length && !Array.isArray(i[0])) throw Error("Invalid history response");
			let a = i[0] ?? [];
			this.records = a.filter((e) => typeof e == "object" && !!e && !Array.isArray(e)), this.fetchedAt = t, this.status = this.records.length ? "ready" : "empty";
		} catch {
			if (e !== this.generation) return;
			this.status = "error";
		} finally {
			e === this.generation && (this.pending = !1, this.changed());
		}
	}
}, Be = {
	"m/s": 1,
	"km/h": 1 / 3.6,
	mph: .44704,
	kn: .5144444444444445,
	knots: .5144444444444445
}, Ve = {
	"mm/h": 1,
	"in/h": 25.4
};
function He(e, t, n) {
	let r = Object.hasOwn(n, e.unit) ? n[e.unit] : void 0;
	return r !== void 0 && e.value !== void 0 && e.value >= t / r;
}
function Ue(e, t) {
	let n = {}, r = Le(e, t), i = r === "wet" && He(K(e, t?.rainfall_rate_entity), 7.5, Ve);
	if (t?.adaptive_metrics === !1) return {
		metrics: n,
		rain: r,
		heavyRain: i,
		rainfall: "none"
	};
	let a = [t?.wind_speed_entity, t?.wind_gust_entity].some((t) => He(K(e, t), 8, Be));
	for (let r of q(e, t)) r.value !== void 0 && (a && r.key.startsWith("wind_") && (n[r.key] = "strongWind"), r.key === "uv_index_entity" && r.value >= 6 && (n[r.key] = "highUv"));
	return {
		metrics: n,
		rain: r,
		heavyRain: i,
		rainfall: r === "wet" ? i ? "heavy" : "wet" : "none"
	};
}
//#endregion
//#region src/rainfall-section.ts
function We(e, t, n, r, i, a) {
	let o = Ie(e, t);
	if (!o.length && !t?.rain_state_entity) return "";
	let s = e?.language, c = new Intl.NumberFormat(s || "en", { maximumFractionDigits: 2 }), l = new Intl.DateTimeFormat(s || "en", {
		timeZone: i,
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		timeZoneName: "short"
	}), u = K(e, t?.rainfall_rate_entity).unit, d = n.status === "error" && n.fetchedAt !== void 0, f = d ? Date.now() : n.fetchedAt ?? Date.now(), p = Re(n.records, f, u, n.fetchedAt ?? f), m = p.flatMap((e) => e.peak === void 0 ? [] : [e.peak]), h = m.length ? Math.max(...m) : void 0, g = Math.max(h ?? 0, 1), _ = p.map((e, t) => {
		if (e.peak === void 0) return "";
		let n = (74 - e.peak / g * 64).toFixed(2);
		return `${t && p[t - 1].peak !== void 0 ? "L" : "M"}${t * 10},${n} H${(t + 1) * 10}`;
	}).join(" "), v = h === void 0 ? "" : `${Y(s, "peakRate")}: ${c.format(h)} ${u}`, y = `${l.format(f - 24 * Q)} - ${l.format(f)}`, b = r.heavyRain ? "heavyRain" : r.rain, x = n.status === "loading" || n.status === "idle" ? "rainfallHistoryLoading" : n.status === "error" ? "rainfallHistoryError" : "rainfallHistoryEmpty";
	return F`
    <section class="rainfall" data-emphasis=${r.rainfall} aria-label=${Y(s, "rainfall")}>
      <div class="rainfall-heading">
        <div class="label">${Y(s, "rainfall")}</div>
        <div class="rainfall-status"><ha-icon icon="mdi:weather-pouring" aria-hidden="true"></ha-icon>${Y(s, b)}</div>
      </div>
      ${o.length ? F`
        <div class="rainfall-metrics">
          ${o.map((e) => F`
            <button type="button" class="rainfall-metric sensor-reading" data-rainfall=${e.key}
              @click=${() => a(t?.[e.key] ?? "")}>
              <span class="label"><ha-icon .icon=${e.icon} aria-hidden="true"></ha-icon>${Y(s, e.label)}</span>
              <span class="metric-value">${e.value === void 0 ? Y(s, "unavailable") : `${c.format(e.value)} ${e.unit}`}</span>
            </button>
          `)}
        </div>
      ` : ""}
      ${t?.rainfall_rate_entity && t.show_rainfall_history !== !1 ? F`
        <div class="rainfall-history">
          <div class="label">${Y(s, "rainfallHistory")}</div>
          ${h === void 0 ? F`<div class="rainfall-placeholder" role="status">${Y(s, x)}</div>` : F`
            <svg class="rainfall-plot" viewBox="0 0 240 80" preserveAspectRatio="none" role="img"
              aria-label=${`${Y(s, "rainfallHistory")}. ${y}. ${v}`}>
              <path d=${_} fill="none" vector-effect="non-scaling-stroke"></path>
            </svg>
          `}
          <div class="rainfall-caption"><span>${v}</span><span>${y}</span></div>
          <div class="rainfall-history-status" role="status">${d ? `${Y(s, "rainfallHistoryStale")} ${l.format(n.fetchedAt)}` : ""}</div>
        </div>
      ` : ""}
    </section>
  `;
}
//#endregion
//#region src/skyscoop-card.ts
var $ = "skyscoop-card", Ge = {
	"clear-night": "neutral",
	cloudy: "neutral",
	fog: "neutral",
	hail: "cold",
	lightning: "storm",
	"lightning-rainy": "storm",
	partlycloudy: "warm",
	pouring: "wet",
	rainy: "wet",
	snowy: "cold",
	"snowy-rainy": "cold",
	sunny: "warm",
	windy: "neutral",
	"windy-variant": "neutral",
	exceptional: "storm"
}, Ke = class extends W {
	constructor(...e) {
		super(...e), this.summaryStream = new je(() => this.requestUpdate()), this.hourlyStream = new je(() => this.requestUpdate()), this.rainfallHistory = new ze(() => this.requestUpdate()), this.widthLayout = "standard", this.showMoreInfo = (e) => {
			e && this.dispatchEvent(new CustomEvent("hass-more-info", {
				detail: { entityId: e },
				bubbles: !0,
				composed: !0
			}));
		};
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			config: { attribute: !1 },
			widthLayout: { state: !0 }
		};
	}
	static {
		this.styles = o`
    :host {
      display: block;
      container-type: inline-size;
      --skyscoop-accent: var(--primary-color, #347f78);
      --skyscoop-weather-accent: var(--primary-color, #347f78);
      --skyscoop-muted: var(--secondary-text-color, #64716f);
    }

    ha-card[data-weather-tone="warm"] { --skyscoop-weather-accent: var(--warning-color, var(--primary-color, #347f78)); }
    ha-card[data-weather-tone="storm"] { --skyscoop-weather-accent: var(--error-color, var(--primary-color, #347f78)); }
    ha-card[data-weather-tone="cold"] { --skyscoop-weather-accent: var(--info-color, var(--primary-color, #347f78)); }

    ha-card {
      min-height: 112px;
      color: var(--primary-text-color, #202927);
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
    }

    .content {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }

    .temperature-row {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 16px;
      min-width: 0;
    }

    .temperature-row.has-temperature.has-forecast {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .reading { min-width: 0; }

    .sensor-reading {
      display: block;
      width: 100%;
      min-width: 0;
      appearance: none;
      border: 0;
      border-radius: 4px;
      padding: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: start;
      align-content: start;
      cursor: pointer;
    }

    .sensor-reading:hover { background: var(--secondary-background-color, rgba(127, 127, 127, 0.08)); }
    .sensor-reading:focus-visible { outline: 2px solid var(--skyscoop-accent); outline-offset: 4px; }

    .summary-label {
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 30px;
    }

    .summary-icon {
      display: grid;
      place-items: center;
      width: 28px;
      height: 28px;
      flex: 0 0 28px;
      border-radius: 50%;
      color: var(--skyscoop-accent);
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
    }

    .summary-icon.current-condition-icon {
      color: var(--skyscoop-weather-accent);
      background: color-mix(in srgb, var(--skyscoop-weather-accent) 14%, transparent);
    }

    .summary-icon ha-icon { --mdc-icon-size: 18px; }

    .forecast-summary {
      min-width: 0;
      border-inline-start: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      padding-inline-start: 16px;
    }

    .value-line {
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      column-gap: 8px;
    }

    .label {
      color: var(--skyscoop-muted);
      font-size: 0.875rem;
    }

    .temperature {
      color: var(--skyscoop-weather-accent);
      font-size: 2.5rem;
      font-weight: 600;
      line-height: 1.15;
      font-variant-numeric: tabular-nums;
      overflow-wrap: anywhere;
    }

    .forecast-summary .summary-icon { color: var(--skyscoop-muted); }

    .message {
      grid-column: 1 / -1;
      color: var(--skyscoop-muted);
      font-size: 0.875rem;
    }

    .unit {
      color: var(--skyscoop-muted);
      font-size: 0.9375rem;
    }

    .forecast-value {
      color: var(--primary-text-color, #202927);
      font-size: 1.75rem;
      font-weight: 500;
      line-height: 1.2;
      font-variant-numeric: tabular-nums;
    }

    .station-metrics {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(var(--metric-columns, 2), minmax(0, 1fr));
      column-gap: 16px;
      row-gap: 20px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      padding-top: 16px;
    }

    .metric { min-width: 0; overflow-wrap: anywhere; }
    .metric .label { display: flex; align-items: center; gap: 4px; font-size: 0.875rem; line-height: 1.3; }
    .metric-value { display: block; margin-top: 6px; font-size: 1rem; font-weight: 500; line-height: 1.3; font-variant-numeric: tabular-nums; }
    .metric ha-icon { --mdc-icon-size: 18px; color: var(--skyscoop-muted); }
    .metric-reason { display: block; min-height: 1.1rem; font-size: 0.75rem; line-height: 1.1rem; color: var(--skyscoop-muted); }
    .metric[data-emphasis="strongWind"] .metric-value, .metric[data-emphasis="highUv"] .metric-value { font-weight: 700; }
    .metric[data-emphasis="strongWind"] ha-icon, .metric[data-emphasis="highUv"] ha-icon { color: var(--skyscoop-accent); }
    .rainfall { grid-column: 1 / -1; min-width: 0; border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2)); padding-top: 16px; }
    .rainfall-heading { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); align-items: center; gap: 8px; min-height: 2.5rem; }
    .rainfall-status { display: flex; justify-content: end; align-items: center; gap: 6px; font-size: 0.8125rem; overflow-wrap: anywhere; }
    .rainfall ha-icon { --mdc-icon-size: 18px; color: var(--skyscoop-muted); flex-shrink: 0; }
    .rainfall[data-emphasis="wet"] .rainfall-status, .rainfall[data-emphasis="heavy"] .rainfall-status { font-weight: 700; }
    .rainfall[data-emphasis="wet"] .rainfall-status ha-icon, .rainfall[data-emphasis="heavy"] .rainfall-status ha-icon { color: var(--skyscoop-accent); }
    .rainfall[data-emphasis="heavy"] .rainfall-status { text-decoration: underline; text-underline-offset: 3px; }
    .rainfall-metrics { display: grid; grid-template-columns: repeat(var(--metric-columns, 2), minmax(0, 1fr)); gap: 12px 16px; margin-top: 8px; }
    .rainfall-metric { min-width: 0; overflow-wrap: anywhere; }
    .rainfall-metric .label { display: flex; align-items: center; gap: 4px; font-size: 0.875rem; }
    .rainfall-history { min-width: 0; margin-top: 16px; }
    .rainfall-plot { display: block; width: 100%; height: 88px; margin-block: 8px; overflow: visible; }
    .rainfall-plot path { stroke: var(--skyscoop-accent); stroke-width: 2; }
    .rainfall-placeholder { display: grid; align-items: center; height: 88px; margin-block: 8px; color: var(--skyscoop-muted); font-size: 0.8125rem; }
    .rainfall-caption { display: grid; grid-template-columns: minmax(0, 1fr); gap: 4px; min-height: 2.75rem; font-size: 0.75rem; color: var(--skyscoop-muted); overflow-wrap: anywhere; }
    .rainfall-history-status { min-height: 1.1rem; font-size: 0.75rem; color: var(--skyscoop-muted); overflow-wrap: anywhere; }
    .hourly { grid-column: 1 / -1; min-width: 0; border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2)); padding-top: 16px; }
    .hourly > .label { font-weight: 500; }
    .hourly-strip { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(56px, 1fr); overflow-x: auto; gap: 0; margin-top: 12px; padding: 8px 0; border-block: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2)); }
    .hourly-period { display: grid; grid-template-rows: 24px 28px minmax(24px, auto) 24px; align-items: center; justify-items: center; min-width: 0; padding-inline: 6px; border-inline-end: 1px solid var(--divider-color, rgba(127, 127, 127, 0.16)); font-size: 0.8125rem; overflow-wrap: anywhere; text-align: center; }
    .hourly-period:last-child { border-inline-end: 0; }
    .hourly-period time { grid-row: 1; }
    .hourly-period > ha-icon { grid-row: 2; --mdc-icon-size: 24px; color: var(--skyscoop-muted); }
    .hourly-period time, .hourly-probability { color: var(--skyscoop-muted); font-size: 0.75rem; }
    .hourly-temperature { grid-row: 3; font-size: 0.875rem; font-weight: 600; font-variant-numeric: tabular-nums; }
    .hourly-probability { grid-row: 4; }
    .hourly-probability ha-icon { --mdc-icon-size: 14px; }
    .label { overflow-wrap: anywhere; }
    @container (min-width: 600px) {
      .content { gap: 12px; padding: 14px; }
      .station-metrics { row-gap: 14px; }
      .station-metrics, .rainfall, .hourly { padding-top: 12px; }
      .hourly-strip { margin-top: 8px; padding-block: 6px; }
      .rainfall-metrics { gap: 8px 12px; }
      .rainfall-history { margin-top: 8px; }
      .rainfall-plot, .rainfall-placeholder { height: 64px; margin-block: 4px; }
    }
    @container (max-width: 359px) { .station-metrics, .rainfall-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @container (max-width: 359px) { .temperature-row.has-temperature.has-forecast { grid-template-columns: minmax(0, 1fr); } .forecast-summary { border-inline-start: 0; border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2)); padding: 12px 0 0; } }
    @container (max-width: 220px) { .station-metrics, .rainfall-metrics { grid-template-columns: minmax(0, 1fr); } .content { gap: 10px; padding: 12px; } .temperature-row { gap: 12px; } }
  `;
	}
	connectedCallback() {
		super.connectedCallback(), typeof ResizeObserver < "u" && (this.resizeObserver = new ResizeObserver((e) => {
			let t = e[0]?.contentRect.width;
			t && t > 0 && (this.widthLayout = Ne(t));
		}), this.resizeObserver.observe(this)), this.hasUpdated && (this.syncForecastSubscription(), this.syncRainfallHistory(), this.syncSummaryTimer());
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.clearSummaryTimer(), this.summaryStream.stop(), this.hourlyStream.stop(), this.rainfallHistory.stop(), this.resizeObserver?.disconnect(), this.resizeObserver = void 0;
	}
	updated(e) {
		super.updated(e), (e.has("hass") || e.has("config")) && (this.syncForecastSubscription(), this.syncRainfallHistory(), this.syncSummaryTimer());
	}
	setConfig(e) {
		if (!e || typeof e != "object") throw Error("SkyScoop requires an object configuration.");
		if (e.layout !== void 0 && ![
			"auto",
			"compact",
			"standard",
			"wide"
		].includes(e.layout)) throw Error("SkyScoop layout must be auto, compact, standard, or wide.");
		for (let t of [
			"show_hourly_forecast",
			"adaptive_metrics",
			"show_rainfall_history"
		]) if (e[t] !== void 0 && typeof e[t] != "boolean") throw Error(`SkyScoop ${t} must be a boolean.`);
		this.config = { ...e };
	}
	getCardSize() {
		let e = this.activeLayout, t = Ie(this.hass, this.config).length;
		return 2 + Math.ceil(q(this.hass, this.config).length / X[e]) + +!!this.config?.weather_entity + (this.hourlyEnabled ? 3 : 0) + (t || this.config?.rain_state_entity ? 1 + Math.ceil(t / X[e]) : 0) + (this.rainfallHistoryEnabled ? 3 : 0);
	}
	get rainfallHistoryEnabled() {
		return !!this.config?.rainfall_rate_entity && this.config?.show_rainfall_history !== !1;
	}
	syncRainfallHistory() {
		this.rainfallHistory.sync(this.isConnected && this.rainfallHistoryEnabled ? this.hass : void 0, this.config?.rainfall_rate_entity);
	}
	get activeLayout() {
		return this.config?.layout && this.config.layout !== "auto" ? this.config.layout : this.widthLayout;
	}
	get hourlyEnabled() {
		let e = this.config?.weather_entity, t = Number(e ? this.hass?.states[e]?.attributes.supported_features : 0);
		return this.config?.show_hourly_forecast !== !1 && Number.isFinite(t) && !!(t & 2);
	}
	getForecastType() {
		let e = this.config?.weather_entity ? this.hass?.states[this.config.weather_entity] : void 0, t = Number(e?.attributes.supported_features);
		if (Number.isFinite(t)) {
			if (t & 4) return "twice_daily";
			if (t & 1) return "daily";
		}
	}
	async syncForecastSubscription() {
		let e = this.config?.weather_entity, t = e ? this.hass?.states[e] : void 0, n = this.hass?.connection, r = this.isConnected && t && t.state !== "unknown" && t.state !== "unavailable";
		await Promise.all([this.summaryStream.sync(r ? n : void 0, e, this.getForecastType()), this.hourlyStream.sync(r ? n : void 0, e, this.hourlyEnabled ? "hourly" : void 0)]);
	}
	syncSummaryTimer() {
		let e = this.isConnected && (this.config?.weather_entity || this.rainfallHistoryEnabled);
		e && !this.summaryTimer ? this.summaryTimer = setInterval(() => this.requestUpdate(), 6e4) : !e && this.summaryTimer && this.clearSummaryTimer();
	}
	clearSummaryTimer() {
		this.summaryTimer &&= (clearInterval(this.summaryTimer), void 0);
	}
	static getStubConfig(e) {
		return { type: `custom:${$}` };
	}
	static getConfigElement() {
		return document.createElement("skyscoop-card-editor");
	}
	render() {
		let e = this.hass?.language, t = this.config?.temperature_entity, n = K(this.hass, t), r = n.value, i = r !== void 0, a = n.unit, o = this.config?.weather_entity, s = o ? this.hass?.states[o] : void 0, c = this.hass?.config?.time_zone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC", l = /* @__PURE__ */ new Date(), u = Te(this.summaryStream.forecast, l, c), d = this.activeLayout, f = q(this.hass, this.config), p = Ue(this.hass, this.config), m = Se(this.hourlyStream.forecast, l, Me[d]), h = typeof s?.attributes.temperature_unit == "string" ? s.attributes.temperature_unit : "", g = u?.kind === "low" ? "mdi:thermometer-chevron-down" : u ? "mdi:thermometer-chevron-up" : "mdi:thermometer", _ = s && Object.hasOwn(Z, s.state) ? s.state : void 0, v = _ ? Z[_] : "mdi:thermometer", y = _ ? Ge[_] : void 0;
		return F`
      <ha-card .header=${this.config?.name?.trim() || void 0} data-layout=${d} data-weather-tone=${y} style=${`--metric-columns: ${X[d]}`}>
        <div class="content">
          <div class="temperature-row ${t ? "has-temperature" : ""} ${o ? "has-forecast" : ""}">
            ${t ? F`
                  <button type="button" class="reading sensor-reading" @click=${() => this.showMoreInfo(t)}>
                    <span class="label summary-label">
                      <span class="summary-icon current-condition-icon">
                        <ha-icon icon=${v} role="img" aria-label=${Y(e, _ ?? "temperature")}></ha-icon>
                      </span>
                      <span>${Y(e, "temperature")}</span>
                    </span>
                    <span class="value-line">
                      <span class="temperature" aria-label=${Y(e, "temperature")}>
                        ${i ? new Intl.NumberFormat(e || "en", { maximumFractionDigits: 1 }).format(r) : Y(e, "unavailable")}
                      </span>
                      ${a ? F`<span class="unit">${a}</span>` : ""}
                    </span>
                  </button>
                ` : F`<div class="message">${Y(e, "chooseTemperature")}</div>`}
            ${o ? F`
                  <div class="reading forecast-summary">
                    <div class="label summary-label">
                      <span class="summary-icon"><ha-icon icon=${g} aria-hidden="true"></ha-icon></span>
                      <span>
                        ${Y(e, u ? u.kind === "low" ? "forecastLow" : "forecastHigh" : "forecastSummary")}
                      </span>
                    </div>
                    <div class="value-line">
                      <div class="forecast-value">
                        ${u ? new Intl.NumberFormat(e || "en", { maximumFractionDigits: 1 }).format(u.temperature) : Y(e, "forecastUnavailable")}
                      </div>
                      ${u && h ? F`<div class="unit">${h}</div>` : ""}
                    </div>
                  </div>
                ` : ""}
          </div>
          ${Ae(f, e, d, this.showMoreInfo, p.metrics)}
          ${o && this.hourlyEnabled ? F`
            <section class="hourly" aria-label=${Y(e, "hourlyForecast")}>
              <div class="label">${Y(e, "hourlyForecast")}</div>
              ${m.length ? Pe(m, e, c, h) : F`<div class="message" role="status">${Y(e, this.hourlyStream.status === "loading" ? "hourlyLoading" : "forecastUnavailable")}</div>`}
            </section>
          ` : ""}
          ${We(this.hass, this.config, this.rainfallHistory, p, c, this.showMoreInfo)}
        </div>
      </ha-card>
    `;
	}
}, qe = class extends W {
	constructor(...e) {
		super(...e), this.config = {};
	}
	static {
		this.styles = o`
    :host { display: grid; gap: 12px; }
    details { min-width: 0; }
    summary { cursor: pointer; padding: 8px 0; }
    ha-entity-picker { display: block; margin-bottom: 8px; }
    label { display: flex; align-items: center; gap: 12px; color: var(--primary-text-color); }
    .name-field { display: grid; align-items: start; gap: 4px; }
    .name-field input { box-sizing: border-box; width: 100%; min-width: 0; padding: 8px; border: 1px solid var(--divider-color, #888); border-radius: 4px; color: var(--primary-text-color); background: var(--card-background-color); font: inherit; }
    select { font: inherit; color: var(--primary-text-color); background: var(--card-background-color); padding: 8px; min-width: 0; }
  `;
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			config: { attribute: !1 }
		};
	}
	setConfig(e) {
		this.config = { ...e };
	}
	updated() {
		let e = this.shadowRoot?.querySelector("select");
		e && (e.value = this.config.layout ?? "auto");
	}
	onTemperatureChanged(e) {
		this.updateEntity("temperature_entity", e.detail?.value);
	}
	onWeatherChanged(e) {
		this.updateEntity("weather_entity", e.detail?.value);
	}
	onNameChanged(e) {
		let t = e.currentTarget.value, n = { ...this.config };
		t ? n.name = t : delete n.name, this.config = n, this.emitConfig();
	}
	updateEntity(e, t) {
		let n = { ...this.config };
		t ? n[e] = t : delete n[e], this.config = n, this.emitConfig();
	}
	emitConfig() {
		this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: this.config },
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		return F`
      <label class="name-field">
        ${Y(this.hass?.language, "cardHeader")}
        <input type="text" .value=${this.config.name ?? ""} @input=${this.onNameChanged}>
      </label>
      <ha-entity-picker
        .hass=${this.hass}
        .value=${this.config.temperature_entity ?? ""}
        .label=${Y(this.hass?.language, "temperatureEntity")}
        .includeDomains=${["sensor"]}
        @value-changed=${this.onTemperatureChanged}
      ></ha-entity-picker>
      <ha-entity-picker
        .hass=${this.hass}
        .value=${this.config.weather_entity ?? ""}
        .label=${Y(this.hass?.language, "weatherEntity")}
        .includeDomains=${["weather"]}
        @value-changed=${this.onWeatherChanged}
      ></ha-entity-picker>
      <details>
        <summary>${Y(this.hass?.language, "stationMetrics")}</summary>
        ${xe.map((e) => F`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this.config[e.key] ?? ""}
            .label=${Y(this.hass?.language, e.label)}
            .includeDomains=${["sensor"]}
            @value-changed=${(t) => this.updateEntity(e.key, t.detail?.value)}
          ></ha-entity-picker>
        `)}
      </details>
      <details>
        <summary>${Y(this.hass?.language, "rainfall")}</summary>
        <ha-entity-picker
          data-entity-key="rain_state_entity"
          .hass=${this.hass}
          .value=${this.config.rain_state_entity ?? ""}
          .label=${Y(this.hass?.language, "rainStateEntity")}
          .includeDomains=${["binary_sensor"]}
          @value-changed=${(e) => this.updateEntity("rain_state_entity", e.detail?.value)}
        ></ha-entity-picker>
        ${Fe.map((e) => F`
          <ha-entity-picker
            data-entity-key=${e.key}
            .hass=${this.hass}
            .value=${this.config[e.key] ?? ""}
            .label=${Y(this.hass?.language, e.label)}
            .includeDomains=${["sensor"]}
            @value-changed=${(t) => this.updateEntity(e.key, t.detail?.value)}
          ></ha-entity-picker>
        `)}
      </details>
      <label>
        ${Y(this.hass?.language, "layout")}
        <select @change=${(e) => {
			this.config = {
				...this.config,
				layout: e.target.value
			}, this.emitConfig();
		}}>
          ${[
			"auto",
			"compact",
			"standard",
			"wide"
		].map((e) => F`
            <option value=${e} ?selected=${(this.config.layout ?? "auto") === e}>${Y(this.hass?.language, e)}</option>
          `)}
        </select>
      </label>
      <label>
        <input type="checkbox" .checked=${this.config.show_hourly_forecast !== !1}
          @change=${(e) => {
			this.config = {
				...this.config,
				show_hourly_forecast: e.target.checked
			}, this.emitConfig();
		}}>
        ${Y(this.hass?.language, "hourlyForecast")}
      </label>
      ${[{
			key: "adaptive_metrics",
			label: "adaptiveMetrics"
		}, {
			key: "show_rainfall_history",
			label: "showRainfallHistory"
		}].map((e) => F`
        <label>
          <input type="checkbox" data-option=${e.key} .checked=${this.config[e.key] !== !1}
            @change=${(t) => {
			this.config = {
				...this.config,
				[e.key]: t.target.checked
			}, this.emitConfig();
		}}>
          ${Y(this.hass?.language, e.label)}
        </label>
      `)}
    `;
	}
};
customElements.get("skyscoop-card") || customElements.define($, Ke), customElements.get("skyscoop-card-editor") || customElements.define("skyscoop-card-editor", qe), window.customCards ??= [], window.customCards.some((e) => e.type === "skyscoop-card") || window.customCards.push({
	type: $,
	name: "SkyScoop",
	description: "Weather-station observations and forecast data.",
	preview: !0
}), console.info("%c SKYSCOOP %c Ready", "color: white; background: #347f78; font-weight: bold;", "");
//#endregion
