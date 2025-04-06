import http from "http";
import os from "os";

const startTime = Date.now();

const getRandomEmoji = () => {
  const emojis = ["🚀", "👾", "💅", "🔥", "🧠", "📦", "🤖", "✨", "📡", "☕"];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

const getUptime = () => {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
};

export function startWebServer(port = 3000) {
  const server = http.createServer((req, res) => {
    if (req.url === "/vibe-check") {
      const vibe = {
        mood: "lit",
        message: "everything's vibing ✨",
        emoji: getRandomEmoji(),
        uptime: getUptime(),
        time: new Date().toISOString(),
      };
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(vibe, null, 2));
    }

    const clientInfo = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      remoteAddress: req.socket.remoteAddress,
      remotePort: req.socket.remotePort,
    };

    const response = {
      status: "yo, worker's up and thriving 😎",
      emoji: getRandomEmoji(),
      uptime: getUptime(),
      server: {
        hostname: os.hostname(),
        platform: os.platform(),
      },
      timestamp: new Date().toISOString(),
      client: clientInfo,
      tips: ["Hydrate 💧", "Push code, not drama 😤", "Breaks > Burnout", "You’re doing great ✨"],
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response, null, 2));
  });

  server.listen(port, () => {
    console.log(`🌐 Web server vibing on port ${port}`);
  });
}
