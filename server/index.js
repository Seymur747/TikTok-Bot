const express = require("express");
const app = express();
const bp = require("body-parser");
const axios = require("axios");
const NodeCache = require("node-cache");
const user = require("./models/User");
const cache = new NodeCache();
const clipboard = require("copy-paste");
const url = "https://business-api.tiktok.com/open_api/v1.2/pixel/track/";
const token = "c1a451578ad5f83d43b32e8ca73b926da44d18b1";
const request = {
  pixel_code: "C984CMRC77U9N0P98CA0",
  event: "AddPaymentInfo",
  context: {
    ad: {
      callback: "",
    },
    user: {
      external_id: "",
    },
    ip: "",
    user_agent: "",
  },
};

app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
app.get("/", async (req, res) => {
  try {
    const ttclid = req.query.ttclid;
    let user_id;
    if (!ttclid)
      return res.json({ status: false, message: "ttclid is reqiured" });
    const id = await cache.get("user_id");
    if (id) {
      user_id = id;
      user.update({ ttclid }, { where: { id } });
    } else {
      user_id = await CreateUser(ttclid);
    }
    cache.set("user_id", user_id);
    clipboard.copy(user_id);
  } catch (e) {
    res.json({ status: false, message: "something went wrong" });
  }
  res.json({ message: "success", statsus: true });
});
app.post("/api", async (req, res) => {
  const id = req.body.id;
  let redirect;
  if (!id) return res.json({ status: false, message: "id is required" });
  try {
    const datas = await user.findOne({ raw: true, where: { id } });
    if (!datas)
      return res.json({ status: false, message: "ttclid not finded" });
    const ttclid = datas.ttclid;
    request.context.user.external_id = id;
    request.context.ad.callback = ttclid;
    request.context.user_agent = req.get("User-Agent");
    request.context.ip = "static";
    redirect = await axios.post(url, request, {
      headers: {
        "Access-Token": token,
      },
    });
  } catch (e) {
    console.log(e);

    return res.json({ status: false, message: "something went wrong" });
  }
  res.send(redirect.data);
});

const CreateUser = async (ttclid) => {
  const new_user = await user.create({ ttclid });
  return new_user.id;
};

app.listen(3000, () => console.log("server started"));
