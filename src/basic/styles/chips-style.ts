import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    gap: 4px;
    display: flex;
    flex-flow: wrap;

    & > .search {
        border: none;
        outline: none;
        flex: 1 1;
    }

    & > .footer {
        margin-left: auto;
    }

    & > .presenter {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: 4px;
        display: inline-flex;
        flex-flow: wrap;
        & > * {
            background-color: rgba(211,211,211,0.3);
        }
    }

    &[data-mode=search] {
        & > .search {
            padding-left: 20px;
            background: transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' class='bi bi-search' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E") no-repeat 1px center;
        }
    }
`.installGlobal("div[data-atom-chips]");
