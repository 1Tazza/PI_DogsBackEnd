
const axios = require("axios");
const {Temperament, Dog, Op} = require("../../db")
const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
  cloud_name: "dapq4icmj",
  api_key: "182849148671358",
  api_secret: "LiNdU8c3mGXxCnRed_xiA9xQtLk"
});

  
  
/* var ps5Games = await new Promise((resolve, reject) => {
  cloudinary.api.resources(optionsPs5, (error, result) => {
  if (error) {
    reject(error);
  } else {
    resolve(result.resources);
  }});
});

var gamesApi = await Promise.all([ps3Games, ps4Games, ps5Games]) */

/* const optionsPs3 = { type: 'upload',  prefix: 'PS3/', max_results: 500 };
const optionsPs5 = { type: 'upload',  prefix: 'PS5/', max_results: 500}; */

const getApi = async() => {
    try{

    var recurso = await axios.get("https://api.thedogapi.com/v1/breeds")
    .then(recurso => recurso.data)
    .then(array => {
        return array.map( el => {
            return {
                id: el.id,
                img: el.image.url,
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


const getVideogames = async() => {
        
    var json = [{
        id: 1,
        name: "A Way Out",
        description: "Este título de acción y aventura se enfoca en la cooperación, con una trama centrada en las hazañas de dos prisioneros en fuga, Leo y Vincent, obligados a trabajar juntos para evitar a la policía y otros criminales. Para lograrlo deberán superar persecuciones en coche, pasajes sigilosos y combates cuerpo a cuerpo",

        img: ["https://res.cloudinary.com/dapq4icmj/image/upload/v1679333052/Ps4/Mafia%20Trilogy%20-%20ps4/Mafia-Trilogy-330x404_djrdru.jpg","https://res.cloudinary.com/dapq4icmj/image/upload/v1679333052/Ps4/Mafia%20Trilogy%20-%20ps4/Mafia-Trilogy-330x404_djrdru.jpg","https://res.cloudinary.com/dapq4icmj/image/upload/v1679333052/Ps4/Mafia%20Trilogy%20-%20ps4/Mafia-Trilogy-330x404_djrdru.jpg"],
        price: 10680,
        genre: 1,
    },{
        id: 2,
        name: "A Way Out",
        description: "En esta apasionante secuela, los jugadores serán parte de la exitosa historia de animé junto a Eren y sus compañeros, quienes luchan para salvar a la humanidad de la amenaza de los mortales titanes. Esta edición contiene las historias de las temporadas 1 a 3 del animé y más de 40 personajes jugables.",
        price: 2,
        genre: 2,
    }]

}

module.exports = {
    getApi,
    getDogsByRace,
    getDogById,
    getTemperaments
}