import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {

    //GET DETAILS FROM FRONTEND
    const { fullName, username, email, password, avatar, coverPicture } = req.body;
    //VALIDATIONS
    if([fullName, username, email, password, avatar, coverPicture].some(field => !field?.trim())){
        throw new ApiError(`${field} is required`, 400)
    }
    if(password.length < 6){
        throw new ApiError("Password must be at least 6 characters long", 400)
    }
    if(!email.includes("@")){
        throw new ApiError("Email is invalid", 400)
    }
    //CHECK IF USER EXISTS: username, email
    const EXISTS = await User.findOne({ $or: [{ email }, { username }] });
    if (EXISTS) {
        throw new ApiError("User already exists", 409)
    }

    //UPLOAD AVATAR AND COVER PICTURE
    const avatarLocalPath = req.file?.avatar[0]?.path;
    const coverPictureLocalPath = req.file?.coverPicture[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError("Avatar is required", 400)
    }
    const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
    const coverPictureUrl = await uploadOnCloudinary(coverPictureLocalPath);

    if(!avatarUrl){
        throw new ApiError("Avatar file is required", 400)
    }
    //HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);
    //CREATE USER
    const user = await User.create({
        fullName,
        username: username?.trim()?.toLowerCase(),
        email,
        avatar: avatarUrl?.url,
        coverPicture: coverPictureUrl?.url || "",
        password: hashedPassword
    });

    const userFromDB = await User.findById(user._id).select("-password -refreshToken");
    if(!userFromDB){
        throw new ApiError("Something went wrong while creating user", 500)
    }

    //GENERATE TOKEN
    // const token = user.generateToken();
    //SEND RESPONSE
    res.status(200).json({ message: "User registered successfully", user });
});

export default registerUser;
