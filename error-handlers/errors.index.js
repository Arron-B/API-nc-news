const express = require('express');


exports.handleCustomErrors = (err, req, res, next) => {
    console.log('in custom error handler ' + err);
    if(err.status) {
       res.status(err.status).send({msg: err.msg});
    } else next(err);
}