<template>
  <div>
    <h1>Tree Data Examples</h1>
    <div><pre>{{ formulaExample }}</pre></div>
    <div style="display: flex">
      <div style="display: flex; text-align: left">
        <pre>{{ JSON.stringify(tree, null, 2) }}</pre>
      </div>
      <div style="display: flex; text-align: left">
        <pre>{{ JSON.stringify(formula, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
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
      tree: []
    }
  },
  computed: {},
  created() {
    // this.validateFormula(this.formula)
    // this.createDataTree()
    this.createNested()
  },
  methods: {
    createNested() {
      const flat1 = [
        { id: 'a2', name: 'Item 1', parentId: 'a' },
        { id: 'b2-2-1', name: 'Item 2-2-1', parentId: 'b2-2'},
        { id: 'a1', name: 'Item 1', parentId: 'a' },
        { id: 'a', name: 'Root 1', parentId: null },
        { id: 'b', name: 'Root 2', parentId: null },
        { id: 'c', name: 'Root 3', parentId: null },
        { id: 'b1', name: 'Item 1', parentId: 'b' },
        { id: 'b2', name: 'Item 2', parentId: 'b' },
        { id: 'b2-1', name: 'Item 2-1', parentId: 'b2' },
        { id: 'b2-2', name: 'Item 2-2', parentId: 'b2' },
        { id: 'b3', name: 'Item 3', parentId: 'b' },
        { id: 'c1', name: 'Item 1', parentId: 'c' },
        { id: 'c2', name: 'Item 2', parentId: 'c' }
      ];
      const flat = [
        {
          "backgroundColor": "#ccd1ff",
          "block": "open",
          "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f616",
          "id": "00f775ef-1f53-4283-ac07-0772d57f8448",
          "parentId": null,
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
          "parentId": null,
          "value": "multiply",
          "valueType": "operator"
        },
        {
          "id": "23a581bb-f708-4a0b-b584-aa5507bfcba4",
          "parentId": null,
          "value": "0.75",
          "valueType": "constant"
        }
      ].filter(item => item?.block !== 'close')

      function checkLeftOvers(leftOvers, possibleParent){
        for (let i = 0; i < leftOvers.length; i++) {
          if(leftOvers[i].parentId === possibleParent.id) {
            delete leftOvers[i].parentId
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
          if(possibleParents[i].id === possibleChild.parentId) {
            found = true
            // delete possibleChild.parentId
            if(possibleParents[i].children) possibleParents[i].children.push(possibleChild)
            else possibleParents[i].children = [possibleChild]
            possibleParents[i].count = possibleParents[i].children.length
            return true
          } else if (possibleParents[i].children) found = findParent(possibleParents[i].children, possibleChild)
        }
        return found;
      }

      const nested = flat.reduce((initial, value, index, original) => {
        if (value.parentId === null) {
          if (initial.left.length) checkLeftOvers(initial.left, value)
          // delete value.parentId
          value.root = true;
          initial.nested.push(value)
        }
        else {
          let parentFound = findParent(initial.nested, value)
          if (parentFound) checkLeftOvers(initial.left, value)
          else initial.left.push(value)
        }
        return index < original.length - 1
            ? initial
            : initial.nested
      }, {nested: [], left: []})

      console.log(nested)
      this.tree = nested
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

</style>