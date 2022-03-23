// Add Font awesome
const fa = document.createElement("link");
fa.href = "https://npm-git.azureedge.net/npm/package/@c8private/fa-icons@6.1.1/css/all.min.css";
fa.crossOrigin = "anonymous";
fa.rel = "stylesheet";
document.head.appendChild(fa);

const bootStrap = document.createElement("link");
bootStrap.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";
bootStrap.crossOrigin = "anonymous";
bootStrap.integrity = "sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3";
bootStrap.rel = "stylesheet";
document.head.appendChild(bootStrap);

document.body.style.minHeight = "500px";
document.body.style.minWidth = "500px";
