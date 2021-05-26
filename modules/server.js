(() => {
  const { dashboard } = require("../config");
  const { enabled, port, clientID } = dashboard;

  if (!enabled) return;

  const fetch = require("node-fetch");
  const url = require("url");

  const express = require("express");
  const app = express();
  const http = require("http");
  const server = http.createServer(app);
  const { Server } = require("socket.io");
  const io = new Server(server);

  app.use(async (req, res, next) => {
    const { code } = req.query;
    if (code) {
      const oauthResult = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        body: new URLSearchParams({
          client_id: clientID,
          client_secret: process.env.CLIENT_TOKEN,
          code,
          grant_type: "authorization_code",
          redirect_uri: `http://localhost:${port}/`,
          scope: "identify",
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const oauthData = await oauthResult.json();
      console.log(oauthData);

      const userResult = await fetch("https://discord.com/api/users/@me", {
        headers: {
          authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        },
      });

      console.log(await userResult.json());

      const guildsResult = await fetch(
        "https://discord.com/api/users/@me/guilds",
        {
          headers: {
            authorization: `${oauthData.token_type} ${oauthData.access_token}`,
          },
        }
      );

      console.log(await guildsResult.json());

      res.cookie("oauth", `${oauthData.token_type} ${oauthData.access_token}`, {
        maxAge: oauthData.expires_in,
      });
      res.redirect(url.parse(req.url).pathname);

      console.log(req.cookies);
    }

    next();
  });
  const path = process.mainModule.path;
  const fs = require("fs");

  const pages = fs.readdirSync(path + "/dashboard");
  let appDir = "/";
  for (const page of pages) {
    if (page == "index.html") {
      app.get(appDir, (req, res) => {
        const data = fs.readFileSync(path + "/dashboard/index.html", "utf8");
        res.send(data); // TODO: Handle Error
      });
    } else if (fs.lstatSync(path + "/dashboard/" + page).isDirectory()) {
      // TODO: Support Pages
    } else {
      app.get(appDir + page, (req, res) => {
        res.sendFile(path + "/dashboard/" + page);
      });
    }
  }

  const libraries = fs.readdirSync(path + "/libraries");
  for (const library of libraries) {
    app.get("/libraries/" + library, (req, res) => {
      res.sendFile(path + "/libraries/" + library);
    });
  }

  io.on("connection", (socket) => {
    console.log("a user connected");
  });

  server.listen(port, () =>
    console.log(`Server listening on localhost:${port}`)
  );
})();
