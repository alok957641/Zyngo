

const jwt = require("jsonwebtoken");

const generatetocken = (userid) => {

    try {
        const tocken = jwt.sign({ userid }, process.env.JWT_SECRET, { expiresIn: "7d" })
        return tocken;
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = generatetocken;