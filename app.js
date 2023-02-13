const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

initializeSeverAndDb = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Started Successfully");
    });
  } catch (error) {
    console.log("DB:${error}");
    process.exit(1);
  }
};

initializeSeverAndDb();

const convertObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

//GET Player Detail

app.get("/players/", async (request, response) => {
  const getPlayerQuery = `
    SELECT * 
    FROM cricket_team ;`;

  const playerDetail = await db.all(getPlayerQuery);
  response.send(
    playerDetail.map((eachplayer) => convertObjectToResponseObject(eachplayer))
  );
});

//POST Player Detail

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;

  const postPlayerQuery = `
    INSERT INTO 
    cricket_team(playerName,jerseyNumber,role)
    VALUES 
      ("Vishal",
       17,
      "Bowler" );`;

  const player = await db.run(postPlayerQuery);
  console.log(player);
  response.send("Player Added to Team");
});

//GET Player Detail With PlayerID

app.get("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const getPlayerQuery = `
    SELECT * 
    FROM cricket_team 
    WHERE player_id = ${playerId};`;

  const playerDetail = await db.get(getPlayerQuery);
  response.send(playerDetail);
});

//UPDATE The Player Detail

app.put("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const updatePlayerQuery = `
    UPDATE  cricket_team
    SET 
     playerName: "Maneesh",
     jerseyNumber: 54,
     role: "All-rounder" 
    WHERE player_id = ${playerID};`;

  const playerDetail = await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//DELETE The Player

app.delete("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const deletePlayerQuery = `
    DELETE FROM cricket_team 
    WHERE player_id = ${playerId} ;`;

  const playerDetail = await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
