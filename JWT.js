if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const accessToken = sign(
    { regNo:user.regNo, id: user._id },
    process.env.JWT_Secret
  );

  return accessToken;
};

const validateTokenStudent = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken)
    {
        req.flash('success',"The student is not logged in.");
        res.redirect('/auth');
    }

  try {
    const validToken = verify(accessToken, process.env.JWT_Secret);
    if (validToken) {
      req.authenticated = true;
      req.user=validToken;
      return next();
    }
  } catch (err) {
    req.flash('success',err.message);
    res.redirect("/dashboard");
  }
};

const validateTokenAdmin = (req, res, next) => {
    const adminToken = req.cookies["admin-token"];
  
    if (!adminToken)
      {
          req.flash('success',"The admin is not logged in.");
          res.redirect('/adminAuth');
      }
  
    try {
      const validToken = verify(adminToken, process.env.JWT_Secret);
      if (validToken) {
        req.authenticated = true;
        return next();
      }
    } catch (err) {
      req.flash('success',err.message);
      res.redirect("/dashboard");
    }
  };


module.exports = { createTokens, validateTokenStudent, validateTokenAdmin };