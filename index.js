const http = require('http');
const fs = require('fs');
const IP = "127.0.0.1";
const port = "8000";
const url = require('url');
// replaceTemplate functons import from modules folder.
// In require function '.' means the current location of the module like that ${__dirname}. But require function '.' is used.
const replaceTemplate = require('./modules/replaceTemplate');



const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8');
const tempCart = fs.readFileSync(`${__dirname}/templates/product-cart.html`,'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);



const server = http.createServer(function(req, res){

    // console.log(req.url);
    // console.log(url.parse(req.url,true)); 

    // Here object destructuring is also used.
    const {query,pathname} = url.parse(req.url,true);

    if(pathname === "/" || pathname === "/overview"){
        res.writeHead(200,{"Content-Type": "text/html"});

        // I want to make a array of products. Here Carthtml is this array.
        // I take one by one product from dataObj and replace it into tempCart.
        // Without join() Carthtml is a array of html element. But if we use join() then it will be a big string of html elements.
        const Carthtml = dataObj.map(ele => replaceTemplate(tempCart, ele)).join('');

        // We have replace {%PRODUCT_CART%} placeholder by Carthtml.
        const output = tempOverview.replace('{%PRODUCT_CART%}',Carthtml);
        res.end(output);
    }
    else if(pathname === "/product"){
        res.writeHead(200,{"Content-Type": "text/html"});
        const produ = dataObj[query.id];
        const result = replaceTemplate(tempProduct,produ);
        res.end(result);
    }
    else{
        res.writeHead(404,{"Content-Type": "text/html"});
        res.end("<h1>404 Not Found</h1>");
    }

});

server.listen(port,IP,() => {
    console.log("listening on port " + port);
});