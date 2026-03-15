const Chat = require("../models/Chat");
const Project = require("../models/Project");

/* Get projects where chat is allowed */
exports.getChatProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({
      $or: [{ businessId: userId }, { selectedExpert: userId }],
      status: { $in: ["IN_PROGRESS", "COMPLETED"] },
    })
      .select("title status")
      .sort({ updatedAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Get chat messages */
exports.getMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.status === "CLOSED") {
      return res.status(403).json({
        message: "Chat is not allowed for closed projects",
      });
    }

    const isBusiness = project.businessId.toString() === userId.toString();

    const isExpert =
      project.selectedExpert &&
      project.selectedExpert.toString() === userId.toString();

    if (!isBusiness && !isExpert) {
      return res.status(403).json({
        message: "You are not allowed to access this chat",
      });
    }

    const chat = await Chat.findOne({ projectId }).populate(
      "messages.senderId",
      "name",
    );

    res.json(chat ? chat.messages : []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Send message */
exports.sendMessage = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.status === "CLOSED") {
      return res.status(403).json({
        message: "Chat is disabled for closed projects",
      });
    }

    const isBusiness = project.businessId.toString() === userId.toString();

    const isExpert =
      project.selectedExpert &&
      project.selectedExpert.toString() === userId.toString();

    if (!isBusiness && !isExpert) {
      return res.status(403).json({
        message: "You cannot send messages in this chat",
      });
    }

    let chat = await Chat.findOne({ projectId });

    if (!chat) {
      chat = await Chat.create({
        projectId,
        participants: [project.businessId, project.selectedExpert],
        messages: [],
      });
    }

    const newMessage = {
      senderId: userId,
      message,
      createdAt: new Date(),
    };

    chat.messages.push(newMessage);

    await chat.save();

    await chat.populate("messages.senderId", "name");
    const lastMessage = chat.messages[chat.messages.length - 1];
    res.json(lastMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
