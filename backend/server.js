const express = require('express');
require('dotenv').config();
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3307;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err)=>{
    if (err) {
        console.error('Error de conexión a MySQL:', err);
        return;
      }
      console.log('Conectado a MySQL');
});

app.listen(port,()=>{
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
})

app.get('/api/getCategories',(req,res)=>{
    db.query(`SELECT  c.id_category, c.name_category,c.image_url,c.visible FROM categories c;`,(err,results)=>{
        if(err) throw err;
        res.json(results);
    });
});

app.post('/api/insertCategory', (req, res) => {
    console.log('Solicitud recibida:', req.body); // Esto debería imprimir los datos enviados desde el cliente
  
    const { name_category, image_url, visible } = req.body;
  
    if (!name_category || !image_url) {
      return res.status(400).json({ message: 'Faltan parámetros requeridos: name_category o image_url' });
    }
  
    const query = 'INSERT INTO categories (name_category, image_url,visible) VALUES (?, ?,?);';
    db.execute(query, [name_category, image_url,visible], (err, results) => {
      if (err) {
        console.error("Error al ejecutar la consulta:", err);
        return res.status(500).json({ message: 'Error al insertar la tarea', error: err });
      } else {
        res.status(201).json({ message: 'Categoría guardada exitosamente', id: results.insertId });
      }
    });
  });

  app.put('/api/updateCategory', (req, res) => {
    const { id_category, name_category, image_url, visible } = req.body;
    const query = `UPDATE categories SET name_category = ?, image_url = ?, visible = ? WHERE id_category = ?;`;
    db.execute(query, [name_category, image_url, visible, id_category], (err, results) => {
      if (err) {
        res.status(500).json({ message: 'Error al actualizar la categoría' });
      } else {
        res.status(200).json({ message: 'Categoría actualizada exitosamente' });
      }
    });
  });

  app.put('/api/deleteCategory',(req,res) =>{
    const {id_category} = req.body;
    const query = `DELETE FROM categories WHERE id_category = ?`;
    db.execute(query,[id_category],(err,results) => {
    if (err) {
        res.status(500).json({ message: 'Error al actualizar la categoría' });
    } else {
        res.status(200).json({ message: 'Categoría actualizada exitosamente' });
    }
    })
  });

  app.get('/api/getFoods',(req,res) =>{
    db.query(`SELECT f.id_food,f.name,f.price,f.description,f.image_url,f.id_category,f.pais, c.name_category,country.name_country  
      FROM foods f INNER JOIN categories c on c.id_category = f.id_category 
      INNER JOIN countries country on country.id_pais = f.pais;`,(err,results)=>{
        if(err){
          res.status(500).json({message: 'Error al obtener los datos'});
        }else{

          res.status(200).json(results);
        }
      });
  });

  app.get('/api/getCountries',(req,res)=>{
    db.query(`SELECT id_pais,name_country FROM countries;`,(err,results) =>{
      if(err){
        res.status(500).json({message: 'Error al obtener los datos'});
      }else{
        res.status(200).json(results);
      }
    });
  })


  app.put('/api/insertFood', (req, res) => {
    const { nameFood, price, description, image_url, id_category, pais } = req.body;
  
    // Validar que todos los campos estén presentes
    if (!nameFood || !price || !description || !image_url || !id_category || !pais) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    const query = `INSERT INTO foods (name, price, description, image_url, id_category, pais)VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.execute(query, [nameFood, price, description, image_url, id_category, pais], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al insertar la comida' });
      }
      res.status(200).json({ message: 'Se ha insertado la comida' });
    });
  });
  
  app.put('/api/updateFood',(req,res) =>{
    const {id_food,nameFood,price,description,image,country,category} = req.body;
    let query = `UPDATE foods SET name=?, price=?, description=?, image_url=?,id_category=?,pais=? WHERE id_food =?`;
    if(!id_food || !nameFood || !price || !description || !image || !country || !category){
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    db.execute(query, [nameFood, price, description, image, category, country, id_food],(err,results) =>{
      if(err){
        console.error(err);
        return res.status(500).json({message: 'Error al insertar la comida'});
      }
      res.status(200).json({message: 'Se ha actualizado la comida'});
    });
  });

  app.put('/api/deleteFood',(req,res) =>{
    const {id_food} = req.body;
    let query = `DELETE FROM foods WHERE id_food = ?`;
    if(!id_food){
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    db.execute(query,[id_food],(err,results) =>{
      if(err){
        console.error(err);
        return res.status(500).json({message: 'Error al insertar la comida'});
      }
      res.status(200).json({message: 'Se ha eliminado la comida'});
    });
  });
  
  