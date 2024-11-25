async function validateApiKey(req, res, next) {
    const apiKey = req.query.key || req.headers["x-api-key"];
    if (!apiKey) {
      return res.status(403).json({ error: "Missing API key" });
    }
    // Mock validation logic for example purposes
    if (apiKey === "valid_api_key") {
      return next();
    } else {
      return res.status(403).json({ error: "Invalid API key" });
    }
  }
  
  module.exports = validateApiKey; // Ensure this exports correctly
  