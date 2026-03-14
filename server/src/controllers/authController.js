// =============================
// IMPORTS
// =============================
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const Notification = require("../models/Notification");
const Project = require("../models/Project");
// =============================
// MAIL TRANSPORTER
// =============================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// =============================
// REGISTER
// =============================

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1️⃣ Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "local",
      role: role || "business",
    });

    const loginUrl = `${process.env.CLIENT_URL}/login`;

    // 5️⃣ Send Welcome Email (Same Design)
    const info = await transporter.sendMail({
      from: `"SearchMyExpert Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to SearchMyExpert 🎉",
      html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
</head>

<body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;
box-shadow:0 10px 30px rgba(0,0,0,0.05);">

<!-- HEADER -->
<tr>
<td align="center"
style="background:linear-gradient(135deg,#3b82f6,#2563eb);padding:35px;">
  <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">
    Welcome to SearchMyExpert 🚀
  </h1>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:40px 35px;">
  <h2 style="margin-top:0;color:#111827;">
    Hello ${name} 👋
  </h2>

  <p style="color:#374151;font-size:15px;line-height:1.6;">
    Your account has been successfully created.
  </p>

  <p style="color:#374151;font-size:15px;line-height:1.6;">
    <strong>Account Role:</strong> 
    <span style="
      background:#eff6ff;
      color:#3b82f6;
      padding:6px 12px;
      border-radius:6px;
      font-size:13px;
      font-weight:600;
      margin-left:6px;
    ">
      ${role}
    </span>
  </p>

  <p style="color:#374151;font-size:15px;line-height:1.6;">
    ${
      role === "expert"
        ? "You can now start offering your expertise and connect with businesses looking for professional guidance."
        : "You can now search and connect with industry experts to grow your business."
    }
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
    <tr>
      <td align="center">
        <a href="${loginUrl}"
          style="
            display:inline-block;
            padding:14px 28px;
            font-size:16px;
            color:#ffffff;
            background:linear-gradient(135deg,#3b82f6,#2563eb);
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
          ">
          Login to Your Account
        </a>
      </td>
    </tr>
  </table>

  <p style="color:#6b7280;font-size:13px;">
    If you did not create this account, please contact support.
  </p>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="background:#f9fafb;padding:20px;">
  <p style="margin:0;font-size:12px;color:#6b7280;">
    © ${new Date().getFullYear()} SearchMyExpert. All rights reserved.
  </p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
    });
    try {
      console.log("Email sent:", info);
    } catch (error) {
      console.error("MAIL ERROR:", error);
      throw error;
    }
    // 6️⃣ Rollback if email fails
    if (!info.accepted || info.accepted.length === 0) {
      await User.findByIdAndDelete(user._id);

      return res.status(400).json({
        message: "Email not deliverable",
      });
    }

    res.status(201).json({
      message: "User registered successfully.",
    });
  } catch (err) {
    res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
};

// =============================
// LOGIN
// =============================
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    };

    // JWT cookie
    res.cookie("token", token, cookieOptions);

    // Role cookie (accessible by frontend)
    res.cookie("role", user.role, {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    next(err);
  }
};
// =============================
// PROFILE
// =============================
exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// LOGOUT
// =============================
exports.logout = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  };

  // Clear JWT cookie
  res.clearCookie("token", cookieOptions);

  // Clear role cookie
  res.clearCookie("role", {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
};
// =============================
// UPDATE NAME
// =============================
exports.updateName = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.name = req.body.name || user.name;
    await user.save();

    res.status(200).json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      name,
      bio,
      location,
      website,
      skills,
      experience,
      hourlyRate,
      companyName,
      companySize,
      industry,
      avatar,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ================= COMMON FIELDS =================

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;

    if (avatar !== undefined) {
      user.avatar = avatar; // base64 image
    }

    // ================= EXPERT FIELDS =================

    if (user.role === "expert") {
      if (skills !== undefined) {
        if (Array.isArray(skills)) {
          user.skills = skills;
        } else if (typeof skills === "string") {
          user.skills = skills.split(",").map((s) => s.trim());
        }
      }

      if (experience !== undefined) user.experience = experience;
      if (hourlyRate !== undefined) user.hourlyRate = hourlyRate;
    }

    // ================= BUSINESS FIELDS =================

    if (user.role === "business") {
      if (companyName !== undefined) user.companyName = companyName;
      if (companySize !== undefined) user.companySize = companySize;
      if (industry !== undefined) user.industry = industry;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error updating profile",
    });
  }
};

exports.updateCoverPic = async (req, res) => {
  try {
    const userId = req.user.id;

    const { cover } = req.body; // base64 image

    if (!cover) {
      return res.status(400).json({ message: "Cover image required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { coverPic: cover },
      { new: true },
    );

    res.json({
      message: "Cover picture updated",
      coverPic: user.coverPic,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =============================
// UPDATE AVATAR
// =============================
exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ message: "No avatar provided" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.avatar = avatar;

    await user.save();

    res.status(200).json({
      message: "Avatar updated successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =============================
// FORGOT PASSWORD
// =============================
// =============================
// FORGOT PASSWORD
// =============================
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Do not reveal user existence
    if (!user) {
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"SearchMyExpert Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Password – SearchMyExpert",
      html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>

<body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;
box-shadow:0 10px 30px rgba(0,0,0,0.05);">

<!-- HEADER -->
<tr>
<td align="center"
style="background:linear-gradient(135deg,#2563eb,#3b82f6);padding:35px;">
<h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">
SearchMyExpert
</h1>
<p style="color:#e0e7ff;margin-top:6px;font-size:14px;">
Password Reset Request
</p>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:40px 35px;">

<h2 style="margin-top:0;color:#111827;">
Hello ${user.name},
</h2>

<p style="color:#374151;font-size:15px;line-height:1.6;">
We received a request to reset your password for your <strong>SearchMyExpert</strong> account.
</p>

<p style="color:#374151;font-size:15px;line-height:1.6;">
Click the button below to create a new password. This link will expire in
<strong>15 minutes</strong>.
</p>

<!-- BUTTON -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
<tr>
<td align="center">

<a href="${resetUrl}"
style="
display:inline-block;
padding:14px 28px;
font-size:16px;
color:#ffffff;
background:linear-gradient(135deg,#2563eb,#3b82f6);
text-decoration:none;
border-radius:8px;
font-weight:bold;
box-shadow:0 4px 10px rgba(0,0,0,0.15);
">
Reset Password
</a>

</td>
</tr>
</table>

<p style="color:#6b7280;font-size:13px;">
If you did not request this password reset, you can safely ignore this email.
Your account will remain secure.
</p>

<p style="color:#6b7280;font-size:13px;">
If the button doesn't work, copy and paste this link into your browser:
</p>

<p style="word-break:break-all;font-size:13px;color:#2563eb;">
${resetUrl}
</p>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td align="center" style="background:#f9fafb;padding:20px;">
<p style="margin:0;font-size:12px;color:#6b7280;">
© ${new Date().getFullYear()} SearchMyExpert. All rights reserved.
</p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
    });
    res.status(200).json({
      message: "Reset link sent",
    });
  } catch (err) {
    next(err);
  }
};
// =============================
// RESET PASSWORD
// =============================
exports.resetPassword = async (req, res, next) => {
  try {
    const token = decodeURIComponent(req.params.token);
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    user.password = await bcrypt.hash(password, 10);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (err) {
    next(err);
  }
};

// =============================
// DELETE ACCOUNT
// =============================
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    res.clearCookie("token");
    res.clearCookie("role", {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// SET PASSWORD
// =============================
exports.setPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password)
      return res.status(400).json({
        message: "Password is required",
      });

    const user = await User.findById(req.user._id);

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({
      message: "Password set successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL}/login`);
    }

    const { email, name, avatar, existingUser } = req.user;

    let user = existingUser;
    let isNewUser = false;

    // Create user if not exists
    if (!user) {
      user = await User.create({
        name,
        email,
        avatar,
        provider: "google",
        role: null,
      });

      isNewUser = true;
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    };

    // Token cookie
    res.cookie("token", token, cookieOptions);

    // Role cookie only if role exists
    if (user.role) {
      res.cookie("role", user.role, {
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      });
    }

    // Redirect logic
    let redirectPath = "/select-role";

    if (user.role === "business") {
      redirectPath = "/dashboard";
    }

    if (user.role === "expert") {
      redirectPath = "/dashboard";
    }

    return res.redirect(`${process.env.CLIENT_URL}${redirectPath}`);
  } catch (error) {
    console.log(error);
    return res.redirect(`${process.env.CLIENT_URL}/login`);
  }
};

exports.selectRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["business", "expert"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { role },
      { new: true },
    );

    res.cookie("role", role, {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      message: "Role updated",
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error setting role",
    });
  }
};

exports.CheckMe = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

exports.followUser = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.userId;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    if (receiver.followers.includes(senderId)) {
      return res.json({ status: "following" });
    }

    if (receiver.followRequests.includes(senderId)) {
      return res.json({ status: "requested" });
    }

    receiver.followRequests.push(senderId);
    await receiver.save();

    await Notification.create({
      senderId,
      receiverId,
      type: "FOLLOW_REQUEST",
      title: "New Follow Request",
      message: `${sender.name} sent you a follow request`,
      status: "PENDING",
    });

    res.json({ status: "requested" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptExpert = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const senderId = req.params.userId;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!receiver || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    const followRequest = await Notification.findOne({
      senderId: senderId,
      receiverId: receiverId,
      type: "FOLLOW_REQUEST",
    }).sort({ createdAt: -1 });

    if (!followRequest) {
      return res.status(400).json({
        message: "No follow request found",
      });
    }

    // remove request from array
    receiver.followRequests = receiver.followRequests.filter(
      (id) => id.toString() !== senderId,
    );

    if (!receiver.followers.includes(senderId)) {
      receiver.followers.push(senderId);
    }

    if (!sender.following.includes(receiverId)) {
      sender.following.push(receiverId);
    }

    await receiver.save();
    await sender.save();

    followRequest.status = "ACCEPTED";
    await followRequest.save();

    res.json({
      message: "Follow request accepted",
      status: "following",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.rejectFollow = async (req, res) => {
  try {
    const receiverId = req.user.id;
    const senderId = req.params.userId;

    const receiver = await User.findById(receiverId);

    receiver.followRequests = receiver.followRequests.filter(
      (id) => id.toString() !== senderId,
    );

    await receiver.save();

    await Notification.findOneAndUpdate(
      {
        senderId: senderId,
        receiverId: receiverId,
        type: "FOLLOW_REQUEST",
      },
      {
        status: "REJECTED",
      },
      { sort: { createdAt: -1 } },
    );

    res.json({
      message: "Follow request rejected",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.checkFollowStatus = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.userId;

    const request = await Notification.findOne({
      senderId: currentUserId,
      receiverId: targetUserId,
      type: "FOLLOW_REQUEST",
    }).sort({ createdAt: -1 });

    const reverseRequest = await Notification.findOne({
      senderId: targetUserId,
      receiverId: currentUserId,
      type: "FOLLOW_REQUEST",
      status: "ACCEPTED",
    });

    if (!request) {
      return res.json({
        status: "not_following",
        mutual: false,
      });
    }

    if (request.status === "PENDING") {
      return res.json({
        status: "requested",
        mutual: false,
      });
    }

    if (request.status === "ACCEPTED") {
      return res.json({
        status: "following",
        mutual: !!reverseRequest,
      });
    }

    res.json({
      status: "rejected",
      mutual: false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
