import Cookies from 'js-cookie'

const TokenKey = 'bee_admin_template_token'
const RolesKey = 'bee_admin_template_roles'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}


export function getRoles() {
  var str = Cookies.get(RolesKey)
  if (str != null) {
    return JSON.parse(str)
  }
  return str
}

export function setRoles(role) {
  var str = JSON.stringify(role)
  return Cookies.set(RolesKey, str)
}

export function removeRoles() {
  return Cookies.remove(RolesKey)
}

