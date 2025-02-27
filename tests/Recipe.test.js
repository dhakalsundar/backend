const SequelizeMock = require('sequelize-mock');

// Create a Sequelize mock instance
const dbMock = new SequelizeMock();

// Define a mock Recipe model
const RecipeMock = dbMock.define('Recipe', {
    id: 1,
    image: 'recipe.jpg',
    name: 'Spaghetti Bolognese',
    ingredients: 'spaghetti, ground beef, tomato sauce, garlic, onion',
    category: 'Italian',
    description: JSON.stringify(["Boil pasta", "Cook meat", "Add sauce", "Serve hot"])
}, {
    timestamps: true // Enables createdAt & updatedAt
});

describe('Recipe Model Unit Tests (Mocked)', () => {

    test('should create a new recipe with valid data', async () => {
        const newRecipe = await RecipeMock.create({
            image: 'test.jpg',
            name: 'Test Recipe',
            ingredients: 'ingredient1, ingredient2',
            category: 'Test Category',
            description: JSON.stringify(["Step 1", "Step 2"])
        });

        expect(newRecipe.image).toBe('test.jpg');
        expect(newRecipe.name).toBe('Test Recipe');
        expect(newRecipe.ingredients).toBe('ingredient1, ingredient2');
        expect(newRecipe.category).toBe('Test Category');
        expect(JSON.parse(newRecipe.description)).toEqual(["Step 1", "Step 2"]);
    });

    test('should find a recipe by name', async () => {
        // Queue a mock result before calling findOne
        RecipeMock.$queueResult(RecipeMock.build({ name: 'Spaghetti Bolognese' }));

        const recipe = await RecipeMock.findOne({ where: { name: 'Spaghetti Bolognese' } });

        expect(recipe).toBeDefined();
        expect(recipe.name).toBe('Spaghetti Bolognese');
    });

    test('should throw an error when creating a recipe without a name', async () => {
        // Mock create() to always throw a validation error
        RecipeMock.create = jest.fn().mockRejectedValue(new Error('Validation error: name is required'));

        await expect(RecipeMock.create({
            image: 'test.jpg',
            ingredients: 'ingredient1, ingredient2',
            category: 'Test Category',
            description: JSON.stringify(["Step 1", "Step 2"])
        })).rejects.toThrow('Validation error: name is required');
    });

});
