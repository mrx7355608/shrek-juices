export default function (req, res, next) {
  const user = req.user;
  if (user) {
    user.password = undefined;
    user.__v = undefined;
  }

  res.locals.user = user;
  return next();
}
