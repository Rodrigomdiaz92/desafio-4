const express = require('express');
const { Router } = express;
const multer = require('multer');
//const ProductosApi = require('./api/productos.js')
const ProductosApi = require('./api/Contenedor.js')

// router de productos

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const upload = multer({storage: storage});

const productosApi = new ProductosApi('./productos.txt')


const productosRouter = new Router()

productosRouter.use(express.json())
productosRouter.use(express.urlencoded({ extended: true }))


function mdl1(req, res, next){
    req.miAporte1 = 'dato por mdl1';
    if(req.rol === 'admin'){
        res.status(500).send('no autorizado');
    }
    next();
}

//rutas usando productosRouter

//GET
productosRouter.get('/', async(req,res)=>{
    let allProducts = await productosApi.getAll();
    res.send(allProducts);

})

//GET ID path params

productosRouter.get('/:id', async(req, res) => {
    const { id } = req.params;
    //res.send({buscada: productosApi[parseInt(id) - 1]});
    let productById = await productosApi.getById(parseInt(id));
    res.json({
        result: 'recurso buscado',
        pathParam: req.params.id,
        producto: productById
    })
})

//POST
productosRouter.post('/', async(req,res)=>{
    const producto = req.body;
    console.log(req.body);
    let guardar = await productosApi.save(producto);
    res.json(producto)   

})

//PUT 

productosRouter.put('/:id', async(req, res)=>{
    const { id } = req.params;
    const { cambioPrecio } = req.body;
    
    const productById = await productosApi.getById(parseInt(id));
    const nuevoPrecio = productById;
    nuevoPrecio.precio = cambioPrecio;
    

    res.send({actualizada: nuevoPrecio , anterior: productById})




})

//DELETE

productosRouter.delete('/:id', async(req, res)=>{
    const { id } = req.params;
    const productById = await productosApi.getById(parseInt(id));
    let eliminarProductoId = await productosApi.deleteById(parseInt(id))
    res.send({borrada: productById});

    // const producto = productos.splice(parseInt(id) - 1, 1);
    // res.send({borrada: producto});
})



// servidor

const app = express()
app.use(express.static('public'))
app.use('/api/productos', productosRouter)

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))
