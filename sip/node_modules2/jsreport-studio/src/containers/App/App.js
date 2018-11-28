import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import { actions, selectors } from 'redux/editor'
import * as entities from 'redux/entities'
import Preview from '../../components/Preview/Preview.js'
import EntityTree from '../../components/EntityTree/EntityTree.js'
import Properties from '../../components/Properties/Properties.js'
import style from './App.scss'
import Toolbar from '../../components/Toolbar/Toolbar.js'
import Helmet from 'react-helmet'
import SplitPane from '../../components/common/SplitPane/SplitPane.js'
import EditorTabs from '../../components/Tabs/EditorTabs.js'
import TabTitles from '../../components/Tabs/TabTitles.js'
import Modal from '../Modal/Modal.js'
import NewEntityModal from '../../components/Modals/NewEntityModal.js'
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal.js'
import CloseConfirmationModal from '../../components/Modals/CloseConfirmationModal.js'
import RenameModal from '../../components/Modals/RenameModal.js'
import * as progress from '../../redux/progress'
import cookies from 'js-cookie'
import { triggerSplitResize, removeHandler, registerPreviewHandler, entitySets, shouldOpenStartupPage, registerCollapseLeftHandler } from '../../lib/configuration.js'

const progressActions = progress.actions

@connect((state) => ({
  entities: state.entities,
  references: entities.selectors.getReferences(state),
  activeTabKey: state.editor.activeTabKey,
  activeTabWithEntity: selectors.getActiveTabWithEntity(state),
  isPending: progress.selectors.getIsPending(state),
  canRun: selectors.canRun(state),
  canSave: selectors.canSave(state),
  canSaveAll: selectors.canSaveAll(state),
  canReformat: selectors.canReformat(state),
  tabsWithEntities: selectors.getTabWithEntities(state),
  activeEntity: selectors.getActiveEntity(state),
  lastActiveTemplate: selectors.getLastActiveTemplate(state)
}), { ...actions, ...progressActions })
export default class App extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  static propTypes = {
    entities: PropTypes.object,
    references: PropTypes.object,
    tabsWithEntities: PropTypes.array,
    currentDetail: PropTypes.object,
    error: PropTypes.string,
    loading: PropTypes.bool,
    loaded: PropTypes.bool
  };

  componentDidMount () {
    window.onbeforeunload = () => {
      if (this.props.canSaveAll) {
        return 'You may have unsaved changes'
      }
    }

    registerPreviewHandler((src) => {
      if (!src) {
        this.handleRun()
      }
    })

    registerCollapseLeftHandler(() => {
      this.refs.leftPane.collapse(true)
    })

    if (this.props.params.shortid) {
      this.props.openTab({ shortid: this.props.params.shortid, entitySet: this.props.params.entitySet })
      return
    }

    this.openStartup()
  }

  componentDidUpdate () {
    this.props.updateHistory()
  }

  async handleRun (target) {
    this.props.start()
    cookies.set('render-complete', false)

    const interval = setInterval(() => {
      if (cookies.get('render-complete') === 'true') {
        clearInterval(interval)
        this.props.stop()
      }
    }, 1000)

    this.props.run(target)
  }

  openModal (componentOrText, options) {
    this.refOpenModal(componentOrText, options)
  }

  save () {
    return this.props.save()
  }

  saveAll () {
    return this.props.saveAll()
  }

  handleSplitChanged () {
    triggerSplitResize()
    this.refs.preview.resizeStarted()
  }

  openStartup () {
    if (shouldOpenStartupPage) {
      this.props.openTab({ key: 'StartupPage', editorComponentKey: 'startup', title: 'Startup' })
    }
  }

  closeTab (key) {
    const entity = entities.selectors.getById(this.context.store.getState(), key, false)
    if (!entity || !entity.__isDirty) {
      return this.props.closeTab(key)
    }
    this.openModal(CloseConfirmationModal, { _id: key })
  }

  handleSplitDragFinished () {
    this.refs.preview.resizeEnded()
  }

  render () {
    const { tabsWithEntities, references, isPending, canRun, canSave, canSaveAll, canReformat, activeTabWithEntity, entities,
      openTab, stop, activateTab, activeTabKey, activeEntity, update, groupedUpdate, reformat } = this.props

    return (
      <div className='container'>
        <Helmet />
        <Modal ref='modal' openCallback={(open) => { this.refOpenModal = open }} />

        <div className={style.appContent + ' container'}>
          <div className='block'>
            <Toolbar
              canRun={canRun} canSave={canSave} canSaveAll={canSaveAll} onSave={() => this.save()}
              onSaveAll={() => this.saveAll()} isPending={isPending} activeTab={activeTabWithEntity} onUpdate={update}
              canReformat={canReformat} onReformat={reformat}
              onRun={(target) => this.handleRun(target)} openStartup={() => this.openStartup()} />

            <div className='block'>
              <SplitPane
                ref='leftPane'
                collapsedText='Objects / Properties' collapsable='first'
                resizerClassName='resizer' defaultSize='85%' onChange={() => this.handleSplitChanged()}
                onDragFinished={() => this.handleSplitDragFinished()}>
                <SplitPane
                  resizerClassName='resizer-horizontal' split='horizontal'
                  defaultSize={(window.innerHeight * 0.5) + 'px'}>
                  <EntityTree
                    onRename={(id) => this.openModal(RenameModal, { _id: id })}
                    onRemove={(id) => removeHandler ? removeHandler(id) : this.openModal(DeleteConfirmationModal, {_id: id})}
                    activeEntity={activeEntity} entities={references} onClick={(_id) => openTab({_id: _id})}
                    onNewClick={(es) => entitySets[es].onNew ? entitySets[es].onNew() : this.openModal(NewEntityModal, {entitySet: es})} />
                  <Properties entity={activeEntity} entities={entities} onChange={update} />
                </SplitPane>

                <div className='block'>
                  <TabTitles
                    activeTabKey={activeTabKey} activateTab={activateTab} tabs={tabsWithEntities}
                    closeTab={(k) => this.closeTab(k)} />
                  <SplitPane
                    collapsedText='preview' collapsable='second'
                    onChange={() => this.handleSplitChanged()} onDragFinished={() => this.handleSplitDragFinished()}
                    resizerClassName='resizer'>
                    <EditorTabs
                      activeTabKey={activeTabKey} onUpdate={(v) => groupedUpdate(v)} tabs={tabsWithEntities} />
                    <Preview ref='preview' onLoad={stop} />
                  </SplitPane>
                </div>
              </SplitPane>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
