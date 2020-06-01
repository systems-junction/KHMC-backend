const express = require('express');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const cors = require('cors');
const WebSocketServer = require("websocket").server;
const cron = require("node-cron");
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

let connection = null;

dotenv.config({ path: './config/.env' });

connectDB();

// Route files
const auth = require('./routes/auth');
const item = require('./routes/item');
const vendor = require('./routes/vendor');
const buInventory = require('./routes/buInventory');
const buRepRequest = require('./routes/buRepRequest');
const functionalUnit = require('./routes/functionalUnit');
const buReturn = require('./routes/buReturn');
const businessUnit = require('./routes/businessUnit');
const buStockInLog = require('./routes/buStockInLog');
const buStockOutLog = require('./routes/buStockOutLog');
const buRepRequestDetails = require('./routes/buRepRequestDetails');
const systemAdmin = require('./routes/systemAdmin');
const staffType = require('./routes/staffType');
const staff = require('./routes/staff');
const warehousePRPO = require('./routes/warehousePRPO');
const warehousePODetails = require('./routes/wPODetails');
const warehouseInventory = require('./routes/warehouseInventory');
const warehouseInventoryLog = require('./routes/warehouseInventoryLog');
const purchaseRequest = require('./routes/purchaseRequest');
const purchaseOrder = require('./routes/purchaseOrder');
const receiveItem = require('./routes/receiveItem');
const materialReceiving = require('./routes/materialReceiving');
const shippingTerm = require('./routes/shippingTerm');

const app = express();


app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());


// Enable CORS
app.use(cors());

// Auth routes
const { protect } = require('./middleware/auth');

app.use(protect);

// Mount routers
app.use('/api/auth', auth);
app.use('/api/item', item);
app.use('/api/vendor', vendor);
app.use('/api/buinventory', buInventory);
app.use('/api/bureprequest', buRepRequest);
app.use('/api/functionalunit', functionalUnit);
app.use('/api/bureturn', buReturn);
app.use('/api/businessunit', businessUnit);
app.use('/api/bustockinlog', buStockInLog);
app.use('/api/bustockoutlog', buStockOutLog);
app.use('/api/bureprequestdetails', buRepRequestDetails);
app.use('/api/systemadmin', systemAdmin);
app.use('/api/stafftype', staffType);
app.use('/api/staff', staff);
app.use('/api/warehouseprpo', warehousePRPO);
app.use('/api/warehousepodetails', warehousePODetails);
app.use('/api/warehouseinventory', warehouseInventory);
app.use('/api/warehouseinventorylog', warehouseInventoryLog);
app.use('/api/purchaserequest', purchaseRequest);
app.use('/api/purchaseorder', purchaseOrder);
app.use('/api/receiveitem', receiveItem);
app.use('/api/materialreceiving', materialReceiving);
app.use('/api/shippingterm', shippingTerm);

app.use(errorHandler);

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));



const PORT = process.env.PORT || 8080;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});


 // pass the server object to the WebSocketServer library to do all the job, this class will override the req/res 
 const websocket = new WebSocketServer({
  "httpServer": server
})


// when a legit websocket request comes listen to it and get the connection .. once you get a connection thats it! 
websocket.on("request", request=> {

  connection = request.accept(null, request.origin)
  connection.on("open", () => console.log("Opened!!!"))
  connection.on("close", () => console.log("CLOSED!!!"))
  connection.on("message", message => {
    console.log(`Received message ${message.utf8Data}`)
    if(message.utf8Data === 'add_vendor'){
      setTimeout(function(){
        connection.send(message.utf8Data);
      }, 500);
    }else{
      connection.send(`got your message: ${message.utf8Data}`);
    }
  })

  // use connection.send to send stuff to the client 
  sendevery5seconds();
})

function sendevery5seconds(){
  connection.send(`Message ${Math.random()}`);
  setTimeout(sendevery5seconds, 10000);
}

// schedule tasks to be run on the server
// * * * * * *
// | | | | | |
// | | | | | day of week
// | | | | month
// | | | day of month
// | | hour
// | minute
// second ( optional )
cron.schedule("10 * * * *", function() {
  console.log("running a task every 10 minutes");
});
