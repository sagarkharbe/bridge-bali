function initLoadState() {
  var state = {};
  var game = window.game;
  const http = require("http");
  const NUM_TO_TILES = require("../../game/js/const/tilemap");
  state.preload = function() {
    console.log("Loading assets...");

    game.load.image("BlackBrickBlock", "/game/assets/images/brick_black.png");
    game.load.image("BreakBrickBlock", "/game/assets/images/brick_break.png");
    game.load.image("RedBrickBlock", "/game/assets/images/brick_red.png");
    game.load.image("Girder", "/game/assets/images/girder.png");
    game.load.image("Spike", "/game/assets/images/spike.png");
    game.load.image("Tool", "/game/assets/images/tool.png");
    game.load.image("Gus", "/game/assets/images/gus-static.png");
    game.load.image("Select", "/game/assets/images/selectedBlockOutline.png");

    console.log("Done loading");
  };

  state.create = function() {
    console.log("Starting world...");
    game.world.setBounds(-400, -300, 800, 600); // fullscreen???

    console.log("Going to create state...");
    // start game state
    const eventEmitter = window.eventEmitter;

    eventEmitter.only("found maps!", function(maps) {
      if (maps[0] === "levelArr") {
        game.unparsedTileMap = maps[1] || {};
        console.log("about to log out the unparsed tile map");
        console.log(game.unparsedTileMap);
        game.parsedTileMap = maps[2];
        (function gotoStart() {
          if (game.state) game.state.start("create");
          else setTimeout(gotoStart, 100);
        })();
      } else if (maps[0] === "levelId") {
        console.log("got a levelId", maps[1]);
        // loadText.text = "Downloading level...";

        var levelData = "";
        var progress = 0;
        var id = maps[1];

        // construct our HTTP request
        var req = http.request(
          {
            hostname: window.location.hostname, // change this to our actual hostname
            path: "/api/levels/" + id + "/map",
            port: window.location.port
          },
          function(res) {
            // get data from the response
            res.setEncoding("utf8");
            var totalLen = res.headers["content-length"];
            if (totalLen === 0) console.error("Response is empty!");

            // assemble a data string from our chunks
            res.on("data", function(chunk) {
              levelData += chunk;
              progress += Math.floor((chunk.length / totalLen) * 100);
              //loadText.text = "Downloading level (" + progress.toString() + "%)..."
            });

            // once the data is fully received, try to extract it
            res.on("end", function() {
              //loadText.text = "Downloading level (100%)...";
              levelData = JSON.parse(levelData);

              if (levelData === null || typeof levelData.map !== "object") {
                console.log("Mapdata not found!");
              } else if (levelData.map) {
                // check checksum here
                console.log(levelData.map);
                // translate parsed map array to unparsed map obj
                game.parsedTileMap = levelData.map.objects;
                game.unparsedTileMap = levelData.map.objects.reduce(function(
                  prev,
                  obj
                ) {
                  if (!prev[String(obj.x)]) prev[String(obj.x)] = {};
                  prev[String(obj.x)][String(obj.y)] =
                    obj.r === undefined
                      ? {
                          tile: NUM_TO_TILES[obj.t]
                        }
                      : {
                          tile: NUM_TO_TILES[obj.t],
                          r: obj.r
                        };
                  return prev;
                },
                {});
                console.log(game.unparsedTileMap);
                (function gotoStart() {
                  if (game.state) game.state.start("create");
                  else setTimeout(gotoStart, 100);
                })();
              } else {
                console.log("Mapdata invalid!");
              }
            });
          }
        );

        req.on("error", function(err) {
          console.error("An error occurred receiving level data:", err);
        });

        req.end();
      }
    });
    eventEmitter.emit("I need both the maps!");
  };

  return state;
}

module.exports = initLoadState;
