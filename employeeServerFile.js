let express = require("express");
let app = express();
const cors = require("cors");
app.use(cors());
const {Client} = require("pg");
const client = new Client({
    user: "postgres",
    password: "Emppass@29Emp",
    database: "postgres",
    port : 5432,
    host: "db.vrucyhvjhlblswdcrsch.supabase.co",
    ssl:{rejectUnauthorized:false},
});
client.connect(function(res,error){
    console.log(`Connected!!!`);
});
app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Orgin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

const port = process.env.PORT||2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

app.get("/svr/mobiles",function(req,res,next){
    let ram = req.query.ram;
    let rom = req.query.rom;
    let brand = req.query.brand;
    let os = req.query.os;

    


        let query = "Select * FROM mobiles";
        client.query(query,function(err,result){
            if(err) console.log(err);
            else {
                
                if (ram)
                {
                    result.rows = result.rows.filter(ele=>ele.ram===ram);
            }
             if(rom){
                result.rows = result.rows.filter(ele=>ele.rom===rom);
            }
             if(os){
                result.rows = result.rows.filter(ele=>ele.os===os);
            }
            if(brand){
                result.rows = result.rows.filter(ele=>ele.brand===brand);
            }
            if(!ram&&!rom&&!os&&!brand)
             {
                result.rows= result.rows;
             }
            
            res.send(result.rows);
        }
    })
})


app.get("/svr/mobiles/:name",function(req,res,next){
    let name = req.params.name;
    const query  = `Select * FROM mobiles`;
    client.query(query,function(err,result){
        if(err) res.status(404).send("No Mobile found");
        else {
            let arr = result.rows.find(ele=>ele.name===name);
            res.send(arr);
        }
    // client.end();
    })
    
    
});

app.post("/svr/mobiles",function(req,res,next){
    var values = Object.values(req.body);
    // let connection = mysql.createConnection(connData);
    let query  = `INSERT INTO mobiles(name,price,brand,ram,rom,os) VALUES($1,$2,$3,$4,$5,$6)`;
    client.query(query,values,function(err,result){
        if(err) console.log(err);
        else {
        let query2  = "Select * FROM mobiles";
    client.query(query2,function(err,result){
        if(err) console.log(err);
        else res.send(result.rows);
    })
    }
    })
   
});

app.put("/svr/mobiles/:name",function(req,res,next){
    let name = req.params.name;
    let values =[req.body.price,req.body.brand,req.body.ram,req.body.rom,req.body.os,name]
    // let connection = mysql.createConnection(connData);
    let query  = `UPDATE mobiles SET price=$1,brand=$2,ram=$3,rom=$4,os=$5 WHERE name=$6`;
    client.query(query,values,function(err,result){
        if(err) {res.status(400).send(err);}
        
        res.send('${result.rowCount} updation successful');
    
    })
});


app.delete("/svr/mobiles/:name",function(req,res,next){
    let name = req.params.name;
    let query  = `Delete from mobiles where name='${name}'`;
    client.query(query,function(err,result){
        if(err) res.send(err);
        else {
        
        res.send('Successfully Deleted');
        }
            
    });

});


