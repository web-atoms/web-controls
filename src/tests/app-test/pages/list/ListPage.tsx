import XNode from "@web-atoms/core/dist/core/XNode.js";
import { ContentPage } from "../../../../mobile-app/MobileApp.js";
import Bind from "@web-atoms/core/dist/core/Bind.js";
import AtomRepeater from "../../../../basic/AtomRepeater.js";
import FetchBuilder from "@web-atoms/core/dist/services/FetchBuilder.js";
import { IPost, IPostSearchResult } from "../../model/model.js";
import Action from "@web-atoms/core/dist/view-model/Action.js";
import MasterDetailPage from "../../../../mobile-app/MasterDetailPage.js";
import DetailPage from "../detail/DetailPage.js";

import "./ListPage.local.css";

export default class ListPage extends MasterDetailPage {

    start = 0;
    size = 20;
    search = "";

    repeater: AtomRepeater;

    async init() {

        this.element.className = "list-page";

        this.renderer = <div data-layout="center-all">
            <div>Loading....</div>
        </div>;

        // it is important to set start to zero when search changes
        this.headerRenderer = () => <div data-layout="row">
            <input
                type="search"
                event-input={() => this.start = 0}
                value={Bind.twoWaysImmediate(() => this.search)}
                placeholder="Search in post title..."/>
        </div>;

        this.renderer = <div>
            <AtomRepeater
                selectOnClick={true}
                data-items-updated-event="items-updated"
                data-selection-updated-event="selection-updated"
                presenter={Bind.presenter((c) => this.repeater = c)}
                items={Bind.oneWayAsync((c, e, cancelToken) => 
                    this.searchPosts({
                        q: this.search,
                        skip: this.start,
                        limit: this.size
                        , cancelToken})
                )}
                itemRenderer={(item: IPost) => <div>
                    <span class="title" text={item.title}/>
                    <div class="reaction">
                        <i class="fas fa-heart"/>
                        <span text={item.reactions}/>
                    </div>
                    <div class="tags">
                        { ... item.tags.map((x) => <span text={"#" + x}/>)}
                    </div>
                </div>}
                />
        </div>;
    }

    @Action({ onEvent: "items-updated"})
    itemsUpdated() {
        if (!this.repeater.items.length) {
            return;
        }
        if(this.repeater.selectedItem) {
            return;
        }
        this.repeater.selectedItem = this.repeater.items[0];
    }

    @Action({ onEvent: "selection-updated", defer: 10})
    selectionUpdated() {
        if (!this.repeater.selectedItem) {
            return;
        }
        this.openDetail(DetailPage, this.repeater.selectedItem);
    }

    async searchPosts({
        q = "",
        skip = 0,
        limit = 20,
        cancelToken = null
    }) {
        const results = await FetchBuilder.get("https://dummyjson.com/posts/search")
            .queries({
                q,
                skip,
                limit
            })
            .cancelToken(cancelToken)
            .asJson<IPostSearchResult>();
        return results.posts;
    }
}