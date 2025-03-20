const express = require('express');
const listController = require('../controllers/listController');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/upload', upload.single("file"), listController.uploadList);
router.get('/all', listController.getAgentLists);

module.exports = router;
