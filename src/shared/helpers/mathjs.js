import { create, all } from 'mathjs'

const config = { }
const math = create(all, config)

// let s0 = '10 + 20 * 2 * 0.75'
let s1 = '((20+30)*4) * 0.75'
let s2 = '10 + 20'

// helper(s0, false)
const outputS1 = helper(s1, true)
// const outputS2 = helper(s2, true)
// helper(s2, false)
// console.log(outputS1)
// buildTree(math.parse(s1))
console.log(s1)

let nestLevel = 0
// buildTree(math.parse(s1), 0, nestLevel)
const nested = math.parse(s1).reduce((acc, node) => {

})
function buildTree(tree, position = 0, nestLevel = 0) {
  tree.forEach((node, path, parent) => {
    switch (node.type) {
      case 'OperatorNode':
        // console.log(node)
        console.log(node.type)
        console.log(node.value)
        console.log(path)
        console.log(parent)
        // console.log([position, nestLevel])
        break
      case 'ConstantNode':
        // console.log(node)
        console.log(node.type)
        console.log(node.value)
        console.log(path)
        console.log(parent)
        // console.log([position, nestLevel])
        break
      case 'ParenthesisNode':
        // console.log(node)
        console.log(node.type)
        console.log(node.content)
        console.log(node.content.fn)
        console.log(path)
        console.log(parent)
        // console.log([position, nestLevel])
        buildTree(node.content.args, position)
        break
      default:
    }
  })
}

function helper(formulaString, traverse = false) {
  let parsedExpression = math.parse(formulaString)

  console.log(parsedExpression)

  // formulaString

  if (traverse) {
    // parsedExpression.forEach(item => {
    //   // console.log(item)
    // })
    // return
    let output = {
      operation: '',
      query: [],
      operands: []
    }
    let position = 0
    parsedExpression.traverse(function (node, path, parent) {
      // console.log(node)

      switch (node.type) {
        case 'OperatorNode':
          console.log(node.type)
          console.log(node.op)
          console.log(path)
          console.log(node.fn)
          if (path === null) {
            output.operation = node.fn
          }
          // console.log(parent)
          break
        case 'ConstantNode':
          console.log(node.type)
          console.log(node.value)
          console.log(path)
          console.log(parent)
          output.operands.push({
            position,
            value_type: 'constant',
            value: node.value
          })
          position = position + 1
          break
        case 'ParenthesisNode':
          console.log(node.type)
          console.log(path)
          // console.log(parent)
          break
        default:
        // console.log(node.type)
        // console.log(path)
        // console.log(parent)
      }
    })

    return output
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