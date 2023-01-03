
export interface ArithmeticFormulaOperator {
    iconName?: string
    showInList?: boolean
    symbol?: string
    label: string
    pemdasNumber: number
    value: string
    valueType: string
}
type FormulaValueType = 'block' | 'object_attribute' | 'constant' | 'operator' | 'calculated_field_formula'

export interface ArithmeticFormulaElement {
    backgroundColor?: string
    block?: string
    blockGroupId?: string
    children?: ArithmeticFormulaElement[]
    index?: number
    previewValue?: number,
    id: string
    parentId: string
    value: string | number
    valueType: FormulaValueType
}

export interface ArithmeticFormulaCfData extends ArithmeticFormulaItem {
    value: string | number
    value_type: FormulaValueType
}