const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid");
const { promisify } = require("util");

//google storage
const { Storage } = require("@google-cloud/storage");
const stream = require("stream");

const config = require("../config/index");

const AlbumPhoto = require("../models/albumPhoto");
const Photo = require("../models/photo");

exports.index = async (req, res, next) => {
  try {
    const albumphotos = await AlbumPhoto.find().sort({ _id: -1 });

    const albumphotoWithPhotoDomain = await albumphotos.map(
      (albumphoto, index) => {
        return {
          id: albumphoto._id,
          // photo: config.DOMAIN + '/image/' + albumphoto.photo,
          photo: config.DOMAIN_GOOGLE_STORAGE + "/" + albumphoto.photo,
          title: albumphoto.title,
          subtitle: albumphoto.subtitle,
        };
      }
    );
  
    res.status(200).json({
      data: albumphotoWithPhotoDomain,
    });
  } catch (error) {
    res.status(400).json({
        error: {
            message: 'There was an error from the server, please try again.'
        }
      });
  }
};

//get photo
exports.photo = async (req, res, next) => {
    try {
        const photo = await Photo.find().populate("albumphoto");

  res.status(200).json({
    data: photo,
  });
    } catch (error) {
        res.status(400).json({
            error: {
                message: 'There was an error from the server, please try again.'
            }
          });
    }

};

//get albumphoto by id with photo
exports.getAlbumWithPhoto = async (req, res, next) => {
  try {
    const { id } = req.params;

    const albumWithPhoto = await AlbumPhoto.findById(id)
      .select("-photo -title -subtitle")
      .populate("photos");

    if (!albumWithPhoto) {
        throw new Error('No data found.')
    }

    res.status(200).json({
      data: albumWithPhoto
    });

  } catch (error) {
    res.status(400).json({
        error: {
            message: 'An error has occurred, invalid id. ' + error.message
        }
      });
  }
};

//insert album
exports.insert = async (req, res, next) => {
  const { photo, title, subtitle } = req.body;

  let album = new AlbumPhoto({
    photo: await saveImageToGoogle(photo),
    title: title,
    subtitle: subtitle,
  });
  await album.save();

  res.status(201).json({
    message: "The album information has been added.",
  });
};

//delete album photo by id
exports.destroy = async (req, res, next) => {

    try {
        const { id } = req.params
    const albumphoto = await AlbumPhoto.deleteOne({ _id: id })

    if (albumphoto.deletedCount === 0) {
        throw new Error('The data cannot be deleted.')
    } else {
        res.status(200).json({
            message: 'The data has been deleted.'
        })
    }

    } catch (error) {
        res.status(400).json({
            error: 'Something went wrong. ' + error.message
        })
  }
}

//update album photo by id
exports.update = async (req, res, next) => {

    try {
        const { id } = req.params
        const { title, subtitle } = req.body

        const albumphoto = await AlbumPhoto.updateOne({ _id: id },{
            title: title,
            subtitle: subtitle
        })

        if (albumphoto.nModified === 0) {
            throw new Error('ไม่สามารถแก้ไขข้อมูลได้')
        } else {
            res.status(200).json({
                message: 'แก้ไขข้อมูลเรียบร้อย'
            })
        }

    } catch (error) {
        res.status(400).json({
            error: 'เกิดผิดพลาด ' + error.message
        })
  }
}



//google storage
async function saveImageToGoogle(baseImage) {
  //หา path จริงของโปรเจค
  const projectPath = path.resolve("./");

  //หานามสกุลไฟล์
  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );
  // console.log(ext);

  //สุ่มชื่อไฟล์ใหม่ พร้อมนามสกุล
  let filename = "";
  if (ext === "svg+xml") {
    filename = `${uuidv4.v4()}.svg`;
  } else {
    filename = `${uuidv4.v4()}.${ext}`;
  }

  //Extract base64 data ออกมา
  let image = decodeBase64Image(baseImage);

  const bufferStream = new stream.PassThrough();
  bufferStream.end(Buffer.from(image.data, "base64"));

  // Creates a client and upload to storage
  const storage = new Storage({
    projectId: "boomproject-308412",
    keyFilename: `${projectPath}/google_key.json`,
  });

  const myBucket = storage.bucket("album_photo_node");
  var myBucketFilename = myBucket.file(filename);
  bufferStream.pipe(
    myBucketFilename
      .createWriteStream({
        gzip: true,
        contentType: image.type,
        metadata: {
          // Enable long-lived HTTP caching headers
          // Use only if the contents of the file will never change
          // (If the contents will change, use cacheControl: 'no-cache')
          cacheControl: "public, max-age=31536000",
        },
        public: true,
        validation: "md5",
      })
      .on("error", (err) => {
        console.log("err =>" + err);
      })
      .on("finish", () => {
        console.log("upload successfully...");
      })
  );

  //return ชื่อไฟล์ใหม่ออกไป
  return filename;
}

function decodeBase64Image(base64Str) {
  var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var image = {};
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string");
  }

  image.type = matches[1];
  image.data = matches[2];

  return image;
}
