//* why do i need this, is it not already covered by the errorHandler
function notFoundHandler(req, res) {
  res.status(404).json({
    error: "Route not found",
  });
}
//* are all of the params of this function needed?
function errorHandler(error, req, res, next) {
  console.error(error);

  res.status(500).json({
    error: "Internal server error",
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
