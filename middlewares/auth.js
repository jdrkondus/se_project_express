const token = authorization.replace("Bearer ", "");

payload = jwt.verify(token, JWT_SECRET);
req.user = { _id: payload._id };
next();
try {
  jwt.verify(token, JWT_SECRET);
} catch (err) {
  res.status(401).send({ message: "Authorization required" });
}
;

module.exports = auth;