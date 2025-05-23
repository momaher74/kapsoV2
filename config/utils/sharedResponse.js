const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};


const sendError = (res, message = "Internal Server Error", statusCode = 500) => {
    res.status(statusCode).json({
        success: false,
        message,
    });
};

const sendNotFound = (res, message = "Resource not found") => {
    res.status(404).json({
        success: false,
        message,
    });
};


const sendBadRequest = (res, message = "Bad Request") => {
    res.status(400).json({
        success: false,
        message,
    });
};

module.exports = {
    sendSuccess,
    sendError,
    sendNotFound,
    sendBadRequest,
};