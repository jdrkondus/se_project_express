const token = authorization.replace("Bearer ", "");

payload = jwt.verify(token, JWT_SECRET);
req.user = { _id: payload._id };
next();
} catch (err) {
res.status(401).send({ message: "Authorization required" });
}
} else {
res.status(401).send({ message: "Authorization required" });
}
};

module.exports = auth;