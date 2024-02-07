import { faker } from '@faker-js/faker'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { SignInRequest, SignUpRequest } from '@pengode/auth/auth.dto'
import { Role } from '@pengode/role/role'
import { User } from '@pengode/user/user'
import * as bcrypt from 'bcryptjs'
import { ClsModule } from 'nestjs-cls'
import { newDb } from 'pg-mem'
import { DataSource } from 'typeorm'
import { AuthService } from './auth.service'
import { NotFoundException } from '@nestjs/common'

const rolesDummy: Role[] = [
  { id: 1, name: 'USER', createdAt: new Date(), updatedAt: new Date() },
  { id: 1, name: 'ADMIN', createdAt: new Date(), updatedAt: new Date() },
]

const usersDummy: User[] = Array(100)
  .fill(0)
  .map((_, index) => ({
    id: index + 1,
    username: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    name: faker.person.fullName(),
    password: bcrypt.hashSync('test123', 10),
    photo: faker.internet.url(),
    roles: rolesDummy,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true })
    const ds: DataSource = await db.adapters.createTypeormDataSource({
      type: 'postgres',
      entities: [User, Role],
    })

    db.public.registerFunction({
      name: 'current_database',
      implementation: () => `pengode`,
    })

    db.public.registerFunction({
      name: 'version',
      implementation: () => `1`,
    })

    await ds.initialize()
    await ds.synchronize()

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({}),
        CacheModule.register({}),
        ClsModule.forRoot({}),
        ConfigModule.forRoot({}),
      ],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: ds.getRepository(User),
        },
        {
          provide: getRepositoryToken(Role),
          useValue: ds.getRepository(Role),
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)

    const roleRepository = ds.getRepository(Role)
    const userRepository = ds.getRepository(User)

    await roleRepository.save(rolesDummy)
    await userRepository.save(usersDummy)
  })

  describe('signUp', () => {
    it('should return AuthResponse', async () => {
      const req: SignUpRequest = {
        username: 'test',
        email: 'test@domain.com',
        name: 'User Test',
        password: 'test123',
      }

      const res = await service.signUp(req)

      expect(res).toBeDefined()
      expect(res.accessToken).toBeDefined()
      expect(res.refreshToken).toBeDefined()
      expect(res.user).toBeDefined()
      expect(res.user.username).toEqual(req.username)
    })
  })

  describe('signIn', () => {
    it('should return AuthResponse', async () => {
      const req: SignInRequest = {
        username: usersDummy[0].username,
        password: 'test123',
      }

      const res = await service.signIn(req)

      expect(res).toBeDefined()
      expect(res.accessToken).toBeDefined()
      expect(res.refreshToken).toBeDefined()
      expect(res.user).toBeDefined()
      expect(res.user.username).toEqual(req.username)
    })

    it('should throw NotFoundException', async () => {
      const req: SignInRequest = {
        username: 'test',
        password: 'test123',
      }
      await expect(service.signIn(req)).rejects.toThrow(NotFoundException)
    })
  })
})
