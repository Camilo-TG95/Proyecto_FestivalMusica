document.addEventListener('DOMContentLoaded', function() {
        iniciarApp(); // Como se van a añadir otras funciones se coloca esta funcion aqui para que llame a las otras 
})                     // y no cargar este codigo. Si fuera un codigo que se ejecuta cuando esta listo se puede poner aqui

/**Esta funcion arranca otras funciones, estas funciones se registran en el EventListener y se mandan a 
 * llamar con la funcion iniciarApp
  */

function iniciarApp() { // Como vamos a tener diferentes funcipones creamos una especifica para las galerias 
    crearGaleria();
    scrolNav();  // esta funcion es para que cuando se marque en los enlaces se deslice suave por la pagina(Smooth scroll)
    navegacionFija(); // creamos una funcion para detectar cuanto scroll estamos dando, puede sirvir para varias cosas
}

// Aqui llamamos la funcion navegacionFija y la configuramos
 function navegacionFija(params) {
    /** Aqui selecionamos un elemento de partida (el .header) y uno o mas elementos (section .sobre-festival) hacia los que se va a dar scroll 
     * para que los detecte  */
        const barra = document.querySelector('.header'); 
        const sobreFestival = document.querySelector('.sobre-festival');
    
        /** (esta parte se añadio despues que la funcion de abajo) Para que cuando se fije la barra al bajar con el scroll no se mueva el contenido del html creamos una nueva variable (body) para 
         * asignarle una nueva clase al body cuando se active el evento de scroll y este a su vez corrija el tamaño del body dandole un padding y no se vea ese salto
         * Importante es necesario ir a globales.scss para configurar la clase body-scroll que se creo y  a la clase fijo (que se creo abajo) del header y corregir la posicion
         ( la clase se le añade en la funcion de abajo*/
        const body = document.querySelector('body');

        /**Aqui programamos un evento que va escuchar sobre el scroll y va a ejecutar un callback */
        window.addEventListener('scroll', function () {
          /** Ahora cramos una condicion con la funcion (getBoundingClientReact) que va a detectar el elemento cuando se este dando el scroll
           * se pone bottom para que reaccione cuando pase la parte de abajo del elemento selecionando */  

                if( sobreFestival.getBoundingClientRect() .bottom < 0) {
                    barra.classList.add('fijo'); // Esto hace que cuando pasemos ese elemento se le va a asignar la clase de fijo a la barra 
                    body.classList.add('body-scroll'); // Esto hace que cuando pasemos ese elemento se le va a asignar la clase de body-scroll al body 
                } else {
                    barra.classList.remove('fijo'); // remueve esa clase
                    body.classList.remove('body-scroll'); // remueve esa clase
                }
                    // Ahora hay que ir al scss del header y configurar la clase de 'fijo'
        });
 
    }



// Aqui se llama la funcion scrolNav y se le da codigo
function scrolNav(params) {
    const enlaces = document.querySelectorAll('.navegacion-principal a') // esta codigo selecciona todos los enlaces de la nevgacion
    enlaces.forEach( enlaces => {  // Para iterar por cada uno del los enlaces para poder asociarle un eventListener a cada uno 
        // La que no se puede asociar un evento a un element o que traiga consigo varios como este caso que contiene tres enlaces
        enlaces.addEventListener( 'click', function(e) {  // esta es la funcion del evento
            e.preventDefault(); // esto quita el comportamiento por default para poder configurarle uno nuevo


            const seccionScroll = e.target.attributes.href.value; // El (e.target.attributes.href.value) nos permite que nos de el valor 
            //del href de cada enlace, no se puede poner value solo porque es un elemento que contiene varios atributos. 
            //Se le asigno un variable (seccionScroll) para no tener que repetir de nuevo los mismo

            const seccion = document.querySelector(seccionScroll); // Aqui se crea un nueva variable y se le asigna el valor del href de cada elemento
            seccion.scrollIntoView( {behavior: 'smooth'}); //  este codigo le da el comportamiento que que se deslice suave a esta funcion
        });
    
    });


}


function crearGaleria() { // Aqui seleccionamos en ul que va a contener la galeria con el querySelector
    const galeria = document.querySelector('.galeria-imagenes');

    // como son 12 imagenes las que se van a añadir a la galeria se utiliza un bucle for para que corra 12 veces
    // este bucle for va a iterar sonbre las imagenes y va a ir creando el codigo html
    for(let i = 1; i <= 12; i++) {
        const imagen = document.createElement('picture'); // Este codigo va crear codigo HTML y lo va alojar en el index.html
        imagen.innerHTML = `  
        <source srcset="build/img/thumb/${i}.avif" type="image/avif">
        <source srcset="build/img/thumb/${i}.webp" type="image/webp">
        <img loading="lazy" width="200" heigth="300" src="build/img/thumb/${i}.jpg" alt="imagen galeria">
   
        `;

        /** Para poder dar click en una de las imagenes pequeñas y esta muestren la imagen grande correspondiente
         *  con mejor resolucion se utiliza el siguiente codigo */
        // creamos un callback con la funcion onclick
        // se pone en forma de callback para poder pasarle el indice que se corresponde con el numero de la imagen
        imagen.onclick = function(){

            mostrarImagen(i);
        }
        
       
        galeria.appendChild(imagen);
    }

}

// Aqui se manda a llamar la funcion que que va a mostrar la imagen correspondiente
// se pone el id para que corresponda con el indice 
function mostrarImagen(id) { // el codigo para que muestre la imgen grade correspondiente es muy similar al que crea la galeria de arriba
    const imagen = document.createElement('picture'); 
        imagen.innerHTML = `  
        <source srcset="build/img/grande/${id}.avif" type="image/avif">
        <source srcset="build/img/grande/${id}.webp" type="image/webp">
        <img loading="lazy" width="200" heigth="300" src="build/img/grande/${id}.jpg" alt="imagen galeria">
   
        `;

        // Crear el Overlay con la imagen
        /** Para crear le efecto que se oscurece la pantalla cuando se selecciona una imagen se utiliza 
         * el coodigo siguiente 
         */

        const overlay = document.createElement('DIV'); // va a crear un div que contenga el overlay 
        overlay.appendChild(imagen); // agrega imagen al elemento overlay como un hijo
        overlay.classList.add('overlay'); // se le asigna la clase overlay


        /** Si queremos que se cierrra el overlay cuaando se de click en cualquier espacie se puede crear un funcion onclick y copiar todo el codigo de la funcion cerrar modal
         * Esta parte se añadio despues 
         */
        overlay.onclick = function() {
            const body = document.querySelector('body'); // no importa que se cree otra variable body porque solo va a ser valida dento de la funcion
            body.classList.remove('fijar-body');// cambiar el add por el remove
            overlay.remove();

        }


        // Boton para cerrar la ventana Modal(el overlay)
        const cerrarModal = document.createElement('P')
        cerrarModal.textContent = 'X';
        cerrarModal.classList.add('btn-cerrar');
        cerrarModal.onclick = function(){ // Este codigo crea el evento de click para que cierre el overlay
           
            const body = document.querySelector('body'); // no importa que se cree otra variable body porque solo va a ser valida dento de la funcion
            body.classList.remove('fijar-body');// cambiar el add por el remove
            overlay.remove();
        }
        overlay.appendChild(cerrarModal);

        // Añadirlo al html
        const body = document.querySelector('body'); // se selecciona el cuerpo completo del html
        body.appendChild(overlay); // se le asigna el overlay al body del html
        body.classList.add('fijar-body'); // se crea esta clase para cuando de abra el overlay no se pueda mover la pagina
        // esta clase solo va a estar disponible cuando se abra el overlay 
        /** para que lo anterior tenga efecto tenemos que ir a globales y añadirle el codigo de css para fijarlo */
        /** Para que una vez que se cierre el overlay se pueda dar scroll nuevamente hay que eliminarle la clase de fijar-body al body
         * Parar hacer esto podemos copiar el codigo anterior dentro de la funcion que remueve el overlay y cambiar el claslist.add
         */
    }


