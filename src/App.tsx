import React, { Component } from 'react'
import BlocklyComponent from './block/block'

 
export default class App extends Component {
  render() {
    return (
      <BlocklyComponent type={'event'} name={'On Click'} params={[]} output={false} componentName={'Button1'} />
    )
  }
}
