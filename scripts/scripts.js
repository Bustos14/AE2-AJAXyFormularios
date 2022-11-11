//Variables para guardar listas y poder manipularlas a posteriori.
var listadoIngredientes;
var listadoDimensiones;


//Función onload que carga la información al cargar la página.
window.onload = function(){
    enviarDatosIngredientes();
    enviarDatosTamanios();
    const btnEnviar = document.getElementById("btnEnviar");

    btnEnviar.onclick = function(){
        //Compruebo en primera instancia si hay validación de datos de texto
        if(validarTextos()){
            //Si entra, compruebo la validación de si se ha seleccionado algun ingredientes
             if( validarChecks()){
                //Guardo el calculo de todos los ingredientes
                let cantidadFinal = calculoPrecioIngredientes(listadoIngredientes);
                //Sumo el calculo del tamaño seleccionado
                cantidadFinal = cantidadFinal + precioTamanio(listadoDimensiones); 
                //Saco un alert que indica cual es el precio final de la pizza que se ha "creado"
                alert(`El precio total será ${cantidadFinal} €`)
                return;
             }else{
                //Mensaje de error en caso de no seleccionar ingredientes.
                alert('[ERROR] Debe seleccionar al menos un ingrediente')
                return;
             }  
        }
    }
    
    //Llamo al boton que hará el reset de la pagina
    const btnReset = document.getElementById("btnReset");
    btnReset.onclick = function(){
        //Busco los contenedores de ingredientes y tamaños
        let ingContenedor = document.getElementById("ingredientesContent")
        let tmContenedor = document.getElementById("dimensionesContent") 
        //Si el contenedor de ingredientes tiene contenido dentro, es decir, nodos hijos
        if(ingContenedor.hasChildNodes()){
            //Siempre que tenga al menos un nodo, borraremos el primero que encuentre
            while(ingContenedor.childNodes.length>=1){
                ingContenedor.removeChild(ingContenedor.firstChild);
            }
            //Volvemos a enviar los datos de los ingredientes para volver a "pintarlos"
            enviarDatosIngredientes();
        } 
        //El mismo procedimiento que con los ingredientes se hace con los tamaños, para poder borrar y crear
        //sus apartados y evitar duplicados
        if(tmContenedor.hasChildNodes()){
            while(tmContenedor.childNodes.length>=1){
                tmContenedor.removeChild(tmContenedor.firstChild);
            }
            enviarDatosTamanios();
        } 
    }
}
//AJAX
//Guardamos los archivos JSON que simulan nuestras BD en dos variables para poder manejarlas 
const datosDimensiones = "tamaniosPizza.json"
const datosIngredientes = "ingredientes.json"
//Indicamos una URL de destino
const urlDestino = "http://localhost:5501/"

function enviarDatosIngredientes(){
    let xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange= function(){
        if (this.readyState == 4) {
            if (this.status == 200) {
                creacionDatosIngredientes(this.responseText)
            } else {
                alert("¡Error en la obtencion de datos!")
            }
        }  
    }
    xmlHttp.open('GET', urlDestino + datosIngredientes, true)
    xmlHttp.send(null)
}

function enviarDatosTamanios(){
    let xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange= function(){
        if (this.readyState == 4) {
            if (this.status == 200) {
                creacionDatosTamanios(this.responseText)
            } else {
                alert("¡Error en la obtencion de datos!")
            }
        }  
    }
    xmlHttp.open('GET', urlDestino + datosDimensiones, true)
    xmlHttp.send(null)
}
//Esta función obtiene los datos de los ingredientes
function creacionDatosIngredientes(jsonDoc) {
    //Guardo el objeto Json para guardarlo posteriormente en un array de ingredientes
    let objetoJson = JSON.parse(jsonDoc)
    let arrayIngredientes = objetoJson.CATALOGO.INGREDIENTES;
    //Guardo el array obtenido en una variable local para poder usarlo posteriormente
    listadoIngredientes = arrayIngredientes;
    //Creo la tabla que contendrá los ingredientes
    let table = document.createElement("table");
    //Creo que div que contendrá todos los elementos
    let divContenedor = document.getElementById("ingredientesContent");
    //Recorro el array que hemos obtenido para poder asignar valores y crear todos los checkbox correspondientes
    for( let ing of arrayIngredientes){    
        let td = document.createElement("td"); 
        const checkLabel = document.createElement("label");
        //Asigno los valores que obtengo del array, estos valores los hemos obtenido gracias al objeto JSON
        checkLabel.textContent=ing.NOMBRE+` ${ ing.PVP}€`;
        const check = document.createElement("input");
        check.id= ing.NOMBRE;
        check.type = "checkbox";
        check.name = "ingrediente"
        checkLabel.appendChild(check);
        td.appendChild(checkLabel);    
        table.appendChild(td)
    }
    //ASigno id a la tabla por si tuviese que utilizarla posteriormente
    table.id = "tableIngredientes";
    //Guardo la tabla en el contenedor
    divContenedor.appendChild(table);
}
//Esta funciñon obtiene los datos de las dimensiones
function creacionDatosTamanios(jsonDoc){
    //Guardo el objeto Json para guardarlo posteriormente en un array de ingredientes
    let objetoJson = JSON.parse(jsonDoc)
    let arrayTamanios = objetoJson.PIZZAS.TAMANIOS;
    //Guardo el array obtenido en una variable local para poder usarlo posteriormente
    listadoDimensiones = arrayTamanios;
    //Creo la tabla que contendrá los ingredientes
    let table = document.createElement("table");
    //Creo que div que contendrá todos los elementos
    let divContenedor = document.getElementById("dimensionesContent");
   //Recorro el array que hemos obtenido para poder asignar valores y crear todos los radiobuttons corresspondientes
    for( let tm of arrayTamanios){   
        let td = document.createElement("td"); 
        const checkLabel = document.createElement("label");
        //Asigno los valores que obtengo del array, estos valores los hemos obtenido gracias al objeto JSON
        checkLabel.textContent=tm.NOMBRE+` ${ tm.PVP}€ (${tm.DIMENSIONES}cm)`;
        const check = document.createElement("input");
        check.type = "radio";
        check.name = "tamanio"
        check.id = tm.NOMBRE;
        td.appendChild(checkLabel);
        checkLabel.appendChild(check);
        table.appendChild(td)
    }   
    //ASigno id a la tabla por si tuviese que utilizarla posteriormente
    table.id = "tableContendor";
    table.setAttribute("style",  "margin: auto;")
    //Guardo la tabla en el contenedor
    divContenedor.appendChild(table);
    let rdChecked = document.getElementById("PEQUEÑA");
    //checkeo por defecto
    rdChecked.checked = true;
}
//Función para sumar todos los ingredientes que selecciono y poder sumarlos. Le pasamos una lista
function calculoPrecioIngredientes(listado){
    //Iniciamos variable a 0, ya que el total por defecto será 0€
    let total = 0;
    //Recorro el listado que le pasamos por parametro
    for(objeto of listado){
        //Comprobamos si hay elementos seleccionados
        let elementoActivo = document.querySelector(`input[id="${objeto.NOMBRE}"]:checked`);
        //Creamos variable para contener el precio del objeto de ese momento del bucle
        let precioElemento = objeto.PVP;
        //En caso de que haya elemento activo
        if(elementoActivo){
            //El total cambia, igualandose al precio del elemento activo + el total, por si el total cambiase y asi no peder valores
            total = precioElemento + total;
        }
    }
    //Retornamos un total del precio de ingredientes
    return total;
}
//Función para obtener el precio de la dimensión de la pizza seleccionada
function precioTamanio(listado){
    //Obtengo en una variable la dimension selecciona, por defecto siempre es la primera
    let elementoActivo = document.querySelector(`input[name=tamanio]:checked`);
    //Creo una variable total para contener el precio en caso de que se haya seleccionado
    let total = 0;
    for(objeto of listado){
        //Recorro todo el listado de objetos para comprobar si el nombre del objeto corresponde con el elemento activo seleccionado
        if(objeto.NOMBRE == elementoActivo.id){
            //Si es asi, total se iguala al precio de la selección
            total = objeto.PVP;
        }
    }
    //Retorno el total, es decir, el precio seleccionado.
    return total;
}

//Control de datos del usuario
function validarTextos(){
    //Cada if, comprueba si se ha introducido al menos un caracter en la validación de Nombre, 
    //Email, telefono y dirección. En caso de que todos tengan al menos un caracter, retorna true
    if(document.getElementById("nombre").value.length==0){
        alert('[ERROR] Introduzca un nombre');
        return false;
    }
    if(document.getElementById("email").value.length==0){
        alert('[ERROR] Introduzca su email');
        return false;
    }
    if(document.getElementById("telefono").value.length==0){
        alert('[ERROR] Introduzca su telefono');
        return false;
    }
    if(document.getElementById("direccion").value.length==0){
        alert('[ERROR] Introduzca una dirección');
        return false;
    }
    return true;
}
//Funcion que comprueba si hay un check seleccionado
function validarChecks(){
    //Comprobamos si alguno de los checks esta seleccionado, si es asi, devuelve true, si no, false.
    let elementoActivo = document.querySelector(`input[name=ingrediente]:checked`);
    if(elementoActivo){
        return true;
    }
    return false;
}