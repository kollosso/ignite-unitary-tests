import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

interface IRequest {
  remittee_id: string
  user_id: string
  description: string
  amount: number
  type: OperationType
}


@injectable()
class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }
  async execute({ remittee_id, amount, description, type, user_id }: IRequest) {
    const user = await this.usersRepository.findById(user_id)
    const remittee = await this.usersRepository.findById(remittee_id)

    if (!user) {
      throw new AppError('User does not exits')
    }

    if (!remittee) {
      throw new AppError('User does not exits')
    }

    if (type === 'withdraw') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      if (balance < amount) {
        throw new AppError('Insuficiente amount')
      }
    }

    await this.statementsRepository.create({
      user_id,
      amount,
      description,
      type: OperationType.WITHDRAW,
    })

    await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.DEPOSIT,
      user_id: remittee_id
    })

    const transfer = await this.statementsRepository.create({
      user_id,
      amount,
      description,
      type: OperationType['TRANSFER'],
    })

    return transfer

  }
}

export { CreateTransferUseCase }
