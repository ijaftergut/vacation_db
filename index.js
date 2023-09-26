const pg = require('pg');
const client = new pg.Client('postgres://localhost/vacation_db');
const express = require('express');
const app = express();
const path = require('path');
app.use(express.json())
const homePage = path.join(__dirname, 'index.html');
app.get('/', (req, res)=> res.sendFile(homePage));

const reactApp = path.join(__dirname, 'dist/main.js');
app.get('/dist/main.js', (req, res)=> res.sendFile(reactApp));

const reactSourceMap = path.join(__dirname, 'dist/main.js.map');
app.get('/dist/main.js.map', (req, res)=> res.sendFile(reactSourceMap));

const styleSheet = path.join(__dirname, 'styles.css');
app.get('/styles.css', (req, res)=> res.sendFile(styleSheet));
app.get('/api/users', async(req, res, next)=>{
  try{
    const SQL = `
    SELECT * 
    FROM users
    `;
    const response = await client.query(SQL)
    res.send(response.rows)
  }catch(error){
    next(error)
  }
})
app.get('/api/places', async(req, res, next)=>{
  try{
    const SQL = `
    SELECT * 
    FROM places
    `;
    const response = await client.query(SQL)
    res.send(response.rows)
  }catch(error){
    next(error)
  }
})
app.get('/api/vacations', async(req, res, next)=>{
  try{
    const SQL = `
    SELECT * 
    FROM vacations
    `;
    const response = await client.query(SQL)
    res.send(response.rows)
  }catch(error){
    next(error)
  }
})
app.post('/api/vacations', async(req, res, next)=>{
  try{
    const SQL = `
    INSERT INTO vacations(user_id, place_id) VALUES ($1, $2) RETURNING *
    
    `;

    const response = await client.query(SQL, [req.body.user_id, req.body.place_id])
    res.send(response.rows[0])
  }catch(error){
    next(error)
  }
})
app.delete('/api/vacations/:id', async(req, res, next)=>{
  try{
    const SQL = `
    DELETE FROM vacations WHERE id=$1
    `;

    await client.query(SQL, [req.params.id])
    res.sendStatus(204)
  }catch(error){
    next(error)
  }
})
const init = async()=> {
  await client.connect();
  console.log('connected to database');
  const SQL = `
DROP TABLE IF EXISTS vacations;
DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS places;

  CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
  );
  CREATE TABLE places(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
  );
  CREATE TABLE vacations(
    id SERIAL PRIMARY KEY,
    place_id INTEGER REFERENCES places(id) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
  );
  INSERT INTO users(name) Values ('moe');
  INSERT INTO users(name) Values ('larry');
  INSERT INTO users(name) Values ('lucy');
  INSERT INTO users(name) Values ('curly');
  INSERT INTO places(name) Values ('home');
  INSERT INTO places(name) Values ('away');
  INSERT INTO places(name) Values ('inside');
  INSERT INTO places(name) Values ('outside');
  INSERT INTO vacations(user_id, place_id) VALUES (
    (SELECT id FROM users WHERE name='lucy'),
    (SELECT id FROM places WHERE name='home')
  );
  `;
  await client.query(SQL)
  console.log('create your tables and seed data');

  const port = process.env.PORT || 4000;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
  });
}

init();
