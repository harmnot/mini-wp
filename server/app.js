require("dotenv").config();
const [express, mongoose, cors, morgan] = [
  require("express"),
  require("mongoose"),
  require("cors"),
  require("morgan")
];
const app = express();
const [user, article, upload] = [
  require("./routes/user.js"),
  require("./routes/articles.js"),
  require("./routes/upload.js")
];

const uri = `mongodb+srv://${process.env.MONGO_DB_NAME}:${
  process.env.MONGO_DB_KEY
}@hamrnot-iasow.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true`;

mongoose
  .connect(
    uri,
    { useNewUrlParser: true }
  )
  .then(() => console.log(`====> MongoDB connected <====`))
  .catch(err => console.log(err, "ini error"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(morgan("tiny"));

app.use("/api/user", user);
app.use("/api/article", article);
app.use("/api/upload", upload);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`you are connected on http://localhost:4000`);
});
