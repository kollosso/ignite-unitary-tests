import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase"
import { AppError } from "../../../../shared/errors/AppError"

let userRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe('CreateUserUseCase', () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
  })
  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: "John doe",
      email: "johndoe@mail.com",
      password: "123456"
    })

    expect(user).toHaveProperty('id')
  })
  it('should not be able to create a new user with exists', async () => {

    await expect(async () => {
      const user = {
        name: "John doe",
        email: "johndoe@mail.com",
        password: "123456"
      }
      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      })
      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
