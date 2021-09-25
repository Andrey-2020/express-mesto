const Cards = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Cards.create({
    name, link, owner: req.user._id,
  })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCards = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена.');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалять чужие карточки.');
      }
      return Cards.findByIdAndRemove(req.params.cardId)
        .then((removedCard) => {
          if (!removedCard) {
            throw new NotFoundError('Карточка не найдена.');
          }
          return res.status(200).send(removedCard);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError(err.message));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => {
      if (!cards.length) {
        throw new NotFoundError('Карточки не найдены.');
      }
      return res.status(200).send(cards);
    })
    .catch((err) => next(err));
};
module.exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена.');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(400).send({message: err.message});
        next(new BadRequestError(err.message));
      } else {
        // res.status(500).send({ message: err.message });
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена.');
        // return res.status(404).send({ message: 'Карточка не найдена.' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};
