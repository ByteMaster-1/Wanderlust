if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose=require('mongoose');
const Listing=require('./models/listing');
const path=require("path");
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError=require('./utils/ExpressErrors');
const listingRoutes=require('./routes/listing');
const reviewsRoutes=require('./routes/reviews');
const userRoutes=require('./routes/users');
const session=require('express-session');
const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const multer=require('multer');

const dbUrl=process.env.ATLASDB_URL;

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);

const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
  });


store.on("error",()=>{
    console.log("error in mongo store",err);    
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};


app.get('/',(req,res)=>{
    res.send('Hello World');
});

app.use(session(sessionOptions));
app.use(flash());
//passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    next();
});

main().then(()=>{
    console.log('Connected to MongoDB');
}).catch(err=>{
    console.log(err);
});

//connection to mongodb
async function main(){
    //await mongoose.connect('mongodb://localhost:27017/wanderlust');
    await mongoose.connect(dbUrl);
}


app.listen(8080,(res,req)=>{
    console.log('Server is running on port 8080');
});

// //fake user
// app.get('/faker', async (req, res) => {
//         const user = new User({
//             email: 'abc@gmailcom',
//             username: 'abcdef',
//         });
//         const newUser = await User.register(user, 'abc');
//         res.send(newUser);
// });


//listing routes
app.use('/listings',listingRoutes);



//reviews routes
app.use('/listings/:id/reviews',reviewsRoutes);

//user_router
app.use('/',userRoutes);


app.all('*',(res,req,next)=>{
    next(new ExpressError(404,"PAGE NOT FOUND"));
});


app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render('listing/error.ejs',{message});
});