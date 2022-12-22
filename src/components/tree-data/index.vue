<template>
  <div>
    <h1>Tree Data Examples</h1>
    <div><pre>{{ formulaExample }}</pre></div>
    <div style="display: flex; padding: 10px; gap: 16px">
      <div class="code-block">
        <h3>Formula:</h3>
        <pre>{{ JSON.stringify(formula, null, 2) }}</pre>
      </div>
      <div class="code-block">
        <h3>Tree:</h3>
        <pre>{{ JSON.stringify(tree, null, 2) }}</pre>
      </div>
      <div class="code-block">
        <h3>cfData:</h3>
        <pre>{{ JSON.stringify(cfData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { evaluate, parse } from 'mathjs'

function TreeNode (key) {
  this.key = key
  this.left = null
  this.right = null
}

function Tree () {
  this.root = null
}

Tree.prototype.insert = function (key) {
  const treeNode = new TreeNode(key)
  let node = this.root
  let p
  while(node !== null) {
    p = node
    if (node.key <= key) {
      node = node.right
    } else {
      node = node.left
    }
  }
  if (p == null) {
    this.root = treeNode
  } else if (key < p.key) {
    p.left = treeNode
  } else {
    p.right = treeNode
  }
}

Tree.prototype._preOrderWalk = function (p) {
  if (p === null) return
  console.log(p.key)
  this._preOrderWalk(p.left)
  this._preOrderWalk(p.right)
}

Tree.prototype.preOrderWalk = function () {
  this._preOrderWalk(this.root)
}

Tree.prototype._treeMin = function (node) {
  if (node.left === null) return node.key
  return this._treeMin(node.left)
}

Tree.prototype.treeMin = function () {
  return this._treeMin(this.root)
}

Tree.prototype._treeMax = function (node) {
  if (node.right === null) return node.key
  return this._treeMax(node.right)
}

Tree.prototype.treeMax = function () {
  return this._treeMax(this.root)
}

// Tree.prototype.treeSuccessor = function () {}

const jsonOut = [
  {
    "backgroundColor": "#ccd1ff",
    "block": "open",
    "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f616",
    "id": "00f775ef-1f53-4283-ac07-0772d57f8448",
    "parentId": null,
    "value": "block_open",
    "valueType": "operator",
    "root": true,
    "children": [
      {
        "backgroundColor": "#ccd1ff",
        "block": "open",
        "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f617",
        "id": "00f775ef-1f53-4283-ac07-0772d57f8449",
        "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
        "value": "block_open",
        "valueType": "operator",
        "children": [
          {
            "id": "d4142e0f-9ba4-4353-89d5-2d31a6b79da4",
            "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
            "value": "1",
            "valueType": "constant"
          },
          {
            "id": "48aa2901-ee62-4373-bf23-4dfa675f9800",
            "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
            "value": "add",
            "valueType": "operator"
          },
          {
            "id": "888e34f7-502c-4f76-910a-b2be793b2f0f",
            "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
            "value": "2",
            "valueType": "constant"
          }
        ],
        "count": 3
      },
      {
        "id": "ecb325f7-f4ae-46c9-b905-1afdfb3d4503",
        "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
        "value": "multiply",
        "valueType": "operator"
      },
      {
        "id": "c130c140-0fac-45c4-8bad-4129951d0f8c",
        "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
        "value": "3",
        "valueType": "constant"
      }
    ],
    "count": 3
  },
  {
    "id": "d51cade9-6d5a-4c15-a28b-3797d5ff159d",
    "parentId": null,
    "value": "multiply",
    "valueType": "operator",
    "root": true
  },
  {
    "id": "23a581bb-f708-4a0b-b584-aa5507bfcba4",
    "parentId": null,
    "value": "0.75",
    "valueType": "constant",
    "root": true
  }
]

const operandPositionTemplate = {
  position: 0,
  value_type: "",
  value: 0
}
const calculatedFieldFormulaPositionTemplate = {
  position: 0,
  value_type: "calculated_field_formula",
  value: {
    operation: "",
    query: [],
    operands: []
  }
}

export default {
  name: "TreeDataExamples",
  data() {
    return {
      formula: [
        {
          "backgroundColor": "#ccd1ff",
          "block": "open",
          "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f616",
          "children": [],
          "id": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "parentId": "0",
          "value": "block_open",
          "valueType": "operator"
        },
        {
          "backgroundColor": "#ccd1ff",
          "block": "open",
          "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f616",
          "children": [],
          "id": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "value": "block_open",
          "valueType": "operator"
        },
        {
          "children": [],
          "id": "d4142e0f-9ba4-4353-89d5-2d31a6b79da4",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "value": "1",
          "valueType": "constant"
        },
        {
          "children": [],
          "id": "48aa2901-ee62-4373-bf23-4dfa675f9800",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "value": "add",
          "valueType": "operator"
        },
        {
          "children": [],
          "id": "888e34f7-502c-4f76-910a-b2be793b2f0f",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "value": "2",
          "valueType": "constant"
        },
        {
          "backgroundColor": "#ccd1ff",
          "block": "close",
          "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f616",
          "children": [],
          "id": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "value": "block_close",
          "valueType": "operator"
        },
        {
          "children": [],
          "id": "ecb325f7-f4ae-46c9-b905-1afdfb3d4503",
          "parentId": "0",
          "value": "multiply",
          "valueType": "operator"
        },
        {
          "children": [],
          "id": "c130c140-0fac-45c4-8bad-4129951d0f8c",
          "parentId": "0",
          "value": "3",
          "valueType": "constant"
        },
        {
          "backgroundColor": "#ccd1ff",
          "block": "close",
          "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f616",
          "children": [],
          "id": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "value": "block_close",
          "valueType": "operator"
        },
        {
          "children": [],
          "id": "d51cade9-6d5a-4c15-a28b-3797d5ff159d",
          "parentId": "0",
          "value": "multiply",
          "valueType": "operator"
        },
        {
          "children": [],
          "id": "23a581bb-f708-4a0b-b584-aa5507bfcba4",
          "parentId": "0",
          "value": "0.75",
          "valueType": "constant"
        }
      ],
      formulaExample: '((1 + 2) * 3) * 0.75 = 6.75',
      tree: [],
      cfData: {}
    }
  },
  computed: {},
  created() {
    // this.validateFormula(this.formula)
    // this.createDataTree()
    this.createNested()

    const initialNested = [
      {
        "id": "00f775ef-1f53-4283-ac07-0772d57f8448",
        "parentId": null,
        "value": {},
        "value_type": "calculated_field_formula",
        "position": 0,
        "root": true,
        "children": [
          {
            "id": "00f775ef-1f53-4283-ac07-0772d57f8449",
            "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
            "value": {},
            "value_type": "calculated_field_formula",
            "position": 0,
            "children": [
              {
                "id": "d4142e0f-9ba4-4353-89d5-2d31a6b79da4",
                "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
                "value": "1",
                "value_type": "constant"
              },
              {
                "id": "48aa2901-ee62-4373-bf23-4dfa675f9800",
                "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
                "value": "add",
                "value_type": "operator"
              },
              {
                "id": "888e34f7-502c-4f76-910a-b2be793b2f0f",
                "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
                "value": "2",
                "value_type": "constant"
              }
            ],
            "count": 3
          },
          {
            "id": "ecb325f7-f4ae-46c9-b905-1afdfb3d4503",
            "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
            "value": "multiply",
            "value_type": "operator"
          },
          {
            "id": "c130c140-0fac-45c4-8bad-4129951d0f8c",
            "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
            "value": "3",
            "value_type": "constant"
          }
        ],
        "count": 3
      },
      {
        "id": "d51cade9-6d5a-4c15-a28b-3797d5ff159d",
        "parentId": null,
        "value": "multiply",
        "valueType": "operator",
        "position": 0,
        "root": true
      },
      {
        "id": "23a581bb-f708-4a0b-b584-aa5507bfcba4",
        "parentId": null,
        "value": "0.75",
        "valueType": "constant",
        "position": 0,
        "root": true
      }
    ]

    this.cfData = initialNested.reduce((acc, value) => {
      console.log('cfData value: ', value)
      return acc
    }, [])
  },
  methods: {
    createNested() {
      const outputCf = {
        object_class_id: "{{object_class_id_account}}",
        label: "Arithmetic CF2",
        description: "This is an arithmetic CF",
        formula: {
          operation: '',
          query: [],
          operands: []
        }
      }
      const formula0 = [
        {
          "backgroundColor": "#ccd1ff",
          "block": "open",
          "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f616",
          "id": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "parentId": '0',
          "value": "block_open",
          "valueType": "operator"
        },

        {
          "backgroundColor": "#ccd1ff",
          "block": "open",
          "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f617",
          "id": "00f775ef-1f53-4283-ac07-0772d57f8449",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "value": "block_open",
          "valueType": "operator"
        },
        {
          "id": "d4142e0f-9ba4-4353-89d5-2d31a6b79da4",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
          "value": "1",
          "valueType": "constant"
        },
        {
          "id": "48aa2901-ee62-4373-bf23-4dfa675f9800",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
          "value": "add",
          "valueType": "operator"
        },
        {
          "id": "888e34f7-502c-4f76-910a-b2be793b2f0f",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
          "value": "2",
          "valueType": "constant"
        },
        {
          "backgroundColor": "#ccd1ff",
          "block": "close",
          "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f617",
          "id": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
          "value": "block_close",
          "valueType": "operator"
        },

        {
          "id": "ecb325f7-f4ae-46c9-b905-1afdfb3d4503",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "value": "multiply",
          "valueType": "operator"
        },
        {
          "id": "c130c140-0fac-45c4-8bad-4129951d0f8c",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "value": "3",
          "valueType": "constant"
        },

        {
          "backgroundColor": "#ccd1ff",
          "block": "close",
          "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f616",
          "children": [],
          "id": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "value": "block_close",
          "valueType": "operator"
        },

        {
          "id": "d51cade9-6d5a-4c15-a28b-3797d5ff159d",
          "parentId": '0',
          "value": "multiply",
          "valueType": "operator"
        },
        {
          "id": "23a581bb-f708-4a0b-b584-aa5507bfcba4",
          "parentId": '0',
          "value": "0.75",
          "valueType": "constant"
        }
      ]
      const formula1 = [
        {
          "id": "a505c8d5-8fd0-4e03-a289-c0efd45431a1",
          "parentId": '0',
          "value": ".75",
          "valueType": "constant"
        },
        {
          "id": "330b31e7-dfee-4859-ae31-76eefe73cc56",
          "parentId": '0',
          "value": "multiply",
          "valueType": "operator"
        },
        {
          "block": "open",
          "blockGroupId": "abec4d3b-3b4e-4b9f-b5c9-7c223e3dc783",
          "id": "838f07f1-af00-4094-ba7f-7f32e7aa682f",
          "parentId": '0',
          "value": "block_open",
          "valueType": "operator"
        },
        {
          "id": "e0f8f5f9-293d-404d-b5ba-2ffe32bb22f7",
          "parentId": "838f07f1-af00-4094-ba7f-7f32e7aa682f",
          "value": "1",
          "valueType": "constant"
        },
        {
          "id": "d1b9ae4e-1f30-4ab7-9360-48c276e63a75",
          "parentId": "838f07f1-af00-4094-ba7f-7f32e7aa682f",
          "value": "add",
          "valueType": "operator"
        },
        {
          "id": "cc1d77e1-a963-46a9-8f8b-7a1884ecdaf4",
          "parentId": "838f07f1-af00-4094-ba7f-7f32e7aa682f",
          "value": "2",
          "valueType": "constant"
        },
        {
          "block": "close",
          "blockGroupId": "abec4d3b-3b4e-4b9f-b5c9-7c223e3dc783",
          "id": "49e75646-c899-4077-8743-1aea5e82a5bc",
          "parentId": '0',
          "value": "block_close",
          "valueType": "operator"
        }
      ]
      const formulaSimple = [
        {
          "id": "cb84a3a0-f4f5-466e-a44c-09c42b29d4c3",
          "parentId": "0",
          "value": "1",
          "valueType": "constant"
        },
        {
          "id": "f6bbfebf-002e-4bb2-80f0-89784d08b333",
          "parentId": "0",
          "value": "add",
          "valueType": "operator"
        },
        {
          "id": "b41d0ea8-cbec-4e3d-bdf7-c5a3f1306dd2",
          "parentId": "0",
          "value": "2",
          "valueType": "constant"
        }
      ]

      function filterCloseBlocks(formula) {
        return formula.filter(item => item?.block !== 'close')
      }
      function checkLeftOvers(leftOvers, possibleParent){
        for (let i = 0; i < leftOvers.length; i++) {
          if(leftOvers[i].parentId === possibleParent.id) {
            possibleParent.children ? possibleParent.children.push(leftOvers[i]) : possibleParent.children = [leftOvers[i]]
            possibleParent.count = possibleParent.children.length
            const addedObj = leftOvers.splice(i, 1)
            checkLeftOvers(leftOvers, addedObj[0])
          }
        }
      }

      function findParent(possibleParents, possibleChild) {
        let found = false
        for (let i = 0; i < possibleParents.length; i++) {
          // console.log('findParent index: ', [i, possibleParents[i].id, possibleParents[i], possibleChild.parentId, possibleChild])
          if(possibleParents[i].id === possibleChild.parentId) {
            found = true
            if (possibleChild.block) {
              // console.log('possibleChild block: ', [i, possibleChild])
              // console.log('possibleChild: ', possibleChild)

              possibleChild.value_type = 'calculated_field_formula'
              possibleChild.value = {}
              possibleChild.position = 0
            }
            else {
              // console.log('possibleChild non-block: ', [i, possibleChild])
              const newOperand = { ...operandPositionTemplate }
              //     {
              //   position: 0,
              //   value_type: "",
              //   value: 0
              // }
              possibleChild.value_type = possibleChild.valueType
            }

            if(possibleParents[i].children) possibleParents[i].children.push(possibleChild)
            else possibleParents[i].children = [possibleChild]
            possibleParents[i].count = possibleParents[i].children.length
            return true
          } else if (possibleParents[i].children) found = findParent(possibleParents[i].children, possibleChild)
        }
        return found;
      }

      function nestedObjectNormalize(nestedObject, nestedIndex = 0, nestLevel = 0) {
        console.log('nestedObject: ', nestedObject)
        // console.log('nestedIndex: ', nestedIndex)
        console.log('nestLevel: ', nestLevel)
        nestedObject.map((nestItem, index) => {
          console.log('nestItem: ', [nestItem, index, nestedIndex])
          if (nestItem.block) {
            // total, currentValue, currentIndex, arr
            let treePosition = 0
            const childTreeItems = nestItem.children.reduce((acc, child, childIndex, original) => {
              console.log('child: ', child)
              if (child.value_type === 'operator') {
                // Object.keys(child).forEach(key => {
                //   if (omitProps.includes(key)) {
                //     delete nestItem[key]
                //   }
                // })
                acc.operator = child
              }
              else {
                child.position = treePosition
                treePosition++
                // if (!acc.operands[index]) acc.operands[index] = {}
                acc.operands.push(child)
              }
              return acc
            }, { operator: {}, operands: [] })
            console.log('childTreeItems: ', childTreeItems)
            nestItem.value.operands = childTreeItems.operands
            // delete nestItem.children
            nestItem.value.operation = childTreeItems.operator.value

            nestItem.position = 0
            nestItem.value_type = 'calculated_field_formula'
            console.log('block: ', nestItem)
          }
          else {
            if (nestItem.root) {
              console.log('not block, root item: ', [nestItem, index, nestedIndex])
              if (['constant', 'object_attribute'].includes(nestItem.value_type)) {
                // const position = 0
                // nestedIndex === 0 ? 0 : nestedIndex === 2 ? 1 : 0
                // nestItem.position = position
              }
            }
            else {
              console.log('not block child item: ', [nestItem, nestedIndex])
              if (['constant', 'object_attribute'].includes(nestItem.value_type)) {
                // nestItem.position = 0
              }
            }
          }

          // Object.keys(nestItem).forEach(key => {
          //   if (omitProps.includes(key)) {
          //     delete nestItem[key]
          //   }
          // })

          // nestItem.position = 0
          // nestItem.value_type = nestItem.valueType
          // console.log('nestItem: ', [nestItem, index])
          if (nestItem.children.length) {
            console.log('has children - recurse: ', )
            nestedObjectNormalize(nestItem.children, index, nestLevel+1)
          }
          else if (!nestItem.children.length) {
            console.log('no children -- delete: ', )
            delete nestItem.children
          }
          return nestItem
        })
      }

      function reduceFlat(arr) {
        arr.reduce((initial, value, index, original) => {
          if (value.parentId === '0') {
            console.log('parentId === null: ', value)
            if (initial.left.length) checkLeftOvers(initial.left, value)
            if (value.block) {
              delete value.backgroundColor
              delete value.blockGroupId
              // delete value.parentId
              delete value.block
              delete value.valueType
              value.value = {}
              value.value_type = 'calculated_field_formula'
            }
            value.position = 0
            value.root = true;
            initial.nested.push(value)
          }
          else {
            let parentFound = findParent(initial.nested, value)
            if (parentFound) {
              // console.log('parentFound: ', value)
              checkLeftOvers(initial.left, value)
            }
            else {
              // console.log('no parent found: ', value)
              initial.left.push(value)
            }
          }
          return index < original.length - 1
              ? initial
              : initial.nested
        }, {nested: [], left: []})

      }

      const omitProps = [
        'backgroundColor',
        'blockGroupId',
        'id',
        'parentId',
        'block',
        'valueType',
      ]
      let nestedObj = filterCloseBlocks(formula1.map(item => { item.children = []; return item})).reduce((initial, value, index, original) => {
        if (value.parentId === '0') {
          console.log('parentId === \'0\': ', [value, initial])
          if (initial.left.length) checkLeftOvers(initial.left, value)

          if (value.block) {
            value.value = {
              operation: '',
              query: [],
              operands: []
            }
          }
          else {
            value.value_type = value.valueType
          }

          value.root = true;
          initial.nested.push(value)
        }
        else {
          let parentFound = findParent(initial.nested, value)
          if (parentFound) {
            // console.log('parentFound: ', value)
            checkLeftOvers(initial.left, value)
          }
          else {
            // console.log('no parent found: ', value)
            initial.left.push(value)
          }
        }
        return index < original.length - 1
            ? initial
            : initial.nested
      }, {nested: [], left: []})

      outputCf.formula.operation = nestedObj.find(item => item.value_type === 'operator')?.value

      if (nestedObj.find(item => item.block)) {
        nestedObjectNormalize(nestedObj)
        const rootItems = nestedObj.filter(obj => obj.root && !obj.block)
        console.log('root items: ', rootItems)
        outputCf.formula.operation = rootItems.find(ri => ri.value_type === 'operator')?.value ?? ''
        outputCf.formula.operands = nestedObj
        console.log('nested: ', nestedObj)
        this.tree = outputCf
      }
      else {
        outputCf.formula.operands = nestedObj.reduce((acc, item) => {
          if (item.value_type === 'constant') {
            acc.push({
              position: 0,
              value_type: item.value_type,
              value: item.value
            })
          }
          return acc
        }, [])
        console.log('outputCf: ', outputCf)
        console.log('nestedObj: ', nestedObj)
        this.tree = outputCf
      }
    },

    createDataTree() {
      const data1 = [
        {
          id: '0',
          parentId: null,
        },
        {
          "backgroundColor": "#fcebae",
          "block": "open",
          "blockGroupId": "a12de4e9-299f-43a0-aee8-bddfa8eb5d90",
          "id": "934cc6d4-a3e8-4ef4-825b-ae47813b76e4",
          "parentId": '0',
          "value": "block_open",
          "valueType": "operator"
        },
        {
          "id": "b7cf8df9-78c6-4037-9e58-9191c8ab464b",
          "parentId": "934cc6d4-a3e8-4ef4-825b-ae47813b76e4",
          "value": "1",
          "valueType": "constant"
        },
        {
          "id": "b602f5a9-257e-4d34-a5ee-0cb936877627",
          "parentId": "934cc6d4-a3e8-4ef4-825b-ae47813b76e4",
          "value": "add",
          "valueType": "operator"
        },
        {
          "id": "22c148af-2371-4bfd-90cb-4c454a0e12ae",
          "parentId": "934cc6d4-a3e8-4ef4-825b-ae47813b76e4",
          "value": "2",
          "valueType": "constant"
        },
        {
          "id": "126842dd-0805-48cb-ac91-bcef6900cb80",
          "parentId": '0',
          "value": "multiply",
          "valueType": "operator"
        },
        {
          "id": "035d224d-740c-4612-a6b2-3be703b4ccd5",
          "parentId": '0',
          "value": "3",
          "valueType": "constant"
        }
      ];
      const data = [{
        id: '0',
        parentId: null,
      }, ...JSON.parse(JSON.stringify(this.formula))]

      const idMapping = data.reduce((acc, el, i) => {
        acc[el.id] = i;
        return acc;
      }, {});
      console.log('idMapping: ', idMapping)

      let root;
      data.forEach((el) => {
        // console.log('el: ', el.parentId)
        // Handle the root element
        if (el.parentId === null) {
          root = el;
          return;
        }

        // Use our mapping to locate the parent element in our data array
        const parentEl = data[idMapping[el.parentId]];
        // Add our current el to its parent's `children` array
        parentEl.children = [...(parentEl.children || []), el];
        // console.log('children: ', parentEl.children)
      });
      this.tree = root
    },
    validateFormula(formula) {
      console.log('validate formula: ', formula)
      const arr = [
        {
          "id": "12",
          "parentId": "0",
          "text": "Man",
          "level": "1",
          "children": null
        },
        {
          "id": "6",
          "parentId": "12",
          "text": "Boy",
          "level": "2",
          "children": null
        },
        {
          "id": "7",
          "parentId": "12",
          "text": "Other",
          "level": "2",
          "children": null
        },
        {
          "id": "9",
          "parentId": "0",
          "text": "Woman",
          "level": "1",
          "children": null
        },
        {
          "id": "11",
          "parentId": "9",
          "text": "Girl",
          "level": "2",
          "children": null
        }
      ]
      let errors = []
      const listToTree = (arr = []) => {
        let map = {}, node, res = [], i
        for (i = 0; i < arr.length; i += 1) {
          // if (arr[i]?.block !== 'close') {
            console.log('arr[i].id: ', arr[i].id, arr[i].parentId, arr[i]?.block)
            map[arr[i].id] = i
            arr[i].children = []
          // }
        }
        for (i = 0; i < arr.length; i += 1) {
          // if (arr[i]?.block !== 'close') {
            node = arr[i]
            // if (arr[i]?.block == 'open') {
            //   console.log('open block: ', arr[i])
            // }
            if (node.parentId !== "0") {
              // if (arr[map[node.parentId]].children.length === 2) {
              //   errors.push(`children count exceeds allowed value -- ${JSON.stringify(arr[map[node.parentId]])}`)
              // }
              arr[map[node.parentId]].children.push(node)
            }
            else {
              res.push(node)
            }
          // }
        }
        return res
      }
      // console.log(JSON.stringify(listToTree(this.formula), undefined, 4));
      const validatedList = listToTree(JSON.parse(JSON.stringify(this.formula)))
      // if (!errors.length) {
      //   validatedList
      // }

      this.tree = !errors.length ? validatedList : errors
    }
  }
}
</script>

<style scoped>
.code-block {
  flex: 1;
  text-align: left;
  outline: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}
</style>