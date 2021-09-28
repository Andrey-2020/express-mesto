const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMeUser, getUser, getUsers, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getMeUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().regex(/\w{24}/),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required(),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2).regex(/https?:\/\/\S{0,}\.\S{0,}\/{0,}#?/),
  }),
}), updateAvatar);

module.exports = router;
