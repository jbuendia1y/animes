import * as readline from 'readline';
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserSchema } from '../src/modules/users/entities/user.entity';
import configuration from '../src/config/configuration';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongoUri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
class AppModule {}

async function createAdmin() {
  const username = await question('username: ');
  const password = await question('password: ');

  if (!username || !password) {
    console.error('username and password are required');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);
  const UserModel = app.get(`${User.name}Model`);

  const existingUser = await UserModel.findOne({ username });
  if (existingUser) {
    console.error('User already exists');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = new UserModel({
    username,
    password: hashedPassword,
    isAdmin: true,
  });

  await user.save();
  
  console.log(`Admin user "${username}" created successfully!`);
  
  await app.close();
  rl.close();
}

createAdmin();
