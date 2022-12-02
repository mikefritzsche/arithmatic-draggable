import { create, all } from 'mathjs'

const config = { }
const math = create(all, config)

// let s0 = '10 + 20 * 2 * 0.75'
let s1 = '((10+20)*2) * 0.75'
// let s2 = '10 + 20'

// helper(s0, false)
helper(s1, true)
// helper(s2, false)

function helper(formulaString, traverse = false) {
  let parsedExpression = math.parse(formulaString)

  console.log(parsedExpression)

  // formulaString

  if (traverse) {
    parsedExpression.forEach(item => {
      // console.log(item)
    })
    return
    parsedExpression.traverse(function (node, path, parent) {
      // console.log(node)

      switch (node.type) {
        case 'OperatorNode':
          // console.log(node.type)
          // console.log(node.op)
          // console.log(path)
          console.log(parent)
          break
        case 'ConstantNode':
          // console.log(node.type)
          // console.log(node.value)
          // console.log(path)
          console.log(parent)
          break
        case 'ParenthesisNode':
          // console.log(node.type)
          // console.log(path)
          console.log(parent)
          break
        default:
        // console.log(node.type)
        // console.log(path)
        // console.log(parent)
      }
    })
  }
}

const jsonOutput = {
  operation: 'multiply',
  query: [],
  operands: [
    {
      position:  0,
      value_type: 'calculated_field_formula', //
      value: {
        operation: 'multiply',
        operands: [
          {
            position: 0,
            value_type: 'calculated_field_formula', //
            value: {
              operation: 'add',
              operands: [
                {
                  position: 0,
                  value_type: 'constant',
                  value: 10
                },
                {
                  position: 1,
                  value_type: 'constant',
                  value: 20
                }
              ]
            }
          },
          {
            position: 1,
            value_type: 'constant',
            value: 2
          }
        ]
      }
    },
    {
      position: 0,
      value_type: 'constant',
      value: 0.75
    },
  ]
}