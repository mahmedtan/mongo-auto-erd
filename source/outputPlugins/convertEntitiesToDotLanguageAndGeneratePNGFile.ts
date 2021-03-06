import { IEntity } from '@interfaces/IEntity'
import { digraph } from 'graphviz'
import { resolve } from 'path'

function entityToNodeLabel(entity: IEntity) {
  const propLabels = entity.properties.map((property) => {
    return `${property.name} : ${property.types[0]}`
  })

  const label = `{${entity.name} | ${
    propLabels.length > 0
      ? propLabels.reduce((previousValue = '', currentValue) => {
          return `${previousValue}\\l${currentValue}`
        })
      : ''
  }}`
  return label
}

export function convertEntitiesToDotLanguageAndGeneratePNGFile(
  entities: IEntity[],
  filepath?: string
) {
  const graph = digraph('erd')
  for (const entity of entities) {
    graph.addNode(entity.name, {
      label: entityToNodeLabel(entity),
      shape: 'record'
    })
  }
  for (const entity of entities) {
    for (const relationship of entity.relationships) {
      if (entity.name !== relationship.targetCollectionName) {
        graph.addEdge(entity.name, relationship.targetCollectionName)
      }
    }
  }

  graph.output('png', resolve(filepath + '.png'))
  graph.output('svg', resolve(filepath + '.svg'))
  graph.output('dot', resolve(filepath + '.dot'))

  return graph.to_dot()
}
