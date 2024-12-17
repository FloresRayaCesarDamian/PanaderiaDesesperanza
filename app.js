    const express = require('express');
    const mysql = require('mysql2');
    const multer = require('multer');
    const path = require('path');
    const session = require('express-session');

    const app = express();
    
    // Configuración de middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public/html'));
    
    // Configuración de sesiones
    app.use(session({
        secret: 'secreto',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
    }));

    // Configuración de conexión a la base de datos
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'n0m3l0',
        database: 'La_Desesperanza'
    });

    // Conectar a la base de datos
    db.connect(err => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
            return;
        }
        console.log('Conectado a la base de datos MySQL');
    });

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });
    
    // Ruta para servir imágenes estáticas
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Filtro para asegurar que solo se acepten imágenes de tipo JPEG, JPG, PNG o GIF (si se desea mantener)
    const upload = multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
            const fileTypes = /jpeg|jpg|png|gif/;
            const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = fileTypes.test(file.mimetype);

            if (extname && mimetype) {
                cb(null, true);
            } else {
                cb(new Error('Solo se permiten imágenes en formato JPEG, JPG, PNG o GIF'));
            }
        }
    });

    app.get('/login', (req, res) => {
        res.sendFile(__dirname + '/public/html/iniciosesion.html'); 
    });

    
    app.get('/check-session', (req, res) => {
        if (req.session.user) {
            res.redirect('/perfil.html');
        } else {
            res.redirect('/iniciosesion.html');
        }
    });
    app.get('/check-productos', (req, res) => {
        if (!req.session.user) {
            req.session.redirectTo = '/check-productos';
            return res.redirect('/iniciosesion.html');
        }
    
        const userId = req.session.userId;
        const query = 'SELECT id_usuario FROM usuario WHERE rol = ?';
    
        db.query(query, ["admin"], (err, results) => {
            if (err) {
                console.error('Error al consultar los admins:', err);
                return res.status(500).send('Error en el servidor');
            }
    
            const ids = results.map(admin => admin.id_usuario);
            if (ids.includes(userId)) {
                return res.redirect('productosA.html');
            }
            return res.status(204).end();
        });
    });
    
    app.get('/check-productosA', (req, res) => {
        if (!req.session.user) {
            req.session.redirectTo = '/check-productosA';
            return res.redirect('/iniciosesion.html');
        }
    
        const userId = req.session.userId;
        const query = 'SELECT id_usuario FROM usuario WHERE rol = ?';
    
        db.query(query, ["admin"], (err, results) => {
            if (err) {
                console.error('Error al consultar los admins:', err);
                return res.status(500).send('Error en el servidor');
            }
    
            const ids = results.map(admin => admin.id_usuario);
            if (ids.includes(userId)) {
                return res.status(204).end();
            }
            return res.redirect('productos.html');
        });
    });
    
    app.get('/check-perfil', (req, res) => {
        if (!req.session.user) {
            req.session.redirectTo = '/check-perfil';
            return res.redirect('/iniciosesion.html');
        }
    
        const userId = req.session.userId;
        const query = 'SELECT id_usuario FROM usuario WHERE rol = ?';
    
        db.query(query, ["admin"], (err, results) => {
            if (err) {
                console.error('Error al consultar los admins:', err);
                return res.status(500).send('Error en el servidor');
            }
    
            const ids = results.map(admin => admin.id_usuario);
            if (ids.includes(userId)) {
                return res.redirect('/perfilA.html');
            }
            return res.status(204).end();
        });
    });
    
    app.get('/check-perfilA', (req, res) => {
        if (!req.session.user) {
            req.session.redirectTo = '/check-perfilA';
            return res.redirect('/iniciosesion.html');
        }
    
        const userId = req.session.userId;
        const query = 'SELECT id_usuario FROM usuario WHERE rol = ?';
    
        db.query(query, ["admin"], (err, results) => {
            if (err) {
                console.error('Error al consultar los admins:', err);
                return res.status(500).send('Error en el servidor');
            }
    
            const ids = results.map(admin => admin.id_usuario);
            for (let i = 0; i < ids.length; i++) {
                if (userId === ids[i]) {
                    return res.status(204).end();
                }
            }
            return res.redirect('/perfil.html');
        });
    });

    app.get('/check-carrito', (req, res) => {
        if (!req.session.user) {
            req.session.redirectTo = '/check-carrito';
            return res.redirect('/iniciosesion.html');
        }
    
        const userId = req.session.userId;
        const query = 'SELECT id_usuario FROM usuario WHERE rol = ?';
    
        db.query(query, ["admin"], (err, results) => {
            if (err) {
                console.error('Error al consultar los admins:', err);
                return res.status(500).send('Error en el servidor');
            }
    
            const ids = results.map(admin => admin.id_usuario);
            if (ids.includes(userId)) {
                return res.redirect('/index.html');
            }
            return res.status(204).end();
        });
    });
    
    app.get('/check-clientes', (req, res) => {
        if (!req.session.user) {
            req.session.redirectTo = '/check-clientes';
            return res.redirect('/iniciosesion.html');
        }
    
        const userId = req.session.userId;
        const query = 'SELECT id_usuario FROM usuario WHERE rol = ?';
    
        db.query(query, ["admin"], (err, results) => {
            if (err) {
                console.error('Error al consultar los admins:', err);
                return res.status(500).send('Error en el servidor');
            }
    
            const ids = results.map(admin => admin.id_usuario);
            for (let i = 0; i < ids.length; i++) {
                if (userId === ids[i]) {
                    return res.redirect('/clientesA.html');
                }
            }
            return res.status(204).end();
        });
    });
    
    app.get('/check-clientesA', (req, res) => {
        if (!req.session.user) {
            req.session.redirectTo = '/check-clientesA';
            return res.redirect('/iniciosesion.html');
        }
    
        const userId = req.session.userId;
        const query = 'SELECT id_usuario FROM usuario WHERE rol = ?';
    
        db.query(query, ["admin"], (err, results) => {
            if (err) {
                console.error('Error al consultar los admins:', err);
                return res.status(500).send('Error en el servidor');
            }
    
            const ids = results.map(admin => admin.id_usuario);
            for (let i = 0; i < ids.length; i++) {
                if (userId === ids[i]) {
                    return res.status(204).end();
                }
            }
            return res.redirect('/clientes.html');
        });
    });
    
    app.get('/check-pedidos', (req, res) => {
        if (!req.session.user) {
            req.session.redirectTo = '/check-pedidos';
            return res.redirect('/iniciosesion.html');
        }
    
        const userId = req.session.userId;
        const query = 'SELECT id_usuario FROM usuario WHERE rol = ?';
    
        db.query(query, ["admin"], (err, results) => {
            if (err) {
                console.error('Error al consultar los admins:', err);
                return res.status(500).send('Error en el servidor');
            }
    
            const ids = results.map(admin => admin.id_usuario);
            for (let i = 0; i < ids.length; i++) {
                if (userId === ids[i]) {
                    return res.redirect('/pedidosA.html');
                }
            }
            return res.status(204).end();
        });
    });
    
    app.get('/check-pedidosA', (req, res) => {
        if (!req.session.user) {
            req.session.redirectTo = '/check-pedidosA';
            return res.redirect('/iniciosesion.html');
        }
    
        const userId = req.session.userId;
        const query = 'SELECT id_usuario FROM usuario WHERE rol = ?';
    
        db.query(query, ["admin"], (err, results) => {
            if (err) {
                console.error('Error al consultar los admins:', err);
                return res.status(500).send('Error en el servidor');
            }
    
            const ids = results.map(admin => admin.id_usuario);
            for (let i = 0; i < ids.length; i++) {
                if (userId === ids[i]) {
                    return res.status(204).end();
                }
            }
            return res.redirect('/pedidos.html');
        });
    });
    
    //Registrarse
    app.post('/registrar', async (req, res) => {
        const { nombre, correo, telefono, password, Cpassword } = req.body;
    
        if (!nombre || !password || !telefono || !Cpassword || !correo) {
            return res.status(400).send('Todos los campos son obligatorios.');
        }
    
        const escapeInput = (input) => {
            return input
                .replace(/[<>\/\\'"%;]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        };
    
        if (/\<|\>|'|"|%|;/g.test(nombre) || /\<|\>|'|"|%|;/g.test(correo) || /\<|\>|'|"|%|;/g.test(telefono) || /\<|\>|'|"|%|;/g.test(password)) {
            return res.status(400).send('No se permiten inyecciones HTML, SQL o cualquier otro tipo de inyección.');
        }
    
        const sanitizedNombre = escapeInput(nombre);
        const sanitizedCorreo = escapeInput(correo);
        const sanitizedTelefono = escapeInput(telefono);
        const sanitizedPassword = escapeInput(password);
    
        const trimNombre = sanitizedNombre.trim();
        const trimCorreo = sanitizedCorreo.trim();
        const trimTelefono = sanitizedTelefono.trim();
        const trimPassword = sanitizedPassword.trim();
    
        const regexTelefono = /^[0-9]{10}$/;
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexNombre = /^[a-zA-Z\s]{3,}$/;
        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    
        if (!regexNombre.test(trimNombre)) {
            return res.status(400).send('El nombre debe tener al menos 3 caracteres y solo contener letras.');
        }
        if (trimNombre.length > 50) {
            return res.status(400).send('El nombre no puede tener más de 50 caracteres.');
        }
        if (!regexEmail.test(trimCorreo)) {
            return res.status(400).send('El correo electrónico no tiene un formato válido.');
        }
        if (trimCorreo.length > 100) {
            return res.status(400).send('El correo no puede tener más de 100 caracteres.');
        }
        if (!regexTelefono.test(trimTelefono)) {
            return res.status(400).send('El número de teléfono debe ser válido (10 dígitos).');
        }
        if (trimTelefono.length > 10) {
            return res.status(400).send('El teléfono no puede tener más de 10 dígitos.');
        }
        if (!regexPassword.test(trimPassword)) {
            return res.status(400).send('La contraseña debe incluir al menos una letra mayúscula, una minúscula, un número y un carácter especial , además tener un minimo de 8 caracteres.');
        }
        if (trimPassword !== Cpassword) {
            return res.status(400).send('Las contraseñas no coinciden.');
        }
    
        try {
            const checkUserQuery = 'SELECT * FROM usuario WHERE nombre = ? OR correo = ?';
            const [results] = await db.promise().query(checkUserQuery, [trimNombre, trimCorreo]);
    
            if (results.length > 0) {
                return res.status(400).send('El nombre de usuario o correo ya está registrado.');
            }
    
            const insertUserQuery = 'INSERT INTO usuario (nombre, correo, contrasena) VALUES (?, ?, ?)';
            await db.promise().query(insertUserQuery, [trimNombre, trimCorreo, trimPassword]);
    
            const [newUser] = await db.promise().query('SELECT id_usuario FROM usuario WHERE nombre = ?', [trimNombre]);
            const usuarioIDS = newUser[0].id_usuario;
    
            const insertUserQuery2 = 'INSERT INTO cliente (telefono, id_usuario) VALUES (?, ?)';
            await db.promise().query(insertUserQuery2, [trimTelefono, usuarioIDS]);
    
            res.redirect('/login');
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            return res.status(500).send('Error al registrar el usuario.');
        }
    });    
    

    // Inicio de sesión
    app.post('/login', (req, res) => {
        const { nombre, password } = req.body;

        if (!nombre || !password) {
            return res.status(400).send('Datos incompletos');
        }

        const query = 'SELECT * FROM usuario WHERE nombre = ? AND contrasena = ?';
        db.query(query, [nombre, password], async (err, results) => {
            if (err) {
                console.error('Error al consultar el usuario:', err);
                return res.status(500).send('Error en el servidor');
            }
    
            if (results.length === 0) {
                return res.status(401).send('El usuario no existe o los datos son incorrectos.');
            }
            
            if (results.length > 0) {
                const user = results[0];
                req.session.user = user;
                req.session.userId = user.id_usuario;
    
                req.session.save((err) => {
                    if (err) {
                        console.error('Error al guardar la sesión:', err);
                        return res.status(500).send('Error al iniciar sesión');
                    }
                    const redirectTo = req.session.redirectTo || '/';
                    delete req.session.redirectTo;
                    return res.redirect(redirectTo);
                });
            } else {
                return res.status(401).send('Credenciales incorrectas');
            }
        });
    });


//PRODUCTOS

    //CLIENTE
        //Solo se visualizan los productos
    //ADMIN

    //Ver productos
    app.get('/obtener-productos', (req, res) => {
        db.query('SELECT * FROM producto', (error, results) => {
            if (error) {
                console.error('Error al obtener productos:', error);
                return res.status(500).json({ error: 'Error al obtener productos' });
            }
            res.json(results);
        });
    });

    // Agregar Productos
    app.post('/agregarProducto', upload.single('imagen'), (req, res) => {
        const { nombre, precio, cantidad, categoria } = req.body;
        const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;
    
        if (!nombre || !precio || !cantidad || !categoria) {
            return res.status(400).send('Todos los campos son obligatorios.');
        }
    
        const escapeInput = (input) => {
            return input
                .replace(/[<>\/\\'"%;]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        };
    
        if (/[<>'"%;]/.test(nombre) || /[<>'"%;]/.test(precio) || /[<>'"%;]/.test(cantidad)) {
            return res.status(400).send('No se permiten inyecciones HTML, SQL o cualquier otro tipo de inyección.');
        }
    
        const sanitizedNombre = escapeInput(nombre);
        const sanitizedPrecio = escapeInput(precio);
        const sanitizedCantidad = escapeInput(cantidad);
    
        const trimNombre = sanitizedNombre.trim();
        const trimPrecio = sanitizedPrecio.trim();
        const trimCantidad = sanitizedCantidad.trim();
    
        const regexNombre = /^[a-zA-Z\s]{3,50}$/;
        const regexPrecio = /^[0-9]+(\.[0-9]{1,2})?$/;
    
        if (!regexNombre.test(trimNombre)) {
            return res.status(400).send('El nombre debe tener al menos 3 caracteres y solo contener letras y espacios.');
        }
        if (!regexPrecio.test(trimPrecio) || parseFloat(trimPrecio) <= 0 || parseFloat(trimPrecio) > 10000) {
            return res.status(400).send('El precio debe ser un número positivo con hasta dos decimales y no superar los 10000.');
        }
        if (!Number.isInteger(parseFloat(trimCantidad)) || parseInt(trimCantidad) < 0 || parseInt(trimCantidad) > 100) {
            return res.status(400).send('La cantidad debe ser un número entero entre 0 y 100.');
        }
        if (!["Temporada", "Salado", "Dulce", "Pastel"].includes(categoria)) {
            return res.status(400).send('Categoría inválida');
        }
    
        db.query(
            'INSERT INTO producto (nombre_producto, precio_producto, cantidad_producto, imagen_producto, categoria) VALUES (?, ?, ?, ?, ?)',
            [nombre, precio, cantidad, imagen_url, categoria],
            (err, respuesta) => {
                if (err) {
                    console.error("Error al insertar el producto:", err);
                    return res.status(500).send("Error al conectar");
                }
    
                res.send(`
                    <h2>Producto agregado correctamente<h2>
                `);
            }
        );
    });


    //Actualizar Productos
    app.post('/actualizarProducto', upload.single('imagen'), (req, res) => {
        const { nombre, precio, cantidad, categoria } = req.body;
        const id_producto = req.body.id;
        const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;
    
        if (precio && (isNaN(precio) || precio <= 0 || precio > 1000000)) {
            return res.status(400).send("Precio inválido");
        }
    
        if (cantidad && (isNaN(cantidad) || cantidad < 0)) {
            return res.status(400).send("Cantidad inválida");
        }
    
        let query = 'UPDATE Producto SET';
        const values = [];
    
        if (nombre) {
            query += ' nombre_producto = ?,';
            values.push(nombre);
        }
    
        if (precio) {
            query += ' precio_producto = ?,';
            values.push(precio);
        }
    
        if (cantidad) {
            query += ' cantidad_producto = ?,';
            values.push(cantidad);
        }
    
        if (imagen_url) {
            query += ' imagen_producto = ?,';
            values.push(imagen_url);
        }
    
        if (categoria) {
            query += ' categoria = ?,';
            values.push(categoria);
        }
    
        query = query.slice(0, -1);
        query += ' WHERE id_producto = ?';
        values.push(id_producto);
    
        db.query(query, values, (err, respuesta) => {
            if (err) {
                console.error("Error al actualizar el producto:", err);
                return res.status(500).send("Error al actualizar producto");
            }
    
            res.send(`
                <h2>Producto actualizado:</h2>
                <p>Nombre: ${nombre || 'sin cambios'}</p>
                <p>Precio: $${precio || 'sin cambios'}</p>
                <p>Existencias: ${cantidad || 'sin cambios'}</p>
                ${imagen_url ? `<img src="${imagen_url}" alt="${nombre}" style="max-width:200px;">` : ''}
                <br><a href="/productosA.html">Regresar</a>
            `);
        });
    });
    

    //Eliminar Productos
    app.post('/eliminarProducto', (req, res) => {
        const { id } = req.body;
        if (id <= 0 || isNaN(id)) {
            return res.status(400).send("Id Inválido");
        }
    
        db.query('DELETE FROM producto WHERE id_producto = ?', [id], (err, respuesta) => {
            if (err) {
                console.error("Error al eliminar el producto", err);
                return res.status("Error al eliminar producto");
            }
    
            res.send(
                `
                <h2>Producto eliminado</h2>
                <p>Producto con ID: ${id} ha sido eliminado.</p>
                <br><a href="/productosA.html">Regresar</a>
            `
            );
        });
    });

//PERFIL
    //CLIENTE y ADMIN

    //Eliminar cuenta
    app.post('/eliminarusuario', (req, res) => {
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ success: false, message: 'No está autenticado' });
        }

        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ success: false, message: 'Contraseña requerida' });
        }

        const userId = req.session.userId;

        const query = 'SELECT contrasena FROM usuario WHERE id_usuario = ?';
        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error al consultar la base de datos:', err);
                return res.status(500).json({ success: false, message: 'Error en el servidor' });
            }

            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }

            const storedPassword = results[0].contrasena;

            if (password !== storedPassword) {
                return res.status(400).json({ success: false, message: 'Contraseña incorrecta' });
            }

            const deleteQuery = 'DELETE FROM usuario WHERE id_usuario = ?';
            db.query(deleteQuery, [userId], (deleteErr) => {
                if (deleteErr) {
                    console.error('Error al eliminar el usuario:', deleteErr);
                    return res.status(500).json({ success: false, message: 'Error al eliminar el usuario' });
                }
                req.session.destroy((err) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
                    }
                    res.status(200).send(`
                        <h2>Usuario eliminado correctamente</h2>
                        <br><a href="/iniciosesion.html">Regresar</a>
                    `);
                });
            });
        });
    });

    //Cerrar sesion
    app.get('/logout', (req, res) => {
        if (!req.session || !req.session.userId) {
            return res.status(400).send('No hay sesión activa para cerrar');
        }
        req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar la sesión:', err);
            return res.status(500).json({ success: false, message: 'Hubo un problema al cerrar la sesión, inténtelo nuevamente' });
        }

        console.log('Sesión cerrada correctamente');

        res.status(200).send(`
            <html>
                <head>
                    <title>Sesión cerrada</title>
                </head>
                <body>
                    <h2>Sesión cerrada correctamente</h2>
                    <a href="/login">Ir al inicio de sesión</a>
                </body>
            </html>
        `);
        });
    });

    //Cambiar nombre 
    app.post('/ModificarName', (req, res) => {
        const { name, passwordName } = req.body;
        const userId = req.session.userId;

        if (!name || !passwordName) {
            return res.status(400).send('El nuevo nombre y la contraseña son obligatorios.');
        }

        const escapeInput = (input) => {
            return input
                .replace(/[<>\/\\'"%;]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        };

        if (/[<>\'"%;]/.test(name) || /[<>\'"%;]/.test(passwordName)) {
            return res.status(400).send('No se permiten inyecciones HTML, SQL o cualquier otro tipo de inyección.');
        }

        const sanitizedName = escapeInput(name);
        const sanitizedPassword = escapeInput(passwordName);

        const trimName = sanitizedName.trim();
        const trimPassword = sanitizedPassword.trim();

        const regexName = /^[a-zA-Z\s]{3,}$/;

        if (!regexName.test(trimName)) {
            return res.status(400).send('El nombre debe tener al menos 3 caracteres y solo contener letras.');
        }
        if (trimName.length > 50) {
            return res.status(400).send('El nombre no puede tener más de 50 caracteres.');
        }

        const querySelectPassword = 'SELECT contrasena FROM Usuario WHERE id_usuario = ?';
        db.query(querySelectPassword, [userId], (err, results) => {
            if (err) {
                console.error('Error al consultar la contraseña:', err);
                return res.status(500).send('Error interno del servidor.');
            }

            if (results.length === 0) {
                return res.status(404).send('Usuario no encontrado.');
            }

            const passwordDB = results[0].contrasena;

            if (passwordDB !== trimPassword) {
                return res.status(401).send('Contraseña incorrecta.');
            }

            const queryCheckName = 'SELECT id_usuario FROM Usuario WHERE nombre = ?';
            db.query(queryCheckName, [trimName], (err, results) => {
                if (err) {
                    console.error('Error al verificar el nombre:', err);
                    return res.status(500).send('Error interno del servidor.');
                }

                if (results.length > 0) {
                    return res.status(409).send('El nombre de usuario ya está en uso.');
                }

                const queryUpdateName = 'UPDATE Usuario SET nombre = ? WHERE id_usuario = ?';
                db.query(queryUpdateName, [trimName, userId], (err) => {
                    if (err) {
                        console.error('Error al actualizar el nombre de usuario:', err);
                        return res.status(500).send('Error interno del servidor al actualizar el nombre de usuario.');
                    }

                    return res.status(200).send(`
                        <h2>Nombre de usuario actualizado correctamente</h2>
                        <p>Nuevo nombre de usuario: ${trimName}</p>
                        <br><a href="/perfil.html">Regresar</a>
                    `);
                });
            });
        });
    });

    //Cambiar correo
    app.post('/ModificarCorreo', (req, res) => {
        const { email, passwordCorreo } = req.body;
        const userId = req.session.userId;

        if (!email || !passwordCorreo) {
            return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
        }

        const escapeInput = (input) => {
            return input
                .replace(/[<>\/\\'"%;]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        };

        if (/[<>\'"%;]/.test(email) || /[<>\'"%;]/.test(passwordCorreo)) {
            return res.status(400).send('No se permiten inyecciones HTML, SQL o cualquier otro tipo de inyección.');
        }

        const sanitizedEmail = escapeInput(email);
        const sanitizedPasswordCorreo = escapeInput(passwordCorreo);

        const trimCorreo = sanitizedEmail.trim();
        const trimPassword = sanitizedPasswordCorreo.trim();

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexEmail.test(trimCorreo)) {
            return res.status(400).send('El correo electrónico no tiene un formato válido.');
        }
        if (trimCorreo.length > 100) {
            return res.status(400).send('El correo no puede tener más de 100 caracteres.');
        }

        const querySelectPassword = 'SELECT contrasena FROM Usuario WHERE id_usuario = ?';
        db.query(querySelectPassword, [userId], (err, results) => {
            if (err) {
                console.error('Error al consultar la contraseña:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const passwordDB = results[0].contrasena;

            if (passwordDB !== trimPassword) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }

            const queryUpdateEmail = 'UPDATE Usuario SET correo = ? WHERE id_usuario = ?';
            db.query(queryUpdateEmail, [trimCorreo, userId], (err) => {
                if (err) {
                    console.error('Error al actualizar el correo:', err);
                    return res.status(500).json({ message: 'Error interno del servidor al actualizar el correo' });
                }

                return res.status(200).send(`
                    <h2>Correo actualizado correctamente</h2>
                    <p>Nuevo correo: ${trimCorreo || 'sin cambios'}</p>
                    <br><a href="/perfil.html">Regresar</a>
                `);
            });
        });
    });
    
    //Cambiar contraseña
    app.post('/ModificarContrasena', (req, res) => {
        const { newpassword, passwordContra } = req.body;
        const userId = req.session.userId;
    
        if (!newpassword || !passwordContra) {
            return res.status(400).json({ message: 'Contraseña actual y nueva contraseña son obligatorias' });
        }
    
        const escapeInput = (input) => {
            return input
                .replace(/[<>\/\\'"%;]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        };
    
        if (/[\<\>\'\"\%\;]/.test(newpassword) || /[\<\>\'\"\%\;]/.test(passwordContra)) {
            return res.status(400).send('No se permiten inyecciones HTML, SQL o cualquier otro tipo de inyección.');
        }
    
        const sanitizedNewPassword = escapeInput(newpassword);
        const sanitizedPasswordContra = escapeInput(passwordContra);

        const trimNewPassword = sanitizedNewPassword.trim();
        const trimPasswordContra = sanitizedPasswordContra.trim();

        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    
        if (!regexPassword.test(trimNewPassword)) {
            return res.status(400).send('La contraseña debe incluir al menos una letra mayúscula, una minúscula, un número y un carácter especial , además tener un minimo de 8 caracteres.');
        }
    
        if (trimNewPassword == trimPasswordContra) {
            return res.status(400).send('La contraseña nueva es igual a la actual, cambiala.');
        }
    
        const querySelectPassword = 'SELECT contrasena FROM Usuario WHERE id_usuario = ?';
        db.query(querySelectPassword, [userId], (err, results) => {
            if (err) {
                console.error('Error al consultar la contraseña:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
    
            if (results.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
    
            const passwordDB = results[0].contrasena;
    
            if (passwordDB !== trimPasswordContra) {
                return res.status(401).json({ message: 'Contraseña actual incorrecta' });
            }
    
            const queryUpdatePassword = 'UPDATE Usuario SET contrasena = ? WHERE id_usuario = ?';
            db.query(queryUpdatePassword, [trimNewPassword, userId], (err) => {
                if (err) {
                    console.error('Error al actualizar la contraseña:', err);
                    return res.status(500).json({ message: 'Error interno del servidor al actualizar la contraseña' });
                }
    
                return res.status(200).send(`
                    <h2>Contraseña actualizada correctamente</h2>
                    <br><a href="/perfil.html">Regresar</a>
                `);
            });
        });
    });
    

    //Cambiar teléfono
    app.post('/ModificarTelefono', (req, res) => {
        const { telefono, passwordTelefono } = req.body;
        const userId = req.session.userId;

        if (!telefono || !passwordTelefono) {
            return res.status(400).json({ message: 'El nuevo telefono y la contraseña son obligatorios' });
        }

        const escapeInput = (input) => {
            return input
                .replace(/[<>\/\\'"%;]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        };

        if (/[\<\>\'\"\%\;]/.test(telefono) || /[\<\>\'\"\%\;]/.test(passwordTelefono)) {
            return res.status(400).send('No se permiten inyecciones HTML, SQL o cualquier otro tipo de inyección.');
        }

        const sanitizedTelefono = escapeInput(telefono);
        const sanitizedPasswordTelefono = escapeInput(passwordTelefono);
    
        const trimTelefono = sanitizedTelefono.trim();
        const trimPasswordTelefono = sanitizedPasswordTelefono.trim();

        const regexTelefono = /^[0-9]{10}$/;

        if (!regexTelefono.test(trimTelefono)) {
            return res.status(400).send('El número de teléfono debe ser válido (10 dígitos).');
        }
        if (trimTelefono.length > 10) {
            return res.status(400).send('El teléfono no puede tener más de 10 dígitos.');
        }

        const querySelectPassword = 'SELECT contrasena FROM Usuario WHERE id_usuario = ?';
        db.query(querySelectPassword, [userId], (err, results) => {
            if (err) {
                console.error('Error al consultar la contraseña:', err);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const passwordDB = results[0].contrasena;

            if (passwordDB !== trimPasswordTelefono) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }

            const queryUpdateName = 'UPDATE Cliente SET telefono = ? WHERE id_usuario = ?';
            db.query(queryUpdateName, [trimTelefono, userId], (err) => {
                if (err) {
                    console.error('Error al actualizar el nombre de usuario:', err);
                    return res.status(500).json({ message: 'Error interno del servidor al actualizar el nombre de usuario' });
                }

                return res.status(200).send(`
                    <h2>Numero telefonico actualizado correctamente</h2>
                    <p>Nuevo numero telefonico:${trimTelefono}</p>
                    <br><a href="/perfil.html">Regresar</a>
                `);
            });
        });
    });

    //Extraer usuario
    app.get('/ExtraerUsuario', (req, res) => {
        const userId = req.session.userId; 

        if (userId) {
            db.query('SELECT * FROM Usuario WHERE id_usuario = ?', [userId], (err, resultados) => {
                if (err) {
                    console.error('Error al obtener el usuario:', err);
                    return res.status(500).json({ mensaje: 'Error al obtener el usuario' });
                }
    
                if (resultados.length > 0) {
                    const usuario = resultados[0];
                    const contrasenaOculta = ocultarContrasena(usuario.contrasena);
                    res.json({
                        nombre: usuario.nombre,
                        correo: usuario.correo,
                        contrasena: contrasenaOculta
                    });
                } else {
                    res.status(404).json({ mensaje: 'Usuario no encontrado' });
                }
            });
        } else {
            res.status(401).json({ mensaje: 'No autorizado' });
        }
    });

    function ocultarContrasena(contrasena) {
        return '*'.repeat(contrasena.length);
    }

    //CLIENTE

    //Cambiar direccion
    app.post('/ModificarDireccion', (req, res) => { 
        const { calle, numero_interior, numero_exterior, colonia, alcaldia_municipio, estado, codigo_postal, passwordDireccion } = req.body;
        const userId = req.session.userId;

        if (!passwordDireccion) {
            return res.status(400).send('La contraseña es obligatoria para realizar cambios.');
        }

        const escapeInput = (input) => {
            return input.replace(/[<>\/\\'"%;]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        };

        if (/[\<\>\'\"\%\;]/.test(calle) || /[\<\>\'\"\%\;]/.test(numero_exterior) || /[\<\>\'\"\%\;]/.test(numero_interior) 
            || /[\<\>\'\"\%\;]/.test(colonia) || /[\<\>\'\"\%\;]/.test(alcaldia_municipio) || /[\<\>\'\"\%\;]/.test(estado) 
            || /[\<\>\'\"\%\;]/.test(codigo_postal) || /[\<\>\'\"\%\;]/.test(passwordDireccion)) 
        {
            return res.status(400).send('No se permiten inyecciones HTML, SQL o cualquier otro tipo de inyección.');
        }

        const sanitizedCalle = escapeInput(calle);
        const sanitizedNumExterior = escapeInput(numero_exterior);
        const sanitizedNumInterior = escapeInput(numero_interior);
        const sanitizedColonia = escapeInput(colonia);
        const sanitizedAlcaldiaMunicipio = escapeInput(alcaldia_municipio);
        const sanitizedEstado = escapeInput(estado);
        const sanitizedCodigoPostal = escapeInput(codigo_postal);
        const sanitizedPasswordDireccion = escapeInput(passwordDireccion);

        const trimCalle = sanitizedCalle.trim();
        const trimNumExterior = sanitizedNumExterior.trim();
        const trimNumInterior = sanitizedNumInterior.trim();
        const trimColonia = sanitizedColonia.trim();
        const trimAlcaldiaMunicipio = sanitizedAlcaldiaMunicipio.trim();
        const trimEstado = sanitizedEstado.trim();
        const trimCodigoPostal = sanitizedCodigoPostal.trim();
        const trimPasswordDireccion = sanitizedPasswordDireccion.trim();

        const regexCodigoPostal = /^[0-9]{5}$/;
        const regexAlphanumeric = /^[a-zA-Z0-9\s]+$/;

        if (trimCalle.length > 100) {
            return res.status(400).send('La calle no puede exceder los 100 caracteres.');
        }
        if (!regexAlphanumeric.test(trimNumExterior)) {
            return res.status(400).send('El número exterior debe ser alfanumérico.');
        }
        if (!regexAlphanumeric.test(trimNumInterior)) {
            return res.status(400).send('El número interior debe ser alfanumérico o estar vacío.');
        }
        if (trimColonia.length > 100) {
            return res.status(400).send('La colonia no puede exceder los 100 caracteres.');
        }
        if (trimAlcaldiaMunicipio.length > 100) {
            return res.status(400).send('La alcaldía o municipio no puede exceder los 100 caracteres.');
        }
        if (trimEstado.length > 50) {
            return res.status(400).send('El estado no puede exceder los 50 caracteres.');
        }
        if (!regexCodigoPostal.test(trimCodigoPostal)) {
            return res.status(400).send('El código postal debe ser numérico y tener 5 dígitos.');
        }

        const querySelectPassword = 'SELECT contrasena FROM Usuario WHERE id_usuario = ?';
        db.query(querySelectPassword, [userId], (err, results) => {
            if (err) {
                return res.status(500).send('Error interno del servidor.');
            }

            if (results.length === 0) {
                return res.status(404).send('Usuario no encontrado.');
            }

            const passwordDB = results[0].contrasena;

            if (passwordDB !== trimPasswordDireccion) {
                return res.status(401).send('Contraseña incorrecta.');
            }

            const queryIdCliente = 'SELECT id_cliente FROM Cliente WHERE id_usuario = ?';
            db.query(queryIdCliente, [userId], (err, results) => {
                if (err) {
                    return res.status(500).send('Error interno del servidor.');
                }

                if (results.length === 0) {
                    return res.status(404).send('Cliente no encontrado.');
                }

                const idCliente = results[0].id_cliente;

                const queryGetDireccion = 'SELECT * FROM Direccion WHERE id_cliente = ?';
                db.query(queryGetDireccion, [idCliente], (err, direccionActual) => {
                    if (err) {
                        return res.status(500).send('Error interno del servidor.');
                    }

                    if (direccionActual.length > 0) {
                        const direccion = direccionActual[0];
                        if (
                            direccion.calle === trimCalle &&
                            direccion.numero_interior === trimNumInterior &&
                            direccion.numero_exterior === trimNumExterior &&
                            direccion.colonia === trimColonia &&
                            direccion.alcaldia_municipio === trimAlcaldiaMunicipio &&
                            direccion.estado === trimEstado &&
                            direccion.codigo_postal === trimCodigoPostal
                        ) {
                            return res.status(400).send('No se realizaron cambios, la dirección es la misma.');
                        }
                    }

                    let query = 'UPDATE Direccion SET';
                    const values = [];

                    if (calle) {
                        query += ' calle = ?,';
                        values.push(trimCalle);
                    }
                    if (numero_interior) {
                        query += ' numero_interior = ?,';
                        values.push(trimNumInterior);
                    }
                    if (numero_exterior) {
                        query += ' numero_exterior = ?,';
                        values.push(trimNumExterior);
                    }
                    if (colonia) {
                        query += ' colonia = ?,';
                        values.push(trimColonia);
                    }
                    if (alcaldia_municipio) {
                        query += ' alcaldia_municipio = ?,';
                        values.push(trimAlcaldiaMunicipio);
                    }
                    if (estado) {
                        query += ' estado = ?,';
                        values.push(trimEstado);
                    }
                    if (codigo_postal) {
                        query += ' codigo_postal = ?,';
                        values.push(trimCodigoPostal);
                    }

                    if (values.length === 0) {
                        return res.status(400).send('No se detectaron cambios en los datos proporcionados.');
                    }

                    query = query.slice(0, -1) + ' WHERE id_cliente = ?';
                    values.push(idCliente);

                    db.query(query, values, (err) => {
                        if (err) {
                            return res.status(500).send('Error interno del servidor al actualizar la dirección.');
                        }

                        return res.status(200).send('Dirección actualizada correctamente.');
                    });
                });
            });
        });
    });

    //Cargar Cliente
    app.get('/ExtraerCliente', (req, res) => {
        const userId = req.session.userId;
        if (userId) {
            db.query('SELECT * FROM Cliente WHERE id_usuario = ?', [userId], (err, resultados) => {
                if (err) {
                    console.error('Error al obtener el usuario:', err);
                    return res.status(500).json({ mensaje: 'Error al obtener el usuario' });
                }
    
                if (resultados.length > 0) {
                    const usuario = resultados[0];
                    res.json({
                        telefono: usuario.telefono,
                        id_cliente: usuario.id_cliente,
                    });
                } else {
                    res.status(404).json({ mensaje: 'Usuario no encontrado' });
                }
            });
        } else {
            res.status(401).json({ mensaje: 'No autorizado' });
        }
    });

    //Cargar Dirección
    app.get('/ExtraerDireccion', (req, res) => {
        const userId = req.session.userId;
    
        if (userId) {
            db.query('SELECT id_cliente FROM Cliente WHERE id_usuario = ?', [userId], (err, resultadosCliente) => {
                if (err) {
                    console.error('Error al obtener el cliente:', err);
                    return res.status(500).json({ mensaje: 'Error al obtener el cliente.' });
                }
    
                if (resultadosCliente.length === 0) {
                    return res.status(404).json({ mensaje: 'Cliente no encontrado.' });
                }
    
                const idCliente = resultadosCliente[0].id_cliente;
    
                db.query('SELECT * FROM direccion WHERE id_cliente = ?', [idCliente], (err, resultadosDireccion) => {
                    if (err) {
                        console.error('Error al obtener la dirección:', err);
                        return res.status(500).json({ mensaje: 'Error al obtener la dirección.' });
                    }
    
                    if (resultadosDireccion.length === 0) {
                        return res.status(404).json({ mensaje: 'Dirección no encontrada para el cliente.' });
                    }
                    res.json(resultadosDireccion);
                });
            });
        } else {
            return res.status(401).json({ mensaje: 'No autorizado.' });
        }
    });
    

//CLIENTES
    
    //Admin

    //Extraer todos los clientes
    app.get('/ExtraerClientes', (req, res) => {
        db.query('SELECT * FROM cliente', (err, resultados) => {
            if (err) {
                console.error('Error al obtener clientes:', err);
                return res.status(500).json({ error: 'Error al obtener clientes.' });
            }
            if (resultados.length === 0) {
                return res.status(404).json({ mensaje: 'No se encontraron clientes.' });
            }
            res.json(resultados);
        });
    });
    
    //Extraer todos los usuarios
    app.get('/ExtraerUsuarios/:id', (req, res) => {
        const id = req.params.id;
    
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ mensaje: 'ID inválido. Debe ser un número positivo.' });
        }
    
        db.query('SELECT * FROM usuario WHERE id_usuario = ?', [id], (err, resultados) => {
            if (err) {
                console.error('Error al obtener usuario:', err);
                return res.status(500).json({ error: 'Error al obtener usuario.' });
            }
            if (resultados.length === 0) {
                return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
            }
            res.json(resultados);
        });
    });
    
    //Extraer todas las direcciones 
    app.get('/ExtraerDirecciones/:id', (req, res) => {
        const id = req.params.id;

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ mensaje: 'ID inválido. Debe ser un número positivo.' });
        }
    
        db.query('SELECT * FROM direccion WHERE id_cliente = ?', [id], (err, resultados) => {
            if (err) {
                console.error('Error al obtener la dirección:', err);
                return res.status(500).json({ mensaje: 'Error al obtener la dirección.' });
            }
            if (resultados.length === 0) {
                return res.status(404).json({ mensaje: 'No se encontraron direcciones para el cliente.' });
            }
            res.json(resultados);
        });
    });


//AÑADIR AL CARRITO (clientes)
    
    app.get('/api/get-user-id', (req, res) => {
        const idUsuario = req.session.userId;
        if (!idUsuario) {
            return res.status(401).json({ error: 'Usuario no autenticado. Inicia sesión para continuar.' });
        }

        if (typeof idUsuario !== 'number' || idUsuario <= 0) {
            return res.status(400).json({ error: 'ID de usuario no válido.' });
        }

        res.json({ id_usuario: idUsuario });
    });

// API del lado del servidor: Validar la cantidad de productos
app.post('/api/agregar-al-carrito', async (req, res) => {
    const { id_producto, cantidad, id_usuario } = req.body;

    // Verifica si la cantidad es un número entero positivo
    if (isNaN(cantidad) || cantidad <= 0 || !Number.isInteger(cantidad)) {
        return res.status(400).json({ error: 'La cantidad debe ser un número entero positivo.' });
    }

    // Verificar que el ID del usuario esté presente
    if (!id_usuario) {
        return res.status(401).json({ error: 'Usuario no autenticado. Inicia sesión para continuar.' });
    }

    try {
        // Consulta la cantidad disponible en el inventario para el producto
        const result = await db.query('SELECT cantidad_producto FROM Producto WHERE id_producto = ?', [id_producto]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        const cantidadDisponible = result[0].cantidad_producto;

        // Verifica si la cantidad solicitada es mayor que la cantidad disponible en el inventario
        if (cantidad > cantidadDisponible) {
            return res.status(400).json({ error: `Solo hay ${cantidadDisponible} unidades disponibles del producto.` });
        }
        
        const carritoResult = await db.query('SELECT * FROM Carrito WHERE id_usuario = ? AND id_producto = ?', [id_usuario, id_producto]);

        if (carritoResult.length > 0) {
            // Si el producto ya está en el carrito, actualizamos la cantidad
            const nuevaCantidad = carritoResult[0].cantidad + cantidad;
            const updateResult = await db.query('UPDATE Carrito SET cantidad = ? WHERE id_usuario = ? AND id_producto = ?', [nuevaCantidad, id_usuario, id_producto]);

            if (updateResult.affectedRows > 0) {
                return res.status(200).json({ message: `Cantidad actualizada: Ahora tienes ${nuevaCantidad} unidades del producto en tu carrito.` });
            } else {
                return res.status(500).json({ error: 'Error al actualizar la cantidad en el carrito.' });
            }
        } else {
            // Si el producto no está en el carrito, lo insertamos
            const insertResult = await db.query('INSERT INTO Carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)', [id_usuario, id_producto, cantidad]);

            if (insertResult.affectedRows > 0) {
                return res.status(200).json({ message: 'Producto agregado al carrito correctamente.' });
            } else {
                return res.status(500).json({ error: 'Error al agregar el producto al carrito.' });
            }
        }
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
    }
});












    app.get('/api/direccion', (req, res) => {
        const userId = req.session.userId; // Asumiendo que tienes el ID del usuario en la sesión
    
        if (userId) {
            // Realiza la consulta a la base de datos para obtener el nombre y la contraseña
            db.query('SELECT * FROM Dirreccion WHERE id_usuario = ?', [userId], (err, resultados) => {
                if (err) {
                    console.error('Error al obtener el usuario:', err);
                    return res.status(500).json({ mensaje: 'Error al obtener el usuario' });
                }
    
                if (resultados.length > 0) {
                    const usuario = resultados[0];
                    
    
                    res.json({
                        telefono: usuario.telefono,
                    });
                } else {
                    res.status(404).json({ mensaje: 'Usuario no encontrado' });
                }
            });
        } else {
            res.status(401).json({ mensaje: 'No autorizado' });
        }
    });



    app.post('/api/actualizar-usuario', (req, res) => { 
        if (!req.session || !req.session.userId) {
            console.error("No autorizado: sesión no contiene userId");
            return res.status(404).json({ error: "No autorizado, por favor inicie sesión." });
        }
    
        const userId = req.session.userId;
        const { nombre, correo ,contrasena, telefono } = req.body;
    
        // Validación de teléfono
        if (telefono && telefono.length !== 10) {
            return res.status(400).json("Telefono incorrecto, el numero de telefono debe ser de 10 digitos");
        }
    
        // Verificar si el nombre de usuario ya existe
        db.query('SELECT nombre FROM usuario WHERE id_usuario != ?', [userId], (err, result) => {
            if (err) {
                console.error('Error en la base de datos:', err);
                return res.status(500).json({ error: 'Error en la base de datos' });
            }
    
            for (let i = 0; i < result.length; i++) {
                const nombres = result[i].nombre;
                if (nombre === nombres) {
                    return res.status(400).json({ error: 'Nombre de usuario ya existente' });
                }
            }
    
            // Verificar la contraseña del usuario actual
            db.query('SELECT contrasena, rol FROM usuario WHERE id_usuario = ?', [userId], (err, result) => {
                if (err) {
                    console.error('Error en la base de datos:', err);
                    return res.status(500).json({ error: 'Error en la base de datos' });
                }
    
                if (result.length === 0) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }
    
                const contraseñaAlmacenada = result[0].contrasena;
                const rol = result[0].rol;
    
                if (contrasena !== contraseñaAlmacenada) {
                    return res.status(403).json({ success: false, message: 'Contraseña incorrecta' });
                }
    
                // Actualizar el nombre y correo si se proporcionan
                const updateValues = [];
                const updateFields = [];
    
                if (nombre) {
                    updateFields.push('nombre = ?');
                    updateValues.push(nombre);
                }
    
                if (correo) {
                    updateFields.push('correo = ?');
                    updateValues.push(correo);
                }
    
                // Si no hay valores para actualizar
                if (updateFields.length === 0) {
                    return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
                }
    
                // Actualizar usuario
                updateValues.push(userId);
                db.query(`UPDATE usuario SET ${updateFields.join(', ')} WHERE id_usuario = ?`, updateValues, (err) => {
                    if (err) {
                        console.error('Error al actualizar los datos:', err);
                        return res.status(500).json({ error: 'Error al actualizar los datos' });
                    }
    
                    // Si el rol no es Admin, agregar la dirección a la tabla Cliente
                    if (rol !== 'Admin' && telefono && calle && numero_interior && numero_exterior && colonia && alcaldia_municipio && estado && codigo_postal) {
                        db.query(
                            'INSERT INTO Direccion (calle, numero_interior, numero_exterior, colonia, alcaldia_municipio, estado, codigo_postal, id_cliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                            [calle, numero_interior, numero_exterior, colonia, alcaldia_municipio, estado, codigo_postal, userId],
                            (err) => {
                                if (err) {
                                    console.error('Error al agregar la dirección:', err);
                                    return res.status(500).json({ error: 'Error al agregar la dirección' });
                                }
    
                                // Respuesta exitosa
                                res.json({ success: true, message: 'Usuario actualizado correctamente' });
                            }
                        );
                    } else {
                        // Si el rol es Admin o no se proporcionaron datos de dirección, finalizar actualización
                        res.json({ success: true, message: 'Usuario actualizado correctamente' });
                    }
                });
            });
        });
    });
    

    // Suponiendo que estás usando Express y tienes una conexión a la base de datos
    
    
    


    app.get('/api/pedidos', (req, res) => {
        db.query('SELECT * FROM pedido', (err, resultados) => {
            if (err) {
                console.error('Error al obtener pedidos:', err);
                return res.status(500).json({ error: 'Error al obtener pedidos' });
            }
            res.json(resultados);
        });
    });
    
    
    // Ruta para obtener productos de un pedido específico
    app.get('/api/productos/:idPedido', (req, res) => {
        const idPedido1 = req.params.idPedido; // Obtiene el idPedido de los parámetros de la URL
    
        db.query('SELECT id_producto FROM pedidoproducto WHERE id_pedido=?', [idPedido1], (err, resultados) => {
            if (err) {
                console.error('Error al obtener productos:', err);
                return res.status(500).json({ error: 'Error al obtener productos' });
            }
            res.json(resultados);
        });
    });

    
    
    // Ruta para obtener el nombre y el precio de un producto específico
    app.get('/api/NomProduct/:idProducto', (req, res) => {
        const idProducto1 = req.params.idProducto; // Obtiene el idProducto de los parámetros de la URL
    
        db.query('SELECT nombre_producto, precio_producto FROM producto WHERE id_producto=?', [idProducto1], (err, resultados) => {
            if (err) {
                console.error('Error al obtener nombre del producto:', err);
                return res.status(500).json({ error: 'Error al obtener nombre del producto' });
            }
            res.json(resultados);
        });
    });
    
        // Ruta para obtener pedidos de un cliente específico
    app.get('/api/client-pedidos', (req, res) => {
        const idCliente = req.query.cliente_id; // Obtiene el cliente_id de los parámetros de la consulta

        if (!idCliente) {
            return res.status(400).json({ error: 'El ID del cliente es requerido' });
        }

        db.query('SELECT * FROM pedido WHERE id_cliente = ?', [idCliente], (err, resultados) => {
            if (err) {
                console.error('Error al obtener pedidos:', err);
                return res.status(500).json({ error: 'Error al obtener pedidos' });
            }
            res.json(resultados);
        });
    });

    app.get('/api/pedidosF', (req, res) => {
        const idPedido = req.query.id_pedido; // Leer el ID desde los parámetros de consulta
        
        if (!idPedido) {
            // Si no se proporciona el ID, retorna un error
            return res.status(400).json({ error: 'ID del pedido es requerido' });
        }

        db.query('SELECT * FROM pedido WHERE id_pedido = ?', [idPedido], (err, resultados) => {
            if (err) {
                console.error('Error al obtener pedidos:', err);
                return res.status(500).json({ error: 'Error al obtener pedidos' });
            }

            if (resultados.length === 0) {
                // Si no se encuentra el pedido, retorna un mensaje claro
                return res.status(404).json({ error: 'Pedido no encontrado' });
            }

            // Responder con los resultados
            res.json(resultados[0]); // Enviar solo el primer resultado si se espera uno
        });
    });


    app.get('/api/pedido/productos', (req, res) => {
        const idPedido = req.query.id_pedido; // Capturamos el ID del pedido desde el cliente

        if (!idPedido) {
            // Validamos que se haya proporcionado el id_pedido
            return res.status(400).json({ error: 'ID del pedido es requerido' });
        }

        // Query para obtener los detalles de los productos del pedido
        const query = `
            SELECT 
                p.nombre_producto,
                pp.cantidad,
                p.precio_producto AS precio_unitario,
                (pp.cantidad * p.precio_producto) AS subtotal
            FROM PedidoProducto pp
            JOIN Producto p ON pp.id_producto = p.id_producto
            WHERE pp.id_pedido = ?
        `;

        // Ejecutamos la consulta
        db.query(query, [idPedido], (err, resultados) => {
            if (err) {
                console.error('Error al obtener los productos del pedido:', err);
                return res.status(500).json({ error: 'Error al obtener los productos del pedido' });
            }

            if (resultados.length === 0) {
                // Si no hay productos vinculados al pedido
                return res.status(404).json({ error: 'No se encontraron productos para este pedido' });
            }

            // Respondemos con los productos
            res.json(resultados);
        });
    });





    // Ruta para obtener productos de un pedido específico
    app.get('/api/pedido-productos/:idPedido', (req, res) => {
        const idPedidoActual = req.params.idPedido; // Obtiene el idPedido de los parámetros de la URL

        db.query('SELECT id_producto FROM pedidoproducto WHERE id_pedido = ?', [idPedidoActual], (err, resultados) => {
            if (err) {
                console.error('Error al obtener productos:', err);
                return res.status(500).json({ error: 'Error al obtener productos' });
            }
            res.json(resultados);
        });
    });

    // Ruta para obtener el nombre y el precio de un producto específico
    app.get('/api/producto-info/:idProducto', (req, res) => {
        const idProductoActual = req.params.idProducto; // Obtiene el idProducto de los parámetros de la URL

        db.query('SELECT nombre_producto, precio_producto FROM producto WHERE id_producto = ?', [idProductoActual], (err, resultados) => {
            if (err) {
                console.error('Error al obtener nombre del producto:', err);
                return res.status(500).json({ error: 'Error al obtener nombre del producto' });
            }
            res.json(resultados);
        });
    });

    
    // Ruta para obtener productos
    app.get('/api/idproductos', (req, res) => {
        db.query('SELECT id_producto, nombre, precio FROM producto', (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error al obtener productos' });
            }
            res.json(results);
        });
    });

    app.get('/api/id_cliente', async (req, res) => {
        const userId = req.session.userId;
        const pedidoQuery = 'SELECT id_cliente FROM cliente WHERE id_usuario=?';
        
        try {
            const [results] = await db.promise().query(pedidoQuery, [userId]); // Usando la promesa de MySQL
            if (results.length > 0) {
                res.json(results[0]); // Devuelve el primer resultado
            } else {
                res.status(404).json({ error: 'Cliente no encontrado' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener el cliente' });
        }
    });



    //cambios
    app.post('/ExtraerClienteId',(req,res)=>{
        
    });





    app.post('/api/ComprarCarrito', (req, res) => {
        const total = parseFloat(req.query.total);
        const carritoRaw = req.query.carrito;
    
        let carrito;
        try {
            carrito = JSON.parse(decodeURIComponent(carritoRaw));
        } catch (error) {
            console.error('Error al decodificar el carrito:', error);
            return res.status(400).json({ error: 'El carrito no es válido.' });
        }
    
        const idUsuario = req.session.userId;
    
        if (isNaN(total) || total <= 0) {
            return res.status(400).json({ error: 'El total debe ser un valor positivo.' });
        }
    
        if (!Array.isArray(carrito) || carrito.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío o no es válido.' });
        }
    
        if (!idUsuario) {
            return res.status(401).json({ error: 'Usuario no autenticado.' });
        }
    
        const obtenerIdCliente = 'SELECT id_cliente FROM cliente WHERE id_usuario = ?';
        db.query(obtenerIdCliente, [idUsuario], (err, resultados) => {
            if (err) {
                console.error('Error al buscar el id_cliente:', err);
                return res.status(500).json({ error: 'Error interno al buscar el cliente.' });
            }
    
            if (resultados.length === 0) {
                return res.status(404).json({ error: 'No se encontró cliente asociado a este usuario.' });
            }
    
            const idCliente = resultados[0].id_cliente;
            const fechaHoy = new Date().toISOString().slice(0, 10);
            const estado = 'listo';
    
            const insertarPedido = `
                INSERT INTO pedido (estado, fecha_pedido, precio_total, id_cliente)
                VALUES (?, ?, ?, ?)`;
            db.query(insertarPedido, [estado, fechaHoy, total, idCliente], (err, resultado) => {
                if (err) {
                    console.error('Error al insertar el pedido:', err);
                    return res.status(500).json({ error: 'Error al guardar el pedido.' });
                }
    
                const pedidoId = resultado.insertId;
                const insertarPedidoProducto = `
                    INSERT INTO PedidoProducto (id_pedido, id_producto, cantidad, precio)
                    VALUES ?`;
    
                const valores = carrito.map(producto => [
                    pedidoId,
                    producto.id_producto,
                    producto.cantidad,
                    producto.cantidad * producto.precio_producto,
                ]);
    
                db.query(insertarPedidoProducto, [valores], (err) => {
                    if (err) {
                        console.error('Error al insertar productos en PedidoProducto:', err);
                        return res.status(500).json({ error: 'Error al guardar los productos del pedido.' });
                    }
    
                    // Actualizar la cantidad de productos en la tabla Producto
                    const actualizarCantidadProducto = `
                        UPDATE Producto
                        SET cantidad_producto = cantidad_producto - ?
                        WHERE id_producto = ?`;
    
                    let errorActualizacion = false;
                    carrito.forEach(producto => {
                        db.query(actualizarCantidadProducto, [producto.cantidad, producto.id_producto], (err) => {
                            if (err) {
                                console.error(`Error al actualizar la cantidad del producto ${producto.id_producto}:`, err);
                                errorActualizacion = true;
                            }
                        });
                    });
    
                    if (errorActualizacion) {
                        return res.status(500).json({ error: 'Error al actualizar la cantidad de productos.' });
                    }
    
                    res.status(201).json({
                        mensaje: 'Pedido y productos guardados exitosamente.',
                        pedidoId,
                    });
                });
            });
        });
    });
    
    
    

    app.post('/agregar-al-carrito', (req, res) => {
        const id_usuario = req.session.id_usuario; // Obtener id_usuario de la sesión
        const { id, cantidadP } = req.body;
    
        if (!id_usuario) {
            return res.status(401).send('No se encontró una sesión activa.');
        }
    
        if (!id || !cantidadP || cantidadP <= 0) {
            return res.status(400).send('Datos inválidos.');
        }
    
        // Verificar si el carrito del usuario ya existe
        if (!carritos[id_usuario]) {
            carritos[id_usuario] = [];
        }
    
        // Buscar si el producto ya está en el carrito
        const productoExistente = carritos[id_usuario].find(p => p.id_producto === id);
    
        if (productoExistente) {
            // Si ya existe, actualizamos la cantidad
            productoExistente.cantidad += cantidadP;
        } else {
            // Si no existe, lo agregamos
            carritos[id_usuario].push({ id_producto: id, cantidad: cantidadP });
        }
    
        res.send(`Producto agregado al carrito de usuario ${id_usuario}`);
    });
    
    // Ruta para obtener el carrito del usuario actual
    app.get('/carrito', (req, res) => {
        const id_usuario = req.session.id_usuario;
    
        if (!id_usuario) {
            return res.status(401).send('No se encontró una sesión activa.');
        }
    
        res.json(carritos[id_usuario] || []);
    });

    app.get('/api/verificar-direccion', (req, res) => {
        const idUsuario = req.query.idUsuario;
    
        const query = `
            SELECT COUNT(*) AS cantidad
            FROM Direccion d
            INNER JOIN Cliente c ON d.id_cliente = c.id_cliente
            WHERE c.id_usuario = ?`;
    
        db.query(query, [idUsuario], (err, resultados) => {
            if (err) {
                console.error('Error al verificar la dirección:', err);
                return res.status(500).json({ error: 'Error interno al verificar la dirección.' });
            }
    
            const tieneDireccion = resultados[0].cantidad > 0;
            res.json({ tieneDireccion });
        });
    });
    
    












    
    app.get('/api/cliente', (req, res) => {
        const userId = req.session.userId; // Asumiendo que tienes el ID del usuario en la sesión
    
        if (userId) {
            // Realiza la consulta a la base de datos para obtener el nombre y la contraseña
            db.query('SELECT * FROM Cliente WHERE id_usuario = ?', [userId], (err, resultados) => {
                if (err) {
                    console.error('Error al obtener el usuario:', err);
                    return res.status(500).json({ mensaje: 'Error al obtener el usuario' });
                }
    
                if (resultados.length > 0) {
                    const usuario = resultados[0];
                    
    
                    res.json({
                        telefono: usuario.telefono,
                        id_cliente: usuario.id_cliente,
                    });
                } else {
                    res.status(404).json({ mensaje: 'Usuario no encontrado' });
                }
            });
        } else {
            res.status(401).json({ mensaje: 'No autorizado' });
        }
    });
    


    app.get('/ExtraerDireccionUsuario/:id', (req, res) => {
        const id = req.params.id; // Obtén el ID de los parámetros de la URL
        db.query('SELECT * FROM direccion WHERE id_cliente = ?', [id], (err, resultados) => {
            if (err) {
                console.error('Error al obtener usuario:', err);
                return res.status(500).json({ error: 'Error al obtener usuario' });
            }
            res.json(resultados); // Envía los resultados como respuesta en formato JSON
        });
    });
    


    
    
    // Suponiendo que estás usando Express y tienes una conexión a la base de datos
    app.get('/api/clientes', (req, res) => {
        db.query('SELECT * FROM cliente', (err, resultados) => {
            if (err) {
                console.error('Error al obtener clientes:', err);
                return res.status(500).json({ error: 'Error al obtener clientes' });
            }
            res.json(resultados);
        });
    });
    
    

    app.get('/api/usuario', (req, res) => {
        const userId = req.session.userId; // Asumiendo que tienes el ID del usuario en la sesión
    
        if (userId) {
            // Realiza la consulta a la base de datos para obtener el nombre y la contraseña
            db.query('SELECT * FROM Usuario WHERE id_usuario = ?', [userId], (err, resultados) => {
                if (err) {
                    console.error('Error al obtener el usuario:', err);
                    return res.status(500).json({ mensaje: 'Error al obtener el usuario' });
                }
    
                if (resultados.length > 0) {
                    const usuario = resultados[0];
                    const contrasenaOculta = ocultarContrasena(usuario.contrasena); // Oculta la contraseña
    
                    res.json({
                        nombre: usuario.nombre,
                        correo: usuario.correo,
                        contrasena: contrasenaOculta // Envía la contraseña oculta
                    });
                } else {
                    res.status(404).json({ mensaje: 'Usuario no encontrado' });
                }
            });
        } else {
            res.status(401).json({ mensaje: 'No autorizado' });
        }
    });
    




    
    // Iniciar el servidor
    app.listen(3000, () => {
        console.log('Servidor en funcionamiento en http://localhost:3000');
    });