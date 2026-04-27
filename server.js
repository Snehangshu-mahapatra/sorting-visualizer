const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("Mongo error:", err));

const RunSchema = new mongoose.Schema({
    algorithm: String,
    comparisons: Number,
    swaps: Number,
    size: Number,
    timestamp: { type: Date, default: Date.now }
});

const Run = mongoose.model("Run", RunSchema);

const comparisonSchema = new mongoose.Schema({
    algorithm1: String,
    algorithm2: String,
    comp1: Number,
    comp2: Number,
    swap1: Number,
    swap2: Number,
    size: Number,
    date: { type: Date, default: Date.now }
});

const Comparison = mongoose.model("Comparison", comparisonSchema);

// Save run
app.post("/save", async (req, res) => {
    try {
        const run = new Run(req.body);
        await run.save();

        // latest 10 runs
        const count = await Run.countDocuments();

        if (count > 10) {
            const oldest = await Run.find()
                .sort({ timestamp: 1 }) // oldest first
                .limit(count - 10);

            const ids = oldest.map(doc => doc._id);
            await Run.deleteMany({ _id: { $in: ids } });
        }

        res.json({ message: "Saved successfully" });

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Get runs
app.get("/runs", async (req, res) => {
    const data = await Run.find();
    res.json(data);
});

// Save comparison
app.post("/saveComparison", async (req, res) => {
    try {
        await Comparison.create(req.body);

        //latest 10 comparisons
        const count = await Comparison.countDocuments();

        if (count > 10) {
            const oldest = await Comparison.find()
                .sort({ date: 1 }) // oldest first
                .limit(count - 10);

            const ids = oldest.map(doc => doc._id);
            await Comparison.deleteMany({ _id: { $in: ids } });
        }

        res.json({ message: "Comparison saved" });

    } catch (err) {
        res.status(500).json({ error: err });
    }
});
// Get comparisons
app.get("/comparisons", async (req, res) => {
    const data = await Comparison.find();
    res.json(data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});