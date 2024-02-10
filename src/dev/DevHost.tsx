import Bind from "@web-atoms/core/dist/core/Bind"
import XNode from "@web-atoms/core/dist/core/XNode"
import { BaseService, Get, Query } from "@web-atoms/core/dist/services/http/RestService";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import styled from "@web-atoms/core/dist/style/styled";
import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";

import "@web-atoms/data-styles/data-styles";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import Action from "@web-atoms/core/dist/view-model/Action";
import DISingleton from "@web-atoms/core/dist/di/DISingleton";
import AtomRepeater from "../basic/AtomRepeater";
import ToggleButtonBar from "../basic/ToggleButtonBar";

	styled.css `
		:root {
			--accent-color: orangered;
			--accent-text-color: white;
		}
		html, body {
			margin: 0;
			padding: 0;
			font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
		}
	`.installGlobal();

	const css = styled.css `
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display: grid;
		grid-template-rows: auto 1fr;
		gap: 5px;

		& > header {
			grid-row: 1;
		}
		& > div {
			grid-row: 2;
			align-items: stretch;
			justify-self: stretch;
			overflow: auto;

			& [data-item-index]:hover {
				background-color: lightgreen;
			}
		}
	`.installLocal();

const fileTypes = () => [
	{ label: "Packed", value: "packed"},
	{ label: "All", value: "all"}
];

const designModes = () => [
	{ label: "Design", value: true },
	{ label: "Live", value: false }
];

const replaceSrc = (src: string): string => {
    src = src.split("\\").join("/");
    const tokens = src.split("/");
    if (tokens[0] === "src") {
        tokens[0] = "dist";
    }
    return tokens.join("/");
}

const toAbsoluteUrl = (file: IFilePath, designMode?: boolean) => {
	let url = `/uiv/$CURRENT$/${replaceSrc(file.dir)}/${file.name}`;
	if (designMode) {
		if (url.indexOf("?") === -1) {
			url += "?";
		}
		url += "&designMode=true";
	}
	return `${location.protocol}//${location.host}${url}`;
};

@DISingleton({})
export class FileService extends BaseService {

    public async getModules(search: string, packed: boolean, cancelToken: CancelToken) {
        const result = await this.getRemoteModules(search, packed, cancelToken);
        return result.files;
    }

    @Get("/flat-modules")
    private getRemoteModules(
        @Query("search") search: string,
        @Query("packed") packed: boolean,
        ct?: CancelToken): Promise<IFilePathResult> {
        return null;
    }

}

export default class AppHost extends AtomControl {

	public search: string = "";

	public designMode = false;

	public fileType = "packed";

	@InjectProperty
	private fileService: FileService;

	public async init() {

		this.render(
		<div
			class={css}>
			<header
				data-layout="row"
				data-padding="auto"
				class="header">
				<input
					type="search"
					value={Bind.twoWaysImmediate(() => this.search)}
					placeholder="Search...">
				</input>

				<span>Mode</span>
				<ToggleButtonBar
					items={designModes()}
					value={Bind.twoWays(() => this.designMode)}
					/>

				<ToggleButtonBar
					items={fileTypes()}
					value={Bind.twoWays(() => this.fileType)}
					/>
			</header>
			<div>
				<AtomRepeater
					class="grid"
					items={Bind.oneWayAsync((x, e, cancelToken) =>
						this.getModules(this.search, this.fileType === "packed", cancelToken))}
					for="table"
					itemRenderer={(item: IFilePath) => <tr
						template="itemTemplate">
						<td>
							<div
								text={item.name}
								title={item.dir}
								style="font-weight: 500;">
							</div>
							<div
								style="font-size: small;"
								text={item.dir}>
							</div>
						</td>
						<td>
							<a
								data-layout="accent-button"
								data-text-decoration="none"
								href={Bind.source(item, (x) => toAbsoluteUrl(x.source, this.designMode))}
								target="_blank"
								text="Open">
							</a>
							<i
								class="fas fa-copy"
								title="Copy Url"
								style="margin: 5px; cursor: pointer;"
								data-click-event="copy-url"
								eventClick={() => this.copyUrl(toAbsoluteUrl(item, this.designMode))}>
							</i>
						</td>
					</tr> } />
			</div>
		</div>
		);
	}

	async getModules(search: string, packed: boolean, cancelToken: CancelToken) {
		const result = await this.fileService.getModules(search, packed, cancelToken);
		if (!result.length && packed) {
			this.fileType = "all";
		}
		return result;
	}

	protected preCreate(): void {
		super.preCreate();
		(this.app).installStyleSheet({
            href: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css",
            integrity: "sha256-HtsXJanqjKTc8vVQjO4YMhiqFoXkfBsjBWcX91T1jr8=",
            crossOrigin: "anonymous"
        });
		this.runAfterInit(() => this.app.runAsync(() => this.init()));
	}

    @Action({ success: "Copied successfully"})
	protected async copyUrl(url: string) {
        await navigator.clipboard.writeText(url);
	}
}
export interface IFilePath {

    name: string;
    base: string;
    dir: string;
    ext: string;
    root: string;
    url: string;
    hostUrl?: string;
    package?: string;
    visible: boolean;
    packed?: boolean;
    module?: string;

}

export interface IFilePathResult {

    files: IFilePath[];

}

