import Express from "express";
import mysql from "mysql";
import cors from "cors";
import fs from "fs";
import multer from "multer";

const app = Express();
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "012345",
  database: "WebKeChuyen",
});

app.use(Express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (Nhan, file, cb) => {
    cb(null, "./PictureStorage")
  },

  filename: (Nhan, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage
})

app.get("/", (Nhan, Tra) => {
  Tra.json("This is DataBase!");
});

app.get("/DanhSachTTHL", (Nhan, Tra) => {
  db.query("SELECT * FROM danh_sach_chuong_tthl", (err, result) => {
    if (err) {
      Tra.json(err);
    } else {
      Tra.json(result);
    }
  });
});

app.get("/DanhSachTTHL/SL/:TenChuong", (Nhan, Tra) => {
  db.query("SELECT SL FROM " + Nhan.params.TenChuong, (err, result) => {
    if (err) {
      Tra.json(err);
    } else {
      Tra.json(result);
    }
  });
});

app.get("/DanhSachTTHL/:TenChuong/:sl", (Nhan, Tra) => {
  db.query(
    "SELECT Noi_Dung FROM " +
      Nhan.params.TenChuong +
      " where SL = " +
      Nhan.params.sl,
    (err, result) => {
      if (err) {
        return Tra.json(err);
      } else {
        return Tra.json(result);
      }
    }
  );
});

app.get("/DanhSachTTHL/C/SL/:TenChuong", (Nhan, Tra) => {
  db.query("SELECT SL FROM " + Nhan.params.TenChuong, (err, result) => {
    if (err) {
      return Tra.json(err);
    } else {
      return Tra.json(result);
    }
  });
});

app.get("/Login/Account/Check/:Email/:Password", (Nhan, Tra) => {
  db.query("SELECT Email,Mat_Khau FROM tai_khoan", (err, result) => {
    if (err) {
      return Tra.json(err);
    } else {
      for (let i = 0; i <= result.length - 1; i++) {
        if (result[i].Email === Nhan.params.Email) {
          if (result[i].Mat_Khau === Nhan.params.Password) {
            return Tra.json("Success");
          } else {
            return Tra.json("Password");
          }
        } else {
          if(i === result.length - 1){
            return Tra.json("Email")
          }
        }
      }
    }
  });
});

app.get("/Login/Account/Take/:Email", (Nhan, Tra) =>
  db.query(
    "SELECT * FROM tai_khoan WHERE Email = ? ",
    [Nhan.params.Email],
    (err, resutl) => {
      if (err) {
        return Tra.json(err);
      } else {
        return Tra.json(resutl);
      }
    }
  )
);

app.post("/Save/Picture", upload.single("Image") , (Nhan, Tra) => {
  console.log(Nhan.file)
})

app.listen(5000, () => {
  console.log("http://localhost:5000 is running!");
});
