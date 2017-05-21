export const findByName = (list, name) => list.find(item => item.name === name)

export const buildUserCallState = (userObj, string) => ({ ...userObj, callState: string })

export const updateUser = (list, name, updated) => {
  const updatedIndex = list.findIndex(item => item.name === name)
  return [
    ...list.slice(0, updatedIndex),
    updated,
    ...list.slice(updatedIndex + 1)
  ]
}
