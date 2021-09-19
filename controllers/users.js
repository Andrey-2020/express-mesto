const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      const { _id } = user;
      res.status(201).send({
        name, about, avatar, _id,
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

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      const {
        name, about, avatar, _id,
      } = user;
      return res.send({
        name, about, avatar, _id,
      });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      const {
        name, about, avatar, _id,
      } = users;
      return res.send({
        data: {
          name, about, avatar, _id,
        },
      });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      const {
        avatar, _id,
      } = user;
      return res.send({
        name, about, avatar, _id,
      });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.params.avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      const {
        name, about, avatar, _id,
      } = user;
      return res.send({
        name, about, avatar, _id,
      });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
