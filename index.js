const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temp = tempVal.replace(
    "{%tempval%}",
    (parseInt(orgVal.main.temp) - 273.15).toFixed(2)
  );
  temp = temp.replace(
    "{%tempmin%}",
    (parseInt(orgVal.main.temp_min) - 273.15).toFixed(2)
  );
  temp = temp.replace(
    "{%tempmax%}",
    (parseInt(orgVal.main.temp_max) - 273.15).toFixed(2)
  );
  temp = temp.replace("{%location%}", orgVal.name);
  temp = temp.replace("{%country%}", orgVal.sys.country);
  temp = temp.replace("{%tempstatus%}", orgVal.weather[0].main);
  return temp;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      `https://api.openweathermap.org/data/2.5/weather?q=Tokyo&appid=96dfe7c5861d941afcf9dd5a95295997`
    )
      .on("data", function (chunk) {
        const objata = JSON.parse(chunk);
        const arrData = [objata];
        //
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join(" ");
        res.write(realTimeData);
      })
      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);

        console.log("end");
        res.end();
      });
  }
});
server.listen(8000, "127.0.0.1");
