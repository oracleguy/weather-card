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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, g = h.trustedTypes, ee = g ? g.emptyScript : "", te = h.reactiveElementPolyfillSupport, _ = (e, t) => e, v = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ee : null;
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
}, y = (e, t) => !l(e, t), b = {
	attribute: !0,
	type: String,
	converter: v,
	reflect: !1,
	useDefault: !1,
	hasChanged: y
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var x = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = b) {
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
		return this.elementProperties.get(e) ?? b;
	}
	static _$Ei() {
		if (this.hasOwnProperty(_("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(_("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(_("properties"))) {
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
			let i = (n.converter?.toAttribute === void 0 ? v : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? v : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? y)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
x.elementStyles = [], x.shadowRootOptions = { mode: "open" }, x[_("elementProperties")] = /* @__PURE__ */ new Map(), x[_("finalized")] = /* @__PURE__ */ new Map(), te?.({ ReactiveElement: x }), (h.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var S = globalThis, ne = (e) => e, C = S.trustedTypes, re = C ? C.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, w = "$lit$", T = `lit$${Math.random().toFixed(9).slice(2)}$`, E = "?" + T, ie = `<${E}>`, D = document, O = () => D.createComment(""), k = (e) => e === null || typeof e != "object" && typeof e != "function", A = Array.isArray, ae = (e) => A(e) || typeof e?.[Symbol.iterator] == "function", j = "[ 	\n\f\r]", M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, N = /-->/g, oe = />/g, P = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), se = /'/g, F = /"/g, I = /^(?:script|style|textarea|title)$/i, L = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), R = Symbol.for("lit-noChange"), z = Symbol.for("lit-nothing"), B = /* @__PURE__ */ new WeakMap(), V = D.createTreeWalker(D, 129);
function H(e, t) {
	if (!A(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return re === void 0 ? t : re.createHTML(t);
}
var ce = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = M;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === M ? c[1] === "!--" ? o = N : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = P) : (I.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = P) : o = oe : o === P ? c[0] === ">" ? (o = i ?? M, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? P : c[3] === "\"" ? F : se) : o === F || o === se ? o = P : o === N || o === oe ? o = M : (o = P, i = void 0);
		let d = o === P && e[t + 1].startsWith("/>") ? " " : "";
		a += o === M ? n + ie : l >= 0 ? (r.push(s), n.slice(0, l) + w + n.slice(l) + T + d) : n + T + (l === -2 ? t : d);
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
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(w)) {
					let t = u[o++], n = i.getAttribute(e).split(T), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? ue : r[1] === "?" ? de : r[1] === "@" ? fe : K
					}), i.removeAttribute(e);
				} else e.startsWith(T) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (I.test(i.tagName)) {
					let e = i.textContent.split(T), t = e.length - 1;
					if (t > 0) {
						i.textContent = C ? C.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], O()), V.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], O());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === E) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(T, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += T.length - 1;
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
function W(e, t, n = e, r) {
	if (t === R) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = k(t) ? void 0 : t._$litDirective$;
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? D).importNode(t, !0);
		V.currentNode = r;
		let i = V.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new G(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new pe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = V.nextNode(), a++);
		}
		return V.currentNode = D, r;
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
		e = W(this, e, t), k(e) ? e === z || e == null || e === "" ? (this._$AH !== z && this._$AR(), this._$AH = z) : e !== this._$AH && e !== R && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ae(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== z && k(this._$AH) ? this._$AA.nextSibling.data = e : this.T(D.createTextNode(e)), this._$AH = e;
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
		A(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(O()), this.O(O()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ne(e).nextSibling;
			ne(e).remove(), e = t;
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
		if (i === void 0) e = W(this, e, t, 0), a = !k(e) || e !== this._$AH && e !== R, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = W(this, r[n + o], t, o), s === R && (s = this._$AH[o]), a ||= !k(s) || s !== this._$AH[o], s === z ? e = z : e !== z && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
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
}, me = S.litHtmlPolyfillSupport;
me?.(U, G), (S.litHtmlVersions ??= []).push("3.3.3");
var he = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new G(t.insertBefore(O(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, q = globalThis, J = class extends x {
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
//#region src/station.ts
var Y = [
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
function X(e) {
	if (typeof e != "number" && typeof e != "string" || typeof e == "string" && !e.trim()) return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function _e(e, t) {
	let n = t ? e?.states[t] : void 0;
	return {
		value: X(n?.state),
		unit: typeof n?.attributes.unit_of_measurement == "string" ? n.attributes.unit_of_measurement : ""
	};
}
function ve(e, t) {
	return Y.flatMap((n) => {
		if (!t?.[n.key]) return [];
		let r = _e(e, t[n.key]), i = r.value !== void 0 && r.value >= n.minimum && r.value <= n.maximum ? r.value : void 0;
		return [{
			...n,
			...r,
			value: i
		}];
	});
}
//#endregion
//#region src/forecast.ts
function ye(e, t, n) {
	let r = t.getTime();
	if (!Number.isFinite(r) || n <= 0) return [];
	let i = /* @__PURE__ */ new Map();
	for (let t of e ?? []) {
		if (!t || typeof t.datetime != "string") continue;
		let e = Date.parse(t.datetime), n = X(t.temperature);
		if (!Number.isFinite(e) || e < r || e >= r + 864e5 || n === void 0) continue;
		let a = X(t.precipitation_probability);
		i.has(e) || i.set(e, {
			timestamp: e,
			temperature: n,
			condition: typeof t.condition == "string" ? t.condition : void 0,
			probability: a !== void 0 && a >= 0 && a <= 100 ? a : void 0
		});
	}
	return [...i.values()].sort((e, t) => e.timestamp - t.timestamp).slice(0, n);
}
function be(e, t) {
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
function xe(e, t) {
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
function Z(e) {
	if (typeof e != "number" && typeof e != "string" || typeof e == "string" && e.trim() === "") return;
	let t = Number(e);
	return Number.isFinite(t) ? t : void 0;
}
function Se(e, t, n = "UTC") {
	if (!e?.length || !Number.isFinite(t.getTime())) return;
	let r = be(t, n);
	if (!r) return;
	let i = e.flatMap((e) => {
		if (typeof e.datetime != "string") return [];
		let t = new Date(e.datetime);
		return !Number.isFinite(t.getTime()) || be(t, n) !== r ? [] : [{
			period: e,
			timestamp: t
		}];
	});
	if (!i.length) return;
	let a = i.find(({ period: e }) => e.is_daytime === !0), o = i.find(({ period: e }) => e.is_daytime === !1), s = o?.timestamp;
	if (s ? t.getTime() >= s.getTime() : (xe(t, n) ?? 0) >= 17) {
		let e = Z(o?.period.temperature) ?? Z(a?.period.templow) ?? Z(i[0].period.templow) ?? Z(o?.period.templow);
		return e === void 0 ? void 0 : {
			kind: "low",
			temperature: e
		};
	}
	let c = Z(a?.period.temperature) ?? Z(i[0].period.temperature);
	return c === void 0 ? void 0 : {
		kind: "high",
		temperature: c
	};
}
//#endregion
//#region src/localization.ts
var Ce = { en: {
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
function Q(e, t) {
	let n = e?.toLowerCase().split("-")[0];
	return Ce[n && n in Ce ? n : "en"][t];
}
//#endregion
//#region src/compass.ts
var we = [
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
function Te(e) {
	return Number.isFinite(e) ? (e % 360 + 360) % 360 : void 0;
}
function Ee(e, t = 16) {
	let n = Te(e);
	if (n === void 0) return;
	let r = Math.round(n / (360 / t)) % t;
	return we[16 / t * r];
}
//#endregion
//#region src/station-metrics.ts
function De(e, t, n) {
	if (!e.length) return "";
	let r = new Intl.NumberFormat(t || "en", { maximumFractionDigits: 1 });
	return L`
    <section class="station-metrics" aria-label=${Q(t, "stationMetrics")}>
      ${e.map((e) => {
		let i = e.key === "wind_direction_entity" && e.value !== void 0 ? Ee(e.value, n === "compact" ? 8 : 16) : void 0, a = e.value === void 0 ? Q(t, "unavailable") : i ? `${Q(t, i)} (${r.format(Te(e.value))}°)` : `${r.format(e.value)} ${e.unit}`;
		return L`
          <div class="metric" data-metric=${e.key}>
            <div class="label"><ha-icon .icon=${e.icon} aria-hidden="true"></ha-icon>${Q(t, e.label)}</div>
            <div class="metric-value">${a}</div>
          </div>
        `;
	})}
    </section>
  `;
}
//#endregion
//#region src/forecast-stream.ts
var Oe = class {
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
}, ke = {
	compact: 4,
	standard: 8,
	wide: 12
}, Ae = {
	compact: 2,
	standard: 3,
	wide: 4
};
function je(e, t = "auto") {
	return t === "auto" ? !Number.isFinite(e) || e <= 0 ? "standard" : e < 360 ? "compact" : e < 600 ? "standard" : "wide" : t;
}
//#endregion
//#region src/hourly-forecast.ts
var Me = {
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
function Ne(e, t, n, r) {
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
	return L`
    <div class="hourly-strip" role="list" tabindex="0" aria-label=${Q(t, "hourlyForecast")}>
      ${e.map((e) => L`
        <div class="hourly-period" role="listitem">
          <time datetime=${new Date(e.timestamp).toISOString()}>${i.format(e.timestamp)}</time>
          ${e.condition && Object.hasOwn(Me, e.condition) ? L`<ha-icon .icon=${Me[e.condition]} role="img" aria-label=${Q(t, e.condition)}></ha-icon>` : ""}
          <div class="hourly-temperature">${a.format(e.temperature)} ${r}</div>
          ${e.probability === void 0 ? "" : L`
            <div class="hourly-probability" aria-label=${`${Q(t, "precipitationProbability")}: ${a.format(e.probability)}%`}>
              <ha-icon icon="mdi:water" aria-hidden="true"></ha-icon>${a.format(e.probability)}%
            </div>`}
        </div>
      `)}
    </div>
  `;
}
//#endregion
//#region src/skyscoop-card.ts
var $ = "skyscoop-card", Pe = class extends J {
	constructor(...e) {
		super(...e), this.summaryStream = new Oe(() => this.requestUpdate()), this.hourlyStream = new Oe(() => this.requestUpdate()), this.widthLayout = "standard";
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
      color: var(--skyscoop-accent);
      font-size: 2rem;
      font-weight: 600;
      line-height: 1.15;
      font-variant-numeric: tabular-nums;
      overflow-wrap: anywhere;
    }

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
      gap: 16px;
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
      padding-top: 12px;
    }

    .metric { min-width: 0; overflow-wrap: anywhere; }
    .metric-value { font-variant-numeric: tabular-nums; margin-top: 4px; }
    .metric ha-icon { --mdc-icon-size: 18px; margin-right: 4px; color: var(--skyscoop-muted); }
    .hourly { grid-column: 1 / -1; min-width: 0; border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2)); padding-top: 12px; }
    .hourly-strip { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(56px, 1fr); overflow-x: auto; gap: 8px; padding-top: 12px; }
    .hourly-period { display: grid; grid-template-rows: 24px 28px minmax(24px, auto) 24px; align-items: center; justify-items: center; font-size: 0.8125rem; overflow-wrap: anywhere; text-align: center; }
    .hourly-period time { grid-row: 1; }
    .hourly-period > ha-icon { grid-row: 2; --mdc-icon-size: 24px; color: var(--skyscoop-muted); }
    .hourly-temperature { grid-row: 3; font-weight: 500; font-variant-numeric: tabular-nums; }
    .hourly-probability { grid-row: 4; color: var(--skyscoop-muted); }
    .hourly-probability ha-icon { --mdc-icon-size: 14px; }
    .label { overflow-wrap: anywhere; }
    @container (max-width: 359px) { .station-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @container (max-width: 359px) { .temperature-row.has-temperature.has-forecast { grid-template-columns: minmax(0, 1fr); } .forecast-summary { border-inline-start: 0; border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2)); padding: 12px 0 0; } }
    @container (max-width: 220px) { .station-metrics { grid-template-columns: minmax(0, 1fr); } .content { gap: 10px; padding: 12px; } .temperature-row { gap: 12px; } }
  `;
	}
	connectedCallback() {
		super.connectedCallback(), typeof ResizeObserver < "u" && (this.resizeObserver = new ResizeObserver((e) => {
			let t = e[0]?.contentRect.width;
			t && t > 0 && (this.widthLayout = je(t));
		}), this.resizeObserver.observe(this)), this.hasUpdated && (this.syncForecastSubscription(), this.syncSummaryTimer());
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.clearSummaryTimer(), this.summaryStream.stop(), this.hourlyStream.stop(), this.resizeObserver?.disconnect(), this.resizeObserver = void 0;
	}
	updated(e) {
		super.updated(e), (e.has("hass") || e.has("config")) && (this.syncForecastSubscription(), this.syncSummaryTimer());
	}
	setConfig(e) {
		if (!e || typeof e != "object") throw Error("SkyScoop requires an object configuration.");
		if (e.layout !== void 0 && ![
			"auto",
			"compact",
			"standard",
			"wide"
		].includes(e.layout)) throw Error("SkyScoop layout must be auto, compact, standard, or wide.");
		if (e.show_hourly_forecast !== void 0 && typeof e.show_hourly_forecast != "boolean") throw Error("SkyScoop show_hourly_forecast must be a boolean.");
		this.config = { ...e };
	}
	getCardSize() {
		let e = this.activeLayout;
		return 2 + Math.ceil(ve(this.hass, this.config).length / Ae[e]) + +!!this.config?.weather_entity + (this.hourlyEnabled ? 3 : 0);
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
		this.isConnected && this.config?.weather_entity && !this.summaryTimer ? this.summaryTimer = setInterval(() => this.requestUpdate(), 6e4) : (!this.isConnected || !this.config?.weather_entity) && this.summaryTimer && this.clearSummaryTimer();
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
		let e = this.hass?.language, t = this.config?.temperature_entity, n = _e(this.hass, t), r = n.value, i = r !== void 0, a = n.unit, o = this.config?.weather_entity, s = o ? this.hass?.states[o] : void 0, c = this.hass?.config?.time_zone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC", l = /* @__PURE__ */ new Date(), u = Se(this.summaryStream.forecast, l, c), d = this.activeLayout, f = ve(this.hass, this.config), p = ye(this.hourlyStream.forecast, l, ke[d]), m = typeof s?.attributes.temperature_unit == "string" ? s.attributes.temperature_unit : "", h = u?.kind === "low" ? "mdi:thermometer-chevron-down" : u ? "mdi:thermometer-chevron-up" : "mdi:thermometer";
		return L`
      <ha-card .header=${this.config?.name?.trim() || void 0} data-layout=${d} style=${`--metric-columns: ${Ae[d]}`}>
        <div class="content">
          <div class="temperature-row ${t ? "has-temperature" : ""} ${o ? "has-forecast" : ""}">
            ${t ? L`
                  <div class="reading">
                    <div class="label summary-label">
                      <span class="summary-icon"><ha-icon icon="mdi:thermometer" aria-hidden="true"></ha-icon></span>
                      <span>${Q(e, "temperature")}</span>
                    </div>
                    <div class="value-line">
                      <div class="temperature" aria-label=${Q(e, "temperature")}>
                        ${i ? new Intl.NumberFormat(e || "en", { maximumFractionDigits: 1 }).format(r) : Q(e, "unavailable")}
                      </div>
                      ${a ? L`<div class="unit">${a}</div>` : ""}
                    </div>
                  </div>
                ` : L`<div class="message">${Q(e, "chooseTemperature")}</div>`}
            ${o ? L`
                  <div class="reading forecast-summary">
                    <div class="label summary-label">
                      <span class="summary-icon"><ha-icon icon=${h} aria-hidden="true"></ha-icon></span>
                      <span>
                        ${Q(e, u ? u.kind === "low" ? "forecastLow" : "forecastHigh" : "forecastSummary")}
                      </span>
                    </div>
                    <div class="value-line">
                      <div class="forecast-value">
                        ${u ? new Intl.NumberFormat(e || "en", { maximumFractionDigits: 1 }).format(u.temperature) : Q(e, "forecastUnavailable")}
                      </div>
                      ${u && m ? L`<div class="unit">${m}</div>` : ""}
                    </div>
                  </div>
                ` : ""}
          </div>
          ${De(f, e, d)}
          ${o && this.hourlyEnabled ? L`
            <section class="hourly" aria-label=${Q(e, "hourlyForecast")}>
              <div class="label">${Q(e, "hourlyForecast")}</div>
              ${p.length ? Ne(p, e, c, m) : L`<div class="message" role="status">${Q(e, this.hourlyStream.status === "loading" ? "hourlyLoading" : "forecastUnavailable")}</div>`}
            </section>
          ` : ""}
        </div>
      </ha-card>
    `;
	}
}, Fe = class extends J {
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
		return L`
      <label class="name-field">
        ${Q(this.hass?.language, "cardHeader")}
        <input type="text" .value=${this.config.name ?? ""} @input=${this.onNameChanged}>
      </label>
      <ha-entity-picker
        .hass=${this.hass}
        .value=${this.config.temperature_entity ?? ""}
        .label=${Q(this.hass?.language, "temperatureEntity")}
        .includeDomains=${["sensor"]}
        @value-changed=${this.onTemperatureChanged}
      ></ha-entity-picker>
      <ha-entity-picker
        .hass=${this.hass}
        .value=${this.config.weather_entity ?? ""}
        .label=${Q(this.hass?.language, "weatherEntity")}
        .includeDomains=${["weather"]}
        @value-changed=${this.onWeatherChanged}
      ></ha-entity-picker>
      <details>
        <summary>${Q(this.hass?.language, "stationMetrics")}</summary>
        ${Y.map((e) => L`
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this.config[e.key] ?? ""}
            .label=${Q(this.hass?.language, e.label)}
            .includeDomains=${["sensor"]}
            @value-changed=${(t) => this.updateEntity(e.key, t.detail?.value)}
          ></ha-entity-picker>
        `)}
      </details>
      <label>
        ${Q(this.hass?.language, "layout")}
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
		].map((e) => L`
            <option value=${e} ?selected=${(this.config.layout ?? "auto") === e}>${Q(this.hass?.language, e)}</option>
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
        ${Q(this.hass?.language, "hourlyForecast")}
      </label>
    `;
	}
};
customElements.get("skyscoop-card") || customElements.define($, Pe), customElements.get("skyscoop-card-editor") || customElements.define("skyscoop-card-editor", Fe), window.customCards ??= [], window.customCards.some((e) => e.type === "skyscoop-card") || window.customCards.push({
	type: $,
	name: "SkyScoop",
	description: "Weather-station observations and forecast data.",
	preview: !0
}), console.info("%c SKYSCOOP %c Ready", "color: white; background: #347f78; font-weight: bold;", "");
//#endregion
