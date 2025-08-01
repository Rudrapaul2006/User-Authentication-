import User from "../Models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


//user register :
export let userResgister = async (req, res) => {
    let { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.json({
            massage: "All fields are required ..",
            success: false
        })
    }

    // Check valid role before user creation
    if (role !== "user" && role !== "admin") {
        return res.json({
            massage: "Role must be 'admin' or 'user'",
            success: false
        });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.json({
                massage: "user already exists ..",
                success: false
            })
        }

        let hashedpassword = await bcrypt.hash(password, 10);
        user = await User.create({ name, email, password: hashedpassword, role });

        let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1D" });
        res.cookie("token", token);

        return res.json({
            massage: "User Created ...",
            user: user,
            success: true
        })

    } catch (error) {
        console.error(error);
    }
}


//user login :
export let userLogin = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.json({
            massage: "All fields are required",
            success: false
        })
    }

    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.json({
                massage: "User Not Exists ..",
                success: false
            })
        }

        let cheakpassword = await bcrypt.compare(password, user.password);
        if (!cheakpassword) {
            return res.json({
                massage: "password not matched ...",
                success: false
            })
        }

        let token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1D" });
        res.cookie("token", token);


        return res.json({
            massage: "User Created ..",
            user: user,
            success: true
        })

    } catch (error) {
        console.error(error);
    }
}


//User Profile Update by id : 
export let userUpdate = async (req, res) => {
    try {
        let token = req.cookies.token;
        if (!token) {
            return res.json({
                message: "Token Not Found ..",
                success: false
            })
        }

        let decoded = jwt.verify(token, process.env.JWT_SECRET)
        let user = await User.findById(decoded.id);
        if (!user) {
            return res.json({
                message: "User Not Found ..",
                success: false
            })
        }

        let { name, email } = req.body;
        if (name === "" || email === "") {
            return res.json({
                massage: "User and email must be provided ..",
                success: false
            })
        }

        if (name) user.name = name;
        if (email) user.email = email;
        user.save();

        return res.json({
            massage: "User Updated successfully ..",
            updateduser: user,
            success: true
        })

    } catch (error) {
        console.error(error);
        return res.json({
            message: "Internal server error",
            success: false
        });
    }
};


//Get user profile :
export let userProfile = async (req, res) => {

    try {
        let token = req.cookies.token;
        if (!token) {
            return res.json({
                massage: "Token not found ..",
                success: false
            })
        }

        let decoded = await jwt.verify(token, process.env.JWT_SECRET)
        let user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.json({
                massage: "User not found ..",
                success: false
            })
        }

        return res.json({
            massage: "User profile fetched successfully ..",
            user: user,
            success: false
        })

    } catch (error) {
        console.error(error);

    }

}


// User LogOut :
export let userLogout = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(400).json({
                message: "User already logged out or token not found",
                success: false
            });
        }

        res.clearCookie("token");

        return res.status(200).json({
            message: "User logged out successfully",
            success: true
        });

    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


//user profile deleted :
export let userDelete = async (req, res) => {
    try {
        let token = req.cookies.token;
        if (!token) {
            return res.json({
                message: "Token Not Found ..",
                success: false
            })
        }

        let decoded = jwt.verify(token, process.env.JWT_SECRET)
        let user = await User.findByIdAndDelete(decoded.id);
        if (!user) {
            return res.json({
                message: "User Not Found ..",
                success: false
            })
        }

        return res.json({
            massage: "User Deleted successfully ..",
            deleteduser: { name: user.name, email: user.email },
            success: true
        })

    } catch (error) {
        console.error(error);
        return res.json({
            message: "Internal server error",
            success: false
        });
    }
};



//Get all User's Profile :
export let getAllProfile = async (req, res) => {
    try {
        let token = req.cookies.token;
        if (!token) {
            return res.json({
                massage : "Token Not availavle or token got expired ...",
                success : false
            })
        }
        let decoded = jwt.verify(token, process.env.JWT_SECRET)
        let user = await User.findById(decoded.id);

        if (user.role === "user"){
            return res.json({
                massage : "User can't fetched , profile's .. (Only Admin's can)",
                success : false 
            })
        }
        if (!user || user.role !== "admin") {
            res.json({
                massage: "user not found ..",
                success: false
            })
        } 

        let users = await User.find().select("-password");

        if(!users){
            return res.json({
                massage : "Profile not fetched successfully ...",
                success : false
            })
        }

        return res.json({
            massage: "User's profile's fetched successfully ...",
            users : users,
            success: true
        })
    } catch (error) {
        console.error(error);
    }
}