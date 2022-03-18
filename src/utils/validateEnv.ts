import { cleanEnv, str, port } from 'envalid';

const validateEnv = (): void => {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'production'],
    }),
    // MONGO_PASSWORD: str(),
    // MONGO_PATH: str(),
    // MONGO_USER: str(),
    PORT: port({ default: 3000 }),
    JWT_SECRET: str(),
    JWT_EXPIRES_IN: str(),
    JWT_COOKIE_EXPIRES_IN: str(),
  });
};

export default validateEnv;
