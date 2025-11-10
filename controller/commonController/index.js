const helper = require("../../helper/helper");
exports.uploadImages=async(req,res)=>{
  helper.uploadImages.array("images", 5)(req, res, function (err) {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({
        success: false,
        message: "File upload failed",
        error: err.message,
      });
    }
    const images = req.files.map((file) => file.location);
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      images,
    });
  });
}
