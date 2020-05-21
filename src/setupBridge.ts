import { AtomBridge } from "@web-atoms/core/dist/core/AtomBridge";
import XNode from "@web-atoms/core/dist/core/XNode";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";

export default function setupBridge() {
    // bridge is setup..
}

AtomBridge.instance.createNode =  function(
	target: any,
	node: XNode,
	// tslint:disable-next-line: ban-types
	binder: Function,
	// tslint:disable-next-line: ban-types
	xNodeClass: Function,
	// tslint:disable-next-line: ban-types
	creator: Function): any {

	let parent = null;

	const app = target.app;
	let e: HTMLElement = null;
	if (typeof node.name === "string") {
		// it is simple node..
		e = document.createElement(node.name);
		parent = e;
	} else {
		target = new (node.name as any)(app);
		e = target.element;
		parent = target;
		// target.append(child);
		// const firstChild = node.children ? node.children[0] : null;
		// if (firstChild) {
		// 	const n = this.createNode(child, firstChild, binder, xNodeClass, creator);
		// 	child.append(n.atomControl || n);
		// }
		// return child.element;
	}

	const a = node.attributes;
	if (a) {
		for (const key in a) {
			if (a.hasOwnProperty(key)) {
				let element = a[key] as any;
				if (element instanceof binder) {
					if (/^event/.test(key)) {
						let ev = key.substr(5);
						if (ev.startsWith("-")) {
							ev = ev.split("-").map((s) => s[0].toLowerCase() + s.substr(1)).join("");
						} else {
							ev = ev[0].toLowerCase() + ev.substr(1);
						}
						(element as any).setupFunction(ev, element, target, e);
					} else {
						(element as any).setupFunction(key, element, target, e);
					}
				} else {

					// this is template...
					if (element instanceof xNodeClass) {
						const templateNode = element as any;
						const name = templateNode.name;
						if (typeof name === "string") {
							element = ((bx, n) => class extends bx {

								public create(): void {
									this.render(n);
								}

							})(creator as any, templateNode.children[0]);

						} else {
							element = ((base, n) => class extends base {

								public create(): void {
									this.render(n);
								}

							})(name, templateNode.children[0]);
						}
					}
					target.setLocalValue(e, key, element);
				}
			}
		}
	}

	const children = node.children;
	if (children) {
		for (const iterator of children) {
			if (typeof iterator === "string") {
				e.appendChild(document.createTextNode(iterator));
				continue;
			}
			if (typeof iterator.name === "string") {
				e.appendChild(this.createNode(target, iterator, binder, xNodeClass, creator));
			} else {
				const child = this.createNode(target, iterator, binder, xNodeClass, creator);
				if (parent instanceof AtomControl) {
					parent.append(child.atomControl || child);
				} else {
					parent.appendChild(child);
				}
			}
		}
	}
	return e;
};
