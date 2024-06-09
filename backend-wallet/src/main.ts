import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  try {
    console.log('🚀  Nest.js Application');

    const port = process.env.PORT || 3000;
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    // Configuración de Swagger
    const config = new DocumentBuilder()
      .setTitle('NestJS API')
      .setDescription('The NestJS API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(port);
    console.log(`🔗  Application running on URL: http://localhost:${port}`);
  } catch (error) {
    console.error('❌  Error starting the application:', error);
  }
}

bootstrap();
