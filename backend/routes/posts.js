const express = require('express');

const PostController = require('../controllers/posts');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();




router.post("", checkAuth, extractFile
    , PostController.createPost);



//we dont call next here, because we already sending a response

router.put("/:id", checkAuth, extractFile, PostController.updatePost);

router.get('', PostController.getPosts);


router.get('/:id', PostController.getPost);


router.delete('/:id', checkAuth, PostController.deletePost);

module.exports = router;