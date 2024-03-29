import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import axios from 'axios'
import * as bcrypt from 'bcryptjs'
import { Cache } from 'cache-manager'
import { nanoid } from 'nanoid'
import { ClsService } from 'nestjs-cls'
import { Repository } from 'typeorm'

import {
  AuthResponse,
  SignInRequest,
  SignUpRequest,
  SocialRequest,
} from '@pengode/auth/auth.dto'
import { Role } from '@pengode/role/role'
import { User } from '@pengode/user/user'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly clsService: ClsService,
  ) {}

  async signUp(req: SignUpRequest): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: req.email }, { username: req.username }],
    })
    if (existingUser) {
      throw new ConflictException('username or email already exists')
    }

    const hashedPassword = await bcrypt.hash(req.password, 10)
    const role = await this.roleRepository.findOne({
      where: { name: 'USER' },
    })
    if (!role) {
      throw new NotFoundException(`role user is not found`)
    }

    const newUser = await this.userRepository.save({
      email: req.email,
      username: req.username,
      name: req.name,
      password: hashedPassword,
      roles: [role],
    })

    const tokens = await this.getTokens(newUser.id, newUser.username)

    return AuthResponse.create({ ...tokens, user: newUser })
  }

  async signIn(req: SignInRequest): Promise<AuthResponse> {
    const user = await this.userRepository.findOne({
      where: [{ email: req.username }, { username: req.username }],
      relations: {
        roles: true,
      },
    })
    if (!user) {
      throw new NotFoundException('user does not exists')
    }

    const passwordMatches = await bcrypt.compare(req.password, user.password)
    if (!passwordMatches) {
      throw new BadRequestException('password does not match')
    }

    const tokens = await this.getTokens(user.id, user.username)

    return AuthResponse.create({ ...tokens, user })
  }

  async github(req: SocialRequest): Promise<AuthResponse> {
    const res = await axios.get<{
      email?: string | null
      login: string
      name: string
      avatar_url: string
    }>('https://api.github.com/user', {
      headers: {
        Authorization: `token ${req.token}`,
      },
    })

    let email = res.data.email

    if (!email) {
      const res = await axios.get<
        { email: string; primary: boolean; verified: boolean }[]
      >('https://api.github.com/user/emails', {
        headers: {
          Authorization: `token ${req.token}`,
        },
      })
      if (!res.data.length) {
        throw new BadRequestException('cannot use github. Try another method')
      }

      email = res.data.find(
        ({ email, primary, verified }) => email && primary && verified,
      )?.email
    }

    const user = await this.userRepository.findOne({ where: { email } })
    if (user) {
      const tokens = await this.getTokens(user.id, user.username)
      return AuthResponse.create({ ...tokens, user })
    }

    const role = await this.roleRepository.findOneBy({ name: 'USER' })
    if (!role) {
      throw new NotFoundException(`role user is not found`)
    }

    const createdUser = await this.userRepository.save({
      email,
      username: res.data.login,
      name: res.data.name,
      photo: res.data.avatar_url,
      roles: [role],
      provider: 'GITHUB',
    })
    const tokens = await this.getTokens(createdUser.id, createdUser.username)

    return AuthResponse.create({ ...tokens, user: createdUser })
  }

  async google(req: SocialRequest): Promise<AuthResponse> {
    const res = await axios.get<{
      email: string
      name: string
      picture: string
    }>('https://oauth2.googleapis.com/tokeninfo?id_token=' + req.token)

    const email = res.data.email
    const name = res.data.name
    const username = res.data.email.split('@')[0] + nanoid(4)
    const photo = res.data.picture

    const user = await this.userRepository.findOne({ where: { email } })
    if (user) {
      const tokens = await this.getTokens(user.id, user.username)
      return AuthResponse.create({ ...tokens, user })
    }

    const role = await this.roleRepository.findOneBy({ name: 'USER' })
    if (!role) {
      throw new NotFoundException(`role user is not found`)
    }

    const createdUser = await this.userRepository.save({
      email,
      username,
      name,
      photo,
      roles: [role],
      provider: 'GOOGLE',
    })

    const tokens = await this.getTokens(createdUser.id, createdUser.username)

    return AuthResponse.create({ ...tokens, user: createdUser })
  }

  async signOut(): Promise<void> {
    const userId = this.clsService.get<number>('userId')
    await this.cache.del(`${userId}`)
  }

  async refreshTokens(): Promise<AuthResponse> {
    const userId = this.clsService.get<number>('userId')
    const refreshToken = this.clsService.get<string>('refreshToken')
    const user = await this.userRepository.findOneBy({ id: userId })
    const storedToken = await this.cache.get(`${userId}`)

    if (
      !user ||
      !refreshToken ||
      !storedToken ||
      refreshToken !== storedToken
    ) {
      throw new ForbiddenException('access Denied')
    }

    const refreshTokenMatches = await this.jwtService.verifyAsync(
      refreshToken,
      { secret: this.configService.get<string>('JWT_REFRESH_SECRET') },
    )
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied')
    }

    const tokens = await this.getTokens(user.id, user.username)

    return AuthResponse.create({ ...tokens, user })
  }

  private async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: `${userId}`,
          userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: `${userId}`,
          userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ])

    const ttl = 7 * 24 * 60 * 60 * 1000
    await this.cache.set(`${userId}`, refreshToken, ttl)

    return {
      accessToken,
      refreshToken,
    }
  }
}
