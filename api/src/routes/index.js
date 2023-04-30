const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const DogRouter = require("./Middleware/dogRouter")
const TempRouter = require("./Middleware/temperamentRouter")

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/dogs", DogRouter);

router.use("/temperaments", TempRouter)






module.exports = router;
