const btnDepositar = document.querySelector("#btnDepositar")
const btnRetirar = document.querySelector("#btnRetirar")
const btnPagar = document.querySelector("#btnPagar")
const btnEstado = document.querySelector("#btnEstado")

const modalRetirar = document.querySelector(".modal-retirar");
const modalDepositar = document.querySelector(".modal-depositar");
const modalPagar = document.querySelector(".modal-pagar");
const modalEstadoCuenta = document.querySelector(".modal-estado-cuenta");

btnDepositar.addEventListener('click',()=>{
    modalDepositar.classList.toggle('show')
    modalRetirar.style
    modalPagar.style
    modalEstadoCuenta.style
})


btnRetirar.addEventListener('click',()=>{
    modalRetirar.classList.toggle('show')
})


btnPagar.addEventListener('click',()=>{
    modalPagar.classList.toggle('show')
})


btnEstado.addEventListener('click',()=>{
    modalEstadoCuenta.classList.toggle('show')
})