const mongoose = require("mongoose");

// Schema for reviews
const reviewSchema = mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.ObjectId, required: true, ref: "User" }
});

// Schema for art
const ArtSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        image: { type: String, required: true },
        artistName: { type: String, required: true },
        artType: { type: String, required: true },
        artGenre: { type: String, required: true },
        artStyle: { type: String, required: true },
        description: { type: String, required: true },
        numReview: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true, default: 0 },
        reviews: [reviewSchema],
        seller: { type: mongoose.Schema.ObjectId, required: true, ref: "eseller" } // Reference to Eseller
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Art", ArtSchema);
