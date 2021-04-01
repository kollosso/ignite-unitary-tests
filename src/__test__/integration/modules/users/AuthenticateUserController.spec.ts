import request from 'supertest'
import { Connection } from 'typeorm'
import { hash } from 'bcryptjs'
import { v4 as uuidV4 } from 'uuid'

import { app } from '../../../../app'

import createConnection from '../../../../database'

let connection: Connection

describe('Auth User Controller', () => {
  beforeEach(async () => {
    connection = await createConnection()

    await connection.runMigrations()

    const id = uuidV4()
    const password = await hash('123456', 8)

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
        values('${id}', 'John Qua', 'johnqua@mail.com', '${password}', 'now()', 'now()')
      `
    )
  })
  afterEach(async () => {
    await connection.dropDatabase()
    await connection.close()
  })
  it('should be able to list user profile', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: "johnqua@mail.com",
      password: "123456"
    })

    expect(responseToken.body).toHaveProperty('token')
    expect(responseToken.body).toHaveProperty('user')
  })
})
