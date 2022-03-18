import App from './app';
import FoodController from './resources/food/food.controller';
import UserController from './resources/user/user.controller';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([new FoodController(), new UserController()], Number(process.env.PORT));

app.listen();
