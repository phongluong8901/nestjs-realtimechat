import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './strategies/token-payload.interface';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: User, response: Response) {
    // 1. Lấy thời gian hết hạn từ config (đảm bảo là số)
    const jwtExpiration = Number(
      this.configService.getOrThrow('JWT_EXPIRATION_TIME'),
    );

    // 2. Tính toán thời điểm hết hạn cho Cookie (Date object)
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + jwtExpiration);

    // 3. Tạo Payload
    const tokenPayload: TokenPayload = {
      _id: user._id!.toHexString(),
      email: user.email,
    };

    // 4. Ký Token
    // expiresIn nhận vào number (giây) hoặc string ('1h', '2d')
    const token = this.jwtService.sign(tokenPayload, {
      expiresIn: jwtExpiration,
    });

    // 5. Gửi Cookie về Client
    response.cookie('Authentication', token, {
      httpOnly: true, // Bảo mật, chặn JS truy cập cookie
      expires, // Thời gian sống của cookie khớp với JWT
      path: '/', // Cookie có hiệu lực cho toàn bộ domain
    });

    return user;
  }

  static verifyWs(request: any): TokenPayload {
    const cookieHeader = request.headers?.cookie || '';
    const authCookie = cookieHeader
      .split('; ')
      .find((c) => c.trim().startsWith('Authentication='));

    if (!authCookie) {
      throw new Error('JWT not found in cookies');
    }

    const token = authCookie.split('=')[1];

    // 1. Giải quyết lỗi TS2769: Đảm bảo Secret không bị undefined
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    try {
      // 2. Giải quyết lỗi TS2352: Ép kiểu qua unknown trước khi ép về TokenPayload
      // Điều này báo cho TS rằng chúng ta tin tưởng cấu hình của token này
      return jwt.verify(token, secret) as unknown as TokenPayload;
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }

  logout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }
}
