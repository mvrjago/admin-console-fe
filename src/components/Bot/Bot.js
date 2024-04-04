const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const fs = require("fs").promises;
const cors = require("cors");
const bodyParser = require("body-parser");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

const app = express();
const PORT = 4000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("ENDPOINT STATUS BOT, BY MVRJAGO! & CLAYFNT");
});

app.get("/guildRoles", (req, res) => {
  try {
    const guild = client.guilds.cache.get("1088356545613537280");
    const roles = guild.roles.cache.map((role) => ({
      id: role.id,
      name: role.name,
    }));

    res.json({ roles });
  } catch (error) {
    console.error("Error fetching guild roles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/channel/:channelId", (req, res) => {
  try {
    const channelId = req.params.channelId;
    const channel = client.channels.cache.get(channelId);

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    res.json({
      channelId: channel.id,
      channelName: channel.name,
      channelType: channel.type,

    });
  } catch (error) {
    console.error("Error fetching channel data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/guildChannels", (req, res) => {
  try {
    const guild = client.guilds.cache.get("1088356545613537280");
    const channels = guild.channels.cache.map((channel) => ({
      id: channel.id,
      name: channel.name,
      type: channel.type,
    }));

    res.json({ channels });
  } catch (error) {
    console.error("Error fetching guild channels:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/sendMessage", async (req, res) => {
  try {
    const { message, channelId } = req.body;

    const channel = client.channels.cache.get(channelId);

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    await channel.send(message);
    res.json({ success: true });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/memberCount", async (req, res) => {
  try {
    const guild = client.guilds.cache.get("1088356545613537280");
    await guild.members.fetch();

    const totalMembers = guild.members.cache.size;
    const totalRoles = guild.roles.cache.size;

    const activeMembers = guild.members.cache.filter(
      (member) =>
        member.presence?.status === "online" ||
        member.presence?.status === "idle"
    );
    const activeMemberCount = activeMembers.size;
    const activeBots = activeMembers.filter((member) => member.user.bot);
    const activeBotCount = activeBots.size;

    const boosters = guild.members.cache.filter(
      (member) => member.premiumSince !== null
    );
    const boosterCount = boosters.size;

    const role1155169503186006147 = guild.roles.cache.get(
      "1155169503186006147"
    );

    const membersWithRole = role1155169503186006147
      ? role1155169503186006147.members.size
      : 0;

    const leaMember = guild.members.cache.find(
      (member) => member.user.tag === "Leaa anak skena#1672"
    );

    const leaStatus = leaMember
      ? leaMember.presence?.status || "Offline"
      : "Unknown";
    const leaAvatar = leaMember ? leaMember.user.displayAvatarURL() : "";
    const leaName = leaMember ? leaMember.user.username : "Unknown";

    console.log("Member Info:", {
      totalMembers,
      totalRoles,
      activeMembers: activeMemberCount,
      activeBots: activeBotCount,
      boosterCount,
      membersWithRole,
      leaStatus,
      leaAvatar,
    });

    res.json({
      totalMembers,
      totalRoles,
      activeMembers: activeMemberCount,
      activeBots: activeBotCount,
      boosterCount,
      membersWithRole,
      leaStatus,
      leaAvatar,
      leaName,
    });
  } catch (error) {
    console.error("Error fetching or processing member data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/saveModeratorLogChannels", async (req, res) => {
  try {
    const { moderatorLogChannels } = req.body;
    await saveChannelsToFile(moderatorLogChannels, "moderatorLog");
    res.status(200).json({ message: "Avatar channels saved successfully!" });
  } catch (error) {
    console.error("Error saving avatar channels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/saveRoleChannels", async (req, res) => {
  try {
    const { roleLogChannels } = req.body;
    await saveChannelsToFile(roleLogChannels, "roleLog");
    res.status(200).json({ message: "Role channels saved successfully!" });
  } catch (error) {
    console.error("Error saving Delete Message channels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/saveDeleteMessageChannels", async (req, res) => {
  try {
    const { deleteMessageChannels } = req.body;
    await saveChannelsToFile(deleteMessageChannels, "deleteMessage");
    res
      .status(200)
      .json({ message: "Delete Message channels saved successfully!" });
  } catch (error) {
    console.error("Error saving Delete Message channels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/saveGoodbyeChannels", async (req, res) => {
  try {
    const { goodbyeChannels } = req.body;
    await saveChannelsToFile(goodbyeChannels, "goodbye");
    res.status(200).json({ message: "Goodbye channels saved successfully!" });
  } catch (error) {
    console.error("Error saving avatar channels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/saveWelcomeMessageChannels", async (req, res) => {
  try {
    const { welcomeMessageChannels } = req.body;
    await saveChannelsToFile(welcomeMessageChannels, "welcomeMessage");
    res.status(200).json({ message: "Welcome channels saved successfully!" });
  } catch (error) {
    console.error("Error saving welcome channels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/saveAvatarChannels", async (req, res) => {
  try {
    const { avatarChannels } = req.body;
    await saveChannelsToFile(avatarChannels, "avatar");
    res.status(200).json({ message: "Avatar channels saved successfully!" });
  } catch (error) {
    console.error("Error saving avatar channels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/saveKickChannels", async (req, res) => {
  try {
    const { kickChannels } = req.body;
    await saveChannelsToFile(kickChannels, "kick");
    res.status(200).json({ message: "Kick channels saved successfully!" });
  } catch (error) {
    console.error("Error saving kick channels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint untuk menyimpan informasi ban channels
app.post("/saveBanChannels", async (req, res) => {
  try {
    const { banChannels } = req.body;
    await saveChannelsToFile(banChannels, "ban");
    res.status(200).json({ message: "Ban channels saved successfully!" });
  } catch (error) {
    console.error("Error saving ban channels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint untuk menyimpan informasi timeout channels
app.post("/saveTimeoutChannels", async (req, res) => {
  try {
    const { timeoutChannels } = req.body;
    await saveChannelsToFile(timeoutChannels, "timeout");
    res.status(200).json({ message: "Timeout channels saved successfully!" });
  } catch (error) {
    console.error("Error saving timeout channels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function saveChannelsToFile(selectedChannels, actionType) {
  try {
    if (!Array.isArray(selectedChannels)) {
      throw new Error("Selected channels should be an array");
    }

    const fileName = `channels.json`;
    let existingData = {};

    try {
      const fileData = await fs.readFile(fileName, "utf8");
      existingData = JSON.parse(fileData);
    } catch (error) {
      console.error(`Error reading ${fileName}:`, error);
    }

    existingData[actionType + "Channels"] = selectedChannels;

    const data = JSON.stringify(existingData, null, 2);
    await fs.writeFile(fileName, data);
  } catch (error) {
    console.error(`Error saving ${actionType} channels:`, error);
    throw error;
  }
}

app.post("/saveTokenChannels", async (req, res) => {
  try {
    const { tokenChannels } = req.body;
    await saveTokenPrefixToFile(tokenChannels, "token");
    res.status(200).json({ message: "Token channels saved successfully!" });
  } catch (error) {
    console.error("Error saving token channels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint untuk menyimpan informasi prefix channels
app.post("/savePrefixChannels", async (req, res) => {
  try {
    const { prefixChannels } = req.body;
    await saveTokenPrefixToFile(prefixChannels, "prefix");
    res.status(200).json({ message: "Prefix channels saved successfully!" });
  } catch (error) {
    console.error("Error saving prefix channels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function saveTokenPrefixToFile(selectedChannels, actionType) {
  try {
    if (!Array.isArray(selectedChannels)) {
      throw new Error("Selected channels should be an array");
    }

    const fileName = `config.json`;
    let existingData = {};

    try {
      const fileData = await fs.readFile(fileName, "utf8");
      existingData = JSON.parse(fileData);
    } catch (error) {
      console.error(`Error reading ${fileName}:`, error);
    }

    existingData[actionType + "Channels"] = selectedChannels;

    const data = JSON.stringify(existingData, null, 2);
    await fs.writeFile(fileName, data);
  } catch (error) {
    console.error(`Error saving ${actionType} channels:`, error);
    throw error;
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

client.once("ready", () => {
  console.log("Read The Fucking Manual!");
});

client.login(
  ""
);