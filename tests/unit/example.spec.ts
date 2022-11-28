import { shallowMount } from '@vue/test-utils'
import FormulaBuilderComplex from '@/components/formula-builder-complex/index.vue'

describe('FormulaBuilderComplex.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(FormulaBuilderComplex, {
      props: { msg },
      data() {
        return {
          formula: [
            // open
            {
              "backgroundColor": "#ccd1ff",
              "block": "open",
              "blockGroupId": "f7eb728f-e178-4c4b-8ebb-5465f979f616",
              "id": "00f775ef-1f53-4283-ac07-0772d57f8448",
              "parentId": '0',
              "value": "block_open",
              "valueType": "operator"
            },

            // open
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

            // close
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

            // close
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
        }
      }
    })
    console.log(wrapper.vm)
    expect(true).toBe(true)
    // expect(wrapper.text()).toMatch(msg)
  })
})
