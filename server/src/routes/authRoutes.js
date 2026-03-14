const router = require("express").Router();
const passport = require("passport");

const {
  register,
  login,
  updateAvatar,
  profile,
  logout,
  googleLogin,
  deleteAccount,
  forgotPassword,
  resetPassword,
  setPassword,
  selectRole,
  CheckMe,
  updateProfile,
  followUser,
  rejectFollow,
  acceptExpert,
  updateCoverPic,
  checkFollowStatus,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { getPublicProfile } = require("../controllers/userController");
const {
  createCheckoutSession,
  confirmPayment,
} = require("../controllers/paymentController");
const { getUserRole } = require("../controllers/projectController");

// Local Auth
router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/set-role", protect, selectRole);
// Profile
router.get("/profile", protect, profile);
router.put("/update-avatar", protect, upload.single("avatar"), updateAvatar);

// Google Auth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);
router.get("/me", protect, CheckMe);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleLogin,
);
router.get("/role", protect, getUserRole);
router.patch("/update-profile", protect, updateProfile);
router.delete("/delete-account", protect, deleteAccount);

router.post("/forgot-password", forgotPassword);
router.put("/update-cover", protect, updateCoverPic);
router.put("/update-profile", protect, updateAvatar);
router.patch("/reset-password/:token", resetPassword);
router.post("/set-password", protect, setPassword);
router.get("/profile/:userId", getPublicProfile);
router.post("/follow/:userId", protect, followUser);
router.post("/follow/accept/:userId", protect, acceptExpert);
router.post("/follow/reject/:userId", protect, rejectFollow);
router.get("/follow/status/:userId", protect, checkFollowStatus);

router.post("/payments/create", protect, createCheckoutSession);
router.post("/payments/confirm", protect, confirmPayment);

module.exports = router;
