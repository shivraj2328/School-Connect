const express = require("express");

const cors = require("cors");

require("dotenv").config();
const app = express();
const Notice = require("./models/notice.ts");

require("./config/db");

const mongoose = require("mongoose");

app.use(
    cors({
        origin: "http://localhost:8081",
    })
);

app.use(express.json());

app.get("/api/user/:id", (req, res) => {
    res.send("<h1>Backend connected with proxy</h1>");
});

app.post("/api/user", (req, res) => {
    res.send("<h1>Backend connected with proxy</h1>");
});

app.get("/api/notice", async (req, res) => {
    try {
        const notices = await Notice.find();
        res.json(notices);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/notice", async (req, res) => {
    try {
        const { title, notice, user, date, time } = req.body;
        const newNotice = new Notice({
            title,
            notice,
            user,
            date,
            time,
        });

        await newNotice.save();
        res.status(201).json(newNotice);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

app.delete("/api/notice/:id", async (req, res) => {
    try {
        const noticeId = req.params.id;
        const deletedNotice = await Notice.findByIdAndDelete(noticeId);
        if (!deletedNotice) {
            return res.status(404).json({ error: "Notice not found." });
        }
        return res
            .status(200)
            .json({ message: "Notice deleted successfully." });
    } catch (error) {
        console.error("Error deleting notice:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

app.put("/api/notice/:id", async (req, res) => {
    let notice = await Notice.findById(req.params.id);

    if (!notice) {
        return res.status(404).json({ error: "Notice not found." });
    }

    notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json({
        notice,
    });
});

app.listen("8000", () => {
    console.log("Backend is ON!");
});
