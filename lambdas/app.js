exports.handler = async(event, context) =>{
    
    return sendResponse(200, "Fetch Succesfull")
};

const sendResponse = (status, body) => {
    var response = {
        statusCode: status,
        headers: {
            "Content-Type": "application/json"
        },
        body
    }
    return response
}