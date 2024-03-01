/* Here we are going to define a model for our products. Basically, it is what a product will
 * look like in our application
 */
const mongoose = require('mongoose');


/* Now, we are going to define the schema(The products's structure). Every product must follow
 * this structure
 */
const productSchema = mongoose.Schema({
    //Defines id property as a long encoded set of characters
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    price: {type: String, required: true}
});

//Makes a schema model template available for other modules
module.exports = mongoose.model('Product', productSchema);