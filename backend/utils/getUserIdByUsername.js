const User = require("../models/user_model"); // Import the User model

/**
 * Function to fetch user ID based on username.
 * @param {string} username - The username of the user.
 * @returns {string} - The user ID.
 */
const getUserIdByUsername = async (username) => {
  try {
    // Query the User model by username
    const user = await User.findOne({ username: username });

    if (!user) {
      throw new Error("User not found");
    }

    // Return the user ID
    return user._id;
  } catch (err) {
    console.error("Error fetching user ID:", err.message);
    throw err;
  }
};

module.exports = getUserIdByUsername;
