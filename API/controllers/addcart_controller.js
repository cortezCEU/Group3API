const database = require('../models/connection_db')
const addtocart_model = require('../models/addtocart_model'); 

const addtocartProduct = (req, res, next) => {
  let userName = req.body.username;
  let products = req.body.products;

  if (userName == "" || userName == null || products.length === 0) {
    res.status(400).json({
      successful: false,
      message: "Username or product details are not defined.",
    });
    return;
  }

  // Fetch the available quantity for each product
  let prodIDs = products.map((product) => product.id);
  let prodIDString = prodIDs.join(',');

  let quantityQuery = `SELECT prodID, prodQty FROM product_tbl WHERE prodID IN (${prodIDString})`;

  database.db.query(quantityQuery, (quantityErr, quantityRows) => {
    if (quantityErr) {
      res.status(500).json({
        successful: false,
        message: quantityErr,
      });
    } else {
      let availableQuantities = {};
      quantityRows.forEach((row) => {
        availableQuantities[row.prodID] = row.prodQty;
      });

      // Check if the requested quantity is available for each product
      let invalidProducts = [];
      products.forEach((product) => {
        if (product.addqty > availableQuantities[product.id]) {
          invalidProducts.push(product.id);
        }
      });

      if (invalidProducts.length > 0) {
        res.status(400).json({
          successful: false,
          message: `Insufficient quantity available for products: ${invalidProducts.join(', ')}`,
        });
      } else {
        // Update the product quantities and insert the products into the cart
        let updateCartQuery = `INSERT INTO addtocart_tbl (prodID, cart_prodQty, userName) VALUES ? ON DUPLICATE KEY UPDATE cart_prodQty = cart_prodQty + VALUES(cart_prodQty)`;
        let cartData = products.map((product) => [product.id, product.addqty, userName]);

        database.db.query(updateCartQuery, [cartData], (updateErr, updateRows) => {
          if (updateErr) {
            res.status(500).json({
              successful: false,
              message: updateErr,
            });
          } else {
            // Update the product quantities
            products.forEach((product) => {
              let updateProductQuery = `UPDATE product_tbl SET prodQty = prodQty - ? WHERE prodID = ?`;
              let updateProductData = [product.addqty, product.id];

              database.db.query(updateProductQuery, updateProductData, (updateProductErr, updateProductRows) => {
                if (updateProductErr) {
                  res.status(500).json({
                    successful: false,
                    message: updateProductErr,
                  });
                }
              });
            });

            res.status(200).json({
              successful: true,
              message: "Successfully added product(s) to the cart!",
            });
          }
        });
      }
    }
  });
};

const addtocart_viewProductbyUsername = (req, res, next) => {
  let userName = req.params.username;

  if (userName == "" || userName == null) {
    res.status(400).json({
      successful: false,
      message: "Username is not defined.",
    });
    return;
  }

  let query = `SELECT prodID, cartID, cart_prodQty FROM addtocart_tbl WHERE userName = '${userName}'`;
  database.db.query(query, (err, rows, result) => {
    if (err) {
      res.status(500).json({
        successful: false,
        message: err,
      });
    } else {
      if (rows.length === 0) {
        res.status(404).json({
          successful: false,
          message: "Details not found",
        });
      } else {
        const cartList = rows.map((row) => {
          return addtocart_model.addtocart_model(row.prodID, row.cartID, row.cart_prodQty);
        });

        res.status(200).json({
          successful: true,
          message: `Successfully got the details of product(s) with Username: ${userName}`,
          data: cartList,
        });
      }
    }
  });
};
const updateCart = (req, res, next) => {
  let cartID = req.params.cid;
  let cart_prodQty = req.body.addqty;

  if (cart_prodQty == "" || cart_prodQty == null || cartID == "" || cartID == null) {
    res.status(400).json({
      successful: false,
      message: "An information is missing",
    });
  } else {
    let query = `SELECT cartID FROM addtocart_tbl WHERE cartID = ${cartID}`;

    database.db.query(query, (err, rows, result) => {
      if (err) {
        res.status(500).json({
          successful: false,
          message: err,
        });
      } else {
        if (rows.length > 0) {
          let updateQuery = `UPDATE addtocart_tbl SET  cart_prodQty = '${cart_prodQty}' WHERE cartID = ${cartID}`;

          database.db.query(updateQuery, (err, rows, result) => {
            if (err) {
              res.status(500).json({
                successful: false,
                message: ProductID,
              });
            } else {
              res.status(200).json({
                successful: true,
                message: "Successfully updated the cart",
              });
            }
          });
        } else {
          res.status(400).json({
            successful: false,
            message: "Cart ID does not exist.",
          });
        }
      }
    });
  }
};
const deleteCart = (req, res, next) => {
  let cartID = req.params.cid;

  if (cartID == "" || cartID == null) {
    res.status(404).json({
      successful: false,
      message: "Cart ID is missing.",
    });
  } else {
    let cartQuery = `SELECT cartID FROM addtocart_tbl WHERE cartID = ${cartID}`;

    database.db.query(cartQuery, (cartErr, cartRows) => {
      if (cartErr) {
        res.status(500).json({
          successful: false,
          message: cartErr,
        });
      } else {
        if (cartRows.length > 0) {
          let checkProductQuery = `SELECT prodID FROM addtocart_tbl WHERE  cartID = ${cartID}`;

          database.db.query(checkProductQuery, (checkErr, checkRows) => {
            if (checkErr) {
              res.status(500).json({
                successful: false,
                message: checkErr,
              });
            } else {
              if (checkRows.length > 0) {
                let deleteQuery = `DELETE FROM addtocart_tbl WHERE cartID = ${cartID}`;

                database.db.query(deleteQuery, (deleteErr, deleteResult) => {
                  if (deleteErr) {
                    res.status(500).json({
                      successful: false,
                      message: deleteErr,
                    });
                  } else {
                    res.status(200).json({
                      successful: true,
                      message: `Successfully deleted cart ID: ${cartID}`,
                    });
                  }
                });
              } else {
                res.status(400).json({
                  successful: false,
                  message: "Product ID does not exist in the cart.",
                });
              }
            }
          });
        } else {
          res.status(400).json({
            successful: false,
            message: "Cart ID does not exist.",
          });
        }
      }
    });
  }
};
module.exports = {
    addtocartProduct,
    addtocart_viewProductbyUsername,
    updateCart,
    deleteCart

}