export function installInputRangeStyle() {

    if (document.head.querySelector(`[data-id="input-range-style"]`)) {
        return;
    }

    const css = `input[type=range] {
        height: 22px;
        -webkit-appearance: none;
        margin: 10px 0;
        width: 100%;
      }
      input[type=range]:focus {
        outline: none;
      }
      input[type=range]::-webkit-slider-runnable-track {
        width: 100%;
        height: 5px;
        cursor: pointer;
        animate: 0.2s;
        box-shadow: 0px 0px 0px #000000;
        background: var(--accent-track-color,#2497E3);
        border-radius: 1px;
        border: 0px solid #000000;
      }
      input[type=range]::-webkit-slider-thumb {
        box-shadow: 0px 0px 0px #000000;
        border: 1px solid var(--accent-track-color,#2497E3);
        height: 15px;
        width: 15px;
        border-radius: 50px;
        background: var(--accent-thumb-color,#A1D0FF)
        cursor: pointer;
        -webkit-appearance: none;
        margin-top: -5.5px;
      }
      input[type=range]:focus::-webkit-slider-runnable-track {
        background: var(--accent-track-color,#2497E3);
      }
      input[type=range]::-moz-range-track {
        width: 100%;
        height: 5px;
        cursor: pointer;
        animate: 0.2s;
        box-shadow: 0px 0px 0px #000000;
        background: var(--accent-track-color,#2497E3);
        border-radius: 1px;
        border: 0px solid #000000;
      }
      input[type=range]::-moz-range-thumb {
        box-shadow: 0px 0px 0px #000000;
        border: 1px solid var(--accent-track-color,#2497E3);
        height: 15px;
        width: 15px;
        border-radius: 50px;
        background: var(--accent-thumb-color,#A1D0FF)
        cursor: pointer;
      }
      input[type=range]::-ms-track {
        width: 100%;
        height: 5px;
        cursor: pointer;
        animate: 0.2s;
        background: transparent;
        border-color: transparent;
        color: transparent;
      }
      input[type=range]::-ms-fill-lower {
        background: var(--accent-track-color,#2497E3);
        border: 0px solid #000000;
        border-radius: 2px;
        box-shadow: 0px 0px 0px #000000;
      }
      input[type=range]::-ms-fill-upper {
        background: var(--accent-track-color,#2497E3);
        border: 0px solid #000000;
        border-radius: 2px;
        box-shadow: 0px 0px 0px #000000;
      }
      input[type=range]::-ms-thumb {
        margin-top: 1px;
        box-shadow: 0px 0px 0px #000000;
        border: 1px solid var(--accent-track-color,#2497E3);
        height: 15px;
        width: 15px;
        border-radius: 50px;
        background: var(--accent-thumb-color,#A1D0FF)
        cursor: pointer;
      }
      input[type=range]:focus::-ms-fill-lower {
        background: var(--accent-track-color,#2497E3);
      }
      input[type=range]:focus::-ms-fill-upper {
        background: var(--accent-track-color,#2497E3);
      }
      `.replace(/input\[/g, "input.player[");

    const style = document.createElement("style");
    style.textContent = css;
    style.setAttribute("data-id", "input-range-style");
    document.head.appendChild(style);
}
