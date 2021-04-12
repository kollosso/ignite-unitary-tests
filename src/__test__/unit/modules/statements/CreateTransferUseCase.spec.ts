import { InMemoryStatementsRepository } from "../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { CreateTransferUseCase } from "../../../../modules/statements/useCases/createTransfer/CreateTransferUseCase"
import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository"

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createTransferUseCase: CreateTransferUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

describe('Create transfer', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createTransferUseCase = new CreateTransferUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })
  it('should be able to create a new transfer', async () => {
    const sender = await inMemoryUsersRepository.create({
      name: 'John doe',
      email: 'johndoe@mail.com',
      password: '123456'
    })

    const remittee = await inMemoryUsersRepository.create({
      name: 'John doe',
      email: 'johndoe@mail.com',
      password: '123456'
    })

    await inMemoryStatementsRepository.create({
      user_id: String(sender.id),
      amount: 80,
      description: 'Create withdraw',
      type: OperationType['WITHDRAW']
    })

    await inMemoryStatementsRepository.create({
      user_id: String(remittee.id),
      amount: 80,
      description: 'Create withdraw',
      type: OperationType['DEPOSIT']
    })

    const transfer = await createTransferUseCase.execute({
      user_id: String(sender.id),
      remittee_id: String(remittee.id),
      amount: 100,
      description: 'Create transfer',
      type: OperationType['TRANSFER'],
    })

    console.log(transfer)

    expect(transfer).toHaveProperty('id')
  })
})
