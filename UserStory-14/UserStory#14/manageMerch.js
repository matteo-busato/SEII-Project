const merchList = [{title: 'T-shirt',id: "00",description: "none",qty: "100",cost: "5.35",owner: "beatles"},
                   {title: 'Cap',id: "11",description: "none",qty: "50",cost: "10.25",owner: "beatles"},
                   {title: 'Sticker',id: "22",description: "none",qty: "250",cost: "1.10",owner: "beatles"}
];

//add new product
//URI : /api/v1/artists/:name/merch
const addNewProduct = (req, res) => {
    let reqName = req.params.name;

    // verify identity of artits
    let found = false;
    merchList.forEach(element => {
        if (element.owner == reqName) {
            found = true;
        }
    });
    if (!found) {
        res.status(400).json({ error: 'artist name does not match owner' });
        return;
    }

    let product = {
        title: req.body.title,
        id: parseInt(req.body.id),
        description: req.body.description,
        qty: parseInt(req.body.qty),
        cost: parseFloat(req.body.cost),
        owner: req.body.owner
    };
    let check = checkDataValidity(product);
    if (!check) {
        res.status(400).json({ error: 'error on the data of the given product' });
        return;
    } else {
        found = false;
        merchList.forEach(element => {
            if (element.id == product.id) {
                found = true;
            }
        });
        if (found) {
            res.status(400).json({ error: 'there is already a product with this ID in the db' });
            return;
        }

        merchList.push(product);
        res.status(201).json({ message: 'the product has been correctly inserted in the db' });
    }
};

//delete product
//URI : /api/v1/artists/:name/merch/:id
const deleteProduct = (req, res) => {
    let reqName = req.params.name;

    // verify identity of artits
    let found = false;
    merchList.forEach(element => {
        if (element.owner == reqName) {
            found = true;
        }
    });
    if (!found) {
        res.status(400).json({ error: 'artist name does not match owner' });
        return;
    }

    found = false;
    let id = req.params.id;
    let index = 0;
        for (index; index < merchList.length && !found; index++) {
            if (merchList[index].id == id) {
                found = true;
                index = index - 1;
            }
        }
        if (!found) {
            res.status(400).json({ error: 'this product is not present in the db' });
            return;
        }
        merchList.splice(index, 1);
        res.status(201).json({ message: 'the product has been correctly deleted from the db' });
};

//change the product data
//URI : /api/v1/artists/:name/merch/:id
const changeProductData = (req, res) => {
    let reqName = req.params.name;

    // verify identity of artits
    let found = false;
    merchList.forEach(element => {
        if (element.owner == reqName) {
            found = true;
        }
    });
    if (!found) {
        res.status(400).json({ error: 'artist name does not match owner' });
        return;
    }

        let newData = {
            title: req.body.title,
            id: parseInt(req.body.id),
            description: req.body.description,
            qty: parseInt(req.body.qty),
            cost: parseFloat(req.body.cost),
            owner: req.body.owner
        };
        let check = checkDataValidity(newData);
        if (!check) {
            res.status(400).json({ error: 'error on the new data of the given product' });
            return;
        } else {
            found = false;
            let id = req.params.id;
            let index = 0;
                for (index; index < merchList.length && !found; index++) {
                    if (merchList[index].id == id && merchList[index].owner == newData.owner) {
                        found = true;
                        index = index - 1;
                    }
                }
            if (!found) {
                res.status(400).json({ error: 'this product is not present in the db' });
                return;
            }
            merchList[index].title = newData.title;
            //merchList[index].id = newData.id; //id must be the same
            merchList[index].description = newData.description;
            merchList[index].qty = newData.qty;
            merchList[index].cost = newData.cost;
            //merchList[index].owner = newData.owner; //owner must be the same
            res.status(201).json({ message: 'the product data has been correctly changed in the db' });
        }
};

const checkDataValidity = (product) => {
    if (!product.title || typeof product.title != 'string') {
        return false;
    }
    if (isNaN(product.id)) {
        return false;
    }
    if (!product.description || typeof product.description != 'string') {
        return false;
    }
    if (isNaN(product.qty)) {
        return false;
    }
    if (isNaN(product.cost)) {
        return false;
    }
    if (!product.owner || typeof product.owner != 'string') {
        return false;
    }
    return true;
}

module.exports = {
    addNewProduct,
    deleteProduct,
    changeProductData
};
