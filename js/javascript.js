const sobremiEntrada = document.getElementById("sobremiEntrada");
const btnCoartada = document.getElementById("btnCoartada");
const resultadoCoartada = document.getElementById("resultadoCoartada");
const btnCalcular = document.getElementById("btnCalcular");
const selectDelitoOriginal = document.getElementById("selectDelito");
const testigos = document.getElementById("testigos");
const resultadoDelitos = document.getElementById("resultadoDelitos");
const btnDefensa = document.getElementById("btnDefensa");
const btnAsesoria = document.getElementById("btnAsesoria");
const btnJuicios = document.getElementById("btnJuicios");
const resultadoServicio = document.getElementById("resultadoServicio");
const inputNombre = document.getElementById("inputNombre");
const selectExcusa = document.getElementById("selectExcusa");
const btnMedir = document.getElementById("btnMedir");
const resultadoMedidor = document.getElementById("resultadoMedidor");
const formularioClientes = document.getElementById("formulario-clientes");
const botoninsertarcliente = document.getElementById("btn-guardar");
const botoneliminarcliente = document.getElementById("btn-borrar");
const botonactualizarcliente = document.getElementById("btn-actualizar");
const mensajesalida = document.getElementById("mensajesalida");
const inputId = document.getElementById("cliente-id");
const campoNombre = document.getElementById("nombre");
const campoAlias = document.getElementById("alias");
const campoDelito = document.getElementById("delito");
const campoAgente = document.getElementById("selectAgente");

//Elementos api externa 
const btnGenerarAlias = document.getElementById("btn-generar-alias");
const inputAlias = document.getElementById("alias");
const ENDPOINT_ALIAS = "https://api.api-ninjas.com/v1/randomuser";
const API_KEY = "8pGWpVrtq1Kd220VA3EeNqbQxEY9d75y18ckKo7N";


const listaCoartadas = [
    "Estaba de misa rezando por los pecadores.",
    "Me quede encerrado en el baño sin bateria en el movil.",
    "Fui abducido por extraterrestres (tengo un boceto de la nave).",
    "Ese en el video de seguridad es mi gemelo malvado.",
    "Estaba en casa alimentando a mis 14 gatos."
];
const sentencias = [
    "libre de cargos, por ahora.",
    "culpable, pero con estilo.",
    "muy culpable. Llámanos YA.",
    "inocente... según nuestro abogado.",
    "culpable al 100%. Oferta especial esta semana."
];


const ENDPOINT_OBTENER_CLIENTES = "http://localhost:3000/clientes";
const ENDPOINT_GESTION_CLIENTE = "http://localhost:3000/cliente";
const ENDPOINT_OBTENER_AGENTES = "http://localhost:3000/agentes";

const cabecera_peticion = new Headers();
cabecera_peticion.append("Accept", "application/json");
cabecera_peticion.append("Content-Type", "application/json");

let requestoptions = {
    method: "GET",
    headers: cabecera_peticion,
    redirect: "follow"
};

document.addEventListener("DOMContentLoaded", () => {

    //API externa para generar alias de criminales
    if (btnGenerarAlias) {
        btnGenerarAlias.addEventListener("click", () => {
            fetch(ENDPOINT_ALIAS, {
                method: 'GET',
                headers: {
                    'X-Api-Key': API_KEY
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error en la petición:${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const nuevoAlias = data.username;
                    inputAlias.value = nuevoAlias;
                })
                .catch(error => {
                    console.error(`${error.name}: ${error.message}`);

                    inputAlias.value = "";
                    inputAlias.placeholder = "Error al generar alias";
                });
        });
    }

    if (sobremiEntrada) {
        sobremiEntrada.style.animation = "none";
        void sobremiEntrada.offsetWidth;
        sobremiEntrada.style.animation = "escribir 3s ease-out forwards";
    }

    if (btnDefensa) {
        btnDefensa.addEventListener("click", () => {
            resultadoServicio.innerHTML = `
            <div class="tarjeta-servicio">
                <p class="tarjeta-servicio-sello">CASO ACEPTADO</p>
                <h3 class="tarjeta-servicio-titulo">Defensa Criminal</h3>
                <p class="tarjeta-servicio-texto">"Somos David y Jorge Goodman. ¿Problemas con la ley? Nosotros los solucionamos... legalmente, claro."</p>
                <p class="tarjeta-servicio-firma">— D&J Legal Associates · Abogados de guardia 24h</p>
            </div>`;
        });
    }

    if (btnJuicios) {
        btnJuicios.addEventListener("click", () => {
            resultadoServicio.innerHTML = `
            <div class="tarjeta-servicio">
                <p class="tarjeta-servicio-sello">REPRESENTACIÓN ACTIVA</p>
                <h3 class="tarjeta-servicio-titulo">Representación en Juicios</h3>
                <p class="tarjeta-servicio-texto">"Mike Ehrmantraut ya está vigilando al fiscal. Relájate, esto está controlado... probablemente."</p>
                <p class="tarjeta-servicio-firma">— D&J Legal Associates · Albuquerque & Málaga</p>
            </div>`;
        });
    }

    if (btnAsesoria) {
        btnAsesoria.addEventListener("click", () => {
            resultadoServicio.innerHTML = `
            <div class="tarjeta-servicio">
                <p class="tarjeta-servicio-sello">CONSULTA INICIADA</p>
                <h3 class="tarjeta-servicio-titulo">Asesoramiento Legal</h3>
                <p class="tarjeta-servicio-texto">"Kim Wexler te atenderá en breve. Mientras tanto, no hables con nadie, no firmes nada y no llames a tu hermano Chuck."</p>
                <p class="tarjeta-servicio-firma">— D&J Legal Associates · Discreción garantizada</p>
            </div>`;
        });
    }

    if (btnCoartada) {
        btnCoartada.addEventListener("click", () => {
            const numeroAleatorio = Math.floor(Math.random() * listaCoartadas.length);
            const coartadaElegida = listaCoartadas[numeroAleatorio];
            resultadoCoartada.innerHTML = `
            <div class="tarjeta-personaje">
                <h3 style="color: #000">Tu coartada oficial:</h3>
                <p style="font-weight:bold; font-size:1.5rem; color:#ff4500;">"${coartadaElegida}"</p>
                <p style="font-size: 0.9rem;">D&J no se hace responsable si el juez no se lo cree.</p>
            </div>`;
        });
    }

    if (btnMedir) {
        btnMedir.addEventListener("click", () => {
            const nombre = inputNombre.value;
            const excusa = selectExcusa.value;

            if (nombre === "" || excusa === "") {
                resultadoMedidor.innerHTML = "<p style='color:#ff4500; font-weight:bold; margin-top:15px;'>¡Error! Rellena todos los campos, no te escondas.</p>";
                return;
            }

            let comentario = "";
            if (excusa === "noSabe") comentario = "Eso lo dice todo el mundo, " + nombre + ".";
            else if (excusa === "amigo") comentario = "Ese amigo también va a necesitar abogado, " + nombre + ".";
            else if (excusa === "estres") comentario = "El estrés no te saca de la cárcel, " + nombre + ".";
            else if (excusa === "hambre") comentario = "Deberías haber ido al Mercadona, " + nombre + ".";

            const indiceAleatorio = Math.floor(Math.random() * sentencias.length);
            const sentenciaElegida = sentencias[indiceAleatorio];

            resultadoMedidor.innerHTML = `
            <div class="tarjeta-personaje">
                <h3>Veredicto Oficial para ${nombre}</h3>
                <p style="font-size:1.4rem; color:#ff4500; font-weight:bold;">"${sentenciaElegida}"</p>
                <p>${comentario}</p>
                <p style="font-size:0.85rem;">D&J no se hace responsable de la precisión de este veredicto.</p>
            </div>`;
        });
    }

    if (formularioClientes) {

        function cargarAgentes() {
            fetch(ENDPOINT_OBTENER_AGENTES, requestoptions)
                .then(response => response.json())
                .then(agentes => {
                    agentes.forEach(agente => {
                        const option = document.createElement("option");
                        option.value = agente.id_agente;
                        option.textContent = agente.nombre;
                        campoAgente.appendChild(option);
                    });
                })
                .catch(error => console.error("Error al cargar agentes:", error));
        }
        cargarAgentes();

        function mostrarClientes(clientes) {
            mensajesalida.innerHTML = "";
            if (clientes.length === 0) {
                mensajesalida.innerHTML = "<p>No hay clientes en el archivo.</p>";
            } else {
                mensajesalida.classList.add("caja-clientes");

                clientes.forEach(cliente => {
                    let aliasMostrado = cliente.alias;
                    if (aliasMostrado === null || aliasMostrado === "") {
                        aliasMostrado = "Ciudadano ejemplar (sin alias)";
                    }

                    let delitoMostrado = cliente.delito;
                    if (delitoMostrado === null || delitoMostrado === "") {
                        delitoMostrado = "Un malentendido sin registrar";
                    } else if (delitoMostrado === "evasion") {
                        delitoMostrado = "Evasión de impuestos";
                    } else if (delitoMostrado === "distribucion") {
                        delitoMostrado = 'Distribución de "química"';
                    } else if (delitoMostrado === "robo") {
                        delitoMostrado = "Robo de identidad";
                    }


                    let div = document.createElement("div");
                    div.classList.add("grid-item");
                    div.style.cursor = "pointer";


                    let agenteMostrado = cliente.nombre_agente ? cliente.nombre_agente : "Sin asignar";

                    div.innerHTML = `<span class="sello-confidencial">CONFIDENCIAL</span><br>
                                     <strong>Nombre:</strong> ${cliente.nombre}<br>
                                     <strong>Alias:</strong> ${aliasMostrado}<br>
                                     <strong>Problema legal:</strong> ${delitoMostrado}<br>
                                     <strong>Agente DEA:</strong> <span style="color:#ffcc00">${agenteMostrado}</span><br>`;


                    div.addEventListener("click", () => {
                        inputId.value = cliente.id_cliente;
                        campoNombre.value = cliente.nombre;

                        if (cliente.alias === null) {
                            campoAlias.value = "";
                        } else {
                            campoAlias.value = cliente.alias;
                        }

                        let delitoMenu = cliente.delito;
                        if (delitoMenu === "evasion") delitoMenu = "Evasión de impuestos";
                        else if (delitoMenu === "distribucion") delitoMenu = 'Distribución de "química"';
                        else if (delitoMenu === "robo") delitoMenu = "Robo de identidad";
                        else if (delitoMenu === null || delitoMenu === "") delitoMenu = "Evasión de impuestos";

                        campoDelito.value = delitoMenu;
                        campoAgente.value = cliente.id_agente || "";
                    });


                    mensajesalida.appendChild(div);
                });
            }
        }

        function consultarClientes() {
            requestoptions.method = "GET";
            delete requestoptions.body;

            fetch(ENDPOINT_OBTENER_CLIENTES, requestoptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error al obtener los clientes");
                    }
                    return response.json();
                })
                .then(data => {
                    mostrarClientes(data);
                })
                .catch(error => {
                    mensajesalida.innerHTML = `<p style="color:red;">${error.name}: ${error.message}</p>`;
                });
        }

        function insertarCliente(cliente) {
            requestoptions.method = "POST";
            requestoptions.body = JSON.stringify(cliente);

            fetch(ENDPOINT_GESTION_CLIENTE, requestoptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error al guardar cliente");
                    }
                    return response.json();
                })
                .then(data => {
                    mensajesalida.innerHTML = `<p style="color: green; font-weight: bold;">¡Cliente guardado!</p>`;
                    setTimeout(() => { consultarClientes(); }, 2000);
                })
                .catch(error => {
                    mensajesalida.innerHTML = `<p style="color:red;">${error.name}: ${error.message}</p>`;
                });
        }

        function eliminarCliente(cliente) {
            requestoptions.method = "DELETE";
            delete requestoptions.body;

            fetch(ENDPOINT_GESTION_CLIENTE + `/${cliente.id_cliente}`, requestoptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error al borrar");
                    }
                    return response.json();
                })
                .then(data => {
                    inputId.value = "";
                    campoNombre.value = "";
                    campoAlias.value = "";
                    campoAgente.value = "";
                    mensajesalida.innerHTML = `<p style="color: green; font-weight: bold;">Rastro eliminado.</p>`;
                    setTimeout(() => { consultarClientes(); }, 2000);
                })
                .catch(error => {
                    mensajesalida.innerHTML = `<p style="color:red;">${error.name}: ${error.message}</p>`;
                });
        }

        function actualizarCliente(cliente) {
            requestoptions.method = "PUT";
            requestoptions.body = JSON.stringify(cliente);

            fetch(ENDPOINT_GESTION_CLIENTE + `/${cliente.id_cliente}`, requestoptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error al modificar papeles");
                    }
                    return response.json();
                })
                .then(data => {
                    mensajesalida.innerHTML = `<p style="color: green; font-weight: bold;">Expediente modificado.</p>`;
                    setTimeout(() => { consultarClientes(); }, 2000);
                })
                .catch(error => {
                    mensajesalida.innerHTML = `<p style="color:red;">${error.name}: ${error.message}</p>`;
                });
        }

        botoninsertarcliente.addEventListener("click", () => {
            if (campoNombre.value === "") {
                mensajesalida.innerHTML = "<p style='color:red; font-weight:bold;'>Falta el nombre del cliente.</p>";
                setTimeout(() => { consultarClientes(); }, 2000);
                return;
            }

            const cliente_nuevo = {
                nombre: campoNombre.value,
                alias: campoAlias.value,
                delito: campoDelito.value,
                id_agente: campoAgente.value
            };

            insertarCliente(cliente_nuevo);
        });

        botoneliminarcliente.addEventListener("click", () => {
            if (inputId.value === "") {
                mensajesalida.innerHTML = "<p style='color:red; font-weight:bold;'>Haz clic en un cliente de la lista para borrarlo.</p>";
                setTimeout(() => { consultarClientes(); }, 2000);
                return;
            }

            const cliente_a_borrar = {
                id_cliente: inputId.value
            };

            eliminarCliente(cliente_a_borrar);
        });

        botonactualizarcliente.addEventListener("click", () => {
            if (inputId.value === "") {
                mensajesalida.innerHTML = "<p style='color:red; font-weight:bold;'>Haz clic en un cliente de la lista para modificarlo.</p>";
                setTimeout(() => { consultarClientes(); }, 2000);
                return;
            }

            const cliente_modificado = {
                id_cliente: inputId.value,
                nombre: campoNombre.value,
                alias: campoAlias.value,
                delito: campoDelito.value,
                id_agente: campoAgente.value
            };

            actualizarCliente(cliente_modificado);
        });

        consultarClientes();
    }
});