<template>
  <div>
    <h1>Tree Data Examples</h1>
    <div>
      <pre>{{ formulaString }}</pre>
    </div>
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
import {cloneDeep} from 'lodash'
import {getFormulaString} from '@/components/formula-builder-complex/helpers/formula-validation'

function TreeNode(key) {
  this.key = key
  this.left = null
  this.right = null
}

function Tree() {
  this.root = null
}

Tree.prototype.insert = function (key) {
  const treeNode = new TreeNode(key)
  let node = this.root
  let p
  while (node !== null) {
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
      formulaString: '',
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

    // this.cfData = initialNested.reduce((acc, value) => {
    //   console.log('cfData value: ', value)
    //   return acc
    // }, [])
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
          "id": "888e34f7-502c-4f76-910a-b2be793b2f0f",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
          "value": "2",
          "valueType": "constant"
        },
        {
          "id": "48aa2901-ee62-4373-bf23-4dfa675f9800",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
          "value": "add",
          "valueType": "operator"
        },
        {
          "id": "d4142e0f-9ba4-4353-89d5-2d31a6b79da4",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
          "value": "1",
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
      const formula01 = [
          // block 1 open
        {
          "backgroundColor": "#ccd1ff",
          "block": "open",
          "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f617",
          "id": "00f775ef-1f53-4283-ac07-0772d57f8449",
          "parentId": '0',
          "value": "block_open",
          "valueType": "operator"
        },

          // block 2 open
        {
          "backgroundColor": "#ccd1ff",
          "block": "open",
          "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f616",
          "id": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
          "value": "block_open",
          "valueType": "operator"
        },

        // block 3 open
        {
          "backgroundColor": "#ccd1ff",
          "block": "open",
          "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f617",
          "id": "00f775ef-1f53-4283-ac07-0772d57f8449",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "value": "block_open",
          "valueType": "operator"
        },

          // block 3 content
        {
          "id": "888e34f7-502c-4f76-910a-b2be793b2f0f",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
          "value": "2",
          "valueType": "constant"
        },
        {
          "id": "48aa2901-ee62-4373-bf23-4dfa675f9800",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
          "value": "add",
          "valueType": "operator"
        },
        {
          "id": "d4142e0f-9ba4-4353-89d5-2d31a6b79da4",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
          "value": "1",
          "valueType": "constant"
        },

          // block 3 close
        {
          "backgroundColor": "#ccd1ff",
          "block": "close",
          "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f617",
          "id": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
          "value": "block_close",
          "valueType": "operator"
        },

          // block 2 content
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

          // block 2 close
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

          // block 1 content
        {
          "id": "d51cade9-6d5a-4c15-a28b-3797d5ff159d",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
          "value": "multiply",
          "valueType": "operator"
        },

        {
          "id": "23a581bb-f708-4a0b-b584-aa5507bfcba4",
          "parentId": "00f775ef-1f53-4283-ac07-0772d57f8449",
          "value": "0.75",
          "valueType": "constant"
        },

          // block 1 close
        {
          "backgroundColor": "#ccd1ff",
          "block": "close",
          "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f617",
          "id": "00f775ef-1f53-4283-ac07-0772d57f8450",
          "parentId": '0',
          "value": "block_close",
          "valueType": "operator"
        },
      ]

      const formula02 = [
          // block 1 open
        {
          "backgroundColor": "var(--lime-4)",
          "block": "open",
          "blockGroupId": "2a7efd5a-ec6f-4213-8ac4-32903c4bcf49",
          "id": "b9b79c92-5526-4738-8bd7-66fadabde460",
          "parentId": "0",
          "value": "block_open",
          "valueType": "operator",
          "active": false
        },

          // block 2 open (block 1 content)
        {
          "backgroundColor": "var(--sand-4)",
          "block": "open",
          "blockGroupId": "1328ceb9-5859-46ba-8f1d-b353ff0877af",
          "id": "910645ac-56c8-4082-b3a4-43b4755a7acd",
          "parentId": "b9b79c92-5526-4738-8bd7-66fadabde460",
          "value": "block_open",
          "valueType": "operator",
          "active": false
        },

          // block 3 open (block 2 content
        {
          "backgroundColor": "var(--grape-4)",
          "block": "open",
          "blockGroupId": "950c8840-09a3-47fd-a609-8ad712781f72",
          "id": "467080ed-8734-4a59-ba22-ebe44edbf011",
          "parentId": "910645ac-56c8-4082-b3a4-43b4755a7acd",
          "value": "block_open",
          "valueType": "operator"
        },
          // block 3 content
        {
          "id": "5d34e6bc-c324-4284-83f7-e120c8ee96f0",
          "parentId": "467080ed-8734-4a59-ba22-ebe44edbf011",
          "value": "1",
          "valueType": "constant"
        },
        {
          "id": "b84ab0bb-1b36-4fbb-bfeb-f5504db623f0",
          "parentId": "467080ed-8734-4a59-ba22-ebe44edbf011",
          "value": "add",
          "valueType": "operator"
        },
        {
          "id": "7e8dd30b-4f1b-4e05-875a-286497ae30d1",
          "parentId": "467080ed-8734-4a59-ba22-ebe44edbf011",
          "value": "2",
          "valueType": "constant"
        },
          // block 3 close
        {
          "backgroundColor": "var(--grape-4)",
          "block": "close",
          "blockGroupId": "950c8840-09a3-47fd-a609-8ad712781f72",
          "id": "bb403d38-cedd-4d1e-b9b9-83646c7d0dff",
          "parentId": "0",
          "value": "block_close",
          "valueType": "operator"
        },

          // block 2 content
        {
          "id": "76f76f61-0f6b-4618-a436-c64d20777fde",
          "parentId": "910645ac-56c8-4082-b3a4-43b4755a7acd",
          "value": "multiply",
          "valueType": "operator"
        },
        {
          "id": "60062b48-f9d1-4607-9528-a1aed1f649e7",
          "parentId": "910645ac-56c8-4082-b3a4-43b4755a7acd",
          "value": "3",
          "valueType": "constant"
        },

          // block 2 close
        {
          "backgroundColor": "var(--sand-4)",
          "block": "close",
          "blockGroupId": "1328ceb9-5859-46ba-8f1d-b353ff0877af",
          "id": "849ebb27-8a89-4bbb-bd74-fedd490b0dd7",
          "parentId": "0",
          "value": "block_close",
          "valueType": "operator"
        },

        // block 1 content
        {
          "id": "d51f66bf-7acd-40aa-b9a9-5c5e457bd79e",
          "parentId": "b9b79c92-5526-4738-8bd7-66fadabde460",
          "value": "multiply",
          "valueType": "operator"
        },
        {
          "id": "8db511a3-24ad-4298-a2d1-d8643986bd39",
          "parentId": "b9b79c92-5526-4738-8bd7-66fadabde460",
          "value": "0.75",
          "valueType": "constant"
        },

          // block 1 close
        {
          "backgroundColor": "var(--lime-4)",
          "block": "close",
          "blockGroupId": "2a7efd5a-ec6f-4213-8ac4-32903c4bcf49",
          "id": "c7b5be7d-d6a0-4cce-8fe7-74dd72f46519",
          "parentId": "0",
          "value": "block_close",
          "valueType": "operator"
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

      //formula01
      const dataLayout = (
          [ // block 1
            [ // block 2
              [ // block 3
                1, '+', 2
              ],
              '*',
              3
            ],
            '*',
            0.75
          ]
      )
      // 1+2 = 3
      // 3 * 3 = 9
      // 9 * 0.75 = 6.75

      const formula2 = [
        // open block 1
        {
          "backgroundColor": "grape",
          "block": "open",
          "blockGroupId": "546f2e53-69ac-4bc5-8953-26ac692ebcc5",
          "id": "b228e7fa-7ef6-496d-95cd-583b69949370",
          "parentId": "0",
          "value": "block_open",
          "valueType": "operator"
        },

          // open block 2 (content of block 1)
          {
            "backgroundColor": "grape",
            "block": "open",
            "blockGroupId": "371604be-0fbf-4165-98ab-b6957dbf5233",
            "id": "3d283b1f-8a0f-4a83-b003-e20661721542",
            "parentId": "b228e7fa-7ef6-496d-95cd-583b69949370",
            "value": "block_open",
            "valueType": "operator"
          },

            // open block 3 (left content of block 2)
            {
              "backgroundColor": "grape",
              "block": "open",
              "blockGroupId": "9ce8eef4-f7c5-4c35-a7dc-ddff6b37f9e5",
              "id": "c65203e8-edd2-479c-acb4-cde0e2a413f7",
              "parentId": "3d283b1f-8a0f-4a83-b003-e20661721542",
              "value": "block_open",
              "valueType": "operator"
            },

              // content block 3
              {
                "id": "50e29aed-08b3-4574-9e49-0bcca19f1036",
                "parentId": "c65203e8-edd2-479c-acb4-cde0e2a413f7",
                "value": "1",
                "valueType": "constant"
              },
              {
                "id": "18218a23-c2c6-42ce-b1d6-612fe091fcd6",
                "parentId": "c65203e8-edd2-479c-acb4-cde0e2a413f7",
                "value": "add",
                "valueType": "operator"
              },
              {
                "id": "2811e6c7-ac9c-48ae-9a4f-46f25e0c851a",
                "parentId": "c65203e8-edd2-479c-acb4-cde0e2a413f7",
                "value": "2",
                "valueType": "constant"
              },

            // close block 3
            {
              "backgroundColor": "grape",
              "block": "close",
              "blockGroupId": "9ce8eef4-f7c5-4c35-a7dc-ddff6b37f9e5",
              "id": "a89e4c2d-6edb-4a9d-883f-c6520629340a",
              "parentId": "3d283b1f-8a0f-4a83-b003-e20661721542",
              "value": "block_close",
              "valueType": "operator"
            },

          // right content block 2
          {
            "id": "5097caca-e874-4fea-bbcf-883efa0d6c2c",
            "parentId": "3d283b1f-8a0f-4a83-b003-e20661721542",
            "value": "multiply",
            "valueType": "operator"
          },
          {
            "id": "b19c8820-c1d9-4801-a942-52ec1f34dacf",
            "parentId": "3d283b1f-8a0f-4a83-b003-e20661721542",
            "value": "3",
            "valueType": "constant"
          },

          // close block 2
          {
            "backgroundColor": "grape",
            "block": "close",
            "blockGroupId": "371604be-0fbf-4165-98ab-b6957dbf5233",
            "id": "f4975d2f-6ff3-4f7e-a1fb-96ef2152a482",
            "parentId": "3d283b1f-8a0f-4a83-b003-e20661721542",
            "value": "block_close",
            "valueType": "operator"
          },

          // content block 1 (left - operator/right - constant block 1)
          {
            "id": "34543722-8282-4c16-914e-03e903cb1999",
            "parentId": "3d283b1f-8a0f-4a83-b003-e20661721542",
            "value": "multiply",
            "valueType": "operator"
          },
          {
            "id": "e5cd25e3-785e-4a19-ba36-0d1fdfa7cfbb",
            "parentId": "3d283b1f-8a0f-4a83-b003-e20661721542",
            "value": "0.75",
            "valueType": "constant"
          },

        // close block 1
        {
          "backgroundColor": "grape",
          "block": "close",
          "blockGroupId": "546f2e53-69ac-4bc5-8953-26ac692ebcc5",
          "id": "6cb6bc58-0104-4368-b268-c5776a39702a",
          "parentId": "0",
          "value": "block_close",
          "valueType": "operator"
        }
      ]

      // ( (1 + 2 ) *3 )
      const formula3 = [
        {
          "backgroundColor": "blueberry",
          "block": "open",
          "blockGroupId": "30a09d1d-ad3e-4c30-8989-08e2f6e7423e",
          "id": "b2821426-a10a-4c7c-b2ac-c6caf2b136c3",
          "parentId": "0",
          "value": "block_open",
          "valueType": "operator"
        },
        {
          "backgroundColor": "orange",
          "block": "open",
          "blockGroupId": "224722f3-52dc-4971-b412-98100c8e6a47",
          "id": "2abbd399-63da-411b-90a3-348f2f2297cb",
          "parentId": "0",
          "value": "block_open",
          "valueType": "operator"
        },
        {
          "id": "f6e0de88-1aa1-4239-a165-14ff4fcdd0ba",
          "parentId": "2abbd399-63da-411b-90a3-348f2f2297cb",
          "value": "1",
          "valueType": "constant"
        },
        {
          "id": "3ab867c2-5aec-4b12-a774-1dc58c35a029",
          "parentId": "2abbd399-63da-411b-90a3-348f2f2297cb",
          "value": "add",
          "valueType": "operator"
        },
        {
          "id": "36e8789d-72d7-4d8d-a2b7-fb6b4ff12295",
          "parentId": "2abbd399-63da-411b-90a3-348f2f2297cb",
          "value": "2",
          "valueType": "constant"
        },
        {
          "backgroundColor": "orange",
          "block": "close",
          "blockGroupId": "224722f3-52dc-4971-b412-98100c8e6a47",
          "id": "e2683627-5088-4a58-9849-f8c52bf16f4f",
          "parentId": "0",
          "value": "block_close",
          "valueType": "operator"
        },
        {
          "id": "b1c5c45b-6fe7-416b-9be4-a5e0027ea9b2",
          "parentId": "0",
          "value": "multiply",
          "valueType": "operator"
        },
        {
          "id": "55f3157c-faea-470c-823e-f34634ee0d96",
          "parentId": "0",
          "value": "3",
          "valueType": "constant"
        },
        {
          "backgroundColor": "blueberry",
          "block": "close",
          "blockGroupId": "30a09d1d-ad3e-4c30-8989-08e2f6e7423e",
          "id": "7c375d82-e44d-4186-a4a5-ab2999907b10",
          "parentId": "0",
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

      const testFormula = [
        {
          "backgroundColor": "lime",
          "block": "open",
          "blockGroupId": "44c663e9-aeb4-4e69-bd3d-5bb177d3c259",
          "id": "f5c8c497-9159-4803-89dd-d3a2c41ff4d2",
          "parentId": "0",
          "value": "block_open",
          "valueType": "operator"
        },
        {
          "backgroundColor": "grape",
          "block": "open",
          "blockGroupId": "3e0e68a1-5edd-44c9-b309-e4b7324fab59",
          "id": "7ecab937-3f81-4f32-ac74-e72f5d6449fa",
          "parentId": "f5c8c497-9159-4803-89dd-d3a2c41ff4d2",
          "value": "block_open",
          "valueType": "operator"
        },
        {
          "id": "3bb8807c-c867-4aac-90b8-19590055f4e3",
          "parentId": "7ecab937-3f81-4f32-ac74-e72f5d6449fa",
          "value": "1",
          "valueType": "constant"
        },
        {
          "id": "fb9896c6-d64b-456b-b60f-9c1324c7ec71",
          "parentId": "7ecab937-3f81-4f32-ac74-e72f5d6449fa",
          "value": "add",
          "valueType": "operator"
        },
        {
          "id": "3a26226a-afb3-4749-a574-233feaa81a1e",
          "parentId": "7ecab937-3f81-4f32-ac74-e72f5d6449fa",
          "value": "2",
          "valueType": "constant"
        },
        {
          "backgroundColor": "grape",
          "block": "close",
          "blockGroupId": "3e0e68a1-5edd-44c9-b309-e4b7324fab59",
          "id": "53b72338-7a77-4e4c-b726-6ee8b2bf6d68",
          "parentId": "0",
          "value": "block_close",
          "valueType": "operator"
        },

        {
          "id": "cb40d40c-5afa-408e-8ff2-bba689c31259",
          "parentId": "f5c8c497-9159-4803-89dd-d3a2c41ff4d2",
          "value": "divide",
          "valueType": "operator"
        },
        {
          "id": "f056c7d5-c245-4ee3-9d8a-08ff5309fa7e",
          "parentId": "f5c8c497-9159-4803-89dd-d3a2c41ff4d2",
          "value": "3",
          "valueType": "constant"
        },
        {
          "backgroundColor": "lime",
          "block": "close",
          "blockGroupId": "44c663e9-aeb4-4e69-bd3d-5bb177d3c259",
          "id": "1ddf9f81-4392-43f9-93e6-1094ac58a0ab",
          "parentId": "0",
          "value": "block_close",
          "valueType": "operator"
        },
        {
          "id": "64c7e1ca-e6ce-41b2-a854-5f524dfa1e0e",
          "parentId": "0",
          "value": "multiply",
          "valueType": "operator"
        },
        {
          "id": "a268ab9f-55b1-4111-85e2-7d35120e100c",
          "parentId": "0",
          "value": "0.75",
          "valueType": "constant"
        }
      ]

      function filterCloseBlocks(formula) {
        return formula.filter(item => item?.block !== 'close')
      }

      function checkLeftOvers(leftOvers, possibleParent) {
        for (let i = 0; i < leftOvers.length; i++) {
          if (leftOvers[i].parentId === possibleParent.id) {
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
          if (possibleParents[i].id === possibleChild.parentId) {
            found = true
            if (possibleChild.block) {
              // console.log('possibleChild block: ', [i, possibleChild])
              // console.log('possibleChild: ', possibleChild)

              possibleChild.value_type = 'calculated_field_formula'
              possibleChild.value = {}
              possibleChild.position = 0
            } else {
              // console.log('possibleChild non-block: ', [i, possibleChild])
              const newOperand = {...operandPositionTemplate}
              //     {
              //   position: 0,
              //   value_type: "",
              //   value: 0
              // }
              possibleChild.value_type = possibleChild.valueType
            }

            if (possibleParents[i].children) possibleParents[i].children.push(possibleChild)
            else possibleParents[i].children = [possibleChild]
            possibleParents[i].count = possibleParents[i].children.length
            return true
          } else if (possibleParents[i].children) found = findParent(possibleParents[i].children, possibleChild)
        }
        return found;
      }

      function nestedObjectNormalize(nestedObject, nestedIndex = 0, nestLevel = 0, omitKeys = false) {
        nestedObject.map((nestItem, index) => {
          if (nestItem.block) {
            // total, currentValue, currentIndex, arr
            let treePosition = 0
            const childTreeItems = nestItem.children.reduce((acc, child) => {
              if (child.value_type === 'constant') {
                child.value = Number(child.value)
              }
              if (child.value_type === 'operator') {
                acc.operator = child
              } else {
                child.position = treePosition
                treePosition++
                acc.operands.push(child)
              }
              return acc
            }, {operator: {}, operands: []})
            nestItem.value.operands = childTreeItems.operands

            nestItem.value.operation = childTreeItems.operator.value

            nestItem.position = 0
            nestItem.value_type = 'calculated_field_formula'
          }
          else {
            if (nestItem.root) {
              if (['constant', 'object_attribute'].includes(nestItem.value_type)) {
                console.log('root item --> not block: ', [nestItem, index])
                if (nestItem.value_type === 'constant') nestItem.value = Number(nestItem.value)
                nestItem.position = index === 0 ? 0 : index === 2 ? 1 : undefined
              }
            }
            // else {
            //   if (['constant', 'object_attribute'].includes(nestItem.value_type)) {
            //     console.log('not block child item: ', [nestItem, nestedIndex, nestLevel])
            //     // nestItem.position = 0
            //   }
            // }
          }

          if (omitKeys) {
            Object.keys(nestItem).forEach(key => {
              if (omitProps.includes(key)) {
                delete nestItem[key]
              }
            })
          }

          if (nestItem.children.length) {
            // console.log('has children - recurse: ', )
            nestedObjectNormalize(nestItem.children, index, nestLevel + 1)
          }
          else if (!nestItem.children.length) {
            // console.log('no children -- delete: ', )
            // delete nestItem.children
          }
          delete nestItem.children
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
          } else {
            let parentFound = findParent(initial.nested, value)
            if (parentFound) {
              // console.log('parentFound: ', value)
              checkLeftOvers(initial.left, value)
            } else {
              // console.log('no parent found: ', value)
              initial.left.push(value)
            }
          }
          return index < original.length - 1
              ? initial
              : initial.nested
        }, {nested: [], left: []})

      }

      this.formula = formula0
      // this.formula = testFormula // formulaSimple // formula0
      // this.formula = formula0
      this.formulaString = getFormulaString(this.formula, 'Numbers')

      const omitProps = [
          'active',
        'backgroundColor',
        'block',
        'blockGroupId',
        'count',
        'id',
        'parentId',
        'root',
        'valueType',
      ]

      const formula = [...this.formula]
      const filteredFormula = filterCloseBlocks(formula.map(item => {
        item.children = []
        return item
      }))

      let nestedObj = [...filteredFormula].reduce((initial, value, index, original) => {
        if (value.parentId === '0') {
          if (initial.left.length) checkLeftOvers(initial.left, value)

          if (value.block) {
            value.value = {
              operation: '',
              query: [],
              operands: []
            }
          } else {
            value.value_type = value.valueType
          }

          value.root = true;
          initial.nested.push(value)
        }
        else {
          let parentFound = findParent(initial.nested, value)
          if (parentFound) {
            checkLeftOvers(initial.left, value)
          } else {
            initial.left.push(value)
          }
        }
        return index < original.length - 1
            ? initial
            : initial.nested
      }, {nested: [], left: []})

      if (nestedObj?.length === 1) {
        console.log('one array item: ', nestedObj)
      }
      console.log('nestedObj: ', nestedObj)

      outputCf.formula.operation = nestedObj.find(item => item.value_type === 'operator')?.value

      const hasBlock = nestedObj.find(item => item.block)

      if (hasBlock) {
        console.log('hasBlock: ', nestedObj)
        const rootItems = nestedObj.filter(obj => obj.root && !obj.block)
        console.log('root items: ', rootItems)
        if (!rootItems.length) {
          console.log('no root items --> nestedObj: ', nestedObj)
        }
        outputCf.formula.operation = rootItems.find(ri => ri.value_type === 'operator')?.value ?? ''
        outputCf.formula.operands = nestedObj.filter(operand => operand.value_type !== 'operator')
        nestedObjectNormalize(nestedObj)
        console.log('nestedObj/outputCF: ', [nestedObj, outputCf])

        this.tree = nestedObj
        this.cfData = outputCf

      } else {
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
        this.tree = nestedObj
        this.cfData = outputCf
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
          } else {
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