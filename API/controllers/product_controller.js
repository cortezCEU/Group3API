const database = require('../models/connection_db');
const product_model = require('../models/product_model');

const addProduct = (req, res, next) => {
  let prodName = req.body.name;
  let prodQty = req.body.qty;
  let prodSize = req.body.size;
  let prodColor = req.body.color;
  let prodDesc = req.body.desc;
  let prodPrice = req.body.price;
  let prodBrand = req.body.brand;

  if (
    prodName == "" ||
    prodName == null ||
    prodQty == "" ||
    prodQty == null ||
    prodSize == "" ||
    prodSize == null ||
    prodColor == "" ||
    prodColor == null ||
    prodDesc == "" ||
    prodDesc == null ||
    prodPrice == "" ||
    prodPrice == null ||
    prodBrand == "" ||
    prodBrand == null
  ) {
    res.status(404).json({
      successful: false,
      message: "All fields should be provided.",
    });
  } else {
    let query = `SELECT prodID FROM product_tbl WHERE prodName = '${prodName}'`;

    database.db.query(query, (err, rows, result) => {
      if (err) {
        res.status(500).json({
          successful: false,
          message: err,
        });
      } else {
        if (rows.length > 0) {
          res.status(400).json({
            successful: false,
            message: "Product name already exists.",
          });
        } else {
          // Set prodStatus to "NotAvail" by default
          let insertQuery = `INSERT INTO product_tbl (prodName, prodQty, prodSize, prodColor, prodDesc, prodBrand, prodPrice, prodStatus) VALUES (?, ?, ?, ?, ?, ?, ?, 'NotAvail')`;
          let productValues = [
            prodName,
            prodQty,
            prodSize,
            prodColor,
            prodDesc,
            prodBrand,
            prodPrice,
          ];

          database.db.query(
            insertQuery,
            productValues,
            (err, rows, result) => {
              if (err) {
                res.status(500).json({
                  successful: false,
                  message: err,
                });
              } else {
                res.status(200).json({
                  successful: true,
                  message: "Successfully added a new product!",
                });
              }
            }
          );
        }
      }
    });
  }
};

const viewProductbyname = (req, res, next) => {
  const prodName = req.body.name;
  let query = `SELECT * FROM product_tbl WHERE prodName = '${prodName}'`;

  database.db.query(query, (err, rows, result) => {
      if (err) {
          res.status(500).json({
              successful: false,
              message: err
          });
      } else {
          const products = rows.map(row => ({
              prodName: row.prodName,
              prodColor: row.prodColor,
              prodDesc: row.prodDesc,
              prodPrice: row.prodPrice,
              prodQty: row.prodQty,
              prodSize: row.prodSize,
              prodBrand: row.prodBrand,
              prodID: row.prodID,
              
          }));

          res.status(200).json({
              successful: true,
              message: "Successfully retrieved the product details",
              data: products
          });
      }
  });
};
      
 
const viewProductbycolor = (req, res, next) => {
  const prodColor = req.body.color;
  let query = `SELECT * FROM product_tbl WHERE prodColor = '${prodColor}'`;

  database.db.query(query, (err, rows, result) => {
      if (err) {
          res.status(500).json({
              successful: false,
              message: err
          });
      } else {
          const products = rows.map(row => ({
              prodColor: row.prodColor,
              prodDesc: row.prodDesc,
              prodPrice: row.prodPrice,
              prodQty: row.prodQty,
              prodSize: row.prodSize,
              prodBrand: row.prodBrand,
              prodID: row.prodID,
              prodName: row.prodName
          }));

          res.status(200).json({
              successful: true,
              message: "Successfully retrieved the product details",
              data: products
          });
      }
  });
};
      
const viewProductbysize = (req, res, next)=>{
  const prodSize = req.body.size;
  let query = `SELECT * FROM product_tbl WHERE prodSize = '${prodSize}'`;

  database.db.query(query, (err, rows, result) => {
      if (err) {
          res.status(500).json({
              successful: false,
              message: err
          });
      } else {
          const products = rows.map(row => ({
              prodSize: row.prodSize,
              prodColor: row.prodColor,
              prodDesc: row.prodDesc,
              prodPrice: row.prodPrice,
              prodQty: row.prodQty,
              prodBrand: row.prodBrand,
              prodID: row.prodID,
              prodName: row.prodName
          }));

          res.status(200).json({
              successful: true,
              message: "Successfully retrieved the product details",
              data: products
          });
      }
  });
};

const viewProductbybrand = (req, res, next)=>{
  const prodBrand = req.body.brand;
  let query = `SELECT * FROM product_tbl WHERE prodBrand = '${prodBrand}'`;

  database.db.query(query, (err, rows, result) => {
      if (err) {
          res.status(500).json({
              successful: false,
              message: err
          });
      } else {
          const products = rows.map(row => ({
              prodBrand: row.prodBrand,
              prodSize: row.prodSize,
              prodColor: row.prodColor,
              prodDesc: row.prodDesc,
              prodPrice: row.prodPrice,
              prodQty: row.prodQty,
              prodID: row.prodID,
              prodName: row.prodName
          }));

          res.status(200).json({
              successful: true,
              message: "Successfully retrieved the product details",
              data: products
          });
      }
  });
};
                 
const updateProductName = (req, res, next) => {
            const prodID = req.params.id; // Retrieve product ID from URL path
            const prodName = req.body.name;
          
            if (prodID == "" || prodID == null || prodName == "" || prodName == null) {
              res.status(400).json({
                successful: false,
                message: "Product name is missing",
              });
            } else {
              let query = `SELECT prodID FROM product_tbl WHERE prodID = '${prodID}'`;
              database.db.query(query, (err, rows, result) => {
                if (err) {
                  res.status(500).json({
                    successful: false,
                    message: err,
                  });
                } else {
                  if (rows.length > 0) {
                   let updateQuery = `UPDATE product_tbl SET prodName = '${prodName}' WHERE prodID = ${prodID}`;
          
                    database.db.query(updateQuery, (err, rows, result) => {
                      if (err) {
                        res.status(500).json({
                          successful: false,
                          message: err,
                        });
                      } else {
                        res.status(200).json({
                          successful: true,
                          message: "Successfully updated product name",
                        });
                      }
                    });
                  } else {
                    res.status(404).json({
                      successful: false,
                      message: "Product name does not exist.",
                    });
                  }
                }
              });
            }
          };
const updateProductSize = (req, res, next) => {
            const prodID = req.params.id; // Retrieve product ID from URL path
            const prodSize = req.body.size;
          
            if (prodID == "" || prodID == null || prodSize == "" || prodSize == null) {
              res.status(400).json({
                successful: false,
                message: "Enter the proper size!",
              });
            } else {
              let query = `SELECT prodID FROM product_tbl WHERE prodID = '${prodID}'`;
              database.db.query(query, (err, rows, result) => {
                if (err) {
                  res.status(500).json({
                    successful: false,
                    message: err,
                  });
                } else {
                  if (rows.length > 0) {
                   let updateQuery = `UPDATE product_tbl SET prodSize = '${prodSize}' WHERE prodID = ${prodID}`;
          
                    database.db.query(updateQuery, (err, rows, result) => {
                      if (err) {
                        res.status(500).json({
                          successful: false,
                          message: err,
                        });
                      } else {
                        res.status(200).json({
                          successful: true,
                          message: "Successfully updated product size",
                        });
                      }
                    });
                  } else {
                    res.status(404).json({
                      successful: false,
                      message: "Product size does not exist.",
                    });
                  }
                }
              });
            }
          };
const updateProductColor = (req, res, next) => {
            const prodID = req.params.id; // Retrieve product ID from URL path
            const prodColor = req.body.color;
          
            if (prodID == "" || prodID == null || prodColor == "" || prodColor == null) {
              res.status(400).json({
                successful: false,
                message: "Enter the color!",
              });
            } else {
              let query = `SELECT prodID FROM product_tbl WHERE prodID = '${prodID}'`;
              database.db.query(query, (err, rows, result) => {
                if (err) {
                  res.status(500).json({
                    successful: false,
                    message: err,
                  });
                } else {
                  if (rows.length > 0) {
                   let updateQuery = `UPDATE product_tbl SET prodColor = '${prodColor}' WHERE prodID = ${prodID}`;
          
                    database.db.query(updateQuery, (err, rows, result) => {
                      if (err) {
                        res.status(500).json({
                          successful: false,
                          message: err,
                        });
                      } else {
                        res.status(200).json({
                          successful: true,
                          message: "Successfully updated product color",
                        });
                      }
                    });
                  } else {
                    res.status(404).json({
                      successful: false,
                      message: "Product color does not exist.",
                    });
                  }
                }
              });
            }
          };
const updateProductDesc = (req, res, next) => {
            const prodID = req.params.id; // Retrieve product ID from URL path
            const prodDesc = req.body.desc;
          
            if (prodID == "" || prodID == null || prodDesc == "" || prodDesc == null) {
              res.status(400).json({
                successful: false,
                message: "Enter a description!",
              });
            } else {
              let query = `SELECT prodID FROM product_tbl WHERE prodID = '${prodID}'`;
              database.db.query(query, (err, rows, result) => {
                if (err) {
                  res.status(500).json({
                    successful: false,
                    message: err,
                  });
                } else {
                  if (rows.length > 0) {
                   let updateQuery = `UPDATE product_tbl SET prodDesc = '${prodDesc}' WHERE prodID = ${prodID}`;
          
                    database.db.query(updateQuery, (err, rows, result) => {
                      if (err) {
                        res.status(500).json({
                          successful: false,
                          message: err,
                        });
                      } else {
                        res.status(200).json({
                          successful: true,
                          message: "Successfully updated product description",
                        });
                      }
                    });
                  } else {
                    res.status(404).json({
                      successful: false,
                      message: "Product description does not exist.",
                    });
                  }
                }
              });
            }
          };
 const deleteProduct = (req, res, next) => {
            const prodID = req.params.id;
        
            if (prodID == "" || prodID == null) {
                res.status(400).json({
                    successful: false,
                    message: "Product ID is missing"
                });
            } else {
                let searchQuery = `SELECT prodID, prodStatus FROM product_tbl WHERE prodID = '${prodID}'`;
        
                database.db.query(searchQuery, (err, rows) => {
                    if (err) {
                        res.status(500).json({
                            successful: false,
                            message: err
                        });
                    } else {
                        if (rows.length > 0) {
                            const product = rows[0];
                            const prodStatus = product.prodStatus;
        
                            if (prodStatus === "Available") {
                                let deleteQuery = `DELETE FROM product_tbl WHERE prodID = ${prodID}`;
        
                                database.db.query(deleteQuery, (err, rows, result) => {
                                    if (err) {
                                        res.status(500).json({
                                            successful: false,
                                            message: err
                                        });
                                    } else {
                                        res.status(200).json({
                                            successful: true,
                                            message: "Successfully deleted the product.",
                                            status: "Available"
                                        });
                                    }
                                });
                            } else {
                                res.status(400).json({
                                    successful: false,
                                    message: "Product is not available for deletion.",
                                    status: prodStatus
                                });
                            }
                        } else {
                            res.status(400).json({
                                successful: false,
                                message: "Product ID does not exist"
                            });
                        }
                    }
                });
            }
        };
    

module.exports = {
    addProduct,
    updateProductName,
    updateProductSize,
    updateProductColor, 
    updateProductDesc, 
    deleteProduct,
    viewProductbyname,
    viewProductbycolor,
    viewProductbysize,
    viewProductbybrand
    

}