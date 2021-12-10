import Bind from "@web-atoms/core/dist/core/Bind";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomToggleButtonBar } from "@web-atoms/core/dist/web/controls/AtomToggleButtonBar";
import PopupService from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import type { HtmlEditorControl } from "../HtmlEditor";
import CommandButton, { notSet } from "./CommandButton";

const linkTypes = [
    {
        label: "Web Page",
        value: "web-page"
    },
    {
        label: "Email",
        value: "email"
    },
    {
        label: "Anchor",
        value: "anchor"
    },
    {
        label: "Phone",
        value: "phone"
    }
];

const vm = {
    selectedType: "web-page",
    link: ""
};

const linkDialogCss = CSS(StyleRule()
    .display("flex")
    .flexDirection("row")
);

async function showDialog(s: HtmlEditorControl, e: Event) {
    const popupService = s.app.resolve(PopupService);

    vm.link = "";
    vm.selectedType = "web-page";
    let resolved = false;
    const cancelToken = new CancelToken();
    await popupService.showWindow(s.element, {
        parameters: vm,
        cancelToken
    }, <div class={linkDialogCss}>
        <AtomToggleButtonBar
            items={linkTypes}
            value={Bind.twoWays((x) => x.viewModel.selectedType)}/>
        <input value={Bind.twoWaysImmediate((x) => x.viewModel.link)}/>
        <button
            text="Add"
            eventClick={Bind.event((x) =>
            setTimeout(() => {
                resolved = true;
                cancelToken.cancel();
            }, 1)
        )} />
    </div>);

    switch (vm.selectedType) {
        case "web-page":
        case "phone":
        case "email":
        case "anchor":
            return vm.link;
    }
}

export default function AddLink({
    insertCommand = "createLink"
}) {
    return CommandButton({
        icon: "ri-link-m",
        insertCommand,
        eventInsertHtml: showDialog,
        title: "Create Hyper Link"
    });
}
