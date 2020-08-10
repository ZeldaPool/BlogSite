var express 		= require("express"),
	methodOverride	= require("method-override"),
	expressSanitizer= require("express-sanitizer"),
	mongoose 		= require("mongoose"),
	app 			= express(),
	bodyParser 		= require("body-parser");

// App Config
mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//Mongoose model data and config

var blogSchema= new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default:  Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Test Blog",
// 	image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQrt1sMyrLK9r05TOmtKNHDUcydcdorryenm6m3YgRk5fKJdtJp&usqp=CAU",
// 	body:"This is INDEED A BLOG"
// });

//RESTful ROUTES

app.get("/", function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
	Blog.find({}, function(err,blogs){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{blogs: blogs});
		}
	})
	
});

//New Route
app.get("/blogs/new", function(req,res){
	res.render("new");
});

//Create Route
app.post("/blogs", function(req,res){
	//Create
	req.body.blog.body = req.sanitize(req.body.blog.body);
		Blog.create(req.body.blog, function(err,newBlog){
			if(err){
				res.render("new")
			}
			else{
				//Redirect
				res.redirect("/blogs")
			}
		})
	
});

//Show route
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			res.redirect("/blogs")
		}
		else{
			res.render("show", {blog: foundBlog})
		}
		
	})
	
})

//Edit Route
app.get("/blogs/:id/edit", function(req,res){
	
	Blog.findById(req.params.id, function(err,foundBlog){
		if(err){
			res.redirect("/blogs")
		}
		else{
			res.render("edit", {blog: foundBlog});
		}
		
	})
	
})

//Update

app.put("/blogs/:id", function(req,res){
	
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			res.redirect("/blogs")
		}
		else{
			res.redirect("/blogs/"+req.params.id);
		}
	})
})

//Delete

app.delete("/blogs/:id", function(req,res){
	//destroy
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	})
	
	
});

app.listen(3000, function(){
	console.log("WOKAY PORT 3K");
});