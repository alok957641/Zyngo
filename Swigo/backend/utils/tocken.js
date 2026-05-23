const jwt = require("jsonwebtoken");

const generatetocken = (userid) => {

    try {

        const token = jwt.sign(

            { id: userid },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }
        );

        return token;

    } catch (err) {

        console.log(err);

    }
};

module.exports = generatetocken;