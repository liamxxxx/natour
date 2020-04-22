const errorProd = (err, res) => {
    // Verifie que l'erreur est une erreur connue
    if (err.isOperationel) {
        res
        .status(err.statusCode)
        .json({
            status: err.status,
            message: err.message
        });
        console.log(err.isOperationel);
    } else {
        console.error('Error: ', err)
        res
        .status(500)
        .json({
            status: 'error',
            message: 'Something went wrong !'
        });
    }
   
}

const errorDev = (err, res) => {
    res
    .status(err.statusCode)
    .json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
} 

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // if (process.env.NODE_ENV === 'production') {
    //     errorProd(err, res)
    // } else if (process.env.NODE_ENV === 'development') {
    //      errorDev(err, res)
    // }
    errorProd(err, res);
}

module.exports = globalErrorHandler;