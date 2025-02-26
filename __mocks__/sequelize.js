const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Define a mocked User model
const UserMock = dbMock.define('User', {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashedpassword',
  profile_photo: 'profile.jpg',
  roleId: 1
});

module.exports = { dbMock, UserMock };
