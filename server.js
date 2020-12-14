const express = require( "express" );
const bodyParser = require('body-parser');
const mysql = require( 'mysql' );

const PORT = process.env.PORT || 8080;
const app = express();

class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args=[] ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
  }
// at top INIT DB connection
const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Root1234",
    database: "food_truck"
  });


// to serve static content from the 'html' directory
app.use(express.static('html'));
// needed for POST FORM decoding
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(PORT, function() {
    console.log(`App running on: http://localhost:${PORT}`);
  });


// our previous routes
app.get( '/api/menu', async function( req, res ){
    // pull menu items
    const myItems = await db.query( "SELECT * FROM items" );
    //console.log( `[/api/item] sending back list: `, myItems );

    res.send( myItems );
})


app.get( '/api/order/:id', async function( req, res ){

    const myItems = await db.query( `SELECT * FROM items WHERE item_code=?`,[ req.params.id] );
    console.log( `[/api/item] sending back list: `, myItems );
    res.send( myItems );
})
