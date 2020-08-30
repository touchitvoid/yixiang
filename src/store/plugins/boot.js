import { setToken, getToken, removeToken } from '@/libs/util'

const USER_INFO_STORAGE_KEY = 'userInfo'

function registerWatchers (store) {
  store.subscribe(async ({ type, payload }) => {
    switch (type) {
      case 'user/SET_TOKEN' :

        if (payload) {
          setToken(payload)
        } else {
          removeToken()
          localStorage.removeItem(USER_INFO_STORAGE_KEY)
          return
        }

        await store.dispatch('user/fetchCurrentUserInfo')

        break
      case 'user/SET_INFO' :
        if (typeof payload !== 'object') break

        await localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(payload))
    }
  })
}

function importStorageData (store) {
  store.commit('auth/SET_TOKEN', getToken() || null)
  store.commit('user/SET_USER', JSON.parse(localStorage.getItem(USER_INFO_STORAGE_KEY) || '{}'))
}

export default store => {
  registerWatchers(store)

  importStorageData(store)
}
