require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "20kb" }));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Login required" });
  }

  const { data, error } = await supabase.auth.getUser(
    header.slice(7)
  );

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = data.user;
  next();
}

// Home
app.get("/", (req, res) => {
  res.json({ message: "SkillSwap API is running 🚀" });
});

// ADD A SKILL
app.post("/api/skills", auth, async (req, res) => {
  const { skill_name, skill_type } = req.body;

  if (
    typeof skill_name !== "string" ||
    !skill_name.trim() ||
    !["teach", "learn"].includes(skill_type)
  ) {
    return res.status(400).json({ error: "Invalid skill details" });
  }

  const { data, error } = await supabase
    .from("skills")
    .insert({
      user_id: req.user.id,
      skill_name: skill_name.trim(),
      skill_type
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// VIEW AVAILABLE SKILLS
app.get("/api/skills", auth, async (req, res) => {
  const { data, error } = await supabase
    .from("skills")
    .select("id, user_id, skill_name, skill_type")
    .neq("user_id", req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE YOUR SKILL
app.delete("/api/skills/:id", auth, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid skill ID" });
  }

  const { data, error } = await supabase
    .from("skills")
    .delete()
    .eq("id", id)
    .eq("user_id", req.user.id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  if (!data.length) return res.status(404).json({ error: "Skill not found" });

  res.json({ message: "Skill deleted successfully" });
});

// FIND SKILL-SWAP PARTNERS
app.get("/api/matches", auth, async (req, res) => {
  const skill = req.query.skill;

  if (typeof skill !== "string" || !skill.trim()) {
    return res.status(400).json({ error: "Enter a skill to search" });
  }

  const { data, error } = await supabase
    .from("skills")
    .select("user_id, skill_name")
    .eq("skill_type", "teach")
    .ilike("skill_name", skill.trim())
    .neq("user_id", req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ matches: data });
});

// BOOK A LEARNING SESSION
app.post("/api/sessions", auth, async (req, res) => {
  const { teacher_id, skill_name, scheduled_at } = req.body;

  if (
    typeof teacher_id !== "string" ||
    typeof skill_name !== "string" ||
    !skill_name.trim() ||
    typeof scheduled_at !== "string" ||
    !Number.isFinite(Date.parse(scheduled_at)) ||
    Date.parse(scheduled_at) <= Date.now() ||
    teacher_id === req.user.id
  ) {
    return res.status(400).json({ error: "Invalid booking details" });
  }

  const { data: skill, error: skillError } = await supabase
    .from("skills")
    .select("id")
    .eq("user_id", teacher_id)
    .eq("skill_type", "teach")
    .ilike("skill_name", skill_name.trim())
    .maybeSingle();

  if (skillError) return res.status(500).json({ error: skillError.message });
  if (!skill) return res.status(400).json({ error: "Skill not offered by this user" });

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      teacher_id,
      learner_id: req.user.id,
      skill_name: skill_name.trim(),
      scheduled_at: new Date(scheduled_at).toISOString()
    })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// VIEW YOUR SESSIONS
app.get("/api/sessions", auth, async (req, res) => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .or(`teacher_id.eq.${req.user.id},learner_id.eq.${req.user.id}`)
    .order("scheduled_at", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ACCEPT OR CANCEL A PENDING SESSION (TEACHER ONLY)
app.patch("/api/sessions/:id/status", auth, async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  if (
    !Number.isSafeInteger(id) ||
    id <= 0 ||
    !["accepted", "cancelled"].includes(status)
  ) {
    return res.status(400).json({ error: "Invalid session or status" });
  }

  const { data, error } = await supabase
    .from("sessions")
    .update({ status })
    .eq("id", id)
    .eq("teacher_id", req.user.id)
    .eq("status", "pending")
    .select()
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Pending session not found" });

  res.json(data);
});

// REVIEW A COMPLETED SESSION
app.post("/api/reviews", auth, async (req, res) => {
  const { session_id, rating, comment = "" } = req.body;
  const id = Number(session_id);

  if (
    !Number.isSafeInteger(id) ||
    id <= 0 ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    typeof comment !== "string"
  ) {
    return res.status(400).json({ error: "Invalid review details" });
  }

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id, teacher_id, learner_id, status")
    .eq("id", id)
    .maybeSingle();

  if (sessionError) return res.status(500).json({ error: sessionError.message });
  if (!session) return res.status(404).json({ error: "Session not found" });

  if (
    session.status !== "completed" ||
    ![session.teacher_id, session.learner_id].includes(req.user.id)
  ) {
    return res.status(403).json({
      error: "Only participants in completed sessions can review"
    });
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      session_id: id,
      reviewer_id: req.user.id,
      rating,
      comment: comment.trim()
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Already reviewed this session" });
    }
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data);
});

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SkillSwap backend running at http://localhost:${PORT}`);
});
