import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ICreateStatementDTO } from '../createStatement/ICreateStatementDTO';
import { CreateTransferUseCase } from './CreateTransferUseCase';


class CreateTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user
    const { id: remittee_id } = request.params
    const { amount, description, type } = request.body as ICreateStatementDTO

    const createTransferUseCase = container.resolve(CreateTransferUseCase)

    const transfer = await createTransferUseCase.execute({ remittee_id, amount, description, type, user_id })

    return response.json(transfer)
  }
}

export { CreateTransferController }
