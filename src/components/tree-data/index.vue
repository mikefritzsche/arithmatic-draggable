<template>
  <div>
    <h1>Tree Data Examples</h1>
    <div>Selected Formula: {{ activeFormulaOption }}</div>
    <el-select v-model="activeFormulaOption">
      <el-option
        v-for="(option, index) in formulaOptions"
        :value="option"
        :key="index"
      >
        {{ option }}
      </el-option>
    </el-select>
    <div class="flex" style="gap: 10px; justify-content: center; align-items: center">
      <pre class="title">original:</pre>
      <pre>{{ formulaStringBase }}</pre>
      <pre class="title">Modified:</pre>
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
import {getFormulaString} from '@/components/formula-builder-complex/helpers/formula-validation.js'
import {createCfData} from '@/components/formula-builder-complex/helpers/formula-validation/index'

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
    }
    else {
      node = node.left
    }
  }
  if (p == null) {
    this.root = treeNode
  }
  else if (key < p.key) {
    p.left = treeNode
  }
  else {
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

const formulaArrays = {
  nested1: [
    {
      id: '5af25711-6986-4213-bb45-a1cd162d4a1a',
      valueType: 'operator',
      value: 'block_open',
      block: 'open',
      parentId: '0'
    },
    {
      id: 'e56c0a1e-9430-46a8-a748-8762b19b9e78',
      valueType: 'operator',
      value: 'block_open',
      block: 'open',
      parentId: '5af25711-6986-4213-bb45-a1cd162d4a1a'
    },
    {
      id: '65c2ebeb-f23c-4fca-917b-a0fcebfa2e55',
      valueType: 'constant',
      value: '1',
      parentId: 'e56c0a1e-9430-46a8-a748-8762b19b9e78'
    },
    {
      id: '11a80b70-a85c-4ed9-82d4-31ecec3cb3aa',
      valueType: 'operator',
      value: 'add',
      label: '+',
      parentId: 'e56c0a1e-9430-46a8-a748-8762b19b9e78'
    },
    {
      id: '10c3459c-f94c-4cde-9a2b-c4dab2ed4d26',
      valueType: 'constant',
      value: '2',
      parentId: 'e56c0a1e-9430-46a8-a748-8762b19b9e78'
    },
    {
      id: '35410b16-80c4-4490-af4b-4a270838d504',
      valueType: 'operator',
      value: 'multiply',
      label: 'x',
      parentId: '5af25711-6986-4213-bb45-a1cd162d4a1a'
    },
    {
      id: '3c7997b6-ba2c-48b7-9862-d115370f8a37',
      valueType: 'constant',
      value: '3',
      parentId: '5af25711-6986-4213-bb45-a1cd162d4a1a'
    },
    {
      id: '97199ffb-5162-4eaf-ace1-e1a9192bd9fe',
      valueType: 'operator',
      value: 'multiply',
      label: 'x',
      parentId: '0'
    },
    {
      id: '577d5cb6-af55-4caf-8482-b242d910185a',
      valueType: 'constant',
      value: '0.75',
      parentId: '0'
    }
  ],
  formula0: [
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
  ],

  formula01: [
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
  ],

  formula011: [
    // block 1
    {
      "backgroundColor": "var(--orange-4)",
      "block": "open",
      "blockGroupId": "f2a6f6d5-48fa-436a-bf67-afc92055e5be",
      "id": "579f109f-685f-4705-9c6e-bcfd7ad3d9a9",
      "parentId": "0",
      "value": "block_open",
      "valueType": "operator",
      "active": false
    },

    // constant/operator
    {
      "id": "8b53baf6-1c08-44e5-a61f-41e4fd111143",
      "parentId": "579f109f-685f-4705-9c6e-bcfd7ad3d9a9",
      "value": "0.75",
      "valueType": "constant"
    },
    {
      "id": "f1741b79-bfd1-4a9b-9803-a2d96882f570",
      "parentId": "579f109f-685f-4705-9c6e-bcfd7ad3d9a9",
      "value": "multiply",
      "valueType": "operator"
    },

    // block 2
    {
      "block": "open",
      "blockGroupId": "ff6bfcae-ada3-4f9b-886d-b2a3df9ba932",
      "id": "c27ae9d5-ebbe-4dfa-9872-d15e8461e768",
      "parentId": "579f109f-685f-4705-9c6e-bcfd7ad3d9a9",
      "value": "block_open",
      "valueType": "operator"
    },

    // constant/operator
    {
      "id": "0f280794-44e6-493b-8c1d-b863ae571b9e",
      "parentId": "c27ae9d5-ebbe-4dfa-9872-d15e8461e768",
      "value": "3",
      "valueType": "constant"
    },
    {
      "id": "c4c822db-48f9-48a3-b21e-23e4bb7c69c2",
      "parentId": "c27ae9d5-ebbe-4dfa-9872-d15e8461e768",
      "value": "multiply",
      "valueType": "operator"
    },

    // block 3
    {
      "block": "open",
      "blockGroupId": "68ea253d-d907-4e06-a63c-9142bf3fab87",
      "id": "10792371-9fa6-46d7-8b83-4b04456ac495",
      "parentId": "c27ae9d5-ebbe-4dfa-9872-d15e8461e768",
      "value": "block_open",
      "valueType": "operator"
    },

    {
      "id": "4e39900e-d621-49c0-a451-bf1901ef97c4",
      "parentId": "10792371-9fa6-46d7-8b83-4b04456ac495",
      "value": "2",
      "valueType": "constant"
    },
    {
      "id": "1dd9cc3f-4bf6-4516-be84-e59f7280958b",
      "parentId": "10792371-9fa6-46d7-8b83-4b04456ac495",
      "value": "add",
      "valueType": "operator"
    },
    {
      "id": "d9eeea12-2412-4c34-8172-ae73f82228f0",
      "parentId": "10792371-9fa6-46d7-8b83-4b04456ac495",
      "value": "1",
      "valueType": "constant"
    },

    // block 3 close
    {
      "block": "close",
      "blockGroupId": "68ea253d-d907-4e06-a63c-9142bf3fab87",
      "id": "85923754-44c9-4515-aa10-329dd5a5335a",
      "parentId": "c27ae9d5-ebbe-4dfa-9872-d15e8461e768",
      "value": "block_close",
      "valueType": "operator"
    },

    // block 2 close
    {
      "block": "close",
      "blockGroupId": "ff6bfcae-ada3-4f9b-886d-b2a3df9ba932",
      "id": "9b8be22a-80a0-4eb6-9719-938f7ef89ef7",
      "parentId": "579f109f-685f-4705-9c6e-bcfd7ad3d9a9",
      "value": "block_close",
      "valueType": "operator"
    },

    // block 1 close
    {
      "backgroundColor": "var(--orange-4)",
      "block": "close",
      "blockGroupId": "f2a6f6d5-48fa-436a-bf67-afc92055e5be",
      "id": "a219280f-7764-41a0-a5c0-69daca1132ce",
      "parentId": "0",
      "value": "block_close",
      "valueType": "operator"
    }
  ],

  formula02: [
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
  ],

  formula1: [
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
  ],

  formula2: [
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
  ],

  formula3: [
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
  ],

  formulaSimple: [
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
  ],

  testFormula: [
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
  ],

  autogenBlockFirst: [
    {
      "active": false,
      "id": "b9eedc32-4b93-4248-942d-d109f79d6aec",
      "parentId": "0",
      "backgroundColor": "",
      "block": "open",
      "blockGroupId": "58256e67-5d55-4da3-8faa-20b2f239a520",
      "index": 0,
      "value": "block_open",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "a9dec21b-7b2c-49d6-8580-52dccb8f4a73",
      "parentId": "b9eedc32-4b93-4248-942d-d109f79d6aec",
      "backgroundColor": "",
      "block": "open",
      "blockGroupId": "813e1d76-dc5c-48d1-a99c-167861acd04e",
      "index": 1,
      "value": "block_open",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "bfa06b5d-9f72-42f9-9b52-8f98a6d98fe7",
      "parentId": "a9dec21b-7b2c-49d6-8580-52dccb8f4a73",
      "backgroundColor": "",
      "block": "open",
      "blockGroupId": "e475b68d-3740-4f00-be56-822a1ea02871",
      "index": 2,
      "value": "block_open",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "37f68575-6503-4cc9-9e1a-7a30ff18ae0e",
      "parentId": "bfa06b5d-9f72-42f9-9b52-8f98a6d98fe7",
      "value": "1",
      "valueType": "constant"
    },
    {
      "active": false,
      "id": "f15171f6-6e04-4712-92ad-0186f3c6bb56",
      "parentId": "bfa06b5d-9f72-42f9-9b52-8f98a6d98fe7",
      "value": "add",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "59c842ae-6e66-4097-9b4f-c1b956fcb2e6",
      "parentId": "bfa06b5d-9f72-42f9-9b52-8f98a6d98fe7",
      "value": "2",
      "valueType": "constant"
    },
    {
      "active": false,
      "id": "48c12d0d-5fe3-4f24-aa14-ccbdbfb60bf3",
      "parentId": "a9dec21b-7b2c-49d6-8580-52dccb8f4a73",
      "backgroundColor": "",
      "block": "close",
      "blockGroupId": "e475b68d-3740-4f00-be56-822a1ea02871",
      "index": 6,
      "value": "block_close",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "8a5c2e08-b3d5-467d-8471-d455eef28819",
      "parentId": "a9dec21b-7b2c-49d6-8580-52dccb8f4a73",
      "value": "multiply",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "7cff8c8e-5925-480d-8e18-c5bcca459a7c",
      "parentId": "a9dec21b-7b2c-49d6-8580-52dccb8f4a73",
      "value": "3",
      "valueType": "constant"
    },
    {
      "active": false,
      "id": "9a7e32f7-f38f-4c75-89b7-cf12893828ee",
      "parentId": "b9eedc32-4b93-4248-942d-d109f79d6aec",
      "backgroundColor": "",
      "block": "close",
      "blockGroupId": "813e1d76-dc5c-48d1-a99c-167861acd04e",
      "index": 9,
      "value": "block_close",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "2af7cb9d-e1d0-4a57-ab52-0c5eb9bfb9be",
      "parentId": "b9eedc32-4b93-4248-942d-d109f79d6aec",
      "value": "divide",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "4ee0e200-5d5d-42c6-abf2-e604704e988d",
      "parentId": "b9eedc32-4b93-4248-942d-d109f79d6aec",
      "value": "2",
      "valueType": "constant"
    },
    {
      "active": false,
      "id": "caca88fa-41b4-4089-987b-755bb2a57132",
      "parentId": "0",
      "backgroundColor": "",
      "block": "close",
      "blockGroupId": "58256e67-5d55-4da3-8faa-20b2f239a520",
      "index": 12,
      "value": "block_close",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "147b991b-81fb-4665-84f4-146ee7ab3c6c",
      "parentId": "0",
      "value": "divide",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "26459c44-4f62-4788-95b2-5f0ee71a05a9",
      "parentId": "0",
      "value": "021b0102-5150-47a0-811f-f693c93684ac",
      "valueType": "object_attribute"
    }
  ],

  autogen: [
    {
      "active": false,
      "id": "397c50f1-051f-45c3-a4d4-f7872fd9512c",
      "parentId": "0",
      "value": "2",
      "valueType": "constant"
    },
    {
      "active": false,
      "id": "142dd9f3-2f87-49e7-be1d-2566fc9e8ab3",
      "parentId": "0",
      "value": "divide",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "9f354f8e-06b3-43a5-b091-c864462844d5",
      "parentId": "0",
      "backgroundColor": "var(--raspberry-4)",
      "block": "open",
      "blockGroupId": "e710f8f3-5a01-4a37-a7bc-f3ef496f2464",
      "index": 2,
      "value": "block_open",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "5597cb0b-6a5e-423b-b1fd-6b23bb2259f3",
      "parentId": "9f354f8e-06b3-43a5-b091-c864462844d5",
      "backgroundColor": "var(--sand-4)",
      "block": "open",
      "blockGroupId": "a970cfb9-ca55-4de8-bdbf-af8cb6f872d5",
      "index": 3,
      "value": "block_open",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "0214535f-ca9b-4008-9544-95d7a69a6a70",
      "parentId": "5597cb0b-6a5e-423b-b1fd-6b23bb2259f3",
      "backgroundColor": "var(--grape-4)",
      "block": "open",
      "blockGroupId": "3b541999-e9fa-47b4-8ea6-aa110b49cfd0",
      "index": 4,
      "value": "block_open",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "6c3a52aa-dc96-4d06-ac15-3384bef36bfe",
      "parentId": "0214535f-ca9b-4008-9544-95d7a69a6a70",
      "value": "1",
      "valueType": "constant"
    },
    {
      "active": false,
      "id": "66f5664a-e60e-4624-85b8-87372d021a8f",
      "parentId": "0214535f-ca9b-4008-9544-95d7a69a6a70",
      "value": "add",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "5144ee8d-fd00-4e97-9dc5-f3d6f679998e",
      "parentId": "0214535f-ca9b-4008-9544-95d7a69a6a70",
      "value": "2",
      "valueType": "constant"
    },
    {
      "active": false,
      "id": "5937f5b1-cbda-4243-9a3c-78085c7b00f1",
      "parentId": "5597cb0b-6a5e-423b-b1fd-6b23bb2259f3",
      "backgroundColor": "var(--grape-4)",
      "block": "close",
      "blockGroupId": "3b541999-e9fa-47b4-8ea6-aa110b49cfd0",
      "index": 8,
      "value": "block_close",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "e5da9012-cbd5-4d56-a23d-60182ba07e78",
      "parentId": "5597cb0b-6a5e-423b-b1fd-6b23bb2259f3",
      "value": "multiply",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "8dfdefa4-f7e7-4df2-8523-219775f0d8f9",
      "parentId": "5597cb0b-6a5e-423b-b1fd-6b23bb2259f3",
      "value": "3",
      "valueType": "constant"
    },
    {
      "active": false,
      "id": "328144d6-309e-4053-bb4a-18f67748f0b1",
      "parentId": "9f354f8e-06b3-43a5-b091-c864462844d5",
      "backgroundColor": "var(--sand-4)",
      "block": "close",
      "blockGroupId": "a970cfb9-ca55-4de8-bdbf-af8cb6f872d5",
      "index": 11,
      "value": "block_close",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "bce33f24-7ff3-4fcd-865a-0c051935deb7",
      "parentId": "9f354f8e-06b3-43a5-b091-c864462844d5",
      "value": "divide",
      "valueType": "operator"
    },
    {
      "active": false,
      "id": "267e29b1-f01e-4388-8700-e6efc13ccbe4",
      "parentId": "9f354f8e-06b3-43a5-b091-c864462844d5",
      "value": "2",
      "valueType": "constant"
    },
    {
      "active": false,
      "id": "e4b3e151-b58b-4bc6-b464-7b158b78ce49",
      "parentId": "0",
      "backgroundColor": "var(--raspberry-4)",
      "block": "close",
      "blockGroupId": "e710f8f3-5a01-4a37-a7bc-f3ef496f2464",
      "index": 14,
      "value": "block_close",
      "valueType": "operator"
    }
  ]
}
export default {
  name: "TreeDataExamples",
  data() {
    return {
      activeFormulaOption: 'formulaSimple',
      // formula: [
      //   {
      //     "backgroundColor": "#ccd1ff",
      //     "block": "open",
      //     "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f616",
      //     "children": [],
      //     "id": "00f775ef-1f53-4283-ac07-0772d57f8448",
      //     "parentId": "0",
      //     "value": "block_open",
      //     "valueType": "operator"
      //   },
      //   {
      //     "backgroundColor": "#ccd1ff",
      //     "block": "open",
      //     "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f616",
      //     "children": [],
      //     "id": "00f775ef-1f53-4283-ac07-0772d57f8448",
      //     "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
      //     "value": "block_open",
      //     "valueType": "operator"
      //   },
      //   {
      //     "children": [],
      //     "id": "d4142e0f-9ba4-4353-89d5-2d31a6b79da4",
      //     "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
      //     "value": "1",
      //     "valueType": "constant"
      //   },
      //   {
      //     "children": [],
      //     "id": "48aa2901-ee62-4373-bf23-4dfa675f9800",
      //     "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
      //     "value": "add",
      //     "valueType": "operator"
      //   },
      //   {
      //     "children": [],
      //     "id": "888e34f7-502c-4f76-910a-b2be793b2f0f",
      //     "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
      //     "value": "2",
      //     "valueType": "constant"
      //   },
      //   {
      //     "backgroundColor": "#ccd1ff",
      //     "block": "close",
      //     "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f616",
      //     "children": [],
      //     "id": "00f775ef-1f53-4283-ac07-0772d57f8448",
      //     "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
      //     "value": "block_close",
      //     "valueType": "operator"
      //   },
      //   {
      //     "children": [],
      //     "id": "ecb325f7-f4ae-46c9-b905-1afdfb3d4503",
      //     "parentId": "0",
      //     "value": "multiply",
      //     "valueType": "operator"
      //   },
      //   {
      //     "children": [],
      //     "id": "c130c140-0fac-45c4-8bad-4129951d0f8c",
      //     "parentId": "0",
      //     "value": "3",
      //     "valueType": "constant"
      //   },
      //   {
      //     "backgroundColor": "#ccd1ff",
      //     "block": "close",
      //     "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f616",
      //     "children": [],
      //     "id": "00f775ef-1f53-4283-ac07-0772d57f8448",
      //     "parentId": "00f775ef-1f53-4283-ac07-0772d57f8448",
      //     "value": "block_close",
      //     "valueType": "operator"
      //   },
      //   {
      //     "children": [],
      //     "id": "d51cade9-6d5a-4c15-a28b-3797d5ff159d",
      //     "parentId": "0",
      //     "value": "multiply",
      //     "valueType": "operator"
      //   },
      //   {
      //     "children": [],
      //     "id": "23a581bb-f708-4a0b-b584-aa5507bfcba4",
      //     "parentId": "0",
      //     "value": "0.75",
      //     "valueType": "constant"
      //   }
      // ],
      formulaExample: '((1 + 2) * 3) * 0.75 = 6.75',
      formulaOptions: Object.keys(formulaArrays),
      formulaString: '',
      formulaStringBase: '',
      tree: [],
      cfData: {}
    }
  },
  computed: {
    formula() {
      return formulaArrays[this.activeFormulaOption]
    }
  },
  watch: {
    activeFormulaOption(value) {
      this.createNested()
    }
  },
  created() {
    // this.validateFormula(this.formula)
    // this.createDataTree()
    this.createNested()
  },
  methods: {
    createNested() {
      const omitProps = [
        'active',
        'backgroundColor',
        'block',
        'blockGroupId',
        'count',
        'id',
        'index',
        'parentId',
        'root',
        'valueType',
      ]
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

      // (( 2 + 1 ) * 3 )  * 0.75
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

      // ((( 2 + 1 ) * 3 )  * 0.75 )
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

      // (0.75 * (3 * (2 + 1)))
      const formula011 = [
        // block 1
        {
          "backgroundColor": "var(--orange-4)",
          "block": "open",
          "blockGroupId": "f2a6f6d5-48fa-436a-bf67-afc92055e5be",
          "id": "579f109f-685f-4705-9c6e-bcfd7ad3d9a9",
          "parentId": "0",
          "value": "block_open",
          "valueType": "operator",
          "active": false
        },

        // constant/operator
        {
          "id": "8b53baf6-1c08-44e5-a61f-41e4fd111143",
          "parentId": "579f109f-685f-4705-9c6e-bcfd7ad3d9a9",
          "value": "0.75",
          "valueType": "constant"
        },
        {
          "id": "f1741b79-bfd1-4a9b-9803-a2d96882f570",
          "parentId": "579f109f-685f-4705-9c6e-bcfd7ad3d9a9",
          "value": "multiply",
          "valueType": "operator"
        },

        // block 2
        {
          "block": "open",
          "blockGroupId": "ff6bfcae-ada3-4f9b-886d-b2a3df9ba932",
          "id": "c27ae9d5-ebbe-4dfa-9872-d15e8461e768",
          "parentId": "579f109f-685f-4705-9c6e-bcfd7ad3d9a9",
          "value": "block_open",
          "valueType": "operator"
        },

        // constant/operator
        {
          "id": "0f280794-44e6-493b-8c1d-b863ae571b9e",
          "parentId": "c27ae9d5-ebbe-4dfa-9872-d15e8461e768",
          "value": "3",
          "valueType": "constant"
        },
        {
          "id": "c4c822db-48f9-48a3-b21e-23e4bb7c69c2",
          "parentId": "c27ae9d5-ebbe-4dfa-9872-d15e8461e768",
          "value": "multiply",
          "valueType": "operator"
        },

        // block 3
        {
          "block": "open",
          "blockGroupId": "68ea253d-d907-4e06-a63c-9142bf3fab87",
          "id": "10792371-9fa6-46d7-8b83-4b04456ac495",
          "parentId": "c27ae9d5-ebbe-4dfa-9872-d15e8461e768",
          "value": "block_open",
          "valueType": "operator"
        },

        {
          "id": "4e39900e-d621-49c0-a451-bf1901ef97c4",
          "parentId": "10792371-9fa6-46d7-8b83-4b04456ac495",
          "value": "2",
          "valueType": "constant"
        },
        {
          "id": "1dd9cc3f-4bf6-4516-be84-e59f7280958b",
          "parentId": "10792371-9fa6-46d7-8b83-4b04456ac495",
          "value": "add",
          "valueType": "operator"
        },
        {
          "id": "d9eeea12-2412-4c34-8172-ae73f82228f0",
          "parentId": "10792371-9fa6-46d7-8b83-4b04456ac495",
          "value": "1",
          "valueType": "constant"
        },

        // block 3 close
        {
          "block": "close",
          "blockGroupId": "68ea253d-d907-4e06-a63c-9142bf3fab87",
          "id": "85923754-44c9-4515-aa10-329dd5a5335a",
          "parentId": "c27ae9d5-ebbe-4dfa-9872-d15e8461e768",
          "value": "block_close",
          "valueType": "operator"
        },

        // block 2 close
        {
          "block": "close",
          "blockGroupId": "ff6bfcae-ada3-4f9b-886d-b2a3df9ba932",
          "id": "9b8be22a-80a0-4eb6-9719-938f7ef89ef7",
          "parentId": "579f109f-685f-4705-9c6e-bcfd7ad3d9a9",
          "value": "block_close",
          "valueType": "operator"
        },

        // block 1 close
        {
          "backgroundColor": "var(--orange-4)",
          "block": "close",
          "blockGroupId": "f2a6f6d5-48fa-436a-bf67-afc92055e5be",
          "id": "a219280f-7764-41a0-a5c0-69daca1132ce",
          "parentId": "0",
          "value": "block_close",
          "valueType": "operator"
        }
      ]

      // ((( 1 + 2 ) * 3 )  * 0.75 )
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

      // .75 *  ( 1 + 2 )
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

      // (((1+2)*3)*0.75)
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

      // ((1 + 2 ) * 3 )
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

      // 1 + 2
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

      // (  ( 1 + 2 )  / 3 )  * 0.75
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
          if (possibleParents[i].id === possibleChild.parentId) {
            // console.log('findParent index: ', [i, possibleParents[i].id, possibleParents[i], possibleChild.parentId, possibleChild])
            found = true
            if (possibleChild.block) {
              // console.log('possibleChild block: ', [i, possibleChild])
              // console.log('possibleChild: ', possibleChild)

              possibleChild.value_type = 'calculated_field_formula'
              possibleChild.value = {}
              // possibleChild.position = null
            }
            else {
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
          }
          else if (possibleParents[i].children) found = findParent(possibleParents[i].children, possibleChild)
        }
        return found;
      }

      function nestedObjectNormalize(nestedObject, nestedIndex = 0, nestLevel = 0, omitKeys = false) {
        nestedObject.map((nestItem, index) => {
          if (nestItem.block) {
            let treePosition = 0
            const childTreeItems = nestItem.children.reduce((acc, child) => {
              if (child.value_type === 'constant') {
                child.value = Number(child.value)
              }
              if (child.value_type === 'operator') {
                acc.operator = child
              }
              else {
                child.position = treePosition
                treePosition++
                acc.operands.push(child)
              }
              return acc
            }, {operator: {}, operands: []})
            // console.log('childTreeItems: ', childTreeItems)
            // console.log('nestedObject.map BLOCK --> index: ', index)
            nestItem.value.operands = childTreeItems.operands
            nestItem.value.operation = childTreeItems.operator.value

            nestItem.position = index === 2 ? 1 : 0
            nestItem.value_type = 'calculated_field_formula'
          }
          else if (nestItem.root) {
            if (['constant', 'object_attribute'].includes(nestItem.value_type)) {
              // console.log('root item --> not block: ', [nestItem, index])
              if (nestItem.value_type === 'constant') nestItem.value = Number(nestItem.value)
              nestItem.position = index === 0 ? 0 : index === 2 ? 1 : undefined
            }
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
            nestedObjectNormalize(nestItem.children, index, nestLevel + 1, omitKeys)
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
        return arr.reduce((initial, value, index, original) => {
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

      // this.formula = formula0
      // this.formula = formula01
      // this.formula = formula011
      // this.formula = formula1
      // this.formula = formula3
      // this.formula = formula02
      // this.formula = formulaSimple
      // this.formula = testFormula
      this.formulaStringBase = getFormulaString(this.formula, 'Numbers')
      this.formulaString = getFormulaString(this.formula, 'Numbers')

      // Remove parentheses that do not have operations outside
      if (this.formula[0].block && this.formula[this.formula.length - 1].block) {
        console.log('formula is contained by blocks`: ', this.formula)
        this.formula = this.removeContainingBlock(this.formula)
        this.formulaString = getFormulaString(this.formula, 'Numbers')
      }

      let formula = cloneDeep(this.formula)

      // make sure the children prop exists
      const filteredFormula = filterCloseBlocks(formula.map(item => {
        item.children = []
        return item
      }))

      let nestedObj = cloneDeep(filteredFormula).reduce((initial, value, index, original) => {
        if (value.parentId === '0') {
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

      console.log('nestedObj: ', nestedObj)

      const hasBlock = nestedObj.find(item => item.block)
      if (hasBlock) {
        console.log('hasBlock: ', [nestedObj, nestedObj.length])
        const rootItems = nestedObj.filter(obj => obj.root && !obj.block)
        console.log('root items: ', rootItems)
        if (!rootItems.length) {
          console.log('no root items --> nestedObj: ', nestedObj)
        }
        outputCf.formula.operation = rootItems.find(ri => ri.value_type === 'operator')?.value ?? ''
        outputCf.formula.operands = nestedObj.filter(operand => operand.value_type !== 'operator')
        nestedObjectNormalize(nestedObj, 0, 0, true)
        // console.log('nestedObj/outputCF: ', [nestedObj, outputCf])
        //
        // this.tree = nestedObj
        // this.cfData = outputCf

      }
      else {
        outputCf.formula.operands = nestedObj.reduce((acc, item, index) => {
          if (item.value_type === 'constant') {
            acc.push({
              position: index === 0 ? 0 : 1,
              value_type: item.value_type,
              value: item.value_type === 'constant' ? Number(item.value) : item.value_type
            })
          }
          return acc
        }, [])
        // console.log('outputCf: ', outputCf)
        // console.log('nestedObj: ', nestedObj)
        // this.tree = nestedObj
        // this.cfData = outputCf
      }
      console.log('outputCf: ', outputCf)
      console.log('nestedObj: ', nestedObj)
      this.tree = nestedObj
      this.cfData = outputCf
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
    },

    // remove extra block that is wrapping entire formula -- not needed
    removeContainingBlock(formulaData) {
      const parentId = formulaData[0].id

      formulaData.forEach((item, i) => {
        if (i !== 0 && i !== formulaData.length - 1 && item.parentId === parentId) {
          item.parentId = '0'
        }
        return item
      })

      formulaData.shift()
      formulaData.pop()
      return formulaData
    },

    // update parent ids for blocks, operators, constants and object attributes
    updateGroupBlockId(index) {
      console.log('updateGroupBlockId: ', index)

      /*
      if the index is for a block object that has been moved
        Get matching block (open/close)
        assign the opening block id value to the parentId property of any element between open/close
      if this is a non-block element
        determine if the element is inside any block pair and assign the id of the opening block to the parentId of the element
        if the element currently has a parentId assign but is now no longer in any block pair, set the parentId to '0'
       */
      if (this.formula[index]?.block) {
        console.log('index belongs to a block that has been moved - find all elements between: ', this.formula[index])
      }
      else {
        console.log('item moved: ', this.formula[index])
      }
      const blocks = this.formula.reduce((acc, item, blockIndex) => {
        if (item?.block) {
          acc.push({
            id: item.id,
            index: blockIndex,
            value: item,
            type: item.block,
            parentId: item.id
          })
        }
        return acc
      }, [])
      const blockTypes = this.formula.reduce((acc, item, formulaIndex) => {
        if (item?.block) {
          acc[item.block][item.blockGroupId] = {
            id: item.id,
            index: formulaIndex,
            value: item,
            type: item.block,
            parentId: item.id
          }
        }
        return acc
      }, {open: {}, close: {}})

      console.log('blocks/open/close: ', [blocks, blockTypes])

      blocks.forEach(block => {
        if (block.type === 'open') {
          console.log('open block.index: ', block.index)
          const openBlockGroupId = block.blockGroupId
          let endBlock = ''

          // find matching close block and update parent ids
          blocks.find(b => {
            if (b.type === 'close' && b.blockGroupId === openBlockGroupId) {
              const closeBlockGroupId = b.blockGroupId
              console.log('find closing block: ', [b, closeBlockGroupId, openBlockGroupId])
              console.log('closing block: ', b)
              endBlock = b
              console.log('index, block.index, endBlock.index: ', index, block.index, endBlock.index)
              if (index > block.index && index < endBlock.index) {
                this.formula[index].parentId = block.id
                console.log('add parentId to element: ', [block, endBlock, this.formula])
              }
              else {
                this.formula[index].parentId = '0'
              }
            }
          })
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
pre {
  margin: 0;
}

.title {
  font-size: 1rem
}

.code-block {
  flex: 1;
  text-align: left;
  outline: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}
</style>