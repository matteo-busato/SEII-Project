var users = [
    { 
        name: "John",
        email: "John@gmail.com",
        password: "saodna"
    },
    {
        name: "Ric",
        email: "ric@gmail.com",
        password: "dic9jao"
    }    
]


function checkEmail(email){
    re = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    
    if(re.test(email))
        return true;
    else 
        return false;
}

const postRegister = (req, res) => {
    console.log(req.body);
    let data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    if(!data.name || typeof data.name != 'string'){
        res.status(400).json({ error: "The field 'name' must be a non-empty string"});
        return;
    }

    if(!data.email || typeof data.email != 'string' ){
        res.status(400).json({ error: "The field 'email' must be a non-empty string"});
        return;
    }

    if(!checkEmail(data.email)){
        res.status(400).json({ error: "Invalid email format"});
        return;
    }

    if(!data.password || typeof data.password != 'string'){
        res.status(400).json({ error: "The field 'password' must be a non-empty string"});
        return;
    }

    //Use DB here
    for(var user of users){
        if(user.email == data.email){
            res.status(409).json({ error: "This email is already registered"});
            return;
        }
    }

    users.push(data);

    res.status(201).json({ message : "User registered successfully" });
    console.log(users);

};

module.exports = {
    postRegister
};