<template>
  <div>
    <div>
      <el-button-group @click="builderTypeClick">
        <el-button type="primary">DnD</el-button>
        <el-button type="primary">Block</el-button>
      </el-button-group>
    </div>
    <template v-if="builderType === 'block'">
      <formula-block-builder
       :formula="formula"
        :object-attributes="objectAttributes"
        :formula-example="formulaExample"
        @update-formula="updateFormula"
      />

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
      formula000: [
        {
          "id": "3e67b123-fd50-44e6-bb54-dd9ce8388615",
          "valueType": "constant",
          "value": "3"
        },
        {
          "id": "db6f18d5-0e83-4089-8717-39f72488e515",
          "valueType": "operator",
          "value": "multiply",
          "label": "x"
        },
        {
          "id": "3a60b0fe-0e54-4bac-a226-54c2eb8e9fa8",
          "valueType": "operator",
          "value": "block_open",
          "block": "open",
          "children": [
            {
              "id": "bbdfb397-0e45-41f3-9bc0-a0af4917c955",
              "valueType": "operator",
              "value": "block_open",
              "block": "open",
              "children": [
                {
                  "id": "0f1f2397-5ab0-43ae-8767-af4d31dfc6df",
                  "valueType": "constant",
                  "value": "3"
                },
                {
                  "id": "122da106-cac1-4b37-a6d1-c48beab3d6a6",
                  "valueType": "operator",
                  "value": "multiply",
                  "label": "x"
                },
                {
                  "id": "fa4e5aae-695e-4379-9789-25d4955e3526",
                  "valueType": "constant",
                  "value": "4"
                }
              ]
            },
            {
              "id": "17cb251d-5b3d-4590-ad64-ec9563bf3902",
              "valueType": "operator",
              "value": "subtract",
              "label": "-"
            },
            {
              "id": "5fd8c68a-ae32-4384-b681-7ae041d87196",
              "valueType": "operator",
              "value": "block_open",
              "block": "open",
              "children": [
                {
                  "id": "b8427906-0064-4f7f-9764-457229157097",
                  "valueType": "constant",
                  "value": "1"
                },
                {
                  "id": "f0ab87a5-d83b-4449-82f2-5a53b5fbca3c",
                  "valueType": "operator",
                  "value": "add",
                  "label": "+"
                },
                {
                  "id": "3ea1efa1-46ea-4cad-8b3f-43bcfaa1741c",
                  "valueType": "constant",
                  "value": "2"
                }
              ]
            }
          ]
        }
      ],
      formula0: [
        {
          "id": "edfdaf9f-edab-4a17-9500-21d67a242cf6",
          "backgroundColor": "yellow",
          "children": [
            {
              "id": "396f0304-e3ae-4aa4-9efb-cb0af475ca46",
              "backgroundColor": "sand",
              "children": [
                {
                  "id": "9fd92cb5-6484-4215-8bbd-d4d7a3a4fece",
                  "backgroundColor": "blue",
                  "children": [
                    {
                      "id": "f6bfdc68-171f-43ec-86cf-d271e6c02cab",
                      "value": "1",
                      "valueType": "constant",
                    },
                    {
                      "id": "e21c2add-b3f9-4f1f-8ca4-ac6bb2e4548b",
                      "label": "+",
                      "value": "add",
                      "valueType": "operator",
                    },
                    {
                      "id": "7b73ad94-5192-42b7-bd43-eeb76728d527",
                      "value": "2",
                      "valueType": "constant",
                    }
                  ],
                  "valueType": "block",
                },
                {
                  "id": "d84fd1cc-ad41-4074-90cc-ff7c4b1ebd27",
                  "label": "x",
                  "value": "multiply",
                  "valueType": "operator",
                },
                {
                  "id": "6ac41d9c-4c55-4436-8cd0-560b8384f233",
                  "value": "3",
                  "valueType": "constant",
                }
              ],
              "valueType": "block",
            },
            {
              "id": "ae28a9a4-819c-42c3-8481-6f4093034575",
              "label": "/",
              "value": "divide",
              "valueType": "operator",
            },
            {
              "id": "fb5735fc-de5b-40cd-a016-ea2767ede775",
              "value": "2",
              "valueType": "constant",
            }
          ],
          "valueType": "block",
        },
        {
          "id": "0f1f7d4e-2104-48d7-8ad3-9852bc785e7e",
          "label": "x",
          "value": "multiply",
          "valueType": "operator",
        },
        {
          "id": "68cb773f-51c4-453a-8f36-e61abf3cdb05",
          "value": "0.75",
          "valueType": "constant",
        }
      ],
      formula1: [
        {
          "id": "89eff0be-1a78-49d3-a922-4d4c3d90b6df",
          "valueType": "constant",
          "value": "3",
        },
        {
          "id": "9649da20-15f0-4e5d-8c16-8d5a2266f372",
          "valueType": "operator",
          "value": "multiply",
          "label": "x",
        },
        {
          "id": "e307b695-ac5c-48fb-8e1b-b57c38dbc3da",
          "valueType": "constant",
          "value": "2",
        },
        {
          "id": "0f7f30d2-c56d-4f22-b9b8-e2c7cb75d273",
          "valueType": "operator",
          "value": "add",
          "label": "+",
        },
        {
          "id": "db08e08d-7654-485d-8d74-8af8ff84045e",
          "valueType": "operator",
          "value": "block_open",
          "block": "open",
          "children": [
            {
              "id": "a552dddc-c74f-4d72-a23d-b506b02e9e6c",
              "valueType": "constant",
              "value": "10",
            },
            {
              "id": "bdc2e895-58d9-47dc-8876-ab50431e4991",
              "valueType": "operator",
              "value": "subtract",
              "label": "-",
            },
            {
              "id": "269c4b28-105a-49f6-99b5-109192cac58d",
              "valueType": "constant",
              "value": "2",
            }
          ]
        }
      ],
      formula2: [
        {
          "id": "5af25711-6986-4213-bb45-a1cd162d4a1a",
          valueType: 'operator',
          value: 'block_open',
          block: 'open',
          "children": [
            {
              "id": "e56c0a1e-9430-46a8-a748-8762b19b9e78",
              valueType: 'operator',
              value: 'block_open',
              block: 'open',
              "children": [
                {
                  "id": "65c2ebeb-f23c-4fca-917b-a0fcebfa2e55",
                  "valueType": "constant",
                  "value": "1"
                },
                {
                  "id": "11a80b70-a85c-4ed9-82d4-31ecec3cb3aa",
                  "valueType": "operator",
                  "value": "add",
                  "label": "+"
                },
                {
                  "id": "10c3459c-f94c-4cde-9a2b-c4dab2ed4d26",
                  "valueType": "constant",
                  "value": "2"
                }
              ]
            },
            {
              "id": "35410b16-80c4-4490-af4b-4a270838d504",
              "valueType": "operator",
              "value": "multiply",
              "label": "x"
            },
            {
              "id": "3c7997b6-ba2c-48b7-9862-d115370f8a37",
              "valueType": "constant",
              "value": "3"
            }
          ]
        },
        {
          "id": "97199ffb-5162-4eaf-ace1-e1a9192bd9fe",
          "valueType": "operator",
          "value": "multiply",
          "label": "x"
        },
        {
          "id": "577d5cb6-af55-4caf-8482-b242d910185a",
          "valueType": "constant",
          "value": "0.75"
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
      formulaTestNestedConstantFirst: [
        {
          "id": "118",
          "value": "3",
          "valueType": "constant"
        },
        {
          "id": "117",
          "label": "x",
          "value": "multiply",
          "valueType": "operator"
        },
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
      console.log('checkMove: ', [evt, originalEvent])
      return true
    },
    colorGen(colors) {
      const randomIndex = Math.floor(Math.random() * colors.length) + 1
      const newColor = colors[randomIndex]
      console.log([colors, newColor])
      return newColor
    },
    handleOperatorClick(evt, element) {
      console.log('handleOperatorClick: ', [evt, element])
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
      console.log('handleFieldsClone value: ', id, label, object_attribute_id)

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
      console.log('operatorStart: ', [evt, evt.originalEvent])
      this.drag = true
    },
    pullCallback(evt) {
      console.log('pullCallback: ', evt)
      return 'clone'
    },
    operatorEnd() {
      this.drag = false
    },
    updateFormula(value) {
      console.log('updateFormula: ', value)
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