<template>
  <div>
    <div class="flex">
      <div class="w-20">
        <draggable
          class="operators-container flex"
          v-model="operators"
          :group="{ name: 'formula', pull: 'clone', put: false }"
          ghost-class="sortable-ghost"
          selected-class="sortable-selected"
          :sort="false"
          @start="drag=true"
          @end="drag=false"
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

        <div>fields</div>
      </div>
      <div class="w-70">
        <nested-draggable class="ma3 ph3 flex-wrap" :formula="formula"/>
      </div>
    </div>
    <div class="">{{ formulaString }}</div>
    <div class="flex tl pa3">
      <div class="mr3 pa3 ba b--light-purple br3-l b--solid"><pre>{{ formula }}</pre></div>
      <div class="mr3 pa3 ba b--light-purple br3-l b--solid"><pre>{{ flattenedFormula }}</pre></div>
      <div class="mr3 pa3 ba b--light-purple br3-l b--solid"><pre>{{ cfData }}</pre></div>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
import nestedDraggable from '../components/nested-simple/index.vue'
import {operators} from '@/constants'
import {v4 as uuidv4} from 'uuid'
import { createCfData, flattenFormula} from '@/helpers/formula-validation/index.ts'
export default {
  name: "nested-example",
  display: "Nested",
  order: 15,
  components: {
    Draggable,
    nestedDraggable
  },
  data() {
    return {
      drag: false,
      formula: [
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
      operators,
    }
  },
  computed: {
    cfData() {
      return createCfData(this.flattenedFormula)
    },
    formulaString() {
      return this.formula.reduce((acc, item) => {
        if (item.children) {
          acc += this.blockString(item)
        }
        else {
          acc += item.valueType === 'operator' && !item.children
            ? item.value === 'multiply' ? '*' : item.label
            : item.value
        }

        return acc
      }, '')
    },
    flattenedFormula() {
      return flattenFormula(this.formula)
    }
  },
  methods: {
    blockString(item) {
      let string = '('
      item.children.forEach(child => {
        if (child.children) {
          string += this.blockString(child)
        }
        else {
          string += child.valueType === 'operator'
            ? child.value === 'multiply' ? '*' : child.label
            : child.value
        }
      })
      string += ')'

      return string
    },
    checkMove(evt, originalEvent) {
      console.log('checkMove: ', [evt, originalEvent])
      return true
    },
    handleOperatorClick(evt) {
      console.log('handleOperatorClick: ', evt)
    },
    handleOperatorsClone({value, label, valueType}) {
      console.log('handleOperatorsClone: ', label, value, valueType)
      if (valueType === 'operator') {
        return {
          id: uuidv4(),
          valueType: 'operator',
          value,
          label
        }
      }
      else if (valueType === 'constant') {
        return {
          id: uuidv4(),
          valueType: 'constant',
          value: 0,
        }
      }
      else if (valueType === 'block') {
        return {
          id: uuidv4(),
          valueType: 'operator',
          value: 'block_open',
          block: 'open',
          children: []
        }
      }
    }
  }
};
</script>
<style scoped lang="scss">
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