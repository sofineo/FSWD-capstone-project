const dynamoDB = require("../config/awsConfig");

// Fetch all items from a specific table
const getAllItems = async (tableName) => {
  const params = {
    TableName: tableName,
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    return data.Items;
  } catch (error) {
    console.error(`Error fetching data from ${tableName}:`, error);
    throw error;
  }
};

// Insert item into a specific table
const insertItem = async (tableName, item) => {
  const params = {
    TableName: tableName,
    Item: item,
  };

  try {
    await dynamoDB.put(params).promise();
    return { message: "Item inserted successfully!" };
  } catch (error) {
    console.error(`Error inserting data into ${tableName}:`, error);
    throw error;
  }
};

// Delete an item from a specific table
const deleteItem = async (tableName, key) => {
  const params = {
    TableName: tableName,
    Key: key,
  };

  try {
    await dynamoDB.delete(params).promise();
    return { message: "Item deleted successfully!" };
  } catch (error) {
    console.error(`Error deleting data from ${tableName}:`, error);
    throw error;
  }
};

module.exports = { getAllItems, insertItem, deleteItem };
