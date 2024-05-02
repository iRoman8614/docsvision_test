import {createStore, createEvent} from 'effector'

export const clearId = createEvent<string>()
export const choosePlace = createEvent<string>()
export const chooseItem = createEvent<string|undefined>()
export const $storePlaceId = createStore('')
    .on(choosePlace, (_, id ) => id)
    .reset(clearId)
export const $storeItemId = createStore('')
    .on(chooseItem, (_, id ) => id)
    .reset(clearId)
export const chechChildrenLevels = createEvent<boolean>()
export const $childrenLevels = createStore(true)
    .on(chechChildrenLevels, (_, check ) =>  check)
