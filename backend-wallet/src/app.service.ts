import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    if (this.connection.readyState === 1) {
      console.log('🌟 MongoDB connection established successfully! 🌟');
      console.log(`✅ Connected to database: ${this.connection.name}`);
    } else {
      console.log('⚠️ MongoDB connection not established. ⚠️');
      console.log(`❌ Attempted to connect to database: ${this.connection.name}`);
    }
  }
}
