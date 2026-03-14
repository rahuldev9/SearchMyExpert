const stripe = require("../config/stripe");
const Project = require("../models/Project");

exports.createCheckoutSession = async (req, res) => {
  try {
    const { projectId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🔴 ADD THIS LINE
    const amount = Math.max(project.budget, 50); // minimum ₹50

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: project.title,
              description: project.description,
            },

            // 🔴 CHANGE THIS LINE
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],

      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?projectId=${project._id}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Stripe session creation failed" });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { projectId } = req.body;

    await Project.findByIdAndUpdate(projectId, {
      paymentStatus: "PAID",
      paymentMethod: "STRIPE",
      paidAt: new Date(),
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Payment confirmation failed" });
  }
};
