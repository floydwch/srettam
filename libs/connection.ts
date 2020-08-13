import IPFS from 'ipfs'
import OrbitDB from 'orbit-db'

const symbol = Symbol.for('orbitdb.connection')

const getConnection = async () => {
  if (global[symbol]) {
    return global[symbol].connection
  }
  const ipfs = await IPFS.create()
  global[symbol] = { connection: await OrbitDB.createInstance(ipfs) }
  return global[symbol].connection
}

export { getConnection }
