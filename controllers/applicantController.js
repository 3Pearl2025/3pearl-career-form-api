import Applicant from "../models/Applicant.js";

export const createApplicant = async (req, res) => {
  try {
    const { name, position, city } = req.body;

    const cvUrl = req.file
      ? `${req.protocol}://${process.env.API_HOST}/uploads/${req.file.filename}`
      : null;

    const applicant = new Applicant({
      name,
      position,
      city,
      cvUrl,
    });

    await applicant.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: applicant,
    });
  } catch (error) {
    console.error("Error saving applicant:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getApplicants = async (req, res) => {
  try {
    const { search, status } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const applicants = await Applicant.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applicants.length,
      data: applicants,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteApplicant = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Applicant.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Applicant deleted successfully" });
  } catch (error) {
    console.error("Error deleting applicant:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateApplicantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log("🚀 ~ updateApplicantStatus ~ status:", status);

    const allowedStatuses = ["unread", "called", "rejected", "accepted"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(
          ", "
        )}`,
      });
    }

    const applicant = await Applicant.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!applicant) {
      return res
        .status(404)
        .json({ success: false, message: "Applicant not found" });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: applicant,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
