const express = require('express')
const agentes = require('./data/agentes.js').results
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

app.listen(3000, () => console.log('Your app listening on port 3000'))
const secretKey = "superClave"

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

// Paso 1
app.get("/SignIn", (req, res) => {
    // Paso 2
    const { email, password } = req.query
    console.log("email y password : ", email, password);
    // console.log("type of agentes : ", agentes.results);

    // Paso 3
    const agente = agentes.find((agente) => agente.email === email && agente.password === password);
    // Paso 4
    if (!agente) {
        return res.status(401).json({
          error: "Credenciales incorrectas",
        });
      }

    if (agente) {
        
        // Paso 5
        const token = jwt.sign({
                               exp: Math.floor(Date.now() / 1000) + 120,
                               data: agente
                              }, secretKey);
        // Paso 6
        res.send(`
            
            Bienvenido, ${email}. Tu sesión expirará en 120 segundos.
            <a href="/rutaRestringida?token=${token}"> <p> Click para ir al Ruta Restringida</p></a>
            <script>
                sessionStorage.setItem('token', '${token}')
            </script>`
        );
    } else {
        // Paso 7
        res.send("Usuario o contraseña incorrecta");
    }

});

app.get('/rutaRestringida',  (req, res) => {
    console.log("Bienvenido a la Ruta Restringida,")
    const token = req.query.token;
    if (!token) {
        res.status(401).send("No hay token, no esta Autorizado");
    } else {
        jwt.verify(token, secretKey, (err, data) => {
            console.log("Valor de Data: ", data);
            err ? 
            res.status(403).send("Token inválido o ha expirado")
            : 
            res.status(200).send("Bienvenido "+ data.data.email + ". Quedan 2 minutos para que la sesión expire." );
        });
    }


});