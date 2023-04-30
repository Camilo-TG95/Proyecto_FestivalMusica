// Colocar un Watch en el compilador SASS con Gulp 

// Primero es necesario añadirle la funcion  de watch a las {}
const { src, dest, watch, parallel } = require("gulp"); 

//CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

// JavaScrip

const terser = require('gulp-terser-js');

// Imagenes 
const cache = require('gulp-cache'); // Funcion de cache
const imagemin = require('gulp-imagemin'); // Funcion de imagemin
const webp = require('gulp-webp');// crear la funcion para convertir las imagenes a webp
const avif = require('gulp-avif');

function css( done ) {
    
    src('src/scss/**/*.scss') // Identifica el archivo sass
        .pipe(sourcemaps.init())
        .pipe( plumber())
        .pipe( sass())  // Compila el archivo
        .pipe(postcss([autoprefixer(), cssnano()] ) )
        .pipe(sourcemaps.write('.'))
        .pipe( dest("build/css"))   // Almacena el archivo

    done();
}
// Tarea que utiliza la funcion que convierte las imagenes a webp

function versionwebp( done ) {
    const opciones = {
        quality: 50  //aqui definimos una variable para la calidad de las imagenes 
    };
    src('src/img/**/**.{png,jpg}')
        .pipe(webp(opciones) )
        .pipe( dest('build/img') )
    done();
}

function versionAvif( done ) {
    const opciones = {
        quality: 50  //aqui definimos una variable para la calidad de las imagenes 
    };
    src('src/img/**/**.{png,jpg}')
        .pipe(avif(opciones) )
        .pipe( dest('build/img') )
    done();
}


// esta es la tarea de la funcion de la depencia de imagemin para aligerar imagenes
// Se instala junto a cache 
function imagenes( done ) {

    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/**.{png,jpg}')
    .pipe(cache(imagemin(opciones) ) )
    .pipe( dest('build/img') )
    done();
}

// Aqui creamos una funcion para que compile el codigo de JS escrito en el archivo de app.js
function javascript( done ) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe( terser() )
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));  // Este codigo lo guarda dentro de la carpeta build


    done();
}

/** Es duespues se crea una segunda funcion que contenga el watch y que este atento a todos
 * los cambios que ocurran el el fichero app.sass y se le asocia la funcion css. 
 * Con esto cuando se mande a lamar la funcion dev se va a ejecutar en cadena la funcion css
 */

function dev( done ) {
    watch("src/scss/**/*.scss", css);
    watch("src/js/**/*.js", javascript); // Creamos un wacth que este pendiente a los cambios en app.js 
    
    done()
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionwebp = versionwebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionwebp, versionAvif,javascript, dev);
// Si quieres que gulp desarrolle dos funciones de forma paralela se 
// le puede añadir el parametro parallel antes del ultima dev
// no se puede olvidar añadir parallel arriba



/** Para que pueda exportar la funcion css es necesario instalar una dependencia de gulp
 * poner en la terminal npm i --save-dev gulp-sass
 * Para que funcione correctamente se debe modificar el codigo de const sass:
 * const sass = require ("gulp-sass")(reguire('sass'));
 */


// Para llamarlo poner en la terminal npx gulp css