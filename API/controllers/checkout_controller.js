const database = require('../models/connection_db')
const checkoutModel = require('../models/checkout_model')


const createCheckOut = (req, res, next) => {
    let cartID = req.body.cid;
    let userName = req.body.username;
    let mode_payment = req.body.modeofpayment;
    let address1 = req.body.address;
    let ordStat = req.body.orderstatus;
  
    if (
      userName == "" ||
      userName == null ||
      mode_payment == "" ||
      mode_payment == null ||
      cartID == "" ||
      cartID == null ||
      address1 == null ||
      address1 == "" ||
      ordStat == null ||
      ordStat == ""
    ) {
      return res.status(400).json({
        successful: false,
        message: "All fields are required",
      });
    }
  
    const allowedPayments = ["COD", "Gcash", "Maya", "Credit/Debit Card"];
    if (!allowedPayments.includes(mode_payment)) {
      return res.status(400).json({
        successful: false,
        message: "Invalid mode of payment! Please select one of the available options: COD, Gcash, Maya, or Credit/Debit Card",
      });
    }
  
    let checkCartQuery = `SELECT cartID FROM addtocart_tbl WHERE cartID = ${cartID}`;
    database.db.query(checkCartQuery, (checkCartErr, checkCartRows) => {
      if (checkCartErr) {
        return res.status(500).json({
          successful: false,
          message: checkCartErr,
        });
      } else {
        if (checkCartRows.length === 0) {
          return res.status(404).json({
            successful: false,
            message: "Cart ID does not exist.",
          });
        } else {
          let now = new Date();
          let options = { timeZone: "Asia/Manila" };
          let order_date = now.toLocaleString("en-PH", options);
  
          let insertQuery = `INSERT INTO checkout_tbl SET ?`;
          let checkoutObj = checkoutModel.checkout_model(
            cartID,
            userName,
            mode_payment,
            order_date,
            address1,
            ordStat,
            null
          ); // Pass null for orderID since it will be auto-incremented
  
          database.db.query(insertQuery, checkoutObj, (insertErr, insertRows) => {
            if (insertErr) {
              return res.status(500).json({
                successful: false,
                message: insertErr,
              });
            } else {
              // Empty cart data after successful checkout
              let deleteCartQuery = `DELETE FROM addtocart_tbl WHERE cartID = ${cartID}`;
              database.db.query(deleteCartQuery, (deleteCartErr, deleteCartResult) => {
                if (deleteCartErr) {
                  return res.status(500).json({
                    successful: false,
                    message: deleteCartErr,
                  });
                } else {
                  return res.status(200).json({
                    successful: true,
                    message: "Successful checkout!",
                    checkout: checkoutObj,
                  });
                }
              });
            }
          });
        }
      }
    });
  };
const updateStatus = (req, res, next)=>{
    let orderID = req.params.oid;
    let ordStat= req.body.orderstatus;

    if(orderID== "" || orderID == null || ordStat == "" || ordStat == null){
        res.status(404).json({
            successful: false,
            message: "All fields required"
        })
    }
    else{
        if(ordStat == "Pending" || ordStat== "Packed" || ordStat == "Shipping" || ordStat== "Delivered"){
            let query = `SELECT orderID  FROM checkout_tbl WHERE orderID  = '${orderID }'`
            database.db.query(query,(err, rows, result)=>{
            if (err){
                res.status(500).json({
                    successful: false,
                    message: err
                })
            }
            else{
                if (rows.length > 0) {
                    let updateQuery = `UPDATE checkout_tbl SET ordStat = "${ordStat}" WHERE orderID= '${orderID}'`

                    database.db.query(updateQuery,(err, rows, result)=>{
                        if (err){
                            res.status(500).json({
                                successful: false,
                                message: err
                            })
                        }
                        else{
                            res.status(200).json({
                                successful: true,
                                message: "Order status has been updated!"
                            })
                        }
                    })
                }
                else{
                    res.status(400).json({
                        successful: false,
                        message: "Order doesn't exist."
                    })
                }
            }
            })
        }
        else{
            res.status(404).json({
                successful: false,
                message: "The available status are Pending, Packed, Shipping, Delivered, and Cancelled only"
            })
        }
        
    }
}

const viewAllOrder = (req, res, next)=>{
    let username = req.params.uN
    if(username == "" || username == null){
        res.status(404).json({
            successful:false,
            message: "Insert username!"
        })
    }
    else{
        let query = `SELECT * FROM checkout_tbl WHERE username = "${username}"`
        database.db.query(query, (err, rows, result)=>{
            if(err){
                res.status(500).json({
                    successful:false,
                    message:err
                })
            }
            else{
                if (rows.length > 0) {
                    res.status(200).json({
                        successful: true,
                        message: "Showing all orders of " + username + ".",
                        data: rows
                    })
                }
                else{
                    res.status(400).json({
                        successful: false,
                        message: "Username doesn't exists!"
                    })
                }
            }
        })
    }
}
const cancelOrder = (req, res, next) => {
    let orderID = req.params.oid;
  
    if (orderID == "" || orderID == null) {
      res.status(400).json({
        successful: false,
        message: "Order ID is missing",
      });
    } else {
      let query = `SELECT ordStat FROM checkout_tbl WHERE orderID = '${orderID}'`;
  
      database.db.query(query, (err, rows) => {
        if (err) {
          res.status(500).json({
            successful: false,
            message: err,
          });
        } else {
          if (rows.length > 0) {
            let orderStatus = rows[0].ordStat;
  
            // Check if order status allows cancellation
            const allowedStatus = ["Packed", "Shipping", "Delivered"];
            if (allowedStatus.includes(orderStatus)) {
              res.status(400).json({
                successful: false,
                message: "Order status does not allow cancellation",
              });
            } else {
              let updateQuery = `UPDATE checkout_tbl SET ordStat = 'Canceled' WHERE orderID = ${orderID}`;
  
              database.db.query(updateQuery, (err, rows, result) => {
                if (err) {
                  res.status(500).json({
                    successful: false,
                    message: err,
                  });
                } else {
                  res.status(200).json({
                    successful: true,
                    message: "Successfully canceled the order",
                  });
                }
              });
            }
          } else {
            res.status(400).json({
              successful: false,
              message: "Order ID doesn't exist",
            });
          }
        }
      });
    }
  };

module.exports = {
    createCheckOut, updateStatus, viewAllOrder, cancelOrder 
}