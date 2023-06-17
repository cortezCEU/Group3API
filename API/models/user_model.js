const user_model = (username, password, firstname, lastname, email, contact,status)=>{
    
    let User = {
        userName: username,
        userstatus:status,
        passWord: password,
        firstName: firstname,
        lastName: lastname,
        eMail: email,
        contactNo: contact
    }

    return User
}

module.exports = {user_model}