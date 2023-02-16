<template>
  <div>
    <div>
      <el-button-group @click="builderTypeClick">
        <el-button type="primary">DnD</el-button>
        <el-button type="primary">Block</el-button>
      </el-button-group>
    </div>
    <h2>{{ formulaExample }}</h2>
    <template v-if="builderType === 'block'">
      <formula-block-builder
        class="w-90"
       :formula="formulaTestNestedConstantFirst"
        :object-attributes="objectAttributes"
        :formula-example="formulaExample"
        @update-formula="updateFormula"
      >
        <template #header="{ formulaString }">
          <div class="flex items-start" style="gap: 8px;">
            <div>formula block builder</div>
            <h4 class="ma0 pa0">{{ formulaString }}</h4>
          </div>
        </template>
      </formula-block-builder>

    </template>

    <div v-else class="flex">
      <div class="w-20">
        <div>Operators</div>
        <draggable
          class="operators-container flex"
          :list="operators"
          :group="{ name: 'formula', pull: pullCallback, put: false }"
          :sort="false"
          @start="operatorStart"
          @end="operatorEnd"
          :clone="handleOperatorsClone"
          :move="checkMove"
        >
          <template #item="{element}">
            <span
              v-if="!Object.keys(element).includes('showInList') || element?.showInList"
              class="operator-item"
              style="border: 1px solid #ccc; border-radius: 3px; padding: 0 5px; margin-right: 7px"
              :data-element="JSON.stringify(element)"
              @click="(event) => handleOperatorClick(event, element)"
            >{{ element.label }}</span>
          </template>
        </draggable>


        <!-- fields -->
        <el-collapse>
          <el-collapse-item :title="`Calculated Fields (${calculatedFieldsCount})`">
            <draggable
              class="fields-container"
              v-model="calculatedFields"
              :group="{ name: 'formulaItems', pull: 'clone', put: false }"
              item-key="id"
              :sort="false"
              :clone="handleFieldsClone"

              handle=".handle"
              chosen-class="sortable-chosen"
              drag-class="sortable-drag"
              ghost-class="sortable-drag"
              :multiDrag="true"
              selected-class="sortable-selected"
              style="max-height: 300px; overflow-y: auto"
            >
              <template #item="{element}">
                <div
                  class="flex"
                  v-if="element.label"
                >
                  <div class="handle" style="flex: 3">
                    <div class="taro-icon--container">
                      <i class="ti taro-icon ti-feather-trending-up"
                         style="width: 14px; height: 14px; -webkit-mask-size: 14px 14px;"></i>
                    </div>
                    <div>{{ element.label }}</div>
                  </div>
                  <div
                    style="flex: 1; text-align: right; cursor: pointer;"
                    @click="(event) => handleFieldClick(event, element)"
                  >+
                  </div>
                </div>
              </template>
            </draggable>
          </el-collapse-item>
          <el-collapse-item :title="`Account Fields ${objectAttributesCount}`">
            <draggable
              class="fields-container"
              v-model="objectAttributes"
              :group="{ name: 'formula', pull: 'clone', put: false }"
              item-key="id"
              :sort="false"
              :clone="handleFieldsClone"
              handle=".handle"
              chosen-class="sortable-chosen"
              drag-class="sortable-drag"
              ghost-class="sortable-drag"
              :multiDrag="true"
              selected-class="sortable-selected"
              style="max-height: 300px; overflow-y: auto"
            >
              <template #item="{element}">

                <div
                  class="flex"
                  v-if="element.local_label"
                >
                  <div class="handle" style="flex: 3">{{ element.local_label }}</div>
                  <div
                    style="flex: 1; text-align: right; cursor: pointer;"
                    @click="(event) => handleFieldClick(event, element)"
                  >+
                  </div>
                </div>
              </template>
            </draggable>
          </el-collapse-item>
        </el-collapse>

      </div>
      <div class="w-70">
        <div>Formula Drag: {{ formulaDrag }}</div>
        <nested-draggable
          @formula-drag="onFormulaDrag"
          class="ma3 ph3 flex-wrap"
          :formula="formula"
          :object-attributes="objectAttributes"
          @update-formula="updateFormula"
          :level="0"
        />
        <div class="w-100 flex justify-center items-center" style="position: relative; top: -10px">
          <div class="w-90 stripe-red">
            <draggable
              style="height: 30px; background-color: transparent;"
              :list="trash"
              :group="{ name: 'trash', put: () => true, pull: false}"
              ghost-class="trash-sortable-ghost"
              chosen-class="trash-chosen-item"
              drag-class="trash-drag-item"
              @add="log"
              @start="log"
              @choose="log"
              @unchoose="log"
              @setData="log"
              @update="log"
              @sort="log"
              @remove="log"
              @filter="log"
              @move="log"
              @clone="log"
              @change="log"
              @checkMove="log"
              @dragenter="log"
              @dragleave="log"
            >
              <template #item="{ element }">
                <div>{{ element }}</div>
              </template>
            </draggable>
          </div>
        </div>
        <div class="f3 lh-copy b">
          {{ formulaExample }}
        </div>
        <div class="quick-create flex">
          <div class="w-30">
            <div>Quick Create</div>
            <el-input inputStyle="width: 300px" v-model="quickCreateInput"/>
          </div>
          <el-button @click="generateQuickFormula">Generate</el-button>
        </div>
      </div>
    </div>

    <div v-if="true" class="flex tl pa3">
      <div class="w-100 mr3 pa3 ba b--light-purple br3-l b--solid">
        <h3>Nested Formula</h3>
        <pre>{{ formula }}</pre>
      </div>
      <div v-if="false" class="w-100 mr3 pa3 ba b--light-purple br3-l b--solid">
        <h3>Flattened Formula</h3>
        <pre>{{ flattenedFormula }}</pre>
      </div>
      <div class="w-100 mr3 pa3 ba b--light-purple br3-l b--solid">
        <h3>CF Data</h3>
        <pre>{{ cfData }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
/* store */
import {mapActions as piniaMapActions, mapState as piniaMapState} from 'pinia'
import {useCalculatedFieldsStore} from '@/store/calculated-fields'

import FormulaBlockBuilder from '@/components/formula-block-builder/index.vue'

import Draggable from 'vuedraggable'
import nestedDraggable from '../components/nested-simple/index.vue'
import {operators, operatorsHash} from '@/constants'
import {v4 as uuidv4} from 'uuid'
import {createCfData, flattenFormula, getFormulaExample} from '@/helpers/formula-validation/index.ts'
import {cloneDeep, uniqueId} from "lodash";
import {create, all} from 'mathjs'

import {
  attributeMappings,
  objectAttributeLabelById
} from '@/helpers/object-attributes'

const config = {}

const math = create(all, config)
window.math = math

const taroColorNames = ['kiwi', 'orange', 'raspberry', 'blueberry', 'lime', 'grape', 'sand', 'blue', 'yellow']
const taroColors = taroColorNames.reduce((colors, name) => {
  colors.push(`var(--${name}-4)`)
  return colors
}, [])

const blockElements = {
  attribute: (defaults = {}) => {
    return {
      children: defaults.children || [],
      id: defaults.id || uniqueId(),
      parentId: defaults.parentId || '0',
      value: defaults.value || undefined,
      valueType: 'object_attribute',
    }
  },
  block: (defaults = {}) => {
    return {
      backgroundColor: defaults?.backgroundColor || 'blue',
      block: defaults?.block || 'open',
      children: defaults?.children || [],
      id: defaults?.id || undefined,
      parentId: defaults?.parentId || '0',
      value: defaults?.value || 'block_open',
      valueType: defaults?.valueType || 'operator'
    }
  },
  constant: (defaults = {}) => {
    return {
      children: defaults.children || [],
      id: defaults.id || uniqueId(),
      parentId: defaults.parentId || '0',
      value: defaults.value || undefined,
      valueType: defaults.valueType || 'constant'
    }
  },
  operator: (defaults) => {
    return {
      children: defaults.children || [],
      id: defaults.id || uniqueId(),
      label: defaults.label || undefined,
      parentId: defaults.parentId || '0',
      value: defaults.value || undefined,
      valueType: defaults.valueType || 'operator'
    }
  },
}
function traverse1(node, parentId = '0') {
  const result = []
  const args = node?.content?.args
  const hasParenthesisNode = args?.reduce((acc, arg) => {
    if (arg.type === 'ParenthesisNode') acc = true
    return acc
  }, false)
  const operatorNode = {...node?.content}
  console.log('traverse node: ', [
    blockElements,
    node,
    args,
    hasParenthesisNode,
    parentId
  ])

  // const constantIndex = node.args.findIndex(arg => arg.type === 'ConstantNode')
  if (args && hasParenthesisNode) {
    const constantIndex = args.findIndex(arg => arg.type === 'ConstantNode')
    const blockId = uniqueId()
    if (constantIndex === 0) {
      result.push(...[
        blockElements.constant({ id: uniqueId(), parentId, value: args[0].value }),
        blockElements.operator({ id: uniqueId(), parentId, label: operatorsHash[operatorNode.fn].label, value: operatorNode.fn }),
        blockElements.block({ id: blockId, parentId, children: traverse1(args[1], blockId) })
      ])
    }
    else {
      result.push(...[
        blockElements.block({ id: blockId, parentId, children: traverse1(args[0], blockId) }),
        blockElements.operator({ id: uniqueId(), parentId, label: operatorsHash[operatorNode.fn].label, value: operatorNode.fn }),
        blockElements.constant({ id: uniqueId(), parentId, value: args[1].value }),
      ])
    }
  }
  else {
    result.push(...[
      blockElements.constant({ id: uniqueId(), parentId, value: args[0].value }),
      blockElements.operator({ id: uniqueId(), parentId, label: operatorsHash[operatorNode.fn].label, value: operatorNode.fn }),
      blockElements.constant({ id: uniqueId(), parentId, value: args[1].value }),
    ])
  }

  return result
}

function traverse(node, parentId = '0') {
  const result = []
  const fieldPlaceholder = 999999.999999

  const temp = Array.from({length: 3})
  const isRoot = Boolean(node?.args)
  const args = isRoot
    ? node.args
    : node?.content?.args
      ? node.content.args
      : []
  const hasParenthesisNode = args.find(arg => arg.type === 'ParenthesisNode')
  const operatorNode = isRoot ? {...node} : {...node?.content}

  if (args && hasParenthesisNode) {
    const constantIndex = args.findIndex(arg => arg.type === 'ConstantNode')
    const parenthesisIndex = args.findIndex(arg => arg.type === 'ParenthesisNode')
    const blockId = uniqueId()
    console.log('node type indexes: ', {constantIndex, parenthesisIndex})

    let constantValue = blockElements.constant({ id: uniqueId(), parentId, value: args[constantIndex].value })
    if (args[constantIndex].value === fieldPlaceholder) {
      constantValue = blockElements.attribute()
    }

    temp[1] = blockElements.operator({ id: uniqueId(), parentId, label: operatorsHash[operatorNode.fn].label, value: operatorNode.fn })
    temp[constantIndex === 0 ? 0 : 2] = constantValue
    temp[parenthesisIndex === 0 ? 0 : 2] = blockElements.block({ id: blockId, parentId, children: traverse(args[parenthesisIndex], blockId) })

    // if (constantIndex === 0) {
    //   result.push(...[
    //     blockElements.constant({ id: uniqueId(), parentId, value: args[0].value }),
    //     blockElements.operator({ id: uniqueId(), parentId, label: operatorsHash[operatorNode.fn].label, value: operatorNode.fn }),
    //     blockElements.block({ id: blockId, parentId, children: traverse(args[1], blockId) })
    //   ])
    // }
    // else {
    //   result.push(...[
    //     blockElements.block({ id: blockId, parentId, children: traverse(args[0], blockId) }),
    //     blockElements.operator({ id: uniqueId(), parentId, label: operatorsHash[operatorNode.fn].label, value: operatorNode.fn }),
    //     blockElements.constant({ id: uniqueId(), parentId, value: args[1].value }),
    //   ])
    // }
  }
  else {
    // result.push(...[
    //   blockElements.constant({ id: uniqueId(), parentId, value: args[0].value }),
    //   blockElements.operator({ id: uniqueId(), parentId, label: operatorsHash[operatorNode.fn].label, value: operatorNode.fn }),
    //   blockElements.constant({ id: uniqueId(), parentId, value: args[1].value }),
    // ])

    let constantValue0 = blockElements.constant({ id: uniqueId(), parentId, value: args[0].value })
    let constantValue1 = blockElements.constant({ id: uniqueId(), parentId, value: args[1].value })
    if (args[0].value === fieldPlaceholder) {
      constantValue0 = blockElements.attribute()
    }
    if (args[1].value === fieldPlaceholder) {
      constantValue1 = blockElements.attribute()
    }

    temp[0] = constantValue0
    temp[1] = blockElements.operator({ id: uniqueId(), parentId, label: operatorsHash[operatorNode.fn].label, value: operatorNode.fn }),
    temp[2] = constantValue1
  }
  console.log('temp: ', temp)
  return temp
}
export default {
  name: "nested-example",
  display: "Nested",
  order: 15,
  components: {
    Draggable,
    FormulaBlockBuilder,
    nestedDraggable
  },
  data() {
    return {
      attributeMappings,
      drag: false,
      formulaBlockBlock: [
        {
          "backgroundColor": "sand",
          "block": "open",
          "children": [
            {
              "id": "103",
              "value": 10,
              "valueType": "constant"
            },
            {
              "id": "102",
              "label": "+",
              "value": "add",
              "valueType": "operator"
            },
            {
              "id": "104",
              "value": 20,
              "valueType": "constant"
            }
          ],
          "id": "105",
          "value": "block_open",
          "valueType": "operator"
        },
        {
          "id": "101",
          "label": "-",
          "value": "subtract",
          "valueType": "operator"
        },
        {
          "backgroundColor": "kiwi",
          "block": "open",
          "children": [
            {
              "id": "107",
              "value": 5,
              "valueType": "constant"
            },
            {
              "id": "106",
              "label": "+",
              "value": "add",
              "valueType": "operator"
            },
            {
              "id": "108",
              "value": 3,
              "valueType": "constant"
            }
          ],
          "id": "109",
          "value": "block_open",
          "valueType": "operator"
        }
      ],

      formulaTest: [
        {
          "id": "223d461e-4bbf-4d9b-b10d-b6c7552d1f2b",
          "value": "1",
          "valueType": "constant"
        },
        {
          "id": "ebe91dba-a6b6-4b05-9560-2d8504ff8fef",
          "label": "+",
          "value": "add",
          "valueType": "operator"
        },
        {
          "id": "943a48b4-79ac-49df-8b27-e26a1020f2ba",
          "value": "2",
          "valueType": "constant"
        }
      ],
      formulaTestNested: [
        {
          "id": "113",
          "backgroundColor": "blueberry",
          "block": "open",
          "children": [
            {
              "id": "114",
              "value": "1",
              "valueType": "constant"
            },
            {
              "id": "115",
              "label": "+",
              "value": "add",
              "valueType": "operator"
            },
            {
              "id": "116",
              "value": "2",
              "valueType": "constant"
            }
          ],
          "valueType": "operator",
          "value": "block_open"
        },
        {
          "id": "117",
          "label": "x",
          "value": "multiply",
          "valueType": "operator"
        },
        {
          "id": "118",
          "value": "3",
          "valueType": "constant"
        }
      ],
      formulaTestNestedNested: [
        {
          "backgroundColor": "blue",
          "block": "open",
          "children": [
            {
              "backgroundColor": "blue",
              "block": "open",
              "children": [
                {
                  "id": "10",
                  "parentId": "7",
                  "value": 10,
                  "valueType": "constant"
                },
                {
                  "id": "12",
                  "label": "+",
                  "parentId": "7",
                  "value": "add",
                  "valueType": "operator"
                },
                {
                  "id": "11",
                  "parentId": "7",
                  "value": 20,
                  "valueType": "constant"
                }
              ],
              "id": "7",
              "parentId": "4",
              "value": "block_open",
              "valueType": "operator"
            },
            {
              "id": "9",
              "label": "-",
              "parentId": "4",
              "value": "subtract",
              "valueType": "operator"
            },
            {
              "id": "8",
              "parentId": "4",
              "value": 5,
              "valueType": "constant"
            }
          ],
          "id": "4",
          "parentId": "0",
          "value": "block_open",
          "valueType": "operator"
        },
        {
          "id": "6",
          "label": "x",
          "parentId": "0",
          "value": "multiply",
          "valueType": "operator"
        },
        {
          "id": "5",
          "parentId": "0",
          "value": 3,
          "valueType": "constant"
        }
      ],
      formulaTestNestedConstantFirst: [
        {
          "children": [],
          "id": "5",
          "parentId": "0",
          "value": 2,
          "valueType": "constant"
        },
        {
          "children": [],
          "id": "6",
          "label": "/",
          "parentId": "0",
          "value": "divide",
          "valueType": "operator"
        },
        {
          "backgroundColor": "blue",
          "block": "open",
          "children": [
            {
              "backgroundColor": "blue",
              "block": "open",
              "children": [
                {
                  "backgroundColor": "blue",
                  "block": "open",
                  "children": [
                    {
                      "children": [],
                      "id": "13",
                      "parentId": "10",
                      "value": 1,
                      "valueType": "constant"
                    },
                    {
                      "children": [],
                      "id": "15",
                      "label": "+",
                      "parentId": "10",
                      "value": "add",
                      "valueType": "operator"
                    },
                    {
                      "children": [],
                      "id": "14",
                      "parentId": "10",
                      "value": 2,
                      "valueType": "constant"
                    }
                  ],
                  "id": "10",
                  "parentId": "7",
                  "value": "block_open",
                  "valueType": "operator"
                },
                {
                  "children": [],
                  "id": "12",
                  "label": "x",
                  "parentId": "7",
                  "value": "multiply",
                  "valueType": "operator"
                },
                {
                  "children": [],
                  "id": "11",
                  "parentId": "7",
                  "value": 3,
                  "valueType": "constant"
                }
              ],
              "id": "7",
              "parentId": "4",
              "value": "block_open",
              "valueType": "operator"
            },
            {
              "children": [],
              "id": "9",
              "label": "/",
              "parentId": "4",
              "value": "divide",
              "valueType": "operator"
            },
            {
              "children": [],
              "id": "8",
              "parentId": "4",
              "value": 2,
              "valueType": "constant"
            }
          ],
          "id": "4",
          "parentId": "0",
          "value": "block_open",
          "valueType": "operator"
        }
      ],
      formulaDrag: false,
      operators: Object.freeze(operators),
      quickCreateInput: '2 / (((1 + 2) * 3) / 2)',
      builderType: 'block',
      usedBlockColors: [],
    }
  },
  computed: {
    ...piniaMapState(useCalculatedFieldsStore, ['formula']),
    availableBlockColors() {
      return taroColors.reduce((acc, color) => {
        if (!this.usedBlockColors.includes(color)) {
          acc.push(color)
        }
        return acc
      }, [])
    },
    calculatedFields() {
      return this.attributeMappings.filter(attribute => attribute.object_attribute_id && attribute.is_catalyst_cf)
    },
    calculatedFieldsCount() {
      return this.calculatedFields.length
    },
    objectAttributes() {
      return this.attributeMappings.filter(attribute => attribute.object_attribute_id && !attribute.is_catalyst_cf).slice(0, 30)
    },
    objectAttributesCount() {
      return this.objectAttributes.length
    },

    cfData() {
      if (!this.formula.length) return
      return createCfData(this.flattenedFormula)
    },
    formulaExample() {
      if (!this.formulaString) return ''
      return getFormulaExample(this.formulaString)
    },
    formulaString() {
      let attributeReplaceValue = 1
      return this.formula.reduce((acc, item) => {
        if (item?.children?.length) {
          acc += this.blockString(item, attributeReplaceValue)
        }
        else {
          if (item.valueType === 'object_attribute') {
            acc += attributeReplaceValue
            attributeReplaceValue++
          }
          else {
            acc += item.valueType === 'operator' && !item.children?.length
              ? item.value === 'multiply' ? '*' : item.label
              : item.value
          }
        }

        return acc
      }, '')
    },
    flattenedFormula() {
      return flattenFormula(cloneDeep(this.formula))
    }
  },
  created() {
    // this.setFormula(this.formula0)
    
    const baseString = '1+2'
    const baseParsed = math.parse(baseString)
    console.log('baseParsed: ', baseParsed)
    const hasParenthesisNode = baseParsed.args.find(arg => arg.type === 'ParenthesisNode')
    if (!hasParenthesisNode) {
      // console.log('no parentheses: ', baseParsed)
      const resultArr = baseParsed.args.reduce((acc, arg, i) => {
        // console.log('arg: ', arg, i)
        if (i === 1) {
          acc.push({
            children: [],
            id: uniqueId(),
            value: baseParsed.fn,
            valueType: 'operator'
          })
        }
        acc.push({
          children: [],
          id: uniqueId(),
          value: arg.value,
          valueType: 'constant'
        })
        return acc
      }, [])
      // console.log('resultArr: ', resultArr)
    }
    // const simpleObject = traverse(baseParsed);
    // console.log('simpleObject: ', simpleObject)
    /*
    const hasParentheisNode = node.args.find(arg => arg.type === 'ParenthesisNode')
        if (hasParentheisNode) {
          const constantNode = node.args.find(arg => arg.type === 'ConstantNode')
          resultArr.push({
            children: [],
            id: uniqueId(),
            value: constantNode?.value ?? undefined,
            label: node.op,
            valueType: node.op && 'operator'
          })
          resultArr.push({
            children: [],
            id: uniqueId(),
            value: node.op,
            label: node.op,
            valueType: node.op && 'operator'
          })
        }
        else {

          resultArr = node.args.reduce((acc, arg, i) => {
            console.log('arg: ', arg, i)

            return acc
          }, [])

        }
     */


    const string = '(((1 + 2) * 3) / 2) * 0.75'

  },
  methods: {
    ...piniaMapActions(useCalculatedFieldsStore, ['setFormula']),

    builderTypeClick(e) {
      console.log('builderTypeClick: ', [e, e.target.textContent])
      this.builderType = e.target.textContent.toLowerCase()
    },
    /** Quick Formula Create */
    generateQuickFormula() {
      const pattern = /(\d*\.?\d+)|({field})|(\d)|([+-/*()])/g
      const matches = this.quickCreateInput
        .replace(/\s/g, '')
        .match(pattern)

      console.log('matches: ', matches)
      const fieldPlaceholder = 999999.999999
      const replacedValues = this.quickCreateInput
        .replace(/\s/g, '')
        .replace(/({field})/g, fieldPlaceholder)
      const parsed = math.parse(replacedValues)
      // const parsed = math.parse(this.quickCreateInput.replace(/\s/g, ''))

      // const constantIndex = parsed.args.findIndex(arg => arg.type === 'ConstantNode')
      // const blockIndex = parsed.args.findIndex(arg => arg.type === 'ParenthesisNode')

      // const root = []
      const formula = traverse(parsed)
      console.log('formula: ', formula)
      // const root = Array.from({length: 3})

      // const hasParentheses = parsed.args.find(node => node.type === 'ParenthesisNode')
      // console.log('parsed: ', [parsed, hasParentheses])

      // if (!hasParentheses) {
      //   parsed.args.forEach((node, index) => {
      //     if (index === 1) {
      //       root.push(blockElements.operator({ id: uniqueId(), label: operatorsHash[parsed.fn].label, value: parsed.fn }))
      //     }
      //     if (node.value === fieldPlaceholder) {
      //       console.log('node.value: ', node.value, node.value === fieldPlaceholder, blockElements.attribute())
      //       root.push(blockElements.attribute())
      //     }
      //     else {
      //       root.push(blockElements.constant({ id: uniqueId(), value: parsed.args[0].value }))
      //     }
      //   })
      // }
      // else {
      //   const blockId = uniqueId()
      //
      //   /*
      // {
      //     backgroundColor: 'blue',
      //     block: 'open',
      //     children: [],
      //     id: blockId,
      //     parentId: '0',
      //     value: 'block_open',
      //     valueType: 'operator'
      //   },
      //   {
      //     children: [],
      //     id: uniqueId(),
      //     parentId: '0',
      //     value: parsed.fn,
      //     valueType: 'operator'
      //   },
      //   {
      //     children: [],
      //     id: uniqueId(),
      //     parentId: '0',
      //     value: '',
      //     valueType: 'constant'
      //   },
      //  */
      //   //   0            1        2
      //   // constant    operator   block
      //   // block      operator    constant
      //   console.log('operatorsHash: ', operatorsHash)
      //   console.log('parsed.args: ', parsed.args)
      //   // parsed.args.forEach((node, index) => {
      //   //   console.log('index: ', [node, index, constantIndex])
      //   //   if (node.type === 'ConstantNode') {
      //   //     console.log('constant node: ', [index, node])
      //   //     if (node.value === fieldPlaceholder) {
      //   //       console.log('node.value: ', node.value, node.value === fieldPlaceholder, blockElements.attribute())
      //   //       root.push(blockElements.attribute())
      //   //     }
      //   //     else {
      //   //       root.push(blockElements.constant({ id: uniqueId(), value: node.value }))
      //   //     }
      //   //     root.push(blockElements.operator({ id: uniqueId(), label: operatorsHash[parsed.fn].label, value: parsed.fn }))
      //   //     root.push(blockElements.block({id: blockId, children: traverse(node, blockId)}))
      //   //   }
      //   //   else {
      //   //     console.log('other node: ', [index, node])
      //   //     root.push(blockElements.block({id: blockId, children: traverse(node, blockId)}))
      //   //     root.push(blockElements.operator({ id: uniqueId(), label: operatorsHash[parsed.fn].label, value: parsed.fn }))
      //   //     if (node.value === fieldPlaceholder) {
      //   //       console.log('node.value: ', node.value, node.value === fieldPlaceholder, blockElements.attribute())
      //   //       root.push(blockElements.attribute())
      //   //     }
      //   //     else {
      //   //       root.push(blockElements.constant({ id: uniqueId(), value: parsed.args[0].value }))
      //   //     }
      //   //   }
      //   // })
      //
      //   // const constantContent = blockElements.constant({id: uniqueId(), value: parsed.args[constantIndex].value})
      //   // const blockContent = blockElements.block({id: blockId, children: traverse(parsed.args[blockIndex], blockId)})
      //   // console.log('indexes: ', constantIndex, blockIndex)
      //   // root[1] = blockElements.operator({id: uniqueId(), label: operatorsHash[parsed.fn].label, value: parsed.fn})
      //   // root[constantIndex === 0 ? 0 : 2] = constantContent
      //   // root[blockIndex === 0 ? 0 : 2] = blockContent
      //   if (constantIndex === 0) {
      //     root.push(...[
      //       blockElements.constant({id: uniqueId(), value: parsed.args[0].value}),
      //       blockElements.operator({id: uniqueId(), label: operatorsHash[parsed.fn].label, value: parsed.fn}),
      //       blockElements.block({id: blockId, children: traverse(parsed.args[1], blockId)})
      //     ])
      //   }
      //   else {
      //     root.push(...[
      //       blockElements.block({id: blockId, children: traverse(parsed.args[0], blockId)}),
      //       blockElements.operator({id: uniqueId(), label: operatorsHash[parsed.fn].label, value: parsed.fn}),
      //       blockElements.constant({id: uniqueId(), value: parsed.args[1].value}),
      //     ])
      //   }
      // }
      // console.log('root: ', root)
      this.setFormula(formula)
      // this.setFormula(root)
    },

    blockString(item, attributeReplaceValue) {
      let string = '('
      item.children.forEach(child => {
        if (child?.children?.length) {
          string += this.blockString(child, attributeReplaceValue)
        }
        else {
          // console.log('blockString: ', item, attributeReplaceValue)
          if (child.valueType === 'object_attribute') {
            string += attributeReplaceValue
            attributeReplaceValue++
          }
          else {
            // console.log('blockString else: ', child)
            string += child.valueType === 'operator' && !child?.children?.length
              ? child.value === 'multiply' ? '*' : child.label
              : child.value
          }
        }
      })
      string += ')'

      return string
    },
    checkMove(evt, originalEvent) {
      // console.log('checkMove: ', [evt, originalEvent])
      return true
    },
    colorGen(colors) {
      const randomIndex = Math.floor(Math.random() * colors.length) + 1
      const newColor = colors[randomIndex]
      // console.log([colors, newColor])
      return newColor
    },
    handleOperatorClick(evt, element) {
      // console.log('handleOperatorClick: ', [evt, element])
    },

    handleOperatorsClone({value, valueType, label}) {
      // console.log('handleOperatorsClone: ', evt)
      // return {}

      if (valueType === 'constant') {
        return {
          id: uuidv4(),
          value: undefined,
          valueType: 'constant',
        }
      }
      else if (value.includes('block')) {
        const availableColors = this.availableBlockColors.reduce((acc, color) => {
          if (!this.usedBlockColors.includes(color)) acc.push(color)
          return acc
        }, [])

        const randomIndex = Math.floor(Math.random() * availableColors.length) + 1

        const blockColor = taroColorNames[randomIndex]
        this.usedBlockColors.push(blockColor)
        this.$emit('operator-color', {value: availableColors[randomIndex], action: 'add'})
        return {
          id: uuidv4(),
          backgroundColor: blockColor,
          block: 'open',
          children: [],
          valueType: 'operator',
          value: 'block_open',
        }
      }
      else {
        return {
          id: uuidv4(),
          label,
          value,
          valueType: 'operator',
        }
      }

    },

    handleFieldsClone({id, label, object_attribute_id}) {
      // console.log('handleFieldsClone value: ', id, label, object_attribute_id)

      // const formula-item = this.operators.find(op => op.value === value)
      return {
        id: uuidv4(),
        previewValue: 3,
        valueType: 'object_attribute',
        value: object_attribute_id
      }
    },
    handleFieldClick(evt, element) {
      // console.log('handleFieldClick: ', [evt, element])
      // const formula-item = this.operators.find(op => op.value === value)
      this.formula.push({
        active: false,
        id: uuidv4(),
        groupId: 0,
        parentId: '0',
        previewValue: 3,
        valueType: 'object_attribute',
        value: element.id
      })
    },

    log(evt) {
      console.log('event: ', evt)
    },

    objectAttributeLabelById,
    onFormulaDrag(bool) {
      this.formulaDrag = bool
    },
    operatorStart(evt) {
    // operatorStart({ originalEvent }) {
    //   console.log('operatorStart: ', [evt, evt.originalEvent])
      this.drag = true
    },
    pullCallback(evt) {
      // console.log('pullCallback: ', evt)
      return 'clone'
    },
    operatorEnd() {
      this.drag = false
    },
    updateFormula(value) {
      // console.log('updateFormula: ', value)
    }
  }
};
</script>
<style scoped lang="scss">
.trash-sortable-ghost, .trash-chosen-item, .trash-drag-item {
  color: white;
  opacity: 0.3;
  background: repeating-linear-gradient(
      45deg,
      #bc6060,
      #bc6060 10px,
      #984646 10px,
      #984646 20px
  );
}

.stripe-red {
  color: white;
  opacity: 0.3;
  background: repeating-linear-gradient(
      -45deg,
      #bc6060,
      #bc6060 10px,
      #984646 10px,
      #984646 20px
  );
}

.stripe-1 {
  color: white;
  opacity: 0.3;
  background: repeating-linear-gradient(
      45deg,
      #606dbc,
      #606dbc 10px,
      #465298 10px,
      #465298 20px
  );
}

.sortable-ghost {
  background-color: transparent;
}

.sortable-selected {
  background-color: transparent;
}

.operators-container {
  margin: 10px 0;

  .operator-item {
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 0 5px;
    margin-right: 7px;
    background-color: white;
    width: 32px;
    height: 32px;
    text-align: center;
    vertical-align: middle;
    line-height: 2;
  }
}
</style>