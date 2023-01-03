import { v4 as uuidv4 } from 'uuid'
import type { ArithmeticFormulaCfData, ArithmeticFormulaElement } from '@/components/formula-builder-complex/types'
import {cloneDeep} from "lodash";
import {operators} from "@/components/formula-builder-complex/constants";
import {objectAttributeLabelById} from "@/components/formula-builder-complex/helpers/object-attributes";
import {evaluate, parse} from 'mathjs'

interface FormulaOperands {
  position: number
  value: any
  value_type: string
}
interface CfDataFormula {
  operation: string
  query: string[]
  operands: FormulaOperands[]
}
interface CfData {
  object_class_id: string
  label: string
  description: string
  formula: CfDataFormula
}

const taroColorNames = [
  'kiwi', 'orange', 'raspberry', 'blueberry', 'lime', 'grape', 'sand', 'blue', 'yellow'
]
export const taroColors = taroColorNames.reduce((colors: string[], name: string) => {
  colors.push(`var(--${name}-4)`)
  return colors
}, [])
export function setParentIds(formula: ArithmeticFormulaElement[]) {
  const blocks = formula
    .filter((f: ArithmeticFormulaElement) => f.block)
    .reduce((acc: Record<string, ArithmeticFormulaElement[]>, item: ArithmeticFormulaElement, index: number) => {
      if (item.block === 'open') item.blockGroupId = uuidv4()
      item.index = formula.findIndex((f: ArithmeticFormulaElement) => f.id === item.id)
      acc[item.block!].push(item)
      return acc
    }, {open: [], close: []})

  blocks.close.forEach((block: ArithmeticFormulaElement, index: number) => {
    block.blockGroupId = blocks.open[index].blockGroupId
  })

  blocks.open.forEach((block: ArithmeticFormulaElement) => {
    if (block.index !== 0) {
      const openBlocksIndex = blocks.open.findIndex((openBlock: ArithmeticFormulaElement) => openBlock.id === block.id)
      block.parentId = blocks.open[openBlocksIndex-1].id
    }
    if (block.index) formula[block.index] = block
  })


  Object.keys(blocks).reduce((acc, key: string) => {
    blocks[key].forEach((f: ArithmeticFormulaElement) => {
      if (f.index) formula[f.index] = f
    })
    return acc
  })
}

export function getFormulaExample(formulaString: string, formulaPreviewType: string): string {
  console.log('formulaString: ', formulaString)
  if (formulaString) {
    if (formulaPreviewType === 'Numbers') {
      try {
        // console.log('getFormulaExample: ', [formulaString, parse(formulaString), parse(formulaString).toString()])
        return `${parse(formulaString.toString())} = ${evaluate(formulaString)}`
      }
      catch (e) {
        return formulaString + 'invalid formula'
      }
    }
    else {
      return formulaString
    }
  }

  return ''
}
export function getFormulaString(formula: ArithmeticFormulaElement[], formulaPreviewType: string, objectAttributes = []) {
  let randomValue = 1
  return formula.reduce((acc, item) => {
    if (item.valueType === 'operator') {
      const operator: any = operators.find(op => op.value === item.value)
      acc += `${operator.symbol ? operator.symbol : operator.label}`
    }
    else if (item.valueType === 'constant' || (item.valueType === 'object_attribute' && formulaPreviewType === 'Field Names')) {
      if (item.valueType === 'object_attribute') {
        acc += objectAttributeLabelById(item.value as string, objectAttributes)
      }
      else {
        acc += item.value
      }
    }
    else {
      acc += item.valueType === 'object_attribute' ? item?.previewValue ?? randomValue : randomValue
      randomValue++
    }
    return acc
  }, '')
}

export function colorGen(colors: string[]): string {
  const randomIndex = Math.floor(Math.random() * colors.length) + 1
  const newColor = colors[randomIndex]
  return newColor
}
export function validateNestedObj(nestedObj: any): any {
  let isValid = true
  if (nestedObj.length === 3) {
    nestedObj.forEach((nested: any) => {
      if (nested?.children.length) {
        validateNestedObj(nested.children)
      }
    })
  }
  else {
    console.log('nested children > 3: ', nestedObj)
    isValid = false
  }
  return isValid
}
export function generateNestedObject(formula: ArithmeticFormulaElement[]) {
  // formula = cloneDeep(formula)

  const filteredFormula = filterCloseBlocks(formula.map(item => {
    item.children = []
    return item
  }))

  return (cloneDeep(filteredFormula) as ArithmeticFormulaElement[]).reduce((
    initial: any,
    value: any,
    index: number,
    original: ArithmeticFormulaElement[]
  ) => {
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
      const parentFound = findParent(initial.nested, value)
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
}
export function createCfData(formula: ArithmeticFormulaElement[]): CfData {
  console.log('createCfData: ', formula)
  formula = cloneDeep(formula)
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

  console.log('createCfData: ', formula)

  // this.formulaStringBase = getFormulaString(this.formula, 'Numbers')
  // this.formulaString = getFormulaString(this.formula, 'Numbers')

  const nestedObj = generateNestedObject(formula)

  console.log('nestedObj: ', nestedObj)

  const hasBlock = nestedObj.find((item: ArithmeticFormulaElement) => item.block)
  if (hasBlock) {
    const rootItems = nestedObj.filter((obj: any) => obj.root && !obj.block)
    outputCf.formula.operation = rootItems.find((ri: any) => ri.value_type === 'operator')?.value ?? ''
    outputCf.formula.operands = nestedObj.filter((operand: any) => operand.value_type !== 'operator')
    nestedObjectNormalize(nestedObj, 0, 0, true)
  }
  else {
    console.log('no blocks single operator: ', nestedObj)
    outputCf.formula.operation = nestedObj.find((nested: any) => nested.value_type === 'operator')?.value ?? ''
    outputCf.formula.operands = nestedObj.reduce((acc: any, item: ArithmeticFormulaCfData, index: number) => {
      if (item.value_type === 'constant') {
        acc.push({
          position: index === 0 ? 0 : 1,
          value_type: item.value_type,
          value: item.value_type === 'constant' ? Number(item.value) : item.value_type
        })
      }
      return acc
    }, [])
  }
  console.log('outputCf: ', outputCf)
  console.log('nestedObj: ', nestedObj)
  // this.tree = nestedObj
  // this.cfData = outputCf
  return outputCf
}

// support functions for createCfData
function filterCloseBlocks(formula: ArithmeticFormulaElement[]) {
  return formula.filter(item => item?.block !== 'close')
}

function checkLeftOvers(leftOvers: any, possibleParent: any) {
  for (let i = 0; i < leftOvers.length; i++) {
    if (leftOvers[i].parentId === possibleParent.id) {
      possibleParent.children ? possibleParent.children.push(leftOvers[i]) : possibleParent.children = [leftOvers[i]]
      possibleParent.count = possibleParent.children.length
      const addedObj = leftOvers.splice(i, 1)
      checkLeftOvers(leftOvers, addedObj[0])
    }
  }
}

function findParent(possibleParents: any, possibleChild: any): any {
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
function nestedObjectNormalize(nestedObject: any, nestedIndex = 0, nestLevel = 0, omitKeys = false) {
  nestedObject.map((nestItem: any, index: any) => {
    if (nestItem.block) {
      let treePosition = 0
      const childTreeItems = nestItem.children.reduce((acc: {operator: any, operands: any}, child: any) => {
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
      nestItem.value.operands = childTreeItems.operands
      nestItem.value.operation = childTreeItems.operator.value

      nestItem.position = index === 2 ? 1 : 0
      nestItem.value_type = 'calculated_field_formula'
    }
    else {
      if (nestItem.root) {
        if (['constant', 'object_attribute'].includes(nestItem.value_type)) {
          if (nestItem.value_type === 'constant') nestItem.value = Number(nestItem.value)
          nestItem.position = index === 0 ? 0 : index === 2 ? 1 : undefined
        }
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

// remove extra block that is wrapping entire formula -- not needed
export function removeContainingBlock(formulaData: ArithmeticFormulaElement[]): any {
  // formulaData = cloneDeep(formulaData)
  if (formulaData[0].block && formulaData[formulaData.length - 1].block) {
    const parentId = formulaData[0].id

    formulaData.forEach((item: ArithmeticFormulaElement, i) => {
      if (i !== 0 && i !== formulaData.length - 1 && item.parentId === parentId) {
        item.parentId = '0'
      }
      return item
    })

    formulaData.shift()
    formulaData.pop()

  }
  if (formulaData[0].block && formulaData[formulaData.length - 1].block) {
    return removeContainingBlock(formulaData)
  }
  else {
    return formulaData
  }
}