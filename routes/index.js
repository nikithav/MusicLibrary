var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/musicLibrary');
var musicModel = mongoose.model('music', {name: String, artist: String, album: String, year: String, user: String });
var userModel = mongoose.model('users', {users: String, password: String});


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'DB Project' });
});

router.post('/registration',function(req,res){
		console.log(req);
		var doc = new userModel({ users: req.body.user, password: req.body.password });
	doc.save(function (err, data) {
					if (err) 
						res.send(err);
					else 
						res.send({status: 'registered', data: data});
				});
});

router.post('/signin', function(req, res) {
	userModel.count({ users: req.body.user, password: req.body.password }, function(err, numUsers) {
		if(err) {
			res.send({status: "error"});
		}

		if(numUsers == 1) {
		  
		  res.send({status: "done"});
		}
		res.send({status: "fail"});	
	});
	
    
})

router.get('/profile', function(req, res) {
	if(!req.query.user)
		res.redirect('/');
	res.render('profile', { user: req.query.user });

})

// saves the input
router.get('/saveTrack', function(req, res, next) {
	var doc = new musicModel({
				name: req.query.name,
				artist: req.query.artist,
				album: req.query.album,
				year: req.query.year,
				user: req.query.user
			});
	doc.save(function (err, data) {
					if (err) 
						res.send(err);
					else 
						res.send({status: 'Saved', data: data});
				});
}); 
 

router.get('/findByYear', function(req, res, next) {
	musicModel.find({ year: req.query.year, user: req.query.user }, function(err, music) {
		res.send(music);
	})
});

// Find the item by name and saves it
router.get('/getByUser', function(req, res, next) {
	musicModel.find({ user: req.query.user }, function(err, music) {
		res.send(music);
	})
});

router.get('/deleteTrack', function(req, res, next) {
	musicModel.remove({name: req.query.name, user: req.query.user },function(err) {
		if(err) 
			res.send(err);
		else
			res.send({status: "Deleted"});
	});
});

// Gets all the items in menu
router.get('/getAll', function(req, res, next) {
	musicModel.find(function(err, music) {
		res.send(music);
	});
});


router.get('/test', function(req, res, next) {
	res.send(req.query.id);
});

module.exports = router;
