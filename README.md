

# Intalación

### Clonando el proyecto desde git

* Abrir la terminal o cmd y clonar el proyecto con el comando siguiente
  * git clone https://github.com/EedgarHM/cash-machine.git
* Una vez clonado el repositorio ingresar a la carpeta creada **cash-machine**

### Modulos de Node

Abrir el proyecto con la terminal o consola de comandos, posicionarse en la carpeta del proyecto y ejecutar el comando **npm install** 

### MySQL

Para que este proyecto funcione se necesita instalar el gestor de MySQL el link de descarga lo dejo a continuación, esta versión es la que se utilizó para desarrollar el proyecto. 

https://dev.mysql.com/downloads/windows/installer/5.7.html

##### Configurando MySQL

Para permitir que el ORM cree las tablas automaticamente ejecutar los siguientes comandos en la terminal, esto para configurar el MySQL.



Ejecutar la linea **mysql -u root -p**  (IMPORTANTE PONER LA CONTRASEÑA Y USUARIO QUE CONFIGURÓ CUANDO INSTALÓ MYSQL)

Ejecutar las siguientes lineas posterior a iniciar sesion con mysql

**ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';**

**FLUSH PRIVILEGES;**

* La base de datos que se debe crear tiene el nombre de **cashmachine** basta con crear la base de datos nada más, el ORM que se utilizó creará la tabla correspondiente y todo deberá funcionar adecuadamente.

Una vez se haya clonado el repositorio, instalado los modulos necesarios de node, instalado la version de MySQL y creado la respectiva base de datos. El siguiente comando que se deberá agregar es:

* npm test
* Si el comando anterior no funciona intentar con npm start

Una vez ejecutado el comando, puede acceder a la la aplicación desde su navegador web haciendo uso del siguiente link: http://localhost:3000/transactions
