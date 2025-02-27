const { registerUser, loginUser } = require('../controllers/userController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock Sequelize Model
jest.mock('../model/userModel', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  findAll: jest.fn(),
  destroy: jest.fn(),
}));

const User = require('../model/userModel');

describe('User Controller - Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('should register a new user', async () => {
    const req = { body: { name: 'Sundar Dhakal', email: 'sundar@example.com', password: 'password123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findOne.mockResolvedValue(null); // Simulate no existing user
    User.create.mockResolvedValue({
      id: 1,
      name: req.body.name,
      email: req.body.email,
      profile_photo: null,
    });

    await registerUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    expect(User.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully!',
      user: {
        id: 1,
        name: 'Sundar Dhakal',
        email: 'sundar@example.com',
        profile_photo: null,
      },
    });
  });

  test('should return error if user already exists', async () => {
    const req = { body: { name: 'Sundar Dhakal', email: 'sundar@example.com', password: 'password123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    User.findOne.mockResolvedValue({ id: 1, email: req.body.email }); // Simulate user already exists

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists with this email.' });
  });

});
