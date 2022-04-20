import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import DataGrid, { IDataGridColumn } from "../../../basic/DataGrid";
import GridTestViewModel, { ICurrencyInfo } from "../../data-grid/GridTestViewModel";

@Pack
export default class DataGridTest extends AtomControl {

    public viewModel: GridTestViewModel;

    public orderBy: string = "";

    protected create(): void {
        this.viewModel = this.resolve(GridTestViewModel);

        const columns: IDataGridColumn[] = [
            {
                header: "ID",
                headerClickHandler: () => this.orderBy = "ID",
                headerRenderer: (item: ICurrencyInfo) => {
                    return <td>
                        <span text="ID"/>
                        { this.orderBy === "ID" && <i class="fas fa-circle"/> }
                    </td>;
                },
                label: "id"
            },
            {
                header: "Currency",
                headerClickHandler: () => this.orderBy = "Currency",
                headerRenderer: (item: ICurrencyInfo) => {
                    return <td>
                        <span text="Currency"/>
                        { this.orderBy === "Currency" && <i class="fas fa-circle"/> }
                    </td>;
                },
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
                items={this.viewModel.list}
                columns={columns}/>
            <span text={`Sort by ${this.orderBy}`}/>
        </div>);
    }

}
