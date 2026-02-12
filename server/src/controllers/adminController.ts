import { Response } from "express";
import Booking from "../models/Booking";
import { AuthenticatedRequest } from "../types";

/**
 * Get dashboard statistics for calculations and badges
 */
export const getDashboardStats = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    // In a multi-owner app, we would filter by owner's cars.
    // For now, we assume global admin/owner access.

    const pendingCount = await Booking.countDocuments({ status: "pending" });
    const confirmedCount = await Booking.countDocuments({
      status: "confirmed",
    });
    const completedCount = await Booking.countDocuments({
      status: "completed",
    });

    // Revenue calculation (optional but helpful for a profile dashboard)
    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: "paid", status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        pendingCount,
        confirmedCount,
        completedCount,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("GET DASHBOARD STATS ERROR:", error);
    res.status(500).json({ success: false, message: error });
  }
};
