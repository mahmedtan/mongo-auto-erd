import { typeOf } from '@entity/typeOf'
import { IEntity } from '@interfaces/IEntity'
import { getCollectionNameByDocumentID } from '@mongo/getCollectionNameByDocumentID'
import { flattenDeep } from 'lodash'

export async function mapEntityRelationships(entity: IEntity): Promise<void> {
  const oidProperties = entity.properties.filter((prop) => {
    return prop.types.some((type) => type === 'objectId')
  })
  const arrayProperties = entity.properties
    .filter((prop) => {
      return prop.types.some((type) => type === 'array')
    })
    .map((prop) => {
      prop.values = flattenDeep(prop.values)
      prop.types = prop.values.map((value) => typeOf(value))
      return prop
    })

  for (let i = 0; i < oidProperties.length; i++) {
    for (let j = 0; j < oidProperties[i].values.length; j++) {
      const col = await getCollectionNameByDocumentID(
        oidProperties[i].values[j]
      )
      if (col) {
        const found = entity.relationships.find(
          (rel) => rel.targetCollectionName === col
        )
        if (found) {
          found.propertyNames.push(oidProperties[i].name)
        } else {
          entity.relationships.push({
            targetCollectionName: col,
            propertyNames: [oidProperties[i].name]
          })
        }
        break
      }
    }
  }
  for (let i = 0; i < arrayProperties.length; i++) {
    for (let j = 0; j < arrayProperties[i].values.length; j++) {
      const col = await getCollectionNameByDocumentID(
        arrayProperties[i].values[j]
      )
      if (col) {
        const found = entity.relationships.find(
          (rel) => rel.targetCollectionName === col
        )
        if (found) {
          found.propertyNames.push(arrayProperties[i].name)
        } else {
          entity.relationships.push({
            targetCollectionName: col,
            propertyNames: [arrayProperties[i].name]
          })
        }
        break
      }
    }
  }
}
