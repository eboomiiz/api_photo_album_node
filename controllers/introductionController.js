const config = require('../config/index')
const Introduction = require('../models/introduction')

exports.index = async (req, res, next) => {
try {
    const introductions = await Introduction.find()

    const introductionWithPhotoDomain = await introductions.map(( introduction, index ) => {
        return {
            id: introduction._id,
            photo: config.DOMAIN_GOOGLE_STORAGE + '/' + introduction.photo,
            title: introduction.title,
            subtitle: introduction.subtitle
        }
    })

    res.status(200).json({
        data: introductionWithPhotoDomain
     })

} catch (error) {
    res.status(400).json({
        error: {
            message: 'There was an error from the server, please try again.'
        }
      });
}
  }