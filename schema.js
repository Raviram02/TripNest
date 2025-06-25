const joi = require("joi");

module.exports.listingSchema = joi.object({
  listing: joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    location: joi.string().required(),
    type: joi.string().required(),
    price: joi.number().required().min(0),
    image: joi.string().allow("", null),

    // ✅ Add this to allow lat/lng in geometry
    geometry: joi.object({
      lat: joi.number().required(),
      lng: joi.number().required(),
    }).optional()
  }).required(),
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required(),
    }).required(),
});