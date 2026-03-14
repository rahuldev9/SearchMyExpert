const Project = require("../models/Project");
const User = require("../models/User");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

exports.createProject = async (req, res) => {
  try {
    const { title, description, category, budget } = req.body;

    const existingProject = await Project.findOne({
      title: title,
      businessId: req.user.id,
    });

    if (existingProject) {
      return res.status(400).json({
        message: "You already created a project with this title",
      });
    }

    const project = await Project.create({
      title,
      description,
      category,
      budget,
      businessId: req.user.id,
    });

    await Notification.create({
      senderId: req.user.id, // business who created project

      type: "PROJECT_POSTED",
      title: "New Project Posted",
      message: `A new project "${title}" has been posted.`,
      projectId: project._id,
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getProject = async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    "applicants.expertId",
    "name email",
  );

  res.json(project);
};

exports.applyProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // check if expert already applied
    const alreadyApplied = project.applicants.find(
      (app) => app.expertId.toString() === req.user.id,
    );

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You have already applied for this project",
      });
    }

    project.applicants.push({
      expertId: req.user.id,
      status: "APPLIED",
    });

    await project.save();

    // 🔔 Create Notification
    await Notification.create({
      senderId: req.user.id, // expert who applied
      receiverId: project.businessId, // project owner (receiver)
      type: "PROJECT_APPLIED",
      title: "New Application",
      message: "An expert has applied to your project",
      projectId: project._id,
    });

    res.json({
      message: "Applied Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.acceptExpert = async (req, res) => {
  try {
    const { expertId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // set selected expert
    project.selectedExpert = expertId;
    project.status = "IN_PROGRESS";

    // update applicant status
    project.applicants = project.applicants.map((app) => {
      if (app.expertId.toString() === expertId) {
        app.status = "APPROVED";
      } else {
        app.status = "REJECTED"; // optional if you want others rejected
      }
      return app;
    });

    await project.save();
    await Promise.all([
      // update business stats
      User.findByIdAndUpdate(project.businessId, {
        $inc: { activeProjects: 1 },
      }),

      // update selected expert stats
      User.findByIdAndUpdate(expertId, {
        $inc: { activeProjects: 1 },
      }),
    ]);

    // send notification
    await Notification.create({
      senderId: req.user.id,
      receiverId: project.selectedExpert,
      type: "APPLICATION_ACCEPTED",
      title: "Application Accepted",
      message: "You were accepted for a project",
      projectId: project._id,
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getExpertProjects = async (req, res) => {
  try {
    const expertId = new mongoose.Types.ObjectId(req.user.id);

    const projects = await Project.find({
      selectedExpert: expertId,
      status: { $in: ["IN_PROGRESS", "COMPLETED", "CLOSED"] },
    }).populate("businessId", "name email");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyProjects = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    const projects = await Project.find({
      $or: [{ businessId: userId }, { selectedExpert: userId }],
    })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // check if logged-in user is project owner
    if (project.businessId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to edit this project",
      });
    }

    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.category = req.body.category || project.category;
    project.budget = req.body.budget || project.budget;

    const updatedProject = await project.save();

    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("businessId", "name email")
      .populate("applicants.expertId", "name email");

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Chat = require("../models/Chat");

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const projectId = req.params.projectId;

    const project = await Project.findById(projectId);

    if (!project || project.status !== "IN_PROGRESS") {
      return res.status(400).json({
        message: "Chat only allowed when project is in progress",
      });
    }

    const receiverId =
      req.user.id === project.businessId.toString()
        ? project.selectedExpert
        : project.businessId;

    const chat = await Chat.create({
      projectId,
      senderId: req.user.id,
      receiverId,
      message,
    });

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const messages = await Chat.find({ projectId })
      .populate("senderId", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.status !== "COMPLETED") {
      return res.status(400).json({
        message: "Project must be completed first",
      });
    }

    if (project.businessId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only business can review",
      });
    }

    const expert = await User.findById(project.selectedExpert);
    const business = await User.findById(project.businessId);

    if (!expert || !business) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create review object with extra business info
    const review = {
      projectId: project._id,
      rating,
      comment,
      businessId: business._id,
      businessTotalProjects: business.totalProjects,
      businessRating: business.rating,
      createdAt: new Date(),
    };

    // Add review to expert
    expert.reviews.push(review);

    // Update expert stats
    expert.totalReviews += 1;

    expert.rating =
      (expert.rating * (expert.totalReviews - 1) + rating) /
      expert.totalReviews;

    await expert.save();

    // Save review in project
    project.review = {
      rating,
      comment,
      createdAt: new Date(),
    };

    await project.save();

    await Notification.create({
      senderId: req.user.id,
      receiverId: project.selectedExpert,
      type: "PROJECT_REVIEWED",
      title: "New Review Received",
      message: `You received a ${rating}⭐ review from the business.`,
      projectId: project._id,
    });

    res.json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.completeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.status === "COMPLETED") {
      return res.status(400).json({
        message: "Project already completed",
      });
    }

    project.status = "COMPLETED";
    await project.save();

    await Promise.all([
      User.findByIdAndUpdate(project.businessId, {
        $inc: {
          completedProjects: 1,
          activeProjects: -1,
        },
      }),
      User.findByIdAndUpdate(req.user.id, {
        $inc: {
          completedProjects: 1,
          activeProjects: -1,
        },
      }),
    ]);

    await Promise.all([
      User.findByIdAndUpdate(project.businessId, {
        $inc: { totalProjects: 1 },
      }),
      User.findByIdAndUpdate(req.user.id, {
        $inc: { totalProjects: 1 },
      }),
    ]);

    await Notification.create({
      senderId: req.user.id,
      receiverId: project.businessId,
      type: "APPLICATION_ACCEPTED",
      title: "Project Completed",
      message: "The project has been marked as completed",
      projectId: project._id,
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.closeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project.review) {
      return res.status(400).json({
        message: "Please submit review before closing project",
      });
    }

    project.status = "CLOSED";
    await project.save();

    await Notification.create({
      senderId: req.user.id,
      receiverId: project.selectedExpert,
      type: "PROJECT_CLOSED",
      title: "Project Closed",
      message: "The business has closed the project.",
      projectId: project._id,
    });

    res.json({
      message: "Project closed successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserRole = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id).select("role").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      userId: req.user.id,
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ message: "Server error" });
  }
};
