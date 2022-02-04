/**
 * @fileoverview Here's a demo schema that I used in another project.
 * @author Chris Koehne <cdkoehne@gmail.com>
 */

const mongoose = require("mongoose");

// const cartProductSchema = require("./CartProduct");
 
const orderSchema = new mongoose.Schema({
  // note that you can have messages if the schema is missing a parameter
  userId: { type: mongoose.Schema.Types.ObjectId, required: [true, 'userId required!'] },
  customer: { type: String, required: [true, 'customer name required!'] },
  address: { type: String, required: [true, 'address required!'] },

  // you can also have validators if you want to do it in the schema
  phone: { type: String, required: true, validate: /^\d{10}$/},
  email: { type: String, required: true, validate: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/},

  // nested schemas are possible
  products: { type: [cartProductSchema], required: [true, 'product(s) required!'], default: undefined,
    validate: {
      validator: function(products) {
        return !(products.length < 1);  
      }, 
      message: props => `${props.value} You need at least ONE product!`
    }
  },
  comments: { type: String, default: ""},
  paymentCollected: { type: Boolean, required: true, default: false },
  
}, { timestamps: true }); //automatically turns on timestamps for database products


const Order = mongoose.model("Order", orderSchema);

module.exports = Order;