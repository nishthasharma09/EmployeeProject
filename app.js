const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
app.use(express.static("public"));
app.set("view engine",'ejs');

app.use(bodyParser.urlencoded({
	extended:true}));

mongoose.connect("mongodb://localhost:27017/employeeDB", {useNewUrlParser: true});

const employeeSchema = {
	email: String,
	password: String,
	empCode : String,
	empName :String,
	isActive: Number
};

let loggininEmp = '';
let status = 0;

const Employee = new mongoose.model("Employee", employeeSchema);

// HOME LOGIN PAGE
app.get("/",function(req,res){
	res.render("home");
});

app.post("/",function(req,res){
	const username = req.body.username;
	const password = req.body.password;

	Employee.findOne({email:username}, function(err, foundEmployee){
		if (err){
			console.log(err);
		} else{
			if (foundEmployee){
				if (foundEmployee.password ===  password){
					loggininEmp = foundEmployee.email;
					// CHANGING THE LOGIN STATUS TO 1
					Employee.updateOne({username: loggininEmp}, {"isActive": 1}, function(err){
						if (err){
							console.log(err);
						} else{
							console.log("Logged in Successfully");
						}
					});
					res.render("welcome");
				}
			}
		}
	});
});

//SIGNUP PAGE
app.get("/signup", function(req,res){
	res.render("signup");
});

app.post("/signup", function(req,res){
	const newEmployee = new Employee({
		email: req.body.username ,
		password: req.body.password ,
		empCode: req.body.empcode ,
		empName: req.body.empname ,
		isActive: 1
	});
	newEmployee.save(function(err){
		if (err){
			console.log(err);
		} else{
			res.render("welcome");
		}
	});
});

//WELCOME PAGE
app.get("/welcome", function(req,res){
	res.render("welcome");
});


//LOGOUT PAGE
app.get("/logout", function(req,res){
	res.render("home");
	Employee.updateOne({username: loggininEmp}, {"isActive": 0}, function(err){
		if (err){
			console.log(err);
		} else{
			console.log("Logged out Successfully");
		}
	});
});

//ADD USER
app.get("/add", function(req,res){
	res.render("add");
});

app.post("/add",function(req,res){
	const newEmployee = new Employee({
		email: req.body.username ,
		password: req.body.password ,
		empCode: req.body.empcode ,
		empName: req.body.empname ,
		isActive: 0
	});
	newEmployee.save(function(err){
		if (err){
			console.log(err);
		} else{
			res.render("welcome");
		}
	});
});

//DELETE USER
app.get("/delete", function(req,res){
	res.render("delete");
});

app.post("/delete", function(req,res){
	const empcode = req.body.empcode;
	const mail = req.body.username;
	Employee.deleteOne({email: mail}, function(err){
		if(err){
			console.log(err);
		} else{
			console.log("Successfully Deleted");
			res.render("welcome");
		}
	});
});

//update user
app.get("/update",function(req,res){
	res.render("update");
});

app.post("/update",function(req,res){
	if (loggininEmp === req.body.username){
		status = 1;
	}
	else{
		status = 0;
	}
	const empcode = req.body.empcode;
	Employee.findOne({empCode: empcode},function(err, foundEmployee){
		if (err){
			alert("Employee not found");
		} else{
			if (foundEmployee){
				res.render("update1", 
				{empname: foundEmployee.empName,
					empcode: foundEmployee.empCode,
					empemail: foundEmployee.email,
					emppassword: foundEmployee.password
				});
			}
		}
	});
	/*Employee.replaceOne({email: req.body.username},
	{empCode: req.body.empcode, empName: req.body.empname, email: req.body.username, password: req.body.password, isActive: status},
	function(err){
		if (err){
			console.log(err);
		} else{
			res.render("welcome");
		}
	}
	);*/
});

app.post("/update1", function(req,res){
	if (loggininEmp === req.body.username){
		status = 1;
	}
	else{
		status = 0;
	}
	Employee.replaceOne({email: req.body.username},
	{empCode: req.body.empcode, empName: req.body.empname, email: req.body.username, password: req.body.password, isActive: status},
	function(err){
		if (err){
			console.log(err);
		} else{
			res.render("welcome");
		}
	}
	)
});

app.listen(3000,function(req,res){
	console.log('Server started at port 3000');
});