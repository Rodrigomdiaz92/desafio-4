const { promises:fs } = require('fs');


class Contenedor {

    constructor(ruta){
        this.ruta = ruta;
    }

    async save(obj){
        try {
            const products = await this.getAll();            
            let idNewProduct = products.length + 1;            
            //console.log(idNewProduct);
            //console.log(obj);
            //console.log(products);                                   
            const saveObj = obj;
            saveObj.id = products[products.length - 1].id + 1; 
            //saveObj.id = idNewProduct;
            //saveObj.id = products.length + 1;
            products.push(saveObj);            
            //console.log(products);
            await fs.writeFile(this.ruta, JSON.stringify(products,null,2), error =>{
                if(error){
                    throw new Error('Error en escritura');
                }                                
            });
            return console.log(`Escritura exitosa,`/* se agrego el producto con id: ${idNewProduct}`*/)            
        } catch (error) {
            console.log(error);            
        }
    }


    async getById(id){
        try {
            const products = await this.getAll();
            const productId = products.find(p => p.id == id);
            return productId;            
        } catch (error) {
            console.error(error)
            
        }
        
        
    }
    async getAll(){
        try {
            const products = await fs.readFile(this.ruta,'UTF-8');            
            return JSON.parse(products);
        } catch (error) {
            return [];
            
        }
        
    }
    async deleteById(id){
        try {
            const products = await this.getAll();            
            const newProducts = products.filter((producto)=> producto.id !== id);
            /*fs.writeFile(this.ruta, JSON.stringify(newProducts,null,2), error =>{
                if(error){
                    throw new Error('Error en escritura');
                }                                
            });*/ //Lo deje comentado para no eliminar productos de .txt
            return console.log(newProducts);            
        } catch (error) {
            console.error(error)
            
        }
        
        
    }


    async deleteAll(){
        try {
            let products = await this.getAll();
            console.log(products);
            products = [];
            /*fs.writeFile(this.ruta, JSON.stringify(products,null,2), error =>{
                if(error){
                    throw new Error('Error en escritura');
                }                                
            });*/
            return console.log(products);            
        } catch (error) {
            console.error(error)
            
        }
                
    }
}

module.exports = Contenedor;