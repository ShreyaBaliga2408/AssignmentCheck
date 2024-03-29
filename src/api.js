/// api.js

const express = require('express');
const router = express.Router();


const auth = require('./auth');
const dbAccount = require('../models/Accounts');
const dbAssignment = require('../models/Assignments')
const apiService = require ('./apiServices');
const sequelize = require('./db-bootstrap');
//const  models  = require('./models');

router.use(express.json());
router.use( async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const credentials = authHeader.split(' ')[1];
  const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
  const [email, password] = decodedCredentials.split(':');

  try {
      const isAuthenticated = await auth.authenticateUser(email, password);
      if(isAuthenticated != null) {
        const account = await dbAccount(sequelize).findOne({ where: { email : email } });
        req.body.user_id = account.id;
         
          console.log(req.body.user_id);
          next();
         
      }
  } catch (error) {
    //   error.status = 401;
    //   next(error);
    res.status(401).send();
  }
});



router.get( "/assignments", async ( req, res, next ) => {
  try {
      const assignments = await apiService.getAllAssignments();
      res.json(assignments);
  }
  catch(error) {
    //   error.status = 400;
    //   next(error);
    res.status(400).send();
  }
});

router.get( "/assignments/:id", async ( req, res, next ) => {
  try {
      const id = req.params.id;
      const user_id = req.body.user_id;
      const assignment = await apiService.getAssignment(id, user_id);
      res.json(assignment);
  }
  catch(error) {
    //   error.status = 403;
    //   next(error);
    res.status(403).send();
  }
});


router.post("/assignments", async ( req, res, next ) => {
  const assignmentObj = req.body;
  try {
          const assignment = await apiService.createAssignment(assignmentObj);
          res.status(201);
          res.json(assignment);
      } catch (error) {
        //   error.status = 400;
        //   next(error);
        res.status(400).send();
      } 
});

router.put("/assignments/:id", async ( req, res, next ) => {
  const id = req.params.id;
  const assignmentObj = req.body;
      try {
          
          const assignment = await apiService.updateAssignment(id, assignmentObj);
          res.status(204);
          res.send();
      } catch (error) {
          error.status = error.status || 400;
        //   next(error);
        res.status(error.status).send();
      } 
});

router.patch("/assignments/:id", async ( req, res, next ) => {
  const id = req.params.id;
  const assignmentObj = req.body;
      try {
          const assignment = await apiService.updateAssignment(id, assignmentObj);
          res.status(204);
          res.send();
      } catch (error) {
          error.status = error.status || 400;
          //next(error);
          res.status(error.status).send();
      } 
});

router.delete("/assignments/:id", async ( req, res, next ) => {
  const id = req.params.id;
  const user_id = req.body.user_id;

      try {
          const status = await apiService.deleteAssignment(id, user_id);
          res.status(204);
          res.send();
      } catch (error) {
          error.status = error.status || 404;
         // next(error);
         res.status(error.status).send();
      } 
});

module.exports = router;

