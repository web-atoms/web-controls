import XNode from "@web-atoms/core/dist/core/XNode.js";
import { ContentPage } from "../../../../mobile-app/MobileApp.js";
import { IPost } from "../../model/model.js";
import FormField from "../../../../basic/FormField.js";

export default class DetailPage extends ContentPage<IPost> {

    model: IPost;

    async init() {

        this.model = this.parameters;


        this.renderer = <div>
            <section>
                <FormField label="ID">
                    <span text={this.model.id}></span>
                </FormField>
                <FormField label="Title">
                    <span text={this.model.title}></span>
                </FormField>
                <FormField label="User">
                    <span text={this.model.userId}></span>
                </FormField>
                <FormField label="Reactions">
                    <span text={this.model.reactions}></span>
                </FormField>
            </section>
        </div>;

    }
}