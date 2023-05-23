const functions = require("./function");

module.exports = () => (req, res, next) => {
    // success response
    res.success = (message, data) => {
        message = functions.prettyCase(message);
        return res.send({ statusCode: 200, message, data: data || {}, status:1 });
    };

    // error resposne
    res.error = (code, message, data) => {
        message = functions.prettyCase(message);
        code = code ? code : 400
        if(code == 401){
            res.status(code).send({ statusCode: code, message, data: data || {}, status :0 ,"isSessionExpired": true});
        }else{
            res.status(code).send({ statusCode: code, message, data: data || {}, status :0 });
        }
    };

    // proceed forward
    next();
};