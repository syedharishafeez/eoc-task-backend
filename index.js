const express = require("express");
const app = express();
const bodyParser = require("body-parser");
let mysql = require('mysql');


try{
 (async function(){
  let connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todoapp'
  });
  let sql;

  connection.connect(async function(err) {
    if (err) {
      return console.log('error: ' + err.message);
    }
  let createRoles = `create table if not exists roles(
                          ROLE_ID int primary key auto_increment,
                          ROLE_NAME varchar(255)not null,
                          ROLE_DESCRIPTION varchar(255),
                      )`;
  await connection.query(createRoles).then(res=>{
    sql = `INSERT INTO roles(ROLE_NAME,ROLE_DESCRIPTION)
             VALUES('role1',"This is role1"), VALUES('role2',"This is role2"), VALUES('role3',"This is role3") ,VALUES('role4',"This is role4")`
    
  }).catch(e=>{
    console.log("e = ",e)
    return null
  }) 
  })

  if(sql){
    connection.query(sql);
  }

  connection.end();

  return
   
 })()
}catch(ex){
  
}

let username = "user";
let password = "password";

let data = {EMPLOYEE_ID:"1", EMPLOYEE_USERNAME:"name", EMPLOYEE_DEPARTMENT:"dept1", EMPLOYEE_AGE:23, EMPLOYEE_GENDER:"Male",ROLE_NAME:"Admin", ROLE_DESCRIPTION:"To check the each employee detail"}

app.use(bodyParser.json());

app.post("/login", (req, res) => {
    res
      .status(200)
      .json({ body: { message: "Login Successful" }, statusCode: 200 });
  
});

app.post("/register", (req, res) => {
  res
      .status(200)
      .json({ body: { message: "Register Successful" }, statusCode: 200 });
});

app.post("/employee-detail", (req, res) => {
  setTimeout(()=>{
    res
    .status(200)
    .json({ body: {...data}, statusCode: 200 });
  },1000)

});


app.listen(4000, () => console.log("app is listening at 4000"));
