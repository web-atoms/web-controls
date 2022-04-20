import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import DataGrid, { IDataGridColumn } from "../../../basic/DataGrid";
import GridTestViewModel, { ICurrencyInfo } from "../../data-grid/GridTestViewModel";

@Pack
export default class DataGridTest extends AtomControl {

    public viewModel: GridTestViewModel;

    public orderBy: string;

    protected create(): void {
        this.viewModel = this.resolve(GridTestViewModel);
        this.orderBy = "ID Desc";
        const columns: IDataGridColumn[] = [
            {
                header: "ID",
                headerSortUp: "ID",
                headerSortDown: "ID Desc",
                label: "id"
            },
            {
                header: "Currency",
                headerSortUp: "Currency",
                headerSortDown: "Currency Desc",
                headerSortDefault: "Currency Desc",
                cellRenderer(item: ICurrencyInfo) {
                    return <td text={item.currency}/>;
                }
            },
            {
                header: "Code",
                cellRenderer(item: ICurrencyInfo) {
                    return <td text={item.currencyCode}/>;
                }
            }
        ];

        this.render(<div>
            <DataGrid
                orderBy={Bind.twoWays(() => this.orderBy)}
                items={this.viewModel.list}
                columns={columns}/>
            <span text={Bind.oneWay(() => `Sort by ${this.orderBy}`)}/>
        </div>);
    }

}
