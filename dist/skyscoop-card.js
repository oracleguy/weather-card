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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, p = f.trustedTypes, re = p ? p.emptyScript : "", ie = f.reactiveElementPolyfillSupport, m = (e, t) => e, h = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? re : null;
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
}, g = (e, t) => !l(e, t), _ = {
	attribute: !0,
	type: String,
	converter: h,
	reflect: !1,
	useDefault: !1,
	hasChanged: g
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var v = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = _) {
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
		return this.elementProperties.get(e) ?? _;
	}
	static _$Ei() {
		if (this.hasOwnProperty(m("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(m("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(m("properties"))) {
			let e = this.properties, t = [...ee(e), ...te(e)];
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
			let i = (n.converter?.toAttribute === void 0 ? h : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? h : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? g)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
v.elementStyles = [], v.shadowRootOptions = { mode: "open" }, v[m("elementProperties")] = /* @__PURE__ */ new Map(), v[m("finalized")] = /* @__PURE__ */ new Map(), ie?.({ ReactiveElement: v }), (f.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var y = globalThis, b = (e) => e, x = y.trustedTypes, S = x ? x.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, C = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, T = "?" + w, ae = `<${T}>`, E = document, D = () => E.createComment(""), O = (e) => e === null || typeof e != "object" && typeof e != "function", k = Array.isArray, oe = (e) => k(e) || typeof e?.[Symbol.iterator] == "function", A = "[ 	\n\f\r]", j = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, se = /-->/g, M = />/g, N = RegExp(`>|${A}(?:([^\\s"'>=/]+)(${A}*=${A}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), P = /'/g, F = /"/g, I = /^(?:script|style|textarea|title)$/i, L = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), R = Symbol.for("lit-noChange"), z = Symbol.for("lit-nothing"), B = /* @__PURE__ */ new WeakMap(), V = E.createTreeWalker(E, 129);
function H(e, t) {
	if (!k(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return S === void 0 ? t : S.createHTML(t);
}
var ce = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = j;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === j ? c[1] === "!--" ? o = se : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = N) : (I.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = N) : o = M : o === N ? c[0] === ">" ? (o = i ?? j, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? N : c[3] === "\"" ? F : P) : o === F || o === P ? o = N : o === se || o === M ? o = j : (o = N, i = void 0);
		let d = o === N && e[t + 1].startsWith("/>") ? " " : "";
		a += o === j ? n + ae : l >= 0 ? (r.push(s), n.slice(0, l) + C + n.slice(l) + w + d) : n + w + (l === -2 ? t : d);
	}
	return [H(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, U = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = ce(t, n);
		if (this.el = e.createElement(l, r), V.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = V.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(C)) {
					let t = u[o++], n = i.getAttribute(e).split(w), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? ue : r[1] === "?" ? de : r[1] === "@" ? fe : K
					}), i.removeAttribute(e);
				} else e.startsWith(w) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (I.test(i.tagName)) {
					let e = i.textContent.split(w), t = e.length - 1;
					if (t > 0) {
						i.textContent = x ? x.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], D()), V.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], D());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === T) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(w, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += w.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = E.createElement("template");
		return n.innerHTML = e, n;
	}
};
function W(e, t, n = e, r) {
	if (t === R) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = O(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = W(e, i._$AS(e, t.values), i, r)), t;
}
var le = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? E).importNode(t, !0);
		V.currentNode = r;
		let i = V.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new G(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new pe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = V.nextNode(), a++);
		}
		return V.currentNode = E, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, G = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = z, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = W(this, e, t), O(e) ? e === z || e == null || e === "" ? (this._$AH !== z && this._$AR(), this._$AH = z) : e !== this._$AH && e !== R && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? oe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== z && O(this._$AH) ? this._$AA.nextSibling.data = e : this.T(E.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = U.createElement(H(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new le(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = B.get(e.strings);
		return t === void 0 && B.set(e.strings, t = new U(e)), t;
	}
	k(t) {
		k(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(D()), this.O(D()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = b(e).nextSibling;
			b(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, K = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = z, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = z;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = W(this, e, t, 0), a = !O(e) || e !== this._$AH && e !== R, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = W(this, r[n + o], t, o), s === R && (s = this._$AH[o]), a ||= !O(s) || s !== this._$AH[o], s === z ? e = z : e !== z && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === z ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, ue = class extends K {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === z ? void 0 : e;
	}
}, de = class extends K {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== z);
	}
}, fe = class extends K {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = W(this, e, t, 0) ?? z) === R) return;
		let n = this._$AH, r = e === z && n !== z || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== z && (n === z || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, pe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		W(this, e);
	}
}, me = y.litHtmlPolyfillSupport;
me?.(U, G), (y.litHtmlVersions ??= []).push("3.3.3");
var he = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new G(t.insertBefore(D(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, q = globalThis, J = class extends v {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = he(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return R;
	}
};
J._$litElement$ = !0, J.finalized = !0, q.litElementHydrateSupport?.({ LitElement: J });
var ge = q.litElementPolyfillSupport;
ge?.({ LitElement: J }), (q.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region src/forecast.ts
function Y(e, t) {
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
function _e(e, t) {
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
function X(e) {
	if (typeof e != "number" && typeof e != "string" || typeof e == "string" && e.trim() === "") return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function ve(e, t, n = "UTC") {
	if (!e?.length || !Number.isFinite(t.getTime())) return;
	let r = Y(t, n);
	if (!r) return;
	let i = e.flatMap((e) => {
		if (typeof e.datetime != "string") return [];
		let t = new Date(e.datetime);
		return !Number.isFinite(t.getTime()) || Y(t, n) !== r ? [] : [{
			period: e,
			timestamp: t
		}];
	});
	if (!i.length) return;
	let a = i.find(({ period: e }) => e.is_daytime === !0), o = i.find(({ period: e }) => e.is_daytime === !1), s = o?.timestamp;
	if (s ? t.getTime() >= s.getTime() : (_e(t, n) ?? 0) >= 17) {
		let e = X(o?.period.temperature) ?? X(a?.period.templow) ?? X(i[0].period.templow) ?? X(o?.period.templow);
		return e === void 0 ? void 0 : {
			kind: "low",
			temperature: e
		};
	}
	let c = X(a?.period.temperature) ?? X(i[0].period.temperature);
	return c === void 0 ? void 0 : {
		kind: "high",
		temperature: c
	};
}
//#endregion
//#region src/localization.ts
var Z = { en: {
	temperature: "Temperature",
	unavailable: "Unavailable",
	chooseTemperature: "Choose a temperature entity in the card configuration.",
	temperatureEntity: "Temperature entity",
	forecastHigh: "Today's forecast high",
	forecastLow: "Tonight's forecast low",
	forecastSummary: "Forecast summary",
	forecastUnavailable: "Forecast unavailable",
	weatherEntity: "Weather entity"
} };
function Q(e, t) {
	let n = e?.toLowerCase().split("-")[0];
	return Z[n && n in Z ? n : "en"][t];
}
//#endregion
//#region src/skyscoop-card.ts
var $ = "skyscoop-card", ye = class extends J {
	constructor(...e) {
		super(...e), this.forecastGeneration = 0;
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			config: { attribute: !1 }
		};
	}
	static {
		this.styles = o`
    :host {
      display: block;
      --skyscoop-accent: var(--primary-color, #347f78);
      --skyscoop-muted: var(--secondary-text-color, #64716f);
    }

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

    .label {
      color: var(--skyscoop-muted);
      font-size: 0.875rem;
    }

    .temperature {
      margin-top: 4px;
      color: var(--skyscoop-accent);
      font-size: 2rem;
      font-weight: 600;
      line-height: 1.15;
      font-variant-numeric: tabular-nums;
    }

    .message {
      grid-column: 1 / -1;
      color: var(--skyscoop-muted);
      font-size: 0.875rem;
    }

    .unit {
      align-self: center;
      color: var(--skyscoop-muted);
      font-size: 1rem;
    }

    .forecast-summary {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-top: 4px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
    }

    .forecast-value {
      margin-top: 4px;
      font-size: 1.125rem;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }
  `;
	}
	connectedCallback() {
		super.connectedCallback(), this.hasUpdated && (this.syncForecastSubscription(), this.syncSummaryTimer());
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.clearSummaryTimer(), this.stopForecastSubscription();
	}
	updated(e) {
		super.updated(e), (e.has("hass") || e.has("config")) && (this.syncForecastSubscription(), this.syncSummaryTimer());
	}
	setConfig(e) {
		if (!e || typeof e != "object") throw Error("SkyScoop requires an object configuration.");
		this.config = { ...e };
	}
	getCardSize() {
		return 2;
	}
	getForecastType() {
		let e = this.config?.weather_entity ? this.hass?.states[this.config.weather_entity] : void 0, t = Number(e?.attributes.supported_features);
		if (Number.isFinite(t)) {
			if (t & 4) return "twice_daily";
			if (t & 1) return "daily";
		}
	}
	async syncForecastSubscription() {
		let e = this.config?.weather_entity, t = e ? this.hass?.states[e] : void 0, n = this.hass?.connection, r = this.getForecastType();
		if (!e || !t || t.state === "unavailable" || t.state === "unknown" || !n || !r) {
			this.stopForecastSubscription();
			return;
		}
		let i = `${e}:${r}`;
		if (this.forecastSubscriptionKey === i && this.forecastConnection === n) return;
		this.stopForecastSubscription();
		let a = this.forecastGeneration;
		this.forecastSubscriptionKey = i, this.forecastConnection = n, this.forecast = void 0, this.requestUpdate();
		try {
			let t = await n.subscribeMessage((e) => {
				a === this.forecastGeneration && (this.forecast = e.forecast ?? void 0, this.requestUpdate());
			}, {
				type: "weather/subscribe_forecast",
				forecast_type: r,
				entity_id: e
			});
			a === this.forecastGeneration ? this.forecastUnsubscribe = t : t();
		} catch {
			a === this.forecastGeneration && (this.forecast = void 0, this.forecastSubscriptionKey = void 0, this.forecastConnection = void 0, this.requestUpdate());
		}
	}
	stopForecastSubscription() {
		(this.forecastSubscriptionKey || this.forecastUnsubscribe) && (this.forecastGeneration += 1, this.forecastUnsubscribe?.(), this.forecastUnsubscribe = void 0, this.forecastSubscriptionKey = void 0, this.forecastConnection = void 0, this.forecast = void 0);
	}
	syncSummaryTimer() {
		this.isConnected && this.config?.weather_entity && !this.summaryTimer ? this.summaryTimer = setInterval(() => this.requestUpdate(), 6e4) : (!this.isConnected || !this.config?.weather_entity) && this.summaryTimer && this.clearSummaryTimer();
	}
	clearSummaryTimer() {
		this.summaryTimer &&= (clearInterval(this.summaryTimer), void 0);
	}
	static getStubConfig(e) {
		let t = Object.entries(e?.states ?? {}).find(([e, t]) => e.startsWith("sensor.") && t.attributes.device_class === "temperature")?.[0];
		return {
			type: `custom:${$}`,
			...t ? { temperature_entity: t } : {}
		};
	}
	static getConfigElement() {
		return document.createElement("skyscoop-card-editor");
	}
	render() {
		let e = this.hass?.language, t = this.config?.temperature_entity, n = t ? this.hass?.states[t] : void 0, r = n?.state, i = r === void 0 ? NaN : Number(r), a = Number.isFinite(i) && r !== "unknown" && r !== "unavailable", o = typeof n?.attributes.unit_of_measurement == "string" ? n.attributes.unit_of_measurement : "", s = this.config?.weather_entity, c = s ? this.hass?.states[s] : void 0, l = this.hass?.config?.time_zone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC", u = ve(this.forecast, /* @__PURE__ */ new Date(), l), d = typeof c?.attributes.temperature_unit == "string" ? c.attributes.temperature_unit : "";
		return L`
      <ha-card .header=${this.config?.name || "SkyScoop"}>
        <div class="content">
          ${t ? L`
                <div>
                  <div class="label">${Q(e, "temperature")}</div>
                  <div class="temperature" aria-label=${Q(e, "temperature")}>
                    ${a ? new Intl.NumberFormat(e || "en", { maximumFractionDigits: 1 }).format(i) : Q(e, "unavailable")}
                  </div>
                </div>
                ${o ? L`<div class="unit">${o}</div>` : ""}
              ` : L`<div class="message">${Q(e, "chooseTemperature")}</div>`}
          ${s ? L`
                <div class="forecast-summary">
                  <div>
                    <div class="label">
                      ${Q(e, u ? u.kind === "low" ? "forecastLow" : "forecastHigh" : "forecastSummary")}
                    </div>
                    <div class="forecast-value">
                      ${u ? new Intl.NumberFormat(e || "en", { maximumFractionDigits: 1 }).format(u.temperature) : Q(e, "forecastUnavailable")}
                    </div>
                  </div>
                  ${u && d ? L`<div class="unit">${d}</div>` : ""}
                </div>
              ` : ""}
        </div>
      </ha-card>
    `;
	}
}, be = class extends J {
	constructor(...e) {
		super(...e), this.config = {};
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
	onTemperatureChanged(e) {
		this.updateEntity("temperature_entity", e.detail?.value);
	}
	onWeatherChanged(e) {
		this.updateEntity("weather_entity", e.detail?.value);
	}
	updateEntity(e, t) {
		let n = { ...this.config };
		t ? n[e] = t : delete n[e], this.config = n, this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: n },
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		return L`
      <ha-entity-picker
        .hass=${this.hass}
        .value=${this.config.temperature_entity ?? ""}
        .label=${Q(this.hass?.language, "temperatureEntity")}
        @value-changed=${this.onTemperatureChanged}
      ></ha-entity-picker>
      <ha-entity-picker
        .hass=${this.hass}
        .value=${this.config.weather_entity ?? ""}
        .label=${Q(this.hass?.language, "weatherEntity")}
        .includeDomains=${["weather"]}
        @value-changed=${this.onWeatherChanged}
      ></ha-entity-picker>
    `;
	}
};
customElements.get("skyscoop-card") || customElements.define($, ye), customElements.get("skyscoop-card-editor") || customElements.define("skyscoop-card-editor", be), window.customCards ??= [], window.customCards.some((e) => e.type === "skyscoop-card") || window.customCards.push({
	type: $,
	name: "SkyScoop",
	description: "Weather-station observations and forecast data.",
	preview: !0
}), console.info("%c SKYSCOOP %c Ready", "color: white; background: #347f78; font-weight: bold;", "");
//#endregion
