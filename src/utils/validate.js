'use strict'

const empresa = require('../models/empresa.model')
const bcrypt = require('bcrypt-nodejs');

exports.validateData = (data)=>{
    let keys = Object.keys(data), msg = '';
    for(let key of keys){
        if(data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
            msg += `Param (${key}) is required\n`;
    }
    return msg.trim();
}

exports.searchUser = async (user)=>{
    try{
        let already = User.findOne({username: user}).lean();
        return already;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.encrypt = async (password)=>{
    try{
        return bcrypt.hashSync(password);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkPass = async (password, hash)=>{
    try{
        return bcrypt.compareSync(password, hash);
    }catch(err){
        console.log(err);
        return err;
    }
}


exports.checkPermission = async (userId, sub)=>{
    try{
        if(userId != sub){
            return false;
        }else{
            return true;
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkUpdate = async (user)=>{
    if(user.password || 
       Object.entries(user).length === 0 || 
       user.role){
        return false;
    }else{
        return true;
    }
}
exports.checkUpdateAdmin = async(user)=>{
    if(user.password ||
       Object.entries(user).length === 0){
        return false;
    }else{
        return true;
    }
}
