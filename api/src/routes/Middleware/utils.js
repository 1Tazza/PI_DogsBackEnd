
const axios = require("axios");
const {Temperament, Dog, Op} = require("../../db")

  
const getApi = async() => {
    try{

    var recurso = await axios.get("https://api.thedogapi.com/v1/breeds")
    .then(recurso => {console.log(recurso.data)
    return recurso.data})
    .then(array => {
        return array.map( el => {
            return {
                id: el.id,
                img: `https://cdn2.thedogapi.com/images/${el.reference_image_id}.jpg`,
                name: el.name,
                temperament: el.temperament,
                weight: el.weight.metric
            } 
    })
           })


        var dogsDataBase = await Dog.findAll(
            {
            include: [{
            model: Temperament,
            attributes: ['name'],
            through: {
                attributes: []
             }
            }]
            });

        
            dogsDataBase = dogsDataBase.map(el => {
            return {
                id: el.id,
                img: el.img,
                name: el.name,
                temperament: el.temperaments.map(el => el.name).join(", "),
                weight: el.weight
        
             }
            })

        dogsDataBase = dogsDataBase.concat(recurso)


            return dogsDataBase
        }
    catch(e) {console.log(e)}
}

const getDogsByRace = async(race) => {
   try{
    const recurso = await axios.get(`https://api.thedogapi.com/v1/breeds/search?q=${race}`)
     
    var dogs = recurso.data.map( el => {
            return {
                id: el.id,
                img: `https://cdn2.thedogapi.com/images/${el.reference_image_id}.jpg`,
                name: el.name,
                temperament: el.temperament,
                weight: el.weight.metric,
                height:el.height.metric,
                life_expectancy: el.life_span
            } 
    })

    
    var dogsDb = await Dog.findAll({
            where: { [Op.or]: [{name: race}]},
            include: Temperament
            
        })
        
        dogsDb = dogsDb.map(el => {
            return {
                id: el.id,
                img: el.img,
                name: el.name,
                temperament: el.temperaments.map(el => el.name).join(", "),
                weight: el.weight,
                height:el.height,
                life_expectancy: el.life_expectancy
            }
        })
          
        dogs = dogsDb.concat(dogs)

          

          return dogs
  
    
   }
   catch(e) {console.log(e)}
}

const getDogById = async(id) => {
    try{

    if(parseInt(id).toString().length === id.length){

    const recurso = await axios.get(`https://api.thedogapi.com/v1/breeds`) 
    var dog = await recurso.data.filter(el => el.id === parseInt(id))

    if(dog.length !== 0) {
        dog = dog.map(el => {
            return {
                id: el.id,
                img: el.reference_image_id,
                name: el.name,
                temperament: el.temperament,
                weight: el.weight.metric,
                height:el.height.metric,
                life_expectancy: el.life_span
            }
        })
        
        return dog[0]
    }
    else {throw "no existe raza con el ID seleccionado"}
    }

    let dogDb = await Dog.findByPk(id, 
        {include: [{
          model: Temperament,   
          attributes: ["name"]
        }]}
        )
     
    let temperaments = dogDb.temperaments.map(el => el.name).join(", ")
    dogDb = {
        id: dogDb.id,
        img: dogDb.img,
        name: dogDb.name,
        temperament: temperaments,
        weight: dogDb.weight,
        height:dogDb.height,
        life_expectancy: dogDb.life_expectancy
    }

    if(dogDb) {return dogDb}
        
    else {throw "no existe raza con el ID seleccionado"}

    }
    catch(e) {console.log(e)}
}

const getTemperaments = async() => {
    var arr = []

    var recurso = await axios.get("https://api.thedogapi.com/v1/breeds")

    recurso.data.map(el => arr.push(el.temperament))
    
    let tempsDB = await Temperament.findAll()

    tempsDB = tempsDB.map(el => el.name)
    
    arr = arr.join().split(",").map(el => el[0] === " " ? el.slice(1) : el.slice(0) )
    
    arr = arr.concat(tempsDB)

    var dataArr = new Set(arr)

    let result = [...dataArr]
 
    result = result.filter(el => el !== "")


    return result
}



module.exports = {
    getApi,
    getDogsByRace,
    getDogById,
    getTemperaments
}