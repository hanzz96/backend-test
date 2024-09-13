import { HttpException, HttpStatus, BadRequestException } from "@nestjs/common";

export class CacheLockException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.CONFLICT);
    }
}