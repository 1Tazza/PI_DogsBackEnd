
const { Router } = require("express");
const {Dog, Temperament} = require("../../db")
const {getApi, getDogsByRace, getDogById} = require("./utils")

const router = Router();


router.get("/:id", async (req,res)=> {
   const {id} = req.params
   try{
    const dog = await getDogById(id)
    res.status(201).json(dog)
   }
   catch(e) {console.log(e)}
})

router.get("/", async (req,res)=> {
    const {name} = req.query
    try{
    if(name) {
    const dogs = await getDogsByRace(name);
    res.status(201).json(dogs)
    }
    else{ 
    const dogs = await getApi();
    res.status(201).json(dogs)
    }  
   }
   catch(e) {console.log(e)}
})

router.post("/", async (req,res) => {
    const {temperament} = req.body
    try{
     const newDog = await Dog.create(req.body);
     
      await Promise.all(temperament.map(async (temp) => { 
        // Crear un nuevo objeto Temperament para cada string
        const newTemp = await Temperament.create({ name: temp });
        // Asignar el nuevo Temperament al perro creado
        await newDog.addTemperament(newTemp);
      })); 

     res.status(201).json(newDog)
    }
    catch(e) {res.status(404).json(console.log(e))}
});









module.exports = router;