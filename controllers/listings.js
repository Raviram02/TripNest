const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  id = id.replace(/^:/, "");
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  try {
    // Use manually dropped pin if coordinates are provided in the form
    let geometry;
    if (
      req.body.listing.geometry &&
      req.body.listing.geometry.lat &&
      req.body.listing.geometry.lng
    ) {
      geometry = {
        type: "Point",
        coordinates: [
          parseFloat(req.body.listing.geometry.lng),
          parseFloat(req.body.listing.geometry.lat),
        ],
      };
    } else {
      // Fallback to Mapbox Geocoding
      const response = await geocodingClient
        .forwardGeocode({
          query: req.body.listing.location,
          limit: 1,
          types: ["address", "poi", "neighborhood", "place", "locality"],
          autocomplete: false,
          countries: ["IN"],
        })
        .send();

      // No valid location returned
      if (!response.body.features.length) {
        req.flash(
          "error",
          "Location not found. Please enter a detailed address or drop a pin on the map."
        );
        return res.redirect("/listings/new");
      }

      geometry = response.body.features[0].geometry;
    }

    // Extract image data
    const { path: url, filename } = req.file;

    // Create new listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = geometry;

    // Save and redirect
    const savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (error) {
    console.error("Geocoding or save error:", error);
    req.flash("error", "Failed to create listing. Please try again.");
    res.redirect("/listings/new");
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  id = id.replace(/^:/, "");
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  // Step 1: Update basic fields
  const listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true }
  );

  // Step 2: Handle new image upload
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  // Step 3: Handle manual pin-drop coordinates (geometry)
  if (
    req.body.listing.geometry &&
    req.body.listing.geometry.lat &&
    req.body.listing.geometry.lng
  ) {
    listing.geometry = {
      type: "Point",
      coordinates: [
        parseFloat(req.body.listing.geometry.lng),
        parseFloat(req.body.listing.geometry.lat),
      ],
    };
  }

  await listing.save(); // Save all changes

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.toggleRented = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  // Toggle the rented status
  listing.rented = !listing.rented;

  await listing.save();
  res.redirect(`/listings/${id}`);
};
