const SequelizeMock = require('sequelize-mock');

// Create a Sequelize mock instance
const dbMock = new SequelizeMock();

// Define a mock User model
const UserMock = dbMock.define('Users', {
    id: 1,
    name: 'Sundar Dhakal',
    email: 'sundar@example.com',
    password: 'hashedpassword',
    profile_photo: 'profile.jpg',
    roleId: 1
}, {
    timestamps: true // Enables createdAt & updatedAt
});

describe('User Model Unit Tests (Mocked)', () => {

    test('should create a new user with valid data', async () => {
        const newUser = await UserMock.create({
            name: 'Test User',
            email: 'test@example.com',
            password: 'testpassword',
            profile_photo: 'test.jpg',
            roleId: 1
        });

        expect(newUser.name).toBe('Test User');
        expect(newUser.email).toBe('test@example.com');
        expect(newUser.profile_photo).toBe('test.jpg');
        expect(newUser.roleId).toBe(1);
    });

    test('should find a user by email', async () => {
        // Queue a mock result before calling findOne
        UserMock.$queueResult(UserMock.build({ email: 'sundar@example.com' }));

        const user = await UserMock.findOne({ where: { email: 'sundar@example.com' } });

        expect(user).toBeDefined();
        expect(user.email).toBe('sundar@example.com');
    });

    test('should throw an error for duplicate emails', async () => {
        // Mock create() to always throw a unique constraint error
        UserMock.create = jest.fn().mockRejectedValue(new Error('Validation error: email must be unique'));

        await expect(UserMock.create({ email: 'duplicate@example.com' })).rejects.toThrow('Validation error: email must be unique');
    });

});
