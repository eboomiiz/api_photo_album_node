const config = require('../config/index')
const Apiversion = require('../models/apiversion')

exports.index = async (req, res, next) => {
    try {
      const apis = await Apiversion.findOne()

      res.status(200).json({
        data: apis
      });

    } catch (error) {
      res.status(400).json({
          error: {
              message: 'There was an error from the server, please try again.'
          }
        });
    }
    }