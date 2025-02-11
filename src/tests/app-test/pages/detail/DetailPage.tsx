import XNode from "@web-atoms/core/dist/core/XNode";
import { ContentPage } from "../../../../mobile-app/MobileApp";
import { IPost } from "../../model/model";
import FormField from "../../../../basic/FormField";

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