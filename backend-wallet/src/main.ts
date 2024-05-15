import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('\n🚀  Nest.js Application\n');

    const port = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(port);

    console.log(`\n🔗  Application running on URL: http://localhost:${port}\n`);
  } catch (error) {
    console.error('\n❌  Error starting the application:', error);
  }
}

bootstrap();
