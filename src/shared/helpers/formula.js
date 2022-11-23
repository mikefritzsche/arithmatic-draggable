import { v4 as uuidv4 } from 'uuid'

const resp = {
  "object_class_id": "{{object_class_id_account}}",
  "label": "Arithmetic CF2",
  "description": "This is an arithmetic CF",
  "formula": {
    "operation": "add",
    "query": [],
    "operands": [
      {
        "position": 0,
        "value_type": "constant",
        "value": 1
      },
      {
        "position": 1,
        "value_type": "calculated_field_formula",
        "value": {
          "operation": "multiply",
          "query": [],
          "operands": [
            {
              "position": 0,
              "value_type": "constant",
              "value": 2
            },
            {
              "position": 1,
              "value_type": "constant",
              "value": 3
            }
          ]
        }
      }
    ]
  }
}
export function flattenResp(data, rootOperator, level = 0) {
  let output = []
  let openBlock, closeBlock
  console.log('level: ', level)
  data.forEach((item, i) => {
    console.log('i: ', i)

    if (item.value_type === 'calculated_field_formula') {
      console.log('level iterator: ', level)
      const blockId = uuidv4()
      const blockGroupId = uuidv4()
      openBlock = {
        "backgroundColor": "#fff6b2",
        "block": "open",
        "blockGroupId": blockGroupId,
        "children": [],
        "id": blockId,
        "parentId": "0",
        "value": "block_open",
        "valueType": "operator"
      }
      output.push(openBlock)

      output.push({
        "children": [],
        "id": uuidv4(),
        "parentId": blockId,
        "value": "add",
        "valueType": "operator"
      })
      // console.log('Nested item: ', item.value)
      level++
      const rootValue = {
        "children": [],
        "id": uuidv4(),
        "parentId": blockId,
        "value": "add",
        "valueType": "operator"
      }
      flatResp(item.value.operands, rootValue, level)
    }
    else {
      level--
      const newItem = {
        children: [],
        id: uuidv4(),
        parentId: '0',
        value: item.value,
        valueType: item.value_type
      }
      output.push(newItem)

      if (i === 0) {
        output.push(rootOperator)
      }
    }
  })
  return output
}

const rootValue = {
  "children": [],
  "id": uuidv4(),
  "parentId": "0",
  "value": "add",
  "valueType": "operator"
}
// flatResp(resp.formula.operands, rootValue)