const { User } = require('../model/userModel');

exports.fetchUserById = async (req, res) => {
    const { id } = req.user;
    console.log(id)
    try{
        const user = await User.findById(id);
        res.status(200).json({user})
    }catch(err){
        res.status(400).json(err)
    }
}

exports.updateUser = async (req,res) =>{
    const {id} = req.params;
    try{
        const user = await User.findByIdAndUpdate(id, req.body, { new:true })
        res.status(200).json(user)
    }catch(err) {
        res.status(400).json(err)
    }
}

exports.createUser = async (req, res) =>{
  try{ const user = new User({...req.body})
    const doc = await user.save()
    res.status(200).json({doc})
    }catch(err){
    res.status(400).json(err)
    }
}