import * as ActionTypes from './constants.js'
import { ActionTypes as EntityActionTypes } from '../entities'
import createReducer from '../createReducer.js'

const reducer = createReducer({
  tabs: [],
  activeTabKey: null,
  lastActiveTemplateKey: null
})
export default reducer.export()

reducer.handleAction(ActionTypes.OPEN_TAB, (state, { tab }) => ({
  ...state,
  tabs: state.tabs.filter((t) => t.key === tab.key).length ? state.tabs : [...state.tabs, tab]
}))

reducer.handleAction(ActionTypes.OPEN_NEW_TAB, (state, { tab }) => ({
  ...state,
  activeTabKey: tab.key,
  tabs: [...state.tabs, tab],
  lastActiveTemplateKey: (tab.entitySet === 'templates') ? tab._id : state.lastActiveTemplateKey
}))

reducer.handleActions([EntityActionTypes.REMOVE, ActionTypes.CLOSE_TAB], (state, action) => {
  let newTabs = state.tabs.filter((t) => t.key !== action.key && (!action._id || t._id !== action._id))
  let newActivatTabKey = state.activeTabKey
  if (state.activeTabKey === action.key || state.activeTabKey === action._id) {
    newActivatTabKey = newTabs.length ? newTabs[newTabs.length - 1].key : null
  }

  const newActivatTab = newActivatTabKey ? newTabs.filter((t) => t.key === newActivatTabKey)[0] : null

  return {
    ...state,
    activeTabKey: newActivatTabKey,
    tabs: newTabs,
    lastActiveTemplateKey: (newActivatTab && newActivatTab.entitySet === 'templates') ? newActivatTab._id
      : (newTabs.filter((t) => t._id === state.lastActiveTemplateKey).length ? state.lastActiveTemplateKey : null)
  }
})

reducer.handleAction(ActionTypes.ACTIVATE_TAB, (state, action) => {
  const newTab = state.tabs.filter((t) => t.key === action.key)[0]

  return {
    ...state,
    activeTabKey: action.key,
    lastActiveTemplateKey: newTab.entitySet === 'templates' ? newTab._id : state.lastActiveTemplateKey
  }
})

reducer.handleAction(EntityActionTypes.SAVE_NEW, (state, action) => {
  let index = state.tabs.indexOf(state.tabs.filter((t) => t.key === action.oldId)[0])
  const tab = Object.assign({}, state.tabs[index])
  tab.key = action.entity._id
  tab._id = tab.key

  return {
    ...state,
    tabs: [
      ...state.tabs.slice(0, index),
      tab,
      ...state.tabs.slice(index + 1)],
    activeTabKey: action.entity._id,
    lastActiveTemplateKey: state.lastActiveTemplateKey === action.oldId ? action.entity._id : state.lastActiveTemplateKey
  }
})

reducer.handleAction(EntityActionTypes.REPLACE, (state, action) => {
  if (!state.tabs.filter((t) => t._id === action.oldId).length) {
    return state
  }

  const tabs = state.tabs.map((t) => {
    if (t._id !== action.oldId) {
      return Object.assign({}, t)
    }

    return Object.assign({}, t, {
      _id: action.entity._id,
      key: t.key.replace(action.oldId, action.entity._id)
    })
  })

  return {
    ...state,
    tabs: tabs,
    activeTabKey: (state.activeTabKey && state.activeTabKey.indexOf(action.oldId) === 0) ? state.activeTabKey.replace(action.oldId, action.entity._id) : state.activeTabKey,
    lastActiveTemplateKey: state.lastActiveTemplateKey === action.oldId ? action.entity._id : state.lastActiveTemplateKey
  }
})