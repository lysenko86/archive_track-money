'use strict';

var actionsCtrl = require('../controllers/actionsCtrl');
actionsCtrl = new actionsCtrl();

var actionsRouter = function(){
    this.route = function(res, data, mysql, params){
        switch (params[1]){

            case 'getActions':
                actionsCtrl.getActions(params, data, mysql, function(data){
                    res.json(data);
                });
            break;

            default:
                data.status = "error";
                data.msg = "Error! Unknown Action.";
                res.json(data);
            break;

        }
    }
};

module.exports = actionsRouter;
