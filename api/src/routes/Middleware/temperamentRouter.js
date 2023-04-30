const {Router} = require("express")
const {Temperament} = require("../../db")
const {getTemperaments} = require("./utils")

const router = Router();


router.get("/", async (req,res)=> {
   try{
    const temperaments = await getTemperaments()
    res.status(201).json(temperaments)
   }
   catch(e) {console.log(e)}
})







module.exports = router