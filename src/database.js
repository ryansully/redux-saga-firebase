import { eventChannel } from 'redux-saga'
import { call } from 'redux-saga/effects'

function * read (pathOrRef) {
  const ref = this._getRef(pathOrRef, 'database')
  const result = yield call([ref, ref.once], 'value')

  return result.val()
}

function * create (pathOrRef, data) {
  const ref = this._getRef(pathOrRef, 'database')
  const result = yield call([ref, ref.push], data)

  return result.key
}

function * update (pathOrRef, data) {
  const ref = this._getRef(pathOrRef, 'database')
  yield call([ref, ref.set], data)
}

function * patch (pathOrRef, data) {
  const ref = this._getRef(pathOrRef, 'database')
  yield call([ref, ref.update], data)
}

function * _delete (pathOrRef) {
  const ref = this._getRef(pathOrRef, 'database')
  yield call([ref, ref.remove])
}

function channel (pathOrRef, event = 'value') {
  const ref = this._getRef(pathOrRef, 'database')

  const channel = eventChannel(emit => {
    const callback = ref.on(
      event,
      dataSnapshot => emit({
        snapshot: dataSnapshot,
        value: dataSnapshot.val()
      })
    )

    // Returns unsubscribe function
    return () => ref.off(event, callback)
  })

  return channel
}

export default {
  read,
  create,
  update,
  patch,
  delete: _delete,
  channel
}
