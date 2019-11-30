import { App } from "web-atoms-core/dist/App";
import { AtomWatcher } from "web-atoms-core/dist/core/AtomWatcher";
import { IClassOf, IDisposable } from "web-atoms-core/dist/core/types";
import { AtomControl } from "web-atoms-core/dist/web/controls/AtomControl";
import AtomColumn from "./AtomColumn";

interface IDataGrid {
    columns: AtomColumn[];
}

export default function GridTemplate(
    owner: IDataGrid, templatePath: string, elementName: string): IClassOf<AtomControl> {

    return class AtomGridTemplate extends AtomControl {

        public dataGrid: IDataGrid;

        private columnDisposable: IDisposable;

        private row: AtomControl[];

        private lastCreateRowId = null;

        constructor(app: App, e?: HTMLElement) {
            super(app, e || document.createElement("tr"));
        }

        public preCreate(): void {
            this.dataGrid = owner;
            this.row = null;
            this.bind(this.element,
                "none",
                [["this", "data"], ["this", "dataGrid", "columns"]], false,
                (data, columns) => this.updateRow(data, columns), this);
        }

        private updateRow(data: any, columns: AtomColumn[]): any {
            if (this.columnDisposable) {
                this.columnDisposable.dispose();
                this.columnDisposable = null;
            }
            if (!columns) {
                return;
            }
            this.columnDisposable = this.disposables.add(columns.watch(() => {
                this.deferCreateRow(data, columns);
            }));
            this.createRow(data, columns);
            return 1;
        }

        private deferCreateRow(data, columns) {
            if (this.lastCreateRowId) {
                clearTimeout(this.lastCreateRowId);
                this.lastCreateRowId = null;
            }
            this.lastCreateRowId = setTimeout(() => this.createRow(data, columns), 100);
        }

        private createRow(data: any, columns: AtomColumn[]): void {
            if (this.row) {
                for (const iterator of this.row) {
                    const e = iterator.element;
                    if (e) {
                        iterator.dispose();
                        e.remove();
                    }
                }
                this.row = null;
            }

            this.row = columns.map((x) => {
                const c = new (x[templatePath])(this.app, document.createElement(elementName));
                c.data = data;
                this.append(c);
                return c;
            });
        }

    };

}
