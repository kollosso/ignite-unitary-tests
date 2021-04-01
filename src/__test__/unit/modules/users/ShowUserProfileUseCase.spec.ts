import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase"
import { ShowUserProfileUseCase } from "../../../../modules/users/useCases/showUserProfile/ShowUserProfileUseCase"
import { AppError } from "../../../../shared/errors/AppError"

let userRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase

describe('ShowUserProfileUseCase', () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory)
  })
  it('should be able to list user', async () => {
    const user = await createUserUseCase.execute({
      name: "John doe",
      email: "johndoe@mail.com",
      password: "123456"
    })

    const user_id: string = user.id as string


    const profile = await showUserProfileUseCase.execute(user_id)

    expect(profile).toBe(profile)
  })
  it('should not be able to list user', () => {
    expect(async () => {
      const user_id: string = 'non-existing-user-id'

      await showUserProfileUseCase.execute(user_id)

    }).rejects.toBeInstanceOf(AppError)
  })
})
