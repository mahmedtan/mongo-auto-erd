import { getERD } from '@useCases/getERD'
import 'reflect-metadata'
jest.setTimeout(5000000)

describe('getERD', () => {
  it('should get an ERD', async () => {
    await getERD(
      await global.mongod.getConnectionString(),
      await global.mongod.getDbName(),
      './file.json'
    )
  })
})
