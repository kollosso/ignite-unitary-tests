import { AppError } from "../../../../shared/errors/AppError"

import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase"
import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository"

import { InMemoryStatementsRepository } from "../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../../../../modules/statements/useCases/createStatement/CreateStatementUseCase"
import { ICreateStatementDTO } from "../../../../modules/statements/useCases/createStatement/ICreateStatementDTO"

let userRepositoryInMemory: InMemoryUsersRepository
let statementsRepositoryInMemory: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('CreateStatementUseCase', () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository()
    statementsRepositoryInMemory = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementsRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory)
  })
  it('should be able to create a new deposit statement', async () => {
    const user = await createUserUseCase.execute({
      name: "John doe",
      email: "johndoe@mail.com",
      password: "123456"
    })

    const statementOperation: ICreateStatementDTO = {
      user_id: user.id as string,
      description: "New deposit",
      amount: 100,
      type: OperationType['DEPOSIT']
    }
    await createStatementUseCase.execute(statementOperation)

    expect(statementOperation).toBe(statementOperation)
  })
  it('should not be able to create a new withdrawal statement if deposit to smaller', async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "John doe",
        email: "johndoe@mail.com",
        password: "123456"
      })

      const statementOperation: ICreateStatementDTO = {
        user_id: user.id as string,
        description: "Test",
        amount: 100,
        type: OperationType['WITHDRAW']
      }
      await createStatementUseCase.execute(statementOperation)

    }).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to create a new withdraw statement', async () => {
    const user = await createUserUseCase.execute({
      name: "John doe",
      email: "johndoe@mail.com",
      password: "123456"
    })

    const statementDepositOperation: ICreateStatementDTO = {
      user_id: user.id as string,
      description: "New deposit",
      amount: 100,
      type: OperationType['DEPOSIT']
    }
    await createStatementUseCase.execute(statementDepositOperation)

    const statementOperation: ICreateStatementDTO = {
      user_id: user.id as string,
      description: "New withdraw",
      amount: 99,
      type: OperationType['WITHDRAW']
    }
    await createStatementUseCase.execute(statementOperation)

    expect(statementOperation).toBe(statementOperation)
  })
})
