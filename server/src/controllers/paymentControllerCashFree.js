const cashfree = require("../config/cashfree");
const Project = require("../../src/models/Project");

exports.createOrder = async (req, res) => {
  try {
    const { projectId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const orderRequest = {
      order_id: "order_" + Date.now(),
      order_amount: project.budget,
      order_currency: "INR",

      customer_details: {
        customer_id: project.businessId.toString(),
        customer_email: "test@gmail.com",
        customer_phone: "9999999999",
      },

      order_meta: {
        return_url: `${process.env.CLIENT_URL}/dashboard/payment-success?projectId=${project._id}`,
      },
    };

    const response = await cashfree.PGCreateOrder(orderRequest);
    project.paymentStatus = "PAID";
    project.paymentMethod = "CASHFREE";
    project.paidAt = new Date();

    await project.save();

    res.json({
      payment_session_id: response.data.payment_session_id,
      order_id: response.data.order_id,
    });
  } catch (error) {
    console.error("Cashfree error:", error.response?.data || error);

    res.status(500).json({
      message: "Failed to create Cashfree order",
      error: error.response?.data || error.message,
    });
  }
};
