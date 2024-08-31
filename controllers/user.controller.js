import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'; // Ensure jwt is imported

const JWT_SECRET = "SaiSiri@19"; // Ideally, this should come from environment variables

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = jwt.sign(
      { _id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" } // Adding an expiration time for security
    );

    return { accessToken };
  } catch (error) {
    console.error("Error generating access token:", error.message); // Log error message
    throw new ApiError(500, `Something went wrong while generating access token`);
  }
};

const registerUser = asyncHandler(async (req, resp) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => !field.trim())) {
    throw new ApiError(400, `All fields are required`);
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existedUser) {
    throw new ApiError(409, `User with email and password already exists`);
  }

  const user = await User.create({ username, email, password });

  const createdUser = await User.findById(user._id).select("-password");

  return resp
    .status(201)
    .json(new ApiResponse(201, createdUser, `User registered successfully`));
});

const loginUser = asyncHandler(async (req, resp) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, `Username and password are required`);
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(400, `User does not exist`);
  }

  const isPasswordCheck = await user.isPasswordCorrect(password);

  if (!isPasswordCheck) {
    throw new ApiError(401, `Invalid Password`);
  }

  const { accessToken } = await generateAccessToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password");

  return resp.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        access_token: accessToken
      },
      `User logged in successfully`
    )
  );
});

export { registerUser, loginUser };
