const URLactual = window.location.pathname;

if (URLactual == "/faq") {
    if (document.querySelector(".ui-search")) {
        const ui_search = document.querySelector(".ui-search");

        ui_search.classList.toggle("invisible");

        let main = document.querySelector("#root-app");

        main.innerHTML = '<div class="contenedor_principal"> <div class="img_mobile"> <img src="https://iili.io/JC1l54S.jpg" alt="talles_mobile.jpg"> </div> <div class="img_desktop"> <img src="https://iili.io/JC1lY37.jpg" alt="talles_desktop.jpg"> </div> </div>';

        throw new Error("Error controlado");
    } else if (document.querySelector(".ui-search--zrp")) {
        const ui_search = document.querySelector(".ui-search--zrp");

        ui_search.classList.toggle("invisible");

        let main = document.querySelector("#root-app");

        main.innerHTML = '<div class="contenedor_principal"> <div class="img_mobile"> <img src="https://iili.io/JC1l54S.jpg" alt="talles_mobile.jpg"> </div> <div class="img_desktop"> <img src="https://iili.io/JC1lY37.jpg" alt="talles_desktop.jpg"> </div> </div>';

        throw new Error("Error controlado");
    }
}