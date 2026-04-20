import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersRepository } from './entities/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserInput: CreateUserInput) {
    // 1. Kiểm tra Email Unique
    try {
      const existingUser = await this.usersRepository.findOne({
        email: createUserInput.email,
      });

      if (existingUser) {
        throw new UnprocessableEntityException('Email này đã được sử dụng.');
      }
    } catch (err) {
      // Nếu là lỗi "Email đã sử dụng" thì ném ra cho Resolver bắt
      if (err instanceof UnprocessableEntityException) {
        throw err;
      }
      // Nếu là lỗi NotFound từ Repository thì kệ nó, nghĩa là email chưa có -> Hợp lệ để tạo
    }

    // 2. Tiến hành tạo user như cũ
    return this.usersRepository.create({
      ...createUserInput,
      password: await this.hashPassword(createUserInput.password),
    });
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  findAll() {
    return this.usersRepository.find({});
  }

  findOne(_id: string) {
    return this.usersRepository.findOne({ _id });
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    // Loại bỏ hoàn toàn _id khỏi dữ liệu cập nhật để tránh lỗi MongoDB
    const { _id: unusedId, password, ...rest } = updateUserInput;

    const updatePayload: any = { ...rest };

    if (password) {
      updatePayload.password = await this.hashPassword(password);
    }

    return this.usersRepository.findOneAndUpdate(
      { _id }, // Dùng _id lấy từ Token để tìm đúng user đang đăng nhập
      { $set: updatePayload },
    );
  }

  remove(_id: string) {
    return this.usersRepository.findOneAndDelete({ _id });
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersRepository.findOne({ email });
      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) {
        throw new UnauthorizedException('Sai mật khẩu hoặc email.');
      }
      return user;
    } catch (err) {
      // Nếu không tìm thấy user hoặc password sai, trả về lỗi chung để bảo mật
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác.');
    }
  }
}
