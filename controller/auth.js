const { User } = require('../model/userModel')
const crypto = require('crypto');
const {sanitizeUser} = require('../common')
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    try{
        const salt = crypto.randomBytes(16);
        crypto.pbkdf2(
            req.body.password,
            salt,
            310000,
            32,
            'sha256',
            async function(err, hashedPassword){
                // add something for err error handling
                const user = new User({...req.body, password: hashedPassword.toString('hex'), salt});
                const doc = await user.save();

            req.login(sanitizeUser(doc),(err) =>{
                // this also calls serializer and adds to session
                if(err){
                    res.status(400).json(err);
                } else{
                    const token = jwt.sign(
                        sanitizeUser(doc),
                        process.env.SECRET_KEY
                    );
                    res
                       .cookie('jwt', token, {
                        expires: new Date(Date.now() + 3600000),
                        httpOnly: true,
                       })
                       .status(201)
                       .json({ id: doc.id, role: doc.role});
                }
            })
            }
        )
    }catch(err) {
        res.status(400).json(err)
    }
}

exports.loginUser = async (req, res) => {
    const user = req.user;
    console.log(user)
    res
       .cookie('jwt', user.token,{
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
       })
       .status(201)
       .json({ id: user.id, role: user.role});
};

exports.logout = async (req, res) => {
  res
    .cookie('jwt',null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    .sendStatus(200)
};

exports.checkAuth = async (req, res) =>{
    if(req.user) {
        res.status(200).json(req.user);
    } else{
        res.status(401).json({message:"something wrong"});
    }
};

// exports.resetPasswordRequest = async (req, res) =>{
//     const email = req.body.email;
//     const user = await userActivation.findOne({email: email});
//     if(user) {
//         const token = crypto.randomBytes(48).toString('hex');
//         user.resetPasswordRequest = token;
//         await user.save();

//         // Also set token in email
//         const resetPageLink =
//           'http://localhost:3000/reset-password?token=' + token +'&email=' + email;
//         const subject = 'reset password for e-commerce';
//         const html = ``
//     }
// }