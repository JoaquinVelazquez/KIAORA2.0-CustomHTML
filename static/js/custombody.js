const URLactual = window.location.pathname;
const componentWrapper = document.querySelectorAll(".component-wrapper");
const tarjetas = document.querySelector(".tarjetas-1");
const tarjetasCategorias = document.querySelector(".tarjetas_categorias");
const redes = document.querySelector(".seccion-redes");
// const titulo = document.querySelector(".seccion_titulo");

if (URLactual == "/") {
  setTimeout(function () {
    $(document).ready(function () {
      $(tarjetas).insertAfter($(componentWrapper[0]));
      // $(titulo).insertAfter($(componentWrapper[1]));
      $(tarjetasCategorias).insertAfter($(tarjetas));
    });
  }, 1000);
} else {
  tarjetas.style.display = 'none';
  tarjetasCategorias.style.display = 'none';
  redes.style.display = 'none';
  // titulo.style.display = 'none';
}