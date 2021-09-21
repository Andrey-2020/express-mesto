const router = require('express').Router();
const {
  createUser, getUser, getUsers, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);
module.exports = router;
