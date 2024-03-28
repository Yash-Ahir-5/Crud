const bcrypt = require('bcrypt')
const { QueryTypes } = require('sequelize')
const sequelize = require("../models")

const getAllUsers = async () => {
    try {
        const users = await sequelize.query("SELECT * FROM users", {
            type: QueryTypes.SELECT
        });
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};


const fetchUsers = async (req, res) => {
    try {
        const users = await sequelize.query("Select * from users LEFT JOIN department ON users.department_id = department.department_id", {
            type: QueryTypes.SELECT
        });
        return res.status(200).json(users)    
    } catch (error) {
        return res.status(500).json({message: error.message})    
    }
    
}

// const insertUsers = async (req, res) => {
//     const users = await sequelize.query("INSERT INTO Users (firstname, lastname, email, password, gender, hobbies, department_id) VALUES ('Yash', 'Ahir', 'yash5@gmail.com', 'yashahir1', 'Male', 'Cricket, Coding', 1)", {
//         type: QueryTypes.INSERT
//     });
//     const users1 = await sequelize.query("Select * from users", {
//         type: QueryTypes.SELECT
//     });
//     // res.send("Query Executed");
//     res.status(200).json({ users: users1 })
// }

const insertUsers = async (req, res) => {
    const { firstname, lastname, email, password, gender, hobbies, department_id } = req.body; // assuming you're passing user data in the request body

    try {
        await sequelize.query(`
            INSERT INTO Users 
            (firstname, lastname, email, password, gender, hobbies, department_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, {
            replacements: [firstname, lastname, email, password, gender, hobbies, department_id],
            type: QueryTypes.INSERT
        });

        // Call the function to fetch all users
        const users = await getAllUsers(); 

        res.status(200).json({message: "User inserted successfully" , users: users});
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: "Failed to insert user" });
    }
}

// const updateUser = async (req, res) => {
//     const { id } = req.params; // Assuming the ID is passed as a URL parameter
//     const { firstname, lastname, email, password, gender, hobbies, department_id } = req.body;

//     try {
//         await sequelize.query(`
//             UPDATE Users
//             SET firstname = ?, lastname = ?, email = ?, password = ?, gender = ?, hobbies = ?, department_id = ?
//             WHERE id = ?
//         `, {
//             replacements: [firstname, lastname, email, password, gender, hobbies, department_id, id],
//             type: QueryTypes.UPDATE
//         });

//         res.status(200).json({ message: "User updated successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to update user" });
//     }
// };

const updateUser = async (req, res) => {
    const { id } = req.params; // Extract user ID from URL parameter
    const { firstname, lastname, email, password, gender, hobbies, department_id } = req.body;

    try {
        await sequelize.query(`
            UPDATE Users
            SET firstname = ?, lastname = ?, email = ?, password = ?, gender = ?, hobbies = ?, department_id = ?
            WHERE id = ?
        `, {
            replacements: [firstname, lastname, email, password, gender, hobbies, department_id, id],
            type: QueryTypes.UPDATE
        });

        // Call the function to fetch all users
        const users = await getAllUsers(); 

        res.status(200).json({ message: "User updated successfully" , users: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update user" });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params; // Extract user ID from URL parameter
    try {
        const user = await sequelize.query("SELECT * FROM users WHERE id = ?", {
            replacements: [id],
            type: QueryTypes.SELECT
        });

        if (user.length === 0) {
            throw new Error("User not found");
        }

        res.status(200).json({ message: "User fetched successfully" , users: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params; // Extract user ID from URL parameter
    try {
        await sequelize.query(`
        UPDATE users
        SET deleted_user = true
        WHERE id = ?
        `, {
            replacements: [id],
            type: QueryTypes.UPDATE
        });

        const users = await sequelize.query("SELECT * FROM users WHERE deleted_user = false", {
            type: QueryTypes.SELECT
        });

        res.status(200).json({ message: "User deleted successfully", users: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete user" });
    }
}

const insertLoginUser = async (req, res) => {
    const { username,password } = req.body; // assuming you're passing user data in the request body

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
        await sequelize.query(`
        INSERT INTO Login 
        (username,password) 
        VALUES (?, ?)
        `, {
            replacements: [username, hashedPassword], // Use hashed passwordn
            type: QueryTypes.INSERT
        });

        res.status(200).json({message: "User inserted successfully"});
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: "Failed to insert user || Username already registered" });
    }
}

const checkLoginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch user from the database based on the provided username
        const user = await sequelize.query(`
            SELECT * FROM Login 
            WHERE username = ?
        `, {
            replacements: [username],
            type: QueryTypes.SELECT
        });

        if (user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(password, user[0].password);
        console.log(passwordMatch)

        if (passwordMatch) {
            res.status(200).json({ message: "Successfully Logged In" });
        } else {
            res.status(401).json({ error: "Invalid Username or Password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to login" });
    }
};

module.exports = {
    fetchUsers,
    insertUsers,
    updateUser,
    getUserById,
    deleteUser,
    insertLoginUser,
    checkLoginUser
}