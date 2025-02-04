const userRepository = require("../repositories/userRepository");

// ✅ Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
      return res
        .status(400)
        .json({ error: "Missing required fields: name, email" });
    }

    const newUser = await userRepository.createUser({ name, email });
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// ✅ Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate input
    if (!id) {
      return res
        .status(400)
        .json({ error: "User ID is required in request params" });
    }

    const user = await userRepository.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};

// ✅ Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};
