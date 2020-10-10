const express = require("express");
const app = express();
const bodyParser = require("body-parser");
let mysql = require("mysql");

let connection;
try {
  (async function () {
    connection = mysql.createConnection({
      host: "127.0.0.1",
      user: "root",
      port: 3309,
      password: "password",
      database: "db",
    });

    connection.connect(function (err) {
      if (err) {
        return console.log("error: " + err);
      } else {
        console.log("connected");
        let createRolesTable = `create table if not exists ROLES(
                          ROLE_ID int primary key auto_increment,
                          ROLE_NAME varchar(255) not null,
                          ROLE_DESCRIPTION varchar(255) null
                      )`;

        let createEmployeesTable = `create table if not exists EMPLOYEES(
                          EMPLOYEE_ID int primary key auto_increment,
                          EMPLOYEE_USERNAME varchar(255) not null,
                          EMPLOYEE_PASSWORD varchar(255) not null,
                          EMPLOYEE_DEPARTMENT varchar(255) not null,
                          EMPLOYEE_AGE varchar(255) not null,
                          EMPLOYEE_GENDER varchar(255) not null
                      )`;

        let createEmployeeRoleJunctionTable = `create table if not exists EMPLOYEE_ROLE (
                          EMPLOYEE_ID int(255) NOT NULL,
                          ROLE_ID int(255) NOT NULL,
                          PRIMARY KEY (EMPLOYEE_ID,ROLE_ID),
                          FOREIGN KEY (EMPLOYEE_ID) REFERENCES EMPLOYEES (EMPLOYEE_ID),
                          FOREIGN KEY (ROLE_ID) REFERENCES ROLES (ROLE_ID)
                      )`;

        connection.query(createEmployeesTable, function (err, result) {
          if (err) {
            console.log("err = ", err);
            throw err.message;
          }
        });

        connection.query(createEmployeeRoleJunctionTable, function (
          err,
          result
        ) {
          if (err) {
            console.log("err = ", err);
            throw err.message;
          }
        });

        return connection.query(createRolesTable, function (
          err,
          results,
          fields
        ) {
          if (err) {
            console.log("err = ", err);
            return null;
          } else {
            console.log("result = ", results);

            let sql = `INSERT INTO ROLES(ROLE_NAME,ROLE_DESCRIPTION)
             VALUES('role1',"This is role1"), ('role2',"This is role2"), ('role3',"This is role3"), ('role4',"This is role4")`;

            return connection.query(sql, function (err, insertResult) {
              if (err) {
                console.log("err = ", err);
                return null;
              } else {
                console.log("insert Result = ", insertResult);
              }
            });
          }
        });
      }
    });

    // connection.end();

    return;
  })();
} catch (ex) {
  console.log("ex = ", ex);
}

let username = "user";
let password = "password";

let data = {
  EMPLOYEE_ID: "1",
  EMPLOYEE_USERNAME: "name",
  EMPLOYEE_DEPARTMENT: "dept1",
  EMPLOYEE_AGE: 23,
  EMPLOYEE_GENDER: "Male",
  ROLE_NAME: "Admin",
  ROLE_DESCRIPTION: "To check the each employee detail",
};

app.use(bodyParser.json());

app.get("/fetch-roles", (req, res) => {
  try {
    let sql = `SELECT * FROM ROLES`;

    connection.query(sql, function (err, rolesResult) {
      if (err) {
        console.log("err = ", err);
        res.status(400).json({
          body: { message: `Failed to Fetch Roles` },
          statusCode: 400,
        });
      } else {
        res.status(200).json({
          body: { message: "Roles Fetch Successfully", data: rolesResult },
          statusCode: 200,
        });
      }
    });
  } catch (ex) {
    res.status(400).json({
      body: { message: `Failed to Fetch Roles, ${ex.message}` },
      statusCode: 400,
    });
  }
});

app.post("/login", (req, res) => {
  res
    .status(200)
    .json({ body: { message: "Login Successful" }, statusCode: 200 });
});

app.post("/register", (req, res) => {
  try {
    if (connection) {
      let {
        userName,
        userPassword,
        roleIds,
        age,
        department,
        gender,
      } = req.body;
      console.log("rolesIds = ", roleIds);

      let buff = new Buffer(userPassword);
      let base64Password = buff.toString("base64");

      console.log("userName = ", userName);

      let sql = `INSERT INTO EMPLOYEES(EMPLOYEE_USERNAME, EMPLOYEE_PASSWORD, EMPLOYEE_DEPARTMENT, EMPLOYEE_AGE, EMPLOYEE_GENDER )
             VALUES("${userName}", "${base64Password}", "${department}", ${age}, "${gender}")`;

      connection.query(sql, function (err, insertEmployee, fields) {
        if (err) {
          console.log("err = ", err);
          res.status(400).json({
            body: { message: `User not registered, ${err.message} ` },
            statusCode: 400,
          });
        } else {
          console.log("result after insertion = ", insertEmployee);
          console.log("result after fields = ", fields);
          for (let i in roleIds) {
            let sqlEmployeeRole = `INSERT INTO EMPLOYEE_ROLE (EMPLOYEE_ID,ROLE_ID) VALUES("${insertEmployee.insertId}", "${roleIds[i]}");`;
            connection.query(sqlEmployeeRole);
          }

          res.status(200).json({
            body: { message: "Register Successful" },
            statusCode: 200,
          });
        }
      });
    } else {
      res.status(400).json({
        body: {
          message: "Registration unsuccessful, Please Contact Administrator",
        },
        statusCode: 400,
      });
    }
  } catch (ex) {
    console.log("ex = ", ex);

    res.status(400).json({
      body: {
        message: "Registration unsuccessful, Please Contact Administrator",
      },
      statusCode: 400,
    });
  }
});

app.post("/employee-detail", (req, res) => {
  setTimeout(() => {
    res.status(200).json({ body: { ...data }, statusCode: 200 });
  }, 1000);
});

app.listen(4000, () => console.log("app is listening at 4000"));
