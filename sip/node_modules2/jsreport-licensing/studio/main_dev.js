import Studio from 'jsreport-studio'

Studio.readyListeners.push(async () => {
  let license = Studio.getSettingValueByKey('license', false) === true

  if (!license && Studio.getAllEntities().filter((e) => e.__entitySet === 'templates').length > 5) {
    Studio.openModal(() => <div><p>Free license is limited to maximum 5 templates. For production use, please buy
      the enterprise license before you continue.
    </p>
      <p>The instructions for buying enterprise license can be
        found <a href='http://jsreport.net/buy' target='_blank'>here</a>.
      </p>
    </div>)
  }

  Studio.addToolbarComponent((props) => <div className='toolbar-button'>
    {license ? <div style={{color: 'orange'}}><i className='fa fa-gavel'></i> ENTERPRISE LICENSE</div> : <div
      onClick={() => window.open('http://jsreport.net/buy', '_blank')}>
      <i className='fa fa-gavel'></i> FREE/DEV LICENSE</div>}</div>, 'settings')
})


