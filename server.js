var express=require("express");
var app=express();
 var mysql=require('mysql');
 var bodyParser=require('body-parser');

 app.use(bodyParser.json({type:'application/json'}));
 app.use(bodyParser.urlencoded({extended:true}));

 var con=mysql.createConnection({
     host:'localhost',
     user:'root',
     password:'',
     database:'foodorder_db'
  

 });

const PORT=8080;

var server=app.listen(8080,function(){
    var host=server.address().address
    var port=server.address().port
    console.log("start");
});
con.connect(function(error){
    if(error) console.log(error);
    else console.log("Connected");
})
app.post('/login',function(req,res){
    con.query("select * from users where users.username='"+req.body.username+"' and users.password='"+req.body.password+"'",function(error,rows,fields){
        if(error) console.log(error);
        else
        {

         
            console.log(rows);
            res.send(rows);
        }
    })
});
app.get('/restaurant',function(req,res){
    con.query('select * from restaurant',function(error,rows,fields){
        if(error) console.log(error);
        else
        {
            console.log(rows);
            res.send(rows);
        }
    })
});

app.get('/menu/:id',function(req,res,next){
    var  ids=req.params.id;
       console.log(ids);
    con.query("select * from food where restaurant_id='" + req.params.id + "'",function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            next();
        }
    })
});
app.get('/category',function(req,res,next)
{
    con.query("select * from category",function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            next();
        }
    })
})
app.get('/foodcategory/:id',function(req,res,next)
{
    con.query("select * from food where food_category_id='" + req.params.id + "'",function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            next();
        }
    })
})
app.get('/food/:id',function(req,res,next){
    var  ids=req.params.id1;
    console.log("JA sam food id"+ids);
 con.query("select * from food where food_id='" + req.params.id + "'",function(error,rows,fields){
     if(error) console.log(error);
     else
     {   console.log("Radim");
         console.log(rows);
         res.send(rows);
         next();
     }
 })
});



app.post('/addcart/:customerid/:restaurantid/:id/:price',function(req,res,next){
  
    con.query("insert into cart (username,restaurant_id,food_id,quantity,price) values('"+req.params.customerid+"','"+ req.params.restaurantid + "','"+ req.params.id + "',1,'"+req.params.price+"')",function(error,result){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(result);
            res.send(result);
            next();
        }
    })
})
app.get('/cart/:id',function(req,res,next){
    con.query("select * from cart INNER JOIN food ON cart.food_id=food.food_id where username='" + req.params.id + "'",function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            next();
        }
    })
});
app.delete('/deletecart/:customerid/:foodid',function(req,res,next){
    con.query("delete from cart where username='" + req.params.customerid + "' and food_id='"+req.params.foodid+"'",function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            next();
        }
    })
})
app.post('/place-order/:customerid/:sellerid/:foodid/:shipName/:address',function(req,res,next){
    con.query("insert into orders (order_customer_username,order_seller_username,order_shipname,order_address) values('" +req.params.customerid + "','" +req.params.sellerid+ "','" +req.params.shipName + "','" +req.params.address + "')",function(error,result){

        if(error) console.log(error);
        else
        {   console.log("Radim");
        
             console.log(result);
             res.send(result);

            next();
        }
    })
    // con.connect(function(err) {
    //     if (err) throw err;
    //     var sql = "insert into orders (order_customer_username,order_seller_username,order_shipname,order_address) values('" +req.params.customerid + "','" +req.params.sellerid+ "','" +req.params.shipName + "','" +req.params.address + "')";
    //     con.query(sql, function (err, result) {
    //       if (err) throw err;
    //       console.log("1 record inserted, ID: " + result.insertId);
    //     });
});
app.post('/place-order/:amount',function(req,res,next){
    var id=req.body.cart;
    
    var food_id=[];
    var orderid;
    console.log(id.length)
     con.query("insert into orders (order_customer_username,order_seller_username,order_shipname,order_address,order_amount) values('" +req.params.customerid + "','" +req.params.sellerid+ "','" +req.params.shipName + "','" +req.params.address + "','"+req.params.amount+"')",function(error,result){
        if (error) {
    //         // handle error
        }
         else{
            console.log(result.insertId);
            orderid=result.insertId;
            for (i = 0; i < id.length; i++) 
            {
                food_id.push(id[i].food_id);
                // con.query("select food.food_name,food.food_price FROM food where food.food_id='"+id[i].food_id+"'",function(error,result){
                //  if(error)
                //  {
                                
                //  }
                // else
                // {
                                
                 con.query("insert into order_details(order_id,order_food_id) values ('"+orderid+"','"+id[i].food_id+"')",function(error,result)
                    {
                         console.log(result);
                         console.log("im working");
                    });
                 con.query("delete from cart where food_id='"+id[i].food_id+"'",function(error,result)
                 {
                     if(error)
                     {

                     }
                     else{
                         console.log("removed from cart");
                     }
                 })                
                 // }
               // });
                } 
              
               
          }
             
          });
   
});

app.get('/customer-order/:customerid',function(req,res,next)
{
    con.query("SELECT * FROM orders INNER JOIN order_details ON orders.order_id=order_details.order_id INNER JOIN food ON food.food_id=order_details.order_food_id where order_customer_username='"+req.params.customerid+"'and order_shipped='0'",function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            next();
        }
    })
})
app.get('/customer-shippedorder/:customerid',function(req,res,next)
{
    con.query("SELECT * FROM orders INNER JOIN order_details ON orders.order_id=order_details.order_id INNER JOIN food ON food.food_id=order_details.order_food_id where order_customer_username='"+req.params.customerid+"'and order_shipped='1'",function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            next();
        }
    })
})
app.get('/favorite/:customerid',function(req,res,next)
{
    con.query("SELECT * FROM favorite INNER JOIN food ON favorite.favorite_food_id=food.food_id WHERE username='"+req.params.customerid+"'",function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            next();
        }
    })
})
app.post('/addfavorite/:customerid/:foodid',function(req,res,next)
{
    con.query("insert into favorite (username,favorite_food_id) values('"+req.params.customerid + "','" +req.params.foodid+ "')",function(error,result){

        if(error) console.log(error);
        else
        {   console.log("Radim");
        
            // console.log(rows);
            // res.send(rows);

            next();
        }
    })
})
app.delete('/deletefavorite/:customerid/:foodid',function(req,res,next)
{
    con.query("Delete from favorite where username='" +req.params.customerid + "' and favorite_food_id='" +req.params.foodid+ "'",function(error,result){

        if(error) console.log(error);
        else
        {   console.log("Radim");
        
            // console.log(rows);
            // res.send(rows);

            next();
        }
    })
});

//TO DO  prebaciti sledece u novi folder/file
// app.delete('/deletefood/:restaurantid/:foodid',function(res,req,next){
//     con.query("Delete from food where restaurant_id='" +req.params.restaurantid + "' and food_id='" +req.params.foodid+ "'",function(error,result){

//         if(error) console.log(error);
//         else
//         {   console.log("Radim");
        
//             // console.log(rows);
//             // res.send(rows);

//             next();
//         }
//     })
// });
app.delete('/deletefood/:resid/:foodid',function(req,res,next)
{
    con.query("Delete from food where restaurant_id='" +req.params.resid + "' and food_id='" +req.params.foodid+ "'",function(error,result){

        if(error) console.log(error);
        else
        {   console.log("Radim");
        
            // console.log(rows);
            // res.send(rows);

            next();
        }
    })
});
app.delete('/deletecategory/:resid/:categoryid',function(req,res,next)
{
    con.query("Delete from category where restaurant_id='" +req.params.resid + "' and category_id='" +req.params.categoryid+ "'",function(error,result){

        if(error) console.log(error);
        else
        {   console.log("Radim");
        
            // console.log(rows);
            // res.send(rows);

            next();
        }
    })
});
app.get('/restaurantfood/:id',function(req,res,next){
    var  ids=req.params.id;
       console.log(ids);
    con.query("select * from food where restaurant_id='" + req.params.id + "'",function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            next();
        }
    })
});
// app.get('/seller-order/:sellerid',function(req,res,next)
// {
//     con.query("SELECT * FROM orders INNER JOIN order_details ON orders.order_id=order_details.order_id INNER JOIN food ON food.food_id=order_details.order_food_id where order_seller_username='"+req.params.sellerid+"' and order_shipped='0'",function(error,rows,fields){
//         if(error) console.log(error);
//         else
//         {   console.log("Radim");
//             console.log(rows);
//             res.send(rows);
//             next();
//         }
//     });
// app.get('/seller-shippedorder/:sellerid',function(req,res,next)
// {
//     con.query("SELECT * FROM orders INNER JOIN order_details ON orders.order_id=order_details.order_id INNER JOIN food ON food.food_id=order_details.order_food_id where order_seller_username='"+req.params.sellerid+"' and order_shipped='1'",function(error,rows,fields){
//         if(error) console.log(error);
//         else
//         {   console.log("Radim");
//             console.log(rows);
//             res.send(rows);
//             next();
//         }
//     });
// }
app.get('/seller-allorder/:sellerid',function(req,res,next)
{
    con.query("SELECT  * FROM orders  where order_seller_username='"+req.params.sellerid+"' and order_shipped='0' and order_preparation='0' and order_delivered='0'" ,function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            next();
        }
    })
});
app.get('/customer-allorder/:customerid',function(req,res,next)
{
    con.query("SELECT  * FROM orders  where order_customer_username='"+req.params.customerid+"' and order_shipped='0' and order_preparation='0'" ,function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            next();
        }
    })
});
app.get('/seller-allpreparationorder/:sellerid',function(req,res,next)
{
    con.query("SELECT  * FROM orders  where order_seller_username='"+req.params.sellerid+"' and order_shipped='0' and order_preparation='1'" ,function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            next();
        }
    })
});
app.get('/customer-allpreparationorder/:customerid',function(req,res,next)
{
    con.query("SELECT  * FROM orders  where order_customer_username='"+req.params.customerid+"' and order_shipped='0' and order_preparation='1'" ,function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            next();
        }
    })
});
app.get('/seller-alldelivery/:sellerid',function(req,res,next)
{
    con.query("SELECT  * FROM orders  where order_seller_username='"+req.params.sellerid+"' and order_shipped='1' and order_preparation='0'" ,function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            //next();
        }
    })
});
app.get('/customer-allshippedorder/:customerid',function(req,res,next)
{
    con.query("SELECT  * FROM orders  where order_customer_username='"+req.params.customerid+"' and order_shipped='1' and order_preparation='0'" ,function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            //next();
        }
    })
});
app.get('/customer-allhistoryorder/:customerid',function(req,res,next)
{
    con.query("SELECT  * FROM orders  where order_customer_username='"+req.params.customerid+"' and order_delivered='1' " ,function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            //next();
        }
    })
});
app.get('/seller-order/:sellerid/:orderid',function(req,res,next)
{
    con.query("SELECT  * FROM orders   INNER JOIN order_details ON orders.order_id=order_details.order_id INNER JOIN food ON food.food_id=order_details.order_food_id where order_seller_username='"+req.params.sellerid+"'  and order_shipped='0' and order_preparation='0' and orders.order_id='"+req.params.orderid+"'" ,function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            next();
        }
    })
});
app.get('/seller-preparationorder/:sellerid/:orderid',function(req,res,next)
{
    con.query("SELECT * FROM orders INNER JOIN order_details ON orders.order_id=order_details.order_id INNER JOIN food ON food.food_id=order_details.order_food_id where order_seller_username='"+req.params.sellerid+"'  and order_preparation='1' and orders.order_id='"+req.params.orderid+"'",function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
           // next();
        }
    })
});
app.get('/seller-shippedorder/:sellerid/:orderid',function(req,res,next)
{
    con.query("SELECT * FROM orders INNER JOIN order_details ON orders.order_id=order_details.order_id INNER JOIN food ON food.food_id=order_details.order_food_id where order_seller_username='"+req.params.sellerid+"' and order_shipped='1' and orders.order_id='"+req.params.orderid+"'",function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            next();
        }
    })
});

app.get('/restaurantcategory/:id',function(req,res,next)
{
    con.query("select * from category where restaurant_id='" + req.params.id + "'",function(error,rows,fields){
        if(error) console.log(error);
        else
        {   console.log("Radim");
            console.log(rows);
            res.send(rows);
            next();
        }
    })
})

app.post('/addcategory/:restaurantid/',function(req,res,next)
{
    con.query("insert into category (restaurant_id,category_name,category_image) values('"+req.params.restaurantid + "','" +req.body.categoryname+ "','" +req.body.categoryimage+ "')",function(error,result){

        if(error) console.log(error);
        else
        {   console.log("Radim");
        
            // console.log(rows);
            // res.send(rows);

            next();
        }
    })
})
app.post('/addfood/:restaurantid/:categoryid/:foodname/:fooddescription/:foodprice',function(req,res,next)
{
    con.query("insert into food (restaurant_id,food_category_id,food_name,food_description,food_price) values('"+req.params.restaurantid + "','" +req.params.categoryid+ "','" +req.params.foodname+ "','" +req.params.fooddescription+ "','" +req.params.foodprice+ "')",function(error,result){

        if(error) console.log(error);
        else
        {   console.log("Radim");
        
            // console.log(rows);
            // res.send(rows);

            next();
        }
    })
});
app.put('/updatefood/:foodid/',function(req,res,next)
{
    con.query("UPDATE food SET food_name='"+req.body.foodname+"' where food_id='"+req.params.foodid+"'",function(error,result){

        if(error) console.log(error);
        else
        {   console.log("Radim");
        
             console.log("OVO JE UPDATE");
            // res.send(rows);

           // next();
        }
    })
})
app.put('/updatecategory/:categoryid/',function(req,res,next)
{
    con.query("UPDATE category SET category_name='"+req.body.categoryname+"' where category_id='"+req.params.categoryid+"'",function(error,result){

        if(error) console.log(error);
        else
        {   console.log("Radim");
        
             console.log("OVO JE UPDATE");
            //res.send(rows);

          //  next();
        }
    })
})
app.put('/updateorderpreparation/:orderid',function(req,res,next)
{
    con.query("UPDATE orders SET order_preparation='1' where order_id='"+req.params.orderid+"'",function(error,result){

        if(error) console.log(error);
        else
        {   console.log("Radim");
        
             console.log("poslato u spremanje");
            // res.send(rows);

          //  next();
        }
    })
})
app.put('/updateorderarrived/:orderid',function(req,res,next)
{
    con.query("UPDATE orders SET order_delivered='1' ,order_shipped='0' where order_id='"+req.params.orderid+"'",function(error,result){

        if(error) console.log(error);
        else
        {   console.log("Radim");
        
            // console.log("sta sam update",req.params.orderid);
            // res.send(rows);

            //next();
        }
    })
})
app.put('/updateorderdelivery/:orderid',function(req,res,next)
{
    con.query("UPDATE orders SET order_preparation='0' ,order_shipped='1' where order_id='"+req.params.orderid+"'",function(error,result){

        if(error) console.log(error);
        else
        {   console.log("Radim");
        
             console.log("poslato u delivery");
            // res.send(rows);

          //  next();
        }
    })
})