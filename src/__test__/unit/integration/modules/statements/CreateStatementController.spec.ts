import request from 'supertest'
import { Connection } from 'typeorm'
import { hash } from 'bcryptjs'
import { v4 as uuidV4 } from 'uuid'

import { app } from '../../../../../app'

import createConnection from '../../../../../database'

let connection: Connection

describe('Create Statement Controller', () => {
  beforeAll(async () => {
    connection = await createConnection()

    await connection.runMigrations()

    const id = uuidV4()
    const password = await hash('123456', 8)

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
        values('${id}', 'John Doe', 'johndoe@mail.com', '${password}', 'now()', 'now()')
      `
    )
  })
  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })
  it('should be able to create a new statement deposit', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: "johndoe@mail.com",
      password: "123456"
    })

    const { token } = responseToken.body

    const response = await request(app).post('/api/v1/statements/deposit').send({
      amount: 100,
      description: "New deposit"
    }).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201)
  })
  it('should be able to create a new statement withdraw', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: "johndoe@mail.com",
      password: "123456"
    })

    const { token } = responseToken.body

    await request(app).post('/api/v1/statements/deposit').send({
      amount: 100,
      description: "New deposit"
    }).set({
      Authorization: `Bearer ${token}`
    })

    const response = await request(app).post('/api/v1/statements/withdraw').send({
      amount: 99,
      description: "New withdraw"
    }).set({
      Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(201)
  })
})
