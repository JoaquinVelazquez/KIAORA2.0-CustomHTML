const URLactual = window.location.pathname;
const componentWrapper = document.querySelectorAll(".component-wrapper");
const tarjetas = document.querySelector(".tarjetas-1");
const tarjetasCategorias = document.querySelector(".tarjetas_categorias");

if (URLactual == "/") {
  setTimeout(function () {
    $(document).ready(function () {
      $(tarjetas).insertAfter($(componentWrapper[0]));
      $(tarjetasCategorias).insertAfter($(tarjetas));
    });
  }, 1000);
}