var express					=require("express"),
	app						=express(),
	bodyParser				=require("body-parser"),
 	mongoose				=require("mongoose"),
	passport				=require("passport"),
	User 					=require("./models/user"),
	methodOverride			=require("method-override"),
	flash					=require("connect-flash"),
	LocalStrategy			=require("passport-local"),
	passportLocalMongoose	=require("passport-local-mongoose"),
 	Campground				=require("./models/campground"),
	Comment					=require("./models/comment"),
	seedDB					=require("./seeds");

var campgroundRoutes =require("./routes/campgrounds"),
	commentsRoutes   =require("./routes/comments"),
	indexRoutes		 =require("./routes/index");

//console.log(process.env.DATABASEURL);
//mongodb://localhost:27017/yelp_camp
mongoose.connect(process.env.DATABASEURL,{ useNewUrlParser: true,useUnifiedTopology: true });
//mongoose.connect("mongodb+srv://tushar:tushar@26@cluster0.y5stg.mongodb.net/yelp_camp?retryWrites=true&w=majority",{ useNewUrlParser: true,useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

//PASSPORT CONFIGURATION

app.use(require("express-session")({
		secret:"tushar",
		resave:false,
		saveUninitialized:false	
	}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes);


	app.listen(process.env.PORT,process.env.IP,function(){
		console.log("Yelpcamp server has been started");
	});