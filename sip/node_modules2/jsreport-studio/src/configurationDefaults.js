import * as configuration from './lib/configuration.js'
import TemplateProperties from './components/Properties/TemplateProperties.js'
import Startup from './containers/Startup/Startup.js'
import ApiModal from './components/Modals/ApiModal.js'

export default () => {
  configuration.propertiesComponents.push({
    title: TemplateProperties.title,
    shouldDisplay: (entity) => entity.__entitySet === 'templates',
    component: TemplateProperties
  })

  configuration.editorComponents.templates = require('./components/Editor/TemplateEditor.js')
  configuration.editorComponents.templates.reformat = (reformatter, entity) => {
    const content = reformatter(entity.content, 'html')
    const helpers = reformatter(entity.helpers, 'js')

    return {
      content: content,
      helpers: helpers
    }
  }
  configuration.editorComponents.startup = Startup
  configuration.entitySets.templates = {
    name: 'templates',
    visibleName: 'template',
    nameAttribute: 'name',
    referenceAttributes: ['name', 'recipe', 'shortid']
  }

  configuration.apiSpecs = {
    template: {
      content: '...',
      helpers: '...',
      engine: '...',
      recipe: '...'
    },
    data: {
      aProperty: '...'
    },
    options: {}
  }

  configuration.toolbarComponents.settings.push(() => <div
    onClick={() => configuration.modalHandler.open(ApiModal, { apiSpecs: configuration.apiSpecs })}>
    <i className='fa fa-plug'></i> API</div>)

  configuration.initializeListeners.push(() => {
    configuration.entityTreeIconResolvers.push((entity) => {
      if (entity.__entitySet !== 'templates') {
        return
      }

      if (entity.recipe === 'html') {
        return 'fa-html5'
      }

      if (entity.recipe.indexOf('xlsx') !== -1) {
        return 'fa-table'
      }

      if (entity.recipe.indexOf('pdf') !== -1) {
        return 'fa-file-pdf-o'
      }

      if (entity.recipe.indexOf('html') !== -1) {
        return 'fa-html5'
      }
    })
  })
}