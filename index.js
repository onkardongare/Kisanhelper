require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const cookieParser = require('cookie-parser')
const server = express();


const authRouter = require('./routes/auhtRoutes');
const userRouter = require('./routes/userRoutes')
const { User } = require('./model/userModel');
const { isAuth, sanitizeUser, cookieExtractor } = require('./common');
const path = require('path');
const { env } = require('process');


const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.SECRET_KEY

server.use(cookieParser());
server.use(
    session({
        secret: 'keyboad cat',
        resave: false,
        saveUninitialized: false
    })
)
server.use(passport.authenticate('session'))
server.use(
    cors({
      exposedHeaders: ['X-Total-Count'],
    })
  );
server.use(express.json());

server.use('/',authRouter.router);
server.use('/users', isAuth(), userRouter.router);



// passport strategies

passport.use(
    'local',
    new LocalStrategy(
        {usernameField: 'email'},
        async function(email, password, done){
            //bydefault password uses username
            try{
                const user = await User.findOne({email: email});
                console.log(email, password, user);
                if(!user) {
                    return done(null, false, {message:'invalid credentials'}); //for safety
                }
                crypto.pbkdf2(
                    password,
                    user.salt,
                    310000,
                    32,
                    'sha256',
                    async function(err, hashedPassword){
                        sotredPassword = Buffer.from(user.password,'hex')
                        if(!crypto.timingSafeEqual(sotredPassword, hashedPassword)){
                            return done(null, false, {message: 'invalid credentials'});
                        }
                        const token = jwt.sign(sanitizeUser(user), process.env.SECRET_KEY);
                        done(null,{id: user.id, role: user.role, token}); //this lines sends to serializer
                    }
                );
            }catch (err) {
                done(err);
            }
        }
    )
)

passport.use(
    'jwt',
    new JwtStrategy(opts, async function(jwt_payload, done) {
        console.log({jwt_payload});
        try{
            const user = await User.findById(jwt_payload.id);
            if(user) {
                return done(null, sanitizeUser(user)); //this call serializer
            } else{
                return done(null, false);
            }
        } catch(err) {
            console.log("error in jwt")
            return done(err, false)
        }
    })
)

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb){
    console.log('serialize', user);
    process.nextTick(function(){
        return cb(null, { id: user.id, role: user.role})
    })
})

// this changes session variable req.user when called from authorized request

passport.deserializeUser(function (user, cb){
    console.log('de-serialize', user);
    process.nextTick(function(){
        return cb(null, user);
    })
})

main().catch(err => console.log(err))

async function main(){
    console.log(process.env.MONGODB_URL,process.env.PORT)
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('database connected')
}

server.listen(process.env.PORT, ()=>{
    console.log("server started")
})