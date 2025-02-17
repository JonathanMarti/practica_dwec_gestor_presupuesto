import * as gestionPresupuesto from './gestionPresupuesto.js';

let btnActualizarPresupuesto = document.getElementById('actualizarpresupuesto');
btnActualizarPresupuesto.addEventListener('click', actualizarPresupuestoWeb);

let btnAnyadirGasto = document.getElementById('anyadirgasto');
btnAnyadirGasto.addEventListener('click', nuevoGastoWeb);

let btnAnyadirGastoForm = document.getElementById('anyadirgasto-formulario');
btnAnyadirGastoForm.addEventListener('click', nuevoGastoWebFormulario);

let btnFiltrado = document.getElementById("formulario-filtrado");
btnFiltrado.addEventListener("submit", filtrarGastosWeb);

let btnGuardarGastos = document.getElementById("guardar-gastos");
btnGuardarGastos.addEventListener("click", guardarGastosWeb);

let btnCargarGastos = document.getElementById("cargar-gastos");
btnCargarGastos.addEventListener("click", cargarGastosWeb);

let btnCargarGastosAPI = document.getElementById("cargar-gastos-api");
btnCargarGastosAPI.addEventListener("click", cargarGastosApi);

async function cargarGastosApi() {
    let usuario = document.getElementById("nombre_usuario").value;
    let url = "https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/" + usuario;
    let peticion = await fetch(url);
    let respuesta = await peticion.json();
    
    gestionPresupuesto.cargarGastos(respuesta);

    repintar();
}

function guardarGastosWeb() {
    localStorage.GestorGastosDWEC = JSON.stringify(gestionPresupuesto.listarGastos());
}

function cargarGastosWeb() {

    let Gastos = JSON.parse(localStorage.getItem("GestorGastosDWEC"));

    if (!Gastos) {
        gestionPresupuesto.cargarGastos([]);
    } else {
        gestionPresupuesto.cargarGastos(Gastos);
    }

    repintar();
}

function nuevoGastoWeb() {
    let descripcion = prompt('Introduce una descripcion');
    let valor = Number(prompt('Introduce el valor del gasto'));
    let fecha = prompt('Introduce la fecha del gasto');
    let etiquetas = prompt('Introduce las etiquetas del gasto');
    let arrayEtiquetas = etiquetas.split(',');

    let nuevoGasto = new gestionPresupuesto.CrearGasto(descripcion, valor, fecha, ...arrayEtiquetas);
    gestionPresupuesto.anyadirGasto(nuevoGasto);
    repintar();
}

function actualizarPresupuestoWeb() {
    let cantidad = prompt('Introduce una cantidad');
    parseFloat(cantidad);
    gestionPresupuesto.actualizarPresupuesto(cantidad);
    repintar();
}

function mostrarDatoEnId(idElemento, valor) {
    return document.getElementById(idElemento).innerHTML = valor;
}

function repintar() {
    mostrarDatoEnId('balance-total', gestionPresupuesto.calcularBalance());
    mostrarDatoEnId('gastos-totales', gestionPresupuesto.calcularTotalGastos());
    mostrarDatoEnId('presupuesto', gestionPresupuesto.mostrarPresupuesto());
    let listado = document.getElementById('listado-gastos-completo');
    listado.innerHTML = "";
    mostrarGastoWeb('listado-gastos-completo', gestionPresupuesto.listarGastos());
    mostrarGastosAgrupadosWeb("agrupacion-dia", gestion.agruparGastos("dia"), "dia");
    mostrarGastosAgrupadosWeb("agrupacion-mes", gestion.agruparGastos("mes"), "mes");
    mostrarGastosAgrupadosWeb("agrupacion-anyo", gestion.agruparGastos("anyo"), "anyo");
}

function mostrarGastoWeb(idElemento, gastos) {

    let divElemento = document.getElementById(idElemento);
    for (let gasto of gastos) {
        //Crear los divs y elementos necesarios
        let div = document.createElement('div');
        div.className = 'gasto';
        let divDescripcion = document.createElement('div');
        divDescripcion.className = 'gasto-descripcion';
        let divFecha = document.createElement('div');
        divFecha.className = 'gasto-fecha';
        let divValor = document.createElement('div');
        divValor.className = 'gasto-valor';
        let divEtiquetas = document.createElement('div');
        divEtiquetas.className = 'gasto-etiquetas';

        //Insertarlos con su contenido
        divElemento.append(div);
        div.append(divDescripcion);
        divDescripcion.innerHTML = gasto.descripcion;
        div.append(divFecha);
        divFecha.innerHTML = gasto.fecha;
        div.append(divValor);
        divValor.innerHTML = gasto.valor;
        div.append(divEtiquetas);
        for (let eti of gasto.etiquetas) {
            let spanEtiqueta = document.createElement('span');
            spanEtiqueta.className = "gasto-etiquetas-etiqueta";
            spanEtiqueta.innerHTML = eti + ",";
            //Borrar Etiquetas
            let borrarEtiqueta = new BorrarEtiquetasHandle();
            borrarEtiqueta.gasto = gasto;
            borrarEtiqueta.etiqueta = eti;
            spanEtiqueta.addEventListener('click', borrarEtiqueta);
            divEtiquetas.append(spanEtiqueta);
        }
        //Boton editar
        let botoneditar = document.createElement('button');
        botoneditar.className = 'gasto-editar';
        botoneditar.type = 'button';
        botoneditar.innerHTML = 'Editar';
        let editar = new EditarHandle();
        editar.gasto = gasto;
        botoneditar.addEventListener('click', editar);
        div.append(botoneditar);
        //Boton borrar
        let botonBorrar = document.createElement('button');
        botonBorrar.className = 'gasto-borrar';
        botonBorrar.type = 'button';
        botonBorrar.innerHTML = 'Borrar';
        let borrar = new BorrarHandle();
        borrar.gasto = gasto;
        botonBorrar.addEventListener('click', borrar);
        div.append(botonBorrar);
        //Boton borrar API
        let botonBorrarAPI = document.createElement("button");
        botonBorrarAPI.className = "gasto-borrar-api";
        botonBorrarAPI.type = "button";
        botonBorrarAPI.innerHTML = "Borrar (API)";
        let borrarAPI = new BorrarApiHandle();
        borrarAPI.gasto = gasto;
        botonBorrarAPI.addEventListener('click', borrarAPI);
        div.append(botonBorrarAPI);
        //Boton editar (formulario)
        let botonEditarForm = document.createElement('button');
        botonEditarForm.className = 'gasto-editar-formulario';
        botonEditarForm.type = 'button';
        botonEditarForm.innerHTML = 'Editar (formulario)';
        let editarForm = new EditarHandleFormulario();
        editarForm.gasto = gasto;
        botonEditarForm.addEventListener('click', editarForm);
        div.append(botonEditarForm);
    }
}

function mostrarGastosAgrupadosWeb(idElemento, periodo, agrup) {

    // Obtener la capa donde se muestran los datos agrupados por el período indicado.
    // Seguramente este código lo tengas ya hecho pero el nombre de la variable sea otro.
    // Puedes reutilizarlo, por supuesto. Si lo haces, recuerda cambiar también el nombre de la variable en el siguiente bloque de código
    var divP = document.getElementById(idElemento);
    // Borrar el contenido de la capa para que no se duplique el contenido al repintar
    divP.innerHTML = "";
    
    let divElemento = document.getElementById(idElemento);


    let divAgrupacion = document.createElement('div');
    divAgrupacion.className = 'agrupacion';
    let h1Agrupacion = document.createElement('h1');
    h1Agrupacion.innerHTML = 'Gastos agrupados por ' + periodo;
    divElemento.append(divAgrupacion);
    divAgrupacion.append(h1Agrupacion);

    for (let [clave, valor] of Object.entries(agrup)) {

        let divAgrupacionDato = document.createElement('div');
        divAgrupacionDato.className = 'agrupacion-dato';
        let spanAgrupacionClave = document.createElement('span');
        spanAgrupacionClave.className = 'agrupacion-dato-clave';
        let spanAgrupacionValor = document.createElement('span');
        spanAgrupacionValor.className = 'agrupacion-dato-valor';

        spanAgrupacionClave.innerHTML = 'Fecha: ' + clave + " ";
        spanAgrupacionValor.innerHTML = 'Valor: ' + valor;

        divAgrupacion.append(divAgrupacionDato);
        divAgrupacionDato.append(spanAgrupacionClave);
        divAgrupacionDato.append(spanAgrupacionValor);

    }

    // Estilos
    divP.style.width = "33%";
    divP.style.display = "inline-block";
    // Crear elemento <canvas> necesario para crear la gráfica
    // https://www.chartjs.org/docs/latest/getting-started/
    let chart = document.createElement("canvas");
    // Variable para indicar a la gráfica el período temporal del eje X
    // En función de la variable "periodo" se creará la variable "unit" (anyo -> year; mes -> month; dia -> day)
    let unit = "";
    switch (periodo) {
        case "anyo":
            unit = "year";
            break;
        case "mes":
            unit = "month";
            break;
        case "dia":
        default:
            unit = "day";
            break;
    }

    // Creación de la gráfica
    // La función "Chart" está disponible porque hemos incluido las etiquetas <script> correspondientes en el fichero HTML
    const myChart = new Chart(chart.getContext("2d"), {
        // Tipo de gráfica: barras. Puedes cambiar el tipo si quieres hacer pruebas: https://www.chartjs.org/docs/latest/charts/line.html
        type: 'bar',
        data: {
            datasets: [
                {
                    // Título de la gráfica
                    label: `Gastos por ${periodo}`,
                    // Color de fondo
                    backgroundColor: "#555555",
                    // Datos de la gráfica
                    // "agrup" contiene los datos a representar. Es uno de los parámetros de la función "mostrarGastosAgrupadosWeb".
                    data: agrup
                }
            ],
        },
        options: {
            scales: {
                x: {
                    // El eje X es de tipo temporal
                    type: 'time',
                    time: {
                        // Indicamos la unidad correspondiente en función de si utilizamos días, meses o años
                        unit: unit
                    }
                },
                y: {
                    // Para que el eje Y empieza en 0
                    beginAtZero: true
                }
            }
        }
    });
    // Añadimos la gráfica a la capa
    divP.append(chart); 
}

function submitFormulario(event) {
    event.preventDefault();

    let form = event.currentTarget;
    let descripcion = form.elements.descripcion.value;
    let valor = Number(form.elements.valor.value);
    let fecha = form.elements.fecha.value;
    let etiquetas = form.elements.etiquetas.value;
    let arrayEtiquetas = etiquetas.split(',');

    let nuevoGasto = new gestionPresupuesto.CrearGasto(descripcion, valor, fecha, ...arrayEtiquetas);
    gestionPresupuesto.anyadirGasto(nuevoGasto);
    repintar();
    document.getElementById('anyadirgasto-formulario').removeAttribute('disabled', 'disabled');
}


function nuevoGastoWebFormulario(event) {

    let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
    var formulario = plantillaFormulario.querySelector("form");
    let divControles = document.getElementById('controlesprincipales');
    divControles.append(formulario);
    event.currentTarget.setAttribute('disabled', 'disabled');

    //Botón Enviar API
    let botonEnviarAPI = document.createElement("button");
    botonEnviarAPI.className = "gasto-enviar-api";
    botonEnviarAPI.type = "button";
    botonEnviarAPI.innerHTML = "Enviar (API)";
    let enviarAPI = new EnviarApiHandle();
    botonEnviarAPI.addEventListener('click', enviarAPI);
    formulario.append(botonEnviarAPI);

    formulario.addEventListener('submit', submitFormulario);
    let borrarFormulario = new BorrarFormularioHandle();
    borrarFormulario.formulario = formulario;
    borrarFormulario.boton = event.currentTarget;
    formulario.querySelector('button.cancelar').addEventListener('click', borrarFormulario);
}

function BorrarFormularioHandle() {
    this.handleEvent = function (event) {
        this.boton.removeAttribute('disabled', 'disabled');
        this.formulario.remove();
    }
}

function EditarHandleFormulario() {
    this.handleEvent = function (event) {
        let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);      
        var formulario = plantillaFormulario.querySelector("form");

        formulario.descripcion.value = this.gasto.descripcion;
        formulario.valor.value = this.gasto.valor;

        let fecha = new Date(this.gasto.fecha).toISOString();
        let anyo = fecha.substring(0, 4);
        let mes = fecha.substring(5, 7);
        let dia = fecha.substring(8, 10);

        formulario.fecha.value = anyo + "-" + mes + "-" + dia;
        formulario.etiquetas.value = this.gasto.etiquetas;
        event.currentTarget.after(formulario);
        let editarGasto = new EditarGastoHandle();
        editarGasto.gasto = this.gasto;
        formulario.addEventListener('submit', editarGasto);
        
        //Boton editar API
        let botonEditarAPI = document.createElement("button");
        botonEditarAPI.className = "gasto-enviar-api";
        botonEditarAPI.type = "button";
        botonEditarAPI.innerHTML = "Enviar (API)";
        let editarAPI = new EditarApiHandle();
        editarAPI.gasto = this.gasto;
        botonEditarAPI.addEventListener('click', editarAPI);
        formulario.append(botonEditarAPI);

        event.currentTarget.setAttribute('disabled', 'disabled');

        let borrarFormulario = new BorrarFormularioHandle();
        borrarFormulario.formulario = formulario;
        borrarFormulario.boton = event.currentTarget;
        formulario.querySelector('button.cancelar').addEventListener('click', borrarFormulario);
    }
}

function EditarApiHandle() {
    this.handleEvent = function (event) {
        let formulario = event.target.parentElement;

        let descripcionApi = formulario.elements.descripcion.value;
        let valorApi = formulario.elements.valor.value;
        let fechaApi = formulario.elements.fecha.value;
        let etiquetasApi = formulario.elements.etiquetas.value;

        valorApi = parseFloat(valorApi);
        fechaApi = +new Date(fechaApi);

        let arrayEtiquetas = etiquetasApi.split(',');
        let gastoNuevoApi = {
            descripcion: descripcionApi,
            valor: valorApi,
            fecha: fechaApi,
            etiquetas: arrayEtiquetas
        };
        let usuario = document.getElementById("nombre_usuario").value;

        let url = "https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/" + usuario + "/" + this.gasto.gastoId;

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(gastoNuevoApi)
        }).then(function () {
            cargarGastosApi();
        });

    }
}

function EditarGastoHandle() {
    this.handleEvent = function (event){
        event.preventDefault();
        let form = event.currentTarget;
        this.gasto.actualizarDescripcion(form.elements.descripcion.value);
        this.gasto.actualizarFecha(form.elements.fecha.value);
        this.gasto.actualizarValor(Number(form.elements.valor.value));
        let etiquetas = form.elements.etiquetas.value;
        let arrayEtiquetas = etiquetas.split(',');
        this.gasto.anyadirEtiquetas(...arrayEtiquetas);
        form.remove();
        repintar();
    }
}

function EditarHandle() {
    this.handleEvent = function (event) {
        let descripcion = prompt('Introduce una descripcion');
        let valor = Number(prompt('Introduce el valor del gasto'));
        let fecha = prompt('Introduce la fecha del gasto');
        let etiquetas = prompt('Introduce las etiquetas del gasto');
        let arrayEtiquetas = etiquetas.split(',');
        this.gasto.actualizarValor(valor);
        this.gasto.actualizarDescripcion(descripcion);
        this.gasto.actualizarFecha(fecha);
        this.gasto.anyadirEtiquetas(...arrayEtiquetas);
        repintar();
    }
}


function BorrarHandle() {

    this.handleEvent = function (event) {
        gestionPresupuesto.borrarGasto(this.gasto.id);
        repintar();
    }

}

function BorrarApiHandle() {
    this.handleEvent = async function (event) {
        let usuario = document.getElementById("nombre_usuario").value;
        let url = "https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/" + usuario + "/" + this.gasto.gastoId;
        await fetch(url, {
            method: 'DELETE'
        })
            .then(cargarGastosApi);        
    }
}

function EnviarApiHandle() {
    this.handleEvent = async function (event) {

        var formulario = document.querySelector("form");
        let descripcionApi = formulario.elements.descripcion.value;
        let valorApi = formulario.elements.valor.value;
        let fechaApi = formulario.elements.fecha.value;
        let etiquetasApi = formulario.elements.etiquetas.value;
        valorApi = parseFloat(valorApi);
        fechaApi = +new Date(fechaApi);
        let arrayEtiquetas = etiquetasApi.split(',');
        let gastoNuevoApi = {
            descripcion: descripcionApi,
            valor: valorApi,
            fecha: fechaApi,
            etiquetas: arrayEtiquetas
        };

        let usuario = document.getElementById("nombre_usuario").value;
        let url = "https://suhhtqjccd.execute-api.eu-west-1.amazonaws.com/latest/" + usuario;
        await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(gastoNuevoApi)
        }).then(cargarGastosApi);
    }
}

function BorrarEtiquetasHandle() {
    this.handleEvent = function (event) {
        this.gasto.borrarEtiquetas(this.etiqueta);
        repintar();
    }
}

function filtrarGastosWeb(event){
    event.preventDefault();

    let formularioFiltrado = event.currentTarget; 
    let descripcionContiene = formularioFiltrado.elements['formulario-filtrado-descripcion'].value;
    let valorMinimo = formularioFiltrado.elements['formulario-filtrado-valor-minimo'].value;
    let valorMaximo = formularioFiltrado.elements['formulario-filtrado-valor-maximo'].value;
    let fechaDesde = formularioFiltrado.elements['formulario-filtrado-fecha-desde'].value;
    let fechaHasta = formularioFiltrado.elements['formulario-filtrado-fecha-hasta'].value;
    let etiquetasTiene = formularioFiltrado.elements['formulario-filtrado-etiquetas-tiene'].value;
    valorMinimo = parseFloat(valorMinimo);
    valorMaximo = parseFloat(valorMaximo);

    if (etiquetasTiene != null) {
        etiquetasTiene = gestionPresupuesto.transformarListadoEtiquetas(etiquetasTiene);
    }
    let gastosFiltrados = gestionPresupuesto.filtrarGastos({
        descripcionContiene: descripcionContiene, valorMinimo: valorMinimo,
        valorMaximo: valorMaximo, fechaDesde: fechaDesde, fechaHasta: fechaHasta,
        etiquetasTiene: etiquetasTiene
    });
    let listaFiltrada = document.getElementById('listado-gastos-completo');
    listaFiltrada.innerHTML = "";
    mostrarGastoWeb('listado-gastos-completo', gastosFiltrados);
}

export {
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb
}