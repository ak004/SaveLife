const jwt        = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token  = req.headers.authorization.split(" ")[1];

        const isCustomerAuth = token.length < 500;
        
        let decodedData;

        if (token && isCustomerAuth) {
            decodedData = jwt.verify(token, "test");

            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token);

            req.userId = decodedData?.sub
        }

        next();
    } catch (error) {
        console.log("auth error: " , error);
    }
} 


module.exports = auth