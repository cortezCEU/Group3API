const database = require('../models/connection_db')
const userModel = require('../models/user_model')
const bcrypt = require('bcryptjs')

const createUser = async (req, res, next) => {
    let userName = req.body.username;
    let passWord = req.body.password;
    let firstName = req.body.firstname;
    let lastName = req.body.lastname;
    let eMail = req.body.email;
    let contactNo = req.body.contact;

    if (
        userName == "" ||
        userName == null ||
        passWord == "" ||
        passWord == null ||
        firstName == "" ||
        firstName == null ||
        lastName == "" ||
        lastName == null ||
        eMail == "" ||
        eMail == null ||
        contactNo == "" ||
        contactNo == null
    ) {
        res.status(400).json({
            successful: false,
            message: "All fields required"
        });
    } else {
        let searchQuery = `SELECT userName FROM usershop_tbl WHERE userName = '${userName}'`;

        database.db.query(searchQuery, async (err, rows, result) => {
            if (err) {
                res.status(500).json({
                    successful: false,
                    message: err
                });
            } else {
                if (rows.length == 0) {
                    // Password restriction: 8 letters, 2 numbers, 1 special character
                    const passwordRegex = /^(?=.*[A-Za-z]{8,})(?=.*\d{2,})(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/;
                    if (!passwordRegex.test(passWord)) {
                        res.status(400).json({
                            successful: false,
                            message: "Invalid password format. It must contain at least 8 letters, 2 numbers, and 1 special character."
                        });
                        return; // Stop execution
                    }

                    // Email restriction: Valid domain format
                    const validDomains = ["@gmail.com", "@yahoo.com"];
                    const emailDomain = eMail.slice(eMail.lastIndexOf("@"));
                    if (!validDomains.includes(emailDomain)) {
                        res.status(400).json({
                            successful: false,
                            message: "Invalid email domain"
                        });
                        return; // Stop execution
                    }

                    // Contact restriction: +63 format
                    const contactRegex = /^\+63\d{10}$/;
                    if (!contactRegex.test(contactNo)) {
                        res.status(400).json({
                            successful: false,
                            message: "Invalid contact number. It must be in the format +63xxxxxxxxxx."
                        });
                        return; // Stop execution
                    }

                    let insertQuery = `INSERT INTO usershop_tbl SET ?`;
                    let hashedPassword = await bcrypt.hash(passWord, 11);
                    let userInfo = userModel.user_model(
                        userName,
                        hashedPassword,
                        firstName,
                        lastName,
                        eMail,
                        contactNo,
                        "Active" // Set user status as "Active"
                    );

                    database.db.query(insertQuery, userInfo, (err, rows, result) => {
                        if (err) {
                            res.status(500).json({
                                successful: false,
                                message: err
                            });
                        } else {
                            res.status(200).json({
                                successful: true,
                                message: "Account Created Successfully"
                            });
                        }
                    });
                } else {
                    res.status(500).json({
                        successful: false,
                        message: "Username Already EXISTS!"
                    });
                }
            }
        });
    }
};
const loginUser = async (req, res, next) => {
    const userName = req.body.username;
    const passWord = req.body.password;

    if (userName == "" || userName == null || passWord == "" || passWord == null) {
        res.status(400).json({
            successful: false,
            message: "All fields required"
        });
    } else {
        const searchQuery = `SELECT userName, passWord FROM usershop_tbl WHERE userName = '${userName}'`;

        database.db.query(searchQuery, async (err, rows) => {
            if (err) {
                res.status(500).json({
                    successful: false,
                    message: err.message
                });
            } else {
                if (rows.length > 0) {
                    const data = rows[0];
                    const isPasswordMatch = await bcrypt.compare(passWord, data.passWord);

                    if (isPasswordMatch) {
                        res.status(200).json({
                            successful: true,
                            message: "Successfully logged in!"
                        });
                    } else {
                        res.status(400).json({
                            successful: false,
                            message: "Incorrect credentials!"
                        });
                    }
                } else {
                    res.status(404).json({
                        successful: false,
                        message: "Username does not exist!"
                    });
                }
            }
        });
    }
};


const updateUser = (req, res, next) => {
    let currentPassword = req.body.currentPassword;
    let newPassword = req.body.newPassword;
    let userName = req.params.username;

    if (
        currentPassword == "" ||
        currentPassword == null ||
        newPassword == "" ||
        newPassword == null ||
        userName == "" ||
        userName == null
    ) {
        res.status(400).json({
            successful: false,
            message: "All fields required"
        });
    } else {
        let searchQuery = `SELECT userName, passWord FROM usershop_tbl WHERE userName = '${userName}'`;

        database.db.query(searchQuery, async (err, rows) => {
            if (err) {
                res.status(500).json({
                    successful: false,
                    message: err.message
                });
            } else {
                if (rows.length > 0) {
                    const data = rows[0];
                    const isPasswordMatch = await bcrypt.compare(currentPassword, data.passWord);

                    if (isPasswordMatch) {
                        const hashedPassword = await bcrypt.hash(newPassword, 11);

                        let updateQuery = `UPDATE usershop_tbl SET passWord = '${hashedPassword}' WHERE userName = '${userName}'`;

                        database.db.query(updateQuery, (err, rows, result) => {
                            if (err) {
                                res.status(500).json({
                                    successful: false,
                                    message: err
                                });
                            } else {
                                res.status(200).json({
                                    successful: true,
                                    message: "Successfully updated the password"
                                });
                            }
                        });
                    } else {
                        res.status(400).json({
                            successful: false,
                            message: "Incorrect current password"
                        });
                    }
                } else {
                    res.status(404).json({
                        successful: false,
                        message: "User doesn't exist"
                    });
                }
            }
        });
    }
};

const deleteUser = (req, res, next) => {
    let userName = req.params.username;

    if (userName == "" || userName == null) {
        res.status(400).json({
            successful: false,
            message: "Username is missing"
        });
    } else {
        let searchQuery = `SELECT userName, userstatus FROM usershop_tbl WHERE userName = '${userName}'`;

        database.db.query(searchQuery, (err, rows) => {
            if (err) {
                res.status(500).json({
                    successful: false,
                    message: err
                });
            } else {
                if (rows.length > 0) {
                    const user = rows[0];
                    if (user.userstatus) {
                        let deleteQuery = `DELETE FROM usershop_tbl WHERE userName = '${userName}'`;

                        database.db.query(deleteQuery, (err, result) => {
                            if (err) {
                                res.status(500).json({
                                    successful: false,
                                    message: err
                                });
                            } else {
                                res.status(200).json({
                                    successful: true,
                                    message: "Successfully deleted the active user."
                                });
                            }
                        });
                    } else {
                        res.status(400).json({
                            successful: false,
                            message: "User is not active!"
                        });
                    }
                } else {
                    res.status(400).json({
                        successful: false,
                        message: "Username does not exist!"
                    });
                }
            }
        });
    }
};

module.exports = {
    createUser,
    loginUser,
    deleteUser,
    updateUser
}