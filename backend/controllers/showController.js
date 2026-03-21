import Show from "../models/Show.js";
import fs from "fs";
import path from "path";

// CREATE
export const createShow = async (req, res) => {
  try {
    const {
      title,
      comedian_id,
      venue,
      show_date,
      show_time,
      description
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const show = await Show.create({
      title,
      comedian_id,
      venue,
      show_date,
      show_time,
      description,
      image: req.file.filename
    });

    res.status(201).json(show);

  } catch (error) {
    // 🔥 IMPORTANT: delete uploaded file if DB fails
    if (req.file) {
      const filePath = path.join("uploads/shows", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({ message: error.message });
  }
};

// GET ALL
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find().populate("comedian_id", "name");
    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
export const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate("comedian_id");
    if (!show) return res.status(404).json({ message: "Not found" });

    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateShow = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ message: "Not found" });

    // Delete old image if new uploaded
    if (req.file && show.image) {
      const oldPath = path.join("uploads/shows", show.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    show.title = req.body.title || show.title;
    show.comedian_id = req.body.comedian_id || show.comedian_id;
    show.venue = req.body.venue || show.venue;
    show.show_date = req.body.show_date || show.show_date;
    show.show_time = req.body.show_time || show.show_time;
    show.description = req.body.description || show.description;

    if (req.file) {
      show.image = req.file.filename;
    }

    await show.save();

    res.json(show);

  } catch (error) {
    // delete new file if error
    if (req.file) {
      const filePath = path.join("uploads/shows", req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteShow = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ message: "Not found" });

    // delete image
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