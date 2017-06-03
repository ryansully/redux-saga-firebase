import { eventChannel } from 'redux-saga'
import { call } from 'redux-saga/effects'

function * signInAnonymously () {
  const auth = this.app.auth()
  return yield call([auth, auth.signInAnonymously])
}

function * signInWithPopup (authProvider) {
  const auth = this.app.auth()
  const { credential } = yield call([auth, auth.signInWithPopup], authProvider)

  return credential
}

function * signOut () {
  const auth = this.app.auth()
  yield call([auth, auth.signOut])
}

function channel () {
  if (this._authChannel) return this._authChannel

  const auth = this.app.auth()
  const channel = eventChannel(emit => {
    const unsubscribe = auth.onAuthStateChanged(
      user => emit({ user }),
      error => emit({ error })
    )

    return unsubscribe
  })

  this._authChannel = channel
  return channel
}

export default {
  channel,
  signInAnonymously,
  signInWithPopup,
  signOut
}
