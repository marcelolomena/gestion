import React, {Component} from 'react'
import ReactList from 'react-list'
import style from './EntityTree.scss'
import { entitySets, entityTreeIconResolvers } from '../../lib/configuration.js'

const getEntityName = (e) => entitySets[e.__entitySet].nameAttribute ? e[entitySets[e.__entitySet].nameAttribute] : e.name

export default class EntityTree extends Component {
  static propTypes = {
    entities: React.PropTypes.object.isRequired,
    activeEntity: React.PropTypes.object,
    onClick: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func.isRequired,
    onRename: React.PropTypes.func.isRequired,
    onNewClick: React.PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = { filter: '' }
  }

  componentDidMount () {
    window.addEventListener('click', () => this.tryHide())
  }

  componentWillUnmount () {
    window.removeEventListener('click', () => this.tryHide())
  }

  createRenderer (entities) {
    return (index, key) => this.renderNode(entities[index])
  }

  tryHide () {
    if (this.state.contextMenuId) {
      this.setState({ contextMenuId: null })
    }
  }

  contextMenu (e, entity) {
    e.preventDefault()
    this.setState({ contextMenuId: entity._id })
  }

  renderContextMenu (entity) {
    const { onRemove, onRename } = this.props

    return <div className={style.contextMenuContainer}>
      <div className={style.contextMenu}>
        <div
          className={style.contextButton}
          onClick={(e) => { e.stopPropagation(); onRename(entity._id); this.tryHide() }}>
          <i className='fa fa-pencil' /> Rename
        </div>
        <div
          className={style.contextButton}
          onClick={(e) => { e.stopPropagation(); onRemove(entity._id); this.tryHide() }}>
          <i className='fa fa-trash' /> Delete
        </div>
      </div>
    </div>
  }

  resolveEntityTreeIconStyle (entity) {
    for (const k in entityTreeIconResolvers) {
      const mode = entityTreeIconResolvers[k](entity)
      if (mode) {
        return mode
      }
    }

    return null
  }

  renderNode (entity) {
    const { activeEntity } = this.props
    const { contextMenuId } = this.state

    const enityStyle = this.resolveEntityTreeIconStyle(entity)

    return <div
      onContextMenu={(e) => this.contextMenu(e, entity)}
      onClick={() => this.props.onClick(entity._id)}
      key={entity._id}
      className={style.link + ' ' + ((activeEntity && entity._id === activeEntity._id) ? style.active : '')}>
      <i className={style.entityIcon + ' fa ' +  (enityStyle || (entitySets[entity.__entitySet].faIcon || style.entityDefaultIcon))}></i>
      <a>{entity[entitySets[entity.__entitySet].nameAttribute] + (entity.__isDirty ? '*' : '')}</a>
      {contextMenuId === entity._id ? this.renderContextMenu(entity) : <div />}
    </div>
  }

  collapse (k) {
    this.setState({ [k]: !this.state[k] })
  }

  renderObjectSubTree (k, entities) {
    return <div key={k} className={style.nodeBox}><span
      className={style.nodeTitle + ' ' + (this.state[k] ? style.collapsed : '')}
      onClick={() => this.collapse(k)}>{k}</span>
      <a key={k + 'new'} onClick={() => this.props.onNewClick(k)} className={style.add}></a>

      <div className={style.nodeContainer + ' ' + (this.state[k] ? style.collapsed : '')}>
        <ReactList itemRenderer={this.createRenderer(entities)} length={entities.length} />
      </div>
    </div>
  }

  filterEntities (entities) {
    const filter = this.state.filter
    if (filter === '') {
      return entities
    }

    let result = {}
    Object.keys(entities).forEach((k) => {
      result[k] = entities[k].filter((e) => getEntityName(e).indexOf(filter) !== -1)
    })

    return result
  }

  setFilter (text) {
    this.setState({ filter: text })
  }

  render () {
    const entities = this.filterEntities(this.props.entities)

    return <div className={style.treeListContainer}>
      <div>
        <div className={style.search}><input type='text' onChange={(ev) => this.setFilter(ev.target.value)}></input>
        </div>
      </div>
      <div className={style.nodesBox}>
        {Object.keys(entitySets).map((k) => this.renderObjectSubTree(k, entities[k] || []))}
      </div>
    </div>
  }
}
