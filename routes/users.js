const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMeUser, getUser, getUsers, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', celebrate({
  // валидируем параметры
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/Bearer\s\w{1,}\.{0,}/),
  }).unknown(true),
}), getMeUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
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
    avatar: Joi.string().required().min(2).regex(/https?:\/\/\S{0,}.{0,1}\/{0,}#?/),
  }),
}), updateAvatar);

module.exports = router;
