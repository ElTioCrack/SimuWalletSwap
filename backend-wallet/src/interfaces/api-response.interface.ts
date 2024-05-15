import { HttpStatus } from '@nestjs/common';

interface ApiResponse<T> {
  statusCode: HttpStatus;
  success: boolean;
  message: string | null;
  data?: T;
}

export default ApiResponse;
