const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, deleteCards, getCards, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.delete('/:cardId', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).regex(/https?:\/\/\S{0,}.{0,1}\/{0,}#?/),
  }),
}), createCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), dislikeCard);

module.exports = router;
