import Show from "../models/Show.js";
import fs from "fs";
import path from "path";
import { generateSeatsForShow } from "../utils/generateSeats.js";

// CREATE SHOW
export const createShow = async (req, res) => {
  try {
    const {
      title,
      comedian_id,
      venue,
      show_date,
      show_time,
      description,
      seat_layout,
    } = req.body;

  const seatLayoutParsed = req.body.seat_layout
  ? JSON.parse(req.body.seat_layout)
  : {};

    const show = await Show.create({
      title,
      comedian_id,
      venue,
      show_date,
      show_time,
      description,
      seat_layout: seatLayoutParsed,
      image: req.file ? req.file.filename : null
    });

    await generateSeatsForShow(show._id, seatLayoutParsed);

    res.status(201).json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET ALL SHOWS (FILTER + SORT 🔥)
export const getShows = async (req, res) => {
  try {
    const {
      search,
      venue,
      comedian,
      show_date,
      sortBy = "show_time",
      order = "asc",
      status
    } = req.query;

    let query = {};

    // Search
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Filters
    if (venue) query.venue = venue;
    if (comedian) query.comedian_id = comedian;
    if (show_date) query.show_date = new Date(show_date);
    if (status) query.status = status;

    const sortOrder = order === "asc" ? 1 : -1;

    const shows = await Show.find(query)
      .populate("comedian_id", "name")
      .sort({ [sortBy]: sortOrder });

    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET SINGLE SHOW
export const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate("comedian_id");

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// UPDATE SHOW
export const updateShow = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    // Delete old image if new uploaded
    if (req.file && show.image) {
      const oldPath = path.join("uploads/shows", show.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    Object.assign(show, req.body);

    if (req.file) {
      show.image = req.file.filename;
    }

    await show.save();

    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// DELETE SHOW
export const deleteShow = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    if (show.image) {
      const filePath = path.join("uploads/shows", show.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await show.deleteOne();

    res.json({ message: "Show deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};