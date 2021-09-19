const Cards = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link, likes } = req.body;
  Cards.create({
    name, link, owner: req.user._id, likes,
  })
    .then((card) => {
      const { _id, owner, createdAt } = card;
      res.status(201).send({
        likes, _id, name, link, owner, createdAt,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.deleteCards = (req, res) => {
  Cards.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена.' });
      }
      const {
        name, link, likes, _id, owner, createdAt,
      } = card;
      return res.send({
        likes, _id, name, link, owner, createdAt,
      });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getCards = (req, res) => {
  Cards.find({})
    .then((cards) => {
      if (!cards) {
        return res.status(404).send({ message: 'Карточки не найдены.' });
      }
      const newCards = cards.map((card) => {
        const {
          name, link, likes, _id, owner, createdAt,
        } = card;
        return {
          likes, _id, name, link, owner, createdAt,
        };
      });
      return res.send(newCards);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
module.exports.likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена.' });
      }
      const {
        name, link, likes, _id, owner, createdAt,
      } = card;
      return res.send({
        likes, _id, name, link, owner, createdAt,
      });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена.' });
      }
      const {
        name, link, likes, _id, owner, createdAt,
      } = card;
      return res.send({
        likes, _id, name, link, owner, createdAt,
      });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
