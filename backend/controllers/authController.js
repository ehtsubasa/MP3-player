import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const signup = async (req, res) => {
    try {
        const {name, password, confirmPassword} = req.body;
        // check if name was enterd
        if(!name) {
            return res.status(400).json({error: 'Name is required'})
        };

        //check if password is good 
        if (!password || password.length < 6) {
            return res.status(400).json({error: 'Password is required and should be at least 6 characters long'})
        };

        //check matching passwords
        if (password !== confirmPassword) {
            return res.status(400).json({error: 'Passwords do not match'})
        }

        // check email
        const exist = await User.findOne({name})
        if (exist) {
            return res.status(400).json({error: 'Name is already taken'})
        }

        // hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Save the user to Databas
        const newUser = new User({
            name,
            password: hashedPassword
        })
        try {
            await newUser.save();
            generateTokenAndSetCookie(newUser._id, newUser.name, res)
            return res.status(201).json({
                id: newUser._id,
                name: newUser.name
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({error: "Fail to save to database"})
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal Server Error"})
    }
}

export const login = async (req, res) => {
    try {
        const {name, password} = req.body;
        const user = await User.findOne({name});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || '');
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({error: 'Invalid name or password'})
        }

        generateTokenAndSetCookie(user._id, user.name, res);
        res.status(201).json({
            id: user._id,
            name: user.name,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: 0, httpOnly: true, sameSite: 'strict' });
        res.status(200).json({})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}
