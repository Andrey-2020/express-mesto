const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMeUser, getUser, getUsers, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', celebrate({
  // валидируем параметры
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/Bearer\s\w{1,}\.{0,}/),
  }).unknown(true),
}), getUsers);

router.get('/me', celebrate({
  // валидируем параметры
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/Bearer\s\w{1,}\.{0,}/),
  }).unknown(true),
}), getMeUser);

router.get('/:userId', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/Bearer\s\w{1,}\.{0,}/),
  }).unknown(true),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/Bearer\s\w{1,}\.{0,}/),
  }).unknown(true),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2).regex(/https?:\/\/\S{0,}.{0,1}\/{0,}#?/),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/Bearer\s\w{1,}\.{0,}/),
  }).unknown(true),
}), updateAvatar);

module.exports = router;
