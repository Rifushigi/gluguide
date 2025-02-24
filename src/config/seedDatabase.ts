import {foodItems} from './seedData';
import FoodItem from '../models/Food';

export const seedDatabase = async (): Promise<void> => {
    try {
        for (const item of foodItems) {
            const existingItem = await FoodItem.findOne({ name: item.name });

            if (!existingItem) {
                await FoodItem.create(item);
                console.log(`Inserted: ${item.name} (Category: ${item.category.join(', ')}, Group: ${item.group.join(', ')})`);
            } else {
                console.log(`Skipped: ${item.name} (already exists)`);
            }
        }

        console.log('Seeding completed.');
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};
