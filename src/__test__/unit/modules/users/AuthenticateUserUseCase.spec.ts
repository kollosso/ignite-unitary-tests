import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase"
import { AppError } from "../../../../shared/errors/AppError"

let userRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase

describe('AuthenticateUserUseCase', () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    authenticateUserUseCase = new AuthenticateUserUseCase(userRepositoryInMemory)
  })
  it('should be able to create a new session', async () => {
    const user = {
      name: "John doe",
      email: "johndoe@mail.com",
      password: "123456"
    }
    await createUserUseCase.execute(user)

    const session = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(session).toHaveProperty('token')
  })
  it('should not be able to authenticate an nonexistent user', async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'non-exist',
        password: 'non-exist'
      })
    }).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to authenticate with incorrect password', async () => {
    expect(async () => {
      const user = {
        name: "John doe",
        email: "johndoe@mail.com",
        password: "123456"
      }
      await createUserUseCase.execute(user)

      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'non-exists'
      })
    }).rejects.toBeInstanceOf(AppError)
  })
  it('should be able to create a new session', async () => {
    const user = {
      name: "John doe",
      email: "johndoe@mail.com",
      password: "123456"
    }
    await createUserUseCase.execute(user)

    await expect(authenticateUserUseCase.execute({
      email: 'johndoe@mail.com',
      password: 'wrong-password'
    })).rejects.toBeInstanceOf(AppError)
  })
})
