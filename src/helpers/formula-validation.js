import { parse, evaluate } from 'mathjs'
import { operators } from '../constants'
import { objectAttributeLabelById } from '../helpers/object-attributes'

export function getFormulaString(formula, formulaPreviewType, objectAttributes = []) {
  let randomValue = 1
  return formula.reduce((acc, item) => {
    if (item.valueType === 'operator') {
      const operator = operators.find(op => op.value === item.value)
      acc += `${operator.symbol ? operator.symbol : operator.label}`
    }
    else if (item.valueType === 'constant' || (item.valueType === 'object_attribute' && formulaPreviewType === 'Field Names')) {
      if (item.valueType === 'object_attribute') {
        acc += objectAttributeLabelById(item.value, objectAttributes)
      }
      else {
        acc += item.value
      }
    }
    else {
      acc += item.valueType === 'object_attribute' ? item.previewValue ?? randomValue : randomValue
      randomValue++
    }
    return acc
  }, '')
}
export function getFormulaExample(formulaString, formulaPreviewType) {
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

// const formulaMeta = createFormulaMeta(formula)
// console.log('formulaMeta: ', formulaMeta)
let cfDataErrors: {id: string, message: string}[] = []
let calculatedFieldFormulaCount = 0
export function createFormulaMeta(data: ArithmeticFormulaElement[]): {cfData: CfFormula} {
  cfDataErrors = []
  calculatedFieldFormulaCount = 0
  const requestData = createRequestData1(data)
  console.log('cfDataErrors/calculatedFieldFormulaCount: ', [cfDataErrors, calculatedFieldFormulaCount, requestData])
  return {
    calculatedFieldFormulaCount,
    cfDataErrors,
    cfData: requestData
  }
}

export function createRequestData1(
  data: ArithmeticFormulaElement[]
): CfFormula | { errors: string[] } {
  const result: CfFormula = {
    operation: '',
    operands: [],
    query: [],
  }
  data = removeExtraParentheses(data)

  // 3 array items may mean there is valid formula data
  if (data?.length === 3) {
    const blocksCount = data.filter((item: ArithmeticFormulaElement) => item.block)?.length

    // Both right/left operands are blocks but in the wrong positions
    if (blocksCount > 1 && (!data[0].block || !data[2].block)) {
      console.log('data: ', data)
      cfDataErrors.push({id: '0', message:  'operator/operands order mismatch'})
    }
    // both left and right are blocks in correct positions
    else if (blocksCount > 1 && (data[0].block || data[2].block)) {
      calculatedFieldFormulaCount+=2
      result.operands = Array.from({ length: 2 })
      result.operands[0] = {
        position: 0,
        value: createRequestData1(data[0].children as ArithmeticFormulaElement[]),
      value_type: 'calculated_field_formula',
    }
      result.operands[1] = {
        position: 1,
        value: createRequestData1(data[2].children as ArithmeticFormulaElement[]),
      value_type: 'calculated_field_formula',
    }
      result.operation = data[1]?.value as string
    }

    // Items in root and one block
    else {
      const constantItemIndex: number | undefined = data.findIndex(
        (item: ArithmeticFormulaElement): boolean =>
        !item.block && ['constant', 'object_attribute'].includes(item.valueType)
    )

      const operatorItemIndex: number | undefined = data.findIndex(
        (item: ArithmeticFormulaElement): boolean => !item.block && item.valueType === 'operator'
    )
      const constantItem = data[constantItemIndex]

      const blockItemIndex: number | undefined = data.findIndex(
        (item: ArithmeticFormulaElement): string | undefined => item.block
    )
      const blockItem: ArithmeticFormulaElement = data[blockItemIndex]

      if (blockItem) {
        // () 1 + or + 1 () order mismatch
        if (
          blockItemIndex === 1 ||
          (blockItemIndex === 0 && operatorItemIndex === 2) ||
          (blockItemIndex === 2 && operatorItemIndex === 0)
        ) {
          cfDataErrors.push({id: '0', message: 'Block right/left Operator/operand order mismatch'})
        }
        else {
          calculatedFieldFormulaCount++
          const blockOperatorIndex = blockItem?.children?.findIndex(
            (child) => !child.block && child.valueType === 'operator'
          )
          const blockChildrenOperators =
            blockItem?.children?.filter((child) => !child.block && child.valueType === 'operator') ?? []
          const blockChildrenValues =
            blockItem?.children?.filter((child) =>
              ['constant', 'object_attribute'].includes(child.valueType)
            ) ?? []

          if (blockChildrenOperators.length > 1 || blockChildrenValues.length > 2) {
            cfDataErrors.push({id: '0', message: 'Invalid number of items inside parentheses'})
          } else if (blockOperatorIndex !== 1) {
            cfDataErrors.push({id: '0', message: 'Parentheses operator/operand order mismatch'})
          } else {
            result.operands = Array.from({ length: 2 })
            result.operands[blockItemIndex === 0 ? 0 : 1] = {
              position: blockItemIndex === 0 ? 0 : 1,
              value: blockItem?.children?.length
                ? createRequestData1(blockItem.children as ArithmeticFormulaElement[])
          : '',
              value_type: 'calculated_field_formula',
          }
            result.operands[constantItemIndex === 0 ? 0 : 1] = {
              position: constantItemIndex === 0 ? 0 : 1,
              value:
                constantItem?.valueType === 'constant' ? Number(constantItem?.value) : constantItem?.value,
              value_type: constantItem?.valueType,
            }
            result.operation = data[operatorItemIndex]?.value as string
          }
        }
      }
      else {
        if (operatorItemIndex !== 1) {
          cfDataErrors.push({id: '0', message: 'Non-block Operator/operand order mismatch'})
        }
        else {
          result.operands = Array.from({ length: 2 })
          result.operation = data[operatorItemIndex].value as string
          data.forEach((item: ArithmeticFormulaElement, index: number) => {
            if (index !== operatorItemIndex) {
              const dataItemIndex = index === 0 ? 0 : 2
              result.operands[index === 0 ? 0 : 1] = {
                position: index === 0 ? 0 : 1,
                value:
                  data[dataItemIndex].valueType === 'constant'
                    ? Number(data[dataItemIndex].value)
                    : data[index === 0 ? 0 : 2].value,
                value_type: data[dataItemIndex].valueType,
              }
            }
          })
        }
      }
    }
  }
  else {
    // fewer than 3 array items
    cfDataErrors.push({id: '0', message: 'Missing operators/operands'})
  }
  return result
}