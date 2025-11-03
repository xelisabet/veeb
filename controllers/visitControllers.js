const fs = require("fs").promises;
const path = require("path");

//@desc registring a visit
//@royte GET /regvisit
//@access public
const visitAdd = (req, res) => {
  res.render("regvisit");
};

//@desc saving a visit
//@royte POST /regvisit
//@access public
const visitAddPost = async (req, res)=>{
  const firstName = req.body.firstNameInput;
  const lastName  = req.body.lastNameInput;

  const now = new Date();
  const dateStr = now.toLocaleDateString("et-EE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const timeStr = now.toLocaleTimeString("et-EE", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const logLine = `${firstName} ${lastName}, ${dateStr} kell ${timeStr}\n`;
  const filePath = path.join(__dirname, "..", "public", "txt", "visitlog.txt");

  try {
    await fs.appendFile(filePath, logLine);
    //redirect logile
    res.redirect("/visitlog");
  } catch (err) {
    console.error("Faili kirjutamise viga:", err);
    res.status(500).send("Külastuse registreerimine ebaõnnestus");
  }
};

//@desc log of visits
//@royte Get /visitlog
//@access public
const visitLog = async (req, res) => {
  const filePath = path.join(__dirname, "..", "public", "txt", "visitlog.txt");

  try {
    const data = await fs.readFile(filePath, "utf8");
    const visits = data.split("\n").filter(line => line.trim() !== "");
    res.render("visitlog", { visits });
  } catch (err) {
    console.error("Logi lugemise viga:", err);
    res.render("visitlog", { visits: [] });
  }
};


module.exports = {
    visitLog,
    visitAdd,
    visitAddPost};