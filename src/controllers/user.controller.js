import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {

    console.log("came to controller", req.body);
    //GET DETAILS FROM FRONTEND
    const { fullName, username, email, password } = req.body;
    // VALIDATIONS
    if([fullName, username, email, password].some(field => !field?.trim())){
        throw new ApiError(400, "All fields are required", [])
    }
    if(password.length < 6){
        throw new ApiError(400, "Password must be at least 6 characters long", [])
    }
    if(!email.includes("@")){
        throw new ApiError(400, "Email is invalid", [])
    }
    //CHECK IF USER EXISTS: username, email
    const EXISTS = await User.findOne({ $or: [{ email }, { username }] });
    if (EXISTS) {
        throw new ApiError(409, "User already exists", [])
    }

    console.log("validations passed", req.files)

    //UPLOAD AVATAR AND COVER PICTURE
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverPictureLocalPath = req.files?.coverPicture[0]?.path;

    console.log("avatarLocalPath", avatarLocalPath);
    console.log("coverPictureLocalPath", coverPictureLocalPath);
    if(!avatarLocalPath){
        throw new ApiError("Avatar is required", 400)
    }
    const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
    const coverPictureUrl = await uploadOnCloudinary(coverPictureLocalPath);

    console.log("avatarUrl", avatarUrl?.url);
    console.log("coverPictureUrl", coverPictureUrl?.url);
    if(!avatarUrl?.url){
        throw new ApiError("Avatar file is required", 400)
    }
    //HASH PASSWORD
    // const hashedPassword = await bcrypt.hash(password, 10);
    //CREATE USER
    const user = await User.create({
        fullName,
        username: username?.trim()?.toLowerCase(),
        email,
        avatar: avatarUrl?.url,
        coverPicture: coverPictureUrl?.url || "",
        password
    });

    const userFromDB = await User.findById(user._id).select("-password -refreshToken");
    if(!userFromDB){
        throw new ApiError("Something went wrong while creating user", 500)
    }

    //GENERATE TOKEN
    // const token = user.generateToken();
    //SEND RESPONSE
    res.status(201).json(new ApiResponse(userFromDB, "User registered successfully", 201));
});

export default registerUser;
