const mongoose=require('mongoose');
let initData=require('./data.js');
const Listing=require('../models/listing');

main().then(()=>{
    console.log('Connected to MongoDB');
}).catch(err=>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'66817d009c730faf8cb5eeae'}));
   await Listing.insertMany(initData.data);
    console.log('Database Initialized');
}
initDB();