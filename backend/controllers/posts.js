const { Post } = require('../models')

/* backend issue task 2 - filter by date range */
module.exports.index = (req, res, next) => {
  let currentDate = new Date(req.query.currDate);
  let dateRange = req.query.dateRange;

  // case where a filter is selected
  if (dateRange != undefined) {
    if (dateRange === "Past week") {
      query = {
        "createdAt" : {
          $lt: currentDate.getDate(), 
          $gte: new Date(currentDate.getDate() - 7)
        }
      }
    }
    else if (dateRange === "Past month") {
      console.log(rangeEarliest);
      query = {
        "createdAt" : {
          $lt: currentDate.getDate(), 
          $gte: new Date(currentDate.getDate() - 31)
        }
      }
    }
    else if (dateRange === "Past year") {
      query = {
        "createdAt" : {
          $lt: currentDate.getDate(), 
          $gte: new Date(currentDate.getDate() - 365)
        }
      }
    }
    else if (dateRange === "A year ago") {
      let yearFromToday = new Date(currentDate.getDate() - 365);
      query = {
        "createdAt" : {
          $lt: yearFromToday.getDate(),
          $gte: yearFromToday.getDate() - 365
        }
      }
    }
    else if (dateRange === "Ancient times") {   // before 10 years ago
      query = {
        "createdAt" : {
          $lt: new Date(currentDate.getDate() - 3650)
        }
      }
    }
    Post.find(query)
      .populate('comments')
      .sort('-createdAt')
      .then(posts => {
        res.locals.data = { posts }
        res.locals.status = 200
        return next()
      })
      .catch(err => {
        console.error(err)
        res.locals.error = { error: err.message }
        return next()
      })
  } else {
    Post.find()
    .populate('comments')
    .sort('-createdAt')
    .then(posts => {
      res.locals.data = { posts }
      res.locals.status = 200
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      return next()
    })
  }
}

module.exports.get = (req, res, next) => {
  Post.findById(req.params.id)
    .populate('comments')
    .then(post => {
      res.locals.data = { post }
      res.locals.status = post === null ? 404 : 200
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.errors = { error: err.message }
      return next()
    })
}

module.exports.store = (req, res, next) => {
  const newPost = new Post(req.body)
  newPost
    .save()
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 201
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.update = (req, res, next) => {
  Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
    runValidators: true,
    new: true,
  })
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 200
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.delete = (req, res, next) => {
  Post.findByIdAndCascadeDelete({ _id: req.params.id })
    .then(_ => {
      res.locals.data = { deleted: 'Success' }
      res.locals.status = 200
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.comment = (req, res, next) => {
  Post.findByIdAndAddComment(req.params.id, req.body)
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 201
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

/* backend issue task 1 (set up an endpoint for a test date) */
module.exports.date = (req, res, next) => {
  // console.log(req.query.currentDate);
  // we create the query createdAt value (i.e. "August 3, 2022") through Postman!
  // alternatively, we could just hardcode it via: postDate = new Date("August 3, 2022")
  let postDate = new Date(req.query.createdAt);
  let newPost = new Post({
    author: "adalovelace",
    title: "first time using reddit",
    text: "yassssssss",
    createdAt: postDate.toISOString()
  })
  newPost
    .save()
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 201
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}