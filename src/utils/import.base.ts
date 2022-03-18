import fs from 'fs';
import path from 'path';
import User from '../resources/user/user.model';
import Food from '../resources/food/food.model';

const importDefaultUserData = async () => {
  try {
    await User.deleteMany();
    const data = JSON.parse(fs.readFileSync(path.join('data', 'users.json'), 'utf-8'));
    await User.create(data, { validateBeforeSave: false });
    console.log('User import is ready!');
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const importDefaultFoodData = async () => {
  try {
    await Food.deleteMany();
    const data = JSON.parse(fs.readFileSync(path.join('data', 'foods.json'), 'utf-8'));
    await Food.create(data, { validateBeforeSave: false });
    console.log('Food import is ready!');
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const importDefaultData = async (): Promise<boolean> => {
  if (process.argv[2] === '--import') {
    console.log('import data....');
    const foods = await Food.find();
    const users = await User.find();

    if (!users || users.length === 0) {
      console.log('No users in database! Import base documents...');
      await importDefaultUserData();
    }
    if (!foods || foods.length === 0) {
      console.log('No foods in database! Import base documents...');
      await importDefaultFoodData();
    }
    return true;
  } else {
    return false;
  }
};

export default importDefaultData;
