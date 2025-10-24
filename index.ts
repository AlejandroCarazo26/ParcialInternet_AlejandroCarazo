import express from "express";
import cors from "cors";
import axios from "axios";


//Importar Express y configurar el servidor:
const app = express();
const port = 3000;

type LD = {
    id: number,
    filmName: string,
    rotationType: "CAV" | "CLV",
    region: string,
    lengthMinutes: number,
    videoFormat: "NTSC" | "PAL"
}

//Crear un array inicial de discos (simulado)
let ld : LD[] = [
{
    id: 1, 
    filmName: "El Club de la Lucha",
    rotationType: "CAV",
    region: "America",
    lengthMinutes: 120,
    videoFormat: "NTSC"
},

{
    id: 2,
    filmName: "Arrival",
    rotationType: "CLV",
    region: "Canada",
    lengthMinutes: 200,
    videoFormat: "PAL"
}
];

app.use(cors());
app.use(express.json());


//Implementar los siguientes endpoints:

//GET: Devolver el array completo en formato JSON:
app.get("/ld/", (req, res) =>{
    res.json(ld)
})

//GET: Buscar por ID. Si no existe, devolver 404
// con { message: “Disco no encontrado" }.
app.get("/ld/:id", (req, res) =>{

    const idLD = req.params.id;
    const intID = Number(idLD);
    const buscandoID = ld.find((n)=>n.id=== intID);

    buscandoID ? res.json(buscandoID) : res.status(404).json({
        message: "Disco no encontrado"
    })
});

//POST: Recibir todos los datos del tipo en el body.
// Generar un id nuevo y añadirlo al array.
// Devolver el nuevo disco
app.post("/ld/", (req, res) =>{
    const newID = Date.now();
    const newFilmName = req.body.filmName;
    const newRotationType = req.body.rotationType;
    const newRegion = req.body.region;
    const newLengthMinutes = req.body.lengthMinutes;
    const newVideoFormat = req.body.videoFormat;

    const newLaserDisc : LD = {
        id: newID,
        filmName: newFilmName,
        rotationType: newRotationType,
        region: newRegion,
        lengthMinutes: newLengthMinutes,
        videoFormat: newVideoFormat
    };

    ld.push(newLaserDisc);
    res.status(201).json(newLaserDisc);
})


//DELETE: Buscar el disco por ID y eliminarlo del array. 
// Si no existe, devolver error 404
app.delete("/ld/:id", (req, res)=>{
    const Eliminado = ld.find((elem) => elem.id === Number(req.params.id));
    if(Eliminado){
        ld = ld.filter((elem) => elem.id !== Number(req.params.id));
        res.status(201).json(Eliminado);
    }
    else{
        res.status(404).send("No se ha podido eliminar porque no existe un disco con ese ID");
    }
})


app.listen(port, ()=> {console.log("Usted está conectado al puerto: " + port)})



//Parte 2

const testApi = async() => {
    // Obtener todos los discos (GET /ld).
    // Muestra la lista inicial en consola.
    const PromesaGet1 = (await(axios.get<LD[]>(`http://localhost:3000/ld`))).data;
    console.log(PromesaGet1);


    // Crear un nuevo disco (POST /ld).
    const miDisco : LD = {
        id: 5,
        filmName: "Tenet",
        rotationType: "CAV",
        region: "EEUU",
        lengthMinutes: 210,
        videoFormat: "NTSC"
    }

    axios.post('http://localhost:3000/ld', miDisco);

    // Volver a obtener todos los equipos (GET /ld).
    // Comprueba que aparece el nuevo disco.
    const PromesaGet2 = (await(axios.get<LD[]>(`http://localhost:3000/ld`))).data;
    console.log(PromesaGet2);

    //Eliminar ese equipo (DELETE /ld/:id).
    const EliminarDisco : LD | undefined = PromesaGet2.find((n)=>
        n.filmName === miDisco?.filmName &&
        n.rotationType === miDisco.rotationType &&
        n.region === miDisco.region &&
        n.lengthMinutes === miDisco.lengthMinutes &&
        n.videoFormat === miDisco.videoFormat
    )


    const PromesaDelete = (await(axios.delete<LD>(`http://localhost:3000/ld/${EliminarDisco?.id}`))).data;

    // Mostrar la lista final.
    const PromesaFinal= (await(axios.get<LD[]>(`http://localhost:3000/ld`))).data;
    console.log(PromesaFinal);

}

setTimeout((testApi), 1000);