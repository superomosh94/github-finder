const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// Basic CORS handling (if needed for future extensions)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Route: Fetch GitHub user data
app.get("/api/user/:username", async (req, res) => {
  const { username } = req.params;
  
  if (!username || username.trim() === "") {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    
    if (userResponse.status === 404) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (!userResponse.ok) {
      throw new Error(`GitHub API returned ${userResponse.status}`);
    }
    
    const userData = await userResponse.json();
    res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ 
      message: "Error fetching user data from GitHub",
      error: error.message 
    });
  }
});

// Route: Fetch ALL GitHub repositories
app.get("/api/user/:username/repos", async (req, res) => {
  const { username } = req.params;

  try {
    let allRepos = [];
    let page = 1;
    let hasMore = true;

    // GitHub API returns max 100 repos per page, so we need to paginate
    while (hasMore) {
      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&page=${page}`
      );
      
      if (reposResponse.status === 404) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (!reposResponse.ok) {
        throw new Error(`GitHub API returned ${reposResponse.status}`);
      }
      
      const reposData = await reposResponse.json();
      
      // If no more repos or empty response, stop pagination
      if (reposData.length === 0) {
        hasMore = false;
      } else {
        allRepos = allRepos.concat(reposData);
        page++;
        
        // Safety limit: stop after 10 pages (1000 repos) to avoid infinite loops
        if (page > 10) {
          hasMore = false;
        }
      }
    }
    
    res.json(allRepos);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    res.status(500).json({ 
      message: "Error fetching repositories from GitHub",
      error: error.message 
    });
  }
});

// Catch-all route for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
  console.log(` Serving static files from: ${path.join(__dirname, "public")}`);
});