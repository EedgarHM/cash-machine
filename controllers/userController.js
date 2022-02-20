const { User } = require("../models/users/User");
const {
  generateCreditCard,
  generateDebitCard,
  cvvGenerator,
  idGenerator,
} = require("../helpers/generator");

// Rendera layouts
const usuariosGet = (req, res) => {
  res.render("home");
};

const signUp = (req, res) => {
  res.render("signup");
};

const getTransact = (req, res) => {
  res.render("transactions");
};

const cards = (req, res) => {
  console.log(req.params);
  res.render("cards");
};

//  ------------------------ Funciones de transacciones --------------------------
const newRecord = async (req, res) => {
  // Validar Campos del formulario
  const { name, lastName } = req.body;

  const errors = [];

  // Puesto que son dos campos, no se hara uso de express-validator
  if (!name.trim() || !lastName.trim()) {
    errors.push({ msg: "Ambos campos son requeridos" });
    return res.json({msg:"Todos los campos son obligatorios"})
  } else {
    // Creacion del modelo
    const response = await User.create({
      id: idGenerator(),
      name,
      last_name: lastName,
      number_credit: generateCreditCard(),
      number_debit: generateDebitCard(),
      debit_cvv: cvvGenerator(),
      credit_cvv: cvvGenerator(),
    });

    // Enviamos los datos a la interfaz del usuario para que guarde sus datos
    if (response) {
      const { id } = response;
      const user = await User.findAll({ where: { id: id } });
      res.render("cards", {
        user,
      });
    }
  }
};

// Funcion para retiros de dinero de la tarjeta de credito y de debito
const getWithdrawals = async (req, res) => {
  const { card, cvv } = req.body;

  const mount = Number(req.body.mount);

  // Se evalua que la cantidad a retirar sea mayor a cero
  if (mount < 0) {
    return res.json({
      msg: "Cantidad de retiro no valida, debe ser superior a 0",
    });
  }
  // Comprobar que tipo de tarjeta es
  let cardType;

  // Asignacion del tipo de tarjeta, esto se podria quitar, realmente no es tan necesario
  if (card.toString().startsWith("8888")) {
    cardType = "credit";
  } else {
    if (card.toString().startsWith("2222")) {
      cardType = "debit";
    } else {
      return res.json({ msg: "No se reconoce el tipo de tarjeta" });
    }
  }

  // Segun el tipo de tarjeta que sea se realiza la operacion, Tarjeta de credito se cobra el 5% del retiro, Tarjeta de debito: No se cobra algo
  switch (cardType) {
    case "credit":
      // Busqueda por la tarjeta de credito
      const result = await User.findOne({
        where: { number_credit: card, credit_cvv: cvv },
      });

      // Si se encuentra realizamos la operacion siempre que tenga el saldo disponible
      if (result) {
        // Comprobamos que lo que se quiere retirar sea menor o igual a lo que se tiene en la tarjeta
        const { credit_balance } = result;

        // Descontamos el 5% del retiro por comision
        const withdraw = mount * 0.05;
        console.log(withdraw);
        if (mount <= credit_balance) {
          //Obtenemos el nuevo saldo una vez descontada la cantidad y la comision
          const newBalance = credit_balance - (mount + withdraw);

          // Se actualiza el saldo
          const updateBalance = await User.update(
            { credit_balance: newBalance },
            { where: { number_credit: card, credit_cvv: cvv } }
          );

          // Si se hace la actualizacion correctamente, enviamos un informe despues de 1s
          if (updateBalance) {
            setTimeout(() => {
              return res.json({
                msg: "Operacion realizada con exito",
                info: {
                  saldo_disponible: newBalance,
                  saldo_anterior: credit_balance,
                  retiro: mount,
                  tarifa_por_retiro: withdraw,
                },
              });
            }, 100);
          }

          // En caso de no contar con el saldo suficiente se envia un mensaje
        } else {
          return res.json({
            msg: "No cuenta con saldo suficiente para realizar la transaccion",
            saldo_disponible: credit_balance,
          });
        }
        // En caso que la tarjeta no se encuentre registrada o el cvv sea incorrecto se manda un mensaje al usuario
      } else {
        return res.status(404).json({
          msg: "Esta tarjeta no se encuentra registrada, o bien el Cvv es incorrecto",
        });
      }
      break;

    case "debit":
      try {
          // Se obtiene el usuario con la tarjeta de debito solicitada
      const resultDebit = await User.findOne({
        where: { number_debit: card, debit_cvv: cvv },
      });

      // Si la tarjeta se encuentra, se procede a realizar la actualizacion del saldo
      if (resultDebit) {
        const { debit_balance } = resultDebit;
        if (Number(mount) <= debit_balance) {
          // Se calcula el nuevo saldo realizando la resta
          const newBalance = debit_balance - mount;

          // Se actualiza el nuevo saldo del usuario en su tarjeta de credito
          const updateBalance = await User.update(
            { debit_balance: newBalance },
            { where: { number_debit: card, debit_cvv: cvv } }
          );

          // Realizamos la comprobacion para ver si se actualizo el usuario y enviamos la respuesta despues de 1s
          if (updateBalance) {
            setTimeout(() => {
              return res.json({
                msg: "Operacion realizada con exito",
                info: {
                  saldo_disponible: newBalance,
                  saldo_anterior: debit_balance,
                  retiro: mount,
                },
              });
            }, 100);
          }
        } else {
            // Si no se cuanta con el saldo suficiente se envia un mensaje al usuario
          return res.json({
            msg: "No cuenta con Saldo suficiente",
            monto_retiro: mount,
            saldo_disponible: debit_balance,
          });
        }
      } else {
        return res.status(404).json({
          msg: "Esta tarjeta no se encuentra registrada, o bien el Cvv es incorrecto",
        });
      }
    
      } catch (error) {
          console.log(error)
      }
      break;
    default:
      break;
  }
};

// Funcion para realizar depositos de dinero
const depositMoney = async (req, res) => {
  const { card } = req.body;
  const mount = Number(req.body.mount);

  try {
      // Se comprueba que el deposito sea mayor a cero, de lo contrario mandamos un mensaje de error
  if (mount < 0) {
    return res.json({ msg: "Cantidad no valida, debe ser mayor a cero" });
  }
  // Buscamos la tarjeta de debito, ya que solo en esta se puede ir sumando el valor de ahorros
  const resultCard = await User.findOne({
    where: { number_debit: card },
  });

  if (resultCard) {
    // Destructuramos la propiedad a utilizar
    const { debit_balance } = resultCard;

    // Actualizamos el saldo
    const newBalance = debit_balance + mount;
    const updateBalance = await User.update(
      { debit_balance: newBalance },
      { where: { number_debit: card } }
    );

    // Se realiza la actualizacion del nuevo saldo
    if (updateBalance) {
      return res.json({
        msg: "Se realizo el deposito correctamente",
        saldo_anterior: debit_balance,
        saldo_actual: newBalance,
        abono: mount,
      });
    }
  } else {
    // Si la tarjeta no es de debito o no se encuentra registrada se manda mensaje de error
    return res.json({
      msg: "Esta tarjeta no se encuentra en la base de datos o no es una tarjeta de debito",
      card: card,
    });
  }
  } catch (error) {
      console.log(error)
  }
};


// Funcion para realizar pagos con la tarjeta de credito
const pay = async (req, res) => {
  const { card, cvv } = req.body;
  const mount = Number(req.body.mount);

  try {

    // La cantidad del pago debe ser mayor a cero de lo contrario se envia un mensaje de error
    if (mount < 0) {
        return res.json({ msg: "El pago no puede ser menor a 0" });
      }
      // Buscamos la tarjeta de credito, esta opcion solo debe estar disponible para pagar con tarjeta de credito
      const resultCard = await User.findOne({
        where: { number_credit: card, credit_cvv: cvv },
      });
    
      // Si la tarjeta se encontro se realiza el ajuste al saldo
      if (resultCard) {
        const { credit_balance } = resultCard;
    
        if (mount > credit_balance) {
          return res.json({
            msg: "No puede realizar un pago si su saldo es menor",
            monto_pagar: mount,
            saldo_disponible: credit_balance,
          });
        }
        // Actualizamos el credito, como se realizo una compra o un pago se descontara del credito
        const newBalance = credit_balance - mount;
    
        console.log(newBalance);
        const updateBalance = await User.update(
          { credit_balance: newBalance },
          { where: { number_credit: card, credit_cvv: cvv } }
        );
    
        // Se manda mensaje al usuario para informarle de su nuevo saldo
        if (updateBalance) {
          return res.json({
            msg: "Se realizo el pago",
            saldo_actual: newBalance,
            saldo_anterior: credit_balance,
            costo_pago: mount,
          });
        }
      } else {
          // En caso de que no sea una tarjeta de credito o no exista en la base de datos mandamos mensaje de error
        return res.json({
          msg: "Error, Asegurese de usar una tarjeta de credito existente y haber colocado su CVV de forma correcta",
          card: card,
        });
      }
  } catch (error) {
      console.log(error)
  }
};
const accountStatus = async (req, res) => {};

module.exports = {
  usuariosGet,
  getTransact,
  getWithdrawals,
  signUp,
  newRecord,
  cards,
  depositMoney,
  pay,
  accountStatus,
};
