# Monitoreo_Sensores_Tcp_Udp_Serial
Este es un proyecto de WebSocket creado en NodeJs, creando un servidor con Express y Socket.io,
el cual recibe datos desde 3 sensores creados con NodeJs (TCP), Python (UDP) y Arduino (Serial)


### Para iniciar el proyecto debemos instalar los modulos de node, para esto abrir una terminal y escribir lo siguiente:

<code>npm install</code>

#### Una vez teniendo los modulos listos debemos subir el programa al arduino, en caso de no usar el arduino, en el archivo <code>servidor_websocket.js</code>se debe comentar o eliminar las conexiones del protocolo Serial, de igual esta forma no funcionaría el gráfico del html (si no usaras arduino se recomienda eliminar ese gráfico del html y js).


### Para poder iniciar el servidor primero debemos activar el Sensor UDP con el siguiente comando:

<code>py sensorudp.py</code>

### Se nos abrirá una ventana la cual solo debemos presionar Activar y el sensor enviará datos

### Lo siguiente es iniciar el Sensor TCP con el comando:

<code>node sensor_tcp.js</code>

### Al tener los dos sensores funcionando debemos ejecutar el <code>servidor_websocket.js</code> con el siguiente comando:

<code>node servidor_websocket.js</code>


## No olvidar cambiar la ip de todos los sensores y servidor, para ejecutarlo en localhost
