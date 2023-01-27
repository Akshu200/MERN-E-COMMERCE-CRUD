import express from "express";
import { product } from "../db/Product.js";
import { user } from "../db/User.js";
import Jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("working app e-commerce 123");
});

router.post("/register", async (req, resp) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await user.findOne({ email: email });
    if (userExist) {
      return resp.status(422).json({ error: "Email already exist" });
    } else {
      let userss = new user({ name, email, password });
      let result = await userss.save();
      result = result.toObject();
      delete result.password;

      console.log(result);

      Jwt.sign(
        { result },
        process.env.JWTKEY,
        { expiresIn: "2h" },
        (err, token) => {
          if (err) {
            resp.send("something went wrong");
          }
          resp.send({ result, auth: token });
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, resp) => {
  try {
    if (req.body.email && req.body.password) {
      let find = await user.findOne(req.body).select("-password");
      if (find) {
        Jwt.sign(
          { find },
          process.env.JWTKEY,
          { expiresIn: "2h" },
          (err, token) => {
            if (err) {
              resp.send("something went wrong");
            }
            resp.send({ find, auth: token });
          }
        );
      } else {
        resp.send({ message: "No result found" });
      }
    } else {
      resp.send(" Plz Fill E-mail and Password.");
    }
  } catch (error) {
    console.log("Credintials error");
  }
});

router.post("/addproduct", verifytoken, async (req, resp) => {
  let result = new product(req.body);
  let final = await result.save();
  resp.send(final);
});

router.get("/products", verifytoken, async (req, resp) => {
  let result = await product.find();
  {
    product.length > 0 ? resp.send(result) : resp.send("No Result Found");
  }
});

router.delete("/product/:id", verifytoken, async (req, resp) => {
  const result = await product.deleteOne({ _id: req.params.id });
  resp.send(result);
});

router.get("/product/:id", verifytoken, async (req, resp) => {
  const result = await product.findOne({ _id: req.params.id });
  resp.send(result);
});

router.put("/product/:id", verifytoken, async (req, resp) => {
  let result = await product.updateOne(
    {
      _id: req.params.id,
    },
    {
      $set: req.body,
    }
  );
  resp.send(result);
});

router.get("/search/:key", verifytoken, async (req, resp) => {
  const result = await product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
    ],
  });

  resp.send(result);
});

// function verify
function verifytoken(req, resp, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    Jwt.verify(token, process.env.JWTKEY, (err, valid) => {
      if (err) {
        resp.status(401).send({ result: "Please Provide Valid Token" });
      } else {
        next();
      }
    });
  } else {
    resp.status(403).send({ result: "Please add token headers" });
  }
}

export default router;
