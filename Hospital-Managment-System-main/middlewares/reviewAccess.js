const Review = require("../models/review.model"); // تأكد من اسم نموذج التقييم عندك

const checkReviewAccess = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user._id; 
    const userRole = req.user.role; 

    const review = await Review.findById(reviewId);
      
    if (!review) {
      return res.status(404).json({ 
        status: "fail", 
        message: "Review not found" 
      });
    }
  
    if (userRole === "admin") {
      return next();
    }
   
    if (review.user.toString() === userId.toString()) {
      return next();
    }
  
    return res.status(403).json({ 
      status: "fail", 
      message: "You do not have permission to perform this action on this review" 
    });
  } catch (error) {
    return res.status(500).json({ 
      status: "error", 
      message: error.message 
    });
  }
};

module.exports = { checkReviewAccess };