import PropTypes from 'prop-types'
import React from 'react'
import {Stage} from './stage'

export class Stages extends React.PureComponent {
  render() {
    const {stages} = this.props

    return <ol className="stages">
      {stages.map((stage, index) => {
        return <Stage stage={stage} key={index}/>
      })}
    </ol>
  }
}

Stages.propTypes = {
  stages: PropTypes.array
}
