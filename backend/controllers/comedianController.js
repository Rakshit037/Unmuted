import Comedian from "../models/Comedian.js";
import fs from "fs";
import path from "path";

// CREATE
export const createComedian = async (req, res) => {
  try {
    const { name, age, bio, experience, gender } = req.body;

    const comedian = await Comedian.create({
      name,
      age,
      bio,
      experience,
      gender,
      image: req.file ? req.file.filename : null
    });

    res.status(201).json(comedian);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
export const getComedians = async (req, res) => {
  try {
    const comedians = await Comedian.find();
    res.json(comedians);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
export const getComedianById = async (req, res) => {
  try {
    const comedian = await Comedian.findById(req.params.id);
    if (!comedian) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(comedian);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateComedian = async (req, res) => {
  try {
    const comedian = await Comedian.findById(req.params.id);

    if (!comedian) {
      return res.status(404).json({ message: "Not found" });
    }

    const oldImage = comedian.image;

    // Update fields
    comedian.name = req.body.name || comedian.name;
    comedian.age = req.body.age || comedian.age;
    comedian.bio = req.body.bio || comedian.bio;
    comedian.experience = req.body.experience || comedian.experience;
    comedian.gender = req.body.gender || comedian.gender;

    if (req.file) {
      comedian.image = req.file.filename;
    }

    await comedian.save();

    // Delete old image AFTER successful save
    if (req.file && oldImage) {
      const oldPath = path.join("uploads/comedians", oldImage);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    res.json(comedian);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteComedian = async (req, res) => {
  try {
    const comedian = await Comedian.findById(req.params.id);

    if (!comedian) {
      return res.status(404).json({ message: "Not found" });
    }

    // Delete image from folder
    if (comedian.image) {
      const filePath = path.join("uploads/comedians", comedian.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await comedian.deleteOne();

    res.json({ message: "Comedian deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};