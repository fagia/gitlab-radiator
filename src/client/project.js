import {Info} from './info'
import PropTypes from 'prop-types'
import React from 'react'
import {Stages} from './stages'

export class Project extends React.PureComponent {
  render() {
    const {project, columns, baseUrl, now} = this.props
    const [pipeline] = project.pipelines

    return <li className={`project ${project.status}`} style={this.style(columns)}>
      <h2>
        <a target="_blank" rel="noopener noreferrer"
           style={this.linkStyle}
           href={`${baseUrl}/${project.name}/pipelines/${pipeline.id}`}>
          {project.name}
          </a>
      </h2>
      <Stages stages={pipeline.stages}/>
      <Info now={now} pipeline={pipeline}/>
    </li>
  }

  linkStyle = {color: 'white'};

  style = (columns) => {
    const widthPercentage = Math.round(90 / columns)
    return {
      width: `${widthPercentage}%`
    }
  }
}

Project.propTypes = {
  project: PropTypes.object,
  columns: PropTypes.number,
  baseUrl: PropTypes.string,
  now: PropTypes.number
}
