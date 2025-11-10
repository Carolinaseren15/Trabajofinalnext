# Trabajofinalnext
Sistema REST para una Clínica Veterinaria Tu tarea es desarrollar un servidor con servicios RESTful para una clínica veterinaria. El sistema debe permitir gestionar los pacientes (mascotas), sus propietarios, los turnos, y los tratamientos realizados. 

Clínica Veterinaria

Mascotas
GET	/mascotas	(Lista de Macotas)
GET	/mascotas/:id	(Mascota por su ID.)
POST	/mascotas	(Nueva mascota)
PUT	/mascotas/:id	(Modificar los datos de una mascota)
DELETE	/mascotas/:id	(Elimina una mascota)

Dueños
GET	/duenos	(Lista de dueños.)
GET	/duenos/:id ( Datos del dueño Id)
POST	/duenos	(Nuevo dueño)
PUT	/duenos/:id	 (Actualizar datos)
DELETE	/duenos/:id	(Elimina un registro de dueño.)

Turnos
GET	/turnos	(Lista de turnos)
GET	/turnos/:id	(Detalle de un turno.)
POST	/turnos	(Nuevo turno)
PUT	/turnos/:id	(Modificar turno)
DELETE	/turnos/:id	(Cancela o elimina un turno.)

Tratamientos
GET	/tratamientos	(Lista de los tratamientos)
GET	/tratamientos/:id	(Detalles de un tratamiento)
POST	/tratamientos	(Nuevo tratamiento)
PUT	/tratamientos/:id	(Edita un tratamiento)
DELETE	/tratamientos/:id	(Elimina un tratamiento)


