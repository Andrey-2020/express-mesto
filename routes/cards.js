const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, deleteCards, getCards, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', celebrate({
  // валидируем параметры
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/Bearer\s\w{1,}\.{0,}/),
  }).unknown(true),
}), getCards);

router.delete('/:cardId', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/Bearer\s\w{1,}\.{0,}/),
  }).unknown(true),
}), deleteCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).regex(/https?:\/\/\S{0,}.{0,1}\/{0,}#?/),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/Bearer\s\w{1,}\.{0,}/),
  }).unknown(true),
}), createCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/Bearer\s\w{1,}\.{0,}/),
  }).unknown(true),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/Bearer\s\w{1,}\.{0,}/),
  }).unknown(true),
}), dislikeCard);

module.exports = router;
