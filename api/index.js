const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

mongoose
  .connect(
    // "mongodb+srv://nguyencongtuanuit:congtuan@cluster0.5os0kco.mongodb.net/",
    "mongodb+srv://nguyencongtuanuit:congtuan@cluster0.5os0kco.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongooDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongooDB", error);
  });

app.listen(port, () => {
  console.log("Sever is running on port 8000");
});

const User = require("./models/user");
const Order = require("./models/order");

// function to send Verification Email to the user
const sendVerificationEmail = async (email, verificationToken) => {
  // create a nodemailer transport
  const transporter = nodemailer.createTransport({
    // configure the email service
    service: "gmail",
    auth: {
      user: "nguyencongtuanuit@gmail.com",
      pass: "gegh xedd ybyd wsry",
    },
  });

  //  compose the email message
  const mailOptions = {
    from: "amazon.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email : http://localhost:8000/verify/${verificationToken}`,
  };

  //  send the email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending verification email", error);
  }
};

// endpoint to register in the app
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if the email is already register
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // create a new user
    const newUser = new User({ name, email, password });

    // generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // save the user to the database
    await newUser.save();

    // debugging statement to verify data
    console.log("New user registed: ", newUser);

    // send verification email to the user
    sendVerificationEmail(newUser.email, newUser.verificationToken);
    res.status(201).json({
      message:
        "Registration successfull. Please check your email for verification",
    });
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ message: "Registration failed!" });
  }
});

// endpoint to verify the email
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    // find the user with the given verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    // mark the user as verified
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email verification Failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

// endpoint to login the user!
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // generate a token
    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login Failed" });
  }
});

// endpoint to store a new address to the backend
app.post("/addresses", async (req, res) => {
  try {
    const { userId, address } = req.body;

    // find the user by UserId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // add the new address to the user's addresses array
    user.addresses.push(address);

    // save the updated user in the backend
    await user.save();

    res.status(200).json({ message: "Address created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding address" });
  }
});

// endpoint to get all the addresses a particular user
app.get("/addresses/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addresses = user.addresses;
    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ message: "Error retrieveing the address" });
  }
});

// endpoint to store all the orders
app.post("/orders", async (req, res) => {
  try {
    const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } =
      req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // create an array of product object from cartItems
    const products = cartItems.map((item) => ({
      name: item?.title,
      quantity: item.quantity,
      price: item.price,
      image: item?.image,
    }));

    // create a new order
    const order = new Order({
      user: userId,
      products: products,
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
    });

    await order.save();

    res.status(200).json({ message: "Order created successfully!" });
  } catch (error) {
    console.log("Error creating orders: ", error);
    res.status(500).json({ message: "Error creating orders" });
  }
});

// get the user profile
app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the user profile" });
  }
});

app.get("/orders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ user: userId }).populate("user");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

//
app.put("/orders/:orderId/products/:productId", async (req, res) => {
  try {
    const { orderId, productId } = req.params;

    // Tìm đơn hàng bằng orderId
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    // In ra các sản phẩm trước khi xóa
    console.log("Products before delete:", order.products);

    // Tìm sản phẩm cần xóa
    const productToDelete = order.products.find(
        (product) => product._id.toString() === productId
    );

    if (!productToDelete) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    // Lọc ra sản phẩm cần xóa
    order.products = order.products.filter(
        (product) => product._id.toString() !== productId
    );

    // Cập nhật lại totalPrice
    order.totalPrice -= productToDelete.price * productToDelete.quantity;

    // In ra các sản phẩm sau khi xóa
    console.log("Products after delete:", order.products);

    if (order.products.length === 0) {
      // Nếu không còn sản phẩm nào, xóa đơn hàng
      await Order.findByIdAndDelete(orderId);
      return res
          .status(200)
          .json({ message: "Đơn hàng đã được xóa thành công" });
    } else {
      // Lưu đơn hàng đã được cập nhật
      await order.save();
      return res
          .status(200)
          .json({
            message: "Sản phẩm đã được xóa khỏi đơn hàng thành công",
            order,
          });
    }
  } catch (error) {
    console.log("Lỗi khi cập nhật đơn hàng: ", error);
    res.status(500).json({ message: "Lỗi khi cập nhật đơn hàng" });
  }
});

